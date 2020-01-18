import { getCookie, makeElement, getUserId } from "./utils.mjs";

function createMessageElement(message) {
    return makeElement(
        `<div class="message">
            <span class="author"><i>${message.author}:</i></span> <br />
            <span class="text">${message.text}</span>
        </div>`
    );
}

async function renderMessages() {
    const response = await fetch('/api/messages/',{
        headers: {'x-auth-with': 'cookies'}
    });
    const messages = (await response.json())['messages'];

    const messageBox = document.querySelector('#messages');
    for(const message of messages) {
        messageBox.appendChild(createMessageElement(message));
    }
}

async function onMessageSend() {
    const messageText = document.querySelector("#message-text").value;
    await fetch('/api/send/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-with': 'cookies'
            },
            body: JSON.stringify({'text': messageText})
        }
    );

    document.location.reload();
}

async function onMessageSendUsingWebsockets() {
    const messageText = document.querySelector("#message-text").value;
    socket.send(JSON.stringify(
        {
            'text': messageText
        })
    );
    document.querySelector("#message-text").value = '';
}

const authCookie = getCookie('auth');

if (authCookie === undefined)
    document.location.replace('/login');

const socket = new WebSocket(`ws://${window.location.host}/ws/chat/`);

socket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    const message = data['message'];
    const messageBox = document.querySelector('#messages');
    messageBox.appendChild(createMessageElement(message));
};

const sendButton = document.querySelector('#send-button');
sendButton.addEventListener("click", onMessageSendUsingWebsockets);

renderMessages();




