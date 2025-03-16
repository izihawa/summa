// package: summa.proto
// file: index_service.proto

import * as jspb from "google-protobuf";
import * as query_pb from "./query_pb";
import * as utils_pb from "./utils_pb";

export class MergePolicy extends jspb.Message {
  hasLog(): boolean;
  clearLog(): void;
  getLog(): LogMergePolicy | undefined;
  setLog(value?: LogMergePolicy): void;

  hasTemporal(): boolean;
  clearTemporal(): void;
  getTemporal(): TemporalMergePolicy | undefined;
  setTemporal(value?: TemporalMergePolicy): void;

  getMergePolicyCase(): MergePolicy.MergePolicyCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MergePolicy.AsObject;
  static toObject(includeInstance: boolean, msg: MergePolicy): MergePolicy.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MergePolicy, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MergePolicy;
  static deserializeBinaryFromReader(message: MergePolicy, reader: jspb.BinaryReader): MergePolicy;
}

export namespace MergePolicy {
  export type AsObject = {
    log?: LogMergePolicy.AsObject,
    temporal?: TemporalMergePolicy.AsObject,
  }

  export enum MergePolicyCase {
    MERGE_POLICY_NOT_SET = 0,
    LOG = 11,
    TEMPORAL = 12,
  }
}

export class AttachFileEngineRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AttachFileEngineRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AttachFileEngineRequest): AttachFileEngineRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AttachFileEngineRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AttachFileEngineRequest;
  static deserializeBinaryFromReader(message: AttachFileEngineRequest, reader: jspb.BinaryReader): AttachFileEngineRequest;
}

export namespace AttachFileEngineRequest {
  export type AsObject = {
  }
}

export class AttachRemoteEngineRequest extends jspb.Message {
  hasConfig(): boolean;
  clearConfig(): void;
  getConfig(): RemoteEngineConfig | undefined;
  setConfig(value?: RemoteEngineConfig): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AttachRemoteEngineRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AttachRemoteEngineRequest): AttachRemoteEngineRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AttachRemoteEngineRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AttachRemoteEngineRequest;
  static deserializeBinaryFromReader(message: AttachRemoteEngineRequest, reader: jspb.BinaryReader): AttachRemoteEngineRequest;
}

export namespace AttachRemoteEngineRequest {
  export type AsObject = {
    config?: RemoteEngineConfig.AsObject,
  }
}

export class AttachIndexRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  hasFile(): boolean;
  clearFile(): void;
  getFile(): AttachFileEngineRequest | undefined;
  setFile(value?: AttachFileEngineRequest): void;

  hasRemote(): boolean;
  clearRemote(): void;
  getRemote(): AttachRemoteEngineRequest | undefined;
  setRemote(value?: AttachRemoteEngineRequest): void;

  hasMergePolicy(): boolean;
  clearMergePolicy(): void;
  getMergePolicy(): MergePolicy | undefined;
  setMergePolicy(value?: MergePolicy): void;

  hasQueryParserConfig(): boolean;
  clearQueryParserConfig(): void;
  getQueryParserConfig(): query_pb.QueryParserConfig | undefined;
  setQueryParserConfig(value?: query_pb.QueryParserConfig): void;

  getIndexEngineCase(): AttachIndexRequest.IndexEngineCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AttachIndexRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AttachIndexRequest): AttachIndexRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AttachIndexRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AttachIndexRequest;
  static deserializeBinaryFromReader(message: AttachIndexRequest, reader: jspb.BinaryReader): AttachIndexRequest;
}

export namespace AttachIndexRequest {
  export type AsObject = {
    indexName: string,
    file?: AttachFileEngineRequest.AsObject,
    remote?: AttachRemoteEngineRequest.AsObject,
    mergePolicy?: MergePolicy.AsObject,
    queryParserConfig?: query_pb.QueryParserConfig.AsObject,
  }

  export enum IndexEngineCase {
    INDEX_ENGINE_NOT_SET = 0,
    FILE = 2,
    REMOTE = 3,
  }
}

export class AttachIndexResponse extends jspb.Message {
  hasIndex(): boolean;
  clearIndex(): void;
  getIndex(): IndexDescription | undefined;
  setIndex(value?: IndexDescription): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AttachIndexResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AttachIndexResponse): AttachIndexResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AttachIndexResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AttachIndexResponse;
  static deserializeBinaryFromReader(message: AttachIndexResponse, reader: jspb.BinaryReader): AttachIndexResponse;
}

export namespace AttachIndexResponse {
  export type AsObject = {
    index?: IndexDescription.AsObject,
  }
}

export class CommitIndexRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  getWithHotcache(): boolean;
  setWithHotcache(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommitIndexRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CommitIndexRequest): CommitIndexRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CommitIndexRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommitIndexRequest;
  static deserializeBinaryFromReader(message: CommitIndexRequest, reader: jspb.BinaryReader): CommitIndexRequest;
}

export namespace CommitIndexRequest {
  export type AsObject = {
    indexName: string,
    withHotcache: boolean,
  }
}

export class CommitIndexResponse extends jspb.Message {
  getElapsedSecs(): number;
  setElapsedSecs(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommitIndexResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CommitIndexResponse): CommitIndexResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CommitIndexResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommitIndexResponse;
  static deserializeBinaryFromReader(message: CommitIndexResponse, reader: jspb.BinaryReader): CommitIndexResponse;
}

export namespace CommitIndexResponse {
  export type AsObject = {
    elapsedSecs: number,
  }
}

export class CopyDocumentsRequest extends jspb.Message {
  getSourceIndexName(): string;
  setSourceIndexName(value: string): void;

  getTargetIndexName(): string;
  setTargetIndexName(value: string): void;

  hasConflictStrategy(): boolean;
  clearConflictStrategy(): void;
  getConflictStrategy(): ConflictStrategyMap[keyof ConflictStrategyMap];
  setConflictStrategy(value: ConflictStrategyMap[keyof ConflictStrategyMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CopyDocumentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CopyDocumentsRequest): CopyDocumentsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CopyDocumentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CopyDocumentsRequest;
  static deserializeBinaryFromReader(message: CopyDocumentsRequest, reader: jspb.BinaryReader): CopyDocumentsRequest;
}

export namespace CopyDocumentsRequest {
  export type AsObject = {
    sourceIndexName: string,
    targetIndexName: string,
    conflictStrategy: ConflictStrategyMap[keyof ConflictStrategyMap],
  }
}

export class CopyDocumentsResponse extends jspb.Message {
  getElapsedSecs(): number;
  setElapsedSecs(value: number): void;

  getCopiedDocuments(): number;
  setCopiedDocuments(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CopyDocumentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CopyDocumentsResponse): CopyDocumentsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CopyDocumentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CopyDocumentsResponse;
  static deserializeBinaryFromReader(message: CopyDocumentsResponse, reader: jspb.BinaryReader): CopyDocumentsResponse;
}

export namespace CopyDocumentsResponse {
  export type AsObject = {
    elapsedSecs: number,
    copiedDocuments: number,
  }
}

export class CopyIndexRequest extends jspb.Message {
  getSourceIndexName(): string;
  setSourceIndexName(value: string): void;

  getTargetIndexName(): string;
  setTargetIndexName(value: string): void;

  hasFile(): boolean;
  clearFile(): void;
  getFile(): CreateFileEngineRequest | undefined;
  setFile(value?: CreateFileEngineRequest): void;

  hasMemory(): boolean;
  clearMemory(): void;
  getMemory(): CreateMemoryEngineRequest | undefined;
  setMemory(value?: CreateMemoryEngineRequest): void;

  hasMergePolicy(): boolean;
  clearMergePolicy(): void;
  getMergePolicy(): MergePolicy | undefined;
  setMergePolicy(value?: MergePolicy): void;

  getTargetIndexEngineCase(): CopyIndexRequest.TargetIndexEngineCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CopyIndexRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CopyIndexRequest): CopyIndexRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CopyIndexRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CopyIndexRequest;
  static deserializeBinaryFromReader(message: CopyIndexRequest, reader: jspb.BinaryReader): CopyIndexRequest;
}

export namespace CopyIndexRequest {
  export type AsObject = {
    sourceIndexName: string,
    targetIndexName: string,
    file?: CreateFileEngineRequest.AsObject,
    memory?: CreateMemoryEngineRequest.AsObject,
    mergePolicy?: MergePolicy.AsObject,
  }

  export enum TargetIndexEngineCase {
    TARGET_INDEX_ENGINE_NOT_SET = 0,
    FILE = 3,
    MEMORY = 4,
  }
}

export class CopyIndexResponse extends jspb.Message {
  hasIndex(): boolean;
  clearIndex(): void;
  getIndex(): IndexDescription | undefined;
  setIndex(value?: IndexDescription): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CopyIndexResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CopyIndexResponse): CopyIndexResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CopyIndexResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CopyIndexResponse;
  static deserializeBinaryFromReader(message: CopyIndexResponse, reader: jspb.BinaryReader): CopyIndexResponse;
}

export namespace CopyIndexResponse {
  export type AsObject = {
    index?: IndexDescription.AsObject,
  }
}

export class SortByField extends jspb.Message {
  getField(): string;
  setField(value: string): void;

  getOrder(): utils_pb.OrderMap[keyof utils_pb.OrderMap];
  setOrder(value: utils_pb.OrderMap[keyof utils_pb.OrderMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SortByField.AsObject;
  static toObject(includeInstance: boolean, msg: SortByField): SortByField.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SortByField, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SortByField;
  static deserializeBinaryFromReader(message: SortByField, reader: jspb.BinaryReader): SortByField;
}

export namespace SortByField {
  export type AsObject = {
    field: string,
    order: utils_pb.OrderMap[keyof utils_pb.OrderMap],
  }
}

export class CreateFileEngineRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateFileEngineRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateFileEngineRequest): CreateFileEngineRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateFileEngineRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateFileEngineRequest;
  static deserializeBinaryFromReader(message: CreateFileEngineRequest, reader: jspb.BinaryReader): CreateFileEngineRequest;
}

export namespace CreateFileEngineRequest {
  export type AsObject = {
  }
}

export class CreateMemoryEngineRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateMemoryEngineRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateMemoryEngineRequest): CreateMemoryEngineRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateMemoryEngineRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateMemoryEngineRequest;
  static deserializeBinaryFromReader(message: CreateMemoryEngineRequest, reader: jspb.BinaryReader): CreateMemoryEngineRequest;
}

export namespace CreateMemoryEngineRequest {
  export type AsObject = {
  }
}

export class MappedField extends jspb.Message {
  getSourceField(): string;
  setSourceField(value: string): void;

  getTargetField(): string;
  setTargetField(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MappedField.AsObject;
  static toObject(includeInstance: boolean, msg: MappedField): MappedField.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MappedField, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MappedField;
  static deserializeBinaryFromReader(message: MappedField, reader: jspb.BinaryReader): MappedField;
}

export namespace MappedField {
  export type AsObject = {
    sourceField: string,
    targetField: string,
  }
}

export class IndexAttributes extends jspb.Message {
  getCreatedAt(): number;
  setCreatedAt(value: number): void;

  clearUniqueFieldsList(): void;
  getUniqueFieldsList(): Array<string>;
  setUniqueFieldsList(value: Array<string>): void;
  addUniqueFields(value: string, index?: number): string;

  clearMultiFieldsList(): void;
  getMultiFieldsList(): Array<string>;
  setMultiFieldsList(value: Array<string>): void;
  addMultiFields(value: string, index?: number): string;

  hasDescription(): boolean;
  clearDescription(): void;
  getDescription(): string;
  setDescription(value: string): void;

  getConflictStrategy(): ConflictStrategyMap[keyof ConflictStrategyMap];
  setConflictStrategy(value: ConflictStrategyMap[keyof ConflictStrategyMap]): void;

  clearMappedFieldsList(): void;
  getMappedFieldsList(): Array<MappedField>;
  setMappedFieldsList(value: Array<MappedField>): void;
  addMappedFields(value?: MappedField, index?: number): MappedField;

  hasAutoIdField(): boolean;
  clearAutoIdField(): void;
  getAutoIdField(): string;
  setAutoIdField(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IndexAttributes.AsObject;
  static toObject(includeInstance: boolean, msg: IndexAttributes): IndexAttributes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IndexAttributes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IndexAttributes;
  static deserializeBinaryFromReader(message: IndexAttributes, reader: jspb.BinaryReader): IndexAttributes;
}

export namespace IndexAttributes {
  export type AsObject = {
    createdAt: number,
    uniqueFieldsList: Array<string>,
    multiFieldsList: Array<string>,
    description: string,
    conflictStrategy: ConflictStrategyMap[keyof ConflictStrategyMap],
    mappedFieldsList: Array<MappedField.AsObject>,
    autoIdField: string,
  }
}

export class CreateIndexRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  hasFile(): boolean;
  clearFile(): void;
  getFile(): CreateFileEngineRequest | undefined;
  setFile(value?: CreateFileEngineRequest): void;

  hasMemory(): boolean;
  clearMemory(): void;
  getMemory(): CreateMemoryEngineRequest | undefined;
  setMemory(value?: CreateMemoryEngineRequest): void;

  getSchema(): string;
  setSchema(value: string): void;

  getCompression(): CompressionMap[keyof CompressionMap];
  setCompression(value: CompressionMap[keyof CompressionMap]): void;

  hasBlocksize(): boolean;
  clearBlocksize(): void;
  getBlocksize(): number;
  setBlocksize(value: number): void;

  hasIndexAttributes(): boolean;
  clearIndexAttributes(): void;
  getIndexAttributes(): IndexAttributes | undefined;
  setIndexAttributes(value?: IndexAttributes): void;

  hasMergePolicy(): boolean;
  clearMergePolicy(): void;
  getMergePolicy(): MergePolicy | undefined;
  setMergePolicy(value?: MergePolicy): void;

  hasQueryParserConfig(): boolean;
  clearQueryParserConfig(): void;
  getQueryParserConfig(): query_pb.QueryParserConfig | undefined;
  setQueryParserConfig(value?: query_pb.QueryParserConfig): void;

  getIndexEngineCase(): CreateIndexRequest.IndexEngineCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateIndexRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateIndexRequest): CreateIndexRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateIndexRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateIndexRequest;
  static deserializeBinaryFromReader(message: CreateIndexRequest, reader: jspb.BinaryReader): CreateIndexRequest;
}

export namespace CreateIndexRequest {
  export type AsObject = {
    indexName: string,
    file?: CreateFileEngineRequest.AsObject,
    memory?: CreateMemoryEngineRequest.AsObject,
    schema: string,
    compression: CompressionMap[keyof CompressionMap],
    blocksize: number,
    indexAttributes?: IndexAttributes.AsObject,
    mergePolicy?: MergePolicy.AsObject,
    queryParserConfig?: query_pb.QueryParserConfig.AsObject,
  }

  export enum IndexEngineCase {
    INDEX_ENGINE_NOT_SET = 0,
    FILE = 7,
    MEMORY = 8,
  }
}

export class CreateIndexResponse extends jspb.Message {
  hasIndex(): boolean;
  clearIndex(): void;
  getIndex(): IndexDescription | undefined;
  setIndex(value?: IndexDescription): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateIndexResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateIndexResponse): CreateIndexResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateIndexResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateIndexResponse;
  static deserializeBinaryFromReader(message: CreateIndexResponse, reader: jspb.BinaryReader): CreateIndexResponse;
}

export namespace CreateIndexResponse {
  export type AsObject = {
    index?: IndexDescription.AsObject,
  }
}

export class DeleteDocumentsRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  hasQuery(): boolean;
  clearQuery(): void;
  getQuery(): query_pb.Query | undefined;
  setQuery(value?: query_pb.Query): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteDocumentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteDocumentsRequest): DeleteDocumentsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteDocumentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteDocumentsRequest;
  static deserializeBinaryFromReader(message: DeleteDocumentsRequest, reader: jspb.BinaryReader): DeleteDocumentsRequest;
}

export namespace DeleteDocumentsRequest {
  export type AsObject = {
    indexName: string,
    query?: query_pb.Query.AsObject,
  }
}

export class DeleteDocumentsResponse extends jspb.Message {
  getDeletedDocuments(): number;
  setDeletedDocuments(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteDocumentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteDocumentsResponse): DeleteDocumentsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteDocumentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteDocumentsResponse;
  static deserializeBinaryFromReader(message: DeleteDocumentsResponse, reader: jspb.BinaryReader): DeleteDocumentsResponse;
}

export namespace DeleteDocumentsResponse {
  export type AsObject = {
    deletedDocuments: number,
  }
}

export class DeleteIndexRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteIndexRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteIndexRequest): DeleteIndexRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteIndexRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteIndexRequest;
  static deserializeBinaryFromReader(message: DeleteIndexRequest, reader: jspb.BinaryReader): DeleteIndexRequest;
}

export namespace DeleteIndexRequest {
  export type AsObject = {
    indexName: string,
  }
}

export class DeleteIndexResponse extends jspb.Message {
  getDeletedIndexName(): string;
  setDeletedIndexName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteIndexResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteIndexResponse): DeleteIndexResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteIndexResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteIndexResponse;
  static deserializeBinaryFromReader(message: DeleteIndexResponse, reader: jspb.BinaryReader): DeleteIndexResponse;
}

export namespace DeleteIndexResponse {
  export type AsObject = {
    deletedIndexName: string,
  }
}

export class GetIndicesAliasesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIndicesAliasesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetIndicesAliasesRequest): GetIndicesAliasesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetIndicesAliasesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIndicesAliasesRequest;
  static deserializeBinaryFromReader(message: GetIndicesAliasesRequest, reader: jspb.BinaryReader): GetIndicesAliasesRequest;
}

export namespace GetIndicesAliasesRequest {
  export type AsObject = {
  }
}

export class GetIndicesAliasesResponse extends jspb.Message {
  getIndicesAliasesMap(): jspb.Map<string, string>;
  clearIndicesAliasesMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIndicesAliasesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetIndicesAliasesResponse): GetIndicesAliasesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetIndicesAliasesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIndicesAliasesResponse;
  static deserializeBinaryFromReader(message: GetIndicesAliasesResponse, reader: jspb.BinaryReader): GetIndicesAliasesResponse;
}

export namespace GetIndicesAliasesResponse {
  export type AsObject = {
    indicesAliasesMap: Array<[string, string]>,
  }
}

export class GetIndexRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIndexRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetIndexRequest): GetIndexRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetIndexRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIndexRequest;
  static deserializeBinaryFromReader(message: GetIndexRequest, reader: jspb.BinaryReader): GetIndexRequest;
}

export namespace GetIndexRequest {
  export type AsObject = {
    indexName: string,
  }
}

export class GetIndexResponse extends jspb.Message {
  hasIndex(): boolean;
  clearIndex(): void;
  getIndex(): IndexDescription | undefined;
  setIndex(value?: IndexDescription): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIndexResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetIndexResponse): GetIndexResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetIndexResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIndexResponse;
  static deserializeBinaryFromReader(message: GetIndexResponse, reader: jspb.BinaryReader): GetIndexResponse;
}

export namespace GetIndexResponse {
  export type AsObject = {
    index?: IndexDescription.AsObject,
  }
}

export class GetIndicesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIndicesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetIndicesRequest): GetIndicesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetIndicesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIndicesRequest;
  static deserializeBinaryFromReader(message: GetIndicesRequest, reader: jspb.BinaryReader): GetIndicesRequest;
}

export namespace GetIndicesRequest {
  export type AsObject = {
  }
}

export class GetIndicesResponse extends jspb.Message {
  clearIndexNamesList(): void;
  getIndexNamesList(): Array<string>;
  setIndexNamesList(value: Array<string>): void;
  addIndexNames(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIndicesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetIndicesResponse): GetIndicesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetIndicesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIndicesResponse;
  static deserializeBinaryFromReader(message: GetIndicesResponse, reader: jspb.BinaryReader): GetIndicesResponse;
}

export namespace GetIndicesResponse {
  export type AsObject = {
    indexNamesList: Array<string>,
  }
}

export class IndexDocumentStreamRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  clearDocumentsList(): void;
  getDocumentsList(): Array<Uint8Array | string>;
  getDocumentsList_asU8(): Array<Uint8Array>;
  getDocumentsList_asB64(): Array<string>;
  setDocumentsList(value: Array<Uint8Array | string>): void;
  addDocuments(value: Uint8Array | string, index?: number): Uint8Array | string;

  hasConflictStrategy(): boolean;
  clearConflictStrategy(): void;
  getConflictStrategy(): ConflictStrategyMap[keyof ConflictStrategyMap];
  setConflictStrategy(value: ConflictStrategyMap[keyof ConflictStrategyMap]): void;

  getSkipUpdatedAtModification(): boolean;
  setSkipUpdatedAtModification(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IndexDocumentStreamRequest.AsObject;
  static toObject(includeInstance: boolean, msg: IndexDocumentStreamRequest): IndexDocumentStreamRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IndexDocumentStreamRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IndexDocumentStreamRequest;
  static deserializeBinaryFromReader(message: IndexDocumentStreamRequest, reader: jspb.BinaryReader): IndexDocumentStreamRequest;
}

export namespace IndexDocumentStreamRequest {
  export type AsObject = {
    indexName: string,
    documentsList: Array<Uint8Array | string>,
    conflictStrategy: ConflictStrategyMap[keyof ConflictStrategyMap],
    skipUpdatedAtModification: boolean,
  }
}

export class IndexDocumentStreamResponse extends jspb.Message {
  getElapsedSecs(): number;
  setElapsedSecs(value: number): void;

  getSuccessDocs(): number;
  setSuccessDocs(value: number): void;

  getFailedDocs(): number;
  setFailedDocs(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IndexDocumentStreamResponse.AsObject;
  static toObject(includeInstance: boolean, msg: IndexDocumentStreamResponse): IndexDocumentStreamResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IndexDocumentStreamResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IndexDocumentStreamResponse;
  static deserializeBinaryFromReader(message: IndexDocumentStreamResponse, reader: jspb.BinaryReader): IndexDocumentStreamResponse;
}

export namespace IndexDocumentStreamResponse {
  export type AsObject = {
    elapsedSecs: number,
    successDocs: number,
    failedDocs: number,
  }
}

export class IndexDocumentRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  getDocument(): Uint8Array | string;
  getDocument_asU8(): Uint8Array;
  getDocument_asB64(): string;
  setDocument(value: Uint8Array | string): void;

  getSkipUpdatedAtModification(): boolean;
  setSkipUpdatedAtModification(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IndexDocumentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: IndexDocumentRequest): IndexDocumentRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IndexDocumentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IndexDocumentRequest;
  static deserializeBinaryFromReader(message: IndexDocumentRequest, reader: jspb.BinaryReader): IndexDocumentRequest;
}

export namespace IndexDocumentRequest {
  export type AsObject = {
    indexName: string,
    document: Uint8Array | string,
    skipUpdatedAtModification: boolean,
  }
}

export class IndexDocumentResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IndexDocumentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: IndexDocumentResponse): IndexDocumentResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IndexDocumentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IndexDocumentResponse;
  static deserializeBinaryFromReader(message: IndexDocumentResponse, reader: jspb.BinaryReader): IndexDocumentResponse;
}

export namespace IndexDocumentResponse {
  export type AsObject = {
  }
}

export class MergeSegmentsRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  clearSegmentIdsList(): void;
  getSegmentIdsList(): Array<string>;
  setSegmentIdsList(value: Array<string>): void;
  addSegmentIds(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MergeSegmentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MergeSegmentsRequest): MergeSegmentsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MergeSegmentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MergeSegmentsRequest;
  static deserializeBinaryFromReader(message: MergeSegmentsRequest, reader: jspb.BinaryReader): MergeSegmentsRequest;
}

export namespace MergeSegmentsRequest {
  export type AsObject = {
    indexName: string,
    segmentIdsList: Array<string>,
  }
}

export class MergeSegmentsResponse extends jspb.Message {
  hasSegmentId(): boolean;
  clearSegmentId(): void;
  getSegmentId(): string;
  setSegmentId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MergeSegmentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MergeSegmentsResponse): MergeSegmentsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MergeSegmentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MergeSegmentsResponse;
  static deserializeBinaryFromReader(message: MergeSegmentsResponse, reader: jspb.BinaryReader): MergeSegmentsResponse;
}

export namespace MergeSegmentsResponse {
  export type AsObject = {
    segmentId: string,
  }
}

export class SetIndexAliasRequest extends jspb.Message {
  getIndexAlias(): string;
  setIndexAlias(value: string): void;

  getIndexName(): string;
  setIndexName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetIndexAliasRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetIndexAliasRequest): SetIndexAliasRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetIndexAliasRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetIndexAliasRequest;
  static deserializeBinaryFromReader(message: SetIndexAliasRequest, reader: jspb.BinaryReader): SetIndexAliasRequest;
}

export namespace SetIndexAliasRequest {
  export type AsObject = {
    indexAlias: string,
    indexName: string,
  }
}

export class SetIndexAliasResponse extends jspb.Message {
  hasOldIndexName(): boolean;
  clearOldIndexName(): void;
  getOldIndexName(): string;
  setOldIndexName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetIndexAliasResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetIndexAliasResponse): SetIndexAliasResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetIndexAliasResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetIndexAliasResponse;
  static deserializeBinaryFromReader(message: SetIndexAliasResponse, reader: jspb.BinaryReader): SetIndexAliasResponse;
}

export namespace SetIndexAliasResponse {
  export type AsObject = {
    oldIndexName: string,
  }
}

export class DocumentsRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  clearFieldsList(): void;
  getFieldsList(): Array<string>;
  setFieldsList(value: Array<string>): void;
  addFields(value: string, index?: number): string;

  hasQueryFilter(): boolean;
  clearQueryFilter(): void;
  getQueryFilter(): query_pb.Query | undefined;
  setQueryFilter(value?: query_pb.Query): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocumentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DocumentsRequest): DocumentsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DocumentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocumentsRequest;
  static deserializeBinaryFromReader(message: DocumentsRequest, reader: jspb.BinaryReader): DocumentsRequest;
}

export namespace DocumentsRequest {
  export type AsObject = {
    indexName: string,
    fieldsList: Array<string>,
    queryFilter?: query_pb.Query.AsObject,
  }
}

export class DocumentsResponse extends jspb.Message {
  getDocument(): string;
  setDocument(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocumentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DocumentsResponse): DocumentsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DocumentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocumentsResponse;
  static deserializeBinaryFromReader(message: DocumentsResponse, reader: jspb.BinaryReader): DocumentsResponse;
}

export namespace DocumentsResponse {
  export type AsObject = {
    document: string,
  }
}

export class VacuumIndexRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  clearExcludedSegmentsList(): void;
  getExcludedSegmentsList(): Array<string>;
  setExcludedSegmentsList(value: Array<string>): void;
  addExcludedSegments(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VacuumIndexRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VacuumIndexRequest): VacuumIndexRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VacuumIndexRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VacuumIndexRequest;
  static deserializeBinaryFromReader(message: VacuumIndexRequest, reader: jspb.BinaryReader): VacuumIndexRequest;
}

export namespace VacuumIndexRequest {
  export type AsObject = {
    indexName: string,
    excludedSegmentsList: Array<string>,
  }
}

export class VacuumIndexResponse extends jspb.Message {
  getFreedSpaceBytes(): number;
  setFreedSpaceBytes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VacuumIndexResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VacuumIndexResponse): VacuumIndexResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VacuumIndexResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VacuumIndexResponse;
  static deserializeBinaryFromReader(message: VacuumIndexResponse, reader: jspb.BinaryReader): VacuumIndexResponse;
}

export namespace VacuumIndexResponse {
  export type AsObject = {
    freedSpaceBytes: number,
  }
}

export class WarmupIndexRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  getIsFull(): boolean;
  setIsFull(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WarmupIndexRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WarmupIndexRequest): WarmupIndexRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WarmupIndexRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WarmupIndexRequest;
  static deserializeBinaryFromReader(message: WarmupIndexRequest, reader: jspb.BinaryReader): WarmupIndexRequest;
}

export namespace WarmupIndexRequest {
  export type AsObject = {
    indexName: string,
    isFull: boolean,
  }
}

export class WarmupIndexResponse extends jspb.Message {
  getElapsedSecs(): number;
  setElapsedSecs(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WarmupIndexResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WarmupIndexResponse): WarmupIndexResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WarmupIndexResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WarmupIndexResponse;
  static deserializeBinaryFromReader(message: WarmupIndexResponse, reader: jspb.BinaryReader): WarmupIndexResponse;
}

export namespace WarmupIndexResponse {
  export type AsObject = {
    elapsedSecs: number,
  }
}

export class FileEngineConfig extends jspb.Message {
  getPath(): string;
  setPath(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FileEngineConfig.AsObject;
  static toObject(includeInstance: boolean, msg: FileEngineConfig): FileEngineConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FileEngineConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FileEngineConfig;
  static deserializeBinaryFromReader(message: FileEngineConfig, reader: jspb.BinaryReader): FileEngineConfig;
}

export namespace FileEngineConfig {
  export type AsObject = {
    path: string,
  }
}

export class MemoryEngineConfig extends jspb.Message {
  getSchema(): string;
  setSchema(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MemoryEngineConfig.AsObject;
  static toObject(includeInstance: boolean, msg: MemoryEngineConfig): MemoryEngineConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MemoryEngineConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MemoryEngineConfig;
  static deserializeBinaryFromReader(message: MemoryEngineConfig, reader: jspb.BinaryReader): MemoryEngineConfig;
}

export namespace MemoryEngineConfig {
  export type AsObject = {
    schema: string,
  }
}

export class CacheConfig extends jspb.Message {
  getCacheSize(): number;
  setCacheSize(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CacheConfig.AsObject;
  static toObject(includeInstance: boolean, msg: CacheConfig): CacheConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CacheConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CacheConfig;
  static deserializeBinaryFromReader(message: CacheConfig, reader: jspb.BinaryReader): CacheConfig;
}

export namespace CacheConfig {
  export type AsObject = {
    cacheSize: number,
  }
}

export class RemoteEngineConfig extends jspb.Message {
  getMethod(): string;
  setMethod(value: string): void;

  getUrlTemplate(): string;
  setUrlTemplate(value: string): void;

  getHeadersTemplateMap(): jspb.Map<string, string>;
  clearHeadersTemplateMap(): void;
  hasCacheConfig(): boolean;
  clearCacheConfig(): void;
  getCacheConfig(): CacheConfig | undefined;
  setCacheConfig(value?: CacheConfig): void;

  hasTimeoutMs(): boolean;
  clearTimeoutMs(): void;
  getTimeoutMs(): number;
  setTimeoutMs(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoteEngineConfig.AsObject;
  static toObject(includeInstance: boolean, msg: RemoteEngineConfig): RemoteEngineConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RemoteEngineConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoteEngineConfig;
  static deserializeBinaryFromReader(message: RemoteEngineConfig, reader: jspb.BinaryReader): RemoteEngineConfig;
}

export namespace RemoteEngineConfig {
  export type AsObject = {
    method: string,
    urlTemplate: string,
    headersTemplateMap: Array<[string, string]>,
    cacheConfig?: CacheConfig.AsObject,
    timeoutMs: number,
  }
}

export class LogMergePolicy extends jspb.Message {
  getIsFrozen(): boolean;
  setIsFrozen(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogMergePolicy.AsObject;
  static toObject(includeInstance: boolean, msg: LogMergePolicy): LogMergePolicy.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LogMergePolicy, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogMergePolicy;
  static deserializeBinaryFromReader(message: LogMergePolicy, reader: jspb.BinaryReader): LogMergePolicy;
}

export namespace LogMergePolicy {
  export type AsObject = {
    isFrozen: boolean,
  }
}

export class TemporalMergePolicy extends jspb.Message {
  getMergeOlderThenSecs(): number;
  setMergeOlderThenSecs(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TemporalMergePolicy.AsObject;
  static toObject(includeInstance: boolean, msg: TemporalMergePolicy): TemporalMergePolicy.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TemporalMergePolicy, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TemporalMergePolicy;
  static deserializeBinaryFromReader(message: TemporalMergePolicy, reader: jspb.BinaryReader): TemporalMergePolicy;
}

export namespace TemporalMergePolicy {
  export type AsObject = {
    mergeOlderThenSecs: number,
  }
}

export class IndexEngineConfig extends jspb.Message {
  hasFile(): boolean;
  clearFile(): void;
  getFile(): FileEngineConfig | undefined;
  setFile(value?: FileEngineConfig): void;

  hasMemory(): boolean;
  clearMemory(): void;
  getMemory(): MemoryEngineConfig | undefined;
  setMemory(value?: MemoryEngineConfig): void;

  hasRemote(): boolean;
  clearRemote(): void;
  getRemote(): RemoteEngineConfig | undefined;
  setRemote(value?: RemoteEngineConfig): void;

  hasMergePolicy(): boolean;
  clearMergePolicy(): void;
  getMergePolicy(): MergePolicy | undefined;
  setMergePolicy(value?: MergePolicy): void;

  hasQueryParserConfig(): boolean;
  clearQueryParserConfig(): void;
  getQueryParserConfig(): query_pb.QueryParserConfig | undefined;
  setQueryParserConfig(value?: query_pb.QueryParserConfig): void;

  getConfigCase(): IndexEngineConfig.ConfigCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IndexEngineConfig.AsObject;
  static toObject(includeInstance: boolean, msg: IndexEngineConfig): IndexEngineConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IndexEngineConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IndexEngineConfig;
  static deserializeBinaryFromReader(message: IndexEngineConfig, reader: jspb.BinaryReader): IndexEngineConfig;
}

export namespace IndexEngineConfig {
  export type AsObject = {
    file?: FileEngineConfig.AsObject,
    memory?: MemoryEngineConfig.AsObject,
    remote?: RemoteEngineConfig.AsObject,
    mergePolicy?: MergePolicy.AsObject,
    queryParserConfig?: query_pb.QueryParserConfig.AsObject,
  }

  export enum ConfigCase {
    CONFIG_NOT_SET = 0,
    FILE = 1,
    MEMORY = 2,
    REMOTE = 3,
  }
}

export class IndexDescription extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  clearIndexAliasesList(): void;
  getIndexAliasesList(): Array<string>;
  setIndexAliasesList(value: Array<string>): void;
  addIndexAliases(value: string, index?: number): string;

  hasIndexEngine(): boolean;
  clearIndexEngine(): void;
  getIndexEngine(): IndexEngineConfig | undefined;
  setIndexEngine(value?: IndexEngineConfig): void;

  getNumDocs(): number;
  setNumDocs(value: number): void;

  getCompression(): CompressionMap[keyof CompressionMap];
  setCompression(value: CompressionMap[keyof CompressionMap]): void;

  hasIndexAttributes(): boolean;
  clearIndexAttributes(): void;
  getIndexAttributes(): IndexAttributes | undefined;
  setIndexAttributes(value?: IndexAttributes): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IndexDescription.AsObject;
  static toObject(includeInstance: boolean, msg: IndexDescription): IndexDescription.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IndexDescription, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IndexDescription;
  static deserializeBinaryFromReader(message: IndexDescription, reader: jspb.BinaryReader): IndexDescription;
}

export namespace IndexDescription {
  export type AsObject = {
    indexName: string,
    indexAliasesList: Array<string>,
    indexEngine?: IndexEngineConfig.AsObject,
    numDocs: number,
    compression: CompressionMap[keyof CompressionMap],
    indexAttributes?: IndexAttributes.AsObject,
  }
}

export class IndexDocumentOperation extends jspb.Message {
  getDocument(): Uint8Array | string;
  getDocument_asU8(): Uint8Array;
  getDocument_asB64(): string;
  setDocument(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IndexDocumentOperation.AsObject;
  static toObject(includeInstance: boolean, msg: IndexDocumentOperation): IndexDocumentOperation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IndexDocumentOperation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IndexDocumentOperation;
  static deserializeBinaryFromReader(message: IndexDocumentOperation, reader: jspb.BinaryReader): IndexDocumentOperation;
}

export namespace IndexDocumentOperation {
  export type AsObject = {
    document: Uint8Array | string,
  }
}

export class IndexOperation extends jspb.Message {
  hasIndexDocument(): boolean;
  clearIndexDocument(): void;
  getIndexDocument(): IndexDocumentOperation | undefined;
  setIndexDocument(value?: IndexDocumentOperation): void;

  getOperationCase(): IndexOperation.OperationCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IndexOperation.AsObject;
  static toObject(includeInstance: boolean, msg: IndexOperation): IndexOperation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IndexOperation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IndexOperation;
  static deserializeBinaryFromReader(message: IndexOperation, reader: jspb.BinaryReader): IndexOperation;
}

export namespace IndexOperation {
  export type AsObject = {
    indexDocument?: IndexDocumentOperation.AsObject,
  }

  export enum OperationCase {
    OPERATION_NOT_SET = 0,
    INDEX_DOCUMENT = 2,
  }
}

export interface ConflictStrategyMap {
  DO_NOTHING: 0;
  OVERWRITE_ALWAYS: 1;
  OVERWRITE: 2;
  MERGE: 3;
}

export const ConflictStrategy: ConflictStrategyMap;

export interface CompressionMap {
  NONE: 0;
  ZSTD: 4;
  ZSTD7: 5;
  ZSTD9: 6;
  ZSTD14: 7;
  ZSTD19: 8;
  ZSTD22: 9;
}

export const Compression: CompressionMap;

