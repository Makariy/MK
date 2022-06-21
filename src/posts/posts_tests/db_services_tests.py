from django.test import TestCase
from uuid import uuid4

from authorization.models import User
from ..models import Post, Like

from ..db_services.db_services import get_post_by_params
from ..db_services.db_services import get_posts_by_author

from ..db_services.db_services import get_like_by_author
from ..db_services.db_services import add_like_to_post
from ..db_services.db_services import remove_like_on_post
from ..db_services.db_services import get_post_likes_count
from ..db_services.db_services import get_liked_posts
from ..db_services.db_services import get_posts_by_author_with_likes
from ..db_services.db_services import create_post
from ..db_services.db_services import delete_post


class DBLikesTests(TestCase):
    def setUp(self):
        self.author = User.objects.create_user(username='TestAuthor', password='TestAuthorPassword')
        self.user = User.objects.create_user(username='TestUser', password='TestUserPassword')
        self.post = Post.objects.create(
            author=self.author,
            title='Test post title',
            text='Test post text',
        )

    def test_user_can_add_like(self):
        result = add_like_to_post(self.post, self.user)
        self.assertEquals(result, True, msg=f"Function posts.db_services.db_services.add_like_to_post"
                                            f"had returned False, when nothing was wrong")
        likes_count = self.post.likes.all().count()
        self.assertEquals(likes_count, 1, msg=f"Function posts.db_services.db_services.add_like_to_post"
                                              f"had not added like to post, the likes count is {likes_count}")
        self.assertEquals(Like.objects.all().count(), 1, msg=f"Function posts.db_services.db_services.add_like_to_post"
                                                             f"created {Like.objects.all().count()} likes, when it had"
                                                             f"to create only 1")

    def test_user_cannot_add_two_likes(self):
        add_like_to_post(self.post, self.user)
        result = add_like_to_post(self.post, self.user)
        self.assertEquals(result, False, msg=f"Function posts.db_services.db_services.add_like_to_post"
                                             f"had not returned False when user tried to add like two times")
        likes_count = self.post.likes.all().count()
        self.assertEquals(likes_count, 1, msg=f"Function posts.db_services.db_services.add_like_to_post"
                                              f"had not added like to post only one time, "
                                              f"the likes count is {likes_count}")
        self.assertEquals(Like.objects.all().count(), 1, msg=f"After calling the second time the function "
                                                             f"posts.db_services.db_services.add_like_to_post, "
                                                             f"it had created {Like.objects.all().count()}"
                                                             f"when it had to create only one like for one user on "
                                                             f"one post")

    def test_user_can_remove_like(self):
        add_like_to_post(self.post, self.user)
        result = remove_like_on_post(self.post, self.user)
        self.assertEquals(result, True, msg=f"Function posts.db_services.db_services.remove_like_on_post"
                                            f"had returned False, when nothing was wrong")
        likes_count = self.post.likes.all().count()
        self.assertEquals(likes_count, 0, msg=f"Function posts.db_services.db_services.remove_like_on_post"
                                              f"had not removed like on post, the likes count is {likes_count}")
        self.assertEquals(Like.objects.all().count(), 0,
                          msg=f"Function posts.db_services.db_services.remove_like_on_post"
                              f"had not deleted the Like that was removed from post.likes"
                              f"the likes count is: {Like.objects.all().count()}")

    def test_user_cannot_remove_like_twice(self):
        add_like_to_post(self.post, self.user)
        remove_like_on_post(self.post, self.user)
        result = remove_like_on_post(self.post, self.user)
        self.assertEquals(result, False, msg=f"Function posts.db_services.db_services.remove_like_on_post"
                                             f"had returned True, when the data was wrong")
        likes_count = self.post.likes.all().count()
        self.assertEquals(likes_count, 0, msg=f"Function posts.db_services.db_services.remove_like_on_post"
                                              f"called twice had to do noting, but the likes count is {likes_count}")
        self.assertEquals(Like.objects.all().count(), 0,
                          msg=f"Function posts.db_services.db_services.remove_like_on_post"
                              f"called twice had to do nothing, but "
                              f"the likes count is: {Like.objects.all().count()}")

    def test_get_like_by_params(self):
        like = Like.objects.create(author=self.user)
        self.post.likes.add(like)
        result = get_like_by_author(self.post, self.user)
        self.assertEquals(result, like, msg=f"Function posts.db_services.db_services.get_like_by_author"
                                            f"had not returned the needed like, it returned: {like}")
        result = get_like_by_author(self.post, self.author)
        self.assertEquals(result, None, msg=f"Function posts.db_services.db_services.get_like_by_author"
                                            f"had not returned None when the params were not satisfying any"
                                            f"existing like")

    def test_get_post_likes_count(self):
        add_like_to_post(self.post, self.user)
        likes_count = get_post_likes_count(self.post)
        self.assertEquals(self.post.likes.all().count(), likes_count,
                          msg=f"Function posts.db_services.db_services.get_post.likes_count "
                              f"returned the wrong likes count, it returned: {likes_count} when it had to return:"
                              f"{self.post.likes.all().count()}")
        add_like_to_post(self.post, self.author)
        likes_count = get_post_likes_count(self.post)
        self.assertEquals(self.post.likes.all().count(), likes_count,
                          msg=f"Function posts.db_services.db_services.get_post.likes_count "
                              f"returned the wrong likes count, it returned: {likes_count} when it had to return:"
                              f"{self.post.likes.all().count()}")


class DBPostsTests(TestCase):
    def setUp(self):
        self.author = User.objects.create_user(username='TestAuthor', password='TestAuthorPassword')
        self.user = User.objects.create_user(username='TestUser', password='TestUserPassword')
        self.like = Like.objects.create(author=self.user)
        self.post = Post.objects.create(
            author=self.author,
            title='Test post title',
            text='Test post text',
        )
        self.post.likes.add(self.like)

    def test_get_post_by_params(self):
        post = get_post_by_params(uuid=self.post.uuid)
        self.assertEquals(post, self.post, msg=f"Function posts.db_services.db_services.get_post_by_params"
                                               f"had not returned the needed post, it returned: {post}")
        post = get_post_by_params(uuid=uuid4())
        self.assertEquals(post, None, msg=f"Function posts.db_services.db_services.get_post_by_params"
                                          f"had not None when the params were not satisfying any existing post")

    def test_get_posts_by_author(self):
        self.posts = [Post.objects.create(
            author=self.author,
            title=f'Test post title {i}',
            text=f'Test post text {i}',
        ) for i in range(10)]
        count = 5
        posts = get_posts_by_author(self.author, count=count)
        self.assertEquals(list(posts), self.posts[::-1][:count],
                          msg=f"\nFunction posts.db_services.db_services.get_posts_by_author"
                              f"had not returned the needed posts in descending order,\n"
                              f"it returned: {posts}, \n"
                              f"when it had to return {self.posts[::-1][:count]}\n")

        index = 5
        posts = get_posts_by_author(self.author, post_to_start_from=self.posts[5], count=count)
        self.assertEquals(list(posts), self.posts[index - 1::-1],
                          msg=f"\nFunction posts.db_services.db_services.get_posts_by_author"
                              f"had not returned the needed posts in descending order,\n"
                              f"it returned: {posts}, \n"
                              f"when it had to return {self.posts[index - 1::-1]}\n")

    def test_get_posts_by_author_with_query(self):
        self.posts = [Post.objects.create(
            author=self.author,
            title=f'Test post title {chr(i + 97)}',
            text=f'Test post text {chr(i + 97)}',
        ) for i in range(10)]
        count = 5
        posts = list(get_posts_by_author(
            author=self.author,
            query="Test post title b",
            search_by="title",
            count=count
        ))
        self.assertEquals(posts[0], self.posts[1])
        posts = list(get_posts_by_author(
            author=self.author,
            query="Test post text b",
            search_by="text",
            count=count
        ))
        self.assertEquals(posts[0], self.posts[1], msg=f"Function posts.db_services.db_services.get_posts_by_author"
                                                       f"")

    def test_get_liked_posts(self):
        author = User.objects.create_user(
            username="TestAuthorForGet",
            password="TestAuthorForGetPassword"
        )
        self.posts = [Post.objects.create(
            author=author,
            title=f'Test post title {i}',
            text=f'Test post text {i}',
        ) for i in range(10)]
        count = 5
        for i in range(5):
            add_like_to_post(self.posts[i], author)
        liked_posts = get_liked_posts(Post.objects.all(), author)
        self.assertEquals(self.posts[:count], list(liked_posts))

    def test_get_posts_by_author_with_likes(self):
        author = User.objects.create_user(
            username="TestAuthorForGet",
            password="TestAuthorForGetPassword"
        )
        self.posts = [Post.objects.create(
            author=author,
            title=f'Test post title {i}',
            text=f'Test post text {i}',
        ) for i in range(10)]
        for i in range(10):
            add_like_to_post(self.posts[i], author)

        posts, liked_posts = get_posts_by_author_with_likes(author, author)
        self.assertEquals(list(posts), list(get_posts_by_author(author)))
        self.assertEquals(list(liked_posts),
                          list(get_liked_posts(Post.objects.filter(author=author), author))[::-1])

    def test_create_post(self):
        title = "Test post for create post"
        post, error = create_post(self.author, title, "Test post description")
        self.assertEquals(error, None)
        self.assertEquals(post, get_post_by_params(title=title))

    def test_create_post_with_bad_data(self):
        post, error = create_post(self.author, "", "")
        self.assertEquals(post, None)
        self.assertNotEquals(error, None)

    def test_delete_post(self):
        title = "Test post delete title"
        post, error = create_post(self.author, title, "Test post description")
        delete_post(post)
        self.assertEquals(get_post_by_params(title=title), None)

