# PSC Portal (ADMIN-PSC)

Portal unificado con header estilo Apple y sesión global con Supabase.

## Archivos principales
- `index.html` — redirige según sesión (login o portal).
- `login.html` — ADMIN-PSC (email/contraseña).
- `reset.html` — restablecer contraseña (usa `exchangeCodeForSession`).
- `page1.html` — SUBIR CORTE (skin aplicada, sin cambiar tu lógica).
- `MLadmin.html` — MAL IDENTIFICADOS (skin aplicada, sin cambiar tu lógica).
- `search-v2.html` — SEARCH & ML (skin aplicada, sin cambiar tu lógica).
- `portal.css` / `portal.js` — header + navegación + estilo unificado.
- `guard.js` — protección de rutas.
- `config.js` — **YA** configurado para `https://ztdkaxbgpogudtrdgzic.supabase.co`.

## Deploy
1. Sube todo este folder a GitHub (raíz del repo o carpeta `web/`).
2. Configura tu hosting (GitHub Pages, Netlify, Vercel, Render static) apuntando a esta carpeta.
3. Opcional: en Supabase Auth, define el **Site URL** a tu dominio y el **Redirect URL** a `https://TU-DOMINIO/reset.html` para el flujo de recuperación.

> Nota: `guard.js` exige sesión para las páginas del portal. Si no la hay, redirige a `login.html`.
