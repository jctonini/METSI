---
id: METSI-10
title: Seleccionar hojas y quitar varias a la vez en Corregir
status: Done
assignee: []
created_date: '2026-11-08T20:46:00Z'
updated_date: '2026-11-08T20:48:00Z'
labels: []
dependencies: []
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Con ~80 hojas, quitar una por una (botón Quitar de cada tarjeta) es lento y propenso a errores, por ejemplo al cargar por error una tanda de prueba. Se necesita elegir hojas individualmente o todas y quitarlas juntas.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Cada tarjeta de hoja tiene una casilla para seleccionarla
- [x] #2 Hay un control Seleccionar todo / Deseleccionar todo
- [x] #3 Un botón Quitar seleccionadas muestra cuántas son, pide confirmación y las quita todas juntas, igual que el Quitar individual (las fotos originales de Drive no se borran)
- [x] #4 La selección se conserva al redibujar y se limpia al quitar; sin selección el botón está deshabilitado
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Barra sobre las tarjetas: casilla Seleccionar todo, contador y botón Quitar seleccionadas (index.html).
2. app-scan: Set de ids seleccionados; casilla en el encabezado de cada tarjeta; renderBulkBar actualiza contador/estado.
3. Quitar seleccionadas: confirm con cantidad, removeSheet por cada una, save y un solo renderCards.
4. Lógica de selección pura en js/selection.js con pruebas; verificación en Chromium.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verificado en Chromium (file://, 6 hojas sintéticas): casillas, contador, Seleccionar todo/ninguna, confirm con cantidad, quitar 2 y luego todas, barra oculta sin hojas. Suite 106 ok (1 fallo preexistente access.js). Quitar no borra archivos de Drive: solo marca la hoja como borrada en datos.json (drive.js no tiene función de borrar).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Casilla por hoja, Seleccionar todo, contador y Quitar seleccionadas con confirmación (js/selection.js + app-scan.js + index.html/css). Misma lógica de borrado que el Quitar individual. Probado en Chromium local con hojas sintéticas; falta verlo en producción.
<!-- SECTION:FINAL_SUMMARY:END -->
