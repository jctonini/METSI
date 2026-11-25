---
id: METSI-31
title: 'Celular: conservar las fotos comprimidas y descomprimirlas solo al abrirlas'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-11-25T20:19:06Z'
updated_date: '2026-11-25T21:04:21Z'
labels:
  - rendimiento
dependencies: []
ordinal: 31000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Cada hoja mantiene en memoria un canvas de unos 675x900 px ya descomprimido (~2,3 MB): 80 hojas son ~185 MB (cálculo, no medido en un celular). Los navegadores móviles limitan la memoria gráfica y pueden cerrar la pestaña. Además la miniatura se codifica a JPEG dos veces (copia local y subida a Drive). Antes de empezar, medir en un celular real con una tanda larga.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 memory guarda la miniatura como JPEG comprimido y solo crea el canvas al abrir «Ver foto con lo detectado»
- [ ] #2 La miniatura se codifica una sola vez y sirve para la copia local y para Drive
- [ ] #3 Con una tanda de 80 hojas, la memoria de la pestaña baja de forma medida en un celular real (anotar antes y después)
- [ ] #4 node tests/run.js pasa y se ejecutó node tools/version.js
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Hecho: la miniatura queda en memoria como JPEG (thumbBlob) y se decodifica recién al abrir «Ver foto con lo detectado» (y se libera al cerrarla); los lienzos de trabajo se liberan apenas se usan; una sola codificación sirve para IndexedDB y para Drive (app-scan.js, app-drive.js, app.js). Medido en Chrome de escritorio (headless, 80 fotos sintéticas de 1200x1600): memoria del proceso 545 MB -> 312 MB (con 178-185 MB antes de cargar nada). Verificado en Chrome: en memoria queda un Blob de ~54 KB sin canvas, IndexedDB guarda las fotos, la foto se dibuja al abrir y se libera al cerrar, y recargar conserva las 80 hojas. PENDIENTE: criterio 2 (la subida a Drive usa thumbBlob pero NO se ejecutó: hace falta una sincronización real con Google) y criterio 3 (medir en un celular real, antes y después).
<!-- SECTION:NOTES:END -->
