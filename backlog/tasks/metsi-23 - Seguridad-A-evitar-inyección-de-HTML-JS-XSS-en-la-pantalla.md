---
id: METSI-23
title: 'Seguridad A: evitar inyección de HTML/JS (XSS) en la pantalla'
status: To Do
assignee: []
created_date: '2026-11-24T02:19:09Z'
labels: []
dependencies: []
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
La app arma partes de la pantalla con innerHTML (unos 24 usos en js/). Si un texto escrito por el docente, leído de un archivo (nombre de foto, examen guardado, Drive) o importado llega sin escapar, podría ejecutar código en el navegador del docente. Hay que revisar cada uso y cerrar los huecos.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Cada uso de innerHTML, outerHTML e insertAdjacentHTML en js/ está revisado y queda documentado en las notas de la tarea
- [ ] #2 Todo texto que no sea fijo (nombres, archivos, datos importados o de Drive) se escapa o se inserta con textContent
- [ ] #3 Hay pruebas en tests/run.js con textos maliciosos inventados que confirman que no se inyecta HTML
- [ ] #4 Se corrió node tools/version.js y pasan todas las pruebas
<!-- AC:END -->
