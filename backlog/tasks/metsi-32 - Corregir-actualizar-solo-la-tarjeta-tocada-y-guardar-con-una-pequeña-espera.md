---
id: METSI-32
title: 'Corregir: actualizar solo la tarjeta tocada y guardar con una pequeña espera'
status: Done
assignee:
  - '@claude'
created_date: '2026-11-25T20:19:06Z'
updated_date: '2026-11-25T21:04:21Z'
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
- [x] #1 Tocar una burbuja o un campo redibuja solo la tarjeta de esa hoja
- [x] #2 El guardado local se agrupa con una pequeña espera y siempre se completa antes de cerrar la página
- [x] #3 El foco y lo que se está escribiendo se conservan (comportamiento de METSI-14)
- [x] #4 Medido con 80 hojas en Chrome, el tiempo de un toque baja de forma medida (anotar antes y después)
- [x] #5 node tests/run.js pasa y se ejecutó node tools/version.js
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Hecho: renderCard(id) redibuja solo la tarjeta de una hoja (burbujas, bandera de hoja/pregunta, enviar foto a análisis); el nombre, el registro y quitar una hoja siguen usando renderCards() porque afectan a otras hojas. touch() ahora agrupa el guardado (createDeferred en storage.js, 0,4 s) y se completa al ocultar o cerrar la página (visibilitychange y pagehide). Medido en Chrome de escritorio (headless, 80 hojas sintéticas): un toque en una burbuja 368 ms (mediana) -> 6 ms. Verificado en Chrome: tocar y recargar enseguida no pierde el cambio, marcar a revisar no reconstruye las otras tarjetas, lo escrito en comentarios se conserva al tocar burbujas (misma hoja y otra). No probado en celular. Los 404 de la consola (api/config) y los pedidos a Google bloqueados son del entorno de prueba.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Tocar una burbuja ya no redibuja las 80 tarjetas ni reescribe todo el estado: de 368 ms a 6 ms en Chrome de escritorio, sin perder cambios al recargar.
<!-- SECTION:FINAL_SUMMARY:END -->
