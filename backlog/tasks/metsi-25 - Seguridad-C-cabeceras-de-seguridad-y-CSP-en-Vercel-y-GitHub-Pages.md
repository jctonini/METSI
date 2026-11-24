---
id: METSI-25
title: 'Seguridad C: cabeceras de seguridad y CSP en Vercel y GitHub Pages'
status: To Do
assignee: []
created_date: '2026-11-24T02:19:10Z'
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
- [ ] #1 vercel.json (o api/app.js) agrega CSP, X-Content-Type-Options, Referrer-Policy y una política contra clickjacking
- [ ] #2 La CSP permite lo que la app usa (Drive API, Google Picker, Supabase) y nada más
- [ ] #3 Se documenta qué se probó en un navegador real y qué no
- [ ] #4 Queda anotado qué protección equivalente existe en GitHub Pages
<!-- AC:END -->
