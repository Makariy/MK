from django.contrib.auth.models import Group

author_group = Group.objects.create(name='author')

