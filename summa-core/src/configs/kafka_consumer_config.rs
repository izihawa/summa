use serde::{Deserialize, Serialize};

use crate::errors::SummaResult;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ConsumerConfig {
    pub bootstrap_servers: Vec<String>,
    pub create_topics: bool,
    pub delete_topics: bool,
    pub group_id: String,
    pub max_poll_interval_ms: u32,
    pub session_timeout_ms: u32,
    pub topics: Vec<String>,
}

impl ConsumerConfig {
    pub fn new(bootstrap_servers: &[String], group_id: &str, topics: &[String]) -> SummaResult<ConsumerConfig> {
        Ok(ConsumerConfig {
            bootstrap_servers: bootstrap_servers.to_owned(),
            create_topics: true,
            delete_topics: true,
            group_id: group_id.to_owned(),
            max_poll_interval_ms: 1800000,
            session_timeout_ms: 300000,
            topics: topics.to_owned(),
        })
    }
}