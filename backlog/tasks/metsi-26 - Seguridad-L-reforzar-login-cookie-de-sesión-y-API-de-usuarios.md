---
id: METSI-26
title: 'Seguridad L: reforzar login, cookie de sesión y API de usuarios'
status: To Do
assignee: []
created_date: '2026-11-24T02:48:01Z'
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
- [ ] #1 La sesión se guarda en una cookie HttpOnly, Secure y SameSite emitida por el servidor, o queda documentado por qué no se puede
- [ ] #2 api/app.js responde 400 o 404 y no 500 ante una URL con codificación inválida
- [ ] #3 api/users.js rechaza con 400 un role que no sea admin ni docente
- [ ] #4 El script de Supabase en public/login.html lleva integrity (SRI) y crossorigin
- [ ] #5 Hay pruebas en tests/access.js para lo que cambie en el servidor y pasan todas
<!-- AC:END -->
