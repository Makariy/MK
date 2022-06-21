from authorization.models import User
from ..models import Post, Like
from django.contrib.postgres.search import TrigramSimilarity

from ..extern_services.uploader import *

from typing import Union, Tuple, Any
from uuid import uuid4

from django.core.exceptions import ObjectDoesNotExist
from django.core.exceptions import ValidationError

from django.db.models.query import QuerySet
from django.core.files.uploadhandler import InMemoryUploadedFile


"""
-----------------------------------
            POSTS SECTION
-----------------------------------
"""


def get_post_by_params(**params):
    try:
        return Post.objects.get(**params)
    except ObjectDoesNotExist:
        return None


def get_liked_posts(posts: QuerySet, user: User):
    return posts.filter(likes__author=user)


def _get_posts_by_author(
        author: User,
        search_by: str = "title",
        query: str = "",
        post_to_start_from: Union[Post, None] = None,
):
    posts = Post.objects.filter(author__uuid=author.uuid).order_by('-date')

    if query != "":
        posts = posts.annotate(similarity=TrigramSimilarity(search_by, query)).order_by('-similarity')

    if post_to_start_from is not None:
        posts = posts.filter(date__lt=post_to_start_from.date)

    return posts.select_related('author')


def get_posts_by_author(
        author: User,
        search_by: str = "title",
        query: str = "",
        post_to_start_from: Union[Post, None] = None,
        count: int = 10
):
    return _get_posts_by_author(
        author=author,
        search_by=search_by,
        query=query,
        post_to_start_from=post_to_start_from,
    )[:count]


def get_posts_by_author_with_likes(
        author: User,
        user: User,
        count: int = 10,
        *args,
        **kwargs
):
    posts = _get_posts_by_author(author, *args, **kwargs)
    liked_posts = get_liked_posts(posts, user)
    return posts[:count], liked_posts[:count]


def create_post(author: User, title: str, text: str, file: Union[InMemoryUploadedFile, None] = None) \
        -> Tuple[Union[Post, None], Union[Any, None]]:
    post = Post(author=author, title=title, text=text)
    try:
        post.clean_fields()
        post.uuid = uuid4()
        if file:
            post.image_path = str(uuid4())
            save_file(file.file, post.image_path)
        else:
            post.image_url = None
        post.save()
        return post, None
    except ValidationError as error:
        return None, error.message


def redact_post(post: Post,
                title: str,
                text: str,
                file: Union[InMemoryUploadedFile, None] = None,
                had_changed_file: bool = False) \
        -> Tuple[Union[Post, None], Union[Any, None]]:
    post.title = title
    post.text = text
    try:
        post.clean_fields()
        if had_changed_file:
            if post.image_path:
                delete_file(post.image_path)
                post.image_path = None
            if file:
                post.image_path = str(uuid4())
                save_file(file.file, post.image_path)
        post.save()
        return post, None
    except ValidationError as error:
        return None, error.message_dict


def delete_post(post: Post):
    post.delete()


"""
---------------------------------------
            LIKES SECTION
---------------------------------------    
"""


def get_like_by_author(post: Post, author: User) -> Union[None, Like]:
    try:
        return post.likes.get(author=author)
    except ObjectDoesNotExist:
        return None


def get_post_likes_count(post: Post):
    return post.likes.all().count()


def add_like_to_post(post: Post, user: User) -> bool:
    like = get_like_by_author(post, user)
    if not like:
        like = Like.objects.create(author=user)
        post.likes.add(like)
        return True
    return False


def remove_like_on_post(post: Post, user: User) -> bool:
    like = get_like_by_author(post, user)
    if like:
        like.delete()
        return True
    return False

