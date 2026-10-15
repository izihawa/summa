#!/usr/bin/env bash
set -euxo pipefail
export TMPDIR=/mnt/sb/tmp RUSTUP_HOME=/mnt/sb/rustup CARGO_HOME=/mnt/sb/cargo CARGO_TARGET_DIR=/mnt/sb/target
export PATH=/mnt/sb/cargo/bin:$PATH
cd /mnt/sb/summa
date -u
RUSTFLAGS='-C target-cpu=native' cargo +1.98.1 build --locked --release -p summa-server --example searchbench_http
ls -la /mnt/sb/target/release/examples/searchbench_http
sha256sum /mnt/sb/target/release/examples/searchbench_http
date -u
echo BUILD-DONE
