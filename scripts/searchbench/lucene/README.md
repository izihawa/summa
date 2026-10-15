# Raw Lucene Searchbench adapter

A benchmark-only Apache Lucene 10.5.1 server for the Searchbench full-text campaign.
It gives Summa a library-to-library reference. Elasticsearch and OpenSearch run the
same Lucene underneath, but they add their REST and search-phase stack.

The server speaks the wire shape of Summa's `summa-server/examples/searchbench_http`.
`campaign.py` therefore drives it with the Summa adapter under the engine name `lucene`:

| Request | Response |
| --- | --- |
| `POST /search {"query","class","limit"}`, limit `10`/`100` | `{"docs":[{"id":...}]}`, ranked, no total |
| same, limit `0` | `{"docs":[],"found":N}`, exact |
| invalid envelope, unknown class, parse error | HTTP 400 `{"error":...}` |
| `GET /stats` | `{"documents":N,"segments":[{"id","documents","body_reordered","reorder"}],...}` |
| `GET /health` | `ok` |

## Build

You need JDK 21 or newer, `curl` and `sha256sum`. There is no Maven or Gradle step:
`build.sh` downloads the three jars pinned in `jars.txt` (lucene-core,
lucene-queryparser and lucene-misc 10.5.1) from Maven Central and checks their
SHA-256 sums. It then compiles with `javac --release 21 -Xlint:all -Werror`.

```sh
export JAVA_HOME=/path/to/jdk   # prefer the JDK bundled with the measured Elasticsearch
scripts/searchbench/lucene/build.sh   # -> lib/*.jar, build/searchbench-lucene.jar
```

Set `LUCENE_LIB` and `LUCENE_BUILD` to put the jars and the build output somewhere
else. `run.sh` honours the same variables.

## Index

```sh
LUCENE_HEAP=24g scripts/searchbench/lucene/run.sh index "$INDEX" "$CORPUS" --threads 30
LUCENE_HEAP=24g scripts/searchbench/lucene/run.sh index "$INDEX_BP" "$CORPUS" --threads 30 --bp --bp-ram-mb 8192
```

- **Input.** `CORPUS` is the transformed Searchbench NDJSON. `id` and `body` must be
  strings. The other known corpus fields are accepted but not indexed, and any
  unknown field fails the build.
- **Indexing.** The build feeds through `--threads` `IndexWriter` threads, commits,
  runs `forceMerge(1)` and checks the result is one deletion-free segment.
- **`--bp`.** After the merge, `BPIndexReorderer` reorders the segment by recursive
  graph bisection on `body` postings. This is Lucene's analogue of Summa RGB. The
  reordered segment is written to `INDEX` and the unreordered staging copy
  (`INDEX.plain-staging`) is deleted.
  - `--bp-ram-mb` is the reorderer's budget. Raise it, and the heap, if the build
    fails with `NotEnoughRAMException`.
- **Build time.** Elapsed times are logged. Treat them as information, not as an
  indexing claim.

## Serve and drive

```sh
taskset -c 0-29 scripts/searchbench/lucene/run.sh serve "$INDEX" 9401 --workers 30 &
python3 scripts/searchbench/campaign.py probe --engine lucene \
  --searchbench "$SEARCHBENCH" --out "$RESULTS" --port 9401
python3 scripts/searchbench/campaign.py gate --comparison shared-input \
  --engines summa elasticsearch opensearch luxir lucene \
  --searchbench "$SEARCHBENCH" --out "$RESULTS"
python3 scripts/searchbench/campaign.py measure --engine lucene --server-pid "$PID" \
  --clients 32 --duration 3 --repetitions 3 --session-warmup 60 --client-cores 30,31 \
  --searchbench "$SEARCHBENCH" --out "$RESULTS" --port 9401
```

- `--engines` selects which `*-counts.json` files the gate compares. The default is
  the original four engines, so existing commands behave as before.
- `--server-pid` must be the `java` PID. `run.sh` uses `exec`, so `$!` of a
  backgrounded `run.sh` is that PID.
- The topology check uses `/stats`, exactly as it does for Summa.

## Posture

| Setting | Choice | Elasticsearch counterpart (Searchbench REST adapter) |
| --- | --- | --- |
| Lucene | 10.5.1 | ES 9.5.4 bundles 10.5.1. Lucene 10.5.2 exists but is not used. |
| Body analysis | `StandardAnalyzer(CharArraySet.EMPTY_SET)` at index and query time | `"analyzer": "standard", "search_analyzer": "standard"` |
| Body field | `TextField`: docs, freqs, positions, norms; not stored | `text`; `_source` disabled |
| `id` | `StringField` plus `SortedDocValuesField` | `keyword` (indexed plus doc values) |
| Similarity | `BM25Similarity(1.2, 0.75, discountOverlaps=true)` | default BM25 (k1 1.2, b 0.75) |
| Query syntax | classic `QueryParser`: field `body`, default OR, leading wildcards allowed; `regex` uses `RegexpQuery(body, text)` | `query_string` (`default_field: body`, `default_operator: OR`); `regexp` for regex |
| Multi-term rewrite | Lucene default (`CONSTANT_SCORE_BLENDED_REWRITE`), determinize limit 10,000 | same defaults |
| Top-k | `TopScoreDocCollectorManager(k, null, k)`, ids from doc values | `track_total_hits: false`, `docvalue_fields: [id]` |
| COUNT | `IndexSearcher.count`, exact | `track_total_hits: true`, `size: 0` |
| Query cache | `setQueryCache(null)` | disable with `SEARCHBENCH_QUERY_CACHE=off`; the ES default is on |
| Intra-query concurrency | none (no `IndexSearcher` executor) | single shard; OS `concurrent_segment_search: none` |
| Threads | `--workers` fixed search pool, plus one HTTP reader thread per connection | search pool auto-sized (about 46 on 30 CPUs) |
| JVM | `-Xms8g -Xmx8g`, G1, `AlwaysPreTouch`, `jdk.incubator.vector` | `-Xms8g -Xmx8g`, bundled JDK, ES jvm.options |
| Max clause count | Lucene default 1,024 | dynamic, from heap and thread pool |

The standard analyzer is StandardTokenizer, which applies Unicode UAX#29 word breaks
and splits tokens longer than 255 characters. LowerCaseFilter follows it, then a
StopFilter with ES's default `_none_` list. This is exactly the chain ES 9.5.4
builds for `standard`.

Neither engine stems, folds or removes stop words. Escaped terms such as
`user\:robert` are single UAX#29 tokens (`user:robert`) in both engines.

## Fairness notes

- **Counts.** Raw Lucene and ES share the analyzer, the parser semantics and the
  Lucene version, so their counts must be identical on every query. Before timing,
  gate `lucene` against `elasticsearch` in `exact-count` mode. Any difference is an
  adapter bug.
- **Analyzer vs Summa.** Summa's `unicode_word` and `lex` tokenizers differ from
  UAX#29. Compare Summa with Lucene in `shared-input` mode, and report
  per-query count differences and exclusions as the existing campaign docs require.
  Rankings are not expected to match, because norm encodings differ.
- **Reordering.** Pair Summa RGB with `--bp` Lucene, and Summa default with plain
  Lucene. Do not compare RGB with plain Lucene or with ES/OS, which are unreordered.
- **Transport.** Both servers are thin benchmark frontends: Axum on Tokio versus a
  blocking HTTP/1.1 reader per connection.
  - Each frontend hands a search to a fixed pool sized by the worker flag.
  - Lucene adds 32 mostly blocked reader threads. Summa adds about 4 Tokio workers
    on 30 CPUs.
  - Cells answered in microseconds, such as term COUNT, which Lucene answers from
    `docFreq`, can be bound by transport or by the 2-CPU driver rather than by the
    engine. Label them that way.
- **Index contents.** This adapter indexes only `id` and `body`. Summa and ES also
  index the facet and sort columns. Index size is therefore not comparable, and
  page-cache pressure differs slightly.
- **JVM.** Use 60 s or more of session warmup, so C2 compilation settles before
  timing. Use the same JDK and heap for Lucene and ES, and record any
  `LUCENE_JAVA_OPTS` override with the results.
- **Pinning.** Run the server on CPUs 0-29 and the driver on 30-31 for every engine.
  The 32-vCPU host is a two-socket NUMA machine.

## Local validation (2026-10-15, synthetic data only)

This used a 10,000-document synthetic corpus in the Searchbench format, on a 6-vCPU
sandbox with Temurin 21.0.12.1.

- **Probe.** `campaign.py probe --engine lucene` executed all 826 queries with no
  errors, on both the plain and the `--bp` builds.
- **Lucene layouts.** The plain and `--bp` builds returned identical counts.
- **Summa.** Counts equalled Summa `index-unicode-impacts` (`unicode_word`) on
  826/826 queries. Against Summa's `lex` tokenizer, 87/826 queries differed.
- **Concurrency.** The 32-connection smoke load returned no errors. The frontend
  sustained about 148k req/s for a rare-term COUNT, with client and server sharing
  the 6 vCPUs.

None of this was run against Elasticsearch or on the 10M corpus. These are not
benchmark results.

## Known gaps

- **No ES count check yet.** On the campaign host, run `probe` for both engines and
  gate in `exact-count` mode before any timing run.
- **Transport cost unmeasured.** Measure the frontend's own cost with a cheap
  control (for example `/health`, or a COUNT on a rare term) against Summa's
  frontend before attributing transport-bound cells to the engine.
- **Indexing order.** It is nondeterministic with more than one `--threads`, as it
  is for Summa. Use `--threads 1` for a reproducible document order.
