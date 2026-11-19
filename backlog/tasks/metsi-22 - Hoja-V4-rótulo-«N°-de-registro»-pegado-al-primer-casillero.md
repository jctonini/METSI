---
id: METSI-22
title: 'Hoja V4: rótulo «N° de registro» pegado al primer casillero'
status: Done
assignee:
  - '@claude'
created_date: '2026-11-19T20:54:00Z'
updated_date: '2026-11-19T20:54:00Z'
labels:
  - hoja
dependencies: []
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Algunos alumnos escribieron el registro en el hueco entre el rótulo (contra el margen) y los casilleros. El rótulo pasa a alinearse a la derecha, 2 mm antes del primer casillero. Solo cambia el dibujo del texto; V1 a V3 no se tocan y la geometría de lectura de la V4 tampoco.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 El rótulo termina pegado al primer casillero en la V4
- [x] #2 V1 a V3 sin cambios
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
El rótulo de la V4 se alinea a la derecha y termina 2 mm antes del primer casillero (verificado en Chromium, captura de la hoja). Prueba automática del texto del rótulo en V1 a V4. No se tocó la geometría de lectura: las hojas V4 ya impresas se siguen leyendo igual. Las hojas nuevas que se impriman llevan el rótulo en la nueva posición.
<!-- SECTION:FINAL_SUMMARY:END -->
