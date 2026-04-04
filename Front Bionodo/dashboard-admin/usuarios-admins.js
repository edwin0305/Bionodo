const BIONODO_CONFIG = window.BIONODO_CONFIG;
const usersContainer = document.getElementById("usersContainer");
const messageDiv = document.getElementById("message");
const totalUsuarios = document.getElementById("totalUsuarios");

const searchEmailInput = document.getElementById("searchEmail");
const btnBuscar = document.getElementById("btnBuscar");
const btnRecargar = document.getElementById("btnRecargar");

const usuarioForm = document.getElementById("usuarioForm");

const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const emailInput = document.getElementById("email");
const telefonoInput = document.getElementById("telefono");
const edadInput = document.getElementById("edad");
const passwordInput = document.getElementById("password");

const nombreError = document.getElementById("nombreError");
const apellidoError = document.getElementById("apellidoError");
const emailError = document.getElementById("emailError");
const telefonoError = document.getElementById("telefonoError");
const edadError = document.getElementById("edadError");
const passwordError = document.getElementById("passwordError");

const detailModal = document.getElementById("detailModal");
const detailContent = document.getElementById("detailContent");
const closeDetailBtn = document.getElementById("closeDetailBtn");

const deleteModal = document.getElementById("deleteModal");
const deleteText = document.getElementById("deleteText");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

const successModal = document.getElementById("successModal");
const successText = document.getElementById("successText");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");

let users = [];
let selectedEmailToDelete = null;

const SAVE_USER_URL = `${BIONODO_CONFIG.api.users}/api/proyecto/usuario/save`;
const LIST_USERS_URL = `${BIONODO_CONFIG.api.users}/api/proyecto/admin/usuarios`;
const SEARCH_USER_BASE_URL = `${BIONODO_CONFIG.api.users}/api/proyecto/usuario/buscar/`;
const DELETE_USER_BASE_URL = `${BIONODO_CONFIG.api.users}/api/proyecto/usuario/eliminar/`;

const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const phoneRegex = /^[0-9]+$/;

document.addEventListener("DOMContentLoaded", () => {
  validarAccesoAdmin();
  configurarAcordeones();
  cargarUsuarios();
});

btnBuscar.addEventListener("click", buscarUsuarioPorCorreo);
btnRecargar.addEventListener("click", () => {
  searchEmailInput.value = "";
  cargarUsuarios();
});

closeDetailBtn.addEventListener("click", () => {
  detailModal.classList.add("hidden");
});

cancelDeleteBtn.addEventListener("click", () => {
  selectedEmailToDelete = null;
  deleteModal.classList.add("hidden");
});

confirmDeleteBtn.addEventListener("click", async () => {
  if (!selectedEmailToDelete) return;
  await eliminarUsuario(selectedEmailToDelete);
});

closeSuccessBtn.addEventListener("click", () => {
  successModal.classList.add("hidden");
});

nombreInput.addEventListener("input", validarNombre);
apellidoInput.addEventListener("input", validarApellido);
emailInput.addEventListener("input", validarEmail);
telefonoInput.addEventListener("input", validarTelefono);
edadInput.addEventListener("input", validarEdad);
passwordInput.addEventListener("input", validarPassword);

usuarioForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  limpiarMensaje();

  const esNombreValido = validarNombre();
  const esApellidoValido = validarApellido();
  const esEmailValido = validarEmail();
  const esTelefonoValido = validarTelefono();
  const esEdadValida = validarEdad();
  const esPasswordValida = validarPassword();

  if (!esNombreValido || !esApellidoValido || !esEmailValido || !esTelefonoValido || !esEdadValida || !esPasswordValida) {
    mostrarError("Por favor corrige los campos marcados");
    return;
  }

  try {
    const response = await fetch(SAVE_USER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: emailInput.value.trim(),
        nombre: nombreInput.value.trim(),
        apellido: apellidoInput.value.trim(),
        telefono: telefonoInput.value.trim(),
        password: passwordInput.value.trim(),
        edad: parseInt(edadInput.value.trim(), 10)
      })
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "No se pudo guardar el usuario");
    }

    usuarioForm.reset();
    limpiarEstadosFormulario();
    mostrarExitoModal(data || "Usuario guardado correctamente");
    await cargarUsuarios();

  } catch (error) {
    console.error("Error guardando usuario:", error);
    mostrarError(error.message || "No se pudo guardar el usuario");
  }
});

function validarAccesoAdmin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userType = localStorage.getItem("userType");

  if (isLoggedIn !== "true" || userType !== "admin") {
    BIONODO_CONFIG.navigate("login");
  }
}

async function cargarUsuarios() {
  limpiarMensaje();
  usersContainer.innerHTML = `<div class="empty-state">Cargando usuarios...</div>`;

  try {
    const response = await fetch(LIST_USERS_URL);
    const data = await response.json();

    console.log("Respuesta real de /admin/usuarios:", data);

    if (!response.ok) {
      throw new Error("No se pudieron obtener los usuarios");
    }

    if (Array.isArray(data)) {
      users = data;
    } else if (Array.isArray(data.usuarios)) {
      users = data.usuarios;
    } else if (Array.isArray(data.data)) {
      users = data.data;
    } else {
      users = [];
    }

    actualizarContador(users.length);
    renderUsuarios(users);

  } catch (error) {
    console.error("Error cargando usuarios:", error);
    mostrarError("No se pudieron cargar los usuarios");
    usersContainer.innerHTML = `<div class="empty-state">Error al cargar usuarios</div>`;
  }
}

async function buscarUsuarioPorCorreo() {
  limpiarMensaje();

  const email = searchEmailInput.value.trim();

  if (!email) {
    mostrarError("Ingresa un correo para realizar la búsqueda");
    return;
  }

  try {
    const response = await fetch(`${SEARCH_USER_BASE_URL}${encodeURIComponent(email)}`);

    if (!response.ok) {
      throw new Error("No se pudo realizar la búsqueda");
    }

    const usuario = await response.json();

    if (!usuario || !usuario.email) {
      usersContainer.innerHTML = `<div class="empty-state">No se encontró un usuario con ese correo</div>`;
      actualizarContador(0);
      return;
    }

    renderUsuarios([usuario]);
    actualizarContador(1);

  } catch (error) {
    console.error("Error buscando usuario:", error);
    usersContainer.innerHTML = `<div class="empty-state">No se encontró un usuario con ese correo</div>`;
    actualizarContador(0);
  }
}

function renderUsuarios(lista) {
  usersContainer.innerHTML = "";

  if (!lista.length) {
    usersContainer.innerHTML = `<div class="empty-state">No hay usuarios registrados</div>`;
    return;
  }

  lista.forEach((usuario) => {
    const card = document.createElement("article");
    card.className = "user-card";

    card.innerHTML = `
      <h3>${escapeHtml(usuario.nombre)} ${escapeHtml(usuario.apellido)}</h3>
      <div class="user-info">
        <p><strong>Correo:</strong> ${escapeHtml(usuario.email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(usuario.telefono)}</p>
        <p><strong>Edad:</strong> ${escapeHtml(String(usuario.edad ?? ""))}</p>
      </div>
      <div class="user-actions">
        <button class="btn-primary" data-action="ver" data-email="${escapeHtml(usuario.email)}">Ver</button>
        <button class="btn-danger" data-action="eliminar" data-email="${escapeHtml(usuario.email)}">Eliminar</button>
      </div>
    `;

    usersContainer.appendChild(card);
  });

  asignarEventosTarjetas(lista);
}

function asignarEventosTarjetas(listaActual) {
  const buttons = document.querySelectorAll(".user-actions button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const email = button.dataset.email;
      const usuario = listaActual.find((u) => u.email === email);

      if (!usuario) return;

      if (action === "ver") {
        mostrarDetalle(usuario);
      }

      if (action === "eliminar") {
        abrirConfirmacionEliminar(usuario);
      }
    });
  });
}

function mostrarDetalle(usuario) {
  detailContent.innerHTML = `
    <p><strong>Nombre:</strong> ${escapeHtml(usuario.nombre)}</p>
    <p><strong>Apellido:</strong> ${escapeHtml(usuario.apellido)}</p>
    <p><strong>Correo:</strong> ${escapeHtml(usuario.email)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(usuario.telefono)}</p>
    <p><strong>Edad:</strong> ${escapeHtml(String(usuario.edad ?? ""))}</p>
  `;

  detailModal.classList.remove("hidden");
}

function abrirConfirmacionEliminar(usuario) {
  selectedEmailToDelete = usuario.email;
  deleteText.textContent = `¿Deseas eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`;
  deleteModal.classList.remove("hidden");
}

async function eliminarUsuario(email) {
  limpiarMensaje();

  try {
    const response = await fetch(`${DELETE_USER_BASE_URL}${encodeURIComponent(email)}`, {
      method: "DELETE"
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "No se pudo eliminar el usuario");
    }

    deleteModal.classList.add("hidden");
    selectedEmailToDelete = null;

    mostrarExitoModal(data || "Usuario eliminado exitosamente");
    searchEmailInput.value = "";
    await cargarUsuarios();

  } catch (error) {
    console.error("Error eliminando usuario:", error);
    deleteModal.classList.add("hidden");
    mostrarError(error.message || "No se pudo eliminar el usuario");
  }
}

function actualizarContador(total) {
  totalUsuarios.textContent = `${total} usuario${total === 1 ? "" : "s"}`;
}

function mostrarExitoModal(mensaje) {
  successText.textContent = mensaje;
  successModal.classList.remove("hidden");
}

function mostrarError(mensaje) {
  messageDiv.textContent = mensaje;
  messageDiv.className = "message error";
}

function limpiarMensaje() {
  messageDiv.textContent = "";
  messageDiv.className = "message";
}

function setError(input, errorElement, message) {
  input.classList.add("input-error");
  input.classList.remove("input-success");
  errorElement.textContent = message;
}

function setSuccess(input, errorElement) {
  input.classList.remove("input-error");
  input.classList.add("input-success");
  errorElement.textContent = "";
}

function clearState(input, errorElement) {
  input.classList.remove("input-error", "input-success");
  errorElement.textContent = "";
}

function limpiarEstadosFormulario() {
  [
    [nombreInput, nombreError],
    [apellidoInput, apellidoError],
    [emailInput, emailError],
    [telefonoInput, telefonoError],
    [edadInput, edadError],
    [passwordInput, passwordError]
  ].forEach(([input, error]) => clearState(input, error));
}

function validarNombre() {
  const value = nombreInput.value.trim();
  if (!value) {
    setError(nombreInput, nombreError, "El nombre es obligatorio");
    return false;
  }
  if (!nameRegex.test(value)) {
    setError(nombreInput, nombreError, "El nombre solo debe contener letras y espacios");
    return false;
  }
  setSuccess(nombreInput, nombreError);
  return true;
}

function validarApellido() {
  const value = apellidoInput.value.trim();
  if (!value) {
    setError(apellidoInput, apellidoError, "El apellido es obligatorio");
    return false;
  }
  if (!nameRegex.test(value)) {
    setError(apellidoInput, apellidoError, "El apellido solo debe contener letras y espacios");
    return false;
  }
  setSuccess(apellidoInput, apellidoError);
  return true;
}

function validarEmail() {
  const value = emailInput.value.trim();
  if (!value) {
    setError(emailInput, emailError, "El correo es obligatorio");
    return false;
  }
  if (!emailRegex.test(value)) {
    setError(emailInput, emailError, "Ingrese un correo válido");
    return false;
  }
  setSuccess(emailInput, emailError);
  return true;
}

function validarTelefono() {
  const value = telefonoInput.value.trim();
  if (!value) {
    setError(telefonoInput, telefonoError, "El teléfono es obligatorio");
    return false;
  }
  if (!phoneRegex.test(value)) {
    setError(telefonoInput, telefonoError, "El teléfono solo debe contener números");
    return false;
  }
  if (value.length < 7 || value.length > 15) {
    setError(telefonoInput, telefonoError, "El teléfono debe tener entre 7 y 15 dígitos");
    return false;
  }
  setSuccess(telefonoInput, telefonoError);
  return true;
}

function validarEdad() {
  const value = edadInput.value.trim();
  if (!value) {
    setError(edadInput, edadError, "La edad es obligatoria");
    return false;
  }
  const edad = parseInt(value, 10);
  if (isNaN(edad)) {
    setError(edadInput, edadError, "La edad debe ser numérica");
    return false;
  }
  if (edad < 1 || edad > 120) {
    setError(edadInput, edadError, "La edad debe estar entre 1 y 120");
    return false;
  }
  setSuccess(edadInput, edadError);
  return true;
}

function validarPassword() {
  const value = passwordInput.value.trim();
  if (!value) {
    setError(passwordInput, passwordError, "La contraseña es obligatoria");
    return false;
  }
  if (value.length < 6) {
    setError(passwordInput, passwordError, "La contraseña debe tener al menos 6 caracteres");
    return false;
  }
  setSuccess(passwordInput, passwordError);
  return true;
}

function configurarAcordeones() {
  const toggles = document.querySelectorAll(".accordion-toggle");

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.dataset.target;
      const target = document.getElementById(targetId);
      const icon = toggle.querySelector(".accordion-icon");

      target.classList.toggle("show");
      icon.textContent = target.classList.contains("show") ? "−" : "+";
    });
  });
}

function volverDashboard() {
  BIONODO_CONFIG.navigate("dashboardAdmin");
}

function cerrarSesion() {
  BIONODO_CONFIG.clearSession();
  BIONODO_CONFIG.navigate("login");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
