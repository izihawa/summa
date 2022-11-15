---
layout: page
title: Benchmark
permalink: /benchmark
---

Firstly, follow setup guide for [summa](/summa-proto/quick-start#setup) and [ES](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html)

## Downloading Data

```bash
{% include download-dump-snippet.sh %}
```

## Preparing ES

```bash 
{% include import-data-to-es-snippet.sh %}

# Do a test query
curl -H "Content-Type: application/json" -s http://localhost:9200/books/_search '{"query": { "match": {"message": {"query": "this is a test"}}}}'
```

## Preparing Summa

```bash
{% include import-data-to-summa-snippet.sh %}

# Do a match query that returns top-10 documents and its total count
summa-cli localhost:8082 - search books '{"match": {"value": "astronomy"}}' '[{"top_docs": {"limit": 10}}, {"count": {}}]'
```

## Benchmarking
ToDo