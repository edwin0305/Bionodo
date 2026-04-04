const BIONODO_CONFIG = window.BIONODO_CONFIG;
const insigniasContainer = document.getElementById("insigniasContainer");
const messageDiv = document.getElementById("message");
const totalInsignias = document.getElementById("totalInsignias");

const searchIdInput = document.getElementById("searchId");
const searchCodigoInput = document.getElementById("searchCodigo");
const btnBuscarId = document.getElementById("btnBuscarId");
const btnBuscarCodigo = document.getElementById("btnBuscarCodigo");
const btnRecargar = document.getElementById("btnRecargar");

const codigoInsigniaInput = document.getElementById("codigoInsignia");
const nombreInsigniaInput = document.getElementById("nombreInsignia");
const descripcionInsigniaInput = document.getElementById("descripcionInsignia");
const imagenInsigniaInput = document.getElementById("imagenInsignia");
const previewContainer = document.getElementById("previewContainer");
const editingBanner = document.getElementById("editingBanner");

const codigoInsigniaError = document.getElementById("codigoInsigniaError");
const nombreInsigniaError = document.getElementById("nombreInsigniaError");
const descripcionInsigniaError = document.getElementById("descripcionInsigniaError");
const imagenInsigniaError = document.getElementById("imagenInsigniaError");

const btnGuardarInsignia = document.getElementById("btnGuardarInsignia");
const btnActualizarInsignia = document.getElementById("btnActualizarInsignia");
const btnLimpiarFormulario = document.getElementById("btnLimpiarFormulario");

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

const imageViewerModal = document.getElementById("imageViewerModal");
const imageViewerImg = document.getElementById("imageViewerImg");
const closeImageViewerBtn = document.getElementById("closeImageViewerBtn");

let insignias = [];
let selectedIdToDelete = null;
let currentEditingId = null;
let imagenSeleccionada = null;
let imagenUrlActual = null;

const BACKEND_BASE_URL = BIONODO_CONFIG.api.catalogo;
const API_BASE = `${BIONODO_CONFIG.api.catalogo}/api/proyecto/insignia`;
const LIST_INSIGNIAS_URL = `${API_BASE}/listar`;
const SAVE_IMG_URL = `${API_BASE}/saveimg`;
const UPDATE_URL = `${API_BASE}/update`;

document.addEventListener("DOMContentLoaded", () => {
  validarAccesoAdmin();
  configurarAcordeones();
  cargarInsignias();
  actualizarEstadoEdicion();
});

btnBuscarId.addEventListener("click", buscarInsigniaPorId);
btnBuscarCodigo.addEventListener("click", buscarInsigniaPorCodigo);
btnRecargar.addEventListener("click", () => {
  searchIdInput.value = "";
  searchCodigoInput.value = "";
  cargarInsignias();
});

btnGuardarInsignia.addEventListener("click", guardarInsignia);
btnActualizarInsignia.addEventListener("click", actualizarInsignia);
btnLimpiarFormulario.addEventListener("click", limpiarFormulario);

imagenInsigniaInput.addEventListener("change", manejarImagenSeleccionada);

closeDetailBtn.addEventListener("click", () => {
  detailModal.classList.add("hidden");
});

cancelDeleteBtn.addEventListener("click", () => {
  selectedIdToDelete = null;
  deleteModal.classList.add("hidden");
});

confirmDeleteBtn.addEventListener("click", async () => {
  if (selectedIdToDelete === null) return;
  await eliminarInsignia(selectedIdToDelete);
});

closeSuccessBtn.addEventListener("click", () => {
  successModal.classList.add("hidden");
});

closeImageViewerBtn.addEventListener("click", () => {
  cerrarVisorImagen();
});

imageViewerModal.addEventListener("click", (e) => {
  if (e.target === imageViewerModal) cerrarVisorImagen();
});

codigoInsigniaInput.addEventListener("input", validarCodigoInsignia);
nombreInsigniaInput.addEventListener("input", validarNombreInsignia);
descripcionInsigniaInput.addEventListener("input", validarDescripcionInsignia);

function validarAccesoAdmin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userType = localStorage.getItem("userType");

  if (isLoggedIn !== "true" || userType !== "admin") {
    BIONODO_CONFIG.navigate("login");
  }
}

async function cargarInsignias() {
  limpiarMensaje();
  insigniasContainer.innerHTML = `<div class="empty-state">Cargando insignias...</div>`;

  try {
    const response = await fetch(LIST_INSIGNIAS_URL);
    const data = await response.json();

    console.log("Respuesta listar insignias:", data);

    if (!response.ok) {
      throw new Error("No se pudieron obtener las insignias");
    }

    if (Array.isArray(data)) {
      insignias = data;
    } else if (Array.isArray(data.insignias)) {
      insignias = data.insignias;
    } else if (Array.isArray(data.data)) {
      insignias = data.data;
    } else {
      insignias = [];
    }

    actualizarContador(insignias.length);
    renderInsignias(insignias);

  } catch (error) {
    console.error("Error cargando insignias:", error);
    mostrarError("No se pudieron cargar las insignias");
    insigniasContainer.innerHTML = `<div class="empty-state">Error al cargar insignias</div>`;
  }
}

async function buscarInsigniaPorId() {
  limpiarMensaje();

  const id = searchIdInput.value.trim();

  if (!id) {
    mostrarError("Ingresa un ID para realizar la búsqueda");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/buscar/${encodeURIComponent(id)}`);

    if (!response.ok) {
      throw new Error("No se encontró la insignia");
    }

    const insignia = await response.json();

    if (!insignia || insignia.id === undefined || insignia.id === null) {
      insigniasContainer.innerHTML = `<div class="empty-state">No se encontró una insignia con ese ID</div>`;
      actualizarContador(0);
      return;
    }

    renderInsignias([insignia]);
    actualizarContador(1);

  } catch (error) {
    console.error("Error buscando insignia por ID:", error);
    insigniasContainer.innerHTML = `<div class="empty-state">No se encontró una insignia con ese ID</div>`;
    actualizarContador(0);
  }
}

async function buscarInsigniaPorCodigo() {
  limpiarMensaje();

  const codigo = searchCodigoInput.value.trim();

  if (!codigo) {
    mostrarError("Ingresa un código para realizar la búsqueda");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/buscar-codigo/${encodeURIComponent(codigo)}`);

    if (!response.ok) {
      throw new Error("No se encontró la insignia");
    }

    const insignia = await response.json();

    if (!insignia) {
      insigniasContainer.innerHTML = `<div class="empty-state">No se encontró una insignia con ese código</div>`;
      actualizarContador(0);
      return;
    }

    renderInsignias([insignia]);
    actualizarContador(1);

  } catch (error) {
    console.error("Error buscando insignia por código:", error);
    insigniasContainer.innerHTML = `<div class="empty-state">No se encontró una insignia con ese código</div>`;
    actualizarContador(0);
  }
}

async function guardarInsignia() {
  limpiarMensaje();

  const esValido =
    validarCodigoInsignia() &&
    validarNombreInsignia() &&
    validarDescripcionInsignia() &&
    validarImagenInsignia();

  if (!esValido) {
    mostrarError("Por favor corrige los campos marcados");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("codigoInsignia", codigoInsigniaInput.value.trim());
    formData.append("nombreInsignia", nombreInsigniaInput.value.trim());
    formData.append("descripcion", descripcionInsigniaInput.value.trim());
    formData.append("imagen", imagenSeleccionada);

    const response = await fetch(SAVE_IMG_URL, {
      method: "POST",
      body: formData
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "No se pudo guardar la insignia");
    }

    mostrarExitoModal(data || "Insignia guardada correctamente");
    limpiarFormulario();
    await cargarInsignias();

  } catch (error) {
    console.error("Error guardando insignia:", error);
    mostrarError(error.message || "No se pudo guardar la insignia");
  }
}

async function actualizarInsignia() {
  limpiarMensaje();

  if (currentEditingId === null) {
    mostrarError("Debes cargar una insignia existente para actualizarla");
    return;
  }

  const esValido =
    validarCodigoInsignia() &&
    validarNombreInsignia() &&
    validarDescripcionInsignia();

  if (!esValido) {
    mostrarError("Por favor corrige los campos marcados");
    return;
  }

  try {
    const insignia = {
      id: currentEditingId,
      codigoInsignia: codigoInsigniaInput.value.trim(),
      nombre: nombreInsigniaInput.value.trim(),
      descripcion: descripcionInsigniaInput.value.trim(),
      imagenUrl: imagenUrlActual
    };

    const response = await fetch(UPDATE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(insignia)
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "No se pudo actualizar la insignia");
    }

    mostrarExitoModal(data || "Insignia actualizada correctamente");
    limpiarFormulario();
    await cargarInsignias();

  } catch (error) {
    console.error("Error actualizando insignia:", error);
    mostrarError(error.message || "No se pudo actualizar la insignia");
  }
}

function renderInsignias(lista) {
  insigniasContainer.innerHTML = "";

  if (!lista.length) {
    insigniasContainer.innerHTML = `<div class="empty-state">No hay insignias registradas</div>`;
    return;
  }

  lista.forEach((insignia) => {
    const card = document.createElement("article");
    card.className = "insignia-card";

    const imagen = insignia.imagenUrl ? `${BACKEND_BASE_URL}${insignia.imagenUrl}` : "";

    card.innerHTML = `
      ${imagen ? `<img src="${escapeHtml(imagen)}" alt="Imagen de ${escapeHtml(insignia.nombre)}" data-image="${escapeHtml(imagen)}">` : ""}
      <h3>${escapeHtml(insignia.nombre || "Sin nombre")}</h3>
      <div class="insignia-info">
        <p><strong>ID:</strong> ${escapeHtml(String(insignia.id ?? ""))}</p>
        <p><strong>Código:</strong> ${escapeHtml(insignia.codigoInsignia || "")}</p>
        <p><strong>Descripción:</strong> ${escapeHtml(insignia.descripcion || "")}</p>
      </div>
      <div class="insignia-actions">
        <button class="btn-primary" data-action="ver" data-id="${escapeHtml(String(insignia.id))}">Ver</button>
        <button class="btn-secondary" data-action="editar" data-id="${escapeHtml(String(insignia.id))}">Editar</button>
        <button class="btn-danger" data-action="eliminar" data-id="${escapeHtml(String(insignia.id))}">Eliminar</button>
      </div>
    `;

    insigniasContainer.appendChild(card);
  });

  asignarEventosTarjetas(lista);
  asignarEventosImagenesTarjetas();
}

function asignarEventosTarjetas(listaActual) {
  const buttons = document.querySelectorAll(".insignia-actions button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const id = button.dataset.id;
      const insignia = listaActual.find((i) => String(i.id) === String(id));

      if (!insignia) return;

      if (action === "ver") {
        mostrarDetalle(insignia);
      }

      if (action === "editar") {
        cargarInsigniaEnFormulario(insignia);
        mostrarExitoModal("Insignia cargada en el formulario para edición");
      }

      if (action === "eliminar") {
        abrirConfirmacionEliminar(insignia);
      }
    });
  });
}

function asignarEventosImagenesTarjetas() {
  const imagenes = document.querySelectorAll(".insignia-card img");

  imagenes.forEach((img) => {
    img.addEventListener("click", () => {
      abrirVisorImagen(img.dataset.image);
    });
  });
}

function mostrarDetalle(insignia) {
  const imagen = insignia.imagenUrl ? `${BACKEND_BASE_URL}${insignia.imagenUrl}` : "";

  detailContent.innerHTML = `
    <div class="detail-texto">
      <p><strong>ID:</strong> ${escapeHtml(String(insignia.id ?? ""))}</p>
      <p><strong>Código:</strong> ${escapeHtml(insignia.codigoInsignia || "")}</p>
      <p><strong>Nombre:</strong> ${escapeHtml(insignia.nombre || "")}</p>
      <p><strong>Descripción:</strong> ${escapeHtml(insignia.descripcion || "")}</p>
      <p><strong>Imagen URL:</strong> ${escapeHtml(insignia.imagenUrl || "")}</p>
    </div>
    <div class="detail-imagen">
      ${imagen ? `<img src="${escapeHtml(imagen)}" alt="Imagen de ${escapeHtml(insignia.nombre)}" id="detailImage">` : ""}
    </div>
  `;

  const detailImage = document.getElementById("detailImage");
  if (detailImage) {
    detailImage.addEventListener("click", () => abrirVisorImagen(imagen));
  }

  detailModal.classList.remove("hidden");
}

function cargarInsigniaEnFormulario(insignia) {
  currentEditingId = insignia.id ?? null;
  codigoInsigniaInput.value = insignia.codigoInsignia ?? "";
  nombreInsigniaInput.value = insignia.nombre ?? "";
  descripcionInsigniaInput.value = insignia.descripcion ?? "";
  imagenSeleccionada = null;
  imagenUrlActual = insignia.imagenUrl ?? null;
  imagenInsigniaInput.value = "";
  limpiarEstadosFormulario();
  renderPreviewActual();
  actualizarEstadoEdicion();

  const guardarSection = document.getElementById("guardarSection");
  const acordeon = document.querySelector('[data-target="guardarSection"] .accordion-icon');

  if (!guardarSection.classList.contains("show")) {
    guardarSection.classList.add("show");
    if (acordeon) acordeon.textContent = "−";
  }

  guardarSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function abrirConfirmacionEliminar(insignia) {
  selectedIdToDelete = insignia.id;
  deleteText.textContent = `¿Deseas eliminar la insignia con ID ${insignia.id}?`;
  deleteModal.classList.remove("hidden");
}

async function eliminarInsignia(id) {
  limpiarMensaje();

  try {
    const response = await fetch(`${API_BASE}/eliminar/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "No se pudo eliminar la insignia");
    }

    deleteModal.classList.add("hidden");
    selectedIdToDelete = null;

    mostrarExitoModal(data || "Insignia eliminada exitosamente");
    await cargarInsignias();

  } catch (error) {
    console.error("Error eliminando insignia:", error);
    deleteModal.classList.add("hidden");
    mostrarError(error.message || "No se pudo eliminar la insignia");
  }
}

function manejarImagenSeleccionada() {
  const file = imagenInsigniaInput.files[0];
  if (!file) return;

  imagenSeleccionada = file;
  imagenUrlActual = null;
  renderPreviewSeleccionada(file);
  imagenInsigniaInput.value = "";
}

function renderPreviewSeleccionada(file) {
  previewContainer.innerHTML = "";

  const reader = new FileReader();
  reader.onload = (e) => {
    const div = document.createElement("div");
    div.className = "preview-item";
    div.innerHTML = `
      <div class="preview-wrapper">
        <img src="${e.target.result}" alt="${escapeHtml(file.name)}">
        <button type="button" class="remove-preview-btn" id="removePreviewBtn">×</button>
      </div>
    `;
    previewContainer.appendChild(div);

    document.getElementById("removePreviewBtn").addEventListener("click", () => {
      imagenSeleccionada = null;
      previewContainer.innerHTML = "";
    });
  };
  reader.readAsDataURL(file);
}

function renderPreviewActual() {
  previewContainer.innerHTML = "";

  if (!imagenUrlActual) return;

  const url = `${BACKEND_BASE_URL}${imagenUrlActual}`;
  const div = document.createElement("div");
  div.className = "preview-item";
  div.innerHTML = `
    <div class="preview-wrapper">
      <img src="${escapeHtml(url)}" alt="Imagen actual de la insignia">
    </div>
  `;
  previewContainer.appendChild(div);
}

function abrirVisorImagen(src) {
  imageViewerImg.src = src;
  imageViewerModal.classList.remove("hidden");
}

function cerrarVisorImagen() {
  imageViewerImg.src = "";
  imageViewerModal.classList.add("hidden");
}

function actualizarContador(total) {
  totalInsignias.textContent = `${total} insignia${total === 1 ? "" : "s"}`;
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

function validarCodigoInsignia() {
  const value = codigoInsigniaInput.value.trim();

  if (!value) {
    setError(codigoInsigniaInput, codigoInsigniaError, "El código de la insignia es obligatorio");
    return false;
  }

  setSuccess(codigoInsigniaInput, codigoInsigniaError);
  return true;
}

function validarNombreInsignia() {
  const value = nombreInsigniaInput.value.trim();

  if (!value) {
    setError(nombreInsigniaInput, nombreInsigniaError, "El nombre es obligatorio");
    return false;
  }

  setSuccess(nombreInsigniaInput, nombreInsigniaError);
  return true;
}

function validarDescripcionInsignia() {
  const value = descripcionInsigniaInput.value.trim();

  if (!value) {
    setError(descripcionInsigniaInput, descripcionInsigniaError, "La descripción es obligatoria");
    return false;
  }

  setSuccess(descripcionInsigniaInput, descripcionInsigniaError);
  return true;
}

function validarImagenInsignia() {
  if (!imagenSeleccionada) {
    imagenInsigniaError.textContent = "La imagen es obligatoria";
    return false;
  }

  imagenInsigniaError.textContent = "";
  return true;
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
    [codigoInsigniaInput, codigoInsigniaError],
    [nombreInsigniaInput, nombreInsigniaError],
    [descripcionInsigniaInput, descripcionInsigniaError]
  ].forEach(([input, error]) => clearState(input, error));

  imagenInsigniaError.textContent = "";
}

function limpiarFormulario() {
  currentEditingId = null;
  codigoInsigniaInput.value = "";
  nombreInsigniaInput.value = "";
  descripcionInsigniaInput.value = "";
  imagenInsigniaInput.value = "";
  imagenSeleccionada = null;
  imagenUrlActual = null;
  previewContainer.innerHTML = "";
  limpiarEstadosFormulario();
  actualizarEstadoEdicion();
}

function actualizarEstadoEdicion() {
  if (currentEditingId === null) {
    editingBanner.style.display = "none";
  } else {
    editingBanner.style.display = "block";
    editingBanner.textContent = `Modo edición activado · ID ${currentEditingId}`;
  }
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
