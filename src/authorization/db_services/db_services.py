from authorization.models import User

from typing import Union, Tuple

from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.db.utils import IntegrityError


def create_user(username: str, password: str, email: str) -> Tuple[Union[User, None], Union[str, None]]:
    try:
        # Had to do this not in the model layer cause in model layer it is already hashed
        if len(password) < 7:
            raise ValidationError("Password is too short")

        return User.objects.create_user(username=username, password=password, email=email), None

    except IntegrityError:
        return None, "User with this username already exists"
    except ValidationError as e:
        return None, e.message


def get_user_by_params(**params):
    try:
        return User.objects.get(**params)
    except ObjectDoesNotExist:
        return None

