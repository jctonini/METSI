---
id: METSI-4
title: Renovar la sesión de Google automáticamente
status: Done
assignee:
  - '@claude'
created_date: '2026-11-01T16:41:00Z'
updated_date: '2026-11-01T17:02:00Z'
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
- [x] #1 El token se renueva antes de vencer sin pedir interacción cuando es posible
- [x] #2 Si no se puede renovar sin interacción, se avisa con un botón para reconectar sin perder cambios
- [x] #3 Hay pruebas con el Drive simulado para el vencimiento del token
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. js/auth.js: administrador de token (cache, renovación antes de vencer, estado 'needs-login') probado con reloj falso.
2. js/app.js: usar el administrador en lugar del token suelto; botón Reconectar cuando no se pueda renovar sin interacción.
3. Pruebas con reloj falso.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
js/auth.js: administrador de token con reutilización, pedido compartido entre llamadas simultáneas, renovación 5 minutos antes de vencer y estado needs-login. La app usa GIS con prompt vacío: sin interacción cuando Google ya tiene la sesión y el permiso; si el navegador bloquea la ventana, el botón pasa a «Reconectar con Google». Límite: depende de que Google acepte la renovación silenciosa; no se probó contra Google real, solo con un GIS simulado.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
El token de Google se renueva solo 5 minutos antes de vencer. Si no se puede renovar sin interacción, la barra de sincronización avisa y ofrece «Reconectar con Google» sin perder cambios. Verificación: 5 pruebas con reloj falso en tests/run.js y una prueba en Chromium con reloj simulado (primer token, renovación a los 55 min, fallo con ventana bloqueada, botón Reconectar y recuperación). No se probó con el inicio de sesión real de Google.
<!-- SECTION:FINAL_SUMMARY:END -->
