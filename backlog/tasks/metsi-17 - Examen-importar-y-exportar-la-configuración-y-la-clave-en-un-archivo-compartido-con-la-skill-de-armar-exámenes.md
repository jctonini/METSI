---
id: METSI-17
title: >-
  Examen: importar y exportar la configuración y la clave en un archivo
  compartido con la skill de armar exámenes
status: In Progress
assignee:
  - '@claude'
created_date: '2026-11-18T23:15:00Z'
updated_date: '2026-11-18T23:30:00Z'
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
- [x] #1 Formato de archivo único definido y documentado
- [x] #2 La solapa Examen importa preguntas, opciones, clave, puntaje y penalización
- [ ] #3 La skill exporta el mismo formato
- [x] #4 Pruebas de ida y vuelta
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Formato JSON único (metsi-examen v1) en js/examfile.js + docs/formato-examen.md; botones Importar/Exportar examen en la solapa Examen (valida y lista todos los errores juntos; si cambia la estructura y hay hojas corregidas, avisa y se puede cancelar sin cambios). Pruebas de ida y vuelta y de errores en tests/run.js; verificado en Chromium. PENDIENTE (AC 3): la skill que arma exámenes vive fuera de este repositorio y hay que actualizarla para que exporte este formato; no se hizo.
<!-- SECTION:NOTES:END -->
