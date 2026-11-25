---
id: METSI-30
title: 'Detector de misma hoja fotografiada dos veces: comparar más rápido'
status: To Do
assignee: []
created_date: '2026-11-25T20:19:05Z'
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
- [ ] #1 Similar.compare da el mismo veredicto (mismo papel o no) que antes en todas las pruebas existentes
- [ ] #2 Las firmas ya decodificadas se reutilizan entre comparaciones en lugar de decodificarse en cada par
- [ ] #3 Los pares claramente distintos se descartan con una comparación barata antes de la búsqueda completa
- [ ] #4 Medido en Node, comparar 80 firmas entre sí baja al menos a la mitad del tiempo actual
- [ ] #5 node tests/run.js pasa y se ejecutó node tools/version.js
<!-- AC:END -->
