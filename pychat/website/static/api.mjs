export function getMessagesAsync(roomId) {
    return fetch(`/api/room/${roomId}/messages/`,{
        headers: {'x-auth-with': 'cookies'}
    });
}



