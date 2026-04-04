(function initBionodoRuntimeConfig() {
  window.BIONODO_RUNTIME = window.BIONODO_RUNTIME || {
    frontBaseUrl: null,
    services: {
      users: "http://localhost:8080",
      catalogo: "http://localhost:8081",
      progress: "http://localhost:8082",
      unlock: "http://localhost:8083"
    }
  };
})();
