#!/usr/bin/env bash
set -euxo pipefail
export TMPDIR=/mnt/sb/tmp
mkdir -p /mnt/sb/tmp /mnt/sb/aptcache /mnt/sb/logs
date -u
sudo apt-get -o Dir::Cache::Archives=/mnt/sb/aptcache install -y -q build-essential cmake pkg-config protobuf-compiler ninja-build zip unzip curl tar libssl-dev
sudo rm -rf /mnt/sb/aptcache/*.deb
df -h /
export RUSTUP_HOME=/mnt/sb/rustup CARGO_HOME=/mnt/sb/cargo
curl -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path --default-toolchain 1.98.1 --profile minimal
/mnt/sb/cargo/bin/rustc --version
cd /mnt/sb
git clone -q https://github.com/SpaceFrontiers/summa summa
cd summa
git config user.email "bench@localhost"; git config user.name "searchbench-vm"
git fetch -q origin searchbench/lucene-adapter
git checkout -q -b campaign-20261015 origin/main
git cherry-pick FETCH_HEAD
git log --oneline -3
date -u
echo SETUP1-DONE
