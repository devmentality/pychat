from django.http import HttpResponse
from .models import UserRepository
from pychat.settings import SECRET_KEY
from functools import wraps
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


def require_user_id(view):
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        global current_user

        if (
                AUTH_HEADER not in request.headers or
                request.headers[AUTH_HEADER] not in AUTH_TYPES
        ):
            return HttpResponse(status=401)

        if request.headers[AUTH_HEADER] == COOKIES_AUTH:
            jwt_header_and_payload = request.COOKIES['auth']
            jwt_signature = request.COOKIES['signature']
            jwt_token = jwt_header_and_payload + '.' + jwt_signature
        elif request.headers[AUTH_HEADER] == HEADER_AUTH:
            jwt_token = request.headers['Authentication']

        payload = jwt.decode(jwt_token, SECRET_KEY, algorithms='HS256')
        if 'userId' not in payload:
            return HttpResponse(status=401)
        user_id = payload['userId']
        user = UserRepository.find_user_by_id(user_id)
        if user is None:
            return HttpResponse(status=403)

        request.user = user

        return view(request, *args, **kwargs)
    return wrapper


class WebsocketAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        headers = {
            name.decode('ascii'): value.decode('ascii')
            for name, value in scope['headers']
        }
        cookie = cookies.SimpleCookie(headers['cookie'])

        user = None
        if 'origin' in headers and headers['origin'] == ORIGIN:
            jwt_header_and_payload = cookie['auth'].value
            jwt_signature = cookie['signature'].value
            jwt_token = jwt_header_and_payload + '.' + jwt_signature
        elif 'origin' not in headers:
            jwt_token = headers['Authentication']

        payload = jwt.decode(jwt_token, SECRET_KEY, algorithms='HS256')
        if 'userId' in payload:
            user_id = payload['userId']
            user = UserRepository.find_user_by_id(user_id)

        return self.inner(dict(scope, user=user))