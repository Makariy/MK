from ..models import Post  # type
from typing import Dict, Union, List
from authorization.json_services.json_services import render_user
from utils.url_maker import get_url_for_post_image


def render_post(post: Post, is_liked=False) -> Dict[str, Dict[str, Union[str, Dict[str, str]]]]:
    return {
        "post": {
            "author": render_user(post.author)['user'],
            "title": post.title,
            "text": post.text,
            "image_url": get_url_for_post_image(post),
            "likes": post.likes.all().count(),
            "date": str(post.date),
            "uuid": str(post.uuid),
            "is_liked": is_liked
        }
    }


def render_posts(posts: List[Post]) -> Dict[str, List[Dict[str, Dict[str, Union[str, Dict[str, str]]]]]]:
    return {
        "posts": [render_post(post) for post in posts]
    }


def render_liked_posts(posts: List[Post]) -> Dict[str, List[str]]:
    return {
        'posts_uuids': [post.uuid for post in posts]
    }


def render_posts_and_likes(posts: List[Post], liked_posts: List[Post]) \
        -> Dict[str, List[Dict[str, Dict[str, Union[str, Dict[str, str]]]]]]:
    return {
        "posts": [
            render_post(post, True if post in liked_posts else False)
            for post in posts
        ]
    }
