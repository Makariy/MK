# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from django.contrib.auth import get_user
from utils.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

from django.http.response import JsonResponse
from utils.converter import convert_str_to_uuid
from utils.db_services import get_user_by_param

from .db_services.db_services import *
from .json_services.json_services import *


logger = logging.getLogger(__name__)


def get_post_view(request):
    post_uuid = request.GET.get('post_uuid')
    if not post_uuid:
        return JsonResponse({
            "status": "fail",
            'error': "post_uuid param is not specified"
        })
    
    post_uuid = convert_str_to_uuid(post_uuid)
    if not post_uuid:
        return JsonResponse({
            "status": "fail",
            'error': "post_uuid is not a valid UUID"
        })
    
    post = get_post_by_params(uuid=post_uuid)
    if not post:
        return JsonResponse({
            'status': 'fail',
            'error': "post with this post_uuid is not found"
        })

    return JsonResponse({
        **render_post(post),
        'status': 'success'
    })
    

def get_posts_by_author_view(request):
    author_uuid = request.GET.get('author_uuid')
    if not author_uuid:
        return JsonResponse({
            "status": "fail",
            'error': "author_uuid is not specified"
        })
    
    author_uuid = convert_str_to_uuid(author_uuid)
    if not author_uuid:
        return JsonResponse({
            "status": "fail",
            'error': "author_uuid is not a valid UUID"
        })

    author = get_user_by_param(uuid=author_uuid)

    if not author:
        return JsonResponse({
            "status": "fail",
            'error': 'author with this author_uuid is not found'
        })
    
    search_by = request.GET.get('search_by')
    search_query = request.GET.get('query')
    if search_by not in ['title', 'text'] or not search_query:
        search_by = 'title'
        search_query = ''

    user = get_user(request)
    if user and user.is_authenticated:
        posts, liked_posts = get_posts_by_author_with_likes(
            author=author,
            user=user,
            search_by=search_by,
            query=search_query
        )
        return JsonResponse({
            **render_posts_and_likes(posts, liked_posts),
            'status': 'success'
        })
    else:
        posts = get_posts_by_author(
            author=author,
            search_by=search_by,
            query=search_query
        )
        return JsonResponse({
            **render_posts(posts),
            'status': 'success'
        })


# Debug only
@csrf_exempt
@login_required
def add_like_to_post_view(request):
    post_uuid = request.POST.get('post_uuid')
    if not post_uuid:
        logger.warning({
            "error": "There is no post_uuid specified in the request"
        })
        return JsonResponse({
            "status": "fail",
            'error': 'post_uuid is not specified'
        })
        
    post_uuid = convert_str_to_uuid(post_uuid)
    if not post_uuid:
        logger.warning({
            "error": "post_uuid specified in the request is not valid"
        })
        return JsonResponse({
            "status": "fail",
            'error': 'post_uuid is not valid'
        })
    post = get_post_by_params(uuid=post_uuid)
    if not post:
        logger.warning({
            "error": "There is no such post with this uuid"
        })
        return JsonResponse({
            "status": "fail",
            'error': "post with this post_uuid is not found"
        })
    user = get_user(request)
    if not user or not user.is_authenticated:
        logger.warning({
            "error": "User is not authenticated"
        })
        return JsonResponse({
            'status': 'fail',
            'error': "User is not authenticated"
        })

    result = add_like_to_post(post, user)
    return JsonResponse({
        'status': 'success',
        'likes_count': get_post_likes_count(post),
        'action': 'LIKE_ADDED' if result else 'NOTHING'
    })


@csrf_exempt
@login_required
def remove_like_on_post_view(request):
    post_uuid = request.POST.get('post_uuid')
    if not post_uuid:
        return JsonResponse({
            'status': 'fail',
            'error': "There is no post_uuid specified in the request"
        })
    post_uuid = convert_str_to_uuid(post_uuid)
    if not post_uuid:
        return JsonResponse({
            'status': 'fail',
            'error': "post_uuid param is not a valid UUID"
        })
    post = get_post_by_params(uuid=post_uuid)
    if not post:
        return JsonResponse({
            'status': "fail",
            'error': 'There is no such post with this post_uuid'
        })
    user = get_user(request)
    if not user and not user.is_authenticated:
        return JsonResponse({
            'status': 'fail',
            'error': "User is not authenticated"
        })
    result = remove_like_on_post(post, user)
    return JsonResponse({
        'status': 'success',
        'likes_count': get_post_likes_count(post),
        'action': 'LIKE_REMOVED' if result else 'NOTHING'
    })


@csrf_exempt
@login_required
def create_new_post_view(request):
    user = get_user(request)
    if not user or not user.is_authenticated:
        logger.warning({
            'error': 'User is not authenticated'
        })
        return JsonResponse({
            'status': 'fail',
            'error': 'User is not authenticated'
        })
    # Add user group authentication
    title = request.POST.get('title')
    text = request.POST.get('text')
    file = request.FILES.get('file')
    if not (title or text or file):
        logger.warning({
            'error': "In the POST payload there was no title, text or file for the post creation"
        })
        return JsonResponse({
            'status': 'fail',
            'error': "There is no title, text or file for this post specified"
        })

    post, error, = create_post(user, title, text, file)
    if error is not None:
        logger.warning({
            "error": f"During post creations occurred an error: {error}"
        })
        return JsonResponse({
            'status': 'fail',
            'error': error
        })

    return JsonResponse({
        **render_post(post),
        'status': 'success',
    })


@csrf_exempt
@login_required
def redact_post_view(request):
    post_uuid = request.POST.get('post_uuid')
    if not post_uuid:
        return JsonResponse({
            'status': "fail",
            'error': "There is no post_uuid specified in the request"
        })

    post_uuid = convert_str_to_uuid(post_uuid)
    if not post_uuid:
        return JsonResponse({
            'status': 'fail',
            'error': "post_uuid is not a valid UUID"
        })
    post = get_post_by_params(uuid=post_uuid)
    if not post:
        return JsonResponse({
            'status': 'fail',
            'error': "There is no such post with this post_uuid"
        })
    user = get_user(request)
    if not user or not user.is_authenticated:
        return JsonResponse({
            'status': 'fail',
            'error': "User is not authenticated"
        })

    if not post.author == user:
        return JsonResponse({
            'status': 'fail',
            'error': "The user has no permission on this post"
        })

    title = request.POST.get('title')
    text = request.POST.get('text')
    had_changed_file = request.POST.get('had_changed_file')
    file = request.FILES.get('file')
    post, error = redact_post(
        post=post,
        title=title,
        text=text,
        file=file,
        had_changed_file=True if had_changed_file == 'true' else False
    )
    return JsonResponse({
        **render_post(post, is_liked=True if get_like_by_author(post, user) else False),
        'status': 'success'
    })


@csrf_exempt
@login_required
def delete_post_view(request):
    post_uuid = request.POST.get('post_uuid')
    if not post_uuid:
        logger.warning({
            "error": "post_uuid is not specified"
        })
        return JsonResponse({
            'status': 'fail',
        })
    post_uuid = convert_str_to_uuid(post_uuid)
    if not post_uuid:
        logger.warning({
            "error": "post_uuid is not valid"
        })
        return JsonResponse({
            'status': 'fail',
            'error': 'post_uuid is not a valid UUID'
        })
    post = get_post_by_params(uuid=post_uuid)
    if not post:
        logger.warning({
            "error": "Post with specified post_uuid does not exist"
        })
        return JsonResponse({
            'status': 'fail',
            'error': "Post with this post_uuid does not exist"
        })
    user = get_user(request)
    if not user or not user.is_authenticated:
        logger.warning({
            "error": "User is not authenticated"
        })
        return JsonResponse({
            'status': 'fail',
            'error': "User is not authenticated"
        })

    if not post.author == user:
        logger.warning({
            "user_uuid": str(user.uuid),
            "error": "Post author is not the user who made the request"
        })
        return JsonResponse({
            'status': 'fail',
            'error': "User has no permission on this post"
        })

    delete_post(post)
    return JsonResponse({
        'status': 'success'
    })

