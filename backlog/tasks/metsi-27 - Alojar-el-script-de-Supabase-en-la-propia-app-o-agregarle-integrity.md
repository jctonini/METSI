---
id: METSI-27
title: Alojar el script de Supabase en la propia app (o agregarle integrity)
status: In Progress
assignee: []
created_date: '2026-11-24T14:52:39Z'
updated_date: '2026-11-24T14:54:36Z'
labels: []
dependencies: []
ordinal: 27000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
public/login.html y js/account.js cargan supabase.min.js desde cdn.jsdelivr.net sin control de integridad (SRI). Si ese CDN se comprometiera, correría código en el login. jsDelivr arma el .min.js al vuelo y no está en el paquete npm, así que no se pudo calcular un hash confiable desde el entorno de desarrollo (el proxy bloquea jsdelivr). Salió del informe de seguridad (METSI-26, criterio 4).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 El script de Supabase se sirve desde el propio sitio (copia de la versión fijada en package.json, incluido el archivo que carga aparte) o se carga con integrity y crossorigin verificados
- [x] #2 La CSP de server/headers.js y de vercel.json deja de permitir cdn.jsdelivr.net si ya no hace falta
- [ ] #3 Se probó el login, el cierre de sesión y la pestaña Usuarios en un navegador real y se anotó el resultado
- [x] #4 Pasan todas las pruebas
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Hecho: public/supabase.js es una copia exacta de node_modules/@supabase/supabase-js/dist/umd/supabase.js (versión 2.45.4, licencia MIT). El archivo 591.supabase.js del paquete no se copia: solo se carga si el navegador no tiene WebSocket nativo (nunca pasa en los navegadores actuales) y es un stub que lanza un error. public/login.html y js/account.js cargan /supabase.js; vercel.json lo excluye del rewrite a api/app (igual que login.js); la CSP de server/headers.js y vercel.json ya no permite cdn.jsdelivr.net. Prueba nueva en tests/access.js: la copia coincide byte a byte con la del paquete fijado y nada menciona jsdelivr (si se actualiza supabase-js hay que volver a copiar el archivo). 15 pruebas de acceso y 132 en total pasan. FALTA el criterio 3: probar login, cerrar sesión y Usuarios en un navegador real tras desplegar.
<!-- SECTION:NOTES:END -->
