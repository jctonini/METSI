---
id: METSI-32
title: 'Corregir: actualizar solo la tarjeta tocada y guardar con una pequeña espera'
status: To Do
assignee: []
created_date: '2026-11-25T20:19:06Z'
labels:
  - rendimiento
dependencies: []
ordinal: 32000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Cada toque en una burbuja llama a touch() y renderCards(): reescribe todo el estado en localStorage (~2,7 MB estimados con 80 hojas) y redibuja todas las tarjetas (~16.000 elementos y ~10.000 botones con eventos según el código, no medido en navegador). METSI-7 solo arregló el cálculo de repetidos. Medir primero con el panel de rendimiento de Chrome.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Tocar una burbuja o un campo redibuja solo la tarjeta de esa hoja
- [ ] #2 El guardado local se agrupa con una pequeña espera y siempre se completa antes de cerrar la página
- [ ] #3 El foco y lo que se está escribiendo se conservan (comportamiento de METSI-14)
- [ ] #4 Medido con 80 hojas en Chrome, el tiempo de un toque baja de forma medida (anotar antes y después)
- [ ] #5 node tests/run.js pasa y se ejecutó node tools/version.js
<!-- AC:END -->
