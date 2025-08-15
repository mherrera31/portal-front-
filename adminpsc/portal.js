/*! PSC Portal Header - aesthetic only, no business logic changed */
(function () {
  try {
    var logoUrl = "https://i.postimg.cc/L8w6XpRT/PSC-AVION.webp";
    var pages = [
      { name: "SUBIR CORTE", href: "page1.html" },
      { name: "MAL IDENTIFICADOS", href: "MLadmin.html" },
      { name: "SEARCH & ML", href: "search-v2.html" }
    ];

    var path = (location.pathname || "").toLowerCase();
    
function isActive(href) {
  try {
    var curr = (location.pathname || "").toLowerCase();
    // normalize current path (strip trailing slashes)
    if (curr.endsWith("/")) curr = curr.slice(0, -1);

    // get base name without extension from target href
    var base = href.toLowerCase().split("/").pop();
    var stem = base.replace(/\.html?$/,""); // e.g., "mladmin", "page1", "search-v2"

    // consider common deployed variants:
    //   stem.html
    //   stem-portal.html
    //   stem-portal-vX.html
    //   stem-portal-vX-anything.html
    //   custom slugs that still contain the stem (e.g., /mal-identificados/)
    if (curr.includes(stem)) return true;

    // default root -> page1.html
    if (curr === "" || curr === "/") {
      return stem.includes("page1");
    }
  } catch (_) {}
  return false;
}
// Build header
    var header = document.createElement("header");
    header.className = "psc-header";
    header.innerHTML = [
      '<div class="psc-header__inner">',
        '<a class="psc-brand" href="page1.html" aria-label="Ir al portal">',
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

    // Insert header at top
    document.addEventListener("DOMContentLoaded", function () {
      document.body.prepend(header);
    // Keep header present if the page rewrites body
    try {
      var __psc_observer = new MutationObserver(function(){
        if (!document.querySelector('.psc-header')) {
          document.body.prepend(header);
        }
      });
      __psc_observer.observe(document.body, { childList: true, subtree: False });
    } catch(_) {}

      var nav = header.querySelector(".psc-nav");
      var burger = header.querySelector(".psc-burger");

      // Build nav items
      pages.forEach(function (p) {
        var a = document.createElement("a");
        a.href = p.href;
        a.textContent = p.name;
        if (isActive(p.href)) a.setAttribute("aria-current", "page");
        nav.appendChild(a);
      });

      // Burger toggle
      burger.addEventListener("click", function () {
        nav.classList.toggle("is-open");
      });

      // Fill session email if Supabase is present (best-effort, non-blocking)
      var sesEl = header.querySelector("#pscSession");
      (async function fillSession(){
        try {
          if (window.supabase && window.supabase.auth && window.supabase.auth.getUser) {
            var { data, error } = await window.supabase.auth.getUser();
            if (!error && data && data.user && data.user.email) {
              sesEl.textContent = "Sesión: " + data.user.email;
            }
          } else if (window.localStorage) {
            // fallback: custom key if your app stores email
            var maybe = localStorage.getItem("psc_user_email") || localStorage.getItem("email");
            if (maybe) sesEl.textContent = "Sesión: " + maybe;
          }
        } catch (e) { /* ignore */ }
      })();

      // Logout button (aesthetic; only clears common local keys if Supabase not present)
      document.getElementById("pscLogout").addEventListener("click", async function () {
        try {
          if (window.supabase && window.supabase.auth && window.supabase.auth.signOut) {
            await window.supabase.auth.signOut();
          } else {
            // clear some common keys without touching business logic
            try { localStorage.removeItem("psc_user_email"); } catch(e) {}
            try { localStorage.removeItem("email"); } catch(e) {}
          }
        } finally {
          // Redirect to login when available
          window.location.href = "login.html";
        }
      });
    });
  } catch (e) {
    console.error("PSC Portal header error:", e);
  }
})();