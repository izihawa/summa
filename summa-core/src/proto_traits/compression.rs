use summa_proto::proto;
use tantivy::store::{Compressor, ZstdCompressor};

use crate::proto_traits::Wrapper;

impl From<Wrapper<proto::Compression>> for Compressor {
    fn from(compression: Wrapper<proto::Compression>) -> Self {
        match compression.into_inner() {
            proto::Compression::None => Compressor::None,
            proto::Compression::Brotli => Compressor::Brotli,
            proto::Compression::Lz4 => Compressor::Lz4,
            proto::Compression::Snappy => Compressor::Snappy,
            proto::Compression::Zstd => Compressor::Zstd(ZstdCompressor { compression_level: None }),
        }
    }
}

impl From<Compressor> for Wrapper<proto::Compression> {
    fn from(compressor: Compressor) -> Self {
        Wrapper::from(match compressor {
            Compressor::None => proto::Compression::None,
            Compressor::Brotli => proto::Compression::Brotli,
            Compressor::Lz4 => proto::Compression::Lz4,
            Compressor::Snappy => proto::Compression::Snappy,
            Compressor::Zstd(_) => proto::Compression::Zstd,
        })
    }
}