const BIONODO_CONFIG = window.BIONODO_CONFIG;
const messageDiv = document.getElementById("message");
const statusText = document.getElementById("statusText");
const nodeCodeBadge = document.getElementById("nodeCodeBadge");
const codigoNodoEl = document.getElementById("codigoNodo");
const nombreNodoEl = document.getElementById("nombreNodo");
const nombreCientificoPlantaEl = document.getElementById("nombreCientificoPlanta");
const nombreComunEl = document.getElementById("nombreComun");
const heroDescriptionEl = document.getElementById("heroDescription");
const heroMetricMedia = document.getElementById("heroMetricMedia");
const heroMetricVideo = document.getElementById("heroMetricVideo");
const heroMetricTopics = document.getElementById("heroMetricTopics");
const assistantHeadline = document.getElementById("assistantHeadline");
const assistantLead = document.getElementById("assistantLead");
const assistantSignals = document.getElementById("assistantSignals");
const chatTopicCount = document.getElementById("chatTopicCount");
const chatCategoryGroups = document.getElementById("chatCategoryGroups");
const chatSpotlightTitle = document.getElementById("chatSpotlightTitle");
const chatSpotlightText = document.getElementById("chatSpotlightText");
const chatMoodPills = document.getElementById("chatMoodPills");

const imagenPrincipalEl = document.getElementById("imagenPrincipal");
const imageFallbackEl = document.getElementById("imageFallback");
const galeriaPlanta = document.getElementById("galeriaPlanta");
const videoWrapper = document.getElementById("videoWrapper");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const insigniasContainer = document.getElementById("insigniasContainer");

const chatbotMessages = document.getElementById("chatbotMessages");

const imageViewerModal = document.getElementById("imageViewerModal");
const imageViewerImg = document.getElementById("imageViewerImg");
const closeImageViewerBtn = document.getElementById("closeImageViewerBtn");

const BACKEND_CATALOGO = BIONODO_CONFIG.api.catalogo;
const BACKEND_PROGRESS = BIONODO_CONFIG.api.progress;
const CHAT_TOPICS = ["resume", "origen", "morfologia", "reproduccion", "biodiversidad", "beneficios", "cuidados", "nombre"];
const CHAT_GROUPS = [
  {
    title: "Basico",
    description: "Para ubicarte rapido en el nodo y reconocer la planta.",
    topics: ["resume", "nombre", "origen"]
  },
  {
    title: "Ecologia",
    description: "Para entender su aporte dentro del campus vivo.",
    topics: ["biodiversidad", "beneficios"]
  },
  {
    title: "Cuidado",
    description: "Para revisar manejo, conservacion y reproduccion.",
    topics: ["cuidados", "reproduccion", "morfologia"]
  }
];
const CHAT_MOODS = {
  default: ["Recorrido vivo", "Exploracion guiada", "Campus botanico"],
  resume: ["Panorama general", "Nodo activo", "Vista inicial"],
  nombre: ["Identidad botanica", "Nombres clave", "Referencia base"],
  origen: ["Procedencia", "Contexto", "Historia de la especie"],
  morfologia: ["Rasgos visuales", "Forma", "Descripcion fisica"],
  reproduccion: ["Ciclo vital", "Propagacion", "Continuidad"],
  biodiversidad: ["Ecosistema", "Interaccion", "Aporte ambiental"],
  beneficios: ["Valor ambiental", "Impacto", "Servicios ecosistemicos"],
  cuidados: ["Conservacion", "Manejo", "Seguimiento"],
  guia: ["Sugerencias", "Siguiente paso", "Ruta recomendada"]
};

let plantaActual = null;
let nodoActual = null;
let userEmail = null;
let chatInitialized = false;

const chatKnowledge = {
  resume: {
    label: "Resumen vivo",
    teaser: "Panorama general del nodo y la planta.",
    keywords: ["resume", "resumen", "general", "cuentame", "cuentame sobre", "explicame"],
    build: (planta, nodo) =>
      construirRespuestaEstructurada({
        topic: "Resumen",
        title: `Panorama rapido de ${planta.nombreComun || planta.nombreCientifico || "la planta"}`,
        lead: construirDescripcionHero(planta),
        bullets: [
          nodo?.nombreNodo ? `Este contenido pertenece al nodo ${nodo.nombreNodo}.` : null,
          planta.origen ? `Origen registrado: ${planta.origen}.` : null,
          planta.beneficiosAmbientales ? `Aporte principal: ${planta.beneficiosAmbientales}.` : null
        ],
        footer: "Si quieres profundizar, puedo seguir con origen, morfologia, reproduccion, biodiversidad o cuidados.",
        followUps: ["origen", "morfologia", "beneficios"]
      })
  },
  origen: {
    label: "Origen",
    teaser: "De donde proviene y como se contextualiza.",
    keywords: ["origen", "de donde", "proviene", "procedencia"],
    build: (planta) =>
      construirRespuestaEstructurada({
        topic: "Origen",
        title: "Procedencia de la especie",
        lead: planta.origen || "No hay informacion registrada sobre el origen de esta planta.",
        bullets: [
          planta.nombreCientifico ? `Nombre cientifico asociado: ${planta.nombreCientifico}.` : null,
          planta.nombreComun ? `Nombre comun registrado: ${planta.nombreComun}.` : null
        ],
        footer: "Si quieres, ahora puedo contarte como es fisicamente o que beneficios aporta.",
        followUps: ["morfologia", "beneficios"]
      })
  },
  morfologia: {
    label: "Morfologia",
    teaser: "Como se ve y que rasgos la distinguen.",
    keywords: ["morfologia", "forma", "aspecto", "como es", "descripcion fisica"],
    build: (planta) =>
      construirRespuestaEstructurada({
        topic: "Morfologia",
        title: "Rasgos fisicos de la planta",
        lead: planta.morfologia || "No hay informacion registrada sobre la morfologia de esta planta.",
        bullets: [
          planta.nombreComun ? `Puedes relacionar esta descripcion con ${planta.nombreComun}.` : null
        ],
        footer: "Tambien puedo explicarte como se reproduce o que papel cumple en la biodiversidad.",
        followUps: ["reproduccion", "biodiversidad"]
      })
  },
  reproduccion: {
    label: "Reproduccion",
    teaser: "Como se propaga o multiplica la planta.",
    keywords: ["reproduccion", "reproduce", "multiplica", "propaga"],
    build: (planta) =>
      construirRespuestaEstructurada({
        topic: "Reproduccion",
        title: "Forma de reproduccion",
        lead: planta.tipoDeReproduccion || "No hay informacion registrada sobre su tipo de reproduccion.",
        bullets: [
          planta.biodiversidad ? `Esto se relaciona con su impacto en la biodiversidad: ${planta.biodiversidad}.` : null
        ],
        footer: "Si quieres seguir, puedo conectarlo con su aporte al ecosistema o con sus cuidados.",
        followUps: ["biodiversidad", "cuidados"]
      })
  },
  biodiversidad: {
    label: "Biodiversidad",
    teaser: "Que aporta al ecosistema del campus.",
    keywords: ["biodiversidad", "ecosistema", "aporta", "entorno"],
    build: (planta) =>
      construirRespuestaEstructurada({
        topic: "Biodiversidad",
        title: "Aporte al ecosistema",
        lead: planta.biodiversidad || "No hay informacion registrada sobre su aporte a la biodiversidad.",
        bullets: [
          planta.beneficiosAmbientales ? `Beneficio complementario: ${planta.beneficiosAmbientales}.` : null
        ],
        footer: "Puedo ampliar esta respuesta con beneficios ambientales o una vista general de la planta.",
        followUps: ["beneficios", "resume"]
      })
  },
  beneficios: {
    label: "Beneficios",
    teaser: "Que valor ambiental o funcional ofrece.",
    keywords: ["beneficios", "ambientales", "sirve", "utilidad", "aporte ambiental"],
    build: (planta) =>
      construirRespuestaEstructurada({
        topic: "Beneficios",
        title: "Beneficios ambientales destacados",
        lead: planta.beneficiosAmbientales || "No hay informacion registrada sobre beneficios ambientales.",
        bullets: [
          planta.biodiversidad ? `Relacion con biodiversidad: ${planta.biodiversidad}.` : null
        ],
        footer: "Si quieres un cierre practico, tambien puedo contarte que cuidados necesita.",
        followUps: ["cuidados", "biodiversidad"]
      })
  },
  cuidados: {
    label: "Cuidados",
    teaser: "Recomendaciones para su manejo y conservacion.",
    keywords: ["cuidados", "cuidado", "mantener", "riego", "necesita", "recomendaciones"],
    build: (planta) =>
      construirRespuestaEstructurada({
        topic: "Cuidados",
        title: "Recomendaciones de cuidado",
        lead: planta.recomendacionesDeCuidado || "No hay informacion registrada sobre sus cuidados.",
        bullets: [
          planta.nombreComun ? `Estas recomendaciones aplican a ${planta.nombreComun}.` : null
        ],
        footer: "Si quieres, cierro con un resumen general o te explico su reproduccion.",
        followUps: ["resume", "reproduccion"]
      })
  },
  nombre: {
    label: "Nombres",
    teaser: "Nombre comun y cientifico de la especie.",
    keywords: ["nombre cientifico", "nombre comun", "como se llama"],
    build: (planta) =>
      construirRespuestaEstructurada({
        topic: "Identidad",
        title: "Nombres registrados de la planta",
        lead:
          planta.nombreCientifico || planta.nombreComun
            ? [planta.nombreCientifico ? `Nombre cientifico: ${planta.nombreCientifico}.` : null, planta.nombreComun ? `Nombre comun: ${planta.nombreComun}.` : null]
                .filter(Boolean)
                .join(" ")
            : "No hay nombres registrados para esta planta.",
        bullets: [],
        footer: "A partir de aqui puedo ampliar con origen, morfologia o beneficios.",
        followUps: ["origen", "morfologia", "beneficios"]
      })
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  if (!validarSesionUsuario()) {
    return;
  }

  configurarVisorImagen();
  configurarChatbot();

  const codigoNodo = obtenerCodigoNodoDesdeURL();

  if (!codigoNodo) {
    mostrarError("No se recibio el codigo del nodo.");
    statusText.textContent = "Codigo de nodo no valido.";
    return;
  }

  await cargarExperienciaNodo(codigoNodo);
});

function validarSesionUsuario() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const emailGuardado = localStorage.getItem("userEmail");

  if (isLoggedIn !== "true" || !emailGuardado) {
    BIONODO_CONFIG.navigate("login");
    return false;
  }

  userEmail = emailGuardado;
  return true;
}

function obtenerCodigoNodoDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("codigoNodo");
}

async function cargarExperienciaNodo(codigoNodo) {
  try {
    statusText.textContent = "Buscando nodo...";

    const nodo = await obtenerNodoPorCodigo(codigoNodo);
    if (!nodo) {
      mostrarError("No se encontro el nodo solicitado.");
      statusText.textContent = "Nodo no encontrado.";
      return;
    }

    nodoActual = nodo;
    renderNodo(nodo);

    statusText.textContent = "Buscando planta asociada...";

    const planta = await obtenerPlantaPorNombreCientifico(nodo.nombreCientificoPlanta);
    if (!planta) {
      mostrarError("No se encontro la planta asociada al nodo.");
      statusText.textContent = "Planta asociada no encontrada.";
      return;
    }

    plantaActual = planta;
    renderPlanta(planta);
    renderVideo(nodo.videoUrl);
    inicializarChatbot();

    statusText.textContent = "Registrando progreso...";
    await desbloquearNodoEnProgress(userEmail, codigoNodo);

    statusText.textContent = "Consultando resumen e insignias...";
    const [resumen, insignias] = await Promise.all([
      obtenerResumenProgreso(userEmail),
      obtenerInsigniasUsuario(userEmail)
    ]);

    renderResumen(resumen);
    await renderInsignias(insignias);

    statusText.textContent = "Nodo cargado correctamente.";
    mostrarMensaje("Nodo consultado y progreso actualizado correctamente.", "success");
  } catch (error) {
    console.error("Error cargando experiencia del nodo:", error);
    mostrarError(error.message || "Ocurrio un error al cargar la experiencia.");
    statusText.textContent = "Error al cargar la experiencia.";
  }
}

async function obtenerNodoPorCodigo(codigoNodo) {
  const response = await fetch(`${BACKEND_CATALOGO}/api/proyecto/nodomapa/buscar-codigo/${encodeURIComponent(codigoNodo)}`);
  if (!response.ok) return null;
  return await response.json();
}

async function obtenerPlantaPorNombreCientifico(nombreCientifico) {
  const response = await fetch(`${BACKEND_CATALOGO}/api/proyecto/planta/buscar/${encodeURIComponent(nombreCientifico)}`);
  if (!response.ok) return null;
  return await response.json();
}

async function desbloquearNodoEnProgress(emailUsuario, codigoNodo) {
  const response = await fetch(`${BACKEND_PROGRESS}/api/proyecto/progreso/nodo/desbloquear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      emailUsuario,
      codigoNodo
    })
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "No se pudo desbloquear el nodo");
  }

  return data.data;
}

async function obtenerResumenProgreso(emailUsuario) {
  const response = await fetch(`${BACKEND_PROGRESS}/api/proyecto/progreso/usuario/${encodeURIComponent(emailUsuario)}/resumen?totalNodos=40`);
  if (!response.ok) return null;

  const data = await response.json();
  return data.data || null;
}

async function obtenerInsigniasUsuario(emailUsuario) {
  const response = await fetch(`${BACKEND_PROGRESS}/api/proyecto/progreso/usuario/${encodeURIComponent(emailUsuario)}/insignias`);
  if (!response.ok) return [];

  const data = await response.json();
  return data.data || [];
}

async function obtenerDetalleInsignia(codigoInsignia) {
  const response = await fetch(`${BACKEND_CATALOGO}/api/proyecto/insignia/buscar-codigo/${encodeURIComponent(codigoInsignia)}`);
  if (!response.ok) return null;
  return await response.json();
}

function renderNodo(nodo) {
  const codigo = nodo.codigoNodo || "Nodo";
  nodeCodeBadge.textContent = codigo;
  codigoNodoEl.textContent = codigo;
  nombreNodoEl.textContent = nodo.nombreNodo || "Nodo sin nombre";
  nombreCientificoPlantaEl.textContent = nodo.nombreCientificoPlanta || "---";
  heroMetricVideo.textContent = nodo.videoUrl ? "Video disponible" : "Sin video cargado";
  heroMetricTopics.textContent = `${CHAT_TOPICS.length} rutas`;
}

function renderPlanta(planta) {
  nombreComunEl.textContent = planta.nombreComun || "---";
  heroDescriptionEl.textContent = construirDescripcionHero(planta);
  heroMetricMedia.textContent = construirResumenMedia(planta);
  renderGaleria(planta);
  renderAssistantOverview(planta, nodoActual);
}

function construirDescripcionHero(planta) {
  const partes = [
    planta.nombreComun ? `${planta.nombreComun} es la especie asociada a este nodo.` : null,
    planta.nombreCientifico ? `Su nombre cientifico es ${planta.nombreCientifico}.` : null,
    planta.beneficiosAmbientales ? `Se destaca por ${planta.beneficiosAmbientales}.` : null
  ].filter(Boolean);

  return partes.join(" ") || "Esta planta aun no tiene suficiente informacion descriptiva cargada.";
}

function construirResumenMedia(planta) {
  const totalFotos = obtenerFotos(planta).length;
  return totalFotos === 0 ? "Sin imagenes cargadas" : `${totalFotos} imagen${totalFotos === 1 ? "" : "es"} disponibles`;
}

function construirRespuestaEstructurada({ topic, title, lead, bullets = [], footer = "", followUps = [] }) {
  return {
    topic,
    title,
    lead,
    bullets: bullets.filter(Boolean),
    footer,
    followUps: followUps.filter((item) => chatKnowledge[item])
  };
}

function renderGaleria(planta) {
  galeriaPlanta.innerHTML = "";
  const fotos = obtenerFotos(planta);

  if (!fotos.length) {
    imagenPrincipalEl.classList.add("hidden");
    imageFallbackEl.classList.remove("hidden");
    return;
  }

  const primera = `${BACKEND_CATALOGO}${fotos[0]}`;
  imagenPrincipalEl.src = primera;
  imagenPrincipalEl.classList.remove("hidden");
  imageFallbackEl.classList.add("hidden");
  imagenPrincipalEl.onclick = () => abrirVisorImagen(primera);

  fotos.forEach((foto, index) => {
    const url = `${BACKEND_CATALOGO}${foto}`;
    const img = document.createElement("img");
    img.src = url;
    img.alt = planta.nombreComun || planta.nombreCientifico || `Foto ${index + 1}`;
    img.addEventListener("click", () => {
      imagenPrincipalEl.src = url;
      abrirVisorImagen(url);
    });
    galeriaPlanta.appendChild(img);
  });
}

function obtenerFotos(planta) {
  return Array.isArray(planta?.fotos) ? planta.fotos.filter(Boolean) : [];
}

function renderAssistantOverview(planta, nodo) {
  assistantHeadline.textContent = `Conversa con ${planta.nombreComun || planta.nombreCientifico || "la planta"} desde el nodo ${nodo?.codigoNodo || "---"}`;
  assistantLead.textContent =
    "Explora la planta por temas y deja que el asistente te responda con base en la informacion botanica guardada en la base de datos.";
  chatTopicCount.textContent = `${CHAT_TOPICS.length} rutas botanicas activas`;

  const signals = [
    {
      label: "Nodo activo",
      value: nodo?.nombreNodo || nodo?.codigoNodo || "Nodo del campus"
    },
    {
      label: "Fuente",
      value: "Catalogo botanico del proyecto"
    },
    {
      label: "Media",
      value: construirResumenMedia(planta)
    }
  ];

  assistantSignals.innerHTML = signals
    .map(
      (signal) => `
        <article class="assistant-signal-card">
          <span>${escapeHtml(signal.label)}</span>
          <strong>${escapeHtml(signal.value)}</strong>
        </article>
      `
    )
    .join("");

  chatCategoryGroups.innerHTML = CHAT_GROUPS.map((group) => `
    <section class="chat-category-group">
      <div class="chat-category-header">
        <strong>${escapeHtml(group.title)}</strong>
        <p>${escapeHtml(group.description)}</p>
      </div>
      <div class="chat-category-buttons">
        ${group.topics.map((topicKey) => {
          const topic = chatKnowledge[topicKey];
          return `
            <button type="button" class="chat-chip chat-trigger" data-question="${escapeHtml(topicKey)}">
              <span>${escapeHtml(topic.label)}</span>
              <strong>${escapeHtml(topic.teaser)}</strong>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `).join("");

  conectarDisparadoresChat(chatCategoryGroups);
  resaltarRutaActiva("resume");
}

function renderVideo(videoUrl) {
  if (!videoUrl) {
    heroMetricVideo.textContent = "Sin video cargado";
    videoWrapper.innerHTML = `<div class="video-placeholder">Este nodo aun no tiene un video asociado.</div>`;
    return;
  }

  const embedUrl = convertirYoutubeAEmbed(videoUrl);
  if (!embedUrl) {
    heroMetricVideo.textContent = "Video no valido";
    videoWrapper.innerHTML = `<div class="video-placeholder">La URL del video registrada no es valida.</div>`;
    return;
  }

  heroMetricVideo.textContent = "Video disponible";
  videoWrapper.innerHTML = `
    <iframe
      src="${embedUrl}"
      title="Video del nodo"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
}

function convertirYoutubeAEmbed(url) {
  try {
    if (!url) return null;

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

function renderResumen(resumen) {
  if (!resumen) {
    progressText.textContent = "No se pudo cargar el resumen del progreso.";
    progressFill.style.width = "0%";
    return;
  }

  const totalNodosDesbloqueados = resumen.totalNodosDesbloqueados ?? resumen.nodosDesbloqueados ?? 0;
  const porcentaje = resumen.porcentajeCompletado ?? resumen.porcentajeProgreso ?? 0;
  const totalInsignias = resumen.totalInsigniasDesbloqueadas ?? resumen.insigniasDesbloqueadas ?? 0;

  progressText.textContent = `Has desbloqueado ${totalNodosDesbloqueados} nodos y ${totalInsignias} insignias. Tu progreso actual es ${Number(porcentaje).toFixed(1)}%.`;
  progressFill.style.width = `${Math.min(Number(porcentaje) || 0, 100)}%`;
}

async function renderInsignias(insignias) {
  insigniasContainer.innerHTML = "";

  if (!Array.isArray(insignias) || insignias.length === 0) {
    insigniasContainer.innerHTML = `<p class="empty-text">Aun no has desbloqueado insignias.</p>`;
    return;
  }

  const detalles = await Promise.all(
    insignias.map(async (insignia) => ({
      desbloqueada: insignia,
      detalle: await obtenerDetalleInsignia(insignia.codigoInsignia)
    }))
  );

  detalles.forEach(({ desbloqueada, detalle }) => {
    const card = document.createElement("article");
    card.className = "insignia-card";

    const imagen = detalle?.imagenUrl ? `${BACKEND_CATALOGO}${detalle.imagenUrl}` : "";
    const nombre = detalle?.nombre || desbloqueada.codigoInsignia || "Insignia";
    const descripcion = detalle?.descripcion || "Insignia obtenida por tu avance en el recorrido.";

    card.innerHTML = `
      ${imagen
        ? `<img src="${escapeHtml(imagen)}" alt="${escapeHtml(nombre)}">`
        : `<div class="insignia-avatar">BIO</div>`}
      <div>
        <h3>${escapeHtml(nombre)}</h3>
        <p class="insignia-meta">${escapeHtml(descripcion)}</p>
        <p class="insignia-meta"><strong>Fecha:</strong> ${escapeHtml(formatearFecha(desbloqueada.fechaObtencion))}</p>
      </div>
    `;

    insigniasContainer.appendChild(card);
  });
}

function formatearFecha(valor) {
  if (!valor) return "---";

  const date = new Date(valor);
  if (Number.isNaN(date.getTime())) return String(valor);

  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function configurarChatbot() {
  chatTopicCount.textContent = `${CHAT_TOPICS.length} rutas botanicas activas`;
  assistantHeadline.textContent = "Preparando el contexto del asistente...";
  assistantLead.textContent = "Cuando la planta termine de cargar, aqui veras una guia clara para explorarla con el chatbot.";
  actualizarSpotlight("default", {
    title: "Exploracion botanica guiada",
    text: "Selecciona una ruta para activar una conversacion mas inmersiva con el asistente del nodo."
  });
}

function inicializarChatbot() {
  if (chatInitialized || !plantaActual) return;

  chatInitialized = true;
  chatbotMessages.innerHTML = "";
  agregarMensajeChat("bot", {
    topic: "Bienvenida",
    title: `Asistente listo para explorar ${plantaActual.nombreComun || plantaActual.nombreCientifico || "esta planta"}`,
    lead: "Ya conecte el nodo, la galeria y la base de datos botanica. Puedes explorar por categorias o usar las rutas sugeridas del asistente.",
    bullets: [
      nodoActual?.codigoNodo ? `Nodo activo: ${nodoActual.codigoNodo}.` : null,
      plantaActual.nombreCientifico ? `Nombre cientifico registrado: ${plantaActual.nombreCientifico}.` : null,
      construirResumenMedia(plantaActual)
    ].filter(Boolean),
    footer: "Empieza con un resumen o ve directo a origen, morfologia, biodiversidad, beneficios o cuidados.",
    followUps: ["resume", "origen", "cuidados"]
  });
}

async function responderPregunta(question) {
  if (!plantaActual) {
    agregarMensajeChat("bot", "Todavia no se ha cargado la informacion de la planta.");
    return;
  }

  agregarMensajeChat("bot", "Pensando...", true);
  const reply = construirRespuestaChat(question, plantaActual);
  const routeKey = identificarRutaChat(question);

  await new Promise((resolve) => setTimeout(resolve, 320));
  const typingBubble = chatbotMessages.querySelector(".chat-bubble.typing:last-child");
  if (typingBubble) {
    typingBubble.remove();
  }

  agregarMensajeChat("bot", reply);
  actualizarSpotlight(routeKey, reply);
  resaltarRutaActiva(routeKey);
}

function construirRespuestaChat(question, planta) {
  const normalized = normalizarTexto(question);

  for (const entry of Object.values(chatKnowledge)) {
    if (entry.keywords.some((keyword) => normalized.includes(normalizarTexto(keyword)))) {
      return entry.build(planta, nodoActual);
    }
  }

  return construirRespuestaEstructurada({
    topic: "Guia",
    title: "Puedo ayudarte a explorar esta planta",
    lead: `Tengo cargada la informacion de ${planta.nombreComun || planta.nombreCientifico || "esta planta"} desde la base de datos del proyecto.`,
    bullets: [
      "Prueba con preguntas sobre origen, morfologia, reproduccion, biodiversidad, beneficios o cuidados.",
      planta.beneficiosAmbientales ? `Dato disponible: ${planta.beneficiosAmbientales}.` : null
    ],
    footer: "Tambien puedes pulsar una ruta sugerida para abrir la conversacion mas rapido.",
    followUps: ["resume", "beneficios", "cuidados"]
  });
}

function identificarRutaChat(question) {
  const normalized = normalizarTexto(question);

  for (const [key, entry] of Object.entries(chatKnowledge)) {
    if (entry.keywords.some((keyword) => normalized.includes(normalizarTexto(keyword)))) {
      return key;
    }
  }

  return "guia";
}

function agregarMensajeChat(role, payload, typing = false) {
  const bubble = document.createElement("article");
  bubble.className = `chat-bubble ${role}${typing ? " typing" : ""}`;

  if (typing) {
    bubble.innerHTML = `
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>Analizando la informacion del nodo...</p>
    `;
  } else if (role === "user") {
    bubble.innerHTML = `
      <span class="user-choice-label">Ruta elegida</span>
      <p>${escapeHtml(String(payload))}</p>
    `;
  } else {
    const data = typeof payload === "object" && payload !== null
      ? payload
      : construirRespuestaEstructurada({
          topic: "Respuesta",
          title: "Asistente BIONODO",
          lead: String(payload || ""),
          bullets: [],
          footer: "",
          followUps: []
        });

    bubble.innerHTML = `
      <span class="chat-topic-badge">${escapeHtml(data.topic || "Respuesta")}</span>
      <h3 class="chat-bubble-title">${escapeHtml(data.title || "Asistente BIONODO")}</h3>
      <p class="chat-bubble-text">${escapeHtml(data.lead || "")}</p>
      ${
        Array.isArray(data.bullets) && data.bullets.length
          ? `<ul class="chat-bullet-list">${data.bullets
              .map((item) => `<li>${escapeHtml(item)}</li>`)
              .join("")}</ul>`
          : ""
      }
      ${data.footer ? `<p class="chat-footer">${escapeHtml(data.footer)}</p>` : ""}
      ${
        Array.isArray(data.followUps) && data.followUps.length
          ? `<div class="chat-inline-actions">${data.followUps
              .map((item) => `<button type="button" class="chat-inline-chip chat-trigger" data-question="${escapeHtml(item)}">${escapeHtml(chatKnowledge[item].label)}</button>`)
              .join("")}</div>`
          : ""
      }
    `;

    conectarDisparadoresChat(bubble);
  }

  chatbotMessages.appendChild(bubble);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function conectarDisparadoresChat(root) {
  root.querySelectorAll(".chat-trigger").forEach((button) => {
    button.addEventListener("click", async () => {
      const question = button.dataset.question || "resume";
      agregarMensajeChat("user", chatKnowledge[question]?.label || "Nueva consulta");
      await responderPregunta(question);
    });
  });
}

function actualizarSpotlight(routeKey, payload) {
  const moods = CHAT_MOODS[routeKey] || CHAT_MOODS.default;
  const title = payload?.title || chatKnowledge[routeKey]?.label || "Exploracion botanica guiada";
  const text = payload?.footer || payload?.lead || "Selecciona una ruta para activar una conversacion mas inmersiva.";

  chatSpotlightTitle.textContent = title;
  chatSpotlightText.textContent = text;
  chatMoodPills.innerHTML = moods
    .map((item) => `<span class="chat-mood-pill">${escapeHtml(item)}</span>`)
    .join("");
}

function resaltarRutaActiva(routeKey) {
  document.querySelectorAll(".chat-trigger").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.question === routeKey);
  });
}

function normalizarTexto(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function configurarVisorImagen() {
  closeImageViewerBtn.addEventListener("click", cerrarVisorImagen);

  imageViewerModal.addEventListener("click", (event) => {
    if (event.target === imageViewerModal) {
      cerrarVisorImagen();
    }
  });
}

function abrirVisorImagen(src) {
  imageViewerImg.src = src;
  imageViewerModal.classList.remove("hidden");
}

function cerrarVisorImagen() {
  imageViewerImg.src = "";
  imageViewerModal.classList.add("hidden");
}

function mostrarMensaje(texto, tipo = "") {
  messageDiv.textContent = texto;
  messageDiv.className = tipo ? `message ${tipo}` : "message";
}

function mostrarError(texto) {
  mostrarMensaje(texto, "error");
}

function volverMapa() {
  BIONODO_CONFIG.navigate("dashboardUsuario");
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
