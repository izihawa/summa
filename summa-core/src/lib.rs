#![feature(assert_matches)]
#![deny(
    non_shorthand_field_patterns,
    no_mangle_generic_items,
    overflowing_literals,
    path_statements,
    unused_allocation,
    unused_comparisons,
    unused_parens,
    while_true,
    trivial_numeric_casts,
    unused_extern_crates,
    unused_import_braces,
    unused_qualifications,
    unused_must_use,
    clippy::unwrap_used
)]

#[macro_use]
extern crate async_trait;

pub mod collectors;
pub mod components;
pub mod configs;
pub mod directories;
pub mod errors;
pub mod metrics;
pub mod proto_traits;
pub mod scorers;
pub mod utils;
pub mod validators;

pub use errors::Error;

#[macro_use]
extern crate derive_builder;
#[macro_use]
extern crate lazy_static;
