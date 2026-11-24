---
id: METSI-23
title: 'Seguridad A: evitar inyección de HTML/JS (XSS) en la pantalla'
status: Done
assignee: []
created_date: '2026-11-24T02:19:09Z'
updated_date: '2026-11-24T02:52:52Z'
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
- [x] #1 Cada uso de innerHTML, outerHTML e insertAdjacentHTML en js/ está revisado y queda documentado en las notas de la tarea
- [x] #2 Todo texto que no sea fijo (nombres, archivos, datos importados o de Drive) se escapa o se inserta con textContent
- [x] #3 Hay pruebas en tests/run.js con textos maliciosos inventados que confirman que no se inyecta HTML
- [x] #4 Se corrió node tools/version.js y pasan todas las pruebas
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Revisión de innerHTML (24 usos): los textos variables ya pasaban por escapeHtml; los huecos eran los src de los recortes (crops) y el logo, que venían sin validar de Drive. Cambios: js/sanitize.js nuevo (safeImageUrl solo deja data:image en base64; isSafeId; cleanRemote valida el datos.json de Drive antes de mezclarlo o abrirlo y, si no tiene el formato esperado, la sincronización se frena sin pisar el archivo); safeImageUrl en los tres lugares donde se pegan recortes; escapeHtml extra en el panel de casos; esc de sheet.js ahora escapa la comilla simple; selector de hoja solo con ids válidos; js/drive.js valida los ids antes de armar URLs y búsquedas. Pruebas: 132 pasan (6 nuevas). NO se probó en un navegador real (ni la sincronización con una carpeta de Drive real).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Se cerraron los puntos A1-A4 y D1-D3 del informe: imágenes y ids validados, datos de Drive validados antes de usarse y escapes reforzados. Verificado con 132 pruebas (6 nuevas, con textos maliciosos inventados). Pendiente: probar en un navegador real que la app carga, que se ven los recortes y que sincroniza con Drive.
<!-- SECTION:FINAL_SUMMARY:END -->
