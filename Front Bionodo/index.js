const BIONODO_CONFIG = window.BIONODO_CONFIG;

const messageDiv = document.getElementById("message");
const mapStatus = document.getElementById("mapStatus");
const nodeCountBadge = document.getElementById("nodeCountBadge");
const mapViewport = document.getElementById("mapViewport");
const mapStage = document.getElementById("mapStage");
const mapLayer = document.getElementById("mapLayer");
const emptyState = document.getElementById("emptyState");
const nodeDetail = document.getElementById("nodeDetail");
const detailCode = document.getElementById("detailCode");
const detailName = document.getElementById("detailName");
const detailPlantName = document.getElementById("detailPlantName");
const detailMedia = document.getElementById("detailMedia");
const detailDescription = document.getElementById("detailDescription");
const detailOrigen = document.getElementById("detailOrigen");
const detailMorfologia = document.getElementById("detailMorfologia");
const detailBiodiversidad = document.getElementById("detailBiodiversidad");
const detailReproduccion = document.getElementById("detailReproduccion");
const btnNodePrimary = document.getElementById("btnNodePrimary");
const btnNodeSecondary = document.getElementById("btnNodeSecondary");

const btnLoginHeader = document.getElementById("btnLoginHeader");
const btnRegistroHeader = document.getElementById("btnRegistroHeader");
const btnExplorarMapa = document.getElementById("btnExplorarMapa");
const btnExplorarPlantas = document.getElementById("btnExplorarPlantas");
const btnLoginHero = document.getElementById("btnLoginHero");
const btnLoginMap = document.getElementById("btnLoginMap");
const btnLocateMe = document.getElementById("btnLocateMe");
const btnRecenter = document.getElementById("btnRecenter");
const btnZoomIn = document.getElementById("btnZoomIn");
const btnZoomOut = document.getElementById("btnZoomOut");
const btnZoomReset = document.getElementById("btnZoomReset");
const zoomLevelBadge = document.getElementById("zoomLevelBadge");
const referenceBadge = document.getElementById("referenceBadge");
const nearestNodeBadge = document.getElementById("nearestNodeBadge");

const previewModal = document.getElementById("previewModal");
const closePreviewModal = document.getElementById("closePreviewModal");
const previewLeadMedia = document.getElementById("previewLeadMedia");
const previewMediaRail = document.getElementById("previewMediaRail");
const previewCode = document.getElementById("previewCode");
const previewName = document.getElementById("previewName");
const previewPlant = document.getElementById("previewPlant");
const previewDescription = document.getElementById("previewDescription");
const previewOrigen = document.getElementById("previewOrigen");
const previewMorfologia = document.getElementById("previewMorfologia");
const previewBiodiversidad = document.getElementById("previewBiodiversidad");
const previewReproduccion = document.getElementById("previewReproduccion");
const btnPreviewPrimary = document.getElementById("btnPreviewPrimary");
const btnPreviewSecondary = document.getElementById("btnPreviewSecondary");
const plantasContainer = document.getElementById("plantasContainer");
const plantsStatus = document.getElementById("plantsStatus");
const plantCountBadge = document.getElementById("plantCountBadge");
const plantSearchInput = document.getElementById("plantSearchInput");

const NODOS_API = `${BIONODO_CONFIG.api.catalogo}/api/proyecto/nodomapa`;
const PLANTAS_API = `${BIONODO_CONFIG.api.catalogo}/api/proyecto/planta`;
const PROGRESS_API = `${BIONODO_CONFIG.api.progress}/api/proyecto/progreso`;

let nodos = [];
let plantas = [];
let nodosDesbloqueados = new Set();
let activeNodeCode = null;
let selectedNode = null;
let selectedPlant = null;
let mapScale = 1;
let mapTranslateX = 0;
let mapTranslateY = 0;
let isDraggingMap = false;
let dragStartX = 0;
let dragStartY = 0;
let dragOriginX = 0;
let dragOriginY = 0;
let mapPointerDown = false;
let mapPointerId = null;
let mapDragMoved = false;
let isReferencePicking = false;
let referencePoint = null;
let referenceNodeCode = null;

document.addEventListener("DOMContentLoaded", async () => {
  configurarAccionesGlobales();
  await Promise.all([cargarMapaPublico(), cargarPlantasPublicas(), cargarNodosDesbloqueados()]);
});

function configurarAccionesGlobales() {
  actualizarAccionesSegunSesion();
  actualizarBotonReferencia();
  btnExplorarMapa.addEventListener("click", () => {
    document.getElementById("mapa-campus").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  btnExplorarPlantas.addEventListener("click", () => {
    document.getElementById("plantas-registradas").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  btnLocateMe.addEventListener("click", activarModoReferencia);
  btnRecenter.addEventListener("click", () => {
    document.getElementById("mapa-campus").scrollIntoView({ behavior: "smooth", block: "start" });
    resetearVistaMapa();
  });
  btnZoomIn.addEventListener("click", () => ajustarZoom(0.25));
  btnZoomOut.addEventListener("click", () => ajustarZoom(-0.25));
  btnZoomReset.addEventListener("click", resetearVistaMapa);
  mapViewport.addEventListener("wheel", manejarRuedaZoom, { passive: false });
  mapViewport.addEventListener("contextmenu", (event) => event.preventDefault());
  mapViewport.addEventListener("pointerdown", iniciarArrastreMapa);
  mapViewport.addEventListener("click", manejarClickMapa);
  window.addEventListener("pointermove", moverMapa);
  window.addEventListener("pointerup", terminarArrastreMapa);
  window.addEventListener("resize", () => {
    limitarTraslacionMapa();
    aplicarTransformacionMapa();
  });
  aplicarTransformacionMapa();
  btnNodePrimary.addEventListener("click", () => {
    if (!selectedNode) return;

    if (usuarioLogueado()) {
      const dashboardRoute = BIONODO_CONFIG.getDashboardRoute();
      if (dashboardRoute) {
        BIONODO_CONFIG.navigate(dashboardRoute);
        return;
      }
    }

    navegarLogin(selectedNode.codigoNodo);
  });
  btnNodeSecondary.addEventListener("click", abrirVistaPrevia);
  btnPreviewPrimary.addEventListener("click", () => {
    if (!selectedNode) return;
    if (usuarioLogueado()) {
      BIONODO_CONFIG.navigate("nodo", { codigoNodo: selectedNode.codigoNodo });
      return;
    }
    navegarLogin(selectedNode.codigoNodo);
  });
  btnPreviewSecondary.addEventListener("click", cerrarVistaPrevia);
  closePreviewModal.addEventListener("click", cerrarVistaPrevia);
  previewModal.addEventListener("click", (event) => {
    if (event.target === previewModal) cerrarVistaPrevia();
  });
  plantSearchInput.addEventListener("input", filtrarPlantasPublicas);
}

function ajustarZoom(delta) {
  const siguiente = Math.min(Math.max(mapScale + delta, 1), 3.5);
  if (siguiente === mapScale) return;

  mapScale = Number(siguiente.toFixed(2));
  limitarTraslacionMapa();
  aplicarTransformacionMapa();
}

function resetearVistaMapa() {
  mapScale = 1;
  mapTranslateX = 0;
  mapTranslateY = 0;
  aplicarTransformacionMapa();
}

function aplicarTransformacionMapa() {
  mapStage.style.transform = `translate(${mapTranslateX}px, ${mapTranslateY}px) scale(${mapScale})`;
  mapStage.classList.toggle("is-draggable", mapScale > 1);
  mapStage.classList.toggle("is-dragging", isDraggingMap);
  zoomLevelBadge.textContent = `${Math.round(mapScale * 100)}%`;
}

function manejarRuedaZoom(event) {
  event.preventDefault();
  ajustarZoom(event.deltaY < 0 ? 0.2 : -0.2);
}

function iniciarArrastreMapa(event) {
  if (event.button !== 0) return;
  if (event.target.closest(".map-node")) return;
  if (mapScale <= 1) return;
  mapPointerDown = true;
  mapPointerId = event.pointerId;
  mapDragMoved = false;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragOriginX = mapTranslateX;
  dragOriginY = mapTranslateY;
}

function moverMapa(event) {
  if (!mapPointerDown) return;

  const deltaX = event.clientX - dragStartX;
  const deltaY = event.clientY - dragStartY;

  if (!isDraggingMap) {
    const superoUmbral = Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4;
    if (!superoUmbral) return;
    mapDragMoved = true;
    isDraggingMap = true;
    mapViewport.setPointerCapture?.(mapPointerId);
  }

  mapTranslateX = dragOriginX + deltaX;
  mapTranslateY = dragOriginY + deltaY;
  limitarTraslacionMapa();
  aplicarTransformacionMapa();
}

function terminarArrastreMapa() {
  if (mapPointerId !== null && mapViewport.hasPointerCapture?.(mapPointerId)) {
    mapViewport.releasePointerCapture(mapPointerId);
  }

  mapPointerDown = false;
  mapPointerId = null;

  if (!isDraggingMap) return;
  isDraggingMap = false;
  aplicarTransformacionMapa();
}

function manejarClickMapa(event) {
  if (event.target.closest(".map-node")) return;

  if (mapDragMoved) {
    mapDragMoved = false;
    return;
  }

  if (!isReferencePicking) return;

  const rect = mapLayer.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  referencePoint = {
    x: normalizarCoordenada(((event.clientX - rect.left) / rect.width) * 100),
    y: normalizarCoordenada(((event.clientY - rect.top) / rect.height) * 100)
  };

  isReferencePicking = false;
  actualizarBotonReferencia();
  renderNodos(nodos);
  resaltarNodoMasCercano();
}

function limitarTraslacionMapa() {
  const maxX = ((mapViewport.clientWidth || 0) * (mapScale - 1)) / 2;
  const maxY = ((mapViewport.clientHeight || 0) * (mapScale - 1)) / 2;

  mapTranslateX = Math.min(Math.max(mapTranslateX, -maxX), maxX);
  mapTranslateY = Math.min(Math.max(mapTranslateY, -maxY), maxY);
}

function actualizarAccionesSegunSesion() {
  const session = BIONODO_CONFIG.getSession();
  const dashboardRoute = BIONODO_CONFIG.getDashboardRoute();

  if (session.isLoggedIn && dashboardRoute) {
    btnLoginHeader.textContent = session.userType === "admin" ? "Ir a panel admin" : "Ir a mi panel";
    btnLoginHero.textContent = "Continuar recorrido";
    btnLoginMap.textContent = "Ir a mi panel";
    btnRegistroHeader.textContent = "Cerrar sesion";

    btnLoginHeader.addEventListener("click", () => BIONODO_CONFIG.navigate(dashboardRoute));
    btnLoginHero.addEventListener("click", () => BIONODO_CONFIG.navigate(dashboardRoute));
    btnLoginMap.addEventListener("click", () => BIONODO_CONFIG.navigate(dashboardRoute));
    btnRegistroHeader.addEventListener("click", () => {
      BIONODO_CONFIG.clearSession();
      window.location.href = BIONODO_CONFIG.href("publicHome");
    });
    return;
  }

  btnLoginHeader.addEventListener("click", () => navegarLogin());
  btnLoginHero.addEventListener("click", () => navegarLogin());
  btnLoginMap.addEventListener("click", () => navegarLogin());
  btnRegistroHeader.addEventListener("click", () => BIONODO_CONFIG.navigate("registro"));
}

async function cargarMapaPublico() {
  mostrarMensaje("");
  mapStatus.textContent = "Consultando nodos del campus...";

  try {
    const response = await fetch(`${NODOS_API}/listar`);
    if (!response.ok) {
      throw new Error("No se pudieron consultar los nodos del campus.");
    }

    nodos = await response.json();
    renderNodos(nodos);
    if (plantas.length) {
      renderPlantasPublicas(aplicarFiltroPlantasActual());
    }
    mapStatus.textContent = "Haz clic sobre un nodo para ver su ficha rapida.";
    nodeCountBadge.textContent = `${nodos.length} nodo${nodos.length === 1 ? "" : "s"}`;

    const codigoNodo = new URLSearchParams(window.location.search).get("codigoNodo");
    if (codigoNodo) {
      const nodo = nodos.find((item) => item.codigoNodo === codigoNodo);
      if (nodo) {
        establecerReferenciaDesdeNodo(nodo);
        enfocarSeccionMapa();
        await seleccionarNodo(nodo);
      }
    }
  } catch (error) {
    console.error("Error cargando mapa publico:", error);
    mapStatus.textContent = "No fue posible cargar el mapa.";
    mostrarMensaje(error.message || "No se pudo cargar el mapa del campus.", "error");
  }
}

async function cargarNodosDesbloqueados() {
  if (!usuarioLogueado()) {
    nodosDesbloqueados = new Set();
    return;
  }

  const emailUsuario = localStorage.getItem("userEmail");
  if (!emailUsuario) {
    nodosDesbloqueados = new Set();
    return;
  }

  try {
    const response = await fetch(
      `${PROGRESS_API}/usuario/${encodeURIComponent(emailUsuario)}/nodos`
    );

    if (!response.ok) {
      throw new Error("No se pudo consultar el progreso del usuario.");
    }

    const data = await response.json();
    const lista = Array.isArray(data?.data) ? data.data : [];

    nodosDesbloqueados = new Set(
      lista
        .map((nodo) => nodo?.codigoNodo)
        .filter(Boolean)
    );

    if (nodos.length) {
      renderNodos(nodos);
    }
  } catch (error) {
    console.error("Error cargando nodos desbloqueados:", error);
    nodosDesbloqueados = new Set();
  }
}

function enfocarSeccionMapa() {
  const seccionMapa = document.getElementById("mapa-campus");
  if (!seccionMapa) return;

  requestAnimationFrame(() => {
    seccionMapa.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function activarModoReferencia() {
  isReferencePicking = true;
  referenceNodeCode = null;
  actualizarBotonReferencia();
  referenceBadge.textContent = "Punto actual: marca tu punto en el mapa";
  nearestNodeBadge.textContent = "Nodo cercano: pendiente";
  mapStatus.textContent = "Marca tu punto en el croquis para encontrar el nodo mas cercano.";
  enfocarSeccionMapa();
}

function actualizarBotonReferencia() {
  btnLocateMe.classList.toggle("is-active", isReferencePicking);
  btnLocateMe.textContent = isReferencePicking
    ? "Marca tu ubicacion"
    : referencePoint
      ? "Cambiar mi punto"
      : "Estoy aqui";
}

function resaltarNodoMasCercano() {
  if (!referencePoint || !Array.isArray(nodos) || !nodos.length) {
    referenceBadge.textContent = "Punto actual: no definido";
    nearestNodeBadge.textContent = "Nodo cercano: pendiente";
    return;
  }

  const nodosValidos = nodos.filter((nodo) => {
    if (!coordenadaValida(nodo.posicionX) || !coordenadaValida(nodo.posicionY)) {
      return false;
    }

    if (referenceNodeCode && nodo.codigoNodo === referenceNodeCode) {
      return false;
    }

    return true;
  });

  if (!nodosValidos.length) {
    referenceBadge.textContent = referenceNodeCode
      ? `Punto actual: ${referenceNodeCode}`
      : `Punto actual: X ${referencePoint.x.toFixed(2)} | Y ${referencePoint.y.toFixed(2)}`;
    nearestNodeBadge.textContent = "Nodo cercano: no disponible";
    return;
  }

  const cercano = nodosValidos.reduce((mejor, nodo) => {
    const distancia = calcularDistanciaCroquis(referencePoint.x, referencePoint.y, nodo.posicionX, nodo.posicionY);
    if (!mejor || distancia < mejor.distancia) {
      return { nodo, distancia };
    }
    return mejor;
  }, null);

  if (!cercano?.nodo) {
    nearestNodeBadge.textContent = "Nodo cercano: no disponible";
    return;
  }

  referenceBadge.textContent = referenceNodeCode
    ? `Punto actual: ${referenceNodeCode}`
    : `Punto actual: X ${referencePoint.x.toFixed(2)} | Y ${referencePoint.y.toFixed(2)}`;
  nearestNodeBadge.textContent = `Nodo cercano: ${cercano.nodo.codigoNodo || cercano.nodo.nombreNodo || "Nodo"}`;

  if (referenceNodeCode) {
    mapStatus.textContent = `Punto detectado en ${referenceNodeCode}. El siguiente nodo mas cercano es ${cercano.nodo.nombreNodo || cercano.nodo.codigoNodo || "Nodo"}.`;
    return;
  }

  seleccionarNodo(cercano.nodo);
}

function establecerReferenciaDesdeNodo(nodo) {
  if (!nodo || !coordenadaValida(nodo.posicionX) || !coordenadaValida(nodo.posicionY)) {
    return;
  }

  referencePoint = {
    x: normalizarCoordenada(nodo.posicionX),
    y: normalizarCoordenada(nodo.posicionY)
  };
  referenceNodeCode = nodo.codigoNodo || null;
  isReferencePicking = false;
  actualizarBotonReferencia();
  renderNodos(nodos);
  resaltarNodoMasCercano();
}

async function cargarPlantasPublicas() {
  plantsStatus.textContent = "Consultando plantas registradas...";

  try {
    const response = await fetch(`${PLANTAS_API}/listar`);
    if (!response.ok) {
      throw new Error("No se pudieron consultar las plantas registradas.");
    }

    const data = await response.json();
    plantas = Array.isArray(data) ? data : Array.isArray(data?.plantas) ? data.plantas : Array.isArray(data?.data) ? data.data : [];
    renderPlantasPublicas(aplicarFiltroPlantasActual());
    plantsStatus.textContent = "Explora el catalogo y salta al mapa cuando una planta tenga nodo asociado.";
  } catch (error) {
    console.error("Error cargando plantas publicas:", error);
    plantsStatus.textContent = "No fue posible cargar el catalogo botanico.";
    plantasContainer.innerHTML = `
      <article class="plant-card plant-card-empty">
        <div class="plant-card-copy">
          <span class="plant-card-chip">Sin datos</span>
          <h3>No se pudo cargar el catalogo.</h3>
          <p>${escapeHtml(error.message || "Intenta de nuevo mas tarde.")}</p>
        </div>
      </article>
    `;
    plantCountBadge.textContent = "0 plantas";
  }
}

function filtrarPlantasPublicas() {
  const filtradas = aplicarFiltroPlantasActual();
  renderPlantasPublicas(filtradas);
  const term = normalizarTexto(plantSearchInput.value);
  plantsStatus.textContent = term
    ? `Mostrando ${filtradas.length} resultado${filtradas.length === 1 ? "" : "s"} para "${plantSearchInput.value.trim()}".`
    : "Explora el catalogo y salta al mapa cuando una planta tenga nodo asociado.";
}

function aplicarFiltroPlantasActual() {
  const term = normalizarTexto(plantSearchInput.value);
  return !term
    ? plantas
    : plantas.filter((planta) =>
        [planta?.nombreComun, planta?.nombreCientifico, planta?.origen]
          .filter(Boolean)
          .some((value) => normalizarTexto(value).includes(term))
      );
}

function renderPlantasPublicas(lista) {
  plantCountBadge.textContent = `${lista.length} planta${lista.length === 1 ? "" : "s"}`;

  if (!Array.isArray(lista) || !lista.length) {
    plantasContainer.innerHTML = `
      <article class="plant-card plant-card-empty">
        <div class="plant-card-copy">
          <span class="plant-card-chip">Sin coincidencias</span>
          <h3>No encontramos plantas con ese filtro.</h3>
          <p>Prueba otro nombre comun, cientifico u origen para seguir explorando el catalogo.</p>
        </div>
      </article>
    `;
    return;
  }

  plantasContainer.innerHTML = lista
    .map((planta) => {
      const fotos = obtenerFotos(planta);
      const imagen = fotos.length ? construirMediaUrl(fotos[0]) : "";
      const nodoAsociado = encontrarNodoPorPlanta(planta);
      const descripcion =
        planta?.beneficiosAmbientales ||
        planta?.morfologia ||
        planta?.recomendacionesDeCuidado ||
        "Esta planta ya esta registrada en el catalogo botanico de BIONODO.";

      return `
        <article class="plant-card">
          <div class="plant-card-media">
            ${
              imagen
                ? `<img src="${escapeHtml(imagen)}" alt="${escapeHtml(planta?.nombreComun || planta?.nombreCientifico || "Planta")}">`
                : `<div class="plant-card-placeholder">Catalogo botanico</div>`
            }
            <span class="plant-card-chip">${escapeHtml(nodoAsociado?.codigoNodo || "Sin nodo")}</span>
          </div>

          <div class="plant-card-copy">
            <h3>${escapeHtml(planta?.nombreComun || "Planta registrada")}</h3>
            <p class="plant-card-scientific">${escapeHtml(planta?.nombreCientifico || "Nombre cientifico pendiente")}</p>
            <p>${escapeHtml(descripcion)}</p>
          </div>

          <div class="plant-card-meta">
            <article>
              <span>Origen</span>
              <strong>${escapeHtml(planta?.origen || "--")}</strong>
            </article>
            <article>
              <span>Estado en mapa</span>
              <strong>${escapeHtml(nodoAsociado ? "Nodo disponible" : "Sin nodo asociado")}</strong>
            </article>
          </div>

          <div class="plant-card-actions">
            <button type="button" class="btn-primary plant-map-btn" data-planta="${escapeHtml(planta?.nombreCientifico || "")}" ${nodoAsociado ? "" : "disabled"}>
              ${nodoAsociado ? "Ver en el mapa" : "Nodo pendiente"}
            </button>
            <button type="button" class="btn-secondary plant-preview-btn" data-planta="${escapeHtml(planta?.nombreCientifico || "")}" ${nodoAsociado ? "" : "disabled"}>
              ${nodoAsociado ? "Abrir vista previa" : "Sin vista previa"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  plantasContainer.querySelectorAll(".plant-map-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const planta = buscarPlantaPorNombre(button.dataset.planta);
      const nodoAsociado = encontrarNodoPorPlanta(planta);
      if (!nodoAsociado) return;

      document.getElementById("mapa-campus").scrollIntoView({ behavior: "smooth", block: "start" });
      await seleccionarNodo(nodoAsociado);
    });
  });

  plantasContainer.querySelectorAll(".plant-preview-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const planta = buscarPlantaPorNombre(button.dataset.planta);
      const nodoAsociado = encontrarNodoPorPlanta(planta);
      if (!nodoAsociado) return;

      document.getElementById("mapa-campus").scrollIntoView({ behavior: "smooth", block: "start" });
      await seleccionarNodo(nodoAsociado);
      abrirVistaPrevia();
    });
  });
}

function renderNodos(lista) {
  mapLayer.innerHTML = "";

  if (!Array.isArray(lista) || !lista.length) {
    emptyState.classList.remove("hidden");
    nodeDetail.classList.add("hidden");
    nodeCountBadge.textContent = "0 nodos";
    return;
  }

  lista.forEach((nodo) => {
    if (!coordenadaValida(nodo.posicionX) || !coordenadaValida(nodo.posicionY)) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "map-node";
    button.style.left = `${normalizarCoordenada(nodo.posicionX)}%`;
    button.style.top = `${normalizarCoordenada(nodo.posicionY)}%`;
    button.title = nodo.nombreNodo || nodo.codigoNodo || "Nodo";
    button.setAttribute("aria-label", nodo.nombreNodo || nodo.codigoNodo || "Nodo");

    if (activeNodeCode && nodo.codigoNodo === activeNodeCode) {
      button.classList.add("active");
    }

    if (nodosDesbloqueados.has(nodo.codigoNodo)) {
      button.classList.add("unlocked");
    }

    button.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });

    button.addEventListener("click", async () => {
      await seleccionarNodo(nodo);
    });

    mapLayer.appendChild(button);
  });

  if (referencePoint) {
    const marker = document.createElement("div");
    marker.className = "map-user-marker";
    marker.style.left = `${normalizarCoordenada(referencePoint.x)}%`;
    marker.style.top = `${normalizarCoordenada(referencePoint.y)}%`;
    marker.setAttribute("aria-hidden", "true");
    mapLayer.appendChild(marker);
  }
}

async function seleccionarNodo(nodo) {
  activeNodeCode = nodo.codigoNodo;
  selectedNode = nodo;
  selectedPlant = null;
  renderNodos(nodos);
  mapStatus.textContent = `Nodo seleccionado: ${nodo.nombreNodo || nodo.codigoNodo || "Nodo"}`;

  if (nodo.nombreCientificoPlanta) {
    try {
      const response = await fetch(
        `${PLANTAS_API}/buscar/${encodeURIComponent(nodo.nombreCientificoPlanta)}`
      );
      if (response.ok) {
        selectedPlant = await response.json();
      }
    } catch (error) {
      console.error("No se pudo cargar la planta asociada:", error);
    }
  }

  renderDetalleNodo(selectedNode, selectedPlant);
}

function renderDetalleNodo(nodo, planta) {
  emptyState.classList.add("hidden");
  nodeDetail.classList.remove("hidden");

  detailCode.textContent = nodo.codigoNodo || "Nodo";
  detailName.textContent = nodo.nombreNodo || "Nodo del campus";
  detailPlantName.textContent = construirNombrePlanta(planta, nodo);
  detailDescription.textContent = construirResumen(planta);
  detailOrigen.textContent = planta?.origen || "--";
  detailMorfologia.textContent = planta?.morfologia || "--";
  detailBiodiversidad.textContent = planta?.biodiversidad || "--";
  detailReproduccion.textContent = planta?.tipoDeReproduccion || "--";

  renderMediaPanel(nodo, planta);
  btnNodePrimary.textContent = usuarioLogueado()
    ? "Ir a mi panel"
    : "Iniciar sesion para desbloquear";
  btnNodeSecondary.textContent = "Abrir vista previa";
}

function renderMediaPanel(nodo, planta) {
  const fotos = obtenerFotos(planta);
  const embedUrl = convertirYoutubeAEmbed(nodo.videoUrl);
  const elementos = [];

  if (fotos.length) {
    elementos.push(`
      <div class="detail-media-hero">
        <img src="${escapeHtml(construirMediaUrl(fotos[0]))}" alt="${escapeHtml(planta?.nombreComun || planta?.nombreCientifico || nodo.nombreNodo || "Planta")}">
        <span class="detail-media-badge">${escapeHtml(planta?.nombreComun || "Vista botanica")}</span>
      </div>
    `);
  } else if (embedUrl) {
    elementos.push(`
      <iframe
        class="detail-video"
        src="${escapeHtml(embedUrl)}"
        title="Video del nodo"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    `);
  } else {
    elementos.push(`
      <div class="preview-placeholder">
        Este nodo aun no tiene imagenes o video cargados. La estructura ya quedo lista para mostrarlos cuando existan en la base de datos.
      </div>
    `);
  }

  const miniaturas = [];
  fotos.slice(1, 4).forEach((foto) => {
    miniaturas.push(`
      <div class="detail-media-thumb">
        <img src="${escapeHtml(construirMediaUrl(foto))}" alt="${escapeHtml(planta?.nombreComun || planta?.nombreCientifico || "Planta")}">
      </div>
    `);
  });

  if (embedUrl) {
    miniaturas.push(`
      <div class="detail-media-thumb video-thumb">
        Video disponible para la vista previa
      </div>
    `);
  }

  if (miniaturas.length) {
    elementos.push(`<div class="detail-media-grid">${miniaturas.join("")}</div>`);
  }

  detailMedia.innerHTML = elementos.join("");
}

function abrirVistaPrevia() {
  if (!selectedNode) return;

  previewCode.textContent = selectedNode.codigoNodo || "Nodo";
  previewName.textContent = selectedNode.nombreNodo || "Nodo del campus";
  previewPlant.textContent = construirNombrePlanta(selectedPlant, selectedNode);
  previewDescription.textContent = construirResumen(selectedPlant);
  previewOrigen.textContent = selectedPlant?.origen || "--";
  previewMorfologia.textContent = selectedPlant?.morfologia || "--";
  previewBiodiversidad.textContent = selectedPlant?.biodiversidad || "--";
  previewReproduccion.textContent = selectedPlant?.tipoDeReproduccion || "--";

  renderMediaPreview(selectedNode, selectedPlant);
  btnPreviewPrimary.textContent = usuarioLogueado()
    ? "Abrir experiencia completa"
    : "Ir al login para desbloquear";

  previewModal.classList.remove("hidden");
}

function cerrarVistaPrevia() {
  previewModal.classList.add("hidden");
}

function renderMediaPreview(nodo, planta) {
  const fotos = obtenerFotos(planta);
  const embedUrl = convertirYoutubeAEmbed(nodo.videoUrl);

  if (embedUrl) {
    previewLeadMedia.innerHTML = `
      <iframe
        src="${escapeHtml(embedUrl)}"
        title="Video del nodo"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;
  } else if (fotos.length) {
    previewLeadMedia.innerHTML = `
      <img
        class="preview-lead-image"
        src="${escapeHtml(construirMediaUrl(fotos[0]))}"
        alt="${escapeHtml(planta?.nombreComun || planta?.nombreCientifico || nodo.nombreNodo || "Planta")}">
    `;
  } else {
    previewLeadMedia.innerHTML = `
      <div class="preview-placeholder">
        Aun no hay recursos multimedia para este nodo, pero ya tienes lista la estructura para la experiencia publica.
      </div>
    `;
  }

  const tarjetas = [];
  fotos.slice(embedUrl ? 0 : 1, 4).forEach((foto) => {
    tarjetas.push(`
      <div class="preview-media-thumb">
        <img src="${escapeHtml(construirMediaUrl(foto))}" alt="${escapeHtml(planta?.nombreComun || planta?.nombreCientifico || "Planta")}">
      </div>
    `);
  });

  if (embedUrl) {
    tarjetas.unshift(`
      <div class="preview-media-thumb video-thumb">
        Vista en video disponible
      </div>
    `);
  }

  if (!tarjetas.length) {
    tarjetas.push(`
      <div class="preview-media-thumb video-thumb">
        La galeria se llenara con imagenes o video cuando se carguen en el catalogo.
      </div>
    `);
  }

  previewMediaRail.innerHTML = tarjetas.join("");
}

function construirNombrePlanta(planta, nodo) {
  if (planta?.nombreComun && planta?.nombreCientifico) {
    return `${planta.nombreComun} · ${planta.nombreCientifico}`;
  }
  if (planta?.nombreCientifico) {
    return planta.nombreCientifico;
  }
  return nodo?.nombreCientificoPlanta || "Planta asociada pendiente";
}

function encontrarNodoPorPlanta(planta) {
  if (!planta?.nombreCientifico) return null;
  const objetivo = normalizarTexto(planta.nombreCientifico);
  return nodos.find((nodo) => normalizarTexto(nodo?.nombreCientificoPlanta).includes(objetivo)) || null;
}

function buscarPlantaPorNombre(nombreCientifico) {
  const objetivo = normalizarTexto(nombreCientifico);
  return plantas.find((planta) => normalizarTexto(planta?.nombreCientifico) === objetivo) || null;
}

function construirResumen(planta) {
  return (
    planta?.beneficiosAmbientales ||
    planta?.recomendacionesDeCuidado ||
    "Esta es una vista previa del nodo. Aqui se mostrara la informacion botanica mas importante antes de pasar a la experiencia completa."
  );
}

function obtenerFotos(planta) {
  return Array.isArray(planta?.fotos) ? planta.fotos.filter(Boolean) : [];
}

function construirMediaUrl(ruta) {
  if (!ruta) return "";
  if (/^https?:\/\//i.test(ruta)) return ruta;
  return `${BIONODO_CONFIG.api.catalogo}${ruta}`;
}

function usuarioLogueado() {
  return localStorage.getItem("isLoggedIn") === "true" && Boolean(localStorage.getItem("userEmail"));
}

function navegarLogin(codigoNodo) {
  const params = codigoNodo ? { redirect: "nodo", codigoNodo } : undefined;
  BIONODO_CONFIG.navigate("login", params);
}

function convertirYoutubeAEmbed(url) {
  if (!url) return null;
  try {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = new URL(url).searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/");
      return parts[1] ? `https://www.youtube.com/embed/${parts[1].split("?")[0]}` : null;
    }
    if (url.includes("/embed/")) {
      return url;
    }
  } catch {
    return null;
  }
  return null;
}

function normalizarCoordenada(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return 50;
  return Math.min(Math.max(numero, 0), 100);
}

function calcularDistanciaCroquis(origenX, origenY, destinoX, destinoY) {
  const dx = Number(destinoX) - Number(origenX);
  const dy = Number(destinoY) - Number(origenY);
  return Math.sqrt((dx * dx) + (dy * dy));
}

function coordenadaValida(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero >= 0 && numero <= 100;
}

function mostrarMensaje(texto, tipo = "") {
  messageDiv.textContent = texto;
  messageDiv.className = tipo ? `message ${tipo}` : "message";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizarTexto(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


