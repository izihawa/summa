use std::collections::HashMap;
use std::fmt::{Debug, Formatter};
use std::future::Future;
use std::sync::Arc;

use itertools::Itertools;
use summa_proto::proto;
use tokio::sync::RwLock;
use tracing::info;

use super::IndexHolder;
use crate::configs::{ConfigProxy, DirectProxy};
use crate::errors::{SummaResult, ValidationError};
use crate::utils::sync::{Handler, OwningHandler};
use crate::Error;

/// The main struct responsible for combining different indices and managing their lifetime.
#[derive(Clone)]
pub struct IndexRegistry {
    core_config_holder: Arc<dyn ConfigProxy<crate::configs::core::Config>>,
    index_holders: Arc<RwLock<HashMap<String, OwningHandler<IndexHolder>>>>,
}

impl Default for IndexRegistry {
    fn default() -> Self {
        IndexRegistry {
            core_config_holder: Arc::new(DirectProxy::default()),
            index_holders: Arc::default(),
        }
    }
}

impl Debug for IndexRegistry {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("IndexRegistry").field("index_holders", &self.index_holders).finish()
    }
}

impl IndexRegistry {
    pub fn new(core_config: &Arc<dyn ConfigProxy<crate::configs::core::Config>>) -> IndexRegistry {
        IndexRegistry {
            core_config_holder: core_config.clone(),
            index_holders: Arc::default(),
        }
    }

    /// Read-locked `HashMap` of all indices
    pub fn index_holders(&self) -> &Arc<RwLock<HashMap<String, OwningHandler<IndexHolder>>>> {
        &self.index_holders
    }

    pub async fn index_holders_cloned(&self) -> HashMap<String, Handler<IndexHolder>> {
        self.index_holders()
            .read()
            .await
            .iter()
            .map(|(index_name, handler)| (index_name.to_string(), handler.handler()))
            .collect()
    }

    pub async fn clear(self) {
        self.index_holders().write().await.clear();
    }

    /// Returns `Handler` to `IndexHolder`.
    ///
    /// It is safe to keep `Handler<IndexHolder>` cause `Index` won't be deleted until `Handler` is alive.
    /// Though, `IndexHolder` can be removed from the registry of `IndexHolder`s to prevent new queries
    pub async fn get_index_holder(&self, index_alias: &str) -> SummaResult<Handler<IndexHolder>> {
        self.get_index_holder_by_name(
            self.core_config_holder
                .read()
                .await
                .get()
                .resolve_index_alias(index_alias)
                .as_deref()
                .unwrap_or(index_alias),
        )
        .await
    }

    /// Retrieve `IndexHolder` by its name
    pub async fn get_index_holder_by_name(&self, index_name: &str) -> SummaResult<Handler<IndexHolder>> {
        Ok(self
            .index_holders()
            .read()
            .await
            .get(index_name)
            .ok_or_else(|| Error::Validation(Box::new(ValidationError::MissingIndex(index_name.to_owned()))))?
            .handler())
    }

    /// Add new index to `IndexRegistry`
    pub async fn add(&self, index_holder: IndexHolder) -> SummaResult<Handler<IndexHolder>> {
        let index_holder = OwningHandler::new(index_holder);
        let index_holder_handler = index_holder.handler();
        self.index_holders().write().await.insert(index_holder.index_name().to_string(), index_holder);
        let segments = index_holder_handler
            .index()
            .searchable_segments_async()
            .await?
            .into_iter()
            .map(|segment| segment.id())
            .collect::<Vec<_>>();
        info!(action = "added", index_name = ?index_holder_handler.index_name(), segments = ?segments);
        Ok(index_holder_handler)
    }

    /// Deletes index from `IndexRegistry`
    pub async fn delete(&self, index_name: &str) {
        self.index_holders().write().await.remove(index_name);
    }

    /// Searches in several indices simultaneously and merges results
    pub async fn search_futures(
        &self,
        index_queries: &[proto::IndexQuery],
    ) -> SummaResult<Vec<impl Future<Output = SummaResult<Vec<proto::CollectorOutput>>>>> {
        index_queries
            .iter()
            .cloned()
            .map(|index_query| {
                let this = self.clone();
                Ok(async move {
                    let index_holder = this.get_index_holder(&index_query.index_alias).await?;
                    index_holder
                        .search(
                            &index_query.index_alias,
                            index_query.query.as_ref().unwrap_or_else(|| &proto::Query {
                                query: Some(proto::query::Query::All(proto::AllQuery {})),
                            }),
                            &index_query.collectors,
                        )
                        .await
                })
            })
            .collect::<SummaResult<Vec<_>>>()
    }

    /// Merges several `proto::CollectorOutput`
    pub fn merge_responses(&self, collectors_outputs: &[Vec<proto::CollectorOutput>]) -> SummaResult<Vec<proto::CollectorOutput>> {
        if collectors_outputs.is_empty() {
            return Err(Error::Validation(Box::new(ValidationError::EmptyArgument("collectors".to_string()))));
        }
        let mut merged_response = vec![];
        for (ix, first_collector_output) in collectors_outputs[0].iter().enumerate() {
            merged_response.push(proto::CollectorOutput {
                collector_output: match &first_collector_output.collector_output {
                    Some(proto::collector_output::CollectorOutput::Aggregation(_)) => todo!(),
                    Some(proto::collector_output::CollectorOutput::Count(_)) => {
                        let counts = collectors_outputs
                            .iter()
                            .map(|collectors_output| collectors_output[ix].as_count().expect("expected count collector").count);
                        Some(proto::collector_output::CollectorOutput::Count(proto::CountCollectorOutput {
                            count: counts.sum(),
                        }))
                    }
                    Some(proto::collector_output::CollectorOutput::Facet(_)) => todo!(),
                    Some(proto::collector_output::CollectorOutput::ReservoirSampling(_)) => todo!(),
                    Some(proto::collector_output::CollectorOutput::TopDocs(_)) => {
                        let top_docs = collectors_outputs
                            .iter()
                            .map(|collectors_output| collectors_output[ix].as_top_docs().expect("expected top_docs collector"));
                        let has_next = top_docs.clone().any(|top_docs| top_docs.has_next);
                        let mut scored_documents: Vec<_> = top_docs
                            .map(|top_docs| top_docs.scored_documents.iter())
                            .kmerge_by(|a, b| a > b)
                            .cloned()
                            .collect();
                        for (position, scored_document) in scored_documents.iter_mut().enumerate() {
                            scored_document.position = position as u32;
                        }
                        Some(proto::collector_output::CollectorOutput::TopDocs(proto::TopDocsCollectorOutput {
                            has_next,
                            scored_documents,
                        }))
                    }
                    None => todo!(),
                },
            });
        }
        Ok(merged_response)
    }
}
