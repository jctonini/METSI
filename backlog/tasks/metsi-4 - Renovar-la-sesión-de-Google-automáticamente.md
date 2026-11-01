---
id: METSI-4
title: Renovar la sesión de Google automáticamente
status: To Do
assignee: []
created_date: '2026-11-01T16:41:00Z'
labels:
  - drive
dependencies: []
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
La sesión de Google dura cerca de 1 hora; después los cambios dejan de subir solos y hay que tocar Sincronizar.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 El token se renueva antes de vencer sin pedir interacción cuando es posible
- [ ] #2 Si no se puede renovar sin interacción, se avisa con un botón para reconectar sin perder cambios
- [ ] #3 Hay pruebas con el Drive simulado para el vencimiento del token
<!-- AC:END -->
