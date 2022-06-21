from django.http import JsonResponse

from utils.converter import convert_str_to_uuid
from authorization.db_services.db_services import *
from .db_services.db_services import *
from authorization.json_services.json_services import *


def author_search_view(request):
    author_name = request.GET.get('name')
    if author_name is None:
        author_name = ""

    users = get_users_by_params(username=author_name)
    return JsonResponse({
        **render_users(users),
        'status': 'success'
    })


def author_information_view(request):
    author_uuid = request.GET.get('author_uuid')
    if author_uuid is None:
        return JsonResponse({
            'error': "author_uuid is not specified",
            'status': 'fail'
        })

    author_uuid = convert_str_to_uuid(author_uuid)
    if author_uuid is None:
        return JsonResponse({
            'error': "author_uuid is not a valid UUID",
            'status': 'fail'
        })

    author = get_user_by_params(uuid=author_uuid)
    if not author:
        return JsonResponse({
            'error': "Author with specified author_uuid",
            'status': 'fail'
        })

    return JsonResponse({
        'status': 'success',
        **render_user(author)
    })
