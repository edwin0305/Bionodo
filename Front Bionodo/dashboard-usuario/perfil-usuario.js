const BIONODO_CONFIG = window.BIONODO_CONFIG;

const btnBack = document.getElementById("btnBack");
const btnReload = document.getElementById("btnReload");
const btnLogout = document.getElementById("btnLogout");
const messageDiv = document.getElementById("message");

const profileTitle = document.getElementById("profileTitle");
const profileText = document.getElementById("profileText");
const heroProgressValue = document.getElementById("heroProgressValue");
const statTotalNodos = document.getElementById("statTotalNodos");
const statUnlockedNodos = document.getElementById("statUnlockedNodos");
const statPendingNodos = document.getElementById("statPendingNodos");
const statUnlockedBadges = document.getElementById("statUnlockedBadges");

const nextBadgeTitle = document.getElementById("nextBadgeTitle");
const nextBadgeDescription = document.getElementById("nextBadgeDescription");
const nextBadgeFill = document.getElementById("nextBadgeFill");
const nextBadgeProgressText = document.getElementById("nextBadgeProgressText");
const recentNodeTitle = document.getElementById("recentNodeTitle");
const recentNodeText = document.getElementById("recentNodeText");
const timelineCounter = document.getElementById("timelineCounter");
const activityCounter = document.getElementById("activityCounter");
const timelineContainer = document.getElementById("timelineContainer");
const activityContainer = document.getElementById("activityContainer");

const NODOS_API = `${BIONODO_CONFIG.api.catalogo}/api/proyecto/nodomapa`;
const INSIGNIAS_API = `${BIONODO_CONFIG.api.catalogo}/api/proyecto/insignia`;
const PROGRESS_API = `${BIONODO_CONFIG.api.progress}/api/proyecto/progreso`;
const BADGE_MILESTONES = Array.isArray(window.BIONODO_BADGE_MILESTONES)
  ? window.BIONODO_BADGE_MILESTONES
  : [];

let userEmail = null;
let nodosDisponibles = [];
let nodosDesbloqueados = [];
let insigniasDesbloqueadas = [];
let insigniasCatalogo = new Map();

document.addEventListener("DOMContentLoaded", async () => {
  if (!validarSesionUsuario()) {
    return;
  }

  configurarEventos();
  await cargarPerfil();
});

function validarSesionUsuario() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const emailGuardado = localStorage.getItem("userEmail");

  if (isLoggedIn !== "true" || !emailGuardado) {
    BIONODO_CONFIG.navigate("login");
    return false;
  }

  userEmail = emailGuardado;
  profileTitle.textContent = `Ruta botanica de ${emailGuardado}`;
  profileText.textContent = "Aqui puedes seguir tu avance, tus insignias y la huella completa de tu recorrido por el campus.";
  return true;
}

function configurarEventos() {
  btnBack.addEventListener("click", () => BIONODO_CONFIG.navigate("dashboardUsuario"));
  btnReload.addEventListener("click", () => cargarPerfil());
  btnLogout.addEventListener("click", () => {
    BIONODO_CONFIG.clearSession();
    BIONODO_CONFIG.navigate("login");
  });
}

async function cargarPerfil() {
  mostrarMensaje("");
  timelineContainer.innerHTML = `<div class="empty-state">Cargando insignias...</div>`;
  activityContainer.innerHTML = `<div class="empty-state">Cargando actividad...</div>`;

  try {
    const [nodos, resumen, desbloqueados, insigniasUsuario, catalogo] = await Promise.all([
      obtenerNodos(),
      obtenerResumenProgreso(userEmail),
      obtenerNodosDesbloqueados(userEmail),
      obtenerInsigniasDesbloqueadas(userEmail),
      obtenerDetallesInsignias()
    ]);

    nodosDisponibles = Array.isArray(nodos) ? nodos : [];
    nodosDesbloqueados = Array.isArray(desbloqueados) ? desbloqueados : [];
    insigniasDesbloqueadas = Array.isArray(insigniasUsuario) ? insigniasUsuario : [];
    insigniasCatalogo = new Map(
      (Array.isArray(catalogo) ? catalogo : [])
        .filter(Boolean)
        .map((insignia) => [insignia.codigoInsignia, insignia])
    );

    renderResumen(resumen);
    renderSiguienteInsignia(resumen);
    renderActividadReciente();
    renderTimeline();
    renderNodosDesbloqueados();
    mostrarMensaje("Perfil actualizado correctamente.", "success");
  } catch (error) {
    console.error("Error cargando perfil de usuario:", error);
    timelineContainer.innerHTML = `<div class="empty-state">No se pudieron cargar las insignias.</div>`;
    activityContainer.innerHTML = `<div class="empty-state">No se pudo cargar la actividad.</div>`;
    mostrarMensaje(error.message || "No se pudo cargar el perfil.", "error");
  }
}

async function obtenerNodos() {
  const response = await fetch(`${NODOS_API}/listar`);
  if (!response.ok) {
    throw new Error("No se pudo consultar el catalogo de nodos.");
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

function renderResumen(resumen) {
  const totalNodos = nodosDisponibles.length || 40;
  const totalDesbloqueados =
    resumen?.totalNodosDesbloqueados ??
    resumen?.nodosDesbloqueados ??
    nodosDesbloqueados.length;
  const totalInsignias =
    resumen?.totalInsigniasDesbloqueadas ??
    resumen?.insigniasDesbloqueadas ??
    insigniasDesbloqueadas.length;
  const porcentaje =
    resumen?.porcentajeCompletado ??
    resumen?.porcentajeProgreso ??
    calcularPorcentaje(totalDesbloqueados, totalNodos);

  statTotalNodos.textContent = String(totalNodos);
  statUnlockedNodos.textContent = String(totalDesbloqueados);
  statPendingNodos.textContent = String(Math.max(totalNodos - totalDesbloqueados, 0));
  statUnlockedBadges.textContent = String(totalInsignias);
  heroProgressValue.textContent = `${Number(porcentaje || 0).toFixed(1)}%`;

  const degrees = Math.min(Math.max((Number(porcentaje || 0) / 100) * 360, 0), 360);
  document.querySelector(".ring-shell").style.background =
    `conic-gradient(#ffffff ${degrees}deg, rgba(255, 255, 255, 0.18) ${degrees}deg)`;
}

function renderSiguienteInsignia(resumen) {
  const totalDesbloqueados =
    resumen?.totalNodosDesbloqueados ??
    resumen?.nodosDesbloqueados ??
    nodosDesbloqueados.length;

  const insigniasUsuario = new Map(
    insigniasDesbloqueadas
      .filter((item) => item?.codigoInsignia)
      .map((item) => [item.codigoInsignia, item])
  );

  const siguienteMeta = BADGE_MILESTONES.find((badge) => !insigniasUsuario.has(badge.code)) || null;

  if (!siguienteMeta) {
    nextBadgeTitle.textContent = "Recorrido completo";
    nextBadgeDescription.textContent = "Ya desbloqueaste todas las insignias de BIONODO. Tu recorrido botanico esta completo.";
    nextBadgeFill.style.width = "100%";
    nextBadgeProgressText.textContent = "40 / 40 nodos";
    return;
  }

  const detalle = insigniasCatalogo.get(siguienteMeta.code);
  const faltantes = Math.max(siguienteMeta.unlockedAt - totalDesbloqueados, 0);
  const progresoMeta = Math.min((totalDesbloqueados / siguienteMeta.unlockedAt) * 100, 100);

  nextBadgeTitle.textContent = `${detalle?.nombre || siguienteMeta.name} - ${siguienteMeta.unlockedAt} nodos`;
  nextBadgeDescription.textContent = faltantes > 0
    ? `Te faltan ${faltantes} nodo${faltantes === 1 ? "" : "s"} para conseguir esta insignia.`
    : "Ya alcanzaste esta meta. Se desbloqueara cuando el progreso registre tu siguiente avance.";
  nextBadgeFill.style.width = `${progresoMeta}%`;
  nextBadgeProgressText.textContent = `${Math.min(totalDesbloqueados, siguienteMeta.unlockedAt)} / ${siguienteMeta.unlockedAt} nodos`;
}

function renderActividadReciente() {
  const recientes = [...nodosDesbloqueados]
    .sort((a, b) => new Date(b.fechaDesbloqueo || 0) - new Date(a.fechaDesbloqueo || 0));

  if (!recientes.length) {
    recentNodeTitle.textContent = "Sin actividad aun";
    recentNodeText.textContent = "Cuando desbloquees nodos, aqui veras el avance mas reciente de tu recorrido.";
    return;
  }

  const ultimo = recientes[0];
  const nodo = nodosDisponibles.find((item) => item.codigoNodo === ultimo.codigoNodo);
  recentNodeTitle.textContent = nodo?.nombreNodo || ultimo.codigoNodo || "Nodo reciente";
  recentNodeText.textContent = `Ultimo desbloqueo: ${formatearFecha(ultimo.fechaDesbloqueo)}${nodo?.nombreCientificoPlanta ? ` - ${nodo.nombreCientificoPlanta}` : ""}.`;
}

function renderTimeline() {
  const insigniasUsuario = new Map(
    insigniasDesbloqueadas
      .filter((item) => item?.codigoInsignia)
      .map((item) => [item.codigoInsignia, item])
  );

  const siguienteMeta = BADGE_MILESTONES.find((badge) => !insigniasUsuario.has(badge.code)) || null;
  timelineCounter.textContent = `${insigniasUsuario.size} de ${BADGE_MILESTONES.length}`;
  timelineContainer.innerHTML = "";

  BADGE_MILESTONES.forEach((badge) => {
    const desbloqueada = insigniasUsuario.get(badge.code);
    const esSiguiente = !desbloqueada && siguienteMeta?.code === badge.code;
    const detalle = insigniasCatalogo.get(badge.code);
    const imagen = resolverImagenInsignia(detalle, badge);
    const nombre = detalle?.nombre || badge.name;
    const descripcion = detalle?.descripcion || badge.description;

    const card = document.createElement("article");
    card.className = `timeline-card ${desbloqueada ? "unlocked" : esSiguiente ? "next" : "locked"}`;
    card.innerHTML = `
      <div class="timeline-top">
        <img src="${escapeHtml(imagen)}" alt="${escapeHtml(nombre)}">
        <span class="timeline-state ${desbloqueada ? "unlocked" : esSiguiente ? "next" : "locked"}">
          ${desbloqueada ? "Desbloqueada" : esSiguiente ? "Siguiente" : "Pendiente"}
        </span>
      </div>
      <h4>${escapeHtml(nombre)}</h4>
      <p>${escapeHtml(descripcion)}</p>
      <div class="timeline-meta">
        <span class="meta-chip">${escapeHtml(badge.code)}</span>
        <span class="meta-chip">${escapeHtml(`${badge.unlockedAt} nodos`)}</span>
      </div>
      ${desbloqueada?.fechaObtencion ? `<div class="timeline-date">Obtenida: ${escapeHtml(formatearFecha(desbloqueada.fechaObtencion))}</div>` : ""}
    `;

    timelineContainer.appendChild(card);
  });
}

function renderNodosDesbloqueados() {
  activityCounter.textContent = `${nodosDesbloqueados.length} nodo${nodosDesbloqueados.length === 1 ? "" : "s"}`;
  activityContainer.innerHTML = "";

  if (!nodosDesbloqueados.length) {
    activityContainer.innerHTML = `<div class="activity-empty">Todavia no has desbloqueado nodos. Explora el mapa y empieza tu recorrido.</div>`;
    return;
  }

  const lista = [...nodosDesbloqueados]
    .sort((a, b) => new Date(b.fechaDesbloqueo || 0) - new Date(a.fechaDesbloqueo || 0));

  lista.forEach((registro) => {
    const nodo = nodosDisponibles.find((item) => item.codigoNodo === registro.codigoNodo);
    const card = document.createElement("article");
    card.className = "activity-card";
    card.innerHTML = `
      <h4>${escapeHtml(nodo?.nombreNodo || registro.codigoNodo || "Nodo desbloqueado")}</h4>
      <p>${escapeHtml(nodo?.nombreCientificoPlanta || "Planta asociada pendiente")}</p>
      <div class="activity-meta">
        <span class="meta-chip">${escapeHtml(registro.codigoNodo || "Sin codigo")}</span>
        <span class="meta-chip">Desbloqueado</span>
      </div>
      <div class="activity-date">${escapeHtml(formatearFecha(registro.fechaDesbloqueo))}</div>
    `;
    activityContainer.appendChild(card);
  });
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

function calcularPorcentaje(parte, total) {
  if (!total) return 0;
  return (parte / total) * 100;
}

function formatearFecha(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value || "Fecha no disponible";
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

