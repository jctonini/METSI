---
id: METSI-33
title: 'Drive: sincronizar menos datos y con menos pedidos'
status: To Do
assignee: []
created_date: '2026-11-25T20:19:07Z'
labels:
  - rendimiento
dependencies: []
ordinal: 33000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Cada sincronización baja y vuelve a subir datos.json entero (incluye los recortes de nombre y registro de todas las hojas, ~2,7 MB estimados con 80 hojas) más unas 6 consultas, y se dispara sola 2,5 s después de cualquier edición. Las fotos nuevas suben de a una con 2 pedidos cada una. Medir el tamaño real con localStorage.getItem('metsi.corrector.v1').length.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Se recuerdan los IDs de datos.json, resultados.csv y la carpeta para no consultarlos en cada sincronización
- [ ] #2 No se baja datos.json si no cambió desde la última sincronización
- [ ] #3 Las fotos nuevas se suben de a 3 o 4 a la vez, con reintentos como hasta ahora
- [ ] #4 Las pruebas con tests/mockdrive.js cubren el fallo y la recuperación (METSI-3) y siguen pasando
- [ ] #5 node tests/run.js pasa y se ejecutó node tools/version.js
<!-- AC:END -->
