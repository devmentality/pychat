from uuid import uuid1
from hashlib import sha1


class User:
    def __init__(self, login, password):
        self.id = str(uuid1())
        self.login = login
        self.password_hash = sha1(password.encode('ascii')).digest()

    def verify_password(self, password):
        return self.password_hash == sha1(password.encode('ascii')).digest()


class Message:
    def __init__(self, author_id, text):
        self.author_id = author_id
        self.text = text


class UserRepository:
    _users = {}

    @staticmethod
    def find_user_by_id(user_id):
        return UserRepository._users[user_id]

    @staticmethod
    def find_user_by_login(login):
        matched = list(
            filter(lambda u: u.login == login, UserRepository._users.values())
        )
        if len(matched) == 0:
            return None
        return matched[0]

    @staticmethod
    def create_user(login, password):
        if UserRepository.find_user_by_login(login) is not None:
            raise ValueError('Users with same logins are prohibited.')

        new_user = User(login, password)
        UserRepository._users[new_user.id] = new_user
        return new_user


class MessageRepository:
    messages = []


supervisor = UserRepository.create_user('supervisor', 'password')
intro = Message(supervisor.id, 'Welcome!')
MessageRepository.messages.append(intro)
