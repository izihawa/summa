// package: dag_pb
// file: dag_pb.proto

import * as jspb from "google-protobuf";

export class PBLink extends jspb.Message {
  hasHash(): boolean;
  clearHash(): void;
  getHash(): Uint8Array | string;
  getHash_asU8(): Uint8Array;
  getHash_asB64(): string;
  setHash(value: Uint8Array | string): void;

  hasName(): boolean;
  clearName(): void;
  getName(): string;
  setName(value: string): void;

  hasTSize(): boolean;
  clearTSize(): void;
  getTSize(): number;
  setTSize(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PBLink.AsObject;
  static toObject(includeInstance: boolean, msg: PBLink): PBLink.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PBLink, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PBLink;
  static deserializeBinaryFromReader(message: PBLink, reader: jspb.BinaryReader): PBLink;
}

export namespace PBLink {
  export type AsObject = {
    hash: Uint8Array | string,
    name: string,
    tSize: number,
  }
}

export class PBNode extends jspb.Message {
  clearLinksList(): void;
  getLinksList(): Array<PBLink>;
  setLinksList(value: Array<PBLink>): void;
  addLinks(value?: PBLink, index?: number): PBLink;

  hasData(): boolean;
  clearData(): void;
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PBNode.AsObject;
  static toObject(includeInstance: boolean, msg: PBNode): PBNode.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PBNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PBNode;
  static deserializeBinaryFromReader(message: PBNode, reader: jspb.BinaryReader): PBNode;
}

export namespace PBNode {
  export type AsObject = {
    linksList: Array<PBLink.AsObject>,
    data: Uint8Array | string,
  }
}

