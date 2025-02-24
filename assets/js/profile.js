d = document;

const inputUserName = d.getElementById("inputUserName");
const inputEmail = d.getElementById("inputEmail");
const btnCambiarFoto = d.getElementById("btnCambiarFoto")

inputUserName.value = sessionStorage.getItem('username');
inputEmail.value = sessionStorage.getItem('email');

