
  window.PSC_CONFIG = {
    supabaseUrl: "https://ztdkaxbgpogudtrdgzic.supabase.co",
    supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0ZGtheGJncG9ndWR0cmRnemljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE2MDYsImV4cCI6MjA3MDQxNzYwNn0.mpjY5nWiS48O0DAUkCL7Jl6agF6LurNGeaY8d1u70Po",
    functionsBase: "https://ztdkaxbgpogudtrdgzic.functions.supabase.co"
  };
// Singleton + storageKey propio
if (!window._sb && window.supabase) {
  window._sb = window.supabase.createClient(
    window.PSC_CONFIG.supabaseUrl,
    window.PSC_CONFIG.supabaseAnonKey,
    { auth: { persistSession: true, storageKey: "psc_cierre_auth" } }
  );
}
