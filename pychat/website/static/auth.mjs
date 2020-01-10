const submit = document.querySelector('.submit_btn');

submit.addEventListener('click', async (event) => {
    const login = document.querySelector('.login').value;

    const response = await fetch('/api/create_user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'login': login})
        });
    const data = await response.json();
    document.cookie = `userId=${data['id']}; path=/`;
    document.location.replace('/');
});
