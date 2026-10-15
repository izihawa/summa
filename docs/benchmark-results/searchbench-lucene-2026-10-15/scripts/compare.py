"""Compare probe counts between two engines' *-counts.json; print mismatches."""
import json, sys, collections
a_path, b_path = sys.argv[1], sys.argv[2]
a = {r["key"]: r for r in json.load(open(a_path))}
b = {r["key"]: r for r in json.load(open(b_path))}
assert set(a) == set(b), "key sets differ"
mism = []
for k in a:
    ca, cb = a[k].get("count"), b[k].get("count")
    ea, eb = a[k].get("error"), b[k].get("error")
    if ca != cb or (ea is None) != (eb is None):
        mism.append({"key": k, "a": ca, "b": cb, "a_error": ea, "b_error": eb})
print(json.dumps({"a": a_path, "b": b_path, "total": len(a), "mismatches": len(mism),
                  "a_errors": sum("error" in r for r in a.values()),
                  "b_errors": sum("error" in r for r in b.values()),
                  "by_class": collections.Counter(m["key"].split("\t")[0] for m in mism)}, indent=1))
for m in mism[:int(sys.argv[3]) if len(sys.argv) > 3 else 20]:
    print(json.dumps(m))
