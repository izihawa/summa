#!/usr/bin/env bash
set -euxo pipefail
R=/mnt/sb/results/20261015T0815Z
until grep -q SUMMA-INDEX-DONE /mnt/sb/logs/summa-index.log; do
  pgrep -f summa-index.sh >/dev/null || { echo "summa index failed"; exit 1; }
  sleep 10
done
bash /mnt/sb/scripts/probe.sh $R summa-rgb
bash /mnt/sb/scripts/gate.sh $R > $R/gate.log 2>&1
python3 - $R <<'PY'
import json, sys
from pathlib import Path
R = Path(sys.argv[1])
def counts(p): return {r["key"]: (r.get("count"), "error" in r) for r in json.loads(p.read_text())}
assert counts(R/"probe-summa-default/summa-counts.json") == counts(R/"probe-summa-rgb/summa-counts.json"), "rgb counts differ"
assert counts(R/"probe-lucene/lucene-counts.json") == counts(R/"probe-lucene-bp/lucene-counts.json"), "bp counts differ"
s = json.loads((R/"gate-exact-es-lucene/summary.json").read_text())
assert s["included"] == 826, s
print("pre-measure assertions ok")
PY
# Provenance and inventory
{
  echo "date: $(date -u)"
  echo "summa: $(git -C /mnt/sb/summa rev-parse HEAD) $(git -C /mnt/sb/summa log -1 --format=%s)"
  echo "summa base (origin/main): $(git -C /mnt/sb/summa rev-parse origin/main)"
  echo "searchbench: $(git -C /mnt/sb/searchbench rev-parse HEAD) $(git -C /mnt/sb/searchbench describe --tags)"
  echo "rustc: $(RUSTUP_HOME=/mnt/sb/rustup /mnt/sb/cargo/bin/rustc +1.98.1 --version)"
  echo "java (lucene + es bundled): $(/mnt/sb/searchbench/engines/elasticsearch-9.5.4/jdk/bin/java -version 2>&1 | tr '\n' ' ')"
  echo "java (os bundled): $(/mnt/sb/searchbench/engines/opensearch-3.8.0/jdk/bin/java -version 2>&1 | tr '\n' ' ')"
  echo "lucene jars:"; sha256sum /mnt/sb/summa/scripts/searchbench/lucene/lib/*.jar /mnt/sb/summa/scripts/searchbench/lucene/build/searchbench-lucene.jar
  echo "binaries:"; sha256sum /mnt/sb/bin/searchbench_http /mnt/sb/luxir-release/luxir-0.1.0-linux-x86_64-v4 /mnt/sb/searchbench/driver/build/bench_replay
  echo "luxir SHA256SUMS:"; cat /mnt/sb/luxir-release/SHA256SUMS
  echo "corpus sha256 sidecar: $(cat /mnt/sb/searchbench/corpus/corpus-10m-searchbench.ndjson.sha256)"
  echo "es/os/luxir identity:"; cat /mnt/sb/searchbench/data/*/10m-searchbench-merged.identity
  echo "kernel: $(uname -a)"; lscpu; free -g
  echo "es jvm options:"; cat /mnt/sb/searchbench/config/elasticsearch/searchbench.options
  echo "lucene run.sh:"; cat /mnt/sb/summa/scripts/searchbench/lucene/run.sh
  echo "index sizes:"; du -sb /mnt/sb/indexes/* /mnt/sb/searchbench/data/*/10m-searchbench-merged
} > $R/provenance.txt 2>&1
inventory() {
  (cd /mnt/sb/indexes && find . -type f -print0 | sort -z | xargs -0 -n 8 -P 16 sha256sum | sort -k2) > "$1"
}
inventory $R/inventory-before.txt
cd /mnt/sb/searchbench
set +e
scripts/run-isolated.sh bash /mnt/sb/scripts/campaign.sh $R > $R/campaign.log 2>&1
echo "{\"returncode\": $?}" > $R/isolation-exit.json
set -e
inventory $R/inventory-after.txt
cmp $R/inventory-before.txt $R/inventory-after.txt && echo inventory-unchanged > $R/inventory-check.txt || echo INVENTORY-CHANGED > $R/inventory-check.txt
python3 /mnt/sb/scripts/summarize.py $R --output $R/summary > $R/summarize.log 2>&1 || true
echo PIPELINE-DONE
