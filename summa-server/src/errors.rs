use derive_builder::UninitializedFieldError;
use std::convert::{From, Infallible};
use std::path::PathBuf;
use summa_core::DocumentParsingError;
use tantivy::schema::FieldType;
use tantivy::TantivyError;
use tracing::warn;

#[derive(thiserror::Error, Debug)]
pub enum ValidationError {
    #[error("aliased_error: {0}")]
    Aliased(String),
    #[error("builder_error: {0}")]
    BuilderError(String),
    #[error("empty_argument_error: {0}")]
    EmptyArgument(String),
    #[error("existing_config_error: {0}")]
    ExistingConfig(PathBuf),
    #[error("existing_consumers_error: {0}")]
    ExistingConsumers(String),
    #[error("existing_consumer_error: {0}")]
    ExistingConsumer(String),
    #[error("existing_index_error: {0}")]
    ExistingIndex(String),
    #[error("existing_path_error: {0}")]
    ExistingPath(PathBuf),
    #[error("invalid_aggregation_error")]
    InvalidAggregation,
    #[error("index_argument_error: {0}")]
    InvalidArgument(String),
    #[error("invalid_fast_field_type_error: ({field:?}, {field_type:?}, {tantivy_error:?})")]
    InvalidFastFieldType {
        field: String,
        field_type: FieldType,
        tantivy_error: TantivyError,
    },
    #[error("invalid_memory_error: {0}")]
    InvalidMemory(u64),
    #[error("invalid_primary_key_type_error: {0:?}")]
    InvalidPrimaryKeyType(FieldType),
    #[error("invalid_schema_error: {0}")]
    InvalidSchema(String),
    #[error("invalid_threads_number_error: {0}")]
    InvalidThreadsNumber(u64),
    #[error("missing_consumer_error: {0}")]
    MissingConsumer(String),
    #[error("missing_index_error: {0}")]
    MissingIndex(String),
    #[error("missing_default_field_error: {0}")]
    MissingDefaultField(String),
    #[error("missing_field_error: {0}")]
    MissingField(String),
    #[error("missing_multi_field_error: {0}")]
    MissingMultiField(String),
    #[error("missing_path_error: {0}")]
    MissingPath(PathBuf),
    #[error("missing_primary_key_error: {0:?}")]
    MissingPrimaryKey(Option<String>),
    #[error("missing_range")]
    MissingRange,
    #[error("missing_schema: {0}")]
    MissingSchema(String),
    #[error("missing_snippet_field: {0}")]
    MissingSnippetField(String),
    #[error("required_fast_field: {0}")]
    RequiredFastField(String),
    #[error("utf8_error: {0}")]
    Utf8(std::str::Utf8Error),
}

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("addr_parse_error: {0}")]
    AddrParse(std::net::AddrParseError),
    #[error("arc_index_writer_holder_leaked_error")]
    ArcIndexWriterHolderLeaked,
    #[error("canceled_error")]
    Canceled,
    #[error("config_error: {0}")]
    Config(config::ConfigError),
    #[error("document_parsing_error: {0}")]
    DocumentParsing(DocumentParsingError),
    #[error("empty_query_error")]
    EmptyQuery,
    #[error("fast_eval_error: {0:?}")]
    FastEval(fasteval2::Error),
    #[error("hyper_error: {0}")]
    Hyper(hyper::Error),
    #[error("hyper_http_error: {0}")]
    HttpHyper(hyper::http::Error),
    #[error("infallible")]
    Infallible,
    #[error("internal_error")]
    Internal,
    #[error("{0:?}: {1:?}")]
    InvalidFieldType(String, FieldType),
    #[error("{0:?}")]
    InvalidSyntax(String),
    #[error("{0:?} for {1:?}")]
    InvalidTantivySyntax(tantivy::query::QueryParserError, String),
    #[error("invalid_config_error: {0}")]
    InvalidConfig(String),
    #[error("{0:?}")]
    IO((std::io::Error, Option<PathBuf>)),
    #[error("json_error: {0}")]
    Json(serde_json::Error),
    #[error("{0}")]
    Kafka(rdkafka::error::KafkaError),
    #[error("tantivy_error: {0}")]
    Tantivy(tantivy::TantivyError),
    #[error("poison")]
    Poison,
    #[error("summa_core: {0}")]
    Core(summa_core::Error),
    #[error("timeout_error")]
    Timeout,
    #[error("tonic_error: {0}")]
    Tonic(tonic::transport::Error),
    #[error("transition_state_error")]
    TransitionState,
    #[error("unbound_document_error")]
    UnboundDocument,
    #[error("unknown_directory_error: {0}")]
    UnknownDirectory(String),
    #[error("upstream_http_status_error: {0}")]
    UpstreamHttpStatus(hyper::StatusCode, String),
    #[error("utf8_error: {0}")]
    Utf8(std::str::Utf8Error),
    #[error("{0}")]
    Validation(ValidationError),
    #[error("yaml_error: {0}")]
    Yaml(serde_yaml::Error),
}

impl From<ValidationError> for Error {
    fn from(error: ValidationError) -> Self {
        Error::Validation(error)
    }
}

impl From<UninitializedFieldError> for ValidationError {
    fn from(ufe: UninitializedFieldError) -> ValidationError {
        ValidationError::BuilderError(ufe.to_string())
    }
}

impl From<config::ConfigError> for Error {
    fn from(error: config::ConfigError) -> Self {
        Error::Config(error)
    }
}

impl From<hyper::Error> for Error {
    fn from(error: hyper::Error) -> Self {
        Error::Hyper(error)
    }
}

impl From<hyper::http::Error> for Error {
    fn from(error: hyper::http::Error) -> Self {
        Error::HttpHyper(error)
    }
}

impl From<rdkafka::error::KafkaError> for Error {
    fn from(error: rdkafka::error::KafkaError) -> Self {
        Error::Kafka(error)
    }
}

impl From<DocumentParsingError> for Error {
    fn from(error: DocumentParsingError) -> Self {
        Error::DocumentParsing(error)
    }
}

impl<T> From<std::sync::PoisonError<T>> for Error {
    fn from(_: std::sync::PoisonError<T>) -> Self {
        Error::Poison
    }
}

impl From<summa_core::Error> for Error {
    fn from(error: summa_core::Error) -> Self {
        Error::Core(error)
    }
}

impl From<serde_yaml::Error> for Error {
    fn from(error: serde_yaml::Error) -> Self {
        Error::Yaml(error)
    }
}

impl From<serde_json::Error> for Error {
    fn from(error: serde_json::Error) -> Self {
        Error::Json(error)
    }
}

impl From<std::io::Error> for Error {
    fn from(error: std::io::Error) -> Self {
        Error::IO((error, None))
    }
}

impl From<std::net::AddrParseError> for Error {
    fn from(error: std::net::AddrParseError) -> Self {
        Error::AddrParse(error)
    }
}

impl From<std::str::Utf8Error> for ValidationError {
    fn from(error: std::str::Utf8Error) -> Self {
        ValidationError::Utf8(error)
    }
}

impl From<std::str::Utf8Error> for Error {
    fn from(error: std::str::Utf8Error) -> Self {
        Error::Utf8(error)
    }
}

impl From<tantivy::TantivyError> for Error {
    fn from(error: tantivy::TantivyError) -> Self {
        Error::Tantivy(error)
    }
}

impl From<tokio::time::error::Elapsed> for Error {
    fn from(_error: tokio::time::error::Elapsed) -> Self {
        Error::Timeout
    }
}

impl From<tokio::task::JoinError> for Error {
    fn from(_error: tokio::task::JoinError) -> Self {
        Error::Internal
    }
}

impl From<tonic::transport::Error> for Error {
    fn from(error: tonic::transport::Error) -> Self {
        Error::Tonic(error)
    }
}

impl From<fasteval2::Error> for Error {
    fn from(error: fasteval2::Error) -> Self {
        Error::FastEval(error)
    }
}

impl From<Infallible> for Error {
    fn from(_: Infallible) -> Self {
        Error::Infallible
    }
}

impl From<Error> for tonic::Status {
    fn from(error: Error) -> Self {
        warn!(action = "error", error = ?error);
        tonic::Status::new(
            match error {
                Error::IO((ref io_error, _)) => match io_error.kind() {
                    std::io::ErrorKind::PermissionDenied => tonic::Code::PermissionDenied,
                    _ => tonic::Code::Internal,
                },
                Error::Tantivy(_) => tonic::Code::InvalidArgument,
                Error::Validation(ValidationError::MissingConsumer(_)) | Error::Validation(ValidationError::MissingIndex(_)) => tonic::Code::NotFound,
                Error::Validation(_) => tonic::Code::InvalidArgument,
                _ => tonic::Code::Internal,
            },
            format!("{}", error),
        )
    }
}

impl From<ValidationError> for tonic::Status {
    fn from(error: ValidationError) -> Self {
        tonic::Status::from(Error::Validation(error))
    }
}

pub type SummaServerResult<T> = Result<T, Error>;