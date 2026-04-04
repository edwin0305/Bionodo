const BIONODO_CONFIG = window.BIONODO_CONFIG;

const plantasContainer = document.getElementById("plantasContainer");
const messageDiv = document.getElementById("message");
const totalPlantas = document.getElementById("totalPlantas");

const searchNombreCientificoInput = document.getElementById("searchNombreCientifico");
const btnBuscar = document.getElementById("btnBuscar");
const btnRecargar = document.getElementById("btnRecargar");

const plantaForm = document.getElementById("plantaForm");
const editingBanner = document.getElementById("editingBanner");
const btnGuardarPlanta = document.getElementById("btnGuardarPlanta");
const btnActualizarPlanta = document.getElementById("btnActualizarPlanta");
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");

const nombreCientificoInput = document.getElementById("nombreCientifico");
const nombreComunInput = document.getElementById("nombreComun");
const morfologiaInput = document.getElementById("morfologia");
const origenInput = document.getElementById("origen");
const tipoDeReproduccionInput = document.getElementById("tipoDeReproduccion");
const biodiversidadInput = document.getElementById("biodiversidad");
const beneficiosAmbientalesInput = document.getElementById("beneficiosAmbientales");
const recomendacionesDeCuidadoInput = document.getElementById("recomendacionesDeCuidado");
const imagenesInput = document.getElementById("imagenes");

const previewContainer = document.getElementById("previewContainer");

const nombreCientificoError = document.getElementById("nombreCientificoError");
const nombreComunError = document.getElementById("nombreComunError");
const morfologiaError = document.getElementById("morfologiaError");
const origenError = document.getElementById("origenError");
const tipoDeReproduccionError = document.getElementById("tipoDeReproduccionError");
const biodiversidadError = document.getElementById("biodiversidadError");
const beneficiosAmbientalesError = document.getElementById("beneficiosAmbientalesError");
const recomendacionesDeCuidadoError = document.getElementById("recomendacionesDeCuidadoError");
const imagenesError = document.getElementById("imagenesError");

const detailModal = document.getElementById("detailModal");
const detailContent = document.getElementById("detailContent");
const detailImages = document.getElementById("detailImages");
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

const BACKEND_BASE_URL = BIONODO_CONFIG.api.catalogo;
const SAVE_PLANTA_URL = `${BACKEND_BASE_URL}/api/proyecto/planta/saveimg`;
const UPDATE_PLANTA_URL = `${BACKEND_BASE_URL}/api/proyecto/planta/update`;
const LIST_PLANTAS_URL = `${BACKEND_BASE_URL}/api/proyecto/planta/listar`;
const SEARCH_PLANTA_BASE_URL = `${BACKEND_BASE_URL}/api/proyecto/planta/buscar/`;
const DELETE_PLANTA_BASE_URL = `${BACKEND_BASE_URL}/api/proyecto/planta/eliminar/`;

let plantas = [];
let selectedNombreToDelete = null;
let imagenesSeleccionadas = [];
let plantaEnEdicion = null;

const camposTexto = [
  [nombreCientificoInput, nombreCientificoError, "El nombre cientifico es obligatorio"],
  [nombreComunInput, nombreComunError, "El nombre comun es obligatorio"],
  [morfologiaInput, morfologiaError, "La morfologia es obligatoria"],
  [origenInput, origenError, "El origen es obligatorio"],
  [tipoDeReproduccionInput, tipoDeReproduccionError, "El tipo de reproduccion es obligatorio"],
  [biodiversidadInput, biodiversidadError, "La biodiversidad es obligatoria"],
  [beneficiosAmbientalesInput, beneficiosAmbientalesError, "Los beneficios ambientales son obligatorios"],
  [recomendacionesDeCuidadoInput, recomendacionesDeCuidadoError, "Las recomendaciones de cuidado son obligatorias"]
];

document.addEventListener("DOMContentLoaded", () => {
  validarAccesoAdmin();
  configurarAcordeones();
  actualizarEstadoEdicion();
  cargarPlantas();
});

btnBuscar.addEventListener("click", buscarPlantaPorNombre);
btnRecargar.addEventListener("click", () => {
  searchNombreCientificoInput.value = "";
  cargarPlantas();
});

closeDetailBtn.addEventListener("click", () => {
  detailModal.classList.add("hidden");
});

cancelDeleteBtn.addEventListener("click", () => {
  selectedNombreToDelete = null;
  deleteModal.classList.add("hidden");
});

confirmDeleteBtn.addEventListener("click", async () => {
  if (!selectedNombreToDelete) {
    return;
  }

  await eliminarPlanta(selectedNombreToDelete);
});

closeSuccessBtn.addEventListener("click", () => {
  successModal.classList.add("hidden");
});

closeImageViewerBtn.addEventListener("click", () => {
  cerrarVisorImagen();
});

imageViewerModal.addEventListener("click", (event) => {
  if (event.target === imageViewerModal) {
    cerrarVisorImagen();
  }
});

imagenesInput.addEventListener("change", manejarSeleccionImagenes);
btnActualizarPlanta.addEventListener("click", actualizarPlanta);
btnCancelarEdicion.addEventListener("click", () => cancelarEdicion());

plantaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  limpiarMensaje();

  if (!validarFormulario()) {
    mostrarError("Por favor corrige los campos marcados.");
    return;
  }

  if (plantaEnEdicion) {
    await actualizarPlanta();
    return;
  }

  await guardarPlanta();
});

function validarAccesoAdmin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userType = localStorage.getItem("userType");

  if (isLoggedIn !== "true" || userType !== "admin") {
    BIONODO_CONFIG.navigate("login");
  }
}

async function cargarPlantas() {
  limpiarMensaje();
  plantasContainer.innerHTML = `<div class="empty-state">Cargando plantas...</div>`;

  try {
    const response = await fetch(LIST_PLANTAS_URL);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("No se pudieron obtener las plantas.");
    }

    if (Array.isArray(data)) {
      plantas = data;
    } else if (Array.isArray(data.plantas)) {
      plantas = data.plantas;
    } else if (Array.isArray(data.data)) {
      plantas = data.data;
    } else {
      plantas = [];
    }

    actualizarContador(plantas.length);
    renderPlantas(plantas);
  } catch (error) {
    console.error("Error cargando plantas:", error);
    mostrarError("No se pudieron cargar las plantas.");
    plantasContainer.innerHTML = `<div class="empty-state">Error al cargar plantas.</div>`;
  }
}

async function buscarPlantaPorNombre() {
  limpiarMensaje();

  const nombre = searchNombreCientificoInput.value.trim();

  if (!nombre) {
    mostrarError("Ingresa un nombre cientifico para realizar la busqueda.");
    return;
  }

  try {
    const response = await fetch(`${SEARCH_PLANTA_BASE_URL}${encodeURIComponent(nombre)}`);

    if (!response.ok) {
      throw new Error("No se pudo realizar la busqueda.");
    }

    const planta = await response.json();

    if (!planta || !planta.nombreCientifico) {
      plantasContainer.innerHTML = `<div class="empty-state">No se encontro una planta con ese nombre cientifico.</div>`;
      actualizarContador(0);
      return;
    }

    renderPlantas([planta]);
    actualizarContador(1);
  } catch (error) {
    console.error("Error buscando planta:", error);
    plantasContainer.innerHTML = `<div class="empty-state">No se encontro una planta con ese nombre cientifico.</div>`;
    actualizarContador(0);
  }
}

async function guardarPlanta() {
  try {
    const formData = new FormData();
    const payload = obtenerPayloadFormulario();

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    imagenesSeleccionadas.forEach((file) => {
      formData.append("imagenes", file);
    });

    const response = await fetch(SAVE_PLANTA_URL, {
      method: "POST",
      body: formData
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "No se pudo guardar la planta.");
    }

    cancelarEdicion();
    mostrarExitoModal(data || "Planta guardada correctamente.");
    await cargarPlantas();
  } catch (error) {
    console.error("Error guardando planta:", error);
    mostrarError(error.message || "No se pudo guardar la planta.");
  }
}

async function actualizarPlanta() {
  if (!plantaEnEdicion) {
    return;
  }

  limpiarMensaje();

  if (!validarFormulario()) {
    mostrarError("Por favor corrige los campos marcados.");
    return;
  }

  const payload = {
    id: plantaEnEdicion.id,
    ...obtenerPayloadFormulario(),
    fotos: Array.isArray(plantaEnEdicion.fotos) ? plantaEnEdicion.fotos : []
  };

  try {
    const response = await fetch(UPDATE_PLANTA_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "No se pudo actualizar la planta.");
    }

    cancelarEdicion();
    mostrarExitoModal(data || "Planta actualizada correctamente.");
    searchNombreCientificoInput.value = "";
    await cargarPlantas();
  } catch (error) {
    console.error("Error actualizando planta:", error);
    mostrarError(error.message || "No se pudo actualizar la planta.");
  }
}

function renderPlantas(lista) {
  plantasContainer.innerHTML = "";

  if (!lista.length) {
    plantasContainer.innerHTML = `<div class="empty-state">No hay plantas registradas.</div>`;
    return;
  }

  lista.forEach((planta) => {
    const card = document.createElement("article");
    card.className = "planta-card";

    const imagenPrincipal = Array.isArray(planta.fotos) && planta.fotos.length > 0
      ? `${BACKEND_BASE_URL}${planta.fotos[0]}`
      : "";

    card.innerHTML = `
      ${imagenPrincipal ? `<img src="${escapeHtml(imagenPrincipal)}" alt="Imagen de ${escapeHtml(planta.nombreComun || planta.nombreCientifico)}">` : ""}
      <h3>${escapeHtml(planta.nombreComun || "Sin nombre comun")}</h3>
      <div class="planta-info">
        <p><strong>Nombre cientifico:</strong> ${escapeHtml(planta.nombreCientifico)}</p>
        <p><strong>Origen:</strong> ${escapeHtml(planta.origen)}</p>
        <p><strong>Reproduccion:</strong> ${escapeHtml(planta.tipoDeReproduccion)}</p>
      </div>
      <div class="planta-actions">
        <button class="btn-primary" data-action="ver" data-nombre="${escapeHtml(planta.nombreCientifico)}">Ver</button>
        <button class="btn-secondary" data-action="editar" data-nombre="${escapeHtml(planta.nombreCientifico)}">Editar</button>
        <button class="btn-danger" data-action="eliminar" data-nombre="${escapeHtml(planta.nombreCientifico)}">Eliminar</button>
      </div>
    `;

    plantasContainer.appendChild(card);
  });

  asignarEventosTarjetas(lista);
}

function asignarEventosTarjetas(listaActual) {
  const buttons = document.querySelectorAll(".planta-actions button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const nombre = button.dataset.nombre;
      const planta = listaActual.find((item) => item.nombreCientifico === nombre);

      if (!planta) {
        return;
      }

      if (action === "ver") {
        mostrarDetalle(planta);
      }

      if (action === "editar") {
        cargarPlantaEnFormulario(planta);
      }

      if (action === "eliminar") {
        abrirConfirmacionEliminar(planta);
      }
    });
  });
}

function cargarPlantaEnFormulario(planta) {
  plantaEnEdicion = {
    ...planta,
    fotos: Array.isArray(planta.fotos) ? [...planta.fotos] : []
  };

  nombreCientificoInput.value = planta.nombreCientifico || "";
  nombreComunInput.value = planta.nombreComun || "";
  morfologiaInput.value = planta.morfologia || "";
  origenInput.value = planta.origen || "";
  tipoDeReproduccionInput.value = planta.tipoDeReproduccion || "";
  biodiversidadInput.value = planta.biodiversidad || "";
  beneficiosAmbientalesInput.value = planta.beneficiosAmbientales || "";
  recomendacionesDeCuidadoInput.value = planta.recomendacionesDeCuidado || "";

  imagenesSeleccionadas = [];
  previewContainer.innerHTML = "";
  imagenesInput.value = "";

  limpiarEstadosFormulario();
  actualizarEstadoEdicion();
  abrirSeccionAgregar();
  plantaForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelarEdicion() {
  plantaEnEdicion = null;
  plantaForm.reset();
  imagenesSeleccionadas = [];
  previewContainer.innerHTML = "";
  limpiarEstadosFormulario();
  actualizarEstadoEdicion();
}

function actualizarEstadoEdicion() {
  const estaEditando = Boolean(plantaEnEdicion);

  editingBanner.classList.toggle("show", estaEditando);
  btnGuardarPlanta.classList.toggle("hidden", estaEditando);
  btnActualizarPlanta.classList.toggle("hidden", !estaEditando);
  btnCancelarEdicion.classList.toggle("hidden", !estaEditando);

  nombreCientificoInput.readOnly = estaEditando;
  imagenesInput.disabled = estaEditando;

  if (estaEditando) {
    imagenesError.textContent = "En modo edicion no se pueden cambiar las imagenes.";
  } else {
    imagenesError.textContent = "";
  }
}

function mostrarDetalle(planta) {
  detailContent.innerHTML = `
    <div class="detalle-layout">
      <div class="detalle-texto">
        <p><strong>Nombre cientifico:</strong> ${escapeHtml(planta.nombreCientifico)}</p>
        <p><strong>Nombre comun:</strong> ${escapeHtml(planta.nombreComun)}</p>
        <p><strong>Morfologia:</strong> ${escapeHtml(planta.morfologia)}</p>
        <p><strong>Origen:</strong> ${escapeHtml(planta.origen)}</p>
        <p><strong>Tipo de reproduccion:</strong> ${escapeHtml(planta.tipoDeReproduccion)}</p>
        <p><strong>Biodiversidad:</strong> ${escapeHtml(planta.biodiversidad)}</p>
        <p><strong>Beneficios ambientales:</strong> ${escapeHtml(planta.beneficiosAmbientales)}</p>
        <p><strong>Recomendaciones de cuidado:</strong> ${escapeHtml(planta.recomendacionesDeCuidado)}</p>
      </div>

      <div class="detalle-imagenes" id="detalleImagenes"></div>
    </div>
  `;

  detailImages.innerHTML = "";

  const contenedorImagenes = document.getElementById("detalleImagenes");
  contenedorImagenes.innerHTML = "";

  if (Array.isArray(planta.fotos)) {
    planta.fotos.forEach((foto) => {
      const img = document.createElement("img");
      img.src = `${BACKEND_BASE_URL}${foto}`;
      img.alt = planta.nombreComun || planta.nombreCientifico;
      img.classList.add("clickable-image");
      img.addEventListener("click", () => abrirVisorImagen(`${BACKEND_BASE_URL}${foto}`));
      contenedorImagenes.appendChild(img);
    });
  }

  detailModal.classList.remove("hidden");
}

function abrirVisorImagen(src) {
  imageViewerImg.src = src;
  imageViewerModal.classList.remove("hidden");
}

function cerrarVisorImagen() {
  imageViewerImg.src = "";
  imageViewerModal.classList.add("hidden");
}

function abrirConfirmacionEliminar(planta) {
  selectedNombreToDelete = planta.nombreCientifico;
  deleteText.textContent = `Deseas eliminar la planta ${planta.nombreComun || planta.nombreCientifico}?`;
  deleteModal.classList.remove("hidden");
}

async function eliminarPlanta(nombreCientifico) {
  limpiarMensaje();

  try {
    const response = await fetch(`${DELETE_PLANTA_BASE_URL}${encodeURIComponent(nombreCientifico)}`, {
      method: "DELETE"
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "No se pudo eliminar la planta.");
    }

    deleteModal.classList.add("hidden");
    selectedNombreToDelete = null;

    if (plantaEnEdicion?.nombreCientifico === nombreCientifico) {
      cancelarEdicion();
    }

    mostrarExitoModal(data || "Planta eliminada exitosamente.");
    searchNombreCientificoInput.value = "";
    await cargarPlantas();
  } catch (error) {
    console.error("Error eliminando planta:", error);
    deleteModal.classList.add("hidden");
    mostrarError(error.message || "No se pudo eliminar la planta.");
  }
}

function manejarSeleccionImagenes() {
  if (plantaEnEdicion) {
    imagenesInput.value = "";
    return;
  }

  const files = Array.from(imagenesInput.files);

  if (!files.length) {
    return;
  }

  files.forEach((file) => {
    const yaExiste = imagenesSeleccionadas.some((img) =>
      img.name === file.name &&
      img.size === file.size &&
      img.lastModified === file.lastModified
    );

    if (!yaExiste) {
      imagenesSeleccionadas.push(file);
    }
  });

  renderPreviewImagenes();
  imagenesInput.value = "";
}

function renderPreviewImagenes() {
  previewContainer.innerHTML = "";

  if (!imagenesSeleccionadas.length) {
    return;
  }

  imagenesSeleccionadas.forEach((file, index) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const div = document.createElement("div");
      div.className = "preview-item";
      div.innerHTML = `
        <div class="preview-wrapper">
          <img src="${event.target.result}" alt="${escapeHtml(file.name)}">
          <button type="button" class="remove-preview-btn" data-index="${index}">x</button>
        </div>
      `;
      previewContainer.appendChild(div);
      asignarEventosEliminarPreview();
    };

    reader.readAsDataURL(file);
  });
}

function asignarEventosEliminarPreview() {
  const botones = document.querySelectorAll(".remove-preview-btn");

  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index, 10);
      imagenesSeleccionadas.splice(index, 1);
      renderPreviewImagenes();
    });
  });
}

function validarFormulario() {
  return camposTexto.every(([input, errorElement, mensaje]) =>
    validarTexto(input, errorElement, mensaje)
  );
}

function obtenerPayloadFormulario() {
  return {
    nombreCientifico: nombreCientificoInput.value.trim(),
    nombreComun: nombreComunInput.value.trim(),
    morfologia: morfologiaInput.value.trim(),
    origen: origenInput.value.trim(),
    tipoDeReproduccion: tipoDeReproduccionInput.value.trim(),
    biodiversidad: biodiversidadInput.value.trim(),
    beneficiosAmbientales: beneficiosAmbientalesInput.value.trim(),
    recomendacionesDeCuidado: recomendacionesDeCuidadoInput.value.trim()
  };
}

function actualizarContador(total) {
  totalPlantas.textContent = `${total} planta${total === 1 ? "" : "s"}`;
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

function validarTexto(input, errorElement, mensaje) {
  const value = input.value.trim();

  if (!value) {
    input.classList.add("input-error");
    input.classList.remove("input-success");
    errorElement.textContent = mensaje;
    return false;
  }

  input.classList.remove("input-error");
  input.classList.add("input-success");
  errorElement.textContent = "";
  return true;
}

function clearState(input, errorElement) {
  input.classList.remove("input-error", "input-success");
  errorElement.textContent = "";
}

function limpiarEstadosFormulario() {
  camposTexto.forEach(([input, error]) => clearState(input, error));

  if (!plantaEnEdicion) {
    imagenesError.textContent = "";
  }
}

function configurarAcordeones() {
  const toggles = document.querySelectorAll(".accordion-toggle");

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.dataset.target;
      const target = document.getElementById(targetId);
      const debeMostrar = !target.classList.contains("show");

      setAccordionState(toggle, target, debeMostrar);
    });
  });
}

function abrirSeccionAgregar() {
  const toggle = document.querySelector('.accordion-toggle[data-target="agregarSection"]');
  const target = document.getElementById("agregarSection");

  if (!toggle || !target) {
    return;
  }

  setAccordionState(toggle, target, true);
}

function setAccordionState(toggle, target, isOpen) {
  const icon = toggle.querySelector(".accordion-icon");
  target.classList.toggle("show", isOpen);

  if (icon) {
    icon.textContent = isOpen ? "-" : "+";
  }
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
