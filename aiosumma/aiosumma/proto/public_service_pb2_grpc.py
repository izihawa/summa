# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc
import warnings

from . import query_pb2 as query__pb2

GRPC_GENERATED_VERSION = '1.71.0'
GRPC_VERSION = grpc.__version__
_version_not_supported = False

try:
    from grpc._utilities import first_version_is_lower
    _version_not_supported = first_version_is_lower(GRPC_VERSION, GRPC_GENERATED_VERSION)
except ImportError:
    _version_not_supported = True

if _version_not_supported:
    raise RuntimeError(
        f'The grpc package installed is at version {GRPC_VERSION},'
        + f' but the generated code in public_service_pb2_grpc.py depends on'
        + f' grpcio>={GRPC_GENERATED_VERSION}.'
        + f' Please upgrade your grpc module to grpcio>={GRPC_GENERATED_VERSION}'
        + f' or downgrade your generated code using grpcio-tools<={GRPC_VERSION}.'
    )


class PublicApiStub(object):
    """Searches documents in the stored indices
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.search = channel.unary_unary(
                '/summa.proto.PublicApi/search',
                request_serializer=query__pb2.SearchRequest.SerializeToString,
                response_deserializer=query__pb2.SearchResponse.FromString,
                _registered_method=True)


class PublicApiServicer(object):
    """Searches documents in the stored indices
    """

    def search(self, request, context):
        """Make search in Summa
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_PublicApiServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'search': grpc.unary_unary_rpc_method_handler(
                    servicer.search,
                    request_deserializer=query__pb2.SearchRequest.FromString,
                    response_serializer=query__pb2.SearchResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'summa.proto.PublicApi', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))
    server.add_registered_method_handlers('summa.proto.PublicApi', rpc_method_handlers)


 # This class is part of an EXPERIMENTAL API.
class PublicApi(object):
    """Searches documents in the stored indices
    """

    @staticmethod
    def search(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/summa.proto.PublicApi/search',
            query__pb2.SearchRequest.SerializeToString,
            query__pb2.SearchResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)
