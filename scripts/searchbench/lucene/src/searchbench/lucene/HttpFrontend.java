package searchbench.lucene;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.lucene.search.Query;

/**
 * Benchmark-only HTTP/1.1 frontend speaking the wire shape of Summa's
 * {@code searchbench_http} example, so campaign.py drives both with one adapter:
 *
 * <pre>
 * POST /search {"query": str, "class": str, "limit": 0|10|100}
 *   -> {"docs":[{"id":...}]}  or, when limit is 0,  {"docs":[],"found":N}
 *   -> 400 {"error": ...}
 * GET /stats  -> {"documents": N, "segments": [{...}], ...}
 * GET /health -> ok
 * </pre>
 *
 * One blocking reader thread per keep-alive connection parses requests and hands each
 * search to a fixed pool of {@code workers} threads (Summa's default "pool" dispatch).
 * Only Content-Length bodies are accepted; loopback only.
 */
final class HttpFrontend {
  private static final int MAX_BODY = 16 * 1024;
  private static final int MAX_HEADER_LINE = 8 * 1024;
  private static final int MAX_HEADERS = 64;
  private static final int MAX_QUERY_BYTES = 4096;

  private final Searcher searcher;
  private final ExecutorService pool;
  private final Semaphore connections;

  HttpFrontend(Searcher searcher, int workers, int maxConnections) {
    this.searcher = searcher;
    AtomicInteger ids = new AtomicInteger();
    this.pool =
        Executors.newFixedThreadPool(
            workers,
            task -> {
              Thread thread = new Thread(task, "search-" + ids.getAndIncrement());
              thread.setDaemon(true);
              return thread;
            });
    this.connections = new Semaphore(maxConnections);
  }

  void serve(int port) throws IOException {
    AtomicInteger ids = new AtomicInteger();
    try (ServerSocket server = new ServerSocket(port, 1024, InetAddress.getLoopbackAddress())) {
      Runtime.getRuntime().addShutdownHook(new Thread(() -> closeQuietly(server)));
      System.err.println("benchmark HTTP listening on 127.0.0.1:" + port);
      while (!server.isClosed()) {
        Socket socket;
        try {
          socket = server.accept();
        } catch (IOException e) {
          if (server.isClosed()) {
            return;
          }
          throw e;
        }
        if (!connections.tryAcquire()) {
          closeQuietly(socket);
          continue;
        }
        Thread thread =
            new Thread(
                () -> {
                  try {
                    connection(socket);
                  } finally {
                    connections.release();
                    closeQuietly(socket);
                  }
                },
                "http-" + ids.getAndIncrement());
        thread.setDaemon(true);
        thread.start();
      }
    } finally {
      pool.shutdown();
    }
  }

  private record Response(int status, byte[] body, String contentType) {
    static Response json(int status, String body) {
      return new Response(status, body.getBytes(StandardCharsets.UTF_8), "application/json");
    }

    static Response error(int status, String message) {
      StringBuilder out = new StringBuilder("{\"error\":");
      FlatJson.appendString(out, message == null ? "error" : message);
      return json(status, out.append('}').toString());
    }
  }

  private void connection(Socket socket) {
    try {
      socket.setTcpNoDelay(true);
      InputStream in = new BufferedInputStream(socket.getInputStream(), 16 * 1024);
      OutputStream out = socket.getOutputStream();
      while (true) {
        String requestLine = line(in, true);
        if (requestLine == null) {
          return;
        }
        String[] parts = requestLine.split(" ");
        if (parts.length != 3 || !parts[2].startsWith("HTTP/1.")) {
          write(out, Response.error(400, "malformed request line"), true);
          return;
        }
        boolean close = parts[2].equals("HTTP/1.0");
        int length = 0;
        for (int headers = 0; ; headers++) {
          String header = line(in, false);
          if (header.isEmpty()) {
            break;
          }
          if (headers == MAX_HEADERS) {
            write(out, Response.error(431, "too many headers"), true);
            return;
          }
          int colon = header.indexOf(':');
          if (colon <= 0) {
            write(out, Response.error(400, "malformed header"), true);
            return;
          }
          String name = header.substring(0, colon).trim().toLowerCase();
          String value = header.substring(colon + 1).trim();
          switch (name) {
            case "content-length" -> {
              try {
                length = Integer.parseInt(value);
              } catch (NumberFormatException e) {
                length = -1;
              }
            }
            case "connection" -> close = value.equalsIgnoreCase("close")
                || (close && !value.equalsIgnoreCase("keep-alive"));
            case "transfer-encoding", "expect" -> {
              write(out, Response.error(400, name + " is not supported"), true);
              return;
            }
            default -> {}
          }
        }
        if (length < 0 || length > MAX_BODY) {
          write(out, Response.error(413, "body must be at most " + MAX_BODY + " bytes"), true);
          return;
        }
        byte[] body = in.readNBytes(length);
        if (body.length != length) {
          return;
        }
        write(out, route(parts[0], parts[1], body), close);
        if (close) {
          return;
        }
      }
    } catch (IOException e) {
      // Client disconnects end the connection; nothing to report.
    }
  }

  private Response route(String method, String path, byte[] body) {
    switch (path) {
      case "/search" -> {
        if (!method.equals("POST")) {
          return Response.error(405, "use POST");
        }
        Future<Response> result = pool.submit(() -> search(body));
        try {
          return result.get();
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
          return Response.error(500, "interrupted");
        } catch (ExecutionException e) {
          return Response.error(500, String.valueOf(e.getCause()));
        }
      }
      case "/stats" -> {
        return method.equals("GET")
            ? Response.json(200, searcher.stats())
            : Response.error(405, "use GET");
      }
      case "/health" -> {
        return method.equals("GET")
            ? new Response(200, "ok".getBytes(StandardCharsets.US_ASCII), "text/plain")
            : Response.error(405, "use GET");
      }
      default -> {
        return Response.error(404, "not found");
      }
    }
  }

  /** Runs on a search worker: decode, validate, execute and encode. */
  private Response search(byte[] body) {
    try {
      Map<String, Object> envelope = FlatJson.parseObject(new String(body, StandardCharsets.UTF_8));
      if (!(envelope.get("query") instanceof String text)) {
        return Response.error(400, "missing query");
      }
      if (!(envelope.get("class") instanceof String queryClass)) {
        return Response.error(400, "missing class");
      }
      if (text.getBytes(StandardCharsets.UTF_8).length > MAX_QUERY_BYTES) {
        return Response.error(400, "query exceeds 4096 bytes");
      }
      if (!(envelope.get("limit") instanceof Long limit) || limit < 0) {
        return Response.error(400, "missing limit");
      }
      if (limit != 0 && limit != 10 && limit != 100) {
        return Response.error(400, "limit must be 0 (exact count), 10, or 100");
      }
      Query query = searcher.parse(text, queryClass);
      if (limit == 0) {
        return Response.json(200, "{\"docs\":[],\"found\":" + searcher.count(query) + "}");
      }
      String[] ids = searcher.top(query, limit.intValue());
      StringBuilder out = new StringBuilder(16 + ids.length * 24).append("{\"docs\":[");
      for (int i = 0; i < ids.length; i++) {
        out.append(i == 0 ? "{\"id\":" : ",{\"id\":");
        FlatJson.appendString(out, ids[i]);
        out.append('}');
      }
      return Response.json(200, out.append("]}").toString());
    } catch (RuntimeException | IOException e) {
      // Includes parse errors and IndexSearcher.TooManyClauses: reported, never empty.
      return Response.error(400, e.getMessage() == null ? e.toString() : e.getMessage());
    }
  }

  private static void write(OutputStream out, Response response, boolean close)
      throws IOException {
    String head =
        "HTTP/1.1 " + response.status() + " " + reason(response.status()) + "\r\n"
            + "Content-Type: " + response.contentType() + "\r\n"
            + "Content-Length: " + response.body().length + "\r\n"
            + (close ? "Connection: close\r\n" : "")
            + "\r\n";
    byte[] headBytes = head.getBytes(StandardCharsets.US_ASCII);
    byte[] message = new byte[headBytes.length + response.body().length];
    System.arraycopy(headBytes, 0, message, 0, headBytes.length);
    System.arraycopy(response.body(), 0, message, headBytes.length, response.body().length);
    out.write(message);
    out.flush();
  }

  private static String reason(int status) {
    return switch (status) {
      case 200 -> "OK";
      case 400 -> "Bad Request";
      case 404 -> "Not Found";
      case 405 -> "Method Not Allowed";
      case 413 -> "Content Too Large";
      case 431 -> "Request Header Fields Too Large";
      default -> "Internal Server Error";
    };
  }

  /** Reads one CRLF-terminated ASCII line; null only at a clean EOF before a request. */
  private static String line(InputStream in, boolean startOfRequest) throws IOException {
    ByteArrayOutputStream buffer = new ByteArrayOutputStream(128);
    while (true) {
      int b = in.read();
      if (b < 0) {
        if (startOfRequest && buffer.size() == 0) {
          return null;
        }
        throw new IOException("unexpected end of request");
      }
      if (b == '\n') {
        byte[] bytes = buffer.toByteArray();
        int end = bytes.length > 0 && bytes[bytes.length - 1] == '\r' ? bytes.length - 1 : bytes.length;
        return new String(bytes, 0, end, StandardCharsets.ISO_8859_1);
      }
      if (buffer.size() == MAX_HEADER_LINE) {
        throw new IOException("header line too long");
      }
      buffer.write(b);
    }
  }

  private static void closeQuietly(AutoCloseable closeable) {
    try {
      closeable.close();
    } catch (Exception e) {
      // Shutdown path.
    }
  }
}
