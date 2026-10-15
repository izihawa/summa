---
title: Summa vs Lucene at 32 clients
parent: Blog
nav_order: 6
---

# Summa vs Lucene at 32 clients: 1.65× higher throughput

<i>[@PashaPodolsky](https://github.com/ppodolsky)</i>

_October 15, 2026_

Our [previous post](summa-vs-lucene.md) compared single-threaded latency on
the Search Benchmark Game. Summa won three of four commands, and Lucene kept
top-10. This time we measured throughput under load: 32 concurrent clients on
[Searchbench](https://github.com/yonik/searchbench), all engines on the same
machine.

- **Corpus and queries:** 10M Wikipedia chunks, 826 queries in 19 families,
  each run as top 10, top 100 and exact count, for 57 cells.
- **Engines:** Summa, raw Lucene 10.5.1, Luxir 0.1.0, Elasticsearch 9.5.4 and
  OpenSearch 3.8.0.

## Results

Each number is the geometric mean of Summa's QPS divided by the other
engine's, across all 57 cells.

| Summa vs              | All cells |  Top 10 | Top 100 | Count | Cells Summa wins |
| --------------------- | --------: | ------: | ------: | ----: | ---------------: |
| Lucene                | **1.65×** |   1.98× |   1.76× | 1.28× |            39/57 |
| Lucene, both reordered | **1.78×** |   2.23× |   1.90× | 1.33× |            46/57 |
| Luxir                 |     1.35× |   1.49× |   1.38× | 1.20× |            38/57 |
| Elasticsearch         |     2.94× |   3.52× |   3.06× | 2.36× |            51/57 |
| OpenSearch            |     3.59× |   3.53× |   3.07× | 4.29× |            52/57 |

"Both reordered" compares Summa with its recursive-graph-bisection document
order against Lucene with BP reordering. Raw Lucene was itself 1.79× faster
than Elasticsearch on the same queries.

## Where Summa wins

- **Phrases:** 1.3–3.8× on exact phrases. Sloppy phrases reach 21× on
  frequent terms: 7,167 vs 339 QPS for top 10.
- **Single-term top-k:** 1.2–2.4×. High-frequency terms reach 83k vs 39k QPS
  for top 10.
- **Wildcard, prefix and regex:** 1.3–8.8×. Read the exclusions below before
  quoting these.

## Where Lucene wins

- **AND and OR mixing a frequent term with a medium or rare one, for top-k:**
  Summa runs at 0.56–0.98× of Lucene. Summa still wins most of these
  families' COUNT cells. Lucene also wins AND and OR counts on two frequent
  terms (0.77–0.81×). Reordering narrows these gaps, but some cells stay below
  1×.
- **Single-term COUNT:** Lucene answered about 200k counts per second, the
  limit of our two load-generator CPUs. Summa peaked near 150k, held back by
  per-request overhead in its HTTP layer (about 153 µs of CPU per request vs
  38 µs), not by counting.

## What was excluded

Searchbench includes queries Summa refuses under its default query budget:
leading wildcards, very broad prefixes and some regexes. We excluded those
149 queries, 18% of the set, **for every engine** and timed the remaining 677.
They're the most expensive queries in their families. Summa's wildcard, prefix
and regex numbers therefore cover the easier remainder only.

## How we kept it fair

- **Same machine and protocol for everyone.** A 32-vCPU host, the engine on
  30 CPUs and the load generator on 2, query caches off. 60 s warmup, then three
  3-second runs per cell, in 14 alternating phases so each engine was measured
  twice. 178.8 million requests, zero errors.
- **Lucene set up like Elasticsearch.** Raw Lucene used Elasticsearch's
  `standard` analyzer and the same BM25 parameters (k1 = 1.2, b = 0.75). It
  returned exactly the same counts as Elasticsearch on all 826 queries.
- **Counts checked before timing.** Summa's counts differ from Lucene's on 37
  of the 677 timed queries, all within 5%, from analyzer differences.

## Caveats

- **Screening-grade numbers.** These are short runs on one host, with 1–4%
  median spread between phases. We make no tail-latency claims.
- **Different frontends.** Summa ran behind its benchmark HTTP server, not
  production gRPC, and Lucene behind a minimal HTTP wrapper.
- **Different index contents.** Summa's indexes carry extra columns
  (14–18 GB vs Lucene's 2.9 GB). Everything fit in memory, so this doesn't
  affect warm throughput.

## Reproduce it

- [Results, protocol and provenance](https://github.com/SpaceFrontiers/summa/blob/main/docs/benchmark-results/searchbench-lucene-2026-10-15/README.md): the per-cell tables, count gates, the exclusion list, binary checksums and runner scripts.
- [The Lucene adapter](https://github.com/SpaceFrontiers/summa/tree/main/scripts/searchbench/lucene).

Summa is MIT licensed and runs [Machine Library](https://machinelibrary.ai).
If you can make Lucene faster on this workload, we'd like to see it:
[open an issue](https://github.com/SpaceFrontiers/summa/issues).
