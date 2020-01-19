async function signUp(username, password) {
    await fetch('/api/create_user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'username': username, 'password': password})
    });
}


async function signIn(username, password) {
    await fetch('/api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'username': username, 'password': password})
    });
}


const signUpButton = document.querySelector('.sign-up-btn');
const signInButton = document.querySelector('.sign-in-btn');

signUpButton.addEventListener('click', async (event) => {
    const username = document.querySelector('.sign-up-username').value;
    const password = document.querySelector('.sign-up-password').value;
    await signUp(username, password);
    await signIn(username, password);
    document.location.replace('/');
});

signInButton.addEventListener('click', async (event) => {
    const username = document.querySelector('.sign-in-username').value;
    const password = document.querySelector('.sign-in-password').value;
    await signIn(username, password);
    document.location.replace('/');
});




