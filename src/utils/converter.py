from uuid import UUID
from typing import Union

from posts.models import Post
from django.conf import settings


def convert_str_to_uuid(s: str) -> Union[UUID, None]:
    """Returns uuid if string can be converted to UUID or returns None if not"""
    try:
        return UUID(s)
    except ValueError:
        return None

