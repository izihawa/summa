"""Validate the 2026-10-15 Summa / Lucene / Luxir / ES / OS campaign and export tables.

Adapted from docs/benchmark-results/review-2026-10-02/summarize.py: same cell metrics
(median of three repetitions per phase, mean of the two mirrored phase medians),
same admission (shared-input gate), plus raw-Lucene pairings.
"""
import argparse, csv, hashlib, json, math, statistics
from collections import Counter
from pathlib import Path

VARIANTS = ["summa-default", "lucene", "summa-rgb", "lucene-bp", "luxir", "elasticsearch", "opensearch"]
ENGINE = {"summa-default": "summa", "summa-rgb": "summa", "lucene": "lucene", "lucene-bp": "lucene",
          "luxir": "luxir", "elasticsearch": "elasticsearch", "opensearch": "opensearch"}
OPS = ["TOP_10", "TOP_100", "COUNT"]
SERVER_CPUS = list(range(0, 15)) + list(range(16, 31))
PAIRS = [  # (name, numerator, denominator)
    ("summa_default_over_lucene", "summa-default", "lucene"),
    ("summa_rgb_over_lucene_bp", "summa-rgb", "lucene-bp"),
    ("summa_default_over_luxir", "summa-default", "luxir"),
    ("summa_rgb_over_luxir", "summa-rgb", "luxir"),
    ("summa_default_over_elasticsearch", "summa-default", "elasticsearch"),
    ("summa_default_over_opensearch", "summa-default", "opensearch"),
    ("lucene_over_elasticsearch", "lucene", "elasticsearch"),
    ("lucene_bp_over_lucene", "lucene-bp", "lucene"),
    ("summa_rgb_over_default", "summa-rgb", "summa-default"),
]
DRIVER_BOUND_CORES = 1.8  # of the 2 driver CPUs


def read(p):
    return json.loads(Path(p).read_text())


def cell_metrics(path):
    summary, raw = read(path), read(path.with_suffix(".raw.json"))
    assert not summary["errors"] and not raw["errors"], path
    assert summary["memory"]["error"] is None, path
    reps = raw["repetitions"]
    assert len(reps) == 3 and all(r["errors"] == 0 for r in reps), path
    requests = sum(r["requests"] for r in reps)
    elapsed = sum(r["elapsed_s"] for r in reps)
    qps = [r["requests"] / r["elapsed_s"] for r in reps]
    for r in reps:
        assert all(b["errors"] == 0 for b in r["per_bucket"].values()), path
        assert sum(b["requests"] for b in r["per_bucket"].values()) == r["requests"], path
    return {
        "family": summary["family"], "operation": summary["operation"],
        "query_count": summary["query_count"],
        "median_qps": statistics.median(qps), "min_qps": min(qps), "max_qps": max(qps),
        "reported_median_qps": summary["median_qps"],
        "server_cpu_us_per_request": 1e6 * sum(r["server_cpu_s"] for r in reps) / requests,
        "driver_cpu_us_per_request": 1e6 * sum(r["client_cpu_s"] for r in reps) / requests,
        "mean_server_cores": sum(r["server_cpu_s"] for r in reps) / elapsed,
        "mean_driver_cores": sum(r["client_cpu_s"] for r in reps) / elapsed,
        "peak_rss_mib": summary["memory"]["peak_vmrss_kb"] / 1024,
        "peak_anonymous_rss_mib": summary["memory"]["peak_rssanon_kb"] / 1024,
        "requests": requests,
        "p99_us": [r["overall"]["latency_us"]["p99"] for r in reps],
    }


def geomean(values):
    values = list(values)
    return math.exp(sum(math.log(v) for v in values) / len(values)) if values else None


def main(folder, output):
    rows = read(folder / "gate" / "agreement.json")
    gate_sha = hashlib.sha256((folder / "gate" / "agreement.json").read_bytes()).hexdigest()
    selected = {r["key"]: r for r in rows if r["include"]}
    fam_counts = Counter(r["query"]["query_class"] for r in selected.values())
    excluded = Counter(r["query"]["query_class"] for r in rows if not r["include"])
    runs, problems = [], []
    phases = sorted(p for p in (folder / "phases").iterdir() if p.is_dir())
    reference_queries = None
    for d in phases:
        if not (d / "completed.json").exists():
            problems.append(f"{d.name}: incomplete")
            continue
        variant = read(d / "variant.json")["variant"]
        engine = ENGINE[variant]
        server = read(d / "server.json")
        assert server["cpus"] == SERVER_CPUS, (d, server["cpus"])
        ctx = read(d / engine / "context.json")
        a = ctx["args"]
        assert a["clients"] == [32] and a["client_cores"] == "15,31", d
        assert a["duration"] == 3 and a["repetitions"] == 3 and a["session_warmup"] == 60, d
        assert a["families"] is None and ctx["comparison_modes"] == ["shared-input"], d
        assert ctx["agreement_sha256"] == gate_sha, d
        assert ctx["topology"] == read(d / engine / "topology-after.json"), d
        if reference_queries is None:
            reference_queries = ctx["queries"]
        assert ctx["queries"] == reference_queries, d
        cells = [cell_metrics(p) for p in sorted((d / engine).glob("*-c32.json"))]
        assert {(c["family"], c["operation"]) for c in cells} == {
            (f, op) for f in fam_counts for op in OPS}, d
        for c in cells:
            assert c["query_count"] == fam_counts[c["family"]]
        runs.append({"phase": d.name, "variant": variant, "binary_sha256": server["binary_sha256"],
                     "cmdline": server["cmdline"], "cells": cells,
                     "started_at": int((d / "started_at").read_text()),
                     "finished_at": int((d / "finished_at").read_text())})
    measured = [v for v in VARIANTS if sum(r["variant"] == v for r in runs) >= 1]
    comparisons = []
    for family in sorted(fam_counts):
        for op in OPS:
            row = {"family": family, "operation": op, "queries": fam_counts[family]}
            for v in measured:
                cells = [c for r in runs if r["variant"] == v for c in r["cells"]
                         if (c["family"], c["operation"]) == (family, op)]
                req = sum(c["requests"] for c in cells)
                row[v] = {
                    "phases": len(cells),
                    "mean_phase_median_qps": statistics.mean(c["median_qps"] for c in cells),
                    "phase_median_qps": [c["median_qps"] for c in cells],
                    "phase_spread": max(c["median_qps"] for c in cells) / min(c["median_qps"] for c in cells) - 1,
                    "min_repetition_qps": min(c["min_qps"] for c in cells),
                    "max_repetition_qps": max(c["max_qps"] for c in cells),
                    "server_cpu_us_per_request": sum(c["server_cpu_us_per_request"] * c["requests"] for c in cells) / req,
                    "mean_server_cores": statistics.mean(c["mean_server_cores"] for c in cells),
                    "mean_driver_cores": max(c["mean_driver_cores"] for c in cells),
                    "driver_bound": max(c["mean_driver_cores"] for c in cells) >= DRIVER_BOUND_CORES,
                    "peak_rss_mib": max(c["peak_rss_mib"] for c in cells),
                    "peak_anonymous_rss_mib": max(c["peak_anonymous_rss_mib"] for c in cells),
                    "p99_us_observed_range": [min(min(c["p99_us"]) for c in cells), max(max(c["p99_us"]) for c in cells)],
                    "requests": req,
                }
            for name, num, den in PAIRS:
                if num in row and den in row:
                    row[name] = row[num]["mean_phase_median_qps"] / row[den]["mean_phase_median_qps"]
            comparisons.append(row)
    geo = {}
    for name, num, den in PAIRS:
        if not all(name in r for r in comparisons):
            continue
        g = {"all": geomean(r[name] for r in comparisons)}
        for op in OPS:
            g[op] = geomean(r[name] for r in comparisons if r["operation"] == op)
        nb = [r for r in comparisons if not (r[num]["driver_bound"] or r[den]["driver_bound"])]
        g["all_excluding_driver_bound"] = geomean(r[name] for r in nb)
        g["cells_excluding_driver_bound"] = len(nb)
        g["cells_ge_1"] = sum(r[name] >= 1 for r in comparisons)
        g["cells"] = len(comparisons)
        geo[name] = g
    result = {
        "gate_sha256": gate_sha, "queries_total": len(rows), "admitted": len(selected),
        "excluded": len(rows) - len(selected), "excluded_by_class": dict(excluded),
        "admitted_by_class": dict(fam_counts),
        "requests": sum(c["requests"] for r in runs for c in r["cells"]), "errors": 0,
        "problems": problems, "phase_order": [r["phase"] + ":" + r["variant"] for r in runs],
        "geomean_ratios": geo, "runs": runs, "comparisons": comparisons,
    }
    output.mkdir(parents=True, exist_ok=True)
    (output / "campaign-results.json").write_text(json.dumps(result, indent=1) + "\n")
    def q(row, v):
        if v not in row:
            return "—"
        c = row[v]
        return f"{c['mean_phase_median_qps']:,.0f}" + ("ᴰ" if c["driver_bound"] else "")
    def ratio(row, name):
        return f"{row[name]:.2f}×" if name in row else "—"
    lines = ["| Family (queries) | Op | Summa default | Lucene | Default / Lucene | Summa RGB | Lucene BP | RGB / BP |",
             "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |"]
    for r in comparisons:
        lines.append(f"| {r['family']} ({r['queries']}) | {r['operation']} | {q(r,'summa-default')} | {q(r,'lucene')} | "
                     f"{ratio(r,'summa_default_over_lucene')} | {q(r,'summa-rgb')} | {q(r,'lucene-bp')} | {ratio(r,'summa_rgb_over_lucene_bp')} |")
    lines.append("")
    lines.append("| Geometric mean | All 57 | TOP_10 | TOP_100 | COUNT | Excl. driver-bound (cells) | Cells ≥ 1× |")
    lines.append("| --- | ---: | ---: | ---: | ---: | ---: | ---: |")
    for name, g in geo.items():
        lines.append(f"| {name} | {g['all']:.3f}× | {g['TOP_10']:.3f}× | {g['TOP_100']:.3f}× | {g['COUNT']:.3f}× | "
                     f"{g['all_excluding_driver_bound']:.3f}× ({g['cells_excluding_driver_bound']}) | {g['cells_ge_1']}/{g['cells']} |")
    (output / "table-summa-lucene.md").write_text("\n".join(lines) + "\n")
    others = [v for v in ["luxir", "elasticsearch", "opensearch"] if v in measured]
    head = "| Family (queries) | Op | " + " | ".join(measured) + " |"
    lines = [head, "| --- | --- |" + " ---: |" * len(measured)]
    for r in comparisons:
        lines.append(f"| {r['family']} ({r['queries']}) | {r['operation']} | " + " | ".join(q(r, v) for v in measured) + " |")
    (output / "table-all.md").write_text("\n".join(lines) + "\n")
    with (output / "total.csv").open("w", newline="") as f:
        fields = ["family", "operation", "queries", "variant", "qps", "phase1_qps", "phase2_qps", "phase_spread",
                  "server_cpu_us", "mean_server_cores", "mean_driver_cores", "driver_bound",
                  "peak_rss_mib", "peak_anonymous_rss_mib", "p99_us_min", "p99_us_max"]
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for r in comparisons:
            for v in measured:
                c = r[v]
                w.writerow({"family": r["family"], "operation": r["operation"], "queries": r["queries"], "variant": v,
                            "qps": round(c["mean_phase_median_qps"], 1),
                            "phase1_qps": round(c["phase_median_qps"][0], 1),
                            "phase2_qps": round(c["phase_median_qps"][-1], 1),
                            "phase_spread": round(c["phase_spread"], 4),
                            "server_cpu_us": round(c["server_cpu_us_per_request"], 1),
                            "mean_server_cores": round(c["mean_server_cores"], 2),
                            "mean_driver_cores": round(c["mean_driver_cores"], 2), "driver_bound": c["driver_bound"],
                            "peak_rss_mib": round(c["peak_rss_mib"], 1),
                            "peak_anonymous_rss_mib": round(c["peak_anonymous_rss_mib"], 1),
                            "p99_us_min": c["p99_us_observed_range"][0], "p99_us_max": c["p99_us_observed_range"][1]})
    print(json.dumps({k: result[k] for k in ["admitted", "excluded", "requests", "problems", "phase_order"]}, indent=1))
    print(json.dumps(geo, indent=1))


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("folder", type=Path)
    ap.add_argument("--output", type=Path, required=True)
    a = ap.parse_args()
    main(a.folder, a.output)
