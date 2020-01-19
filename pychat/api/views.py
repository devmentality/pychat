from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import User, Message
from .serializers import UserSerializer, MessageSerializer
from pychat.settings import SECRET_KEY
from json import loads
import jwt


class CreateUser(APIView):
    authentication_classes = []

    def post(self, request):
        body = loads(request.body)
        username = body['username']
        password = body['password']
        if User.objects.filter(username=username).first() is not None:
            return HttpResponse(status=403)

        user = User.objects.create_user(username=username, password=password)
        return Response(UserSerializer(user).data)


class GetToken(APIView):
    authentication_classes = []

    def post(self, request):
        body = loads(request.body)
        username = body['username']
        password = body['password']
        user = User.objects.filter(username=username).first()

        if user is None or not user.check_password(password):
            return HttpResponse(status=403)

        jwt_token = jwt.encode(
            {'userId': user.id, 'username': user.username}, SECRET_KEY, algorithm='HS256').decode('ascii')
        header_and_payload, signature = jwt_token.rsplit('.', maxsplit=1)

        response = HttpResponse(status=200)
        response.set_cookie('auth', header_and_payload)
        response.set_cookie('signature', signature, httponly=True)
        return response


class SendMessage(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        body = loads(request.body)
        text = body['text']
        new_message = Message(author=request.user, text=text)
        new_message.save()
        return Response({'Result': 'Sent'})


class MessageList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        messages = Message.objects.all()
        return Response(MessageSerializer(messages, many=True).data)
