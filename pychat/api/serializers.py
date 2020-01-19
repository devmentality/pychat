from rest_framework import serializers
from .models import User, Message


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']


class MessageSerializer(serializers.ModelSerializer):
    author = UserSerializer(required=True)

    class Meta:
        model = Message
        fields = '__all__'
