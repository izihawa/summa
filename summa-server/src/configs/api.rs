use serde::{Deserialize, Serialize};
use summa_core::errors::BuilderError;

#[derive(Builder, Clone, Debug, Serialize, Deserialize)]
#[builder(default, build_fn(error = "BuilderError"))]
pub struct Config {
    /// Summa API GRPC address in format: `127.0.0.1:8082`
    pub grpc_endpoint: String,
    /// Summa API GRPC-web address in format: `127.0.0.1:8081`
    pub http_endpoint: Option<String>,
    /// Maximum frame size in bytes for HTTP2 transport
    pub max_frame_size_bytes: Option<u32>,
    /// Maximum number of in-flight requests
    pub keep_alive_timeout_seconds: u64,
    pub max_connection_age_seconds: u64,
    pub max_connection_age_grace_seconds: u64,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            grpc_endpoint: "127.0.0.1:8082".to_string(),
            http_endpoint: None,
            max_frame_size_bytes: Some(40 * 1024 * 1024),
            keep_alive_timeout_seconds: 5,
            max_connection_age_seconds: 60,
            max_connection_age_grace_seconds: 300,
        }
    }
}
