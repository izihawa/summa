package searchbench.lucene;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Set;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.LeafReader;
import org.apache.lucene.index.SegmentReader;
import org.apache.lucene.index.SortedDocValues;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.RegexpQuery;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.TopScoreDocCollectorManager;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.BytesRef;
import org.apache.lucene.util.Version;

/** Executes the benchmark envelope against one deletion-free segment. */
final class Searcher implements AutoCloseable {
  /** Searchbench's primary full-text classes; anything else is rejected like Summa does. */
  static final Set<String> CLASSES =
      Set.of(
          "high_term", "med_term", "low_term", "and_high_high", "and_high_med", "and_high_low",
          "or_high_high", "or_high_med", "or_high_low", "high_phrase", "med_phrase",
          "low_phrase", "high_sloppy_phrase", "med_sloppy_phrase", "low_sloppy_phrase",
          "prefix3", "wildcard", "wildcard_scan", "wildcard_lead", "regex");

  private final DirectoryReader reader;
  private final IndexSearcher searcher;
  private final LeafReader leaf;
  private final String reorder;
  private final ThreadLocal<QueryParser> parsers;

  Searcher(Path path) throws IOException {
    reader = DirectoryReader.open(FSDirectory.open(path));
    if (reader.leaves().size() != 1 || reader.hasDeletions()) {
      reader.close();
      throw new IllegalStateException("requires one deletion-free segment");
    }
    leaf = reader.leaves().get(0).reader();
    reorder = reader.getIndexCommit().getUserData().getOrDefault(Posture.REORDER_KEY, "unknown");
    // No executor: each request runs serially on its worker thread, like a
    // single-shard Elasticsearch search and Summa's one-segment path.
    searcher = new IndexSearcher(reader);
    searcher.setSimilarity(Posture.similarity());
    // Repeated replay of the same queries must not be answered from a result cache.
    searcher.setQueryCache(null);
    parsers =
        ThreadLocal.withInitial(
            () -> {
              QueryParser parser = new QueryParser(Posture.BODY, Posture.analyzer());
              parser.setDefaultOperator(QueryParser.Operator.OR);
              parser.setAllowLeadingWildcard(true);
              return parser;
            });
  }

  /**
   * Mirrors Searchbench's {@code rest_query_clause}: Elasticsearch {@code query_string}
   * (classic Lucene syntax, default field body, default operator OR, leading wildcards
   * allowed) for every class except {@code regex}, which is a structured RegexpQuery.
   */
  Query parse(String text, String queryClass) {
    if (!CLASSES.contains(queryClass)) {
      throw new IllegalArgumentException("unsupported query class: " + queryClass);
    }
    if (queryClass.equals("regex")) {
      return new RegexpQuery(new Term(Posture.BODY, text));
    }
    try {
      return parsers.get().parse(text);
    } catch (ParseException e) {
      throw new IllegalArgumentException(e.getMessage(), e);
    }
  }

  long count(Query query) throws IOException {
    return searcher.count(query);
  }

  /** Top-k without a total; {@code totalHitsThreshold = k} lets dynamic pruning engage. */
  String[] top(Query query, int limit) throws IOException {
    TopDocs top = searcher.search(query, new TopScoreDocCollectorManager(limit, null, limit));
    ScoreDoc[] hits = top.scoreDocs;
    // Doc values are forward-only iterators: read IDs in doc order, return in rank order.
    Integer[] order = new Integer[hits.length];
    for (int i = 0; i < order.length; i++) {
      order[i] = i;
    }
    Arrays.sort(order, (a, b) -> Integer.compare(hits[a].doc, hits[b].doc));
    SortedDocValues ids = leaf.getSortedDocValues(Posture.ID);
    String[] result = new String[hits.length];
    for (int index : order) {
      if (ids == null || !ids.advanceExact(hits[index].doc)) {
        throw new IllegalStateException("missing corpus id");
      }
      BytesRef id = ids.lookupOrd(ids.ordValue());
      result[index] = new String(id.bytes, id.offset, id.length, StandardCharsets.UTF_8);
    }
    return result;
  }

  String stats() {
    StringBuilder out = new StringBuilder("{\"engine\":\"lucene-benchmark-http\"");
    out.append(",\"lucene_version\":\"").append(Version.LATEST).append('"');
    out.append(",\"analyzer\":\"StandardAnalyzer(stopwords=none,max_token_length=255)\"");
    out.append(",\"similarity\":");
    FlatJson.appendString(out, searcher.getSimilarity().toString());
    out.append(",\"documents\":").append(reader.numDocs());
    out.append(",\"segments\":[{\"id\":");
    FlatJson.appendString(
        out, leaf instanceof SegmentReader segment ? segment.getSegmentName() : leaf.toString());
    out.append(",\"documents\":").append(leaf.numDocs());
    out.append(",\"body_reordered\":").append(reorder.equals("bp"));
    out.append(",\"reorder\":");
    FlatJson.appendString(out, reorder);
    return out.append("}]}").toString();
  }

  @Override
  public void close() throws IOException {
    reader.close();
  }
}
