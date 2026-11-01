---
id: METSI-3
title: Reintentar y conservar cambios si falla la sincronización con Drive
status: To Do
assignee: []
created_date: '2026-11-01T16:41:00Z'
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
- [ ] #1 Si la sincronización falla, la app reintenta con espera creciente un número limitado de veces
- [ ] #2 Los cambios pendientes se conservan en el dispositivo y se vuelven a subir al reconectar
- [ ] #3 El usuario ve un estado claro de pendiente de sincronizar
- [ ] #4 Hay pruebas con el Drive simulado (tests/mockdrive.js) para el fallo y la recuperación
<!-- AC:END -->
