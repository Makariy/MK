from django.test import TestCase
from django.urls import reverse_lazy

from authorization.models import User

from posts.views import create_new_post_view
from posts.json_services.json_services import *


class ViewTests(TestCase):
    def setUp(self):
        self.author = User.objects.create(username="TestAuthor", password="TestAuthorPassword")
        self.post = Post.objects.create(
            author=self.author,
            title="Test post title",
            text="Test post text",
        )
        self.user = User.objects.create(username="TestUser", password="TestUserPassword")

    def test_create_new_post_view(self):
        self.client.force_login(self.author)
        response = self.client.post(reverse_lazy(create_new_post_view),
                                    data={
                                        'title': "New test post title",
                                        'text': "New test post description"
                                    })
        data = response.json()
        self.assertEquals(response.status_code, 200)
        self.assertEquals(data['status'], 'success',
                          msg=f"create_new_post_view returned status 'fail', when the form was valid.\n"
                              f"The reason is: {data.get('error')}")
        self.assertEquals(data['post'], render_post(Post.objects.last())['post'])
