---
id: METSI-16
title: 'Drive: poder editar el nombre de las carpetas'
status: Done
assignee:
  - '@claude'
created_date: '2026-11-18T23:15:00Z'
updated_date: '2026-11-18T23:25:00Z'
labels:
  - drive
dependencies: []
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
En la solapa Drive tiene que poder editarse el nombre de las carpetas (hoy no). Recordar el permiso mínimo drive.file de AGENTS.md.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Se puede renombrar una carpeta creada por la app desde la solapa Drive
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Botón «Renombrar» en la lista de exámenes de la solapa Drive. El nombre propio queda en state.driveFolderCustom y tiene prioridad sobre el automático (la sincronización no lo pisa); vacío vuelve al automático (solo del examen abierto). Al abrir un examen cuya carpeta tiene otro nombre en Drive, se respeta. Verificado en Chromium con Drive simulado (renameFolder). Sin probar con Drive real; no hay prueba automática (no corre DOM).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Se puede renombrar la carpeta de cada examen desde la solapa Drive. El nombre elegido se respeta en las sincronizaciones siguientes. Probado en navegador con Drive simulado; falta probarlo con tu Drive real.
<!-- SECTION:FINAL_SUMMARY:END -->
