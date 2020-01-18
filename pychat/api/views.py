from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt
from .models import User, Message
from .authentication import require_user_id
from pychat.settings import SECRET_KEY
from json import loads
import jwt


@require_POST
@csrf_exempt
def create_user(request):
    body = loads(request.body)
    username = body['login']
    password = body['password']
    if User.objects.filter(username=username).first() is not None:
        return HttpResponse(status=403)

    user = User.objects.create_user(username=username, password=password)
    return JsonResponse({'id': user.id})


@require_POST
@csrf_exempt
def get_token(request):
    body = loads(request.body)
    username = body['login']
    password = body['password']
    user = User.objects.filter(username=username).first()

    if user is None or not user.check_password(password):
        return HttpResponse(status=403)

    jwt_token = jwt.encode({'userId': user.id}, SECRET_KEY, algorithm='HS256').decode('ascii')
    header_and_payload, signature = jwt_token.rsplit('.', maxsplit=1)

    response = HttpResponse(status=200)
    response.set_cookie('auth', header_and_payload)
    response.set_cookie('signature', signature, httponly=True)
    return response


@require_user_id
@require_POST
@csrf_exempt
def send_message(request):
    body = loads(request.body)
    text = body['text']
    new_message = Message(author=request.user, text=text)
    new_message.save()
    return JsonResponse({'Result': 'Sent'})


@require_user_id
@require_GET
def all_messages(request):
    messages = [
        {'author': msg.author.username, 'text': msg.text}
        for msg in Message.objects.all()
    ]
    return JsonResponse({'messages': messages})
