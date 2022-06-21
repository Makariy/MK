from django.http import JsonResponse
from django.contrib.auth import get_user


def login_required(func):
    """
        Wraps a view function to guarantee that the request user is authenticated.
        If the user is authenticated, saves the user to request.user attribute and
        calls the view.
        If the user is not authenticated, return JsonResponse with status 'error'.
    """
    def wrapper(request, *args, **kwargs):
        user = get_user(request)
        if user and user.is_authenticated:
            request.user = user
            return func(request, *args, **kwargs)

        return JsonResponse({
            'status': 'error',
            'msg': "Authentication required"
        })
    return wrapper

