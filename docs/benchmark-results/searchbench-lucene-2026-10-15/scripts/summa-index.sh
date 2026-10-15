#!/usr/bin/env bash
set -euxo pipefail
until grep -q BUILD-DONE /mnt/sb/logs/build-summa.log; do
  if ! pgrep -f build-summa.sh >/dev/null; then echo "build failed"; exit 1; fi
  sleep 10
done
mkdir -p /mnt/sb/bin /mnt/sb/indexes
cp /mnt/sb/target/release/examples/searchbench_http /mnt/sb/bin/searchbench_http
sha256sum /mnt/sb/bin/searchbench_http
CORPUS=/mnt/sb/searchbench/corpus/corpus-10m-searchbench.ndjson
date -u
/usr/bin/time -v /mnt/sb/bin/searchbench_http index-unicode-impacts /mnt/sb/indexes/summa-default $CORPUS 30
date -u
du -sh /mnt/sb/indexes/summa-default
/usr/bin/time -v /mnt/sb/bin/searchbench_http index-unicode-impacts-rgb /mnt/sb/indexes/summa-rgb $CORPUS 30
date -u
du -sh /mnt/sb/indexes/summa-rgb
echo SUMMA-INDEX-DONE
