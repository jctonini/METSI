---
id: METSI-14
title: >-
  Corregir: la sincronización con Drive no debe quitar el foco ni borrar lo que
  se está escribiendo
status: Done
assignee:
  - '@claude'
created_date: '2026-11-18T23:15:00Z'
updated_date: '2026-11-18T23:21:00Z'
labels:
  - drive
  - corregir
dependencies: []
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
En la solapa Corregir hojas, cada vez que Google Drive sincroniza se pierde el foco y se pierde lo que se estaba escribiendo (nombre, registro, notas). Reportado tras usar la app con 15 exámenes reales.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Una sincronización de Drive en medio de la escritura no cambia el foco ni borra el texto en curso
- [x] #2 Verificado en Chromium (Playwright): foco, texto y cursor se conservan tras redibujar
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
renderCards() recuerda el campo activo (nombre, registro, modalidad), su texto sin confirmar, la selección y el scroll, y los restaura tras redibujar. Verificado con Playwright: se escribió «Ana Pe», se llamó renderCards (lo que hace el fin de la sync) y siguió «Ana Pepa». No hay prueba automática en tests/run.js porque no corre un DOM; falta probarlo con una sincronización real de Drive.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Al terminar la sincronización con Drive se redibujaban las tarjetas y se perdía el foco y lo escrito. Ahora el redibujado conserva el campo activo, su texto sin confirmar, el cursor y el scroll. Verificado en Chromium; sin prueba automática ni prueba con Drive real.
<!-- SECTION:FINAL_SUMMARY:END -->
