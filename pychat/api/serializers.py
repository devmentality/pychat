from rest_framework import serializers
from .models import User, Message, Room


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']


class MessageSerializer(serializers.ModelSerializer):
    author = UserSerializer(required=True)

    class Meta:
        model = Message
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    creator = UserSerializer(required=False)
    users = UserSerializer(required=True, many=True)

    class Meta:
        model = Room
        fields = '__all__'
