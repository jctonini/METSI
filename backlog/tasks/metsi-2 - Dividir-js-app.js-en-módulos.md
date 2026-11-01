---
id: METSI-2
title: Dividir js/app.js en módulos
status: Done
assignee:
  - '@claude'
created_date: '2026-11-01T16:41:00Z'
updated_date: '2026-11-01T17:02:00Z'
labels:
  - refactor
dependencies: []
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
js/app.js tiene más de 1.100 líneas y mezcla interfaz, sincronización con Drive y flujos de corrección; cada cambio obliga a leer todo el archivo.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 js/app.js queda como punto de entrada y la lógica se separa en módulos con una responsabilidad cada uno
- [x] #2 El comportamiento visible de la app no cambia
- [x] #3 node tests/run.js pasa y node tools/version.js se ejecutó
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Antes de tocar nada: guardar un resumen de la prueba de punta a punta en Chromium (foto sintética -> hoja -> recarga -> sincronización) como línea de base.
2. Hacer estable el objeto state (replaceState en lugar de reasignarlo) para poder repartirlo entre archivos.
3. Separar js/app.js en: app-core.js (estado y almacenamiento), app-exam.js (examen y hoja), app-scan.js (corregir y casos a revisar), app-results.js (resultados y CSV), app-drive.js (sincronización) y app.js (arranque y pestañas). Comunicación por un objeto compartido MetsiApp.
4. Verificar con ESLint (no-undef) que ningún archivo use nombres de otro, y repetir la prueba de punta a punta comparando con la línea de base.
5. Actualizar index.html, tools/version.js y el README.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
js/app.js (1.181 líneas) quedó en 6 archivos: app-core 98, app-exam 181, app-scan 538, app-results 105, app-drive 259 y app 49. Se compartieron las referencias por window.MetsiApp y state dejó de reasignarse (replaceState). ESLint no-undef sin errores en los 6 archivos y todas las referencias App.* están exportadas. app-scan.js sigue siendo grande (538 líneas); se puede dividir más adelante.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
js/app.js se separó en app-core, app-exam, app-scan, app-results, app-drive y app, y el README lista cada módulo. Verificación: la prueba de punta a punta en Chromium (foto sintética, hoja, recarga, sincronización) da exactamente el mismo resultado que antes de dividir; recorrido adicional de duplicados, banderas, descarga de casos, borrar todo y nuevo examen sin errores; ESLint no-undef limpio; node tests/run.js pasa y node tools/version.js fue ejecutado. Nota: el recorrido de punta a punta no se agregó al repositorio porque requeriría Playwright como dependencia.
<!-- SECTION:FINAL_SUMMARY:END -->
