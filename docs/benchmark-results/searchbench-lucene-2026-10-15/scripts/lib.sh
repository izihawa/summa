# shellcheck shell=bash
# Shared engine control for the 2026-10-15 campaign. Source, do not execute.
export SB=/mnt/sb/searchbench
export SUMMA=/mnt/sb/summa
export SUMMA_BIN=/mnt/sb/bin/searchbench_http
export JAVA_HOME_LUCENE=$SB/engines/elasticsearch-9.5.4/jdk
export SERVER_CORES=0-14,16-30
export CLIENT_CORES=15,31
export SEARCHBENCH_QUERY_CACHE=off
export LUXIR_BIN=/mnt/sb/luxir-release/luxir-0.1.0-linux-x86_64-v4
export LUCENE_HEAP=8g

engine_of() {
  case $1 in
    summa-default|summa-rgb) echo summa ;;
    lucene|lucene-bp) echo lucene ;;
    *) echo "$1" ;;
  esac
}
port_of() {
  case $1 in
    summa-*|lucene*) echo 9410 ;;
    luxir) echo 9400 ;;
    elasticsearch) echo 9202 ;;
    opensearch) echo 9201 ;;
  esac
}
index_of() {
  case $1 in
    summa-default) echo /mnt/sb/indexes/summa-default ;;
    summa-rgb) echo /mnt/sb/indexes/summa-rgb ;;
    lucene) echo /mnt/sb/indexes/lucene-plain ;;
    lucene-bp) echo /mnt/sb/indexes/lucene-bp ;;
    *) echo "$SB/data/$1/10m-searchbench-merged" ;;
  esac
}
wait_http() {
  local url=$1 pid=$2
  for _ in $(seq 1 600); do
    curl -sf "$url" >/dev/null 2>&1 && return 0
    kill -0 "$pid" 2>/dev/null || return 1
    sleep 1
  done
  return 1
}
# start_variant VARIANT LOGDIR -> sets SERVER_PID, SERVER_CMD
start_variant() {
  local v=$1 logdir=$2 port idx
  port=$(port_of "$v"); idx=$(index_of "$v")
  mkdir -p "$logdir"
  case $v in
    summa-*)
      SERVER_CMD="taskset -c $SERVER_CORES $SUMMA_BIN serve $idx $port 30"
      taskset -c "$SERVER_CORES" "$SUMMA_BIN" serve "$idx" "$port" 30 > "$logdir/server.log" 2>&1 &
      SERVER_PID=$!
      wait_http "http://127.0.0.1:$port/health" "$SERVER_PID" ;;
    lucene*)
      SERVER_CMD="JAVA_HOME=$JAVA_HOME_LUCENE LUCENE_HEAP=$LUCENE_HEAP taskset -c $SERVER_CORES $SUMMA/scripts/searchbench/lucene/run.sh serve $idx $port --workers 30"
      JAVA_HOME=$JAVA_HOME_LUCENE taskset -c "$SERVER_CORES" "$SUMMA/scripts/searchbench/lucene/run.sh" serve "$idx" "$port" --workers 30 > "$logdir/server.log" 2>&1 &
      SERVER_PID=$!
      wait_http "http://127.0.0.1:$port/health" "$SERVER_PID" ;;
    luxir|elasticsearch|opensearch)
      SERVER_CMD="SERVER_CORES=$SERVER_CORES SEARCHBENCH_QUERY_CACHE=off $SB/scripts/start-$v.sh"
      SERVER_PID=$("$SB/scripts/start-$v.sh" 2> "$logdir/server-start.log" | tail -n 1) ;;
  esac
  [[ "$SERVER_PID" =~ ^[0-9]+$ ]] && kill -0 "$SERVER_PID"
  echo "$v pid=$SERVER_PID" >&2
}
stop_variant() {
  local v=$1
  case $v in
    luxir|elasticsearch|opensearch) "$SB/scripts/stop-$v.sh" || true ;;
    *) kill "$SERVER_PID" 2>/dev/null || true ;;
  esac
  for _ in $(seq 1 120); do kill -0 "$SERVER_PID" 2>/dev/null || break; sleep 1; done
  kill -9 "$SERVER_PID" 2>/dev/null || true
  sleep 2
}
server_record() {
  local v=$1 out=$2 exe
  exe=$(readlink -f /proc/"$SERVER_PID"/exe)
  python3 - "$v" "$SERVER_PID" "$exe" "$SERVER_CMD" "$(index_of "$v")" > "$out" <<'PY'
import hashlib, json, os, sys
v, pid, exe, cmd, idx = sys.argv[1:]
aff = os.sched_getaffinity(int(pid))
cmdline = open(f"/proc/{pid}/cmdline", "rb").read().split(b"\0")
print(json.dumps({
  "variant": v, "pid": int(pid), "exe": exe,
  "binary_sha256": hashlib.sha256(open(exe, "rb").read()).hexdigest(),
  "cpus": sorted(aff), "command": cmd, "cmdline": [c.decode() for c in cmdline if c],
  "index": idx}, indent=2))
PY
}
