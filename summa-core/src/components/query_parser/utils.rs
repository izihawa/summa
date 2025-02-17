use std::str::FromStr;

use base64::Engine;
use prost::encoding::bool;
use tantivy::json_utils::convert_to_fast_value_and_append_to_json_term;
use tantivy::schema::{Field, FieldType};
use tantivy::Term;
use tantivy_common::DateTime;

use crate::errors::SummaResult;
use crate::Error;

pub fn cast_field_to_term(field: &Field, full_path: &str, field_type: &FieldType, value: &str, force_str: bool) -> Term {
    match field_type {
        FieldType::Str(_) => Term::from_field_text(*field, value),
        FieldType::JsonObject(ref json_options) => {
            let mut term = Term::from_field_json_path(*field, full_path, json_options.is_expand_dots_enabled());
            let is_quoted = value.len() >= 2 && value.starts_with('\"') && value.ends_with('\"');
            if is_quoted {
                term.append_type_and_str(&value[1..value.len() - 1]);
                term
            } else if force_str {
                term.append_type_and_str(value);
                term
            } else {
                match convert_to_fast_value_and_append_to_json_term(term.clone(), value, false) {
                    Some(term) => term,
                    None => {
                        term.append_type_and_str(value);
                        term
                    }
                }
            }
        }
        _ => unreachable!(),
    }
}

pub fn cast_field_to_typed_term(field: &Field, full_path: &str, field_type: &FieldType, value: &str) -> SummaResult<Term> {
    Ok(match field_type {
        FieldType::I64(_) => Term::from_field_i64(
            *field,
            i64::from_str(value).map_err(|_e| Error::InvalidSyntax(format!("cannot parse {value} as i64")))?,
        ),
        FieldType::U64(_) => Term::from_field_u64(
            *field,
            u64::from_str(value).map_err(|_e| Error::InvalidSyntax(format!("cannot parse {value} as u64")))?,
        ),
        FieldType::F64(_) => Term::from_field_f64(
            *field,
            f64::from_str(value).map_err(|_e| Error::InvalidSyntax(format!("cannot parse {value} as f64")))?,
        ),
        FieldType::Bytes(_) => Term::from_field_bytes(
            *field,
            &base64::engine::general_purpose::STANDARD
                .decode(value)
                .map_err(|_e| Error::InvalidSyntax(format!("cannot parse {value} as bytes")))?,
        ),
        FieldType::Date(_) => Term::from_field_date(
            *field,
            DateTime::from_timestamp_secs(i64::from_str(value).map_err(|_e| Error::InvalidSyntax(format!("cannot parse {value} as date")))?),
        ),
        _ => cast_field_to_term(field, full_path, field_type, value, false),
    })
}
