from authorization.models import User
from typing import Dict, List, Iterable
from utils.url_maker import get_url_for_user_image


def render_user(user: User) -> Dict[str, Dict[str, str]]:
    return {
        'user': {
            'username': user.username,
            'bio': user.bio,
            'profile_image': get_url_for_user_image(user),
            'uuid': str(user.uuid),
        }
    }


def render_users(users: Iterable[User]) -> Dict[str, List[Dict[str, Dict[str, str]]]]:
    return {
        'users': [render_user(user) for user in users]
    }

