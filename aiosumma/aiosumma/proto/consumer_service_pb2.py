# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: consumer_service.proto
# Protobuf Python Version: 5.29.0
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    29,
    0,
    '',
    'consumer_service.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x16\x63onsumer_service.proto\x12\x0bsumma.proto\"\x7f\n\x15\x43reateConsumerRequest\x12\x19\n\x11\x62ootstrap_servers\x18\x01 \x03(\t\x12\x10\n\x08group_id\x18\x02 \x01(\t\x12\x12\n\nindex_name\x18\x03 \x01(\t\x12\x15\n\rconsumer_name\x18\x04 \x01(\t\x12\x0e\n\x06topics\x18\x05 \x03(\t\"A\n\x16\x43reateConsumerResponse\x12\'\n\x08\x63onsumer\x18\x01 \x01(\x0b\x32\x15.summa.proto.Consumer\".\n\x15\x44\x65leteConsumerRequest\x12\x15\n\rconsumer_name\x18\x01 \x01(\t\"/\n\x16\x44\x65leteConsumerResponse\x12\x15\n\rconsumer_name\x18\x02 \x01(\t\"?\n\x12GetConsumerRequest\x12\x12\n\nindex_name\x18\x01 \x01(\t\x12\x15\n\rconsumer_name\x18\x02 \x01(\t\">\n\x13GetConsumerResponse\x12\'\n\x08\x63onsumer\x18\x01 \x01(\x0b\x32\x15.summa.proto.Consumer\"\x15\n\x13GetConsumersRequest\"@\n\x14GetConsumersResponse\x12(\n\tconsumers\x18\x01 \x03(\x0b\x32\x15.summa.proto.Consumer\"5\n\x08\x43onsumer\x12\x15\n\rconsumer_name\x18\x01 \x01(\t\x12\x12\n\nindex_name\x18\x02 \x01(\t2\xf6\x02\n\x0b\x43onsumerApi\x12\\\n\x0f\x63reate_consumer\x12\".summa.proto.CreateConsumerRequest\x1a#.summa.proto.CreateConsumerResponse\"\x00\x12S\n\x0cget_consumer\x12\x1f.summa.proto.GetConsumerRequest\x1a .summa.proto.GetConsumerResponse\"\x00\x12V\n\rget_consumers\x12 .summa.proto.GetConsumersRequest\x1a!.summa.proto.GetConsumersResponse\"\x00\x12\\\n\x0f\x64\x65lete_consumer\x12\".summa.proto.DeleteConsumerRequest\x1a#.summa.proto.DeleteConsumerResponse\"\x00\x62\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'consumer_service_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_CREATECONSUMERREQUEST']._serialized_start=39
  _globals['_CREATECONSUMERREQUEST']._serialized_end=166
  _globals['_CREATECONSUMERRESPONSE']._serialized_start=168
  _globals['_CREATECONSUMERRESPONSE']._serialized_end=233
  _globals['_DELETECONSUMERREQUEST']._serialized_start=235
  _globals['_DELETECONSUMERREQUEST']._serialized_end=281
  _globals['_DELETECONSUMERRESPONSE']._serialized_start=283
  _globals['_DELETECONSUMERRESPONSE']._serialized_end=330
  _globals['_GETCONSUMERREQUEST']._serialized_start=332
  _globals['_GETCONSUMERREQUEST']._serialized_end=395
  _globals['_GETCONSUMERRESPONSE']._serialized_start=397
  _globals['_GETCONSUMERRESPONSE']._serialized_end=459
  _globals['_GETCONSUMERSREQUEST']._serialized_start=461
  _globals['_GETCONSUMERSREQUEST']._serialized_end=482
  _globals['_GETCONSUMERSRESPONSE']._serialized_start=484
  _globals['_GETCONSUMERSRESPONSE']._serialized_end=548
  _globals['_CONSUMER']._serialized_start=550
  _globals['_CONSUMER']._serialized_end=603
  _globals['_CONSUMERAPI']._serialized_start=606
  _globals['_CONSUMERAPI']._serialized_end=980
# @@protoc_insertion_point(module_scope)
