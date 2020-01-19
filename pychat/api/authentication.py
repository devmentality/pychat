from django.db import close_old_connections
from channels.db import database_sync_to_async
from pychat.settings import SECRET_KEY
from rest_framework import authentication
from rest_framework import exceptions

from .models import User
from http import cookies
import jwt

'''
    Custom authentication mechanism.
    Should be used only via secure connections: https and secure websockets.
    Pretend to be safe from trivial xss and csrf.
'''

# Надо в какие-то сеттинги выставить будет
ORIGIN = 'http://localhost:8000'


AUTH_HEADER = 'x-auth-with'
COOKIES_AUTH = 'cookies'
HEADER_AUTH = 'header'
AUTH_TYPES = {COOKIES_AUTH, HEADER_AUTH}


class ApiAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        if (
                AUTH_HEADER not in request.headers or
                request.headers[AUTH_HEADER] not in AUTH_TYPES
        ):
            return None

        if self._use_cookie_authentication(request):
            jwt_header_and_payload = request.COOKIES['auth']
            jwt_signature = request.COOKIES['signature']
            jwt_token = jwt_header_and_payload + '.' + jwt_signature
        elif self._use_authentication_header(request):
            jwt_token = request.headers['Authentication']
        else:
            return None

        payload = jwt.decode(jwt_token, SECRET_KEY, algorithms='HS256')
        if 'userId' not in payload:
            return None
        user_id = payload['userId']
        user = User.objects.filter(pk=user_id).first()
        if user is None:
            raise exceptions.AuthenticationFailed('User not found')

        return user, None

    @staticmethod
    def _use_cookie_authentication(request):
        return (
                request.headers[AUTH_HEADER] == COOKIES_AUTH and
                'auth' in request.COOKIES and
                'signature' in request.COOKIES
        )

    @staticmethod
    def _use_authentication_header(request):
        return request.headers[AUTH_HEADER] == HEADER_AUTH


# https://github.com/django/channels/issues/1399


class WebsocketAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return WebsocketAuthMiddlewareInstance(scope, self)


class WebsocketAuthMiddlewareInstance:
    def __init__(self, scope, middleware):
        self.middleware = middleware
        self.scope = dict(scope)
        self.inner = self.middleware.inner

    async def __call__(self, receive, send):
        await database_sync_to_async(close_old_connections)()

        headers = {
            name.decode('ascii'): value.decode('ascii')
            for name, value in self.scope['headers']
        }
        cookie = cookies.SimpleCookie(headers['cookie'])

        if self._use_cookie_authentication(headers, cookie):
            jwt_header_and_payload = cookie['auth'].value
            jwt_signature = cookie['signature'].value
            jwt_token = jwt_header_and_payload + '.' + jwt_signature
        elif self._use_authentication_header(headers):
            jwt_token = headers['Authentication']
        else:
            inner = self.inner(self.scope)
            return await inner(receive, send)

        user = None
        payload = jwt.decode(jwt_token, SECRET_KEY, algorithms='HS256')
        if 'userId' in payload:
            user_id = payload['userId']
            user = await get_user(user_id)

        self.scope['user'] = user
        inner = self.inner(self.scope)
        return await inner(receive, send)

    @staticmethod
    def _use_cookie_authentication(headers, cookie):
        return (
                'origin' in headers and
                headers['origin'] == ORIGIN and
                'auth' in cookie and
                'signature' in cookie
        )

    @staticmethod
    def _use_authentication_header(headers):
        return 'origin' not in headers


@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return None
