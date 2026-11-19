---
id: METSI-19
title: >-
  Lectura: la grilla de respuestas queda corrida una fila en fotos con el papel
  curvado
status: In Progress
assignee:
  - '@claude'
created_date: '2026-11-19T03:46:00Z'
updated_date: '2026-11-19T03:46:00Z'
labels:
  - lectura
dependencies: []
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Tanda del 19/11 (11 hojas con foto): la pregunta 1 no se detectaba nunca y todas las respuestas se leían una fila corridas. Causa: las cuatro marcas de las esquinas fijan la grilla como si la hoja fuera un plano; con la hoja sobre una pila, curvada y con la foto inclinada, el interior se corre hasta ~5 mm (una fila mide 5,5 mm). Arreglo: ajustar cada columna de respuestas a los aros impresos de la foto (desplazamiento, escalas, inclinación) con castigo a engancharse a la fila vecina.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Con las 11 fotos de la tanda 2, la lectura coincide con la corrección final salvo marcas ambiguas
- [x] #2 La tanda 1 no empeora
- [x] #3 Prueba sintética de papel curvado que falla sin el ajuste
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Medido contra la corrección final del docente (preguntas con verdad conocida; las no corregidas se asumen bien leídas, así que es una aproximación): tanda 2 de 113/220 mal con el código anterior (0/11 hojas perfectas) a 10/220 (5/11) con umbral 0,18; tanda 1 de 5/259 a 0/259 (13/13). El umbral 0,18 se eligió mirando esas mismas dos tandas (no hay hojas reservadas). Modalidad: 10/11 bien reconocidas. Registro: no se pudo revalidar con la tanda 2 (las fotos guardadas lo traen tapado); se amplió la búsqueda del casillero a ±3,5 mm en x y ±5 mm en y y se verificó que la tanda 1 sigue en 14/14. Probado en Chromium con una foto real cargada por el flujo de la app. No probado en celular ni Vercel. Fixtures nuevos en tests/fixtures/real (sin nombres, registros ni notas).
<!-- SECTION:NOTES:END -->
