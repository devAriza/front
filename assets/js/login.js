d = document;

const loginForm = d.querySelector(".user");
const inputUser = d.getElementById("inputUser");
const inputPassword = d.getElementById("inputPassword");

async function loginUser(username, password) {
    const credentials = btoa(`${username}:${password}`);

    try {
        const response = await fetch('http://127.0.0.1:8000/api/users/login', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error de autenticación');
        }

        const userData = await response.json();
        console.log('Login exitoso:', userData);
        return userData;

    } catch (error) {
        console.error('Error en el login:', error.message);
        throw error;
    }
}

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = inputUser.value.trim();
    const password = inputPassword.value.trim();

    if (!username || !password) {
        new bs5.Toast({
            body: `Por favor, ingrese usuario y contraseña`,
            className: 'border-0 bg-warning text-white',
        }).show();
        return;
    }

    loginUser(username, password)
    .then(user => {
        console.log('Usuario logueado:', user);
    })
    .catch(error => {
        new bs5.Toast({
            body: `Error: ${error.message}`,
            className: 'border-0 bg-danger text-white',
        }).show();
    });

});