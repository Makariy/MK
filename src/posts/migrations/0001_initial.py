# Generated by Django 4.0.3 on 2022-05-16 18:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='author')),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('uuid', models.UUIDField(auto_created=True, default=uuid.uuid4, verbose_name='UUID')),
                ('image_path', models.FilePathField(blank=True, null=True, verbose_name='image_path')),
                ('title', models.CharField(blank=True, default='', max_length=63, verbose_name='title')),
                ('text', models.TextField(blank=True, default='', max_length=4000, verbose_name='text')),
                ('date', models.DateTimeField(auto_now_add=True, verbose_name='date')),
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='author')),
                ('likes', models.ManyToManyField(to='posts.like', verbose_name='Likes')),
            ],
        ),
    ]
