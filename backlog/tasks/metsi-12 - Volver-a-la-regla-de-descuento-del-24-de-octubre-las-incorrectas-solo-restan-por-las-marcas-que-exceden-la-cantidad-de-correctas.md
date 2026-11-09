---
id: METSI-12
title: >-
  Volver a la regla de descuento del 24 de octubre (las incorrectas solo restan
  por las marcas que exceden la cantidad de correctas)
status: Done
assignee:
  - '@claude'
created_date: '2026-11-09T17:41:00Z'
updated_date: '2026-11-09T17:43:00Z'
labels: []
dependencies: []
references:
  - docs/informe/valor-y-costo.md
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
El 2026-11-09 el autor declaró cómo puntúa a mano cinco casos (ver docs/informe/valor-y-costo.md). Esos valores coinciden en 4 de 5 casos con la regla que tenía la app el 24 de octubre (commit 78d0f53: las incorrectas solo restan por las marcas que exceden la cantidad de correctas) y en 3 de 5 con la regla actual (cada incorrecta resta siempre; marcar todas vale 0 si las correctas son la mitad o menos). La diferencia es de forma de la regla, no de valor del descuento, así que ningún valor la arregla. El autor decidió volver a la regla del 24 de octubre para que la comparación del 18 de noviembre (puntajes de la app contra su corrección a mano) mida la herramienta y no una diferencia de regla.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Con descuento 0,33 y una pregunta de 1 punto con 4 opciones, scoreQuestion da 0,5 si el alumno marca A y C con correctas A y B, 0,67 si marca A y C con correcta A, 0,835 si marca A, B y C con correctas A y B, y 0,89 si marca las cuatro con correctas A, B y C
- [x] #2 Marcar tantas opciones como correctas hay no descuenta; solo restan las incorrectas que exceden esa cantidad, y una pregunta nunca baja de 0
- [x] #3 Se elimina la regla de marcar todas vale 0; marcar las cuatro con dos correctas da 0,67 con descuento 0,33 (el autor declaró 0,5: queda anotado como diferencia abierta)
- [x] #4 La ayuda de la pestaña Examen, su ejemplo, el README y el diccionario de datos describen la regla nueva
- [x] #5 node tests/run.js pasa con las pruebas actualizadas y node tools/version.js fue ejecutado
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. js/scoring.js: quitar la regla de marcar todas (markedAll) y el parámetro numOptions; las incorrectas penalizan solo por min(incorrectas, max(0, marcas - cantidad de correctas)), como en el commit 78d0f53. 2. Quitar numOptions de los llamados (js/app-core.js scoreOf, js/app-exam.js ejemplo). 3. Actualizar la ayuda de index.html, el ejemplo de la pestaña Examen, el README y docs/informe/diccionario-de-datos.md y anexo-f. 4. tests/run.js: reemplazar las pruebas de marcar todas por las de la regla del 24/10 con los cinco valores declarados. 5. node tools/version.js y node tests/run.js.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-09: js/scoring.js vuelve a la regla del commit 78d0f53 (penalized = min(incorrectas, max(0, marcas - cantidad de correctas))); se quitó el parámetro numOptions de scoreQuestion y scoreSheet y de sus llamados (js/app-core.js, js/app-exam.js). Pruebas: la prueba de marcar todas se reemplazó por una con los cinco valores declarados por el autor y otros casos; node tests/run.js: 115 pasaron, 0 fallaron; node tools/version.js ejecutado (versión 8a187cf6). Diferencia abierta: marcar las cuatro con dos correctas da 0,67 con la regla y el autor declaró 0,5. Sin verificar en un navegador: el texto de ayuda de la pestaña Examen (index.html) y su ejemplo (js/app-exam.js); la lógica que usa el ejemplo sí está cubierta por las pruebas.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
El puntaje vuelve a la regla del 24 de octubre: las incorrectas solo restan por las marcas que exceden la cantidad de respuestas correctas, y se eliminó la regla de marcar todas vale 0. Motivo: el criterio de corrección manual del autor (declarado el 2026-11-09) coincide en 4 de 5 casos con esta regla y en 3 de 5 con la anterior, y la comparación del 18 de noviembre debe medir la herramienta y no una diferencia de regla. Verificación: los valores declarados (0,5; 0,67; 0,835; 0,89) y el caso abierto (0,67 de la regla contra 0,5 del autor) quedan fijados en tests/run.js; 115 pruebas pasan. Documentación actualizada: ayuda y ejemplo de la pestaña Examen, README, diccionario de datos y anexo F del informe. Riesgos y seguimiento: la diferencia abierta de marcar las cuatro con dos correctas se confirma el 18 de noviembre; la ayuda de la pestaña Examen no se probó en un navegador. El puntaje no se guarda: se calcula al mostrar y al exportar, así que las hojas ya cargadas se recalculan con la regla nueva al abrir la versión nueva, y un resultados.csv que ya esté en Drive se actualiza en la próxima sincronización.
<!-- SECTION:FINAL_SUMMARY:END -->
