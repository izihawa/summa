package searchbench.lucene;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Strict parser for the flat JSON objects this benchmark exchanges: corpus rows and
 * search envelopes. Values are strings, numbers, booleans or null; nested values are
 * rejected rather than skipped so a changed corpus shape fails loudly.
 */
final class FlatJson {
  private final String text;
  private int pos;

  private FlatJson(String text) {
    this.text = text;
  }

  /** Strings map to {@link String}, numbers to {@link Long} or {@link Double}. */
  static Map<String, Object> parseObject(String text) {
    FlatJson parser = new FlatJson(text);
    parser.skipSpace();
    parser.expect('{');
    Map<String, Object> result = new LinkedHashMap<>();
    parser.skipSpace();
    if (parser.peek() == '}') {
      parser.pos++;
    } else {
      while (true) {
        parser.skipSpace();
        String name = parser.string();
        parser.skipSpace();
        parser.expect(':');
        parser.skipSpace();
        if (result.put(name, parser.value()) != null) {
          throw new IllegalArgumentException("duplicate field " + name);
        }
        parser.skipSpace();
        char next = parser.next();
        if (next == '}') {
          break;
        }
        if (next != ',') {
          throw parser.error("expected ',' or '}'");
        }
      }
    }
    parser.skipSpace();
    if (parser.pos != text.length()) {
      throw parser.error("trailing characters");
    }
    return result;
  }

  static void appendString(StringBuilder out, String value) {
    out.append('"');
    for (int i = 0; i < value.length(); i++) {
      char c = value.charAt(i);
      switch (c) {
        case '"' -> out.append("\\\"");
        case '\\' -> out.append("\\\\");
        case '\n' -> out.append("\\n");
        case '\r' -> out.append("\\r");
        case '\t' -> out.append("\\t");
        default -> {
          if (c < 0x20) {
            out.append(String.format("\\u%04x", (int) c));
          } else {
            out.append(c);
          }
        }
      }
    }
    out.append('"');
  }

  private Object value() {
    char c = peek();
    if (c == '"') {
      return string();
    }
    if (c == '-' || (c >= '0' && c <= '9')) {
      return number();
    }
    if (text.startsWith("true", pos)) {
      pos += 4;
      return Boolean.TRUE;
    }
    if (text.startsWith("false", pos)) {
      pos += 5;
      return Boolean.FALSE;
    }
    if (text.startsWith("null", pos)) {
      pos += 4;
      return null;
    }
    throw error("unsupported value (only flat objects are accepted)");
  }

  private Object number() {
    int start = pos;
    boolean fractional = false;
    while (pos < text.length()) {
      char c = text.charAt(pos);
      if (c == '.' || c == 'e' || c == 'E') {
        fractional = true;
      } else if (!(c == '-' || c == '+' || (c >= '0' && c <= '9'))) {
        break;
      }
      pos++;
    }
    String literal = text.substring(start, pos);
    try {
      return fractional ? (Object) Double.parseDouble(literal) : (Object) Long.parseLong(literal);
    } catch (NumberFormatException e) {
      throw error("invalid number " + literal);
    }
  }

  private String string() {
    expect('"');
    StringBuilder out = null;
    int start = pos;
    while (true) {
      if (pos >= text.length()) {
        throw error("unterminated string");
      }
      char c = text.charAt(pos);
      if (c == '"') {
        String result =
            out == null ? text.substring(start, pos) : out.append(text, start, pos).toString();
        pos++;
        return result;
      }
      if (c < 0x20) {
        throw error("control character in string");
      }
      if (c != '\\') {
        pos++;
        continue;
      }
      if (out == null) {
        out = new StringBuilder();
      }
      out.append(text, start, pos);
      pos++;
      char escape = next();
      switch (escape) {
        case '"', '\\', '/' -> out.append(escape);
        case 'b' -> out.append('\b');
        case 'f' -> out.append('\f');
        case 'n' -> out.append('\n');
        case 'r' -> out.append('\r');
        case 't' -> out.append('\t');
        case 'u' -> {
          if (pos + 4 > text.length()) {
            throw error("truncated unicode escape");
          }
          try {
            out.append((char) Integer.parseInt(text.substring(pos, pos + 4), 16));
          } catch (NumberFormatException e) {
            throw error("invalid unicode escape");
          }
          pos += 4;
        }
        default -> throw error("invalid escape");
      }
      start = pos;
    }
  }

  private void skipSpace() {
    while (pos < text.length()) {
      char c = text.charAt(pos);
      if (c != ' ' && c != '\t' && c != '\n' && c != '\r') {
        return;
      }
      pos++;
    }
  }

  private char peek() {
    if (pos >= text.length()) {
      throw error("unexpected end of input");
    }
    return text.charAt(pos);
  }

  private char next() {
    char c = peek();
    pos++;
    return c;
  }

  private void expect(char c) {
    if (next() != c) {
      throw error("expected '" + c + "'");
    }
  }

  private IllegalArgumentException error(String message) {
    return new IllegalArgumentException("invalid JSON at offset " + pos + ": " + message);
  }
}
