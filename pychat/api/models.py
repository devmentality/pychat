from uuid import uuid1


class User:
    def __init__(self, login):
        self.login = login
        self.id = str(uuid1())


class Message:
    def __init__(self, author_id, text):
        self.author_id = author_id
        self.text = text


class UserRepository:
    users = {}


class MessageRepository:
    messages = []


supervisor = User('supervisor')
intro = Message(supervisor.id, 'Welcome!')
UserRepository.users[supervisor.id] = supervisor
MessageRepository.messages.append(intro)
