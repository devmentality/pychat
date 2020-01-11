from channels.generic.websocket import WebsocketConsumer
import json
from .models import *


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, code):
        pass

    def receive(self, text_data=None, bytes_data=None):
        message = json.loads(text_data)
        MessageRepository.messages.append(Message(message['userId'], message['text']))
        self.send(
            text_data=json.dumps({
                'message': {
                    'author': UserRepository.users[message['userId']].login,
                    'text': message['text']
                }
            })
        )
