const BIONODO_CONFIG = window.BIONODO_CONFIG;
const registroForm = document.getElementById("registroForm");
const messageDiv = document.getElementById("message");

const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const emailInput = document.getElementById("email");
const telefonoInput = document.getElementById("telefono");
const edadInput = document.getElementById("edad");
const passwordInput = document.getElementById("password");

const successModal = document.getElementById("successModal");
const countdownSpan = document.getElementById("countdown");
const goLoginBtn = document.getElementById("goLoginBtn");

const nombreError = document.getElementById("nombreError");
const apellidoError = document.getElementById("apellidoError");
const emailError = document.getElementById("emailError");
const telefonoError = document.getElementById("telefonoError");
const edadError = document.getElementById("edadError");
const passwordError = document.getElementById("passwordError");

const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const phoneRegex = /^[0-9]+$/;

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

  const edad = parseInt(value);

  if (isNaN(edad)) {
    setError(edadInput, edadError, "La edad debe ser numérica");
    return false;
  }

  if (edad < 1 || edad > 120) {
    setError(edadInput, edadError, "La edad debe estar entre 1 y 120 años");
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

nombreInput.addEventListener("input", validarNombre);
apellidoInput.addEventListener("input", validarApellido);
emailInput.addEventListener("input", validarEmail);
telefonoInput.addEventListener("input", validarTelefono);
edadInput.addEventListener("input", validarEdad);
passwordInput.addEventListener("input", validarPassword);

goLoginBtn.addEventListener("click", () => {
  BIONODO_CONFIG.navigate("login");
});

registroForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  messageDiv.textContent = "";
  messageDiv.className = "message";

  const esNombreValido = validarNombre();
  const esApellidoValido = validarApellido();
  const esEmailValido = validarEmail();
  const esTelefonoValido = validarTelefono();
  const esEdadValida = validarEdad();
  const esPasswordValida = validarPassword();

  if (!esNombreValido || !esApellidoValido || !esEmailValido || !esTelefonoValido || !esEdadValida || !esPasswordValida) {
    mostrarErrorGeneral("Por favor corrige los campos marcados");
    return;
  }

  try {
    const response = await fetch(`${BIONODO_CONFIG.api.users}/api/proyecto/usuario/save`, {
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
        edad: parseInt(edadInput.value.trim())
      })
    });

    const data = await response.text();

    if (response.ok) {
      mostrarModalExito();
      registroForm.reset();

      [
        [nombreInput, nombreError],
        [apellidoInput, apellidoError],
        [emailInput, emailError],
        [telefonoInput, telefonoError],
        [edadInput, edadError],
        [passwordInput, passwordError]
      ].forEach(([input, error]) => clearState(input, error));

      messageDiv.textContent = "";
    } else {
      mostrarErrorGeneral(data);
    }
  } catch (error) {
    mostrarErrorGeneral("No se pudo conectar con el servidor");
    console.error("Error de conexión:", error);
  }
});

function mostrarErrorGeneral(mensaje) {
  messageDiv.textContent = mensaje;
  messageDiv.classList.add("error");
}

function mostrarModalExito() {
  successModal.classList.remove("hidden");

  let segundos = 3;
  countdownSpan.textContent = segundos;

  const interval = setInterval(() => {
    segundos--;
    countdownSpan.textContent = segundos;

    if (segundos <= 0) {
      clearInterval(interval);
      BIONODO_CONFIG.navigate("login");
    }
  }, 1000);
}
