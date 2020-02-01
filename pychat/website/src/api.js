export function authenticate(username, password) {
    return fetch('/api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'username': username, 'password': password})
    });
}

export function register(username, password) {
    return fetch('/api/create_user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'username': username, 'password': password})
    });
}

export function getRooms() {
    return fetch('/api/room/my/', {
        headers: {
            'x-auth-with': 'cookies'
        }
    });
}

export function getMessages(roomId) {
    return fetch(`/api/room/${roomId}/messages/`, {
            headers: {
                'x-auth-with': 'cookies'
            }
        });
}

export function createRoom(title) {
    return fetch('/api/room/create/',{
            method: 'POST',
            headers: {
                'x-auth-with': 'cookies',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'title': title})
        });
}

export function addUserToRoom(roomId, username) {
    return fetch(`/api/room/${roomId}/add_user/${username}/`, {
            method: 'POST',
            headers: {
                'x-auth-with': 'cookies'
            }
        });
}
