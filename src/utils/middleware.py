import logging

from uuid import uuid4
import json
from threading import local

_locals = local()


class RequestUUIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.META["X-Request-UUID"] = str(uuid4())
        _locals.request_uuid = request.META["X-Request-UUID"]
        response = self.get_response(request)
        return response


class RequestParamsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _locals.POST = dict(request.POST)
        _locals.GET = dict(request.GET)
        _locals.METHOD = request.method
        response = self.get_response(request)
        return response


class RequestUUIDFilter(logging.Filter):
    def filter(self, record):
        if not hasattr(record, 'request_uuid'):
            record.request_uuid = ""
        if hasattr(_locals, 'request_uuid'):
            record.request_uuid = _locals.request_uuid
        return True


class RequestParamsFilter(logging.Filter):
    def filter(self, record):
        if hasattr(record, "msg") and 'django' not in record.name:

            record.json_record = {
                "message": record.msg,
                "POST": _locals.POST if hasattr(_locals, "POST") else "",
                "GET": _locals.GET if hasattr(_locals, "GET") else "",
                "METHOD": _locals.METHOD if hasattr(_locals, "METHOD") else ""
            }
        return True

