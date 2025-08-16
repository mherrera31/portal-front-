/*! PSC Portal Header - aesthetic only, no business logic changed */
(function () {
  try {
    var logoUrl = "https://i.postimg.cc/L8w6XpRT/PSC-AVION.webp";
    var pages = [
      { name: "HOME", href: "landing.html" },
      { name: "SUBIR CORTE", href: "page1.html" },
      { name: "MAL IDENTIFICADOS", href: "MLadmin.html" },
      { name: "SEARCH & ML", href: "search-v2.html" }
    ];

    function isActive(href) {
      try {
        var curr = (location.pathname || "").toLowerCase();
        if (curr.endsWith("/")) curr = curr.slice(0, -1);
        var base = href.toLowerCase().split("/").pop();
        var stem = base.replace(/\.html?$/, "");
        if (curr.includes(stem)) return true;
        if (curr === "" || curr === "/") return stem.includes("page1");
      } catch (_) {}
      return false;
    }

    // Build header
    var header = document.createElement("header");
    header.className = "psc-header";
    header.innerHTML = [
      '<div class="psc-header__inner">',
        '<a class="psc-brand" href="https://psccargas.com" aria-label="Ir a psccargas.com">',
          '<img src="'+logoUrl+'" alt="PSC Cargas" referrerpolicy="no-referrer" />',
          '<span class="psc-brand__title">PSC Cargas</span>',
        '</a>',
        '<button class="psc-burger" type="button" aria-label="Abrir menú"><span></span></button>',
        '<nav class="psc-nav" aria-label="Navegación principal"></nav>',
        '<div class="psc-right">',
          '<span class="psc-session" id="pscSession">Sesión: —</span>',
          '<button class="psc-logout" type="button" id="pscLogout">Logout</button>',
        '</div>',
      '</div>'
    ].join("");

    function applyHeaderOffset() {
      try {
        var h = header.getBoundingClientRect().height;
        if (h > 0) {
          document.documentElement.style.setProperty('--header-offset', Math.ceil(h) + 'px');
        }
      } catch (_) {}
    }

    document.addEventListener("DOMContentLoaded", function () {
      // Inserta el header al inicio del body
      document.body.prepend(header);

      // Observa reescrituras del DOM (arreglado subtree:false)
      try {
        var __psc_observer = new MutationObserver(function(){
          if (!document.querySelector('.psc-header')) {
            document.body.prepend(header);
            applyHeaderOffset();
          }
        });
        __psc_observer.observe(document.body, { childList: true, subtree: false }); // <-- fix
      } catch(_) {}

      // Construye el menú
      var nav = header.querySelector(".psc-nav");
      var burger = header.querySelector(".psc-burger");
      pages.forEach(function (p) {
        var a = document.createElement("a");
        a.href = p.href;
        a.textContent = p.name;
        if (isActive(p.href)) a.setAttribute("aria-current", "page");
        nav.appendChild(a);
      });

      // Burger toggle (CSS maneja la visibilidad)
      burger.addEventListener("click", function () {
        nav.classList.toggle("is-open");
      });

      // Sesión (best-effort)
      var sesEl = header.querySelector("#pscSession");
      (async function fillSession(){
        try {
          if (window.supabase && window.supabase.auth && window.supabase.auth.getUser) {
            var res = await window.supabase.auth.getUser();
            var data = res && res.data;
            if (data && data.user && data.user.email) {
              sesEl.textContent = "Sesión: " + data.user.email;
            }
          } else if (window.localStorage) {
            var maybe = localStorage.getItem("psc_user_email") || localStorage.getItem("email") || localStorage.getItem("psc_user");
            if (maybe) sesEl.textContent = "Sesión: " + maybe;
          }
        } catch (e) {}
      })();

      // Logout (solo estético, preserva tu lógica de auth)
      document.getElementById("pscLogout").addEventListener("click", async function () {
        try {
          if (window.supabase && window.supabase.auth && window.supabase.auth.signOut) {
            await window.supabase.auth.signOut();
          } else {
            try { localStorage.removeItem("psc_user_email"); } catch(e) {}
            try { localStorage.removeItem("email"); } catch(e) {}
            try { localStorage.removeItem("psc_user"); } catch(e) {}
          }
        } finally {
          window.location.href = "login.html";
        }
      });

      // Calibración inicial y en resize
      applyHeaderOffset();
      window.addEventListener('resize', applyHeaderOffset, { passive: true });
    });
  } catch (e) {
    console.error("PSC Portal header error:", e);
  }
})();
