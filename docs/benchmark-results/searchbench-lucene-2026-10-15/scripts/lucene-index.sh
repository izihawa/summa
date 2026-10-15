#!/usr/bin/env bash
set -euxo pipefail
export JAVA_HOME=/mnt/sb/searchbench/engines/elasticsearch-9.5.4/jdk
CORPUS=/mnt/sb/searchbench/corpus/corpus-10m-searchbench.ndjson
mkdir -p /mnt/sb/indexes
cd /mnt/sb/summa
date -u
/usr/bin/time -v env LUCENE_HEAP=32g bash scripts/searchbench/lucene/run.sh index /mnt/sb/indexes/lucene-plain $CORPUS --threads 30 --ram-buffer-mb 8192
date -u
du -sh /mnt/sb/indexes/lucene-plain
/usr/bin/time -v env LUCENE_HEAP=96g bash scripts/searchbench/lucene/run.sh index /mnt/sb/indexes/lucene-bp $CORPUS --threads 30 --ram-buffer-mb 8192 --bp --bp-ram-mb 49152
date -u
du -sh /mnt/sb/indexes/lucene-bp
echo LUCENE-INDEX-DONE
