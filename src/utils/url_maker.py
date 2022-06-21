from django.conf import settings

from authorization.models import User
from posts.models import Post


def get_url_for_post_image(post: Post):
    return (settings.MEDIA_URL + 'posts/' + post.image_path) if post.image_path else None


def get_url_for_user_image(user: User):
    return (settings.MEDIA_URL + 'users/' + user.profile_image) if user.profile_image else None
