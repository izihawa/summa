use crate::configs::{IndexEngine, IpfsConfig};
use crate::errors::SummaResult;
use crate::search_engine::{IndexFilePath, IndexHolder};
use crate::utils::sync::Handler;
use hyper::client::HttpConnector;
use hyper::header::HeaderName;
use hyper::http::uri::Builder;
use hyper::http::HeaderValue;
use hyper::{body, Client, HeaderMap, Method, Request, Uri};
use itertools::Itertools;
use izihawa_hyper_multipart::client::multipart;
use serde::{de, Deserialize, Deserializer};
use serde_json::Value;
use std::fmt::{Debug, Formatter};
use std::os::unix::fs::PermissionsExt;
use std::path::{Path, PathBuf};
use std::str::FromStr;
use tokio::fs::File;
use tokio_util::compat::TokioAsyncReadCompatExt;
use tracing::{info, instrument};

#[derive(Clone, Default)]
pub struct BeaconService {
    ipfs_client: Client<HttpConnector>,
    ipfs_config: IpfsConfig,
}

#[derive(Clone, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct AddFileResponse {
    pub name: String,
    pub hash: String,
    #[serde(deserialize_with = "desize")]
    pub size: u64,
}

fn desize<'de, D: Deserializer<'de>>(deserializer: D) -> Result<u64, D::Error> {
    Ok(match Value::deserialize(deserializer)? {
        Value::String(s) => s.parse().map_err(de::Error::custom)?,
        Value::Number(num) => num.as_u64().ok_or_else(|| de::Error::custom("Invalid number"))? as u64,
        _ => return Err(de::Error::custom("wrong type")),
    })
}

impl Debug for BeaconService {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        self.ipfs_config.fmt(f)
    }
}

impl BeaconService {
    pub fn new(ipfs_config: IpfsConfig) -> BeaconService {
        let ipfs_client = Client::builder().build(HttpConnector::new());
        BeaconService { ipfs_client, ipfs_config }
    }

    fn generate_uri(&self, path: &str, params: &[(&str, &str)]) -> SummaResult<Uri> {
        Ok(Builder::new()
            .scheme("http")
            .authority(self.ipfs_config.api_endpoint.to_string())
            .path_and_query(format!(
                "{}?{}",
                path,
                params.iter().map(|(name, value)| format!("{}={}", name, value)).join("&")
            ))
            .build()?)
    }

    #[instrument(skip_all, fields(index_name = ?index_holder.index_name()))]
    pub async fn publish_index(&self, index_holder: Handler<IndexHolder>) -> SummaResult<Vec<AddFileResponse>> {
        let index_path = {
            match &index_holder.index_config_proxy().read().await.index_engine {
                IndexEngine::File(index_path) => index_path.to_path_buf(),
                _ => unreachable!(),
            }
        };
        let index_updater = index_holder.index_updater();
        let all_files_response = {
            let mut index_updater = index_updater.write().await;
            index_updater
                .prepare_index_publishing(|files: Vec<IndexFilePath>| async move {
                    let mutable_files = files.iter().filter_map(|file| (!file.is_immutable()).then(|| file.clone())).collect::<Vec<_>>();
                    let all_files_response = self.add_files(&index_path, &files, true).await?;
                    self.add_files(&index_path, &mutable_files, true).await?;
                    Ok(all_files_response)
                })
                .await?
        };
        Ok(all_files_response)
    }

    async fn add_files<P1: AsRef<Path> + Debug>(&self, directory: P1, index_file_paths: &[IndexFilePath], no_copy: bool) -> SummaResult<Vec<AddFileResponse>> {
        let full_directory_path = directory.as_ref();
        let directory_name = PathBuf::from(full_directory_path.file_name().unwrap());
        let mut form = multipart::Form::default();

        info!(action = "prepare_request", directory = ?directory, index_file_paths = ?index_file_paths);

        let uri = self.generate_uri("/api/v0/add", &vec![("nocopy", "true"), ("cid-version", "1"), ("hash", "blake3")])?;
        for index_file_path in index_file_paths {
            let abs_path = full_directory_path.join(index_file_path.path());

            let headers = no_copy.then(|| {
                let mut headers = HeaderMap::new();
                headers.insert(
                    HeaderName::from_str("Abspath").unwrap(),
                    HeaderValue::from_str(&abs_path.to_string_lossy()).unwrap(),
                );
                headers
            });

            // ToDo: This part is worth to redesign. `meta.json` file should be created with appropriate permissions
            // ToDo: but it requires changes in `tempfile` crate to add such possibility and changes to `tantivy` to use
            // ToDo: the possibility
            tokio::fs::set_permissions(&abs_path, std::fs::Permissions::from_mode(0o644)).await.unwrap();
            form.add_async_reader_file(
                "file",
                File::open(abs_path).await.unwrap().compat(),
                directory_name.join(index_file_path.path()).to_string_lossy(),
                headers,
            );
        }

        let request = form
            .set_body_convert::<hyper::Body, multipart::Body>(Request::builder().method(Method::POST).uri(uri.clone()))
            .unwrap();

        info!(action = "ipfs_request", request = ?request);
        let response = self.ipfs_client.request(request).await?;
        let response = body::to_bytes(response.into_body()).await?;
        let text = std::str::from_utf8(&response).unwrap();
        let add_file_responses = text
            .lines()
            .filter(|line| !line.is_empty())
            .map(|line| serde_json::from_str::<AddFileResponse>(line).unwrap())
            .collect::<Vec<_>>();
        Ok(add_file_responses)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::io::AsyncWriteExt;

    #[tokio::test]
    async fn test_base() {
        let beacon_service = BeaconService::new(IpfsConfig::default());

        let test_directory = tempdir::TempDir::new("test_base").unwrap();

        let test_file_name = "test_file.txt";
        let full_test_file_path = test_directory.path().join(test_file_name);
        File::create(full_test_file_path).await.unwrap().write_all(b"Hello, world!").await.unwrap();

        let meta_file_name = "meta.json";
        let full_meta_file_path = test_directory.path().join(meta_file_name);
        File::create(full_meta_file_path).await.unwrap().write_all(b"{}").await.unwrap();

        beacon_service
            .add_files(
                test_directory.into_path(),
                &[
                    IndexFilePath::new(PathBuf::from(test_file_name), true),
                    IndexFilePath::new(PathBuf::from(meta_file_name), false),
                ],
                false,
            )
            .await
            .unwrap();
        panic!();
    }
}
