use crate::services::IndexService;
use opentelemetry::metrics::{BatchObserverResult, Unit};
use opentelemetry::{global, KeyValue};
use std::collections::HashMap;
use std::iter;
use tokio::runtime::Handle;

/// Tracing `IndexHolder`s in Prometheus format
pub fn register_meter(index_service: &IndexService) {
    let meter = global::meter("summa");
    meter.batch_observer(move |batch| {
        let index_service = index_service.clone();
        let documents_count = batch.u64_value_observer("documents_count").with_description("Documents count").init();
        let deleted_documents_count = batch
            .u64_value_observer("deleted_documents_count")
            .with_description("Deleted documents count")
            .init();

        let deleted_memory_usage = batch
            .u64_value_observer("deleted_memory_usage")
            .with_unit(Unit::new("bytes"))
            .with_description("Deleted documents memory usage in bytes")
            .init();
        let store_memory_usage = batch
            .u64_value_observer("store_memory_usage")
            .with_unit(Unit::new("bytes"))
            .with_description("Store memory usage in bytes")
            .init();
        let fields_memory_usage = batch
            .u64_value_observer("fields_memory_usage")
            .with_unit(Unit::new("bytes"))
            .with_description("Memory usage per fields in bytes")
            .init();

        move |batch_observer_result: BatchObserverResult| {
            let index_service = index_service.clone();
            let index_holders = Handle::current().block_on(index_service.index_holders());
            for index_holder in index_holders.values() {
                let fields = index_holder.fields();
                let searcher = index_holder.index_reader().searcher();
                let segment_readers = searcher.segment_readers();
                let mut per_fields = HashMap::new();
                for segment_reader in segment_readers {
                    let segment_id = segment_reader.segment_id().uuid_string();
                    let segment_space_usage = segment_reader.space_usage().unwrap();
                    for (field, field_usage) in iter::empty()
                        .chain(segment_space_usage.fast_fields().fields())
                        .chain(segment_space_usage.fieldnorms().fields())
                        .chain(segment_space_usage.positions().fields())
                        .chain(segment_space_usage.postings().fields())
                        .chain(segment_space_usage.termdict().fields())
                    {
                        let counter = per_fields.entry(fields.get_field_name(*field)).or_insert(0u64);
                        *counter += field_usage.total() as u64;
                    }
                    batch_observer_result.observe(
                        &[
                            KeyValue::new("index_name", index_holder.index_name().to_string()),
                            KeyValue::new("segment_id", segment_id.to_string()),
                        ],
                        &[
                            documents_count.observation(segment_space_usage.num_docs() as u64),
                            deleted_documents_count.observation(segment_reader.num_deleted_docs() as u64),
                            deleted_memory_usage.observation(segment_space_usage.deletes() as u64),
                            store_memory_usage.observation(segment_space_usage.store().total() as u64),
                        ],
                    );
                }
                for (field_name, memory_usage) in &per_fields {
                    batch_observer_result.observe(
                        &[
                            KeyValue::new("index_name", index_holder.index_name().to_string()),
                            KeyValue::new("field_name", field_name.to_string()),
                        ],
                        &[fields_memory_usage.observation(*memory_usage)],
                    );
                }
            }
        }
    });
}
