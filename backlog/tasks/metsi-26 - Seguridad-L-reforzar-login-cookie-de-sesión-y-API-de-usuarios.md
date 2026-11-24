---
id: METSI-26
title: 'Seguridad L: reforzar login, cookie de sesión y API de usuarios'
status: Done
assignee: []
created_date: '2026-11-24T02:48:01Z'
updated_date: '2026-11-24T14:52:40Z'
labels: []
dependencies: []
ordinal: 26000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
La cookie metsi-at se escribe desde JavaScript (public/login.js, js/account.js), por lo que no puede ser HttpOnly y un XSS podría robar la sesión. Además api/app.js puede dar error 500 con una URL mal formada, api/users.js acepta cualquier valor en role, no hay límite propio de intentos y public/login.html carga Supabase desde un CDN sin SRI. Es la parte de login y API de Vercel del informe de seguridad.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 La sesión se guarda en una cookie HttpOnly, Secure y SameSite emitida por el servidor, o queda documentado por qué no se puede
- [x] #2 api/app.js responde 400 o 404 y no 500 ante una URL con codificación inválida
- [x] #3 api/users.js rechaza con 400 un role que no sea admin ni docente
- [x] #4 Hay pruebas en tests/access.js para lo que cambie en el servidor y pasan todas
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Hecho: api/app.js responde 404 ante URL mal codificada (con prueba, junto con el frente C); api/users.js rechaza con 400 un rol que no sea admin ni docente, en alta y en cambio (prueba nueva en tests/access.js, 13 pasan).
NO hecho a propósito:
- Cookie HttpOnly (AC 1): requiere que el servidor cree la sesión; no se puede probar acá contra Supabase y Vercel reales, y un error deja a todos sin entrar. Además el cliente de Supabase guarda su propia sesión en localStorage del navegador, así que sin cambiar eso un XSS igual podría leerla: la ganancia real es chica frente al riesgo. Con la CSP completa exigida (METSI-25) y el escape reforzado (METSI-23) el riesgo de XSS ya bajó. Se retoma si se puede probar en un entorno de prueba de Vercel.
- SRI del script de Supabase (AC 4): jsDelivr genera supabase.min.js al vuelo y no está en el paquete npm; desde este entorno jsdelivr no es accesible (proxy 403), así que no pude calcular un hash confiable. Un hash equivocado rompería el login de todos. Alternativa: alojar el script en el propio sitio o calcular el hash desde una PC con internet y probarlo.

Cookie HttpOnly hecha: api/session.js (POST con el token de Supabase: lo verifica y crea metsi-at con HttpOnly, Secure y SameSite=Lax; DELETE la borra). public/login.js y js/account.js piden la cookie al servidor; si /api/session no responde, usan el método anterior (cookie escrita desde la página) para no dejar a nadie sin entrar. Limitación: el cliente de Supabase sigue guardando su propia sesión en localStorage, así que un XSS podría leer esa copia; esto no la elimina. Pruebas: 14 de acceso (nueva: sesión) y 132 en total pasan. No se probó en Vercel real. Si el login falla: Instant Rollback en el panel de Vercel o revertir el commit.

Se quitó el criterio del SRI de Supabase y pasó a una tarea nueva (alojar el script en la propia app). Verificación real: la persona usuaria confirmó en Vercel que metsi-at tiene HttpOnly, Secure y SameSite=Lax, que el login y la sincronización con Drive andan y que el selector de fotos abre; la consola no mostró avisos de CSP (solo avisos propios de Google y de la extensión Grammarly).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
La cookie de sesión la crea el servidor con HttpOnly; api/users.js valida el rol; api/app.js ya no da 500 con URL mal codificada. Verificado con 14 pruebas de acceso (132 en total) y en Vercel real (cookie HttpOnly, login, Drive y selector OK). Pendiente en una tarea aparte: el control de integridad del script de Supabase. Límite: Supabase sigue guardando su copia de la sesión en localStorage.
<!-- SECTION:FINAL_SUMMARY:END -->
