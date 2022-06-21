from django.urls import path, re_path, include
from django.conf import settings

from django.contrib import admin


urlpatterns = [
    path('auth/', include('authorization.urls')),
    path('user/', include('user.urls')),
    path('posts/', include('posts.urls')),
    re_path(r'^admin/', admin.site.urls),
]

if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
