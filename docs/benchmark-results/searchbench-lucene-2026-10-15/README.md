# Searchbench at 32 clients: Summa vs Lucene, Luxir, Elasticsearch, OpenSearch — October 15, 2026

This is a same-host throughput campaign over the pinned
[Searchbench](https://github.com/yonik/searchbench) workload (`fulltext-munin-host-20260920`):

- **Corpus:** 10M Wikipedia chunks.
- **Queries:** 826 in 19 families, each run as top-10, top-100 and exact count
  (57 cells).
- **Engines** (one serving at a time):
  - Summa `d7d910e7` plus the raw Lucene adapter (`scripts/searchbench/lucene/`);
  - Lucene 10.5.1;
  - Luxir 0.1.0;
  - Elasticsearch 9.5.4;
  - OpenSearch 3.8.0.

## Results

**Geometric mean of QPS ratios over all 57 cells** (higher favors the first
engine):

| Ratio | All | TOP_10 | TOP_100 | COUNT | Excluding driver-bound cells | Cells ≥ 1× |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Summa default / Lucene | **1.65×** | 1.98× | 1.76× | 1.28× | 1.72× (54) | 39/57 |
| Summa RGB / Lucene BP | **1.78×** | 2.23× | 1.90× | 1.33× | 1.87× (54) | 46/57 |
| Summa default / Luxir | 1.35× | 1.49× | 1.38× | 1.20× | 1.40× (51) | 38/57 |
| Summa RGB / Luxir | 1.53× | 1.67× | 1.53× | 1.42× | 1.61× (51) | 49/57 |
| Summa default / Elasticsearch | 2.94× | 3.52× | 3.06× | 2.36× | 2.94× (57) | 51/57 |
| Summa default / OpenSearch | 3.59× | 3.53× | 3.07× | 4.29× | 3.59× (57) | 52/57 |
| Lucene / Elasticsearch | 1.79× | 1.78× | 1.74× | 1.85× | 1.76× (54) | 57/57 |

Per-cell QPS is in [table-summa-lucene.md](table-summa-lucene.md) and
[table-all.md](table-all.md); raw totals are in [total.csv](total.csv) and
[campaign-results-slim.json](campaign-results-slim.json).

- **Summa leads:**
  - phrases (1.3–3.8×);
  - sloppy phrases (1.6–21×);
  - single-term top-k (1.2–2.4×);
  - prefix, regex and wildcard (1.3–8.8×, see the exclusions below).
- **Lucene leads:**
  - mixed-frequency conjunctions and disjunctions: `and_high_med`
    0.66–0.98×, `and_high_low` top-k 0.79–0.91×, `or_high_low` TOP_10 0.56×,
    `or_high_med` 0.69–0.88× (Summa default / Lucene);
  - high-frequency AND/OR COUNT.

  Summa RGB narrows these against Lucene BP; some cells stay below 1×.
- **Term COUNT is HTTP overhead, not search work.** Lucene's term COUNT cells
  (ᴰ) reach about 200k QPS and are bound by the two driver CPUs. Summa's
  benchmark server peaks near 150k QPS, limited by its own per-request CPU
  cost: about 153 µs versus Lucene's 38 µs. That's a real 0.75× in this
  harness.

## Protocol

- **Host:** GCP n2-highmem-32 (Cascade Lake, 32 vCPU, 251 GB), us-east1-b.
  Engine on CPUs 0–14,16–30; `bench_replay` driver on CPUs 15,31; isolated
  loopback network; query caches off.
- **Phases:** 14 mirrored phases, `d1 j1 l1 r1 b1 e1 o1 o2 e2 b2 r2 l2 j2 d2`
  (d = Summa default, r = Summa RGB, j = Lucene, b = Lucene BP, l = Luxir,
  e = Elasticsearch, o = OpenSearch).
- **Timing:** 32 clients, 60 s session warmup, 3 × 3 s repetitions per cell.
  QPS is the mean of the two phases' medians. 178.8M requests, zero errors.
- **Summa indexes:** `index-unicode-impacts` (default codec, impact bounds, no
  word pairs) and `index-unicode-impacts-rgb`, 30 workers, served by the
  benchmark-only `summa-server/examples/searchbench_http`.
- **Lucene:** `scripts/searchbench/lucene/`:
  - StandardAnalyzer without stop words (Elasticsearch's `standard`);
  - BM25 k1 = 1.2, b = 0.75;
  - plain and `--bp` (BPIndexReorderer) builds;
  - 8 GiB heap, G1, Elasticsearch's bundled JDK 26.0.2.
- **Elasticsearch, OpenSearch, Luxir:** reused the September 22 indexes
  unchanged (same versions and corpus). Elasticsearch had an 8 GiB heap.
- **Provenance:** commits, versions, binary checksums and jar checksums are in
  [provenance.txt](provenance.txt). The runner scripts are in
  [scripts/](scripts/).

## Count gates and exclusions

- **Lucene vs Elasticsearch:** identical counts on all 826 queries
  ([gate-exact-es-lucene-summary.json](gate-exact-es-lucene-summary.json)).
  Elasticsearch, OpenSearch, Luxir and Lucene all agree exactly.
- **Exclusions:** 149 queries are excluded **for every engine** because Summa
  returns a budget error on them ([exclusions.json](exclusions.json)): prefix3
  48, wildcard_lead 47, wildcard 38, regex 9, wildcard_scan 7. They are the
  most expensive queries in those families, so Summa's prefix, regex and
  wildcard ratios cover the easier remainder only.
- **Admitted set:** 677 queries (a shared-input gate, as in the
  [October 2 review](../review-2026-10-02/README.md)). 37 of them have
  Summa-vs-Lucene count differences, all within 5% and mostly phrases, from
  analyzer differences ([admitted-count-differences.json](admitted-count-differences.json)).
  RGB counts equal default; BP counts equal plain.

## Limits

- **One host, short windows.** Treat the results as screening-grade. Median
  phase spread is 1–4%; the worst is 14% (Lucene BP high_phrase COUNT). No tail
  latency claims.
- **Different frontends.** Summa runs on its benchmark Axum frontend, not
  production gRPC. Lucene runs behind a thin blocking-HTTP frontend.
- **Different index contents.** Lucene indexes only `id` and `body` (2.9 GB);
  the Summa indexes also carry facet and sort columns (18 GB default, 14 GB
  RGB). Everything was in page cache, so warm throughput is unaffected.
- **Build times are informational only.** The Summa and Lucene builds ran at
  the same time.
