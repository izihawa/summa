import csv
import json
import sys
from pathlib import Path

R = Path(sys.argv[1])
out = Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
res = json.loads((R / "summary/campaign-results.json").read_text())
for run in res["runs"]:
    run["cells"] = len(run["cells"])
(out / "campaign-results-slim.json").write_text(json.dumps(res, indent=1) + "\n")
variants = {
    "summa-default": "summa",
    "summa-rgb": "summa",
    "lucene": "lucene",
    "lucene-bp": "lucene",
    "luxir": "luxir",
    "elasticsearch": "elasticsearch",
    "opensearch": "opensearch",
}
counts = {
    v: {r["key"]: r for r in json.loads((R / f"probe-{v}/{e}-counts.json").read_text())}
    for v, e in variants.items()
}
gate = {r["key"]: r for r in json.loads((R / "gate/agreement.json").read_text())}
with (out / "probe-counts.csv").open("w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["class", "query", "admitted", *variants])
    for k, g in gate.items():
        w.writerow(
            [
                g["query"]["query_class"],
                g["query"]["text"],
                g["include"],
                *[
                    counts[v][k].get("count", "ERROR: " + counts[v][k].get("error", ""))
                    for v in variants
                ],
            ]
        )
