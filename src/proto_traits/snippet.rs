//! `From` trait implmentations used for creation of `proto::Score`

use crate::proto;

impl From<tantivy::Snippet> for proto::Snippet {
    fn from(snippet: tantivy::Snippet) -> Self {
        proto::Snippet {
            fragment: snippet.fragment().to_string(),
            highlighted: snippet
                .highlighted()
                .iter()
                .map(|r| proto::Highlight {
                    from: r.start as u32,
                    to: r.end as u32,
                })
                .collect(),
        }
    }
}