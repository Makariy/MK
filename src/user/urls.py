from django.urls import path

from .views import author_search_view
from .views import author_information_view


urlpatterns = [
    path('get/authors/', author_search_view),
    path('get/author/', author_information_view)
]
