use std::collections::{BTreeMap, HashSet};

use serde::{Serialize, Serializer};
use tantivy::schema::{Field, OwnedValue, Schema, Value as ValueTrait};
use tantivy::{Document, TantivyDocument};

/// `Value` is used for representing singular or multi-values of `tantivy::Document`
///
/// Required because Tantivy operates with multi-values only and Summa provides an abstraction of singular fields
pub enum Value {
    SingleValue(Option<OwnedValue>),
    MultipleValue(Vec<OwnedValue>),
}

/// Internal representation of a document used for JSON
/// serialization.
///
/// A `NamedFieldDocument` is a simple representation of a document
/// as a `BTreeMap<String, Vec<Value>>`. It is base on `tantivy::schema::NamedFieldDocument`
/// but with a support of multi fields
#[derive(Serialize)]
pub struct NamedFieldDocument<'a>(pub BTreeMap<&'a str, Value>);

impl<'a> NamedFieldDocument<'a> {
    pub fn from_document(schema: &'a Schema, fields: &Option<HashSet<Field>>, multi_fields: &HashSet<Field>, document: &'a TantivyDocument) -> Self {
        let mut field_map = BTreeMap::new();
        for (field, field_values) in document.get_sorted_field_values() {
            let field_name = schema.get_field_name(field);
            if let Some(fields) = fields {
                if !fields.contains(&field) {
                    continue;
                }
            }
            let values = if multi_fields.contains(&field) {
                Value::MultipleValue(field_values.into_iter().map(|x| OwnedValue::from(x.as_value())).collect())
            } else {
                Value::SingleValue(field_values.get(0).map(|x| OwnedValue::from(x.as_value())))
            };
            field_map.insert(field_name, values);
        }
        NamedFieldDocument(field_map)
    }
    pub fn to_json_string(&self) -> String {
        serde_json::to_string(self).expect("must be serializable")
    }
}

impl Serialize for Value {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match self {
            Value::SingleValue(value) => value.serialize(serializer),
            Value::MultipleValue(value) => value.serialize(serializer),
        }
    }
}
