---
id: METSI-6
title: Acceso con usuario y contraseña (Supabase + Vercel)
status: In Progress
assignee:
  - '@claude'
created_date: '2026-11-07T19:17:00Z'
updated_date: '2026-11-07T19:20:00Z'
labels: []
dependencies: []
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
La app es pública (repo y sitio) y hoy cualquiera puede usarla. Se quiere que solo entren usuarios autorizados: un admin y al menos 2 docentes, con login de Supabase Auth y el sitio publicado en Vercel, con bloqueo del lado del servidor para que sin sesión no se sirva ningún archivo de la app. El admin gestiona altas y bajas de docentes.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Sin sesión válida, Vercel redirige a /login y no sirve index.html ni js/ ni css/
- [ ] #2 Login con email y contraseña (Supabase Auth), con cierre de sesión y sesión persistente
- [ ] #3 Existe el rol admin y el rol docente; solo el admin ve la pestaña Usuarios
- [ ] #4 El admin puede invitar, desactivar y borrar docentes desde la app (hay al menos 3 usuarios activos)
- [x] #5 Un docente no puede llamar a las acciones de administración (validado en el servidor, no solo en la interfaz)
- [x] #6 README documenta la configuración de Supabase y Vercel y las variables de entorno; node tests/run.js sigue pasando
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Servidor (Vercel, CJS): server/auth.js verifica el JWT de Supabase (jose, JWKS o secreto HS256) y lee la cookie de sesión; api/app.js sirve index.html, js/, css/ y docs/ solo con sesión válida (si no, redirige a /login); api/config.js entrega URL y anon key desde variables de entorno; api/users.js (solo admin, rol en app_metadata) lista, crea, desactiva, reactiva, cambia contraseña y borra usuarios con la service role key. 2. vercel.json: outputDirectory=public (solo el login es estático), rewrites a api/app, includeFiles. 3. public/login.html + login.js: login con supabase-js, cookie metsi-at, redirige a next. 4. Frontend: js/account.js (mantiene la cookie al refrescar el token, botón Salir, muestra pestaña Usuarios si es admin) y js/app-users.js (pestaña Usuarios). 5. Pruebas en tests/run.js para server/auth.js y api/users.js con Supabase simulado; README con pasos de Supabase/Vercel.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implementado y probado con Supabase simulado (tests/access.js, 11 pruebas; node tests/run.js: 101 ok). Sin verificar en un deploy real de Vercel/Supabase: enrutado de vercel.json (outputDirectory=public + rewrite a api/app), includeFiles, login real, cookie en producción, alta y baja de usuarios reales. Quedan sin marcar los criterios 1 a 4 hasta probarlos con el deploy.
<!-- SECTION:NOTES:END -->
