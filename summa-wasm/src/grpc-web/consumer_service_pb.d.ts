// package: summa.proto
// file: consumer_service.proto

import * as jspb from "google-protobuf";

export class CreateConsumerRequest extends jspb.Message {
  clearBootstrapServersList(): void;
  getBootstrapServersList(): Array<string>;
  setBootstrapServersList(value: Array<string>): void;
  addBootstrapServers(value: string, index?: number): string;

  getGroupId(): string;
  setGroupId(value: string): void;

  getIndexName(): string;
  setIndexName(value: string): void;

  getConsumerName(): string;
  setConsumerName(value: string): void;

  clearTopicsList(): void;
  getTopicsList(): Array<string>;
  setTopicsList(value: Array<string>): void;
  addTopics(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateConsumerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateConsumerRequest): CreateConsumerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateConsumerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateConsumerRequest;
  static deserializeBinaryFromReader(message: CreateConsumerRequest, reader: jspb.BinaryReader): CreateConsumerRequest;
}

export namespace CreateConsumerRequest {
  export type AsObject = {
    bootstrapServersList: Array<string>,
    groupId: string,
    indexName: string,
    consumerName: string,
    topicsList: Array<string>,
  }
}

export class CreateConsumerResponse extends jspb.Message {
  hasConsumer(): boolean;
  clearConsumer(): void;
  getConsumer(): Consumer | undefined;
  setConsumer(value?: Consumer): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateConsumerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateConsumerResponse): CreateConsumerResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateConsumerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateConsumerResponse;
  static deserializeBinaryFromReader(message: CreateConsumerResponse, reader: jspb.BinaryReader): CreateConsumerResponse;
}

export namespace CreateConsumerResponse {
  export type AsObject = {
    consumer?: Consumer.AsObject,
  }
}

export class DeleteConsumerRequest extends jspb.Message {
  getConsumerName(): string;
  setConsumerName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteConsumerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteConsumerRequest): DeleteConsumerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteConsumerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteConsumerRequest;
  static deserializeBinaryFromReader(message: DeleteConsumerRequest, reader: jspb.BinaryReader): DeleteConsumerRequest;
}

export namespace DeleteConsumerRequest {
  export type AsObject = {
    consumerName: string,
  }
}

export class DeleteConsumerResponse extends jspb.Message {
  getConsumerName(): string;
  setConsumerName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteConsumerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteConsumerResponse): DeleteConsumerResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteConsumerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteConsumerResponse;
  static deserializeBinaryFromReader(message: DeleteConsumerResponse, reader: jspb.BinaryReader): DeleteConsumerResponse;
}

export namespace DeleteConsumerResponse {
  export type AsObject = {
    consumerName: string,
  }
}

export class GetConsumerRequest extends jspb.Message {
  getIndexName(): string;
  setIndexName(value: string): void;

  getConsumerName(): string;
  setConsumerName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetConsumerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetConsumerRequest): GetConsumerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetConsumerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetConsumerRequest;
  static deserializeBinaryFromReader(message: GetConsumerRequest, reader: jspb.BinaryReader): GetConsumerRequest;
}

export namespace GetConsumerRequest {
  export type AsObject = {
    indexName: string,
    consumerName: string,
  }
}

export class GetConsumerResponse extends jspb.Message {
  hasConsumer(): boolean;
  clearConsumer(): void;
  getConsumer(): Consumer | undefined;
  setConsumer(value?: Consumer): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetConsumerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetConsumerResponse): GetConsumerResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetConsumerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetConsumerResponse;
  static deserializeBinaryFromReader(message: GetConsumerResponse, reader: jspb.BinaryReader): GetConsumerResponse;
}

export namespace GetConsumerResponse {
  export type AsObject = {
    consumer?: Consumer.AsObject,
  }
}

export class GetConsumersRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetConsumersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetConsumersRequest): GetConsumersRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetConsumersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetConsumersRequest;
  static deserializeBinaryFromReader(message: GetConsumersRequest, reader: jspb.BinaryReader): GetConsumersRequest;
}

export namespace GetConsumersRequest {
  export type AsObject = {
  }
}

export class GetConsumersResponse extends jspb.Message {
  clearConsumersList(): void;
  getConsumersList(): Array<Consumer>;
  setConsumersList(value: Array<Consumer>): void;
  addConsumers(value?: Consumer, index?: number): Consumer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetConsumersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetConsumersResponse): GetConsumersResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetConsumersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetConsumersResponse;
  static deserializeBinaryFromReader(message: GetConsumersResponse, reader: jspb.BinaryReader): GetConsumersResponse;
}

export namespace GetConsumersResponse {
  export type AsObject = {
    consumersList: Array<Consumer.AsObject>,
  }
}

export class Consumer extends jspb.Message {
  getConsumerName(): string;
  setConsumerName(value: string): void;

  getIndexName(): string;
  setIndexName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Consumer.AsObject;
  static toObject(includeInstance: boolean, msg: Consumer): Consumer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Consumer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Consumer;
  static deserializeBinaryFromReader(message: Consumer, reader: jspb.BinaryReader): Consumer;
}

export namespace Consumer {
  export type AsObject = {
    consumerName: string,
    indexName: string,
  }
}

