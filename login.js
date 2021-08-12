"use strict";
formLoginSubmit();
async function formLoginSubmit() {
    const submitEle = document.getElementById('login-submit');
    submitEle?.addEventListener('click', (e) => {
        e.preventDefault();
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');
        fetch("http://localhost:8080/auth", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": '*' },
            body: JSON.stringify({
                username: usernameField.value,
                password: passwordField.value
            }),
        })
            .then(response => response.json())
            .then(data => {
            if (data.jwt != null) {
                localStorage.setItem('jwt', JSON.stringify(data.jwt));
                localStorage.setItem('user', JSON.stringify(usernameField.value));
                window.location.replace("http://localhost:3000/scheduler.html");
            }
        })
            .catch((error) => {
            console.error('Error:', error);
        });
    });
}
