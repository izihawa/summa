use crate::errors::SummaServerResult;
use crate::errors::ValidationError;
use tantivy::schema::{Field, FieldType};
use tantivy::{Document, Index, IndexWriter, Opstamp, SegmentAttribute, SegmentAttributes, SegmentId, SegmentMeta, Term};
use tracing::info;

/// Managing write operations to index
pub(super) struct IndexWriterHolder {
    index_writer: IndexWriter,
    primary_key: Option<Field>,
}

impl IndexWriterHolder {
    /// Creates new `IndexWriterHolder` containing `tantivy::IndexWriter` and primary key
    ///
    /// `IndexWriterHolder` maintains invariant that the only document with the particular primary key exists in the index.
    /// It is reached by deletion of every document with the same primary key as indexing one.
    /// The type of primary key is restricted to I64 but it is subjected to be changed in the future.
    pub(super) fn new(index_writer: IndexWriter, primary_key: Option<Field>) -> SummaServerResult<IndexWriterHolder> {
        if let Some(primary_key) = primary_key {
            match index_writer.index().schema().get_field_entry(primary_key).field_type() {
                FieldType::I64(_) => Ok(()),
                another_type => Err(ValidationError::InvalidPrimaryKeyType(another_type.to_owned())),
            }?
        }
        Ok(IndexWriterHolder { index_writer, primary_key })
    }

    /// Delete index by its primary key
    pub(super) fn delete_document(&self, document: &Document) -> SummaServerResult<()> {
        if let Some(primary_key) = self.primary_key {
            self.index_writer.delete_term(Term::from_field_i64(
                primary_key,
                document
                    .get_first(primary_key)
                    .ok_or_else(|| ValidationError::MissingPrimaryKey(Some(format!("{:?}", self.index_writer.index().schema().to_named_doc(document)))))?
                    .as_i64()
                    .unwrap(),
            ));
        }
        Ok(())
    }

    /// Delete index by its primary key
    pub(super) fn delete_document_by_primary_key(&self, primary_key_value: i64) -> SummaServerResult<Opstamp> {
        if let Some(primary_key) = self.primary_key {
            Ok(self.index_writer.delete_term(Term::from_field_i64(primary_key, primary_key_value)))
        } else {
            Err(ValidationError::MissingPrimaryKey(None).into())
        }
    }

    /// Tantivy `Index`
    pub(super) fn index(&self) -> &Index {
        self.index_writer.index()
    }

    /// Put document to the index. Before comes searchable it must be committed
    pub(super) fn index_document(&self, document: Document) -> SummaServerResult<Opstamp> {
        self.delete_document(&document)?;
        Ok(self.index_writer.add_document(document)?)
    }

    /// Merge segments into one.
    ///
    /// Also cleans deleted documents and do recompression. Possible to pass the only segment in `segment_ids` to do recompression or clean up.
    /// It is heavy operation that also blocks on `.await` so should be spawned if non-blocking behaviour is required
    pub(super) async fn merge(&mut self, segment_ids: &[SegmentId], segment_attributes: Option<SegmentAttributes>) -> SummaServerResult<Option<SegmentMeta>> {
        info!(action = "merge_segments", segment_ids = ?segment_ids);
        let segment_meta = match segment_attributes {
            Some(segment_attributes) => self.index_writer.merge_with_attributes(segment_ids, segment_attributes).await?,
            None => self.index_writer.merge(segment_ids).await?,
        };
        info!(action = "merged_segments", segment_ids = ?segment_ids, merged_segment_meta = ?segment_meta);
        Ok(segment_meta)
    }

    /// Commits already indexed documents
    ///
    /// Committing makes indexed documents visible
    /// It is heavy operation that also blocks on `.await` so should be spawned if non-blocking behaviour is required
    pub(super) async fn commit(&mut self) -> SummaServerResult<Opstamp> {
        info!(action = "commit_index");
        let result = self.index_writer.prepare_commit()?.commit_future().await;
        info!(action = "committed_index", result = ?result);
        Ok(result?)
    }

    pub(super) async fn vacuum(&mut self, segment_attributes: Option<&SegmentAttributes>) -> SummaServerResult<()> {
        let mut segments = self.index().searchable_segments()?;
        segments.sort_by_key(|segment| segment.meta().num_deleted_docs());

        let (small_segments, segments): (Vec<_>, Vec<_>) = segments
            .into_iter()
            .filter(|segment| match segment.meta().segment_attributes().get("is_frozen") {
                None => true,
                Some(is_frozen) => match is_frozen {
                    SegmentAttribute::ConjunctiveBool(value) => !*value,
                    _ => unreachable!(),
                },
            })
            .partition(|segment| segment.meta().num_docs() < 100000);

        if !small_segments.is_empty() {
            self.merge(
                &small_segments.into_iter().map(|segment| segment.id()).collect::<Vec<_>>(),
                segment_attributes.cloned(),
            )
            .await?;
        }

        for segment in segments.iter() {
            self.merge(&[segment.id()], segment_attributes.cloned()).await?;
        }
        Ok(())
    }

    pub(super) fn wait_merging_threads(self) -> SummaServerResult<()> {
        Ok(self.index_writer.wait_merging_threads()?)
    }
}