---
id: METSI-29
title: 'Lectura: calcular una sola vez la imagen en gris y el recorte del nombre'
status: Done
assignee:
  - '@claude'
created_date: '2026-11-25T20:19:04Z'
updated_date: '2026-11-25T20:20:56Z'
labels:
  - rendimiento
dependencies: []
ordinal: 29000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Medido en Node con una foto sintética de 1200x1600: leer una foto cuesta unos 520 ms y entre 35 y 40 % es trabajo repetido. cropRegion convierte la imagen entera a gris en cada llamada (18 veces por foto) y el recorte del nombre (nameCrop) se calcula dos veces (recorte mostrado y firma). Para un turno de unos 80 hojas en celular suma minutos con la pantalla ocupada.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 La imagen se convierte a gris una sola vez por foto y se reutiliza en todos los recortes
- [x] #2 El recorte del nombre se calcula una sola vez por foto y lo usan el recorte mostrado y la firma
- [x] #3 El resultado de la lectura (respuestas, registro sugerido, recortes y firma) es idéntico al anterior, comprobado con una prueba
- [x] #4 Medido en Node, el tiempo de leer una foto sintética baja al menos 30 %
- [x] #5 node tests/run.js pasa y se ejecutó node tools/version.js
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
scanner.js: grayOf() guarda el gris por imagen (WeakMap) y lo usan scanImage y cropRegion; app-scan.js: nameCrop se calcula una vez y lo reusan el recorte mostrado y makeSig. Medido en Node (foto sintética 1200x1600, lectura+recortes+registro+firma): ~500 ms -> ~311 ms (-35 %); cropRegion de registro+firma pasó de ~109 ms a ~16 ms. Prueba nueva: mismos scores, recortes y nameCrop con y sin gris guardado. No medido en celular.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Cada foto se convierte a gris una sola vez y el recorte del nombre se calcula una sola vez. Mismo resultado de lectura (prueba), ~35 % menos tiempo por foto en Node.
<!-- SECTION:FINAL_SUMMARY:END -->
