from django.db.models.signals import pre_save, pre_delete
from django.core.exceptions import ValidationError

from .models import Post
from .extern_services.uploader import delete_file


def on_post_pre_save(sender, instance: Post, **kwargs):
    if not instance.image_path and not instance.title and not instance.text:
        raise ValidationError("There is no data in the post")


def on_post_pre_delete(sender, instance: Post, **kwargs):
    if instance.image_path:
        delete_file(instance.image_path)
    instance.likes.all().delete()


pre_save.connect(on_post_pre_save, sender=Post)
pre_delete.connect(on_post_pre_delete, sender=Post)
