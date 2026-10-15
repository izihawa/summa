package searchbench.lucene;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.lucene.util.Version;

/** Raw-Lucene Searchbench adapter: index build and benchmark HTTP server. */
public final class Main {
  private static final String USAGE =
      """
      usage:
        index INDEX CORPUS.jsonl [--threads N] [--ram-buffer-mb MB] [--bp] [--bp-ram-mb MB]
        serve INDEX PORT [--workers N] [--max-connections N]""";

  private Main() {}

  public static void main(String[] args) throws Exception {
    if (args.length < 3) {
      fail("missing arguments");
    }
    List<String> positional = new ArrayList<>();
    Map<String, String> flags = new HashMap<>();
    for (int i = 1; i < args.length; i++) {
      String arg = args[i];
      if (arg.equals("--bp")) {
        flags.put("bp", "true");
      } else if (arg.startsWith("--")) {
        if (i + 1 == args.length) {
          fail(arg + " requires a value");
        }
        flags.put(arg.substring(2), args[++i]);
      } else {
        positional.add(arg);
      }
    }
    if (positional.size() != 2) {
      fail("expected exactly two positional arguments");
    }
    System.err.println("lucene " + Version.LATEST + "; java " + Runtime.version()
        + "; available CPUs " + Runtime.getRuntime().availableProcessors());
    switch (args[0]) {
      case "index" -> {
        Indexer.Options options =
            new Indexer.Options(
                intFlag(flags, "threads", 8, 1, 256),
                doubleFlag(flags, "ram-buffer-mb", 1024),
                flags.remove("bp") != null,
                doubleFlag(flags, "bp-ram-mb", 4096));
        rejectUnknown(flags);
        System.err.println("index options: " + options);
        Indexer.build(Path.of(positional.get(0)), Path.of(positional.get(1)), options);
      }
      case "serve" -> {
        int workers = intFlag(flags, "workers", 8, 1, 256);
        int maxConnections = intFlag(flags, "max-connections", 256, 1, 4096);
        rejectUnknown(flags);
        int port = Integer.parseInt(positional.get(1));
        System.err.println("search workers: " + workers + "; max connections: " + maxConnections);
        try (Searcher searcher = new Searcher(Path.of(positional.get(0)))) {
          System.err.println(searcher.stats());
          new HttpFrontend(searcher, workers, maxConnections).serve(port);
        }
      }
      default -> fail("unknown operation " + args[0]);
    }
  }

  private static int intFlag(Map<String, String> flags, String name, int fallback, int min, int max) {
    String value = flags.remove(name);
    int parsed = value == null ? fallback : Integer.parseInt(value);
    if (parsed < min || parsed > max) {
      fail("--" + name + " must be " + min + ".." + max);
    }
    return parsed;
  }

  private static double doubleFlag(Map<String, String> flags, String name, double fallback) {
    String value = flags.remove(name);
    double parsed = value == null ? fallback : Double.parseDouble(value);
    if (!(parsed > 0)) {
      fail("--" + name + " must be positive");
    }
    return parsed;
  }

  private static void rejectUnknown(Map<String, String> flags) {
    if (!flags.isEmpty()) {
      fail("unknown or inapplicable flags: " + flags.keySet());
    }
  }

  private static void fail(String message) {
    System.err.println(message + "\n" + USAGE);
    System.exit(2);
  }
}
