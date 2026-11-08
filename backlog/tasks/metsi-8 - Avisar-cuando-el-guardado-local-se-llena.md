---
id: METSI-8
title: Avisar cuando el guardado local se llena
status: Done
assignee: []
created_date: '2026-11-08T19:15:00Z'
updated_date: '2026-11-08T19:17:00Z'
labels: []
dependencies: []
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
save() ignora en silencio el error de localStorage (js/app-core.js). Con ~80 hojas (recortes y firmas) el estado puede acercarse al tope de ~5 MB; si se llena, los cambios no sincronizados a Drive se pierden sin aviso.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Si localStorage rechaza el guardado, la app muestra un aviso visible y persistente
- [x] #2 El aviso desaparece cuando un guardado posterior funciona
- [x] #3 Hay una prueba que simula el error de cuota
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. save() devuelve si pudo guardar; guarda el error de cuota.
2. Banner persistente en la app (junto a la barra de sincronización) cuando falla; se oculta al volver a guardar bien.
3. Prueba con un localStorage simulado que lanza QuotaExceededError.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Lógica en js/storage.js con prueba de cuota simulada. El banner no se probó en un navegador real. Suite: 103 ok, único fallo tests/access.js (preexistente, falta módulo Supabase).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
save() ya no ignora los errores: js/storage.js avisa al cambiar el estado y app-core muestra/oculta un banner #storage-warn en la cabecera. Verificado con prueba unitaria; falta ver el banner en un navegador.
<!-- SECTION:FINAL_SUMMARY:END -->
