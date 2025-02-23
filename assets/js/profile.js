d = document;

const inputUserName = d.getElementById("inputUserName");
const inputEmail = d.getElementById("inputEmail");
const btnCambiarFoto = d.getElementById("btnCambiarFoto")

inputUserName.value = getCookie('username');
inputEmail.value = getCookie('email').replace(/"/g, '');

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        let [key, value] = cookie.split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}