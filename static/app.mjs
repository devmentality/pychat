import { getCookie, makeElement } from "./utils.mjs";


const userId = getCookie('userId');

if (userId === undefined)
    document.location.replace('/login');


function createMessageElement(message) {
    return makeElement(
        `<div class="message">
            <span class="author"><i>${message.author}:</i></span> <br />
            <span class="text">${message.text}</span>
        </div>`
    );
}


async function onContentLoaded() {
    const response = await fetch('/api/messages',{
        headers: {'x-user-id': getCookie('userId')}
    });
    const messages = await response.json();

    const messageBox = document.querySelector('#messages');
    for(const message of messages) {
        messageBox.appendChild(createMessageElement(message));
    }
}

async function onMessageSend() {
    const messageText = document.querySelector("#message-text").value;
    await fetch('/api/send',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': getCookie('userId')
            },
            body: JSON.stringify({'text': messageText})
        }
    );

    document.location.reload();
}

document.addEventListener("DOMContentLoaded", onContentLoaded);

const sendButton = document.querySelector('#send-button');
sendButton.addEventListener("click", onMessageSend);