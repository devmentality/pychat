export function authenticate(username, password) {
    return fetch('/api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'username': username, 'password': password})
    })
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

