---
id: METSI-11
title: Proponer el número de registro leyendo los casilleros (OCR local)
status: Done
assignee:
  - '@claude'
created_date: '2026-11-08T21:52:00Z'
updated_date: '2026-11-08T22:04:00Z'
labels:
  - lectura
dependencies: []
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Hoy el docente tipea a mano el número de registro de cada hoja mirando el recorte de la foto. La app ya sabe dónde está cada casillero de dígito (layout.fields.regBoxes), así que puede proponer una lectura y dejar que el docente solo la confirme o la corrija. Decisión del docente: el reconocimiento corre 100% en el dispositivo (sin enviar recortes a ningún servicio externo), para no cambiar lo que promete el README sobre privacidad. Alcance inicial: solo el registro (dígitos en casilleros); el nombre manuscrito queda fuera. No hay fotos reales con letra a mano en el repositorio, así que la precisión real hay que medirla con las correcciones del docente una vez en uso.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Al cargar una hoja, la app lee cada casillero del registro y propone el número en el campo N° de registro, mostrado como sugerido (distinto de lo ya confirmado)
- [x] #2 Un registro sugerido no cuenta como cargado hasta que el docente lo confirma o lo edita: no habilita exportar ni dispara la detección de repetidos antes de confirmarse
- [x] #3 Los casilleros vacíos o con lectura poco segura se marcan como dudosos y no se rellenan con un dígito inventado
- [x] #4 El reconocimiento corre en el navegador: ninguna imagen ni recorte sale del dispositivo y no se agregan llamadas a servicios externos
- [x] #5 Hay pruebas en tests/run.js (dígitos sintéticos y casilleros vacíos) y las pruebas existentes de V1 a V4 siguen pasando
- [x] #6 El README y docs/guia-de-uso.md explican el flujo de confirmar o corregir y dicen con honestidad que la lectura de letra a mano puede fallar
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Modelo: red convolucional chica entrenada con MNIST (tools/train-digits.py, reproducible) y exportada como pesos en js/digit-model.js; sin dependencias nuevas en el navegador (nada de wasm ni CDN).
2. js/digits.js (UMD, probado en Node): recorta cada casillero con cropRegion, saca el borde impreso, binariza, detecta casillero vacío, centra y escala al estilo MNIST, corre la red y devuelve dígito + confianza (dudoso si la confianza es baja o el segundo candidato está cerca).
3. app-scan.js: al cargar la hoja se guarda sheet.regAuto (dígitos leídos y dudosos); sheet.registro NO se completa hasta que el docente confirma (botón Usar lectura) o escribe. Así exportar y repetidos siguen dependiendo solo de lo confirmado.
4. UI en Corregir: el recorte con la lectura al lado, dígitos dudosos resaltados, botón de confirmar.
5. Pruebas: dígitos MNIST de prueba dibujados en una foto sintética (tests/synth.js) + casilleros vacíos + dudosos; las pruebas V1-V4 deben seguir pasando.
6. Documentar en README y guía de uso, incluyendo la precisión medida y la advertencia de que con letra real puede fallar.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Modelo: MLP 784-128-64-10 entrenado con MNIST + variaciones (tools/train-digits.py, 30 épocas): 98,9 % en MNIST limpio y 96,2 % con deformaciones fuertes; cuantizado a 8 bits sin pérdida apreciable (146 KB). Recorrido completo sobre fotos sintéticas V1-V4: 99,6-100 % de casilleros, sin errores silenciosos con trazo fino/grueso y dígitos chicos/grandes; con el borde impreso desalineado >=0,9 mm baja a ~92-94 % (casi todo marcado dudoso). Corregido en el camino: un «1» se descartaba como resto de borde. Verificado en Chromium con la app real (cargar 2 fotos, confirmar, usar y revisar, sin errores de consola). Pendiente de datos reales: no hay fotos con letra a mano; la métrica real es la línea «acertó X de Y casilleros» de la pestaña Corregir.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
La app lee los casilleros del registro en el navegador (sin servicios externos) y muestra la lectura como sugerencia junto al recorte; el campo no se completa ni la hoja cuenta como identificada hasta que el docente toca ✓ Es correcto o escribe el número. Casilleros vacíos quedan vacíos (se cargan como «?») y los dudosos se resaltan. Pruebas: 113 en verde (nuevas: modelo, V1-V4, el «1», vacíos con borde corrido, privacidad de casos) y prueba manual en Chromium. Riesgo: la precisión con letra real es desconocida (lo medido es con dígitos MNIST sobre fotos sintéticas); la app muestra el porcentaje de aciertos con las hojas reales. Posible seguimiento: leer también el nombre, y recalibrar con los registros corregidos.
<!-- SECTION:FINAL_SUMMARY:END -->
