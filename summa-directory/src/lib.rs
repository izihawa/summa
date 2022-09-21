// Copyright (C) 2022 Quickwit, Inc.
//
// Quickwit is offered under the AGPL v3.0 and as commercial software.
// For commercial licensing, contact us at hello@quickwit.io.
//
// AGPL:
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

//! This crate contains all of the building pieces that make quickwit's IO possible.
//!
//! - The `StorageDirectory` justs wraps a `Storage` trait to make it compatible with tantivy's
//!   Directory API.
//! - The `BundleDirectory` bundles multiple files into a single file.
//! - The `HotDirectory` wraps another directory with a static cache.
//! - The `CachingDirectory` wraps a Directory with a dynamic cache.
//! - The `DebugDirectory` acts as a proxy to another directory to instrument it and record all of
//!   its IO.

pub mod caching_directory;
pub mod debug_proxy_directory;
pub mod hot_cache_directory;
pub mod memory_sized_cache;
pub mod noop_writer;
pub mod slice_address;
pub mod stored_item;

macro_rules! read_only_directory {
    () => {
        fn atomic_write(&self, _path: &Path, _data: &[u8]) -> io::Result<()> {
            unimplemented!("read-only")
        }

        fn delete(&self, _path: &Path) -> Result<(), tantivy::directory::error::DeleteError> {
            unimplemented!("read-only")
        }

        fn open_write(&self, _path: &Path) -> Result<tantivy::directory::WritePtr, tantivy::directory::error::OpenWriteError> {
            unimplemented!("read-only")
        }

        fn sync_directory(&self) -> io::Result<()> {
            unimplemented!("read-only")
        }

        fn watch(&self, _watch_callback: tantivy::directory::WatchCallback) -> tantivy::Result<tantivy::directory::WatchHandle> {
            Ok(tantivy::directory::WatchHandle::empty())
        }

        fn acquire_lock(&self, _lock: &tantivy::directory::Lock) -> Result<tantivy::directory::DirectoryLock, tantivy::directory::error::LockError> {
            Ok(tantivy::directory::DirectoryLock::from(Box::new(|| {})))
        }
    };
}
pub(crate) use read_only_directory;
