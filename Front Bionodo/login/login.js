const BIONODO_CONFIG = window.BIONODO_CONFIG;
const loginForm = document.getElementById("loginForm");
const messageDiv = document.getElementById("message");
const loginParams = new URLSearchParams(window.location.search);

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  messageDiv.textContent = "";
  messageDiv.className = "message";

  const tipoUsuario = document.getElementById("tipoUsuario").value;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email) {
    messageDiv.textContent = "El correo es obligatorio";
    messageDiv.classList.add("error");
    return;
  }

  if (!password) {
    messageDiv.textContent = "La contraseña es obligatoria";
    messageDiv.classList.add("error");
    return;
  }

  let endpoint = "";

  if (tipoUsuario === "usuario") {
    endpoint = `${BIONODO_CONFIG.api.users}/api/proyecto/auth/loginUsuario`;
  } else {
    endpoint = `${BIONODO_CONFIG.api.users}/api/proyecto/auth/loginAdmin`;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.text();

    if (response.ok) {
      messageDiv.textContent = data;
      messageDiv.classList.add("success");

      // Guardar sesión simple en localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", tipoUsuario);
      localStorage.setItem("userEmail", email);

      setTimeout(() => {
        if (tipoUsuario === "admin") {
          BIONODO_CONFIG.navigate("dashboardAdmin");
        } else {
          redirigirUsuarioPostLogin();
        }
      }, 1000);

    } else {
      messageDiv.textContent = data;
      messageDiv.classList.add("error");
    }

  } catch (error) {
    messageDiv.textContent = "No se pudo conectar con el servidor";
    messageDiv.classList.add("error");
    console.error("Error de conexión:", error);
  }
});

function redirigirUsuarioPostLogin() {
  const redirect = loginParams.get("redirect");
  const codigoNodo = loginParams.get("codigoNodo");

  if (redirect === "nodo" && codigoNodo) {
    BIONODO_CONFIG.navigate("nodo", { codigoNodo });
    return;
  }

  BIONODO_CONFIG.navigate("dashboardUsuario");
}
