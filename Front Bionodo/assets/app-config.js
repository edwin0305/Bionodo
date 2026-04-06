(function initBionodoConfig() {
  const currentScript = document.currentScript;
  const assetsRoot = currentScript
    ? new URL("./", currentScript.src)
    : new URL("../assets/", window.location.href);
  const runtimeConfig = window.BIONODO_RUNTIME || {};
  const detectedFrontRoot = new URL("../", assetsRoot);
  const frontRoot = runtimeConfig.frontBaseUrl
    ? new URL(runtimeConfig.frontBaseUrl.endsWith("/") ? runtimeConfig.frontBaseUrl : `${runtimeConfig.frontBaseUrl}/`)
    : detectedFrontRoot;

  const routes = {
    publicHome: "index.html",
    login: "login/login.html",
    registro: "registro/registro.html",
    dashboardAdmin: "dashboard-admin/dashboard-admin.html",
    usuariosAdmin: "dashboard-admin/usuarios-admins.html",
    plantasAdmin: "dashboard-admin/plantas-admin/plantas-admin.html",
    nodosAdmin: "dashboard-admin/nodos-admin/nodos-admin.html",
    insigniasAdmin: "dashboard-admin/insignias-admin/insignias-admin.html",
    dashboardUsuario: "dashboard-usuario/dashboard-usuario.html",
    perfilUsuario: "dashboard-usuario/perfil-usuario.html",
    nodo: "nodo/nodo.html"
  };

  const services = {
    users: runtimeConfig.services?.users || "http://localhost:8080",
    catalogo: runtimeConfig.services?.catalogo || "http://localhost:8081",
    progress: runtimeConfig.services?.progress || "http://localhost:8082",
    unlock: runtimeConfig.services?.unlock || "http://localhost:8083"
  };

  function buildFrontUrl(routeKeyOrPath, params) {
    const routePath = routes[routeKeyOrPath] || routeKeyOrPath;
    const url = new URL(routePath, frontRoot);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, value);
        }
      });
    }

    return url;
  }

  function buildNodePublicUrl(codigoNodo) {
    const url = buildFrontUrl("publicHome", codigoNodo ? { codigoNodo } : undefined);
    url.hash = "mapa-campus";
    return url;
  }

  function getSession() {
    return {
      isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
      userType: localStorage.getItem("userType"),
      userEmail: localStorage.getItem("userEmail")
    };
  }

  function getDashboardRoute() {
    const session = getSession();

    if (!session.isLoggedIn) {
      return null;
    }

    if (session.userType === "admin") {
      return "dashboardAdmin";
    }

    return "dashboardUsuario";
  }

  function injectGlobalNavigation() {
    const currentPath = window.location.pathname.replaceAll("\\", "/");
    const isPublicHome = currentPath.endsWith(`/${routes.publicHome}`) || currentPath.endsWith("/Front Bionodo/");

    if (isPublicHome || document.body?.dataset?.hideGlobalMenu === "true") {
      return;
    }

    if (document.querySelector("[data-global-main-menu]")) {
      return;
    }

    if (!document.getElementById("bionodo-global-nav-style")) {
      const style = document.createElement("style");
      style.id = "bionodo-global-nav-style";
      style.textContent = `
        .bionodo-global-nav {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 999;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        body.bionodo-has-global-nav {
          padding-bottom: 108px !important;
        }

        .bionodo-global-nav button {
          border: none;
          border-radius: 999px;
          padding: 12px 16px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(12, 23, 19, 0.22);
          backdrop-filter: blur(8px);
        }

        .bionodo-global-nav .main-menu-btn {
          background: linear-gradient(135deg, #1d5c4a, #133d31);
          color: white;
        }

        .bionodo-global-nav .panel-menu-btn {
          background: rgba(255, 255, 255, 0.92);
          color: #1d5c4a;
        }

        @media (max-width: 720px) {
          .bionodo-global-nav {
            left: 12px;
            right: 12px;
            bottom: 12px;
            gap: 8px;
          }

          body.bionodo-has-global-nav {
            padding-bottom: 148px !important;
          }

          .bionodo-global-nav button {
            flex: 1 1 calc(50% - 8px);
            min-height: 46px;
            padding: 11px 14px;
            font-size: 0.92rem;
          }
        }

        @media (max-width: 420px) {
          body.bionodo-has-global-nav {
            padding-bottom: 196px !important;
          }

          .bionodo-global-nav button {
            flex-basis: 100%;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const nav = document.createElement("div");
    nav.className = "bionodo-global-nav";
    nav.setAttribute("data-global-main-menu", "true");

    const mainButton = document.createElement("button");
    mainButton.type = "button";
    mainButton.className = "main-menu-btn";
    mainButton.textContent = "Menu principal";
    mainButton.addEventListener("click", () => {
      window.location.href = buildFrontUrl("publicHome").href;
    });
    nav.appendChild(mainButton);

    const dashboardRoute = getDashboardRoute();
    if (dashboardRoute) {
      const panelButton = document.createElement("button");
      panelButton.type = "button";
      panelButton.className = "panel-menu-btn";
      panelButton.textContent = "Mi panel";
      panelButton.addEventListener("click", () => {
        window.location.href = buildFrontUrl(dashboardRoute).href;
      });
      nav.appendChild(panelButton);
    }

    document.body.classList.add("bionodo-has-global-nav");
    document.body.appendChild(nav);
  }

  window.BIONODO_CONFIG = {
    api: services,
    routes,
    frontRoot: frontRoot.href,
    publicBaseUrl: frontRoot.href,
    getSession,
    getDashboardRoute,
    nodePublicUrl(codigoNodo) {
      return buildNodePublicUrl(codigoNodo).href;
    },
    href(routeKeyOrPath, params) {
      return buildFrontUrl(routeKeyOrPath, params).href;
    },
    navigate(routeKeyOrPath, params) {
      window.location.href = this.href(routeKeyOrPath, params);
    },
    clearSession() {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userType");
      localStorage.removeItem("userEmail");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    injectGlobalNavigation();
  });
})();
