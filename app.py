from uuid import uuid1
from functools import wraps
from flask import Flask
from flask import render_template
from flask import request
from flask import abort
from flask import jsonify


app = Flask(__name__)


class User:
    def __init__(self, login):
        self.login = login
        self.id = str(uuid1())


class Message:
    def __init__(self, author_id, text):
        self.author_id = author_id
        self.text = text


supervisor = User('Supervisor')


users = {
    supervisor.id: supervisor
}

messages = [
    Message(supervisor.id, 'Hello! I am a chat supervisor. Start messaging.')
]

current_user = None


def require_user_id(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        global current_user
        print('DEBUG')
        user_id = request.headers.get('x-user-id')
        if user_id is None:
            return abort(401)
        if user_id not in users:
            return abort(403)
        current_user = users[user_id]
        return view(*args, **kwargs)
    return wrapper


@app.route('/api/create_user', methods=['POST'])
def create_user():
    login = request.json.get('login')
    user = User(login)
    users[user.id] = user
    return jsonify({'id': user.id}), 201


@app.route('/api/messages', methods=['GET'])
@require_user_id
def all_messages():
    msgs = [
        {'author': users[msg.author_id].login, 'text': msg.text}
        for msg in messages
    ]

    return jsonify(msgs)


@app.route('/api/send', methods=['POST'])
@require_user_id
def send_message():
    text = request.json.get('text')
    new_msg = Message(current_user.id, text)
    messages.append(new_msg)
    return jsonify('sent')


@app.route('/')
def index():
    return render_template('app.html')


@app.route('/login')
def login_view():
    return render_template('login.html')


if __name__ == "__main__":
    app.run(debug=True)
