from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

from uuid import uuid4


# Create your models here.

class User(AbstractUser):
    profile_image = models.FilePathField(null=True, blank=True, verbose_name='profile_image')
    bio = models.TextField(null=False, blank=True, default="", verbose_name='bio')
    uuid = models.UUIDField(default=uuid4, verbose_name='UUID')

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def full_clean(self, *args, **kwargs):
        if len(self.username) < 5:
            raise ValidationError("Username is too short")
        if self.email:
            users = User.objects.filter(email=self.email)
            if len(users) != 0:
                if users[0].pk != self.pk:
                    raise ValidationError("This email is already in use")
        return super().full_clean(*args, **kwargs)
