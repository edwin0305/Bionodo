const BIONODO_CONFIG = window.BIONODO_CONFIG;
const nodosContainer = document.getElementById("nodosContainer");
const messageDiv = document.getElementById("message");
const totalNodos = document.getElementById("totalNodos");

const searchIdInput = document.getElementById("searchId");
const searchCodigoInput = document.getElementById("searchCodigo");
const btnBuscarId = document.getElementById("btnBuscarId");
const btnBuscarCodigo = document.getElementById("btnBuscarCodigo");
const btnRecargar = document.getElementById("btnRecargar");

const codigoNodoInput = document.getElementById("codigoNodo");
const nombreNodoInput = document.getElementById("nombreNodo");
const posicionXInput = document.getElementById("posicionX");
const posicionYInput = document.getElementById("posicionY");
const videoUrlInput = document.getElementById("videoUrl");
const nombreCientificoPlantaInput = document.getElementById("nombreCientificoPlanta");
const editingBanner = document.getElementById("editingBanner");
const adminMapViewport = document.getElementById("adminMapViewport");
const adminMapStage = document.getElementById("adminMapStage");
const adminMapLayer = document.getElementById("adminMapLayer");
const selectedMapPoint = document.getElementById("selectedMapPoint");
const btnAdminZoomIn = document.getElementById("btnAdminZoomIn");
const btnAdminZoomOut = document.getElementById("btnAdminZoomOut");
const btnAdminZoomReset = document.getElementById("btnAdminZoomReset");
const adminZoomLevel = document.getElementById("adminZoomLevel");

const codigoNodoError = document.getElementById("codigoNodoError");
const nombreNodoError = document.getElementById("nombreNodoError");
const posicionXError = document.getElementById("posicionXError");
const posicionYError = document.getElementById("posicionYError");
const videoUrlError = document.getElementById("videoUrlError");
const nombreCientificoPlantaError = document.getElementById("nombreCientificoPlantaError");

const btnGuardarNodo = document.getElementById("btnGuardarNodo");
const btnActualizarNodo = document.getElementById("btnActualizarNodo");
const btnLimpiarFormulario = document.getElementById("btnLimpiarFormulario");

const detailModal = document.getElementById("detailModal");
const detailContent = document.getElementById("detailContent");
const closeDetailBtn = document.getElementById("closeDetailBtn");

const qrModal = document.getElementById("qrModal");
const qrNodeBadge = document.getElementById("qrNodeBadge");
const qrNodeText = document.getElementById("qrNodeText");
const qrImage = document.getElementById("qrImage");
const qrFallback = document.getElementById("qrFallback");
const qrUrlField = document.getElementById("qrUrlField");
const qrHelperNote = document.getElementById("qrHelperNote");
const btnAbrirQrUrl = document.getElementById("btnAbrirQrUrl");
const btnCopiarQrUrl = document.getElementById("btnCopiarQrUrl");
const btnDescargarQr = document.getElementById("btnDescargarQr");
const btnCerrarQrModal = document.getElementById("btnCerrarQrModal");

const deleteModal = document.getElementById("deleteModal");
const deleteText = document.getElementById("deleteText");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

const successModal = document.getElementById("successModal");
const successText = document.getElementById("successText");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");

let nodos = [];
let selectedIdToDelete = null;
let currentEditingId = null;
let adminMapScale = 1;
let adminMapTranslateX = 0;
let adminMapTranslateY = 0;
let isAdminMapDragging = false;
let adminDragMoved = false;
let adminDragStartX = 0;
let adminDragStartY = 0;
let adminDragOriginX = 0;
let adminDragOriginY = 0;
let adminMapPointerDown = false;
let adminMapPointerId = null;
let qrNodoActual = null;

const API_BASE = `${BIONODO_CONFIG.api.catalogo}/api/proyecto/nodomapa`;
const LIST_NODOS_URL = `${API_BASE}/listar`;
const SAVE_NODO_URL = `${API_BASE}/save`;
const UPDATE_NODO_URL = `${API_BASE}/update`;

document.addEventListener("DOMContentLoaded", () => {
  validarAccesoAdmin();
  configurarAcordeones();
  configurarMapaAdmin();
  cargarNodos();
  actualizarEstadoEdicion();
});

btnBuscarId.addEventListener("click", buscarNodoPorId);
btnBuscarCodigo.addEventListener("click", buscarNodoPorCodigo);
btnRecargar.addEventListener("click", () => {
  searchIdInput.value = "";
  searchCodigoInput.value = "";
  cargarNodos();
});

btnGuardarNodo.addEventListener("click", guardarNodo);
btnActualizarNodo.addEventListener("click", actualizarNodo);
btnLimpiarFormulario.addEventListener("click", limpiarFormulario);

closeDetailBtn.addEventListener("click", () => {
  detailModal.classList.add("hidden");
});

btnCerrarQrModal.addEventListener("click", cerrarModalQr);
btnAbrirQrUrl.addEventListener("click", abrirEnlaceQrActual);
btnCopiarQrUrl.addEventListener("click", copiarEnlaceQrActual);
btnDescargarQr.addEventListener("click", descargarQrActual);
qrModal.addEventListener("click", (event) => {
  if (event.target === qrModal) {
    cerrarModalQr();
  }
});

cancelDeleteBtn.addEventListener("click", () => {
  selectedIdToDelete = null;
  deleteModal.classList.add("hidden");
});

confirmDeleteBtn.addEventListener("click", async () => {
  if (selectedIdToDelete === null) return;
  await eliminarNodo(selectedIdToDelete);
});

closeSuccessBtn.addEventListener("click", () => {
  successModal.classList.add("hidden");
});

codigoNodoInput.addEventListener("input", validarCodigoNodo);
nombreNodoInput.addEventListener("input", validarNombreNodo);
posicionXInput.addEventListener("input", validarPosicionX);
posicionYInput.addEventListener("input", validarPosicionY);
videoUrlInput.addEventListener("input", validarVideoUrl);
nombreCientificoPlantaInput.addEventListener("input", validarNombreCientificoPlanta);
posicionXInput.addEventListener("input", renderMapaAdmin);
posicionYInput.addEventListener("input", renderMapaAdmin);

function validarAccesoAdmin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userType = localStorage.getItem("userType");

  if (isLoggedIn !== "true" || userType !== "admin") {
    BIONODO_CONFIG.navigate("login");
  }
}

async function cargarNodos() {
  limpiarMensaje();
  nodosContainer.innerHTML = `<div class="empty-state">Cargando nodos...</div>`;

  try {
    const response = await fetch(LIST_NODOS_URL);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("No se pudieron obtener los nodos");
    }

    if (Array.isArray(data)) {
      nodos = data;
    } else if (Array.isArray(data.nodos)) {
      nodos = data.nodos;
    } else if (Array.isArray(data.data)) {
      nodos = data.data;
    } else {
      nodos = [];
    }

    actualizarContador(nodos.length);
    renderNodos(nodos);
    renderMapaAdmin();

  } catch (error) {
    console.error("Error cargando nodos:", error);
    mostrarError("No se pudieron cargar los nodos");
    nodosContainer.innerHTML = `<div class="empty-state">Error al cargar nodos</div>`;
  }
}

async function buscarNodoPorId() {
  limpiarMensaje();

  const id = searchIdInput.value.trim();

  if (!id) {
    mostrarError("Ingresa un ID para realizar la busqueda");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/buscar/${encodeURIComponent(id)}`);

    if (!response.ok) {
      throw new Error("No se encontro el nodo");
    }

    const nodo = await response.json();

    if (!nodo || nodo.id === undefined || nodo.id === null) {
      nodosContainer.innerHTML = `<div class="empty-state">No se encontro un nodo con ese ID</div>`;
      actualizarContador(0);
      return;
    }

    renderNodos([nodo]);
    actualizarContador(1);

  } catch (error) {
    console.error("Error buscando nodo por ID:", error);
    nodosContainer.innerHTML = `<div class="empty-state">No se encontro un nodo con ese ID</div>`;
    actualizarContador(0);
  }
}

async function buscarNodoPorCodigo() {
  limpiarMensaje();

  const codigo = searchCodigoInput.value.trim();

  if (!codigo) {
    mostrarError("Ingresa un codigo para realizar la busqueda");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/buscar-codigo/${encodeURIComponent(codigo)}`);

    if (!response.ok) {
      throw new Error("No se encontro el nodo");
    }

    const nodo = await response.json();

    if (!nodo) {
      nodosContainer.innerHTML = `<div class="empty-state">No se encontro un nodo con ese codigo</div>`;
      actualizarContador(0);
      return;
    }

    renderNodos([nodo]);
    actualizarContador(1);

  } catch (error) {
    console.error("Error buscando nodo por codigo:", error);
    nodosContainer.innerHTML = `<div class="empty-state">No se encontro un nodo con ese codigo</div>`;
    actualizarContador(0);
  }
}

async function guardarNodo() {
  limpiarMensaje();

  const esValido =
    validarCodigoNodo() &&
    validarNombreNodo() &&
    validarPosicionX() &&
    validarPosicionY() &&
    validarVideoUrl() &&
    validarNombreCientificoPlanta();

  if (!esValido) {
    mostrarError("Por favor corrige los campos marcados");
    return;
  }

  try {
    const nodo = construirNodoDesdeFormulario(false);

    const response = await fetch(SAVE_NODO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nodo)
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "No se pudo guardar el nodo");
    }

    mostrarExitoModal(data || "Nodo guardado correctamente");
    limpiarFormulario();
    await cargarNodos();

  } catch (error) {
    console.error("Error guardando nodo:", error);
    mostrarError(error.message || "No se pudo guardar el nodo");
  }
}

async function actualizarNodo() {
  limpiarMensaje();

  if (currentEditingId === null) {
    mostrarError("Debes cargar un nodo existente para actualizarlo");
    return;
  }

  const esValido =
    validarCodigoNodo() &&
    validarNombreNodo() &&
    validarPosicionX() &&
    validarPosicionY() &&
    validarVideoUrl() &&
    validarNombreCientificoPlanta();

  if (!esValido) {
    mostrarError("Por favor corrige los campos marcados");
    return;
  }

  try {
    const nodo = construirNodoDesdeFormulario(true);

    const response = await fetch(UPDATE_NODO_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nodo)
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "No se pudo actualizar el nodo");
    }

    mostrarExitoModal(data || "Nodo actualizado correctamente");
    limpiarFormulario();
    await cargarNodos();

  } catch (error) {
    console.error("Error actualizando nodo:", error);
    mostrarError(error.message || "No se pudo actualizar el nodo");
  }
}

function construirNodoDesdeFormulario(incluirId) {
  const nodo = {
    codigoNodo: codigoNodoInput.value.trim(),
    nombreNodo: nombreNodoInput.value.trim(),
    posicionX: redondearCoordenada(parseFloat(posicionXInput.value)),
    posicionY: redondearCoordenada(parseFloat(posicionYInput.value)),
    videoUrl: videoUrlInput.value.trim(),
    nombreCientificoPlanta: nombreCientificoPlantaInput.value.trim()
  };

  if (incluirId) {
    nodo.id = currentEditingId;
  }

  return nodo;
}

function renderNodos(lista) {
  nodosContainer.innerHTML = "";

  if (!lista.length) {
    nodosContainer.innerHTML = `<div class="empty-state">No hay nodos registrados</div>`;
    return;
  }

  lista.forEach((nodo) => {
    const card = document.createElement("article");
    card.className = "nodo-card";

    card.innerHTML = `
      <h3>${escapeHtml(nodo.codigoNodo || "Sin codigo")}</h3>
      <div class="nodo-info">
        <p><strong>ID:</strong> ${escapeHtml(String(nodo.id ?? ""))}</p>
        <p><strong>Nombre:</strong> ${escapeHtml(nodo.nombreNodo || "")}</p>
        <p><strong>Posicion X:</strong> ${escapeHtml(String(nodo.posicionX ?? ""))}</p>
        <p><strong>Posicion Y:</strong> ${escapeHtml(String(nodo.posicionY ?? ""))}</p>
        <p><strong>Video:</strong> ${escapeHtml(nodo.videoUrl || "")}</p>
        <p><strong>Planta asociada:</strong> ${escapeHtml(nodo.nombreCientificoPlanta || "")}</p>
      </div>
      <div class="nodo-actions">
        <button class="btn-primary" data-action="ver" data-id="${escapeHtml(String(nodo.id))}">Ver</button>
        <button class="btn-secondary" data-action="qr" data-id="${escapeHtml(String(nodo.id))}">QR</button>
        <button class="btn-secondary" data-action="editar" data-id="${escapeHtml(String(nodo.id))}">Editar</button>
        <button class="btn-danger" data-action="eliminar" data-id="${escapeHtml(String(nodo.id))}">Eliminar</button>
      </div>
    `;

    nodosContainer.appendChild(card);
  });

  asignarEventosTarjetas(lista);
}

function asignarEventosTarjetas(listaActual) {
  const buttons = document.querySelectorAll(".nodo-actions button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const id = button.dataset.id;
      const nodo = listaActual.find((n) => String(n.id) === String(id));

      if (!nodo) return;

      if (action === "ver") {
        mostrarDetalle(nodo);
      }

      if (action === "qr") {
        mostrarQrNodo(nodo);
      }

      if (action === "editar") {
        cargarNodoEnFormulario(nodo);
        mostrarExitoModal("Nodo cargado en el formulario para edicion");
      }

      if (action === "eliminar") {
        abrirConfirmacionEliminar(nodo);
      }
    });
  });
}

function mostrarDetalle(nodo) {
  detailContent.innerHTML = `
    <div class="detail-item"><strong>ID:</strong> ${escapeHtml(String(nodo.id ?? ""))}</div>
    <div class="detail-item"><strong>Codigo del nodo:</strong> ${escapeHtml(nodo.codigoNodo || "")}</div>
    <div class="detail-item"><strong>Nombre del nodo:</strong> ${escapeHtml(nodo.nombreNodo || "")}</div>
    <div class="detail-item"><strong>Posicion X:</strong> ${escapeHtml(String(nodo.posicionX ?? ""))}</div>
    <div class="detail-item"><strong>Posicion Y:</strong> ${escapeHtml(String(nodo.posicionY ?? ""))}</div>
    <div class="detail-item"><strong>URL del video:</strong> ${escapeHtml(nodo.videoUrl || "")}</div>
    <div class="detail-item"><strong>Nombre cientifico de la planta:</strong> ${escapeHtml(nodo.nombreCientificoPlanta || "")}</div>
  `;

  detailModal.classList.remove("hidden");
}

function mostrarQrNodo(nodo) {
  qrNodoActual = nodo;

  const urlPublica = BIONODO_CONFIG.nodePublicUrl(nodo.codigoNodo);
  const qrUrl = construirImagenQr(urlPublica);

  qrNodeBadge.textContent = nodo.codigoNodo || "Nodo";
  qrNodeText.textContent = `${nodo.nombreNodo || "Nodo del campus"} · ${nodo.nombreCientificoPlanta || "Sin planta asociada"}`;
  qrUrlField.value = urlPublica;
  qrImage.src = qrUrl;
  qrImage.classList.remove("hidden");
  qrFallback.textContent = "Si la vista no carga, aun puedes copiar el enlace o abrirlo.";

  qrImage.onload = () => {
    qrFallback.textContent = "";
  };

  qrImage.onerror = () => {
    qrImage.classList.add("hidden");
    qrFallback.textContent = "No se pudo cargar la imagen del QR. Usa el enlace mientras revisamos la vista previa.";
  };

  qrHelperNote.className = "qr-helper-note";
  qrHelperNote.textContent = construirNotaPrueba(urlPublica);

  if (usaHostSoloLocal(urlPublica)) {
    qrHelperNote.classList.add("warning");
  }

  qrModal.classList.remove("hidden");
}

function cerrarModalQr() {
  qrModal.classList.add("hidden");
}

function construirImagenQr(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=16&data=${encodeURIComponent(url)}`;
}

function construirNotaPrueba(url) {
  const parsed = intentarParsearUrl(url);
  if (!parsed) {
    return "El enlace del QR ya quedo generado. Puedes abrirlo aqui mismo para validar que te lleva al nodo correcto.";
  }

  if (parsed.protocol === "file:") {
    return "Estas abriendo el front como archivo local. Para probar QR en celular necesitas servir el proyecto por HTTP y luego usar esa URL en el QR.";
  }

  if (usaHostSoloLocal(url)) {
    return "Esta URL usa localhost o 127.0.0.1. Funciona en este equipo, pero no desde tu celular. Para probar en movil, cambia frontBaseUrl y las APIs en runtime-config.js a la IP local de tu PC o usa un tunel publico.";
  }

  return "Este enlace ya puede probarse desde otro dispositivo que tenga acceso a la misma red o al dominio configurado.";
}

function usaHostSoloLocal(url) {
  const parsed = intentarParsearUrl(url);
  if (!parsed) return false;
  return parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
}

function intentarParsearUrl(url) {
  try {
    return new URL(url);
  } catch (error) {
    return null;
  }
}

function abrirEnlaceQrActual() {
  if (!qrNodoActual?.codigoNodo) return;
  window.open(BIONODO_CONFIG.nodePublicUrl(qrNodoActual.codigoNodo), "_blank", "noopener");
}

async function copiarEnlaceQrActual() {
  if (!qrNodoActual?.codigoNodo) return;

  const url = BIONODO_CONFIG.nodePublicUrl(qrNodoActual.codigoNodo);

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      mostrarExitoModal("Enlace del nodo copiado al portapapeles");
      return;
    }
  } catch (error) {
    console.warn("No se pudo copiar con clipboard API:", error);
  }

  qrUrlField.focus();
  qrUrlField.select();
  const copiado = document.execCommand("copy");
  if (copiado) {
    mostrarExitoModal("Enlace del nodo copiado al portapapeles");
  } else {
    mostrarError("No se pudo copiar automaticamente. Puedes copiar la URL manualmente.");
  }
}

async function descargarQrActual() {
  if (!qrNodoActual?.codigoNodo) return;

  const urlNodo = BIONODO_CONFIG.nodePublicUrl(qrNodoActual.codigoNodo);
  const qrUrl = construirImagenQr(urlNodo);
  const nombreArchivo = `${qrNodoActual.codigoNodo || "nodo"}-qr.png`;

  try {
    const response = await fetch(qrUrl);
    if (!response.ok) {
      throw new Error("No se pudo obtener la imagen del QR");
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.warn("No se pudo descargar el QR directamente:", error);
    window.open(qrUrl, "_blank", "noopener");
    mostrarError("No se pudo descargar automaticamente. Se abrio la imagen del QR en otra pestaña.");
  }
}

function cargarNodoEnFormulario(nodo) {
  currentEditingId = nodo.id ?? null;
  codigoNodoInput.value = nodo.codigoNodo ?? "";
  nombreNodoInput.value = nodo.nombreNodo ?? "";
  posicionXInput.value = nodo.posicionX ?? "";
  posicionYInput.value = nodo.posicionY ?? "";
  videoUrlInput.value = nodo.videoUrl ?? "";
  nombreCientificoPlantaInput.value = nodo.nombreCientificoPlanta ?? "";

  limpiarEstadosFormulario();
  actualizarEstadoEdicion();
  renderMapaAdmin();

  const guardarSection = document.getElementById("guardarSection");
  const acordeon = document.querySelector('[data-target="guardarSection"] .accordion-icon');

  if (!guardarSection.classList.contains("show")) {
    guardarSection.classList.add("show");
    if (acordeon) acordeon.textContent = "-";
  }

  guardarSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function actualizarEstadoEdicion() {
  if (currentEditingId === null) {
    editingBanner.style.display = "none";
  } else {
    editingBanner.style.display = "block";
    editingBanner.textContent = `Modo edicion activado | ID ${currentEditingId}`;
  }

  actualizarResumenPunto();
}

function abrirConfirmacionEliminar(nodo) {
  selectedIdToDelete = nodo.id;
  deleteText.textContent = `¿Deseas eliminar el nodo con ID ${nodo.id}?`;
  deleteModal.classList.remove("hidden");
}

async function eliminarNodo(id) {
  limpiarMensaje();

  try {
    const response = await fetch(`${API_BASE}/eliminar/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "No se pudo eliminar el nodo");
    }

    deleteModal.classList.add("hidden");
    selectedIdToDelete = null;

    mostrarExitoModal(data || "Nodo eliminado correctamente");
    await cargarNodos();

  } catch (error) {
    console.error("Error eliminando nodo:", error);
    deleteModal.classList.add("hidden");
    mostrarError(error.message || "No se pudo eliminar el nodo");
  }
}

function actualizarContador(total) {
  totalNodos.textContent = `${total} nodo${total === 1 ? "" : "s"}`;
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

function validarCodigoNodo() {
  const value = codigoNodoInput.value.trim();

  if (!value) {
    setError(codigoNodoInput, codigoNodoError, "El codigo del nodo es obligatorio");
    return false;
  }

  setSuccess(codigoNodoInput, codigoNodoError);
  return true;
}

function validarNombreNodo() {
  const value = nombreNodoInput.value.trim();

  if (!value) {
    setError(nombreNodoInput, nombreNodoError, "El nombre del nodo es obligatorio");
    return false;
  }

  setSuccess(nombreNodoInput, nombreNodoError);
  return true;
}

function validarPosicionX() {
  const value = posicionXInput.value.trim();

  if (!value) {
    setError(posicionXInput, posicionXError, "La posicion X es obligatoria");
    return false;
  }

  if (isNaN(parseFloat(value))) {
    setError(posicionXInput, posicionXError, "La posicion X debe ser numerica");
    return false;
  }

  if (parseFloat(value) < 0 || parseFloat(value) > 100) {
    setError(posicionXInput, posicionXError, "La posicion X debe estar entre 0 y 100");
    return false;
  }

  setSuccess(posicionXInput, posicionXError);
  return true;
}

function validarPosicionY() {
  const value = posicionYInput.value.trim();

  if (!value) {
    setError(posicionYInput, posicionYError, "La posicion Y es obligatoria");
    return false;
  }

  if (isNaN(parseFloat(value))) {
    setError(posicionYInput, posicionYError, "La posicion Y debe ser numerica");
    return false;
  }

  if (parseFloat(value) < 0 || parseFloat(value) > 100) {
    setError(posicionYInput, posicionYError, "La posicion Y debe estar entre 0 y 100");
    return false;
  }

  setSuccess(posicionYInput, posicionYError);
  return true;
}

function validarVideoUrl() {
  const value = videoUrlInput.value.trim();

  if (!value) {
    setError(videoUrlInput, videoUrlError, "La URL del video es obligatoria");
    return false;
  }

  setSuccess(videoUrlInput, videoUrlError);
  return true;
}

function validarNombreCientificoPlanta() {
  const value = nombreCientificoPlantaInput.value.trim();

  if (!value) {
    setError(nombreCientificoPlantaInput, nombreCientificoPlantaError, "El nombre cientifico de la planta es obligatorio");
    return false;
  }

  setSuccess(nombreCientificoPlantaInput, nombreCientificoPlantaError);
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
    [codigoNodoInput, codigoNodoError],
    [nombreNodoInput, nombreNodoError],
    [posicionXInput, posicionXError],
    [posicionYInput, posicionYError],
    [videoUrlInput, videoUrlError],
    [nombreCientificoPlantaInput, nombreCientificoPlantaError]
  ].forEach(([input, error]) => clearState(input, error));
}

function limpiarFormulario() {
  currentEditingId = null;
  codigoNodoInput.value = "";
  nombreNodoInput.value = "";
  posicionXInput.value = "";
  posicionYInput.value = "";
  videoUrlInput.value = "";
  nombreCientificoPlantaInput.value = "";
  limpiarEstadosFormulario();
  actualizarEstadoEdicion();
  renderMapaAdmin();
}

function configurarMapaAdmin() {
  btnAdminZoomIn.addEventListener("click", () => ajustarZoomAdmin(0.25));
  btnAdminZoomOut.addEventListener("click", () => ajustarZoomAdmin(-0.25));
  btnAdminZoomReset.addEventListener("click", resetearVistaMapaAdmin);
  adminMapViewport.addEventListener("wheel", manejarRuedaZoomAdmin, { passive: false });
  adminMapViewport.addEventListener("contextmenu", (event) => event.preventDefault());
  adminMapViewport.addEventListener("pointerdown", iniciarArrastreMapaAdmin);
  adminMapViewport.addEventListener("click", manejarClickMapaAdmin);
  window.addEventListener("pointermove", moverMapaAdmin);
  window.addEventListener("pointerup", terminarArrastreMapaAdmin);
  window.addEventListener("resize", () => {
    limitarTraslacionMapaAdmin();
    aplicarTransformacionMapaAdmin();
  });

  aplicarTransformacionMapaAdmin();
}

function manejarClickMapaAdmin(event) {
  if (adminDragMoved) {
    adminDragMoved = false;
    return;
  }

  const rect = adminMapLayer.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }

  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  posicionXInput.value = redondearCoordenada(Math.min(Math.max(x, 0), 100));
  posicionYInput.value = redondearCoordenada(Math.min(Math.max(y, 0), 100));

  validarPosicionX();
  validarPosicionY();
  actualizarResumenPunto();
  renderMapaAdmin();
}

function ajustarZoomAdmin(delta) {
  const siguiente = Math.min(Math.max(adminMapScale + delta, 1), 3.5);
  if (siguiente === adminMapScale) return;

  adminMapScale = Number(siguiente.toFixed(2));
  limitarTraslacionMapaAdmin();
  aplicarTransformacionMapaAdmin();
}

function resetearVistaMapaAdmin() {
  adminMapScale = 1;
  adminMapTranslateX = 0;
  adminMapTranslateY = 0;
  aplicarTransformacionMapaAdmin();
}

function aplicarTransformacionMapaAdmin() {
  adminMapStage.style.transform = `translate(${adminMapTranslateX}px, ${adminMapTranslateY}px) scale(${adminMapScale})`;
  adminMapStage.classList.toggle("is-draggable", adminMapScale > 1);
  adminMapStage.classList.toggle("is-dragging", isAdminMapDragging);
  adminZoomLevel.textContent = `${Math.round(adminMapScale * 100)}%`;
}

function manejarRuedaZoomAdmin(event) {
  event.preventDefault();
  ajustarZoomAdmin(event.deltaY < 0 ? 0.2 : -0.2);
}

function iniciarArrastreMapaAdmin(event) {
  const esGestoDeArrastre = event.button === 2 || event.button === 1;
  if (!esGestoDeArrastre) return;
  if (event.target.closest(".admin-map-marker, .admin-map-preview")) return;
  if (adminMapScale <= 1) return;
  adminMapPointerDown = true;
  adminMapPointerId = event.pointerId;
  adminDragMoved = false;
  adminDragStartX = event.clientX;
  adminDragStartY = event.clientY;
  adminDragOriginX = adminMapTranslateX;
  adminDragOriginY = adminMapTranslateY;
}

function moverMapaAdmin(event) {
  if (!adminMapPointerDown) return;

  const deltaX = event.clientX - adminDragStartX;
  const deltaY = event.clientY - adminDragStartY;

  if (!isAdminMapDragging) {
    adminDragMoved = Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4;
    if (!adminDragMoved) return;
    isAdminMapDragging = true;
    adminMapViewport.setPointerCapture?.(adminMapPointerId);
  }

  adminMapTranslateX = adminDragOriginX + deltaX;
  adminMapTranslateY = adminDragOriginY + deltaY;
  limitarTraslacionMapaAdmin();
  aplicarTransformacionMapaAdmin();
}

function terminarArrastreMapaAdmin() {
  if (adminMapPointerId !== null && adminMapViewport.hasPointerCapture?.(adminMapPointerId)) {
    adminMapViewport.releasePointerCapture(adminMapPointerId);
  }

  adminMapPointerDown = false;
  adminMapPointerId = null;

  if (!isAdminMapDragging) return;
  isAdminMapDragging = false;
  aplicarTransformacionMapaAdmin();
}

function limitarTraslacionMapaAdmin() {
  const maxX = ((adminMapViewport.clientWidth || 0) * (adminMapScale - 1)) / 2;
  const maxY = ((adminMapViewport.clientHeight || 0) * (adminMapScale - 1)) / 2;

  adminMapTranslateX = Math.min(Math.max(adminMapTranslateX, -maxX), maxX);
  adminMapTranslateY = Math.min(Math.max(adminMapTranslateY, -maxY), maxY);
}

function renderMapaAdmin() {
  adminMapLayer.innerHTML = "";

  nodos.forEach((nodo) => {
    if (!coordenadasValidas(nodo.posicionX, nodo.posicionY)) {
      return;
    }

    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "admin-map-marker";
    marker.style.left = `${normalizarCoordenada(nodo.posicionX)}%`;
    marker.style.top = `${normalizarCoordenada(nodo.posicionY)}%`;
    marker.title = nodo.nombreNodo || nodo.codigoNodo || "Nodo";

    if (currentEditingId !== null && Number(nodo.id) === Number(currentEditingId)) {
      marker.classList.add("active");
    }

    marker.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });

    marker.addEventListener("click", (event) => {
      event.stopPropagation();
      cargarNodoEnFormulario(nodo);
    });

    adminMapLayer.appendChild(marker);
  });

  if (coordenadasValidas(posicionXInput.value, posicionYInput.value)) {
    const preview = document.createElement("div");
    preview.className = "admin-map-preview";
    preview.style.left = `${normalizarCoordenada(posicionXInput.value)}%`;
    preview.style.top = `${normalizarCoordenada(posicionYInput.value)}%`;
    adminMapLayer.appendChild(preview);
  }
}

function actualizarResumenPunto() {
  if (!coordenadasValidas(posicionXInput.value, posicionYInput.value)) {
    selectedMapPoint.textContent = "Sin punto seleccionado";
    return;
  }

  selectedMapPoint.textContent =
    `X ${redondearCoordenada(posicionXInput.value)} | Y ${redondearCoordenada(posicionYInput.value)}`;
}

function coordenadasValidas(x, y) {
  const posX = Number(x);
  const posY = Number(y);
  return Number.isFinite(posX) && Number.isFinite(posY) && posX >= 0 && posX <= 100 && posY >= 0 && posY <= 100;
}

function normalizarCoordenada(valor) {
  return Math.min(Math.max(Number(valor), 0), 100);
}

function redondearCoordenada(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return "";
  }

  return Math.round(numero * 100) / 100;
}

function configurarAcordeones() {
  const toggles = document.querySelectorAll(".accordion-toggle");

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.dataset.target;
      const target = document.getElementById(targetId);
      const icon = toggle.querySelector(".accordion-icon");

      target.classList.toggle("show");
      icon.textContent = target.classList.contains("show") ? "-" : "+";
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



