from django.test import TestCase
from django.urls import reverse_lazy
from django.http.response import JsonResponse
from django.contrib.sessions.models import Session
from django.core.exceptions import ObjectDoesNotExist

from typing import Union

from authorization.models import User

from .db_services.db_services import create_user
from .db_services.db_services import get_user_by_params

from .views import login_view
from .views import registration_view
from .views import logout_view


# Create your tests here.


def _get_user_by_session_key(response: JsonResponse) -> Union[User, None]:
    try:
        session_key = response.cookies.get('sessionid')
        if session_key:
            session = Session.objects.get(session_key=session_key.value)
            return User.objects.get(id=session.get_decoded()['_auth_user_id'])
    except ObjectDoesNotExist:
        pass
    return None


class RegistrationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="TestUser",
            password="TestUserPassword",
            email="testuser@gmail.com"
        )

    def test_create_user(self):
        # Test normal user creation
        username = "NormalUser"
        user, error = create_user(username, "NormalUserPassword", "normaluser@gmail.com")
        self.assertEquals(error, None, msg=f"Function user.db_services.db_services.create_user"
                                           f"returned an error when the it had to work right."
                                           f"It returned: {error}")
        self.assertEquals(user, get_user_by_params(username=username),
                          msg=f"Function user.db_services.db_services.create_user"
                              f"returned a wrong user,\nit returned: {user},\nwhen it had to return: "
                              f"{get_user_by_params(username=username)}")

    def test_create_user_not_unique(self):
        user, error = create_user(self.user.username, "TestUserPassword", self.user.email)
        self.assertEquals(user, None, msg=f"Function user.db_services.db_services.create_user"
                                          f"returned a user when the user with the same username"
                                          f"was already created")
        self.assertNotEquals(error, None, msg=f"Function user.db_services.db_services.create_user"
                                              f"had not returned an error when the user with the"
                                              f"same username was already created")

    def test_create_user_bad_credentials(self):
        user, error = create_user("a", "TestUserPassword", "badcredentials@gmail.com")
        self.assertEquals(user, None, msg=f"Function user.db_services.db_services.create_user"
                                          f"returned a user when the user had bad credentials")
        self.assertNotEquals(error, None, msg=f"Function user.db_services.db_services.create_user"
                                              f"had not returned an error when the user had bad credentials")

        user, error = create_user("TestUsername", "a", "badcredentials@gmail.com")
        self.assertEquals(user, None, msg=f"Function user.db_services.db_services.create_user"
                                          f"returned a user when the user had bad credentials")
        self.assertNotEquals(error, None, msg=f"Function user.db_services.db_services.create_user"
                                              f"had not returned an error when the user had bad credentials")


class DBGetTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="TestUser",
            password="TestUserPassword",
            email="testuser@gmail.com"
        )

    def test_get_user_by_params(self):
        user = get_user_by_params(uuid=self.user.uuid)
        self.assertEquals(user, self.user, msg=f"Function user.db_services.db_services.get_user_by_params"
                                               f"returned a wrong user, it returned: {user} when it had to "
                                               f"return: {self.user}")
        user = get_user_by_params(username=self.user.username)
        self.assertEquals(user, self.user, msg=f"Function user.db_services.db_services.get_user_by_params"
                                               f"returned a wrong user, it returned: {user} when it had to "
                                               f"return: {self.user}")


class ViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="TestUser",
            password="TestUserPassword",
            email="testuser@gmail.com"
        )

    def test_login_view(self):
        response = self.client.post(reverse_lazy(login_view), {
            'username': "TestUser",
            'password': "TestUserPassword"
        })
        self.assertEquals(response.status_code, 200, msg=f"user.views.login_view returned a response with"
                                                         f"status code {response.status_code} when it had "
                                                         f"to return 200")
        self.assertEquals(response.json().get('status'), 'success', msg=f"user.views.login_view had not returned status"
                                                                        f"'success' when the user credentials were right")
        user = _get_user_by_session_key(response)
        self.assertEquals(self.user, user, msg=f"user.views.login_view had not login the user")

    def test_logout_view(self):
        self.client.force_login(self.user)
        response = self.client.post(reverse_lazy(logout_view))
        self.assertEquals(response.status_code, 200, msg=f"user.views.logout_view returned a response with status"
                                                         f"code {response.status_code} when it had to return 200")
        self.assertEquals(response.json().get('status'), 'success',
                          msg=f"user.views.logout_view had not returned status"
                              f"'success' when the request was right")
        user = _get_user_by_session_key(response)
        self.assertEquals(user, None, msg=f"user.view.logout_view had not logout the user")

    def test_register_view(self):
        username = "TestRegistrationUsername"
        response = self.client.post(reverse_lazy(registration_view), data={
            'username': username,
            'password': "TestPassword",
            'email': 'testregistrationemail@gmail.com'
        })
        self.assertEquals(response.status_code, 200, msg=f"user.views.registration_view returned a response with status"
                                                         f"code {response.status_code} when it had to return 200")
        self.assertEquals(response.json().get('status'), 'success', msg=f"user.views.registration_view had not returned"
                                                                        f" status 'success' when the request was right")
        user = _get_user_by_session_key(response)
        self.assertEquals(user, User.objects.get(username=username), msg=f"user.views.registration_view had not login"
                                                                         f"the user after the request")


class ViewWithWrongDataTests(TestCase):
    def setUp(self):
        self.username = 'TestUserUsername'
        self.password = 'TestUserPassword'
        self.email = 'testuseremail@gmail.com'
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
            email=self.email
        )

    def test_login_view_with_bad_data(self):
        response = self.client.post(reverse_lazy(login_view), data={
            'username': self.username,
            'password': 'wrong' + self.password
        })
        self.assertEquals(response.json().get('status'), 'fail', msg=f"user.views.login_view had not returned status"
                                                                     f"'fail' when the user credentials were incorrect")
        self.assertNotEquals(response.json().get('error'), None, msg=f"user.views.login_view had not returned an error"
                                                                     f"when the user credentials were incorrect")

    def test_logout_view_without_login(self):
        response = self.client.post(reverse_lazy(logout_view))
        self.assertEquals(response.json().get('status'), 'fail', msg=f"user.views.logout_view had not returned status"
                                                                     f"'fail' when the user was not logined")

    def test_register_view_when_the_user_with_this_username_already_exists(self):
        response = self.client.post(reverse_lazy(registration_view), data={
            'username': self.user.username,
            'password': self.password,
            'email': self.user.email
        })
        self.assertEquals(response.json().get('status'), 'fail', msg=f"user.views.registration_view had not returned "
                                                                     f"status 'fail' when the user with this username "
                                                                     f"already was registered")
        self.assertNotEquals(response.json().get('error'), None, msg=f"user.views.registration_view had not returned an"
                                                                     f"error when the user credentials were incorrect")
        user = _get_user_by_session_key(response)
        self.assertEquals(user, None, msg=f"user.views.registration_view had login a user when he sent bad credentials")

    def test_register_view_bad_username(self):
        response = self.client.post(reverse_lazy(registration_view), data={
            'username': 'a',
            'password': 'other' + self.password,
            'email': 'other' + self.user.email
        })
        self.assertEquals(response.json().get('status'), 'fail', msg=f"user.views.registration_view had not returned "
                                                                     f"status 'fail' when the user credentials were "
                                                                     f"incorrect")
        self.assertNotEquals(response.json().get('error'), None, msg=f"user.views.registration_view had not returned an"
                                                                     f"error when the user credentials were incorrect")
        user = _get_user_by_session_key(response)
        self.assertEquals(user, None, msg=f"user.views.registration_view had login a user when he sent bad credentials")

    def test_register_view_bad_password(self):
        response = self.client.post(reverse_lazy(registration_view), data={
            'username': 'other' + self.username,
            'password': 'a',
            'email': 'other' + self.user.email
        })
        self.assertEquals(response.json().get('status'), 'fail', msg=f"user.views.registration_view had not returned "
                                                                     f"status 'fail' when the user credentials were "
                                                                     f"incorrect")
        self.assertNotEquals(response.json().get('error'), None, msg=f"user.views.registration_view had not returned an"
                                                                     f"error when the user credentials were incorrect")
        user = _get_user_by_session_key(response)
        self.assertEquals(user, None, msg=f"user.views.registration_view had login a user when he sent bad credentials")

    def test_register_view_bad_email(self):
        response = self.client.post(reverse_lazy(registration_view), data={
            'username': 'other' + self.username,
            'password': 'other' + self.password,
            'email': self.user.email
        })
        self.assertEquals(response.json().get('status'), 'fail', msg=f"user.views.registration_view had not returned "
                                                                     f"status 'fail' when the user credentials were "
                                                                     f"incorrect")
        self.assertNotEquals(response.json().get('error'), None, msg=f"user.views.registration_view had not returned an"
                                                                     f"error when the user credentials were incorrect")
        user = _get_user_by_session_key(response)
        self.assertEquals(user, None, msg=f"user.views.registration_view had login a user when he sent bad credentials")


