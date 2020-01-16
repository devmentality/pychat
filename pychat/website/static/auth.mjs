async function signUp(login, password) {
    await fetch('/api/create_user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'login': login, 'password': password})
    });
}


async function signIn(login, password) {
    await fetch('/api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'login': login, 'password': password})
    });
}


const signUpButton = document.querySelector('.sign-up-btn');
const signInButton = document.querySelector('.sign-in-btn');

signUpButton.addEventListener('click', async (event) => {
    const login = document.querySelector('.sign-up-login').value;
    const password = document.querySelector('.sign-up-password').value;
    await signUp(login, password);
    await signIn(login, password);
    document.location.replace('/');
});

signInButton.addEventListener('click', async (event) => {
    const login = document.querySelector('.sign-in-login').value;
    const password = document.querySelector('.sign-in-password').value;
    await signIn(login, password);
    document.location.replace('/');
});




