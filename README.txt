# Supabase Auth — 3 páginas protegidas (HTML puro)

Este kit te permite tener un **login** y 3 páginas HTML protegidas por **Supabase Auth**.
Si un usuario intenta entrar directo por URL, será redirigido a `/login.html`.

## Archivos
- `config.js` — Pega aquí tu `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
- `login.html` — Formulario de acceso (email + password) y registro.
- `portal.html` — Menú principal con enlaces a las 3 páginas.
- `page1.html`, `page2.html`, `page3.html` — Tus 3 fronts protegidos.

## Cómo usar
1) Edita `config.js` y pega tu `SUPABASE_ANON_KEY`. La URL ya viene con tu id detectado (`ztdkaxbgpogudtrdgzic`). Cambia si no coincide.
2) Abre `page1.html`, `page2.html`, `page3.html` y **pega el HTML de tus fronts** dentro del `<div id="app">`.
3) Sube todos los archivos al mismo host (Netlify, Vercel, tu servidor).

> Nota: En hosting estático, el HTML se descarga antes del check, por eso incluimos un *guard* visual que oculta el contenido (`html.preauth body{{display:none}}`) hasta confirmar la sesión. Tras logout, se redirige al login y se evita contenido en cache.

## Tip: headers de no-cache (opcional)
Si usas Netlify, crea un archivo `_headers` junto a los HTML con:
```
/*
  Cache-Control: no-store
```
Así evitas contenido cacheado después de cerrar sesión.
