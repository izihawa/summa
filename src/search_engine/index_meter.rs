use crate::search_engine::IndexHolder;
use opentelemetry::metrics::{Unit, ValueRecorder};
use opentelemetry::{global, KeyValue};
use std::collections::HashMap;
use std::iter;

#[derive(Clone)]
pub struct IndexMeter {
    documents_count: ValueRecorder<u64>,
    deleted_documents_count: ValueRecorder<u64>,
    deleted_memory_usage: ValueRecorder<u64>,
    store_memory_usage: ValueRecorder<u64>,
    fields_memory_usage: ValueRecorder<u64>,
}
impl IndexMeter {
    pub fn new() -> IndexMeter {
        let meter = global::meter("summa");
        IndexMeter {
            documents_count: meter.u64_value_recorder("documents_count").with_description("Documents count").init(),
            deleted_documents_count: meter
                .u64_value_recorder("deleted_documents_count")
                .with_description("Deleted documents count")
                .init(),
            deleted_memory_usage: meter
                .u64_value_recorder("deleted_memory_usage")
                .with_description("Deleted documents memory usage in bytes")
                .with_unit(Unit::new("bytes"))
                .init(),
            store_memory_usage: meter
                .u64_value_recorder("store_memory_usage")
                .with_description("Store memory usage in bytes")
                .with_unit(Unit::new("bytes"))
                .init(),
            fields_memory_usage: meter
                .u64_value_recorder("fields_memory_usage")
                .with_description("Memory usage per fields in bytes")
                .with_unit(Unit::new("bytes"))
                .init(),
        }
    }

    pub(crate) fn record_metrics(&self, index_holder: &IndexHolder) {
        let schema = index_holder.schema();
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
                let counter = per_fields.entry(schema.get_field_name(*field)).or_insert(0u64);
                *counter += field_usage.total() as u64;
            }
            let segment_keys = &[
                KeyValue::new("index_name", index_holder.index_name().to_string()),
                KeyValue::new("segment_id", segment_id.to_string()),
            ];
            self.documents_count.record(segment_reader.num_docs() as u64, segment_keys);
            self.deleted_documents_count.record(segment_reader.num_deleted_docs() as u64, segment_keys);
            self.deleted_memory_usage.record(segment_space_usage.deletes() as u64, segment_keys);
            self.store_memory_usage.record(segment_space_usage.store().total() as u64, segment_keys);
        }
        for (field_name, memory_usage) in &per_fields {
            let field_keys = &[
                KeyValue::new("index_name", index_holder.index_name().to_string()),
                KeyValue::new("field_name", field_name.to_string()),
            ];
            self.fields_memory_usage.record(*memory_usage, field_keys);
        }
    }
}
