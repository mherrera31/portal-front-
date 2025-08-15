/*! PSC Route Guard (read-only; does not change business logic) */
(function(){
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.__PSC_CONFIG__ || {};
  function redirectToLogin(){ try { window.location.href = 'login.html'; } catch(_){} }
  function init(){
    if (!window.supabase || !window.supabase.createClient) return redirectToLogin();
    const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    sb.auth.getSession().then(({ data })=>{
      if (!data || !data.session) redirectToLogin();
      else {
        // Bridge email for existing logic without modifying it
        try {
          const email = data.session.user?.email;
          if (email) { localStorage.setItem('psc_user_email', email); localStorage.setItem('email', email); }
        } catch(_) {}
      }
    }).catch(redirectToLogin);
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(init,0);
  else document.addEventListener('DOMContentLoaded', init, { once:true });
})();
