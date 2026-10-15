#!/usr/bin/env bash
set -euxo pipefail
R=$1
C=/mnt/sb/summa/scripts/searchbench/campaign.py
SB=/mnt/sb/searchbench
mkdir -p "$R"/gate-exact-es-lucene "$R"/gate-exact-reference "$R"/gate
cp "$R"/probe-elasticsearch/elasticsearch-counts.json "$R"/probe-lucene/lucene-counts.json "$R"/gate-exact-es-lucene/
python3 "$C" gate --comparison exact-count --engines elasticsearch lucene --searchbench "$SB" --out "$R"/gate-exact-es-lucene > "$R"/gate-exact-es-lucene/summary.json
cp "$R"/probe-elasticsearch/elasticsearch-counts.json "$R"/probe-opensearch/opensearch-counts.json "$R"/probe-luxir/luxir-counts.json "$R"/probe-lucene/lucene-counts.json "$R"/gate-exact-reference/
python3 "$C" gate --comparison exact-count --engines elasticsearch opensearch luxir lucene --searchbench "$SB" --out "$R"/gate-exact-reference > "$R"/gate-exact-reference/summary.json
cp "$R"/probe-summa-default/summa-counts.json "$R"/probe-lucene/lucene-counts.json "$R"/probe-luxir/luxir-counts.json "$R"/probe-elasticsearch/elasticsearch-counts.json "$R"/probe-opensearch/opensearch-counts.json "$R"/gate/
python3 "$C" gate --comparison shared-input --engines summa lucene luxir elasticsearch opensearch --searchbench "$SB" --out "$R"/gate > "$R"/gate/summary.json
{
python3 /mnt/sb/scripts/compare.py "$R"/probe-summa-default/summa-counts.json "$R"/probe-summa-rgb/summa-counts.json 5
python3 /mnt/sb/scripts/compare.py "$R"/probe-lucene/lucene-counts.json "$R"/probe-lucene-bp/lucene-counts.json 5
python3 /mnt/sb/scripts/compare.py "$R"/probe-elasticsearch/elasticsearch-counts.json "$R"/probe-lucene/lucene-counts.json 5
python3 /mnt/sb/scripts/compare.py "$R"/probe-elasticsearch/elasticsearch-counts.json "$R"/probe-opensearch/opensearch-counts.json 5
python3 /mnt/sb/scripts/compare.py "$R"/probe-elasticsearch/elasticsearch-counts.json "$R"/probe-luxir/luxir-counts.json 5
python3 /mnt/sb/scripts/compare.py "$R"/probe-lucene/lucene-counts.json "$R"/probe-summa-default/summa-counts.json 200
} > "$R"/count-comparisons.txt
python3 - "$R" <<'PY'
import json, sys
from pathlib import Path
R = Path(sys.argv[1])
rows = json.loads((R / "gate/agreement.json").read_text())
out = []
for r in rows:
    if r["include"] and not r["counts_agree"]:
        o = r["observed"]
        out.append({"class": r["query"]["query_class"], "query": r["query"]["text"],
                    "summa": o["summa"]["count"], "lucene": o["lucene"]["count"],
                    "elasticsearch": o["elasticsearch"]["count"], "luxir": o["luxir"]["count"]})
excl = [{"class": r["query"]["query_class"], "query": r["query"]["text"],
         "errors": {e: v.get("error") for e, v in r["observed"].items() if "error" in v}}
        for r in rows if not r["include"]]
(R / "gate/admitted-count-differences.json").write_text(json.dumps(out, indent=1) + "\n")
(R / "gate/exclusions.json").write_text(json.dumps(excl, indent=1) + "\n")
print("admitted count differences:", len(out), "exclusions:", len(excl))
PY
cat "$R"/gate-exact-es-lucene/summary.json "$R"/gate-exact-reference/summary.json "$R"/gate/summary.json
echo GATE-DONE
