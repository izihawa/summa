package searchbench.lucene;

import java.util.Set;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.CharArraySet;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.search.similarities.BM25Similarity;
import org.apache.lucene.search.similarities.Similarity;

/** Analysis, scoring and schema shared by the index build and the server. */
final class Posture {
  static final String BODY = "body";
  static final String ID = "id";

  /** Commit user-data key naming the build's document order: "none" or "bp". */
  static final String REORDER_KEY = "searchbench.reorder";

  /**
   * Fields of the transformed Searchbench corpus that this full-text adapter accepts but
   * does not index; the full-text families query only {@code body}. Unknown fields fail.
   */
  static final Set<String> IGNORED_CORPUS_FIELDS =
      Set.of(
          "cat_s", "cat100_s", "cat1k_s", "cat10k_s", "cat100k_s", "cat1m_s", "cat5m_s",
          "catu2m_s", "catid_s", "sel99_s", "sel90_s", "sel50_s", "sel10_s", "sel1_s",
          "sel01_s", "sel001_s", "date_dt", "sort_i", "price_i");

  private Posture() {}

  /**
   * Elasticsearch's built-in {@code standard} analyzer as mapped by Searchbench's REST
   * adapters ({@code "analyzer": "standard", "search_analyzer": "standard"}):
   * StandardTokenizer (UAX#29, max token length 255) + LowerCaseFilter + StopFilter with
   * ES's default {@code _none_} stop list. Lucene's StandardAnalyzer with an empty stop
   * set is that exact chain.
   */
  static Analyzer analyzer() {
    return new StandardAnalyzer(CharArraySet.EMPTY_SET);
  }

  /** BM25 k1=1.2, b=0.75, discountOverlaps=true: Lucene's and Elasticsearch's default. */
  static Similarity similarity() {
    return new BM25Similarity(1.2f, 0.75f, true);
  }
}
