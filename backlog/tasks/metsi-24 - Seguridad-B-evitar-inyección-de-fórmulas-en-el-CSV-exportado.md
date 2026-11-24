---
id: METSI-24
title: 'Seguridad B: evitar inyección de fórmulas en el CSV exportado'
status: To Do
assignee: []
created_date: '2026-11-24T02:19:09Z'
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
- [ ] #1 Las celdas de texto que empiezan con =, +, - , @, tab o retorno de carro se exportan neutralizadas
- [ ] #2 Los puntajes y registros numéricos legítimos no cambian
- [ ] #3 Hay pruebas en tests/run.js con valores inventados que cubren los casos peligrosos y los normales
- [ ] #4 Pasan todas las pruebas
<!-- AC:END -->
