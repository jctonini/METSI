---
id: METSI-33
title: 'Drive: sincronizar menos datos y con menos pedidos'
status: Done
assignee:
  - '@claude'
created_date: '2026-11-25T20:19:07Z'
updated_date: '2026-11-25T21:21:28Z'
labels:
  - rendimiento
dependencies: []
ordinal: 33000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Cada sincronización baja y vuelve a subir datos.json entero (incluye los recortes de nombre y registro de todas las hojas, ~2,7 MB estimados con 80 hojas) más unas 6 consultas, y se dispara sola 2,5 s después de cualquier edición. Las fotos nuevas suben de a una con 2 pedidos cada una. Medir el tamaño real con localStorage.getItem('metsi.corrector.v1').length.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Se recuerdan los IDs de datos.json, resultados.csv y la carpeta para no consultarlos en cada sincronización
- [x] #2 No se baja datos.json si no cambió desde la última sincronización
- [x] #3 Las fotos nuevas se suben de a 3 o 4 a la vez, con reintentos como hasta ahora
- [x] #4 Las pruebas con tests/mockdrive.js cubren el fallo y la recuperación (METSI-3) y siguen pasando
- [x] #5 node tests/run.js pasa y se ejecutó node tools/version.js
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. js/drive.js: cache de IDs por carpeta (known), prime(carpeta) con una sola consulta, forget(carpeta); upsertFileInfo devuelve {id, md5Checksum}; fileMd5 y readJsonIfChanged(carpeta, nombre, md5Conocido) para no bajar datos.json si no cambió. Si un ID en caché da 404, se vuelve a buscar y crear. 2. js/batch.js: mapLimit(items, límite, fn). 3. js/app-drive.js: recordar la carpeta del examen en la sesión, usar readJsonIfChanged, subir fotos de a 3 y olvidar la caché si la sincronización falla. 4. tests/mockdrive.js: soportar fields=md5Checksum y GET de metadatos; pruebas de cantidad de pedidos, 404 en caché, md5 y mapLimit.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Hecho: js/drive.js recuerda los IDs de archivos por carpeta (prime: una consulta por carpeta y sesión; forget/forgetAll tras un error), upsertFileInfo devuelve md5Checksum, fileMd5 y readJsonIfChanged evitan bajar datos.json si no cambió; si un ID recordado da 404 se crea de nuevo. js/batch.js: mapLimit (fotos de a 3). js/app-drive.js: carpeta del examen recordada en la sesión; syncCases hace prime de a-revisar. Medido en Chrome con un Drive simulado (tests/mockdrive.js, 60 ms de latencia por pedido) contra la misma rama sin esta tarea, 20 hojas: 1.ª sincronización 49 -> 27 pedidos (25 -> 3 búsquedas) y 3,7 s -> 1,3 s; 2.ª sincronización (1 cambio) 13 -> 8 pedidos y de bajar 0,38 MB a 0. Verificado: un cambio hecho desde otro equipo en datos.json sí se recibe; las 20 fotos y datos.json quedan en Drive. 144 pruebas pasan (6 nuevas). NO probado contra Google Drive real ni con la red del celular: el inicio de sesión de Google se simuló.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Sincronizar con Drive hace menos pedidos y baja menos datos: no vuelve a buscar archivos que ya conoce, no baja datos.json si no cambió y sube las fotos de a 3. Medido con un Drive simulado; falta probar con tu cuenta real.
<!-- SECTION:FINAL_SUMMARY:END -->
