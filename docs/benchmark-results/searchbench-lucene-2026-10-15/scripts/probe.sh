#!/usr/bin/env bash
# usage: probe.sh OUTROOT VARIANT...
set -euxo pipefail
source /mnt/sb/scripts/lib.sh
OUTROOT=$1; shift
for v in "$@"; do
  d=$OUTROOT/probe-$v
  mkdir -p "$d"
  start_variant "$v" "$d"
  server_record "$v" "$d/server.json"
  python3 "$SUMMA"/scripts/searchbench/campaign.py probe --engine "$(engine_of "$v")" \
    --searchbench "$SB" --out "$d" --port "$(port_of "$v")" --timeout 600 > "$d/probe.log" 2>&1 || { stop_variant "$v"; exit 1; }
  if [[ $(engine_of "$v") != luxir && $(engine_of "$v") != elasticsearch && $(engine_of "$v") != opensearch ]]; then
    curl -s "http://127.0.0.1:$(port_of "$v")/stats" > "$d/stats.json"
  fi
  stop_variant "$v"
  echo "PROBED $v $(date -u)"
done
echo PROBE-DONE
