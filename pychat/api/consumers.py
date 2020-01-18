from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json
from .models import *


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        if 'user' not in self.scope:
            self.close()
        self.user = self.scope['user']
        self.chat_group_name = 'global'

        async_to_sync(self.channel_layer.group_add)(
            self.chat_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.chat_group_name,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        message = json.loads(text_data)
        MessageRepository.messages.append(Message(self.user.id, message['text']))

        async_to_sync(self.channel_layer.group_send)(
            self.chat_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'author': self.user.login,
                    'text': message['text']
                }
            }
        )

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'message': message
        }))
