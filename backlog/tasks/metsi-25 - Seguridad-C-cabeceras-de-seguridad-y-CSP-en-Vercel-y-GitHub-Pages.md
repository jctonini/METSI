---
id: METSI-25
title: 'Seguridad C: cabeceras de seguridad y CSP en Vercel y GitHub Pages'
status: In Progress
assignee: []
created_date: '2026-11-24T02:19:10Z'
updated_date: '2026-11-24T02:57:52Z'
labels: []
dependencies: []
ordinal: 25000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
vercel.json no define Content-Security-Policy ni otras cabeceras de seguridad. Una CSP limita el daño si aparece un XSS. Hay que armarla sin romper Drive, Picker ni Supabase, y ver qué se puede hacer en GitHub Pages, que no permite cabeceras propias.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 vercel.json (o api/app.js) agrega CSP, X-Content-Type-Options, Referrer-Policy y una política contra clickjacking
- [ ] #2 La CSP permite lo que la app usa (Drive API, Google Picker, Supabase) y nada más
- [x] #3 Se documenta qué se probó en un navegador real y qué no
- [x] #4 Queda anotado qué protección equivalente existe en GitHub Pages
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Hecho: server/headers.js con las cabeceras; las usan api/app.js, api/users.js y api/config.js, y vercel.json las pone en /login (archivos estáticos). CSP exigida solo con reglas que no pueden romper nada (object-src, base-uri, frame-ancestors, form-action). La CSP completa (scripts, conexiones, imágenes, marcos de Google y Supabase) va en modo solo-aviso (Content-Security-Policy-Report-Only): no bloquea. Además api/app.js responde 404 y no 500 ante una URL mal codificada. GitHub Pages no admite cabeceras propias: index.html lleva un <meta> con object-src, base-uri y form-action; frame-ancestors y el modo aviso no valen en <meta>, así que ahí no hay protección contra marcos ni CSP completa. FALTA (criterio 2): abrir la app publicada con F12 > Consola, usar login, Drive, el selector y exportar, y confirmar que no aparece ningún aviso de CSP; recién entonces pasar la política completa a Content-Security-Policy. No se probó en un navegador real ni en Vercel.
<!-- SECTION:NOTES:END -->
