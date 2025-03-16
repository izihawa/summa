// package: summa.proto
// file: reflection_service.proto

import * as jspb from "google-protobuf";

export class GetTopTermsRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  getFieldName(): string;
  setFieldName(value: string): void;

  getTopK(): number;
  setTopK(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTopTermsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTopTermsRequest): GetTopTermsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTopTermsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTopTermsRequest;
  static deserializeBinaryFromReader(message: GetTopTermsRequest, reader: jspb.BinaryReader): GetTopTermsRequest;
}

export namespace GetTopTermsRequest {
  export type AsObject = {
    indexName: string,
    fieldName: string,
    topK: number,
  }
}

export class GetTopTermsResponse extends jspb.Message {
  getPerSegmentMap(): jspb.Map<string, SegmentTerms>;
  clearPerSegmentMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTopTermsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTopTermsResponse): GetTopTermsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTopTermsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTopTermsResponse;
  static deserializeBinaryFromReader(message: GetTopTermsResponse, reader: jspb.BinaryReader): GetTopTermsResponse;
}

export namespace GetTopTermsResponse {
  export type AsObject = {
    perSegmentMap: Array<[string, SegmentTerms.AsObject]>,
  }
}

export class SegmentTerms extends jspb.Message {
  clearTermInfosList(): void;
  getTermInfosList(): Array<TermInfo>;
  setTermInfosList(value: Array<TermInfo>): void;
  addTermInfos(value?: TermInfo, index?: number): TermInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SegmentTerms.AsObject;
  static toObject(includeInstance: boolean, msg: SegmentTerms): SegmentTerms.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SegmentTerms, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SegmentTerms;
  static deserializeBinaryFromReader(message: SegmentTerms, reader: jspb.BinaryReader): SegmentTerms;
}

export namespace SegmentTerms {
  export type AsObject = {
    termInfosList: Array<TermInfo.AsObject>,
  }
}

export class TermInfo extends jspb.Message {
  getKey(): Uint8Array | string;
  getKey_asU8(): Uint8Array;
  getKey_asB64(): string;
  setKey(value: Uint8Array | string): void;

  getDocFreq(): number;
  setDocFreq(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TermInfo.AsObject;
  static toObject(includeInstance: boolean, msg: TermInfo): TermInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TermInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TermInfo;
  static deserializeBinaryFromReader(message: TermInfo, reader: jspb.BinaryReader): TermInfo;
}

export namespace TermInfo {
  export type AsObject = {
    key: Uint8Array | string,
    docFreq: number,
  }
}

