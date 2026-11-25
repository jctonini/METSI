---
id: METSI-34
title: >-
  Guardar los recortes de nombre y registro más livianos para que entren más
  hojas en el dispositivo
status: In Progress
assignee:
  - '@claude'
created_date: '2026-11-25T21:10:54Z'
updated_date: '2026-11-25T21:13:57Z'
labels:
  - rendimiento
dependencies: []
ordinal: 34000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Medido en Chrome con 80 hojas sintéticas: el estado guardado pesa 4,62 M de caracteres y Chrome acepta ~5 M en localStorage, así que con ~86 hojas la app deja de guardar en el dispositivo. Casi todo son los recortes (crops): 56 KB por hoja (nombre 39 KB, registro 17 KB), guardados a 10 px/mm con JPEG 0,8 como texto base64. Solo se usan para mostrar lo manuscrito mientras el docente transcribe; la lectura y la firma de la letra salen de la foto, no de ellos. Achicarlos también reduce lo que viaja a Drive en datos.json (METSI-33). Cambia lo que se ve en pantalla: hay que revisar con una hoja real que la letra siga siendo legible.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Los recortes nuevos se guardan a menor resolución y calidad desde una sola constante fácil de ajustar
- [x] #2 Con 80 hojas sintéticas el estado guardado baja al menos a la mitad (medido en Chrome)
- [x] #3 La lectura del registro y la firma de la letra no cambian (se siguen calculando a partir de la foto)
- [x] #4 Las hojas ya guardadas con recortes grandes se siguen viendo bien
- [ ] #5 El docente revisó con una hoja real que el nombre y el registro siguen siendo legibles
- [x] #6 node tests/run.js pasa y se ejecutó node tools/version.js
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Hecho: toUrl en app-scan.js reduce el recorte al 70 % (7 px/mm) y lo guarda con JPEG 0,7; constantes CROP_SCALE y CROP_QUALITY. Barrido medido en Chrome con fotos sintéticas (KB por hoja de recortes): 1 / 0,8 = 56; 0,7 / 0,7 = 16; 0,7 / 0,6 = 11; 0,6 / 0,6 = 7; 0,5 / 0,6 = 5. Elegido 0,7 / 0,7. Con 80 hojas el estado guardado pasó de 4,62 M a 1,53 M de caracteres (tope de Chrome ~5 M): capacidad de ~86 a ~250 hojas. La lectura del registro y la firma siguen saliendo de la foto (el recorte de 10 px/mm de nameCrop se sigue usando para la firma; solo cambia lo que se guarda). Hojas guardadas antes (recorte de 1240x300) y nuevas (868x210) se ven juntas, probado en Chrome. PENDIENTE criterio 5: que el docente confirme con una hoja real que el nombre y el registro se leen bien; si no, subir CROP_SCALE a 0,85 o CROP_QUALITY a 0,8 (el costo sube a ~25-35 KB por hoja). Los sintéticos tienen recortes sin letra, así que el peso real puede ser mayor.
<!-- SECTION:NOTES:END -->
