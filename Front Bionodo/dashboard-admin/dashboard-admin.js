const BIONODO_CONFIG = window.BIONODO_CONFIG;

document.addEventListener("DOMContentLoaded", () => {
  validarAccesoAdmin();
});

function validarAccesoAdmin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userType = localStorage.getItem("userType");

  if (isLoggedIn !== "true" || userType !== "admin") {
    BIONODO_CONFIG.navigate("login");
  }
}

function goToUsuarios() {
  BIONODO_CONFIG.navigate("usuariosAdmin");
}

function goToPlantas() {
  BIONODO_CONFIG.navigate("plantasAdmin");
}

function goToNodos() {
  BIONODO_CONFIG.navigate("nodosAdmin");
}

function goToInsignias() {
  BIONODO_CONFIG.navigate("insigniasAdmin");
}

function cerrarSesion() {
  BIONODO_CONFIG.clearSession();
  BIONODO_CONFIG.navigate("login");
}
