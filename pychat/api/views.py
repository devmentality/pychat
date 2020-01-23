from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import User, Message, Room
from .serializers import UserSerializer, MessageSerializer, RoomSerializer
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


class CreateRoom(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        body = loads(request.body)
        new_room = Room(title=body['title'], creator=request.user)
        new_room.save()
        new_room.users.add(request.user)
        return Response({'roomId': new_room.pk})


class GetRoom(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        room = Room.objects.get(pk=pk)
        return Response(RoomSerializer(room).data)


class MessageList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        messages = Message.objects.filter(room__pk=pk)
        return Response(MessageSerializer(messages, many=True).data)


class SendMessage(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        body = loads(request.body)
        text = body['text']
        room = Room.objects.get(pk=pk)
        new_message = Message(author=request.user, text=text, room=room)
        new_message.save()
        return Response({'Result': 'Sent'})


class GetMyRooms(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rooms = request.user.member_of
        return Response(RoomSerializer(rooms, many=True).data)
