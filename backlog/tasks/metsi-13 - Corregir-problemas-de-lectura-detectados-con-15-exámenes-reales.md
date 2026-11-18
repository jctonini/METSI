---
id: METSI-13
title: Corregir problemas de lectura detectados con 15 exámenes reales
status: In Progress
assignee:
  - '@claude'
created_date: '2026-11-18T22:56:00Z'
updated_date: '2026-11-18T22:56:00Z'
labels:
  - lectura
dependencies: []
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Primer uso con 15 exámenes reales (20 preguntas, 5 opciones, hoja V4): la app marca de más en las respuestas (75 de 269 preguntas mal leídas con sensibilidad 0,085), lee mal el primer dígito del registro (9 → 4/2/5) y la X del casillero tachado, recorta mal el nombre, no reconoce la modalidad marcada con ⊗ y una hoja falla por las esquinas (grampa sobre la marca).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 La sensibilidad por defecto lee los casos reales con muchos menos errores y las pruebas V1-V4 pasan
- [ ] #2 El registro de las hojas reales se lee mejor (casillero tachado con X cuenta como vacío)
- [ ] #3 El recorte del nombre muestra todo lo escrito
- [ ] #4 La hoja con grampa sobre la marca de la esquina se lee
- [ ] #5 Quedan fixtures reales sin nombres ni registros (METSI-1)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Sensibilidad: Normal pasa a 0,16 (migración de escala 3 a 4), ajustar opciones y pruebas.
2. Esquinas: tolerar grampa sobre la marca (SQUARE_MAX) con prueba.
3. Fixtures reales sin notas ni registros en tests/fixtures/real (METSI-1).
4. Registro: ubicar mejor los casilleros, agrandar recorte, X = vacío; reentrenar con dígitos de las hojas.
5. Nombre: recorte más alto/ancho.
6. Modalidad: aviso claro, la elige el docente.
<!-- SECTION:PLAN:END -->
