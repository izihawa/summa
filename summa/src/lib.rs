pub mod errors;
pub mod proto_traits;

#[allow(clippy::derive_partial_eq_without_eq)]
pub mod proto {
    #[cfg(feature = "grpc")]
    tonic::include_proto!("summa.proto");
    #[cfg(not(feature = "grpc"))]
    include!(concat!(env!("OUT_DIR"), "/summa.proto.rs"));
}
