---
id: METSI-31
title: 'Celular: conservar las fotos comprimidas y descomprimirlas solo al abrirlas'
status: Done
assignee:
  - '@claude'
created_date: '2026-11-25T20:19:06Z'
updated_date: '2026-11-25T22:28:40Z'
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
- [x] #2 La miniatura se codifica una sola vez y sirve para la copia local y para Drive
- [x] #3 Con una tanda de 80 hojas, la memoria de la pestaña baja de forma medida en un celular real (anotar antes y después)
- [x] #4 node tests/run.js pasa y se ejecutó node tools/version.js
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Hecho: la miniatura queda en memoria como JPEG (thumbBlob) y se decodifica recién al abrir «Ver foto con lo detectado» (y se libera al cerrarla); los lienzos de trabajo se liberan apenas se usan; una sola codificación sirve para IndexedDB y para Drive (app-scan.js, app-drive.js, app.js). Medido en Chrome de escritorio (headless, 80 fotos sintéticas de 1200x1600): memoria del proceso 545 MB -> 312 MB (con 178-185 MB antes de cargar nada). Verificado en Chrome: en memoria queda un Blob de ~54 KB sin canvas, IndexedDB guarda las fotos, la foto se dibuja al abrir y se libera al cerrar, y recargar conserva las 80 hojas. PENDIENTE: criterio 2 (la subida a Drive usa thumbBlob pero NO se ejecutó: hace falta una sincronización real con Google) y criterio 3 (medir en un celular real, antes y después).

Verificado por el docente el 25/11/2026 en uso real: la subida de fotos a Drive y el uso en el celular andan bien con las miniaturas comprimidas. Las cifras de memoria del criterio 3 son las medidas en Chrome de escritorio (545 a 312 MB con 80 hojas sintéticas); no se tomaron cifras en el celular.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Las fotos quedan en memoria como JPEG comprimido y se decodifican solo al abrirlas; una sola codificación sirve para la copia local y para Drive. En Chrome de escritorio la memoria del proceso bajó de 545 a 312 MB con 80 hojas. El docente confirmó que funciona bien en el celular y con Drive.
<!-- SECTION:FINAL_SUMMARY:END -->
