import { getCookie, makeElement, getUserInfo, deleteCookie } from "./utils.mjs";

function createMessageElement(message) {
    const created = new Date(Date.parse(message.created));
    const formatted = `${created.getFullYear()}-${created.getMonth() + 1}-${created.getDate()} 
                       ${created.getHours()}:${created.getMinutes()}`;
    return makeElement(
        `
        <div class="message-box ${userInfo.username === message.author.username ? 'own' : ''}">
            <div class="message ${userInfo.username === message.author.username ? 'own' : ''}">
                <span class="author"><b>${message.author.username}</b></span> 
                <span class="created-at"><i>${formatted}</i></span><br />
                <span class="text">${message.text}</span>
            </div>
        </div>`
    );
}

async function renderMessages() {
    const response = await fetch('/api/messages/',{
        headers: {'x-auth-with': 'cookies'}
    });
    const messages = await response.json();

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

const userInfo = getUserInfo();
const socket = new WebSocket(`ws://${window.location.host}/ws/chat/`);

socket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    const message = data['message'];
    const messageBox = document.querySelector('#messages');
    messageBox.appendChild(createMessageElement(message));
};

const sendButton = document.querySelector('#send-button');
sendButton.addEventListener("click", onMessageSendUsingWebsockets);

const logoutButton = document.querySelector('.logout-btn');
logoutButton.addEventListener("click", (event) => {
    deleteCookie('auth');
    document.location.replace('/login')
});

const greeting = document.querySelector('.greeting');
greeting.textContent = `Hi, ${userInfo.username}`

renderMessages();




