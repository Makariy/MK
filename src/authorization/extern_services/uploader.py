from typing import IO
from django.conf import settings
import os


def save_file(reader: IO, name: str) -> bool:
    with open(os.path.join(settings.USER_IMAGES_PATH, name), 'wb') as file:
        file.write(reader.read())
        return True


def delete_file(name: str):
    os.remove(os.path.join(settings.USER_IMAGES_PATH, name))
