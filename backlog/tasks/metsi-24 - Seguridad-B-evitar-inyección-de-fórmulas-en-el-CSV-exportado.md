---
id: METSI-24
title: 'Seguridad B: evitar inyección de fórmulas en el CSV exportado'
status: Done
assignee: []
created_date: '2026-11-24T02:19:09Z'
updated_date: '2026-11-24T02:47:43Z'
labels: []
dependencies: []
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Si un nombre o comentario empieza con =, +, - o @, Excel o Google Sheets pueden tomarlo como fórmula al abrir el CSV de js/csv.js (inyección de fórmulas). El docente abre ese archivo con nombres escritos por terceros, así que hay que neutralizarlo sin alterar los datos legítimos.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Las celdas de texto que empiezan con =, +, - , @, tab o retorno de carro se exportan neutralizadas
- [x] #2 Los puntajes y registros numéricos legítimos no cambian
- [x] #3 Hay pruebas en tests/run.js con valores inventados que cubren los casos peligrosos y los normales
- [x] #4 Pasan todas las pruebas
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. En js/csv.js, neutralizar (anteponer una comilla simple) las celdas de texto que empiecen con =, +, - , @, tab o retorno de carro.
2. Dejar sin cambios los números legítimos (por ejemplo 7,5 o -0,33) y los valores numéricos.
3. Pruebas en tests/run.js con valores inventados peligrosos y normales.
4. node tools/version.js y node tests/run.js.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Se antepone una comilla simple a los textos que empiezan con = + - @ tab o retorno de carro; los números sueltos (7,5 o -0,33) no se tocan. Aplica a CSV, TSV y al resultados.csv de Drive porque todo pasa por toDelimited. Pruebas: 126 pasan (node tests/run.js, con npm install). No se probó abriendo el archivo en Excel ni en Google Sheets reales.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
toDelimited neutraliza las celdas de texto que Excel o Sheets tomarían como fórmula. Verificado con una prueba nueva en tests/run.js (valores peligrosos y normales inventados) y con las 126 pruebas pasando. Pendiente: probarlo a mano abriendo un CSV con un nombre que empiece con = en Excel o Sheets.
<!-- SECTION:FINAL_SUMMARY:END -->
