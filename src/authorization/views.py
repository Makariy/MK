from django.http.response import JsonResponse

from django.contrib.auth import authenticate, login, logout, get_user
from django.views.decorators.csrf import csrf_exempt

from .db_services.db_services import create_user
from .json_services.json_services import render_user


# Debug only
@csrf_exempt
def login_view(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    user = authenticate(username=username, password=password)
    if not user:
        return JsonResponse({
            'status': 'fail',
            'error': 'Invalid credentials'
        })

    login(request, user)
    return JsonResponse({
        **render_user(user),
        'status': 'success'
    })


@csrf_exempt
def registration_view(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    email = request.POST.get('email')
    if not username or not password or not email:
        return JsonResponse({
            'status': 'fail',
            'error': 'There is no username, password or email specified'
        })

    user, error = create_user(username, password, email)
    if error:
        return JsonResponse({
            'error': error,
            'status': 'fail'
        })

    login(request, user)
    return JsonResponse({
        **render_user(user),
        'status': 'success'
    })


@csrf_exempt
def logout_view(request):
    user = get_user(request)
    if not user or not user.is_authenticated:
        return JsonResponse({
            'status': 'fail',
            'error': "User is not authenticated"
        })
    logout(request)
    return JsonResponse({
        'status': 'success'
    })

