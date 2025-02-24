d = document;

const loginForm = d.querySelector(".user");
const inputUser = d.getElementById("inputUser");
const inputPassword = d.getElementById("inputPassword");

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
        window.location.href = "../../index.html";
    })
    .catch(error => {
        new bs5.Toast({
            body: `Error: ${error.message}`,
            className: 'border-0 bg-danger text-white',
        }).show();
    });

});

async function loginUser(username, password) {

    try {
        const response = await fetch('http://127.0.0.1:8000/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Formato requerido por OAuth2
            },
            body: new URLSearchParams({
                username: username,
                password: password,
                grant_type: 'password'
            }),
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error de autenticación');
        }
    
        const tokenData = await response.json();
        
        // Guardar el token en sessionStorage e informacion de usuario
        sessionStorage.setItem('access_token', tokenData.access_token);
        sessionStorage.setItem('id_user', tokenData.id_user);
        sessionStorage.setItem('username', tokenData.username);
        sessionStorage.setItem('email', tokenData.email);
        
        return tokenData;
    
    } catch (error) {
        console.error('Error en el login:', error.message);
        throw error;
    }
}
