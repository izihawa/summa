#!/usr/bin/env bash
set -euxo pipefail
SRC=/mnt/hermes-copy/searchbench-20260922
date -u
rsync -a --exclude /data --exclude /corpus --exclude /logs --exclude /run $SRC/searchbench/ /mnt/sb/searchbench/
mkdir -p /mnt/sb/searchbench/corpus /mnt/sb/searchbench/data /mnt/sb/searchbench/logs /mnt/sb/searchbench/run /mnt/sb/luxir-release
ln -sf $SRC/searchbench/corpus/corpus-10m-searchbench.ndjson /mnt/sb/searchbench/corpus/
cp -p $SRC/searchbench/corpus/corpus-10m-searchbench.ndjson.sha256 $SRC/searchbench/corpus/corpus-10m-searchbench.ndjson.cardinalities.json /mnt/sb/searchbench/corpus/
cp -a $SRC/luxir-release/. /mnt/sb/luxir-release/
for e in elasticsearch opensearch luxir; do
  mkdir -p /mnt/sb/searchbench/data/$e
  cp -a $SRC/searchbench/data/$e/10m-searchbench-merged* /mnt/sb/searchbench/data/$e/
done
du -sh /mnt/sb/searchbench/data/*
date -u
echo COPY-DONE
