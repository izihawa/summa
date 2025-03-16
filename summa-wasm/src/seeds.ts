import {CacheConfig, RemoteEngineConfig} from "./grpc-web/index_service";

export interface IIndexSeed {
  retrieve_remote_engine_config(): Promise<RemoteEngineConfig>;
}

export class LocalDatabaseSeed implements IIndexSeed {
  ipfs_path: string;
  cache_config?: CacheConfig;

  constructor(ipfs_path: string, cache_config?: CacheConfig) {
    if (!ipfs_path.endsWith("/")) {
      ipfs_path += "/";
    }
    this.ipfs_path = ipfs_path;
    this.cache_config = cache_config;
  }

  get_file_url(file_path: string) {
    return this.ipfs_path + file_path
  }

  async retrieve_remote_engine_config(): Promise<RemoteEngineConfig> {
    return RemoteEngineConfig.create({
      method: "GET",
      url_template: `${this.ipfs_path}{file_name}`,
      headers_template: { "Range": "bytes={start}-{end}" },
      cache_config: this.cache_config,
    });
  }
}
