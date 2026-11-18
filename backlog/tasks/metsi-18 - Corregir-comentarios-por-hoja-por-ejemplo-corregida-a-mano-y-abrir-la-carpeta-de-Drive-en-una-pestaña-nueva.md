---
id: METSI-18
title: >-
  Corregir: comentarios por hoja (por ejemplo, corregida a mano) y abrir la
  carpeta de Drive en una pestaña nueva
status: Done
assignee:
  - '@claude'
created_date: '2026-11-18T23:15:00Z'
updated_date: '2026-11-18T23:26:00Z'
labels:
  - corregir
  - drive
dependencies: []
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
En la solapa Corregir poder agregar comentarios a cada hoja (ejemplo: indicar que las respuestas se corrigieron a mano), y poder abrir una carpeta de Google Drive en una pestaña nueva desde ahí. Los comentarios no deben mezclarse con los nombres ni registros en los casos a revisar.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Cada hoja admite un comentario que se guarda y se exporta
- [x] #2 Hay un enlace que abre la carpeta de Drive en una pestaña nueva
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Comentario por hoja (sheet.comentario, siempre visible, con sugerencias como «Corregida a mano»): se guarda, viaja en datos.json y sale como última columna «Comentario» del CSV (no mueve las columnas existentes). No va a los casos a revisar. Botones «Abrir carpeta de fotos» y «Abrir carpeta del examen» (driveFolderId se guarda al sincronizar). Verificado en Chromium (Playwright); el enlace a Drive no se pudo cargar en el sandbox. Sin prueba automática en tests/run.js (no corre DOM).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Cada hoja tiene un comentario propio que se exporta al CSV como última columna, y hay dos botones para abrir en pestaña nueva la carpeta del examen y la de las últimas fotos elegidas en Drive. Probado en navegador; falta probar con Drive real.
<!-- SECTION:FINAL_SUMMARY:END -->
