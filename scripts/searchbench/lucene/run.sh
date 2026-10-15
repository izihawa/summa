#!/usr/bin/env bash
# Run the adapter with the campaign JVM posture. Arguments go to searchbench.lucene.Main:
#   run.sh index INDEX CORPUS.jsonl --threads 30 [--bp]
#   run.sh serve INDEX PORT --workers 30
# LUCENE_HEAP (default 8g) matches Searchbench's fixed Elasticsearch/OpenSearch heap.
# LUCENE_JAVA_OPTS appends JVM flags; record any override with the results.
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
lib=${LUCENE_LIB:-$here/lib}
build=${LUCENE_BUILD:-$here/build}
: "${JAVA_HOME:?set JAVA_HOME to a JDK 21 or newer}"
heap=${LUCENE_HEAP:-8g}
# shellcheck disable=SC2086
exec "$JAVA_HOME/bin/java" \
  "-Xms$heap" "-Xmx$heap" -XX:+UseG1GC -XX:+AlwaysPreTouch \
  --add-modules jdk.incubator.vector --enable-native-access=ALL-UNNAMED \
  ${LUCENE_JAVA_OPTS:-} \
  -cp "$build/searchbench-lucene.jar:$lib/*" searchbench.lucene.Main "$@"
