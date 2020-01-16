from django.http import HttpResponse
from .models import UserRepository
from pychat.settings import SECRET_KEY
from functools import wraps
import jwt


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
