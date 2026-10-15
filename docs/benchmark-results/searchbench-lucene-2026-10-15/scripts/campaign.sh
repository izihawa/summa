#!/usr/bin/env bash
# usage: campaign.sh OUTROOT  (run inside searchbench scripts/run-isolated.sh)
set -euxo pipefail
source /mnt/sb/scripts/lib.sh
OUT=$1
PHASES=${PHASES:-"d1:summa-default j1:lucene l1:luxir r1:summa-rgb b1:lucene-bp e1:elasticsearch o1:opensearch o2:opensearch e2:elasticsearch b2:lucene-bp r2:summa-rgb l2:luxir j2:lucene d2:summa-default"}
echo "{\"network_mode\": \"${SEARCHBENCH_NETWORK_MODE:-none}\", \"namespace\": \"${SEARCHBENCH_NETWORK_NAMESPACE:-}\"}" > "$OUT/network.json"
for p in $PHASES; do
  phase=${p%%:*}; v=${p#*:}; e=$(engine_of "$v")
  d=$OUT/phases/$phase
  if [[ -f $d/completed.json ]]; then continue; fi
  rm -rf "$d"; mkdir -p "$d"
  cp "$OUT/gate/agreement.json" "$d/agreement.json"
  printf '{"variant": "%s", "engine": "%s", "index": "%s"}\n' "$v" "$e" "$(index_of "$v")" > "$d/variant.json"
  date -u +%s > "$d/started_at"
  if ! start_variant "$v" "$d"; then echo "$phase start failed" >> "$OUT/failed.txt"; stop_variant "$v" || true; continue; fi
  server_record "$v" "$d/server.json"
  if python3 "$SUMMA/scripts/searchbench/campaign.py" measure --engine "$e" --server-pid "$SERVER_PID" \
      --port "$(port_of "$v")" --clients 32 --duration 3 --repetitions 3 --session-warmup 60 \
      --client-cores "$CLIENT_CORES" --comparison shared-input --searchbench "$SB" --out "$d" > "$d/measure.log" 2>&1; then
    cat /proc/"$SERVER_PID"/smaps_rollup > "$d/smaps_rollup.txt" || true
    cat /proc/"$SERVER_PID"/smaps > "$d/smaps.txt" || true
    stop_variant "$v"
    date -u +%s > "$d/finished_at"
    echo '{"complete": true}' > "$d/completed.json"
  else
    echo "$phase measure failed" >> "$OUT/failed.txt"
    stop_variant "$v"
  fi
  echo "PHASE $phase $v done $(date -u)"
done
[[ -f $OUT/failed.txt ]] || echo '{"complete": true}' > "$OUT/all-completed.json"
echo CAMPAIGN-DONE
