use summa_core::directories::{ExternalRequest, ExternalResponse, Header, RequestError};
use tokio::sync::mpsc::unbounded_channel;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use wasm_bindgen_futures::spawn_local;

#[wasm_bindgen(raw_module = "../src/gate.ts")]
extern "C" {
    #[wasm_bindgen(catch)]
    pub async fn request_async(method: String, url: String, headers: JsValue) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(catch)]
    pub async fn verified_request_async(method: String, url: String, headers: JsValue) -> Result<JsValue, JsValue>;
}

#[derive(Clone, Debug)]
pub struct JsExternalRequest {
    pub method: String,
    pub url: String,
    pub headers: Vec<Header>,
}

#[async_trait]
impl ExternalRequest for JsExternalRequest {
    fn new(method: &str, url: &str, headers: &[Header]) -> Self
    where
        Self: Sized,
    {
        let default_headers = &[];
        JsExternalRequest {
            method: method.to_string(),
            url: url.to_string(),
            headers: Vec::from_iter(headers.iter().chain(default_headers.iter()).cloned()),
        }
    }

    fn request(self) -> Result<ExternalResponse, RequestError> {
        unimplemented!()
    }

    async fn request_async(self) -> Result<ExternalResponse, RequestError> {
        let (sender, mut receiver) = unbounded_channel();
        spawn_local(async move {
            let headers = serde_wasm_bindgen::to_value(&self.headers).expect("headers are not serializable");
            let response = if self.url.starts_with("ipns://") || self.url.starts_with("ipfs://") {
                verified_request_async(self.method, self.url, headers).await
            } else {
                request_async(self.method, self.url, headers).await
            };
            let response = match response {
                Ok(response) => {
                    match serde_wasm_bindgen::from_value(response) {
                        Ok(response) => Ok(response),
                        Err(error) => Err(RequestError::External(format!("{error:?}"))),
                    }
                }
                Err(error) => Err(RequestError::External(format!("{error:?}"))),
            };
            sender.send(response).unwrap_throw();
        });
        let response = receiver.recv().await.unwrap_throw()?;
        Ok(response)
    }

    fn url(&self) -> &str {
        &self.url
    }
}
