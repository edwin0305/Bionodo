const BIONODO_CONFIG = window.BIONODO_CONFIG;

const messageDiv = document.getElementById("message");
const btnProfile = document.getElementById("btnProfile");
const btnReload = document.getElementById("btnReload");
const btnLogout = document.getElementById("btnLogout");
const searchNodoInput = document.getElementById("searchNodo");
const nodesContainer = document.getElementById("nodesContainer");
const nodesCount = document.getElementById("nodesCount");
const badgesContainer = document.getElementById("badgesContainer");
const badgesUnlockedCount = document.getElementById("badgesUnlockedCount");
const nextBadgeTitle = document.getElementById("nextBadgeTitle");
const nextBadgeText = document.getElementById("nextBadgeText");
const journeyProgressFill = document.getElementById("journeyProgressFill");
const journeyProgressText = document.getElementById("journeyProgressText");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeText = document.getElementById("welcomeText");
const summaryTotalNodos = document.getElementById("summaryTotalNodos");
const summaryUnlockedNodos = document.getElementById("summaryUnlockedNodos");
const summaryInsignias = document.getElementById("summaryInsignias");
const summaryProgress = document.getElementById("summaryProgress");

const NODOS_API = `${BIONODO_CONFIG.api.catalogo}/api/proyecto/nodomapa`;
const INSIGNIAS_API = `${BIONODO_CONFIG.api.catalogo}/api/proyecto/insignia`;
const PROGRESS_API = `${BIONODO_CONFIG.api.progress}/api/proyecto/progreso`;
const BADGE_MILESTONES = Array.isArray(window.BIONODO_BADGE_MILESTONES)
  ? window.BIONODO_BADGE_MILESTONES
  : [];

let userEmail = null;
let nodosDisponibles = [];
let nodosDesbloqueados = new Set();
let insigniasDesbloqueadas = [];
let insigniasCatalogo = new Map();

document.addEventListener("DOMContentLoaded", async () => {
  if (!validarSesionUsuario()) {
    return;
  }

  configurarEventos();
  await cargarDashboard();
});

function validarSesionUsuario() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const emailGuardado = localStorage.getItem("userEmail");

  if (isLoggedIn !== "true" || !emailGuardado) {
    BIONODO_CONFIG.navigate("login");
    return false;
  }

  userEmail = emailGuardado;
  welcomeTitle.textContent = `Bienvenido, ${emailGuardado}`;
  welcomeText.textContent =
    "Consulta tus nodos disponibles, revisa tu avance y entra a cada experiencia desde aqui.";
  return true;
}

function configurarEventos() {
  btnProfile.addEventListener("click", () => {
    BIONODO_CONFIG.navigate("perfilUsuario");
  });

  btnReload.addEventListener("click", () => {
    cargarDashboard();
  });

  btnLogout.addEventListener("click", () => {
    BIONODO_CONFIG.clearSession();
    BIONODO_CONFIG.navigate("login");
  });

  searchNodoInput.addEventListener("input", () => {
    renderNodos(filtrarNodos(searchNodoInput.value));
  });
}

async function cargarDashboard() {
  mostrarMensaje("");
  nodesContainer.innerHTML = `<div class="empty-state">Cargando nodos...</div>`;
  badgesContainer.innerHTML = `<div class="empty-state">Cargando insignias...</div>`;

  try {
    const [nodos, resumen, desbloqueados, insigniasUsuario, catalogo] = await Promise.all([
      obtenerNodos(),
      obtenerResumenProgreso(userEmail),
      obtenerNodosDesbloqueados(userEmail),
      obtenerInsigniasDesbloqueadas(userEmail),
      obtenerDetallesInsignias()
    ]);

    nodosDisponibles = Array.isArray(nodos) ? nodos : [];
    nodosDesbloqueados = new Set(
      (Array.isArray(desbloqueados) ? desbloqueados : [])
        .map((nodo) => nodo.codigoNodo)
        .filter(Boolean)
    );
    insigniasDesbloqueadas = Array.isArray(insigniasUsuario) ? insigniasUsuario : [];
    insigniasCatalogo = new Map(
      (Array.isArray(catalogo) ? catalogo : [])
        .filter(Boolean)
        .map((insignia) => [insignia.codigoInsignia, insignia])
    );

    renderResumen(resumen, nodosDisponibles.length, nodosDesbloqueados.size);
    renderInsignias(resumen, nodosDesbloqueados.size);
    renderNodos(filtrarNodos(searchNodoInput.value));
    mostrarMensaje("Panel actualizado correctamente.", "success");
  } catch (error) {
    console.error("Error cargando dashboard de usuario:", error);
    renderResumen(null, 0, 0);
    renderInsignias(null, 0);
    nodesContainer.innerHTML = `<div class="empty-state">No se pudieron cargar los nodos.</div>`;
    mostrarMensaje(error.message || "No se pudo cargar el dashboard.", "error");
  }
}

async function obtenerNodos() {
  const response = await fetch(`${NODOS_API}/listar`);
  if (!response.ok) {
    throw new Error("No se pudo consultar el catalogo de nodos");
  }

  return await response.json();
}

async function obtenerResumenProgreso(emailUsuario) {
  const response = await fetch(
    `${PROGRESS_API}/usuario/${encodeURIComponent(emailUsuario)}/resumen?totalNodos=40`
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data || null;
}

async function obtenerNodosDesbloqueados(emailUsuario) {
  const response = await fetch(
    `${PROGRESS_API}/usuario/${encodeURIComponent(emailUsuario)}/nodos`
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data || [];
}

async function obtenerInsigniasDesbloqueadas(emailUsuario) {
  const response = await fetch(
    `${PROGRESS_API}/usuario/${encodeURIComponent(emailUsuario)}/insignias`
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data || [];
}

async function obtenerDetallesInsignias() {
  if (!BADGE_MILESTONES.length) {
    return [];
  }

  const resultados = await Promise.all(
    BADGE_MILESTONES.map(async (badge) => {
      try {
        const response = await fetch(
          `${INSIGNIAS_API}/buscar-codigo/${encodeURIComponent(badge.code)}`
        );

        if (!response.ok) {
          return null;
        }

        return await response.json();
      } catch (error) {
        console.error(`No se pudo consultar la insignia ${badge.code}:`, error);
        return null;
      }
    })
  );

  return resultados.filter(Boolean);
}

function filtrarNodos(termino) {
  const query = String(termino || "").trim().toLowerCase();

  if (!query) {
    return ordenarNodos(nodosDisponibles);
  }

  return ordenarNodos(
    nodosDisponibles.filter((nodo) => {
      const codigo = String(nodo.codigoNodo || "").toLowerCase();
      const nombre = String(nodo.nombreNodo || "").toLowerCase();
      const planta = String(nodo.nombreCientificoPlanta || "").toLowerCase();
      return codigo.includes(query) || nombre.includes(query) || planta.includes(query);
    })
  );
}

function ordenarNodos(lista) {
  return [...lista].sort((a, b) =>
    String(a.codigoNodo || "").localeCompare(String(b.codigoNodo || ""))
  );
}

function renderResumen(resumen, totalNodos, desbloqueadosLocales) {
  const totalDesbloqueados =
    resumen?.totalNodosDesbloqueados ??
    resumen?.nodosDesbloqueados ??
    desbloqueadosLocales ??
    0;
  const totalInsignias =
    resumen?.totalInsigniasDesbloqueadas ??
    resumen?.insigniasDesbloqueadas ??
    insigniasDesbloqueadas.length;
  const porcentaje =
    resumen?.porcentajeCompletado ??
    resumen?.porcentajeProgreso ??
    calcularPorcentaje(totalDesbloqueados, totalNodos);

  summaryTotalNodos.textContent = String(totalNodos);
  summaryUnlockedNodos.textContent = String(totalDesbloqueados);
  summaryInsignias.textContent = String(totalInsignias);
  summaryProgress.textContent = `${Number(porcentaje || 0).toFixed(1)}%`;
}

function renderInsignias(resumen, desbloqueadosLocales) {
  badgesContainer.innerHTML = "";

  if (!BADGE_MILESTONES.length) {
    badgesContainer.innerHTML = `<div class="empty-state">No hay hitos de insignias configurados.</div>`;
    badgesUnlockedCount.textContent = "0 insignias configuradas";
    nextBadgeTitle.textContent = "Sin configuracion";
    nextBadgeText.textContent = "Agrega la ruta de insignias para mostrar el progreso.";
    journeyProgressFill.style.width = "0%";
    journeyProgressText.textContent = "0 / 40 nodos";
    return;
  }

  const totalDesbloqueados =
    resumen?.totalNodosDesbloqueados ??
    resumen?.nodosDesbloqueados ??
    desbloqueadosLocales ??
    0;

  const insigniasUsuario = new Map(
    insigniasDesbloqueadas
      .filter((item) => item?.codigoInsignia)
      .map((item) => [item.codigoInsignia, item])
  );

  const siguienteMeta = BADGE_MILESTONES.find((badge) => !insigniasUsuario.has(badge.code)) || null;
  const progresoGlobal = calcularPorcentaje(totalDesbloqueados, 40);

  badgesUnlockedCount.textContent = `${insigniasUsuario.size} de ${BADGE_MILESTONES.length} desbloqueadas`;
  journeyProgressFill.style.width = `${Math.min(Math.max(progresoGlobal, 0), 100)}%`;
  journeyProgressText.textContent = `${totalDesbloqueados} / 40 nodos`;

  if (siguienteMeta) {
    const faltantes = Math.max(siguienteMeta.unlockedAt - totalDesbloqueados, 0);
    nextBadgeTitle.textContent = `${siguienteMeta.name} - ${siguienteMeta.unlockedAt} nodos`;
    nextBadgeText.textContent = faltantes > 0
      ? `Te faltan ${faltantes} nodo${faltantes === 1 ? "" : "s"} para desbloquear esta insignia.`
      : "Ya cumpliste la meta. Se desbloqueara al registrar el siguiente avance en progreso.";
  } else {
    nextBadgeTitle.textContent = "Recorrido completo";
    nextBadgeText.textContent = "Ya desbloqueaste todas las insignias del campus vivo.";
  }

  BADGE_MILESTONES.forEach((badge) => {
    const desbloqueada = insigniasUsuario.get(badge.code);
    const esSiguiente = !desbloqueada && siguienteMeta?.code === badge.code;
    const detalleCatalogo = insigniasCatalogo.get(badge.code);
    const imagen = resolverImagenInsignia(detalleCatalogo, badge);
    const nombre = detalleCatalogo?.nombre || badge.name;
    const descripcion = detalleCatalogo?.descripcion || badge.description;

    const card = document.createElement("article");
    card.className = `badge-card ${desbloqueada ? "unlocked" : esSiguiente ? "next" : "locked"}`;
    card.innerHTML = `
      <div class="badge-card-top">
        <img src="${escapeHtml(imagen)}" alt="${escapeHtml(nombre)}">
        <span class="badge-state ${desbloqueada ? "unlocked" : esSiguiente ? "next" : "locked"}">
          ${desbloqueada ? "Desbloqueada" : esSiguiente ? "Siguiente" : "Pendiente"}
        </span>
      </div>
      <div class="badge-meta">
        <h4>${escapeHtml(nombre)}</h4>
        <p>${escapeHtml(descripcion)}</p>
      </div>
      <div class="badge-chips">
        <span class="badge-chip">${escapeHtml(badge.code)}</span>
        <span class="badge-chip">${escapeHtml(`${badge.unlockedAt} nodos`)}</span>
      </div>
      ${desbloqueada?.fechaObtencion ? `<div class="badge-date">Obtenida: ${escapeHtml(formatearFecha(desbloqueada.fechaObtencion))}</div>` : ""}
    `;

    badgesContainer.appendChild(card);
  });
}

function calcularPorcentaje(parte, total) {
  if (!total) return 0;
  return (parte / total) * 100;
}

function renderNodos(lista) {
  nodesContainer.innerHTML = "";
  nodesCount.textContent = `${lista.length} nodo${lista.length === 1 ? "" : "s"}`;

  if (!lista.length) {
    nodesContainer.innerHTML = `<div class="empty-state">No hay nodos para mostrar con ese filtro.</div>`;
    return;
  }

  lista.forEach((nodo) => {
    const card = document.createElement("article");
    card.className = "node-card";

    const codigoNodo = nodo.codigoNodo || "Sin codigo";
    const desbloqueado = nodosDesbloqueados.has(codigoNodo);

    card.innerHTML = `
      <h4>${escapeHtml(nodo.nombreNodo || "Nodo sin nombre")}</h4>
      <span class="node-code">${escapeHtml(codigoNodo)}</span>
      <div class="node-meta">
        <p><strong>Planta:</strong> ${escapeHtml(nodo.nombreCientificoPlanta || "No registrada")}</p>
        <p><strong>Posicion:</strong> X ${escapeHtml(String(nodo.posicionX ?? "--"))} / Y ${escapeHtml(String(nodo.posicionY ?? "--"))}</p>
      </div>
      <span class="node-status ${desbloqueado ? "unlocked" : "pending"}">
        ${desbloqueado ? "Desbloqueado" : "Disponible para explorar"}
      </span>
      <div class="node-actions">
        <button type="button" class="btn-primary" data-codigo="${escapeHtml(codigoNodo)}">Abrir nodo</button>
      </div>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => abrirNodo(codigoNodo));

    nodesContainer.appendChild(card);
  });
}

function abrirNodo(codigoNodo) {
  BIONODO_CONFIG.navigate("nodo", { codigoNodo });
}

function resolverImagenInsignia(detalleCatalogo, badge) {
  if (detalleCatalogo?.imagenUrl) {
    return `${BIONODO_CONFIG.api.catalogo}${detalleCatalogo.imagenUrl}`;
  }

  if (badge?.imageFile) {
    return new URL(`../assets/insignias/${badge.imageFile}`, window.location.href).href;
  }

  return new URL("../assets/logo.png", window.location.href).href;
}

function formatearFecha(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
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

