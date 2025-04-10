# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: index_service.proto
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
    'index_service.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from . import query_pb2 as query__pb2
from . import utils_pb2 as utils__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x13index_service.proto\x12\x0bsumma.proto\x1a\x0bquery.proto\x1a\x0butils.proto\"\x7f\n\x0bMergePolicy\x12*\n\x03log\x18\x0b \x01(\x0b\x32\x1b.summa.proto.LogMergePolicyH\x00\x12\x34\n\x08temporal\x18\x0c \x01(\x0b\x32 .summa.proto.TemporalMergePolicyH\x00\x42\x0e\n\x0cmerge_policy\"\x19\n\x17\x41ttachFileEngineRequest\"L\n\x19\x41ttachRemoteEngineRequest\x12/\n\x06\x63onfig\x18\x01 \x01(\x0b\x32\x1f.summa.proto.RemoteEngineConfig\"\x95\x02\n\x12\x41ttachIndexRequest\x12\x12\n\nindex_name\x18\x01 \x01(\t\x12\x34\n\x04\x66ile\x18\x02 \x01(\x0b\x32$.summa.proto.AttachFileEngineRequestH\x00\x12\x38\n\x06remote\x18\x03 \x01(\x0b\x32&.summa.proto.AttachRemoteEngineRequestH\x00\x12.\n\x0cmerge_policy\x18\n \x01(\x0b\x32\x18.summa.proto.MergePolicy\x12;\n\x13query_parser_config\x18\x0b \x01(\x0b\x32\x1e.summa.proto.QueryParserConfigB\x0e\n\x0cindex_engine\"C\n\x13\x41ttachIndexResponse\x12,\n\x05index\x18\x01 \x01(\x0b\x32\x1d.summa.proto.IndexDescription\"?\n\x12\x43ommitIndexRequest\x12\x12\n\nindex_name\x18\x01 \x01(\t\x12\x15\n\rwith_hotcache\x18\x02 \x01(\x08\"+\n\x13\x43ommitIndexResponse\x12\x14\n\x0c\x65lapsed_secs\x18\x01 \x01(\x01\"\xa1\x01\n\x14\x43opyDocumentsRequest\x12\x19\n\x11source_index_name\x18\x01 \x01(\t\x12\x19\n\x11target_index_name\x18\x02 \x01(\t\x12=\n\x11\x63onflict_strategy\x18\x03 \x01(\x0e\x32\x1d.summa.proto.ConflictStrategyH\x00\x88\x01\x01\x42\x14\n\x12_conflict_strategy\"G\n\x15\x43opyDocumentsResponse\x12\x14\n\x0c\x65lapsed_secs\x18\x01 \x01(\x01\x12\x18\n\x10\x63opied_documents\x18\x02 \x01(\r\"\xff\x01\n\x10\x43opyIndexRequest\x12\x19\n\x11source_index_name\x18\x01 \x01(\t\x12\x19\n\x11target_index_name\x18\x02 \x01(\t\x12\x34\n\x04\x66ile\x18\x03 \x01(\x0b\x32$.summa.proto.CreateFileEngineRequestH\x00\x12\x38\n\x06memory\x18\x04 \x01(\x0b\x32&.summa.proto.CreateMemoryEngineRequestH\x00\x12.\n\x0cmerge_policy\x18\x06 \x01(\x0b\x32\x18.summa.proto.MergePolicyB\x15\n\x13target_index_engine\"A\n\x11\x43opyIndexResponse\x12,\n\x05index\x18\x01 \x01(\x0b\x32\x1d.summa.proto.IndexDescription\"?\n\x0bSortByField\x12\r\n\x05\x66ield\x18\x01 \x01(\t\x12!\n\x05order\x18\x02 \x01(\x0e\x32\x12.summa.proto.Order\"\x19\n\x17\x43reateFileEngineRequest\"\x1b\n\x19\x43reateMemoryEngineRequest\"9\n\x0bMappedField\x12\x14\n\x0csource_field\x18\x01 \x01(\t\x12\x14\n\x0ctarget_field\x18\x02 \x01(\t\"\x95\x02\n\x0fIndexAttributes\x12\x12\n\ncreated_at\x18\x01 \x01(\x04\x12\x15\n\runique_fields\x18\x02 \x03(\t\x12\x14\n\x0cmulti_fields\x18\x04 \x03(\t\x12\x18\n\x0b\x64\x65scription\x18\x06 \x01(\tH\x00\x88\x01\x01\x12\x38\n\x11\x63onflict_strategy\x18\x08 \x01(\x0e\x32\x1d.summa.proto.ConflictStrategy\x12/\n\rmapped_fields\x18\t \x03(\x0b\x32\x18.summa.proto.MappedField\x12\x1a\n\rauto_id_field\x18\n \x01(\tH\x01\x88\x01\x01\x42\x0e\n\x0c_descriptionB\x10\n\x0e_auto_id_field\"\xb2\x03\n\x12\x43reateIndexRequest\x12\x12\n\nindex_name\x18\x01 \x01(\t\x12\x34\n\x04\x66ile\x18\x07 \x01(\x0b\x32$.summa.proto.CreateFileEngineRequestH\x00\x12\x38\n\x06memory\x18\x08 \x01(\x0b\x32&.summa.proto.CreateMemoryEngineRequestH\x00\x12\x0e\n\x06schema\x18\x02 \x01(\t\x12-\n\x0b\x63ompression\x18\x03 \x01(\x0e\x32\x18.summa.proto.Compression\x12\x16\n\tblocksize\x18\x04 \x01(\rH\x01\x88\x01\x01\x12\x36\n\x10index_attributes\x18\x06 \x01(\x0b\x32\x1c.summa.proto.IndexAttributes\x12.\n\x0cmerge_policy\x18\x14 \x01(\x0b\x32\x18.summa.proto.MergePolicy\x12;\n\x13query_parser_config\x18\x15 \x01(\x0b\x32\x1e.summa.proto.QueryParserConfigB\x0e\n\x0cindex_engineB\x0c\n\n_blocksize\"C\n\x13\x43reateIndexResponse\x12,\n\x05index\x18\x01 \x01(\x0b\x32\x1d.summa.proto.IndexDescription\"O\n\x16\x44\x65leteDocumentsRequest\x12\x12\n\nindex_name\x18\x01 \x01(\t\x12!\n\x05query\x18\x02 \x01(\x0b\x32\x12.summa.proto.Query\"4\n\x17\x44\x65leteDocumentsResponse\x12\x19\n\x11\x64\x65leted_documents\x18\x01 \x01(\x04\"(\n\x12\x44\x65leteIndexRequest\x12\x12\n\nindex_name\x18\x01 \x01(\t\"1\n\x13\x44\x65leteIndexResponse\x12\x1a\n\x12\x64\x65leted_index_name\x18\x01 \x01(\t\"\x1a\n\x18GetIndicesAliasesRequest\"\xa7\x01\n\x19GetIndicesAliasesResponse\x12S\n\x0findices_aliases\x18\x01 \x03(\x0b\x32:.summa.proto.GetIndicesAliasesResponse.IndicesAliasesEntry\x1a\x35\n\x13IndicesAliasesEntry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t:\x02\x38\x01\"%\n\x0fGetIndexRequest\x12\x12\n\nindex_name\x18\x01 \x01(\t\"@\n\x10GetIndexResponse\x12,\n\x05index\x18\x01 \x01(\x0b\x32\x1d.summa.proto.IndexDescription\"\x13\n\x11GetIndicesRequest\")\n\x12GetIndicesResponse\x12\x13\n\x0bindex_names\x18\x01 \x03(\t\"\xbe\x01\n\x1aIndexDocumentStreamRequest\x12\x12\n\nindex_name\x18\x01 \x01(\t\x12\x11\n\tdocuments\x18\x02 \x03(\x0c\x12=\n\x11\x63onflict_strategy\x18\x03 \x01(\x0e\x32\x1d.summa.proto.ConflictStrategyH\x00\x88\x01\x01\x12$\n\x1cskip_updated_at_modification\x18\x04 \x01(\x08\x42\x14\n\x12_conflict_strategy\"^\n\x1bIndexDocumentStreamResponse\x12\x14\n\x0c\x65lapsed_secs\x18\x01 \x01(\x01\x12\x14\n\x0csuccess_docs\x18\x02 \x01(\x04\x12\x13\n\x0b\x66\x61iled_docs\x18\x03 \x01(\x04\"b\n\x14IndexDocumentRequest\x12\x12\n\nindex_name\x18\x01 \x01(\t\x12\x10\n\x08\x64ocument\x18\x02 \x01(\x0c\x12$\n\x1cskip_updated_at_modification\x18\x03 \x01(\x08\"\x17\n\x15IndexDocumentResponse\"?\n\x14MergeSegmentsRequest\x12\x12\n\nindex_name\x18\x01 \x01(\t\x12\x13\n\x0bsegment_ids\x18\x02 \x03(\t\"?\n\x15MergeSegmentsResponse\x12\x17\n\nsegment_id\x18\x01 \x01(\tH\x00\x88\x01\x01\x42\r\n\x0b_segment_id\"?\n\x14SetIndexAliasRequest\x12\x13\n\x0bindex_alias\x18\x01 \x01(\t\x12\x12\n\nindex_name\x18\x02 \x01(\t\"G\n\x15SetIndexAliasResponse\x12\x1b\n\x0eold_index_name\x18\x01 \x01(\tH\x00\x88\x01\x01\x42\x11\n\x0f_old_index_name\"v\n\x10\x44ocumentsRequest\x12\x12\n\nindex_name\x18\x01 \x01(\t\x12\x0e\n\x06\x66ields\x18\x02 \x03(\t\x12-\n\x0cquery_filter\x18\x03 \x01(\x0b\x32\x12.summa.proto.QueryH\x00\x88\x01\x01\x42\x0f\n\r_query_filter\"%\n\x11\x44ocumentsResponse\x12\x10\n\x08\x64ocument\x18\x01 \x01(\t\"C\n\x12VacuumIndexRequest\x12\x12\n\nindex_name\x18\x01 \x01(\t\x12\x19\n\x11\x65xcluded_segments\x18\x02 \x03(\t\"0\n\x13VacuumIndexResponse\x12\x19\n\x11\x66reed_space_bytes\x18\x01 \x01(\x04\"9\n\x12WarmupIndexRequest\x12\x12\n\nindex_name\x18\x01 \x01(\t\x12\x0f\n\x07is_full\x18\x02 \x01(\x08\"+\n\x13WarmupIndexResponse\x12\x14\n\x0c\x65lapsed_secs\x18\x01 \x01(\x01\" \n\x10\x46ileEngineConfig\x12\x0c\n\x04path\x18\x01 \x01(\t\"$\n\x12MemoryEngineConfig\x12\x0e\n\x06schema\x18\x01 \x01(\t\"!\n\x0b\x43\x61\x63heConfig\x12\x12\n\ncache_size\x18\x01 \x01(\x04\"\x9a\x02\n\x12RemoteEngineConfig\x12\x0e\n\x06method\x18\x01 \x01(\t\x12\x14\n\x0curl_template\x18\x02 \x01(\t\x12N\n\x10headers_template\x18\x03 \x03(\x0b\x32\x34.summa.proto.RemoteEngineConfig.HeadersTemplateEntry\x12.\n\x0c\x63\x61\x63he_config\x18\x04 \x01(\x0b\x32\x18.summa.proto.CacheConfig\x12\x17\n\ntimeout_ms\x18\x05 \x01(\rH\x00\x88\x01\x01\x1a\x36\n\x14HeadersTemplateEntry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t:\x02\x38\x01\x42\r\n\x0b_timeout_ms\"#\n\x0eLogMergePolicy\x12\x11\n\tis_frozen\x18\x01 \x01(\x08\"4\n\x13TemporalMergePolicy\x12\x1d\n\x15merge_older_then_secs\x18\x01 \x01(\x04\"\x9f\x02\n\x11IndexEngineConfig\x12-\n\x04\x66ile\x18\x01 \x01(\x0b\x32\x1d.summa.proto.FileEngineConfigH\x00\x12\x31\n\x06memory\x18\x02 \x01(\x0b\x32\x1f.summa.proto.MemoryEngineConfigH\x00\x12\x31\n\x06remote\x18\x03 \x01(\x0b\x32\x1f.summa.proto.RemoteEngineConfigH\x00\x12.\n\x0cmerge_policy\x18\n \x01(\x0b\x32\x18.summa.proto.MergePolicy\x12;\n\x13query_parser_config\x18\x0b \x01(\x0b\x32\x1e.summa.proto.QueryParserConfigB\x08\n\x06\x63onfig\"\xec\x01\n\x10IndexDescription\x12\x12\n\nindex_name\x18\x01 \x01(\t\x12\x15\n\rindex_aliases\x18\x02 \x03(\t\x12\x34\n\x0cindex_engine\x18\x03 \x01(\x0b\x32\x1e.summa.proto.IndexEngineConfig\x12\x10\n\x08num_docs\x18\x04 \x01(\x04\x12-\n\x0b\x63ompression\x18\x05 \x01(\x0e\x32\x18.summa.proto.Compression\x12\x36\n\x10index_attributes\x18\x06 \x01(\x0b\x32\x1c.summa.proto.IndexAttributes\"*\n\x16IndexDocumentOperation\x12\x10\n\x08\x64ocument\x18\x01 \x01(\x0c\"\\\n\x0eIndexOperation\x12=\n\x0eindex_document\x18\x02 \x01(\x0b\x32#.summa.proto.IndexDocumentOperationH\x00\x42\x0b\n\toperation*R\n\x10\x43onflictStrategy\x12\x0e\n\nDO_NOTHING\x10\x00\x12\x14\n\x10OVERWRITE_ALWAYS\x10\x01\x12\r\n\tOVERWRITE\x10\x02\x12\t\n\x05MERGE\x10\x03*[\n\x0b\x43ompression\x12\x08\n\x04None\x10\x00\x12\x08\n\x04Zstd\x10\x04\x12\t\n\x05Zstd7\x10\x05\x12\t\n\x05Zstd9\x10\x06\x12\n\n\x06Zstd14\x10\x07\x12\n\n\x06Zstd19\x10\x08\x12\n\n\x06Zstd22\x10\t2\xeb\x0b\n\x08IndexApi\x12S\n\x0c\x61ttach_index\x12\x1f.summa.proto.AttachIndexRequest\x1a .summa.proto.AttachIndexResponse\"\x00\x12S\n\x0c\x63ommit_index\x12\x1f.summa.proto.CommitIndexRequest\x1a .summa.proto.CommitIndexResponse\"\x00\x12Y\n\x0e\x63opy_documents\x12!.summa.proto.CopyDocumentsRequest\x1a\".summa.proto.CopyDocumentsResponse\"\x00\x12S\n\x0c\x63reate_index\x12\x1f.summa.proto.CreateIndexRequest\x1a .summa.proto.CreateIndexResponse\"\x00\x12M\n\ncopy_index\x12\x1d.summa.proto.CopyIndexRequest\x1a\x1e.summa.proto.CopyIndexResponse\"\x00\x12_\n\x10\x64\x65lete_documents\x12#.summa.proto.DeleteDocumentsRequest\x1a$.summa.proto.DeleteDocumentsResponse\"\x00\x12S\n\x0c\x64\x65lete_index\x12\x1f.summa.proto.DeleteIndexRequest\x1a .summa.proto.DeleteIndexResponse\"\x00\x12N\n\tdocuments\x12\x1d.summa.proto.DocumentsRequest\x1a\x1e.summa.proto.DocumentsResponse\"\x00\x30\x01\x12\x66\n\x13get_indices_aliases\x12%.summa.proto.GetIndicesAliasesRequest\x1a&.summa.proto.GetIndicesAliasesResponse\"\x00\x12J\n\tget_index\x12\x1c.summa.proto.GetIndexRequest\x1a\x1d.summa.proto.GetIndexResponse\"\x00\x12P\n\x0bget_indices\x12\x1e.summa.proto.GetIndicesRequest\x1a\x1f.summa.proto.GetIndicesResponse\"\x00\x12n\n\x15index_document_stream\x12\'.summa.proto.IndexDocumentStreamRequest\x1a(.summa.proto.IndexDocumentStreamResponse\"\x00(\x01\x12Y\n\x0eindex_document\x12!.summa.proto.IndexDocumentRequest\x1a\".summa.proto.IndexDocumentResponse\"\x00\x12Y\n\x0emerge_segments\x12!.summa.proto.MergeSegmentsRequest\x1a\".summa.proto.MergeSegmentsResponse\"\x00\x12Z\n\x0fset_index_alias\x12!.summa.proto.SetIndexAliasRequest\x1a\".summa.proto.SetIndexAliasResponse\"\x00\x12S\n\x0cvacuum_index\x12\x1f.summa.proto.VacuumIndexRequest\x1a .summa.proto.VacuumIndexResponse\"\x00\x12S\n\x0cwarmup_index\x12\x1f.summa.proto.WarmupIndexRequest\x1a .summa.proto.WarmupIndexResponse\"\x00\x62\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'index_service_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_GETINDICESALIASESRESPONSE_INDICESALIASESENTRY']._loaded_options = None
  _globals['_GETINDICESALIASESRESPONSE_INDICESALIASESENTRY']._serialized_options = b'8\001'
  _globals['_REMOTEENGINECONFIG_HEADERSTEMPLATEENTRY']._loaded_options = None
  _globals['_REMOTEENGINECONFIG_HEADERSTEMPLATEENTRY']._serialized_options = b'8\001'
  _globals['_CONFLICTSTRATEGY']._serialized_start=5092
  _globals['_CONFLICTSTRATEGY']._serialized_end=5174
  _globals['_COMPRESSION']._serialized_start=5176
  _globals['_COMPRESSION']._serialized_end=5267
  _globals['_MERGEPOLICY']._serialized_start=62
  _globals['_MERGEPOLICY']._serialized_end=189
  _globals['_ATTACHFILEENGINEREQUEST']._serialized_start=191
  _globals['_ATTACHFILEENGINEREQUEST']._serialized_end=216
  _globals['_ATTACHREMOTEENGINEREQUEST']._serialized_start=218
  _globals['_ATTACHREMOTEENGINEREQUEST']._serialized_end=294
  _globals['_ATTACHINDEXREQUEST']._serialized_start=297
  _globals['_ATTACHINDEXREQUEST']._serialized_end=574
  _globals['_ATTACHINDEXRESPONSE']._serialized_start=576
  _globals['_ATTACHINDEXRESPONSE']._serialized_end=643
  _globals['_COMMITINDEXREQUEST']._serialized_start=645
  _globals['_COMMITINDEXREQUEST']._serialized_end=708
  _globals['_COMMITINDEXRESPONSE']._serialized_start=710
  _globals['_COMMITINDEXRESPONSE']._serialized_end=753
  _globals['_COPYDOCUMENTSREQUEST']._serialized_start=756
  _globals['_COPYDOCUMENTSREQUEST']._serialized_end=917
  _globals['_COPYDOCUMENTSRESPONSE']._serialized_start=919
  _globals['_COPYDOCUMENTSRESPONSE']._serialized_end=990
  _globals['_COPYINDEXREQUEST']._serialized_start=993
  _globals['_COPYINDEXREQUEST']._serialized_end=1248
  _globals['_COPYINDEXRESPONSE']._serialized_start=1250
  _globals['_COPYINDEXRESPONSE']._serialized_end=1315
  _globals['_SORTBYFIELD']._serialized_start=1317
  _globals['_SORTBYFIELD']._serialized_end=1380
  _globals['_CREATEFILEENGINEREQUEST']._serialized_start=1382
  _globals['_CREATEFILEENGINEREQUEST']._serialized_end=1407
  _globals['_CREATEMEMORYENGINEREQUEST']._serialized_start=1409
  _globals['_CREATEMEMORYENGINEREQUEST']._serialized_end=1436
  _globals['_MAPPEDFIELD']._serialized_start=1438
  _globals['_MAPPEDFIELD']._serialized_end=1495
  _globals['_INDEXATTRIBUTES']._serialized_start=1498
  _globals['_INDEXATTRIBUTES']._serialized_end=1775
  _globals['_CREATEINDEXREQUEST']._serialized_start=1778
  _globals['_CREATEINDEXREQUEST']._serialized_end=2212
  _globals['_CREATEINDEXRESPONSE']._serialized_start=2214
  _globals['_CREATEINDEXRESPONSE']._serialized_end=2281
  _globals['_DELETEDOCUMENTSREQUEST']._serialized_start=2283
  _globals['_DELETEDOCUMENTSREQUEST']._serialized_end=2362
  _globals['_DELETEDOCUMENTSRESPONSE']._serialized_start=2364
  _globals['_DELETEDOCUMENTSRESPONSE']._serialized_end=2416
  _globals['_DELETEINDEXREQUEST']._serialized_start=2418
  _globals['_DELETEINDEXREQUEST']._serialized_end=2458
  _globals['_DELETEINDEXRESPONSE']._serialized_start=2460
  _globals['_DELETEINDEXRESPONSE']._serialized_end=2509
  _globals['_GETINDICESALIASESREQUEST']._serialized_start=2511
  _globals['_GETINDICESALIASESREQUEST']._serialized_end=2537
  _globals['_GETINDICESALIASESRESPONSE']._serialized_start=2540
  _globals['_GETINDICESALIASESRESPONSE']._serialized_end=2707
  _globals['_GETINDICESALIASESRESPONSE_INDICESALIASESENTRY']._serialized_start=2654
  _globals['_GETINDICESALIASESRESPONSE_INDICESALIASESENTRY']._serialized_end=2707
  _globals['_GETINDEXREQUEST']._serialized_start=2709
  _globals['_GETINDEXREQUEST']._serialized_end=2746
  _globals['_GETINDEXRESPONSE']._serialized_start=2748
  _globals['_GETINDEXRESPONSE']._serialized_end=2812
  _globals['_GETINDICESREQUEST']._serialized_start=2814
  _globals['_GETINDICESREQUEST']._serialized_end=2833
  _globals['_GETINDICESRESPONSE']._serialized_start=2835
  _globals['_GETINDICESRESPONSE']._serialized_end=2876
  _globals['_INDEXDOCUMENTSTREAMREQUEST']._serialized_start=2879
  _globals['_INDEXDOCUMENTSTREAMREQUEST']._serialized_end=3069
  _globals['_INDEXDOCUMENTSTREAMRESPONSE']._serialized_start=3071
  _globals['_INDEXDOCUMENTSTREAMRESPONSE']._serialized_end=3165
  _globals['_INDEXDOCUMENTREQUEST']._serialized_start=3167
  _globals['_INDEXDOCUMENTREQUEST']._serialized_end=3265
  _globals['_INDEXDOCUMENTRESPONSE']._serialized_start=3267
  _globals['_INDEXDOCUMENTRESPONSE']._serialized_end=3290
  _globals['_MERGESEGMENTSREQUEST']._serialized_start=3292
  _globals['_MERGESEGMENTSREQUEST']._serialized_end=3355
  _globals['_MERGESEGMENTSRESPONSE']._serialized_start=3357
  _globals['_MERGESEGMENTSRESPONSE']._serialized_end=3420
  _globals['_SETINDEXALIASREQUEST']._serialized_start=3422
  _globals['_SETINDEXALIASREQUEST']._serialized_end=3485
  _globals['_SETINDEXALIASRESPONSE']._serialized_start=3487
  _globals['_SETINDEXALIASRESPONSE']._serialized_end=3558
  _globals['_DOCUMENTSREQUEST']._serialized_start=3560
  _globals['_DOCUMENTSREQUEST']._serialized_end=3678
  _globals['_DOCUMENTSRESPONSE']._serialized_start=3680
  _globals['_DOCUMENTSRESPONSE']._serialized_end=3717
  _globals['_VACUUMINDEXREQUEST']._serialized_start=3719
  _globals['_VACUUMINDEXREQUEST']._serialized_end=3786
  _globals['_VACUUMINDEXRESPONSE']._serialized_start=3788
  _globals['_VACUUMINDEXRESPONSE']._serialized_end=3836
  _globals['_WARMUPINDEXREQUEST']._serialized_start=3838
  _globals['_WARMUPINDEXREQUEST']._serialized_end=3895
  _globals['_WARMUPINDEXRESPONSE']._serialized_start=3897
  _globals['_WARMUPINDEXRESPONSE']._serialized_end=3940
  _globals['_FILEENGINECONFIG']._serialized_start=3942
  _globals['_FILEENGINECONFIG']._serialized_end=3974
  _globals['_MEMORYENGINECONFIG']._serialized_start=3976
  _globals['_MEMORYENGINECONFIG']._serialized_end=4012
  _globals['_CACHECONFIG']._serialized_start=4014
  _globals['_CACHECONFIG']._serialized_end=4047
  _globals['_REMOTEENGINECONFIG']._serialized_start=4050
  _globals['_REMOTEENGINECONFIG']._serialized_end=4332
  _globals['_REMOTEENGINECONFIG_HEADERSTEMPLATEENTRY']._serialized_start=4263
  _globals['_REMOTEENGINECONFIG_HEADERSTEMPLATEENTRY']._serialized_end=4317
  _globals['_LOGMERGEPOLICY']._serialized_start=4334
  _globals['_LOGMERGEPOLICY']._serialized_end=4369
  _globals['_TEMPORALMERGEPOLICY']._serialized_start=4371
  _globals['_TEMPORALMERGEPOLICY']._serialized_end=4423
  _globals['_INDEXENGINECONFIG']._serialized_start=4426
  _globals['_INDEXENGINECONFIG']._serialized_end=4713
  _globals['_INDEXDESCRIPTION']._serialized_start=4716
  _globals['_INDEXDESCRIPTION']._serialized_end=4952
  _globals['_INDEXDOCUMENTOPERATION']._serialized_start=4954
  _globals['_INDEXDOCUMENTOPERATION']._serialized_end=4996
  _globals['_INDEXOPERATION']._serialized_start=4998
  _globals['_INDEXOPERATION']._serialized_end=5090
  _globals['_INDEXAPI']._serialized_start=5270
  _globals['_INDEXAPI']._serialized_end=6785
# @@protoc_insertion_point(module_scope)
