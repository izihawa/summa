//! Beacon GRPC API
//!
//! Beacon GRPC API is using for distributing index

use crate::errors::SummaResult;
use crate::proto;
use crate::services::{BeaconService, IndexService};
use tonic::{Request, Response, Status};

pub struct BeaconApiImpl {
    beacon_service: BeaconService,
    index_service: IndexService,
}

impl BeaconApiImpl {
    pub fn new(beacon_service: &BeaconService, index_service: &IndexService) -> SummaResult<BeaconApiImpl> {
        Ok(BeaconApiImpl {
            beacon_service: beacon_service.clone(),
            index_service: index_service.clone(),
        })
    }
}

#[tonic::async_trait]
impl proto::beacon_api_server::BeaconApi for BeaconApiImpl {
    async fn publish_index(&self, proto_request: Request<proto::PublishIndexRequest>) -> Result<Response<proto::PublishIndexResponse>, Status> {
        let proto_request = proto_request.into_inner();
        let index_holder = self.index_service.get_index_holder(&proto_request.index_alias).await?;
        let add_response_files = self.beacon_service.publish_index(index_holder).await?;
        let published_files = add_response_files
            .into_iter()
            .map(|add_response_file| proto::PublishedFile {
                name: add_response_file.name,
                hash: add_response_file.hash,
                size: add_response_file.size,
            })
            .collect::<Vec<_>>();
        let response = proto::PublishIndexResponse { published_files };
        Ok(Response::new(response))
    }
}