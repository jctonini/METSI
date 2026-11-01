---
id: METSI-1
title: Calibrar la lectura con fotos reales
status: In Progress
assignee:
  - '@claude'
created_date: '2026-11-01T16:41:00Z'
updated_date: '2026-11-01T17:02:00Z'
labels:
  - lectura
  - tests
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Las pruebas de lectura usan fotos sintéticas (tests/synth.js). Los casos reales de 'Casos a revisar' permiten ajustar el umbral de relleno y detectar fallos que lo sintético no muestra.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Existe un conjunto de fixtures derivado de casos reales, sin nombres ni registros
- [x] #2 Una prueba en tests/run.js lee esos fixtures y compara con las respuestas esperadas
- [ ] #3 Si se ajusta un umbral, las pruebas existentes de V1 a V4 siguen pasando
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. tools/calibrar.js: lee archivos casos.json (exportados desde «Casos a revisar» o desde la carpeta a-revisar de Drive), reconstruye la respuesta final de cada pregunta (lectura original + correcciones a mano) y compara con interpret() de hoy.
2. Barrido de umbrales: errores por umbral y el umbral con menos errores, para ajustar el valor por defecto con datos reales.
3. Prueba en tests/run.js que usa los casos de tests/fixtures/real/*.json (sin nombres ni registros). Con la carpeta vacía se omite.
4. Documentar en el README cómo agregar casos reales.
Pendiente de datos: los casos reales los tiene que aportar el docente (no hay fotos reales en el repositorio).
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Hecho: tools/calibrar.js (reconstruye la respuesta final con las correcciones a mano, compara con interpret() y barre umbrales) y la prueba en tests/run.js; probados con casos construidos desde fotos sintéticas. Pendiente: no hay casos reales en el repositorio. Hace falta que el docente descargue casos.json (Resultados → Descargar casos) de exámenes reales y los copie a tests/fixtures/real/; después correr node tools/calibrar.js y decidir si se mueve el umbral.
<!-- SECTION:NOTES:END -->
