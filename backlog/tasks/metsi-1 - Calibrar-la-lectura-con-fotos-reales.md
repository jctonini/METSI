---
id: METSI-1
title: Calibrar la lectura con fotos reales
status: To Do
assignee: []
created_date: '2026-11-01T16:41:00Z'
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
- [ ] #2 Una prueba en tests/run.js lee esos fixtures y compara con las respuestas esperadas
- [ ] #3 Si se ajusta un umbral, las pruebas existentes de V1 a V4 siguen pasando
<!-- AC:END -->
