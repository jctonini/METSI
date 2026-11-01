---
id: METSI-3
title: Reintentar y conservar cambios si falla la sincronización con Drive
status: Done
assignee:
  - '@claude'
created_date: '2026-11-01T16:41:00Z'
updated_date: '2026-11-01T17:02:00Z'
labels:
  - drive
dependencies: []
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Hoy, si syncNow falla, solo queda un aviso que dice que los cambios pendientes se pierden si se sigue. Un corte de red no debería poder perder correcciones.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Si la sincronización falla, la app reintenta con espera creciente un número limitado de veces
- [x] #2 Los cambios pendientes se conservan en el dispositivo y se vuelven a subir al reconectar
- [x] #3 El usuario ve un estado claro de pendiente de sincronizar
- [x] #4 Hay pruebas con el Drive simulado (tests/mockdrive.js) para el fallo y la recuperación
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. js/retry.js: reintento con espera creciente (módulo probado en Node).
2. js/drive.js: reintentar fallos de red y respuestas 408/429/5xx; un 401 pide un token nuevo y reintenta una vez.
3. js/app.js: tras un fallo, mostrar estado claro (cambios guardados en este dispositivo), reintentar solo con espera creciente y al volver la conexión (evento online).
4. Pruebas con tests/mockdrive.js (fallo y recuperación).
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implementado: js/retry.js (espera 1, 2, 4, 8 s, tope 15 s, 4 reintentos) usado por js/drive.js para cortes de red y 408/429/5xx; un 401 pide token nuevo y reintenta una vez. En la app: tras un fallo se muestra «No se pudo sincronizar… tus cambios (N) quedan guardados en este dispositivo», se reintenta solo a los 15 s, 30 s, 1, 2 y 5 min, y al volver la conexión (evento online). Hallazgo: las hojas y la configuración ya se guardaban en localStorage, pero las fotos pendientes de subir solo vivían en memoria y se perdían al recargar; se agregó js/photostore.js (IndexedDB) para conservarlas hasta que suban.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Sincronización con Drive con reintentos de espera creciente, estado claro de cambios guardados en el dispositivo, reintento automático y al volver la conexión, y copia local de las fotos pendientes (IndexedDB). Verificación: 14 pruebas nuevas en tests/run.js (100 en total, todas pasan) con Drive simulado que falla y se recupera; en Chromium con red cortada: aparece el aviso con los cambios guardados, se recarga la página sin perder la hoja ni la foto, y al volver la conexión sincroniza y limpia la copia local. Riesgo: IndexedDB no está disponible en algunas ventanas privadas; ahí la app funciona como antes (fotos solo en memoria).
<!-- SECTION:FINAL_SUMMARY:END -->
