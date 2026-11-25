---
id: METSI-31
title: 'Celular: conservar las fotos comprimidas y descomprimirlas solo al abrirlas'
status: To Do
assignee: []
created_date: '2026-11-25T20:19:06Z'
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
- [ ] #1 memory guarda la miniatura como JPEG comprimido y solo crea el canvas al abrir «Ver foto con lo detectado»
- [ ] #2 La miniatura se codifica una sola vez y sirve para la copia local y para Drive
- [ ] #3 Con una tanda de 80 hojas, la memoria de la pestaña baja de forma medida en un celular real (anotar antes y después)
- [ ] #4 node tests/run.js pasa y se ejecutó node tools/version.js
<!-- AC:END -->
