from django.urls import path

from .views import get_post_view
from .views import get_posts_by_author_view

from .views import create_new_post_view
from .views import delete_post_view
from .views import redact_post_view

from .views import add_like_to_post_view
from .views import remove_like_on_post_view


urlpatterns = [
    path('get/post/', get_post_view),
    path('get/posts/', get_posts_by_author_view),

    path('create/post/', create_new_post_view),
    path('delete/post/', delete_post_view),
    path('redact/post/', redact_post_view),

    path('add_like/', add_like_to_post_view),
    path('remove_like/', remove_like_on_post_view),
]
