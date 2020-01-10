from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import  csrf_exempt
from .models import *
from functools import wraps
from json import loads

current_user = None


def require_user_id(view):
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        global current_user
        user_id = request.headers.get('x-user-id')
        if user_id is None:
            return HttpResponse(status=401)
        if user_id not in UserRepository.users:
            return HttpResponse(status=403)
        current_user = UserRepository.users[user_id]
        return view(request, *args, **kwargs)
    return wrapper


@require_POST
@csrf_exempt
def create_user(request):
    body = loads(request.body)
    login = body['login']
    user = User(login)
    UserRepository.users[user.id] = user
    return JsonResponse({'id': user.id})


@require_user_id
@require_POST
@csrf_exempt
def send_message(request):
    body = loads(request.body)
    text = body['text']
    MessageRepository.messages.append(Message(current_user.id, text))
    return JsonResponse({'Result': 'Sent'})


@require_user_id
@require_GET
def all_messages(request):
    messages = [
        {'author': UserRepository.users[msg.author_id].login, 'text': msg.text}
        for msg in MessageRepository.messages
    ]
    return JsonResponse({'messages': messages})
