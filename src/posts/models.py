# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from authorization.models import User
from uuid import uuid4


class Like(models.Model):
    author = models.ForeignKey(to=User, on_delete=models.CASCADE, verbose_name='author')
    id = models.AutoField(primary_key=True, verbose_name='ID')


class Post(models.Model):
    author = models.ForeignKey(to=User, on_delete=models.CASCADE, null=False, blank=False, verbose_name='author')
    image_path = models.FilePathField(null=True, blank=True, verbose_name='image_path')
    title = models.CharField(max_length=63, blank=True, null=False, default="", verbose_name='title')
    text = models.TextField(max_length=4000, blank=True, null=False, default="", verbose_name='text')

    date = models.DateTimeField(auto_now_add=True, null=False, verbose_name='date')
    likes = models.ManyToManyField(to=Like, verbose_name='Likes')
    uuid = models.UUIDField(auto_created=True, default=uuid4, verbose_name='UUID')
    id = models.AutoField(primary_key=True, verbose_name='ID')


