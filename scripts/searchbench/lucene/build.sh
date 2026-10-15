#!/usr/bin/env bash
# Fetch the pinned Lucene jars (SHA-256 checked) and compile the adapter with javac.
# Requires JAVA_HOME (JDK 21+). LUCENE_LIB and LUCENE_BUILD relocate the outputs.
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
lib=${LUCENE_LIB:-$here/lib}
build=${LUCENE_BUILD:-$here/build}
repo=${MAVEN_REPO:-https://repo1.maven.org/maven2}
: "${JAVA_HOME:?set JAVA_HOME to a JDK 21 or newer}"
mkdir -p "$lib" "$build"
while read -r sum path; do
  [[ -z $sum || $sum == \#* ]] && continue
  jar=$lib/${path##*/}
  if [[ ! -f $jar ]]; then
    curl -fsSL --retry 3 -o "$jar.part" "$repo/$path"
    mv "$jar.part" "$jar"
  fi
  if ! echo "$sum  $jar" | sha256sum -c --quiet -; then
    echo "checksum mismatch for $jar" >&2
    exit 1
  fi
done < "$here/jars.txt"
rm -rf "$build/classes"
"$JAVA_HOME/bin/javac" --release 21 -Xlint:all -Werror -encoding UTF-8 \
  -cp "$lib/*" -d "$build/classes" "$here"/src/searchbench/lucene/*.java
"$JAVA_HOME/bin/jar" --create --file "$build/searchbench-lucene.jar" \
  --main-class searchbench.lucene.Main -C "$build/classes" .
echo "built $build/searchbench-lucene.jar"
