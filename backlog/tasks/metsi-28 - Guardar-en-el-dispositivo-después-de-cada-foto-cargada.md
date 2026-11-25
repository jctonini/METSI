---
id: METSI-28
title: Guardar en el dispositivo después de cada foto cargada
status: Done
assignee:
  - '@claude'
created_date: '2026-11-25T20:19:03Z'
updated_date: '2026-11-25T20:20:55Z'
labels:
  - rendimiento
dependencies: []
ordinal: 28000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
processFiles solo llama a save() al terminar toda la tanda. Si la pestaña se cierra o se recarga en la foto 60 de 80 (por ejemplo por falta de memoria en el celular), las hojas ya leídas se pierden y las copias de las fotos en IndexedDB quedan huérfanas. Salió de la revisión de arquitectura del 25/11/2026.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Después de cada hoja agregada o fallida, el estado queda guardado en el dispositivo
- [x] #2 Hay una prueba que simula un corte a mitad de una tanda y comprueba que las hojas ya cargadas se conservan
- [x] #3 node tests/run.js pasa y se ejecutó node tools/version.js
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Nuevo js/batch.js (runBatch) usado por processFiles: save() después de cada foto; un error en una foto ya no corta la tanda. Pruebas en tests/run.js (135 pasan, incluida la de acceso tras npm install). NO probado en un navegador real ni en celular. Efecto a verificar allí: como ahora se guarda por foto, la sincronización automática con Drive (2,5 s sin cambios) puede arrancar en medio de una tanda larga.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Las hojas se guardan en el dispositivo después de cada foto, no solo al final de la tanda. Verificado con pruebas en Node; falta probar en navegador/celular.
<!-- SECTION:FINAL_SUMMARY:END -->
