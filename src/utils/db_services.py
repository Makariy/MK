from authorization.models import User
from django.core.exceptions import ObjectDoesNotExist


def get_user_by_param(**params):
    try:
        return User.objects.get(**params)
    except ObjectDoesNotExist:
        return None
