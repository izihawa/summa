// package: unixfs
// file: unixfs.proto

import * as jspb from "google-protobuf";

export class Data extends jspb.Message {
  getType(): Data.DataTypeMap[keyof Data.DataTypeMap];
  setType(value: Data.DataTypeMap[keyof Data.DataTypeMap]): void;

  hasData(): boolean;
  clearData(): void;
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  hasFilesize(): boolean;
  clearFilesize(): void;
  getFilesize(): number;
  setFilesize(value: number): void;

  clearBlocksizesList(): void;
  getBlocksizesList(): Array<number>;
  setBlocksizesList(value: Array<number>): void;
  addBlocksizes(value: number, index?: number): number;

  hasHashtype(): boolean;
  clearHashtype(): void;
  getHashtype(): number;
  setHashtype(value: number): void;

  hasFanout(): boolean;
  clearFanout(): void;
  getFanout(): number;
  setFanout(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Data.AsObject;
  static toObject(includeInstance: boolean, msg: Data): Data.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Data, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Data;
  static deserializeBinaryFromReader(message: Data, reader: jspb.BinaryReader): Data;
}

export namespace Data {
  export type AsObject = {
    type: Data.DataTypeMap[keyof Data.DataTypeMap],
    data: Uint8Array | string,
    filesize: number,
    blocksizesList: Array<number>,
    hashtype: number,
    fanout: number,
  }

  export interface DataTypeMap {
    RAW: 0;
    DIRECTORY: 1;
    FILE: 2;
    METADATA: 3;
    SYMLINK: 4;
    HAMTSHARD: 5;
  }

  export const DataType: DataTypeMap;
}

export class Metadata extends jspb.Message {
  hasMimetype(): boolean;
  clearMimetype(): void;
  getMimetype(): string;
  setMimetype(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Metadata.AsObject;
  static toObject(includeInstance: boolean, msg: Metadata): Metadata.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Metadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Metadata;
  static deserializeBinaryFromReader(message: Metadata, reader: jspb.BinaryReader): Metadata;
}

export namespace Metadata {
  export type AsObject = {
    mimetype: string,
  }
}

