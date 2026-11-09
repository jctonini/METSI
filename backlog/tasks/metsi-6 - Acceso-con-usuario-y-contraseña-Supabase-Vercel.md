---
id: METSI-6
title: Acceso con usuario y contraseña (Supabase + Vercel)
status: Done
assignee:
  - '@claude'
created_date: '2026-11-07T19:17:00Z'
updated_date: '2026-11-09T03:10:00Z'
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
- [x] #1 Sin sesión válida, Vercel redirige a /login y no sirve index.html ni js/ ni css/
- [x] #2 Login con email y contraseña (Supabase Auth), con cierre de sesión y sesión persistente
- [x] #3 Existe el rol admin y el rol docente; solo el admin ve la pestaña Usuarios
- [x] #4 El admin puede invitar, desactivar y borrar docentes desde la app (hay al menos 3 usuarios activos)
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

2026-11-09, probado por el usuario en el despliegue real de Vercel (no con Supabase simulado): #2 el login con email y contraseña funciona; #3 confirmado el rol admin y que la pestaña Usuarios es del admin; #4 como admin creó, desactivó y eliminó un usuario. #1 queda abierto: el usuario confirmó que al cerrar sesión la app redirige a /login, pero no se probó que sin sesión no se sirvan js/ ni css/ en Vercel. Lo cubre la prueba simulada de tests/access.js (sin sesión: página principal 302 a /login y archivos js 401), pero falta verificarlo en el despliegue real (ventana privada, abrir /js/app.js y /css/style.css).

2026-11-09, probado por el usuario en el despliegue real de Vercel, sin sesión: abrir /js/app.js responde «Sesión no válida» y no entrega código (captura). Al cerrar sesión la app redirige a /login. /css/ y /docs/ pasan por la misma función (api/app.js) y la prueba simulada de tests/access.js cubre la redirección de la página principal y el 401 de los archivos; /css/ no se abrió a mano en Vercel. Criterios 2, 3 y 4 probados en Vercel el mismo día. Limitación vigente: la copia publicada en GitHub Pages no ejecuta api/ y abre sin login; el usuario decidió dejarla así por ahora y consultar al profesor.

2026-11-09, el usuario probó también /css/style.css sin sesión en Vercel: responde «Sesión no válida» (captura). Ya están verificados en el despliegue real /, /js/ y /css/.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Acceso con usuario y contraseña (Supabase Auth + Vercel) con roles admin y docente. Sin sesión, Vercel redirige a /login y los archivos de la app (/js/ y /css/) responden «Sesión no válida»; el servidor valida el rol (sale de app_metadata, no del token editable). Verificado en el despliegue real por el usuario: login, cierre de sesión, roles, pestaña Usuarios solo para admin, alta, baja y borrado de usuarios, y bloqueo de /js/ y /css/ sin sesión. Pruebas automáticas con Supabase simulado: 11 en tests/access.js, todas pasan; suite completa 115 pasan. Riesgos y seguimiento: (1) GitHub Pages sigue publicado sin login (decisión pendiente con el profesor); (2) al desactivar o borrar un usuario, su sesión sigue valiendo hasta una hora.
<!-- SECTION:FINAL_SUMMARY:END -->
