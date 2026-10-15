---
title: Summa vs Lucene on the Search Benchmark Game
parent: Blog
nav_order: 5
---

# Summa vs Lucene: faster on three of four Search Benchmark Game commands

<i>[@PashaPodolsky](https://github.com/ppodolsky)</i>

_October 15, 2026_

We ran Summa against Lucene 10.4.0 on the
[Search Benchmark Game](https://github.com/quickwit-oss/search-benchmark-game)
workload: 5,032,104 English Wikipedia documents and its 962 official queries,
on the same machine with the same protocol. Both engines used a document order
optimized for compression: Lucene's BP reordering and Summa's recursive graph
bisection (RGB).

Summa was faster on three of the four official commands. Lucene was still
faster at fetching the top 10 results.

| Command               |      Summa | Lucene 10.4.0 | Difference           |
| --------------------- | ---------: | ------------: | -------------------- |
| Top 100 + exact count | **724 µs** |      1,079 µs | Summa 1.49× faster   |
| Exact count           | **349 µs** |        378 µs | Summa 1.08× faster   |
| Top 1000              | **839 µs** |        854 µs | Summa 1.02× faster   |
| Top 10                |     425 µs |    **394 µs** | Lucene 1.08× faster  |

Times are geometric means of per-query median latencies over seven passes of
all 962 queries, measured on September 16, 2026. Tantivy 0.26 on the same
run took 532, 875, 428 and 927 µs for top 10, top 100 + count, count and top
1000 respectively.

## What made the difference

Most of the gain came from doing less work per query, not from a new index
format. The engine keeps its existing posting lists, scorers and exact scores.

- **Traversal in reordered space.** After RGB, documents that share terms sit
  close together, so posting lists compress better and skip more. Summa
  traverses postings in that physical order and maps results back to stable
  document IDs only for the hits it keeps. It does not build a per-query
  permutation of the corpus.
- **Counts come from work already done.** A ranked conjunction already
  intersects the posting lists. Summa reports the exact size of that
  intersection instead of making a second pass, and reuses exact term and
  two-term union counts. This matters most for "top 100 + exact count".
- **Block-level intersections.** Conjunctions intersect the two rarest decoded
  posting blocks with one bounded SIMD primitive, then probe the other terms.
  Phrase candidates use the same primitive.
- **Cheaper top-k heaps.** Score-only collectors pack the score and document ID
  into one 8-byte key that preserves exact ordering, including ties. They
  screen a batch of candidates before anything touches the heap.
- **Switching OR to AND when it's safe.** For a disjunction, once no document
  missing a term can still enter the top k, the remaining tail runs on the
  conjunction executor. The heap and score order carry over.

## Where Lucene still wins

**Top 10.** Lucene was 7% faster on September 16. An experimental reader the
next day narrowed the gap to 3% (433 µs vs 420 µs). It isn't merged yet, and
the gap isn't closed.

**Memory.** In this run, Summa's peak RSS after top-10 was 1,019 MiB against
Lucene's 865 MiB. An optional SIMD codec brings Summa to
856 MiB, at a 2% top-10 cost.

**Single terms.** Single-term top-10 queries are our weakest family: 2.7×
slower than Tantivy in the matching comparison. We haven't broken this family
down against Lucene yet.

## Caveats

- **Warm, serial, single core.** Each engine is pinned to one CPU and timed
  after warmup. These numbers say nothing about cold caches, concurrent load
  or indexing while serving.
- **Different analyzers and BM25 parameters.** Each engine uses its upstream
  benchmark adapter. Lucene's StandardAnalyzer splits tokens longer than 255
  characters, and Summa's simple tokenizer doesn't. Scores and index sizes
  therefore aren't identical. Summa's 1,676 exact reference queries pass with
  reordering on and off.
- **One machine, one corpus.** An x86 Cascade Lake host, Rust 1.98.1 with LTO
  and native CPU flags, and Lucene 10.4.0 through the pinned upstream adapter.

## Reproduce it

The protocol, adapters and per-query evidence are in the repository:

- [Benchmark contract](https://github.com/SpaceFrontiers/summa/blob/main/docs/search-benchmark-game.md): corpus, queries, warmup, analyzer differences.
- [Current comparison](https://github.com/SpaceFrontiers/summa/blob/main/docs/search-benchmark-current.md): this table and the follow-up runs.
- [RGB execution write-up](https://github.com/SpaceFrontiers/summa/blob/main/docs/search-rgb-repair.md) and its [evidence archive](https://github.com/SpaceFrontiers/summa/blob/main/docs/benchmark-results/rgb-repair-2026-09-16/README.md).

Summa is MIT licensed. It runs [Machine Library](https://machinelibrary.ai), a
research search over papers, books, patents and standards. If you find a
workload where these numbers don't hold, please
[open an issue](https://github.com/SpaceFrontiers/summa/issues).
