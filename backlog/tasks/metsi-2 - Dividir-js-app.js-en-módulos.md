---
id: METSI-2
title: Dividir js/app.js en módulos
status: To Do
assignee: []
created_date: '2026-11-01T16:41:00Z'
labels:
  - refactor
dependencies: []
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
js/app.js tiene más de 1.100 líneas y mezcla interfaz, sincronización con Drive y flujos de corrección; cada cambio obliga a leer todo el archivo.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 js/app.js queda como punto de entrada y la lógica se separa en módulos con una responsabilidad cada uno
- [ ] #2 El comportamiento visible de la app no cambia
- [ ] #3 node tests/run.js pasa y node tools/version.js se ejecutó
<!-- AC:END -->
