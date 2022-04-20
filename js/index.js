let formulario = null;
let emailInput = null;
let passwordInput = null;

main();

function main() {
  inicializaElementos()
  agregaEventos()
  revisarSesion()
}

function inicializaElementos() {
  formulario = document.getElementById("loginForm");
  emailInput = document.getElementById("txtEmail");
  passwordInput = document.getElementById("txtPassword");
}

function agregaEventos() {
  formulario.onsubmit = handleLogin;
}

function revisarSesion() {
  let token = getStorageItem("token")
  if(token){
    window.location.href = "/paginas/productos.html";
  }
}

async function handleLogin(event) {
  event.preventDefault();
  try {
    cambiarEstadoLoader(true)
    let response = await login(emailInput.value, passwordInput.value);
    let responseData = await response.json();
    if (!response.ok) {
      throw Error(response.statusText);
    }
    setStorageItem("token", responseData.token);
    setStorageItem("user", JSON.stringify(responseData.user));
    showToast(
      "success",
      `Bienvenid@ ${responseData.user.name} ${responseData.user.surname}`,
      3600
    );
    window.location.href = "/paginas/productos.html";
  } catch (error) {
    showToast("error", `${error}`, 3600);
    console.log("🚀 ~ file: index.js ~ line 16 ~ handleLogin ~ error", error);
  } finally{
    cambiarEstadoLoader(false)
  }
}
