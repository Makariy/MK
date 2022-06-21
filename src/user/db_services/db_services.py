from authorization.models import User
from django.contrib.postgres.search import TrigramSimilarity


def get_users_by_params(username):
    users = User.objects.all()
    if username:
        users = users.annotate(similarity=TrigramSimilarity("username", username))\
            .order_by('-similarity')

    return users[:10]
