use std::collections::hash_map::RandomState;
use std::collections::HashSet;
use std::path::Path;
use std::sync::{Arc, RwLock};

use chrono::{DateTime, Datelike};
use rand::RngCore;
use summa_proto::proto;
use tantivy::index::SegmentId;
use tantivy::merge_policy::MergePolicy;
use tantivy::query::Query;
use tantivy::schema::document::ReferenceValueLeaf;
use tantivy::schema::document::{CompactDocObjectIter, CompactDocValue, ReferenceValue};
use tantivy::schema::{Field, FieldType, OwnedValue, Value};
use tantivy::{Directory, Document, Index, IndexWriter, Opstamp, SegmentMeta, SingleSegmentIndexWriter, TantivyDocument, Term};
use tracing::info;

use super::SummaSegmentAttributes;
use crate::configs::core::WriterThreads;
use crate::errors::{SummaResult, ValidationError};
use crate::Error;

fn extract_flatten<'a, T: AsRef<str>>(v: CompactDocValue<'a>, parts: &[T], buffer: &mut Vec<OwnedValue>) {
    let mut current = v;
    for (i, part) in parts.iter().enumerate() {
        match current.as_value() {
            ReferenceValue::Object(m) => {
                for (key, value) in m {
                    if key == part.as_ref() {
                        current = value;
                        break;
                    }
                }
            }
            ReferenceValue::Array(a) => {
                for child in a {
                    extract_flatten(child, &parts[i..], buffer)
                }
            }
            _ => break,
        }
    }
    if let ReferenceValue::Leaf(_) = current.as_value() {
        buffer.push(OwnedValue::from(current))
    }
}
fn extract_flatten_from_map<'a, T: AsRef<str>>(m: CompactDocObjectIter<'a>, parts: &[T], buffer: &mut Vec<OwnedValue>) {
    for (key, value) in m {
        if key == parts[0].as_ref() {
            match value.as_value() {
                ReferenceValue::Leaf(_) => {}
                ReferenceValue::Array(a) => {
                    for child in a {
                        extract_flatten(child, &parts[1..], buffer)
                    }
                }
                ReferenceValue::Object(child) => extract_flatten_from_map(child, &parts[1..], buffer),
            }
        }
    }
}

#[inline]
fn generate_id() -> String {
    let mut data = [0u8; 16];
    rand::thread_rng().fill_bytes(&mut data);
    base36::encode(&data)
}

/// Wrap `tantivy::SingleSegmentIndexWriter` and allows to recreate it
pub struct SingleIndexWriter {
    pub index_writer: RwLock<SingleSegmentIndexWriter>,
    pub index: Index,
    pub writer_heap_size_bytes: usize,
}

/// Hold same-thread or pooled implementation of `IndexWriter`
pub enum IndexWriterImpl {
    SameThread(SingleIndexWriter),
    Threaded(IndexWriter),
}

impl IndexWriterImpl {
    pub fn new(index: &Index, writer_threads: WriterThreads, writer_heap_size_bytes: usize, merge_policy: Arc<dyn MergePolicy>) -> SummaResult<Self> {
        Ok(match writer_threads {
            WriterThreads::SameThread => IndexWriterImpl::SameThread(SingleIndexWriter {
                index: index.clone(),
                index_writer: RwLock::new(SingleSegmentIndexWriter::new(index.clone(), writer_heap_size_bytes)?),
                writer_heap_size_bytes,
            }),
            WriterThreads::N(writer_threads) => {
                let index_writer = index.writer_with_num_threads(writer_threads as usize, writer_heap_size_bytes)?;
                index_writer.set_merge_policy(merge_policy);
                IndexWriterImpl::Threaded(index_writer)
            }
        })
    }

    pub fn delete_by_query(&self, query: Box<dyn Query>) -> SummaResult<u64> {
        match self {
            IndexWriterImpl::SameThread(_) => unimplemented!(),
            IndexWriterImpl::Threaded(writer) => Ok(writer.delete_query(query)?),
        }
    }

    pub fn delete_by_term(&self, term: Term) -> u64 {
        match self {
            IndexWriterImpl::SameThread(_) => unimplemented!(),
            IndexWriterImpl::Threaded(writer) => writer.delete_term(term),
        }
    }

    pub fn add_document(&self, document: TantivyDocument) -> SummaResult<()> {
        match self {
            IndexWriterImpl::SameThread(writer) => {
                writer.index_writer.write().expect("poisoned").add_document(document)?;
            }
            IndexWriterImpl::Threaded(writer) => {
                writer.add_document(document)?;
            }
        };
        Ok(())
    }
    pub fn index(&self) -> &Index {
        match self {
            IndexWriterImpl::SameThread(writer) => &writer.index,
            IndexWriterImpl::Threaded(writer) => writer.index(),
        }
    }
    pub fn merge_with_attributes(&self, segment_ids: &[SegmentId], segment_attributes: Option<serde_json::Value>) -> SummaResult<Option<SegmentMeta>> {
        match self {
            IndexWriterImpl::SameThread(_) => {
                unimplemented!()
            }
            IndexWriterImpl::Threaded(writer) => {
                let target_segment = writer.merge_with_attributes(segment_ids, segment_attributes).wait()?;
                writer.garbage_collect_files().wait()?;
                Ok(target_segment)
            }
        }
    }
    pub fn commit(&mut self) -> SummaResult<Opstamp> {
        match self {
            IndexWriterImpl::SameThread(writer) => {
                let index = writer.index.clone();
                let writer_heap_size_bytes = writer.writer_heap_size_bytes;
                let writer = writer.index_writer.get_mut().expect("poisoned");
                take_mut::take(writer, |writer| {
                    writer.finalize().expect("cannot finalize");
                    SingleSegmentIndexWriter::new(index.clone(), writer_heap_size_bytes).expect("cannot recreate writer")
                });
                Ok(0)
            }
            IndexWriterImpl::Threaded(writer) => {
                info!(action = "commit_files");
                let opstamp = writer.prepare_commit()?.commit()?;
                info!(action = "committed", opstamp = ?opstamp);
                Ok(opstamp)
            }
        }
    }
    pub fn rollback(&mut self) -> SummaResult<()> {
        match self {
            IndexWriterImpl::SameThread(_) => unimplemented!(),
            IndexWriterImpl::Threaded(writer) => {
                info!(action = "rollback_files");
                let opstamp = writer.rollback()?;
                info!(action = "rollbacked", opstamp = ?opstamp);
                Ok(())
            }
        }
    }
}

/// Managing write operations to index
pub struct IndexWriterHolder {
    index_writer: IndexWriterImpl,
    merge_policy: Arc<dyn MergePolicy>,
    unique_fields: Vec<Field>,
    writer_threads: WriterThreads,
    writer_heap_size_bytes: usize,
    auto_id_field: Option<Field>,
    extra_year_field: Option<(Field, Field)>,
    mapped_fields: Vec<((Field, Vec<String>), Field)>,
}

impl IndexWriterHolder {
    /// Creates new `IndexWriterHolder` containing `tantivy::IndexWriter` and primary key
    ///
    /// `IndexWriterHolder` maintains invariant that the only document with the particular primary key exists in the index.
    /// It is reached by deletion of every document with the same primary key as indexing one.
    /// The type of primary key is restricted to I64 but it is subjected to be changed in the future.
    pub(super) fn new(
        index_writer: IndexWriterImpl,
        merge_policy: Arc<dyn MergePolicy>,
        unique_fields: Vec<Field>,
        auto_id_field: Option<Field>,
        mapped_fields: Vec<((Field, Vec<String>), Field)>,
        writer_threads: WriterThreads,
        writer_heap_size_bytes: usize,
    ) -> SummaResult<IndexWriterHolder> {
        let schema = index_writer.index().schema();
        let extra_year_field = if let (Ok(extra_field), Ok(issued_at_field)) = (schema.get_field("extra"), schema.get_field("issued_at")) {
            Some((extra_field, issued_at_field))
        } else {
            None
        };
        Ok(IndexWriterHolder {
            index_writer,
            merge_policy,
            unique_fields,
            auto_id_field,
            writer_threads,
            writer_heap_size_bytes,
            extra_year_field,
            mapped_fields,
        })
    }

    /// Creates new `IndexWriterHolder` from `Index` and `core::Config`
    pub fn create(
        index: &Index,
        writer_threads: WriterThreads,
        writer_heap_size_bytes: usize,
        merge_policy: Arc<dyn MergePolicy>,
    ) -> SummaResult<IndexWriterHolder> {
        let index_writer = IndexWriterImpl::new(index, writer_threads.clone(), writer_heap_size_bytes, merge_policy.clone())?;
        let schema = index_writer.index().schema();
        let metas = index.load_metas()?;
        let mapped_fields = metas
            .index_attributes()?
            .map(|attributes: proto::IndexAttributes| {
                attributes
                    .mapped_fields
                    .iter()
                    .map(|proto::MappedField { source_field, target_field }| {
                        Ok::<((Field, Vec<String>), Field), ValidationError>((
                            schema
                                .find_field(source_field)
                                .ok_or_else(|| ValidationError::MissingField(source_field.to_string()))
                                .map(|(field, full_path)| (field, full_path.split('.').map(|x| x.to_string()).collect()))?,
                            schema
                                .get_field(target_field)
                                .map_err(|_| ValidationError::MissingField(source_field.to_string()))?,
                        ))
                    })
                    .collect::<Result<Vec<(_, _)>, _>>()
            })
            .transpose()?
            .unwrap_or_default();
        let unique_fields = metas
            .index_attributes()?
            .map(|attributes: proto::IndexAttributes| {
                attributes
                    .unique_fields
                    .iter()
                    .map(|unique_field| {
                        schema
                            .find_field(unique_field)
                            .ok_or_else(|| ValidationError::MissingField(unique_field.to_string()))
                            .map(|x| x.0)
                    })
                    .collect::<Result<Vec<_>, _>>()
            })
            .transpose()?
            .unwrap_or_default();
        let auto_id_field = metas
            .index_attributes()?
            .and_then(|attributes: proto::IndexAttributes| {
                attributes.auto_id_field.map(|auto_id_field| {
                    schema
                        .get_field(&auto_id_field)
                        .or_else(|_| Err(ValidationError::MissingField(auto_id_field.to_string())))
                })
            })
            .transpose()?;
        IndexWriterHolder::new(
            index_writer,
            merge_policy,
            unique_fields,
            auto_id_field,
            mapped_fields,
            writer_threads,
            writer_heap_size_bytes,
        )
    }

    /// Delete index by its unique fields
    pub(super) fn resolve_conflicts(&self, document: &TantivyDocument, conflict_strategy: proto::ConflictStrategy) -> SummaResult<Option<u64>> {
        if self.unique_fields.is_empty() || matches!(conflict_strategy, proto::ConflictStrategy::DoNothing) {
            return Ok(None);
        }

        let unique_terms: Vec<Term> = self
            .unique_fields
            .iter()
            .flat_map(|unique_field| {
                document.get_all(*unique_field).map(|value| match value.as_value() {
                    // ToDo: Support other types for arrays
                    ReferenceValue::Array(iter) => Some(Ok(iter.map(|x| Term::from_field_text(*unique_field, x.as_str().unwrap())).collect())),
                    ReferenceValue::Leaf(ReferenceValueLeaf::Str(s)) => Some(Ok(vec![Term::from_field_text(*unique_field, s)])),
                    ReferenceValue::Leaf(ReferenceValueLeaf::I64(i)) => Some(Ok(vec![Term::from_field_i64(*unique_field, i)])),
                    ReferenceValue::Leaf(ReferenceValueLeaf::U64(i)) => Some(Ok(vec![Term::from_field_u64(*unique_field, i)])),
                    ReferenceValue::Leaf(ReferenceValueLeaf::F64(i)) => Some(Ok(vec![Term::from_field_f64(*unique_field, i)])),
                    _ => {
                        let schema = self.index_writer.index().schema();
                        let field_type = schema.get_field_entry(*unique_field).field_type();
                        Some(Err(Error::Validation(Box::new(ValidationError::InvalidUniqueFieldType(field_type.clone())))))
                    }
                })
            })
            .flatten()
            .collect::<SummaResult<Vec<_>>>()?
            .into_iter()
            .flatten()
            .collect();

        if unique_terms.is_empty() {
            Err(ValidationError::MissingUniqueField(format!(
                "{:?}",
                document.to_named_doc(&self.index_writer.index().schema()),
            )))?
        }

        let mut last_opstamp = None;
        for term in unique_terms {
            last_opstamp = Some(self.delete_by_term(term))
        }

        Ok(last_opstamp)
    }

    /// Delete documents by query
    pub(super) fn delete_by_query(&self, query: Box<dyn Query>) -> SummaResult<u64> {
        self.index_writer.delete_by_query(query)
    }

    /// Delete documents by `Term`
    pub(super) fn delete_by_term(&self, term: Term) -> u64 {
        self.index_writer.delete_by_term(term)
    }

    /// Tantivy `Index`
    pub(super) fn index(&self) -> &Index {
        self.index_writer.index()
    }

    #[inline]
    fn process_dynamic_fields(&self, document: &mut TantivyDocument) -> SummaResult<()> {
        if let Some((extra_field, issued_at_field)) = self.extra_year_field {
            if let Some(issued_at_value) = document.get_first(issued_at_field) {
                if let Some(issued_at_value) = issued_at_value.as_i64() {
                    if let Some(correct_timestamp) = DateTime::from_timestamp(issued_at_value, 0) {
                        document.add_text(extra_field, correct_timestamp.year().to_string())
                    }
                }
            }
        }
        let mut buffer = vec![];
        for ((source_field, source_full_path), target_field) in &self.mapped_fields {
            for value in document.get_all(*source_field) {
                match value.as_value() {
                    ReferenceValue::Object(entries) => extract_flatten_from_map(entries, source_full_path, &mut buffer),
                    ReferenceValue::Leaf(leaf) => buffer.push(OwnedValue::from(value)),
                    _ => unimplemented!(),
                }
            }
            for v in &buffer {
                document.add_field_value(*target_field, v)
            }
            buffer.clear();
        }
        Ok(())
    }
    #[inline]
    fn setup_id_field(&self, document: &mut TantivyDocument) -> SummaResult<()> {
        if let Some(auto_id_field) = &self.auto_id_field {
            let schema = self.index_writer.index().schema();
            match schema.get_field_entry(*auto_id_field).field_type() {
                FieldType::Str(_) => match document.get_first(*auto_id_field) {
                    Some(_) => {}
                    None => document.add_text(*auto_id_field, generate_id()),
                },
                _ => unreachable!(),
            }
        }
        Ok(())
    }

    /// Put document to the index. Before comes searchable it must be committed
    pub fn index_document(&self, mut document: TantivyDocument, conflict_strategy: proto::ConflictStrategy) -> SummaResult<()> {
        self.process_dynamic_fields(&mut document)?;
        self.setup_id_field(&mut document)?;
        self.resolve_conflicts(&document, conflict_strategy)?;
        self.index_writer.add_document(document)?;
        Ok(())
    }

    /// Merge segments into one.
    ///
    /// Also cleans deleted documents and do recompression. Possible to pass the only segment in `segment_ids` to do recompression or clean up.
    /// It is heavy operation that also blocks on `.await` so should be spawned if non-blocking behaviour is required
    pub fn merge(&self, segment_ids: &[SegmentId], segment_attributes: Option<SummaSegmentAttributes>) -> SummaResult<Option<SegmentMeta>> {
        info!(action = "merge_segments", segment_ids = ?segment_ids);
        let segment_meta = self.index_writer.merge_with_attributes(
            segment_ids,
            segment_attributes.map(|segment_attributes| serde_json::to_value(segment_attributes).expect("cannot serialize")),
        )?;
        info!(action = "merged_segments", segment_ids = ?segment_ids, merged_segment_meta = ?segment_meta);
        Ok(segment_meta)
    }

    /// Commits already indexed documents
    ///
    /// Committing makes indexed documents visible
    /// It is heavy operation that also blocks on `.await` so should be spawned if non-blocking behaviour is required
    pub fn commit(&mut self) -> SummaResult<Opstamp> {
        self.index_writer.commit()
    }

    pub fn rollback(&mut self) -> SummaResult<()> {
        self.index_writer.rollback()
    }

    pub fn vacuum(&self, segment_attributes: Option<SummaSegmentAttributes>, excluded_segments: Vec<String>) -> SummaResult<()> {
        let mut segments = self.index().searchable_segments()?;
        segments.sort_by_key(|segment| segment.meta().num_deleted_docs());

        let excluded_segments: HashSet<SegmentId, RandomState> = excluded_segments
            .into_iter()
            .map(|s| SegmentId::from_uuid_string(&s))
            .collect::<Result<_, _>>()
            .map_err(|e| Error::InvalidSegmentId(e.to_string()))?;

        let segments = segments
            .into_iter()
            .filter(|segment| {
                let is_frozen = segment
                    .meta()
                    .segment_attributes()
                    .as_ref()
                    .map(|segment_attributes| {
                        let parsed_attributes = serde_json::from_value::<SummaSegmentAttributes>(segment_attributes.clone());
                        parsed_attributes.map(|v| v.is_frozen).unwrap_or(false)
                    })
                    .unwrap_or(false);
                let is_excluded = excluded_segments.contains(&segment.id());
                !is_frozen && !is_excluded
            })
            .collect::<Vec<_>>();
        if !segments.is_empty() {
            self.merge(&segments.iter().map(|segment| segment.id()).collect::<Vec<_>>(), segment_attributes)?;
        }
        Ok(())
    }

    pub fn wait_merging_threads(&mut self) {
        match &mut self.index_writer {
            IndexWriterImpl::SameThread(_) => (),
            IndexWriterImpl::Threaded(index_writer) => take_mut::take(index_writer, |index_writer| {
                let index = index_writer.index().clone();
                info!(action = "wait_merging_threads", mode = "threaded");
                index_writer.wait_merging_threads().expect("cannot wait merging threads");
                info!(action = "merging_threads_finished", mode = "threaded");
                let index_writer = index
                    .writer_with_num_threads(self.writer_threads.threads() as usize, self.writer_heap_size_bytes)
                    .expect("cannot create index writer_holder");
                index_writer.set_merge_policy(self.merge_policy.clone());
                index_writer
            }),
        };
    }

    /// Locking index files for executing operation on them
    pub fn commit_and_prepare(&mut self, with_hotcache: bool) -> SummaResult<Opstamp> {
        let opstamp = self.commit()?;
        self.wait_merging_threads();

        if with_hotcache {
            let directory = self.index().directory();
            let hotcache_bytes = crate::directories::create_hotcache(
                directory
                    .underlying_directory()
                    .expect("managed directory should contain nested directory")
                    .box_clone(),
            )?;
            directory.atomic_write(Path::new(&format!("hotcache.{}.bin", opstamp)), &hotcache_bytes)?;
        }
        Ok(opstamp)
    }
}
