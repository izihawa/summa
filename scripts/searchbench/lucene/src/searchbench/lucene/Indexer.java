package searchbench.lucene;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Stream;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.SortedDocValuesField;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.CodecReader;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.misc.index.BPIndexReorderer;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.BytesRef;

/** Builds one force-merged, deletion-free segment from the Searchbench NDJSON corpus. */
final class Indexer {
  private static final int BATCH = 512;
  private static final List<String> END = List.of();

  private Indexer() {}

  record Options(int threads, double ramBufferMb, boolean bp, double bpRamMb) {}

  static void build(Path index, Path corpus, Options options) throws Exception {
    if (Files.exists(index)) {
      throw new IllegalArgumentException("output index already exists: " + index);
    }
    long started = System.nanoTime();
    Path plain = options.bp() ? index.resolveSibling(index.getFileName() + ".plain-staging") : index;
    if (Files.exists(plain)) {
      throw new IllegalArgumentException("staging directory already exists: " + plain);
    }
    long count;
    try (Directory directory = FSDirectory.open(plain);
        IndexWriter writer = new IndexWriter(directory, config(options.ramBufferMb()))) {
      count = feed(writer, corpus, options.threads());
      writer.commit();
      System.err.printf("fed %d documents in %.1fs; force merging%n", count, seconds(started));
      writer.forceMerge(1);
      writer.setLiveCommitData(Map.of(Posture.REORDER_KEY, "none").entrySet());
      writer.commit();
    }
    if (options.bp()) {
      reorder(plain, index, options);
      deleteTree(plain);
    }
    try (Directory directory = FSDirectory.open(index);
        DirectoryReader reader = DirectoryReader.open(directory)) {
      if (reader.leaves().size() != 1 || reader.numDocs() != count || reader.hasDeletions()) {
        throw new IllegalStateException(
            "expected one deletion-free segment of " + count + " docs, found "
                + reader.leaves().size() + " segments / " + reader.numDocs() + " docs");
      }
    }
    System.err.printf(
        "committed %d documents in one segment (%s) in %.1fs%n",
        count, options.bp() ? "BP reordered" : "insertion order", seconds(started));
  }

  private static IndexWriterConfig config(double ramBufferMb) {
    IndexWriterConfig config = new IndexWriterConfig(Posture.analyzer());
    config.setSimilarity(Posture.similarity());
    config.setOpenMode(IndexWriterConfig.OpenMode.CREATE);
    config.setRAMBufferSizeMB(ramBufferMb);
    return config;
  }

  /** One reader thread batches lines; {@code threads} workers parse and add them. */
  private static long feed(IndexWriter writer, Path corpus, int threads) throws Exception {
    BlockingQueue<List<String>> queue = new ArrayBlockingQueue<>(threads * 4);
    AtomicReference<Throwable> failure = new AtomicReference<>();
    AtomicLong added = new AtomicLong();
    List<Thread> workers = new ArrayList<>();
    for (int i = 0; i < threads; i++) {
      Thread worker =
          new Thread(
              () -> {
                try {
                  while (true) {
                    List<String> batch = queue.take();
                    if (batch == END) {
                      return;
                    }
                    for (String line : batch) {
                      writer.addDocument(document(line));
                    }
                    long total = added.addAndGet(batch.size());
                    if (total / 1_000_000 != (total - batch.size()) / 1_000_000) {
                      System.err.printf("indexed %d%n", total / 1_000_000 * 1_000_000);
                    }
                  }
                } catch (Throwable t) {
                  failure.compareAndSet(null, t);
                  queue.clear();
                }
              },
              "index-" + i);
      worker.start();
      workers.add(worker);
    }
    long lines = 0;
    try (BufferedReader reader = Files.newBufferedReader(corpus, StandardCharsets.UTF_8)) {
      List<String> batch = new ArrayList<>(BATCH);
      for (String line = reader.readLine(); line != null; line = reader.readLine()) {
        lines++;
        batch.add(line);
        if (batch.size() == BATCH) {
          if (!offer(queue, batch, failure)) {
            break;
          }
          batch = new ArrayList<>(BATCH);
        }
      }
      if (!batch.isEmpty()) {
        offer(queue, batch, failure);
      }
    } finally {
      for (int i = 0; i < threads; i++) {
        while (!queue.offer(END, 100, TimeUnit.MILLISECONDS)) {
          if (failure.get() != null) {
            queue.clear();
          }
        }
      }
      for (Thread worker : workers) {
        worker.join();
      }
    }
    if (failure.get() != null) {
      throw new IllegalStateException("indexing failed", failure.get());
    }
    if (added.get() != lines) {
      throw new IllegalStateException("added " + added.get() + " of " + lines + " rows");
    }
    return lines;
  }

  private static boolean offer(
      BlockingQueue<List<String>> queue, List<String> batch, AtomicReference<Throwable> failure)
      throws InterruptedException {
    while (!queue.offer(batch, 100, TimeUnit.MILLISECONDS)) {
      if (failure.get() != null) {
        return false;
      }
    }
    return failure.get() == null;
  }

  static Document document(String line) {
    Map<String, Object> row = FlatJson.parseObject(line);
    String id = null;
    String body = null;
    for (Map.Entry<String, Object> field : row.entrySet()) {
      switch (field.getKey()) {
        case Posture.ID -> id = requireString(field);
        case Posture.BODY -> body = requireString(field);
        default -> {
          if (!Posture.IGNORED_CORPUS_FIELDS.contains(field.getKey())) {
            throw new IllegalArgumentException("unknown corpus field " + field.getKey());
          }
        }
      }
    }
    if (id == null || body == null) {
      throw new IllegalArgumentException("corpus row requires string id and body");
    }
    Document document = new Document();
    // Mirrors the REST `keyword` id: indexed term plus doc values for hit projection.
    document.add(new StringField(Posture.ID, id, Field.Store.NO));
    document.add(new SortedDocValuesField(Posture.ID, new BytesRef(id)));
    // Mirrors the REST `text` body: docs, freqs, positions and norms; no stored copy
    // (Searchbench disables _source).
    document.add(new TextField(Posture.BODY, body, Field.Store.NO));
    return document;
  }

  private static String requireString(Map.Entry<String, Object> field) {
    if (!(field.getValue() instanceof String value)) {
      throw new IllegalArgumentException("corpus field " + field.getKey() + " must be a string");
    }
    return value;
  }

  /**
   * Recursive graph bisection over {@code body} postings (Lucene's analogue of Summa
   * RGB), applied once to the merged segment and written out as a single new segment.
   */
  private static void reorder(Path plain, Path index, Options options) throws Exception {
    long started = System.nanoTime();
    System.err.println("starting BP reorder");
    ForkJoinPool pool = new ForkJoinPool(options.threads());
    try (Directory source = FSDirectory.open(plain);
        DirectoryReader reader = DirectoryReader.open(source);
        Directory target = FSDirectory.open(index);
        IndexWriter writer = new IndexWriter(target, config(options.ramBufferMb()))) {
      BPIndexReorderer reorderer = new BPIndexReorderer();
      reorderer.setFields(Set.of(Posture.BODY));
      reorderer.setRAMBudgetMB(options.bpRamMb());
      CodecReader merged = (CodecReader) reader.leaves().get(0).reader();
      CodecReader reordered = reorderer.reorder(merged, source, pool);
      writer.addIndexes(reordered);
      writer.forceMerge(1);
      writer.setLiveCommitData(Map.of(Posture.REORDER_KEY, "bp").entrySet());
      writer.commit();
    } finally {
      pool.shutdown();
    }
    System.err.printf("finished BP reorder in %.1fs%n", seconds(started));
  }

  private static void deleteTree(Path root) throws IOException {
    try (Stream<Path> paths = Files.walk(root)) {
      for (Path path : paths.sorted(Comparator.reverseOrder()).toList()) {
        Files.delete(path);
      }
    }
  }

  private static double seconds(long started) {
    return (System.nanoTime() - started) / 1e9;
  }
}
