---
id: METSI-17
title: >-
  Examen: importar y exportar la configuración y la clave en un archivo
  compartido con la skill de armar exámenes
status: To Do
assignee: []
created_date: '2026-11-18T23:15:00Z'
labels:
  - examen
dependencies: []
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Importar en la solapa Examen: cantidad de preguntas, cantidad de opciones, respuestas correctas, puntaje y penalización. La skill que arma exámenes tiene que exportar lo mismo. Es el mismo archivo y el mismo proceso para ambos: definir un formato único (JSON o CSV), documentarlo y probarlo con el archivo que genera la skill.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Formato de archivo único definido y documentado
- [ ] #2 La solapa Examen importa preguntas, opciones, clave, puntaje y penalización
- [ ] #3 La skill exporta el mismo formato
- [ ] #4 Pruebas de ida y vuelta
<!-- AC:END -->
