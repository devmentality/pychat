from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .serializers import MessageSerializer
import json
from .models import *


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        if self.scope.get('user') is None:
            self.close(code=403)
            return

        self.user = self.scope['user']
        self.roomId = str(self.scope['url_route']['kwargs']['roomId'])

        async_to_sync(self.channel_layer.group_add)(
            self.roomId,
            self.channel_name
        )

        self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.roomId,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        message = json.loads(text_data)
        new_message = Message(author=self.user, text=message['text'], room_id=self.roomId)
        new_message.save()

        async_to_sync(self.channel_layer.group_send)(
            self.roomId,
            {
                'type': 'chat_message',
                'message': MessageSerializer(new_message).data
            }
        )

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'message': message
        }))
