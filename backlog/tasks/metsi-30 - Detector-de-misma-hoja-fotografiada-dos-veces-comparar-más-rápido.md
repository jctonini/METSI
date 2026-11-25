---
id: METSI-30
title: 'Detector de misma hoja fotografiada dos veces: comparar más rápido'
status: Done
assignee:
  - '@claude'
created_date: '2026-11-25T20:19:05Z'
updated_date: '2026-11-25T20:23:45Z'
labels:
  - rendimiento
dependencies: []
ordinal: 30000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Cada foto nueva se compara contra todas las anteriores (Similar.compare). Medido en Node con tinta simulada: unos 9,4 ms por par, de los cuales 7 ms son el nombre. Con 80 hojas son 3.160 pares (unos 30 s de CPU) y la foto 80 paga 79 comparaciones, casi lo que cuesta leerla. Hay que conservar el umbral 0,75 de las firmas v2 (distintas <= 0,64, misma hoja 0,95).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Similar.compare da el mismo veredicto (mismo papel o no) que antes en todas las pruebas existentes
- [x] #2 Las firmas ya decodificadas se reutilizan entre comparaciones en lugar de decodificarse en cada par
- [x] #3 Los pares claramente distintos se descartan con una comparación barata antes de la búsqueda completa
- [x] #4 Medido en Node, comparar 80 firmas entre sí baja al menos a la mitad del tiempo actual
- [x] #5 node tests/run.js pasa y se ejecutó node tools/version.js
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
similar.js: los mapas desenfocados de cada firma se guardan (WeakMap) y el nombre se compara primero a mitad de resolución; solo si el parecido grueso es >= 0,4 se hace la búsqueda completa. compare(a, b, { exact: true }) fuerza la búsqueda completa. Prueba nueva: mismo veredicto que la búsqueda completa con ambos umbrales (0,55 y 0,75), y valor idéntico cuando se parecen. Medido en Node con 80 firmas de trazos simulados: 3.160 pares de 24,4 s a 3,9 s (-84 %). NO validado con letra real ni en celular; el umbral grueso 0,4 se eligió con firmas sintéticas. Memoria extra: ~140 KB por hoja de mapas guardados (~11 MB con 80).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
La comparación de letra cuesta ~6 veces menos en una tanda de 80 hojas (24 s a 4 s en Node) sin cambiar el veredicto en las pruebas. Falta confirmarlo con letra real.
<!-- SECTION:FINAL_SUMMARY:END -->
