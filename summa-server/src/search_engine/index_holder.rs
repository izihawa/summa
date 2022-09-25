use crate::configs::{ConsumerConfig, IndexConfig, IndexConfigProxy, IndexEngine};
use crate::errors::SummaServerResult;
use crate::errors::{Error, ValidationError};
use crate::search_engine::IndexUpdater;
use crate::utils::sync::{Handler, OwningHandler};
use crate::utils::thread_handler::ThreadHandler;
use opentelemetry::metrics::{Unit, ValueRecorder};
use opentelemetry::{global, KeyValue};
use std::collections::HashSet;
use std::time::Duration;
use summa_core::default_tokenizers;
use summa_core::QueryParser;
use summa_core::{build_fruit_extractor, FruitExtractor};
use summa_proto::proto;
use tantivy::collector::MultiCollector;
use tantivy::schema::{Field, Schema};
use tantivy::{Index, IndexReader, IndexSettings, Opstamp, ReloadPolicy};
use tokio::fs::remove_dir_all;
use tokio::sync::RwLock;
use tokio::time;
use tokio::time::Instant;
use tracing::{info, info_span, instrument, trace, warn, Instrument};

pub struct IndexHolder {
    index_name: String,
    index_config_proxy: IndexConfigProxy,
    cached_schema: Schema,
    index_reader: IndexReader,
    query_parser: RwLock<QueryParser>,
    multi_fields: HashSet<Field>,
    /// All modifying operations are isolated inside `index_updater`
    index_updater: OwningHandler<RwLock<IndexUpdater>>,
    autocommit_thread: Option<ThreadHandler>,
    /// Counters
    search_times_meter: ValueRecorder<f64>,
}

/// Sets up standard Summa tokenizers
///
/// The set of tokenizers includes standard Tantivy tokenizers as well as `SummaTokenizer` that supports CJK
fn register_default_tokenizers(index: &Index) {
    for (tokenizer_name, tokenizer) in &default_tokenizers() {
        index.tokenizers().register(tokenizer_name, tokenizer.clone())
    }
}

fn setup_query_parser(index: &Index, index_config: &IndexConfig, schema: &Schema) -> QueryParser {
    QueryParser::for_index(index, index_config.default_fields.iter().map(|x| schema.get_field(x).unwrap()).collect())
}

impl IndexHolder {
    /// Sets up `IndexHolder`
    ///
    /// Creates the auto committing thread and consumers
    async fn setup(index_name: &str, index: Index, index_config_proxy: IndexConfigProxy) -> SummaServerResult<IndexHolder> {
        let index_config = index_config_proxy.read().await.get().clone();
        register_default_tokenizers(&index);

        let cached_schema = index.schema();
        let query_parser = RwLock::new(setup_query_parser(&index, &index_config, &cached_schema));

        let index_reader = index.reader_builder().reload_policy(ReloadPolicy::OnCommit).try_into()?;
        let index_updater = OwningHandler::new(RwLock::new(IndexUpdater::new(index, index_name, index_config_proxy.clone()).await?));

        let autocommit_thread = match index_config.autocommit_interval_ms {
            Some(interval_ms) => {
                let index_updater = index_updater.handler();
                let index_name = index_name.to_owned();
                let (shutdown_trigger, mut shutdown_tripwire) = async_broadcast::broadcast(1);
                let mut tick_task = time::interval(Duration::from_millis(interval_ms));
                Some(ThreadHandler::new(
                    tokio::spawn(
                        async move {
                            info!(action = "spawning_autocommit_thread", interval_ms = interval_ms);
                            // The first tick ticks immediately so we skip it
                            tick_task.tick().await;
                            loop {
                                tokio::select! {
                                    _ = tick_task.tick() => {
                                        info!(action = "autocommit_thread_tick");
                                        if let Ok(mut index_updater) = index_updater.try_write() {
                                            if let Err(error) = index_updater.commit().await {
                                                warn!(error = ?error);
                                            }
                                        }
                                    }
                                    _ = &mut shutdown_tripwire.recv() => {
                                        info!(action = "shutdown_autocommit_thread");
                                        break;
                                    }
                                }
                            }
                            Ok(())
                        }
                        .instrument(info_span!(parent: None, "autocommit_thread", index_name = ?index_name)),
                    ),
                    shutdown_trigger,
                ))
            }
            None => None,
        };

        let search_times_meter = global::meter("summa")
            .f64_value_recorder("search_times")
            .with_unit(Unit::new("seconds"))
            .with_description("Search times")
            .init();

        Ok(IndexHolder {
            index_name: String::from(index_name),
            autocommit_thread,
            query_parser,
            multi_fields: index_config.multi_fields.iter().map(|x| cached_schema.get_field(x).unwrap()).collect(),
            cached_schema,
            index_reader,
            index_updater,
            index_config_proxy,
            search_times_meter,
        })
    }

    pub(crate) async fn reload_query_parser(&self) {
        *self.query_parser.write().await = setup_query_parser(
            self.index_updater.read().await.index(),
            self.index_config_proxy.read().await.get(),
            &self.cached_schema,
        );
    }

    /// Creates index and sets it up via `setup`
    #[instrument(skip_all, fields(index_name = index_name))]
    pub(crate) async fn create(
        index_name: &str,
        schema: &Schema,
        index_config_proxy: IndexConfigProxy,
        index_settings: IndexSettings,
    ) -> SummaServerResult<IndexHolder> {
        let index = {
            let index_config = index_config_proxy.read().await;
            info!(action = "create", engine = ?index_config.get().index_engine, index_settings = ?index_settings);
            match &index_config.get().index_engine {
                IndexEngine::Memory(schema) => Index::builder().schema(schema.clone()).settings(index_settings).create_in_ram()?,
                IndexEngine::File(index_path) => {
                    if index_path.exists() {
                        return Err(ValidationError::ExistingPath(index_path.to_owned()).into());
                    }
                    std::fs::create_dir_all(index_path)?;
                    Index::builder().schema(schema.clone()).settings(index_settings).create_in_dir(index_path)?
                }
            }
        };
        info!(action = "created", index = ?index);
        IndexHolder::setup(index_name, index, index_config_proxy).await
    }

    /// Opens index and sets it up via `setup`
    #[instrument(skip_all, fields(index_name = index_name))]
    pub(crate) async fn open(index_name: &str, index_config_proxy: IndexConfigProxy) -> SummaServerResult<IndexHolder> {
        let index = match &index_config_proxy.read().await.get().index_engine {
            IndexEngine::Memory(schema) => Index::create_in_ram(schema.clone()),
            IndexEngine::File(index_path) => Index::open_in_dir(index_path)?,
        };
        IndexHolder::setup(index_name, index, index_config_proxy).await
    }

    /// Compression
    pub(crate) async fn compression(&self) -> proto::Compression {
        self.index_updater.read().await.index().settings().docstore_compression.into()
    }

    /// Index name
    pub(crate) fn index_config_proxy(&self) -> &IndexConfigProxy {
        &self.index_config_proxy
    }

    /// Index name
    pub(crate) fn index_name(&self) -> &str {
        &self.index_name
    }

    /// `IndexReader` singleton
    pub(crate) fn index_reader(&self) -> &IndexReader {
        &self.index_reader
    }

    /// `IndexUpdater` handler
    pub(crate) fn index_updater(&self) -> Handler<RwLock<IndexUpdater>> {
        self.index_updater.handler()
    }

    /// Index schema
    pub(crate) fn schema(&self) -> &Schema {
        &self.cached_schema
    }

    /// Consumer configs
    pub(crate) async fn get_consumer_config(&self, consumer_name: &str) -> SummaServerResult<ConsumerConfig> {
        Ok(self
            .index_config_proxy
            .read()
            .await
            .get()
            .consumer_configs
            .get(consumer_name)
            .ok_or_else(|| ValidationError::MissingConsumer(consumer_name.to_owned()))?
            .clone())
    }

    /// Stops `IndexHolder` instance
    ///
    /// Both autocommitting thread and consumers are stopped
    #[instrument(skip(self), fields(index_name = %self.index_name))]
    pub(crate) async fn stop(self) -> SummaServerResult<Opstamp> {
        if let Some(autocommit_thread) = self.autocommit_thread {
            autocommit_thread.stop().await?;
        }
        self.index_updater.into_inner().into_inner().stop_consumers_and_commit().await
    }

    /// Delete `IndexHolder` instance
    ///
    /// Both autocommitting thread and consumers are stopped, then `IndexConfig` is removed from `ApplicationConfig`
    /// and then directory with the index is deleted.
    #[instrument(skip(self), fields(index_name = %self.index_name))]
    pub(crate) async fn delete(self) -> SummaServerResult<()> {
        if let Some(autocommit_thread) = self.autocommit_thread {
            autocommit_thread.stop().await?;
        };
        self.index_updater.into_inner().into_inner().stop().await?;
        match self.index_config_proxy.delete().await.index_engine {
            IndexEngine::Memory(_) => (),
            IndexEngine::File(ref index_path) => {
                info!(action = "delete_directory");
                remove_dir_all(index_path).await.map_err(|e| Error::IO((e, Some(index_path.to_path_buf()))))?;
            }
        };
        Ok(())
    }

    /// Search `query` in the `IndexHolder` and collecting `Fruit` with a list of `collectors`
    pub(crate) async fn search(
        &self,
        external_index_alias: &str,
        query: &proto::Query,
        collectors: Vec<proto::Collector>,
    ) -> SummaServerResult<Vec<proto::CollectorOutput>> {
        let searcher = self.index_reader.searcher();
        let parsed_query = self.query_parser.read().await.parse_query(query)?;
        let mut multi_collector = MultiCollector::new();
        let mut extractors: Vec<Box<dyn FruitExtractor>> = collectors
            .into_iter()
            .map(|collector_proto| build_fruit_extractor(collector_proto, &parsed_query, &self.cached_schema, &mut multi_collector).map_err(Error::Core))
            .collect::<SummaServerResult<_>>()?;
        trace!(
            target: "query",
            index_name = ?self.index_name,
            query = ?query,
            parsed_query = ?parsed_query
        );
        let multi_fields = self.multi_fields.clone();
        let index_name = self.index_name.to_owned();
        let external_index_alias = external_index_alias.to_string();

        let search_times_meter = self.search_times_meter.clone();
        tokio::task::spawn_blocking(move || -> SummaServerResult<Vec<proto::CollectorOutput>> {
            let start_time = Instant::now();
            let mut multi_fruit = searcher.search(&parsed_query, &multi_collector)?;
            search_times_meter.record(start_time.elapsed().as_secs_f64(), &[KeyValue::new("index_name", index_name)]);
            Ok(extractors
                .drain(..)
                .map(|e| e.extract(&external_index_alias, &mut multi_fruit, &searcher, &multi_fields))
                .collect())
        })
        .await?
    }
}

impl std::fmt::Debug for IndexHolder {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        f.debug_struct("IndexHolder").field("index_name", &self.index_name).finish()
    }
}

#[cfg(test)]
pub(crate) mod tests {
    use super::*;
    use crate::logging;
    use crate::proto_traits::collector::shortcuts::{scored_doc, top_docs_collector, top_docs_collector_output, top_docs_collector_with_eval_expr};
    use crate::proto_traits::query::shortcuts::match_query;
    use crate::requests::CreateIndexRequestBuilder;
    use crate::search_engine::SummaDocument;
    use crate::services::index_service::tests::create_test_index_service;
    use crate::services::IndexService;
    use summa_core::SummaDocument;
    use summa_proto::proto_traits::collector::shortcuts::{scored_doc, top_docs_collector_output, top_docs_collector_with_eval_expr};
    use summa_proto::proto_traits::query::shortcuts::match_query;
    use tantivy::doc;
    use tantivy::schema::{IndexRecordOption, TextFieldIndexing, TextOptions, FAST, INDEXED, STORED};

    pub(crate) async fn create_test_index_holder(index_service: &IndexService, schema: &Schema) -> SummaServerResult<Handler<IndexHolder>> {
        index_service
            .create_index(
                CreateIndexRequestBuilder::default()
                    .index_name("test_index".to_owned())
                    .default_fields(vec!["title".to_owned(), "body".to_owned()])
                    .index_engine(proto::IndexEngine::Memory)
                    .schema(schema.clone())
                    .build()
                    .unwrap(),
            )
            .await
    }

    pub(crate) fn create_test_schema() -> Schema {
        let mut schema_builder = Schema::builder();

        schema_builder.add_i64_field("id", FAST | INDEXED | STORED);
        schema_builder.add_i64_field("issued_at", FAST | INDEXED | STORED);
        schema_builder.add_text_field(
            "title",
            TextOptions::default().set_stored().set_indexing_options(
                TextFieldIndexing::default()
                    .set_tokenizer("summa")
                    .set_index_option(IndexRecordOption::WithFreqsAndPositions),
            ),
        );
        schema_builder.add_text_field(
            "body",
            TextOptions::default().set_stored().set_indexing_options(
                TextFieldIndexing::default()
                    .set_tokenizer("summa")
                    .set_index_option(IndexRecordOption::WithFreqsAndPositions),
            ),
        );

        schema_builder.build()
    }

    #[tokio::test]
    async fn test_search() -> SummaServerResult<()> {
        logging::tests::initialize_default_once();
        let schema = create_test_schema();

        let root_path = tempdir::TempDir::new("summa_test").unwrap();
        let data_path = root_path.path().join("data");

        let index_service = create_test_index_service(&data_path).await;
        let index_holder = create_test_index_holder(&index_service, &schema).await?;

        index_holder.index_updater().read().await.index_document(SummaDocument::TantivyDocument(doc!(
            schema.get_field("id").unwrap() => 1i64,
            schema.get_field("title").unwrap() => "Headcrab",
            schema.get_field("body").unwrap() => "Physically, headcrabs are frail: a few bullets or a single strike from the player's melee weapon being sufficient to dispatch them. \
            They are also relatively slow-moving and their attacks inflict very little damage. However, they can leap long distances and heights. \
            Headcrabs seek out larger human hosts, which are converted into zombie-like mutants that attack any living lifeform nearby. \
            The converted humans are more resilient than an ordinary human would be and inherit the headcrab's resilience toward toxic and radioactive materials. \
            Headcrabs and headcrab zombies die slowly when they catch fire. \
            The games also establish that while headcrabs are parasites that prey on humans, they are also the prey of the creatures of their homeworld. \
            Bullsquids, Vortigaunts, barnacles and antlions will all eat headcrabs and Vortigaunts can be seen cooking them in several locations in-game.",
            schema.get_field("issued_at").unwrap() => 1652986134i64
        )))?;
        index_holder.index_updater().write().await.commit().await?;
        index_holder.index_reader().reload()?;
        assert_eq!(
            index_holder.search("index", &match_query("headcrabs"), vec![top_docs_collector(10)]).await?,
            vec![top_docs_collector_output(
                vec![scored_doc(
                    "{\
                        \"body\":\"Physically, headcrabs are frail: a few bullets or a single strike from the player's melee weapon being sufficient \
                        to dispatch them. They are also relatively slow-moving and their attacks inflict very little damage. However, they can leap long distances \
                        and heights. Headcrabs seek out larger human hosts, which are converted into zombie-like mutants that attack any living lifeform nearby. \
                        The converted humans are more resilient than an ordinary human would be and inherit the headcrab's resilience toward toxic and radioactive materials. \
                        Headcrabs and headcrab zombies die slowly when they catch fire. \
                        The games also establish that while headcrabs are parasites that prey on humans, they are also the prey of the creatures of their homeworld. \
                        Bullsquids, Vortigaunts, barnacles and antlions will all eat headcrabs and Vortigaunts can be seen cooking them in several locations in-game.\",\
                        \"id\":1,\
                        \"issued_at\":1652986134,\
                        \"title\":\"Headcrab\"}",
                    0.5125294327735901,
                    0
                )],
                false
            )]
        );
        Ok(())
    }

    #[tokio::test]
    async fn test_custom_ranking() -> SummaServerResult<()> {
        logging::tests::initialize_default_once();
        let schema = create_test_schema();

        let root_path = tempdir::TempDir::new("summa_test").unwrap();
        let data_path = root_path.path().join("data");

        let index_service = create_test_index_service(&data_path).await;
        let index_holder = create_test_index_holder(&index_service, &schema).await?;

        index_holder.index_updater().read().await.index_document(SummaDocument::TantivyDocument(doc!(
            schema.get_field("id").unwrap() => 1i64,
            schema.get_field("title").unwrap() => "term1 term2",
            schema.get_field("body").unwrap() => "term3 term4 term5 term6",
            schema.get_field("issued_at").unwrap() => 100i64
        )))?;
        index_holder.index_updater().read().await.index_document(SummaDocument::TantivyDocument(doc!(
            schema.get_field("id").unwrap() => 2i64,
            schema.get_field("title").unwrap() => "term2 term3",
            schema.get_field("body").unwrap() => "term1 term7 term8 term9 term10",
            schema.get_field("issued_at").unwrap() => 110i64
        )))?;
        index_holder.index_updater().write().await.commit().await?;
        index_holder.index_reader().reload()?;
        assert_eq!(
            index_holder
                .search("index", &match_query("term1"), vec![top_docs_collector_with_eval_expr(10, "issued_at")])
                .await?,
            vec![top_docs_collector_output(
                vec![
                    scored_doc(
                        "{\"body\":\"term1 term7 term8 term9 term10\",\"id\":2,\"issued_at\":110,\"title\":\"term2 term3\"}",
                        110.0,
                        0
                    ),
                    scored_doc(
                        "{\"body\":\"term3 term4 term5 term6\",\"id\":1,\"issued_at\":100,\"title\":\"term1 term2\"}",
                        100.0,
                        1
                    )
                ],
                false
            )]
        );
        assert_eq!(
            index_holder
                .search("index", &match_query("term1"), vec![top_docs_collector_with_eval_expr(10, "-issued_at")])
                .await?,
            vec![top_docs_collector_output(
                vec![
                    scored_doc(
                        "{\"body\":\"term3 term4 term5 term6\",\"id\":1,\"issued_at\":100,\"title\":\"term1 term2\"}",
                        -100.0,
                        0
                    ),
                    scored_doc(
                        "{\"body\":\"term1 term7 term8 term9 term10\",\"id\":2,\"issued_at\":110,\"title\":\"term2 term3\"}",
                        -110.0,
                        1
                    ),
                ],
                false
            )]
        );
        Ok(())
    }
}