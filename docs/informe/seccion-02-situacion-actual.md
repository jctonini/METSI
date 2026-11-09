# Sección 2 · La situación actual (borrador)

> **Fuente:** respuestas del autor del 2026-11-09 (cómo marcan los alumnos, cómo se corrige, adónde van las notas, cómo se identifica a cada alumno, cómo se pesan las incorrectas y el proceso completo por carillas). Presupuesto: ~350 palabras en el informe. Lo que falta confirmar está marcado **[VALIDAR]** o **[COMPLETAR]**.

## Texto para el informe

Hoy corrijo los exámenes completamente a mano, y no examen por examen sino **por lotes**. El proceso, paso por paso:

1. **Los alumnos rinden en papel.** Marcan sus respuestas directamente en el examen impreso, que tiene cuatro carillas, y anotan sus datos: nombre, número de registro y modalidad de cursada.
2. **Corrijo por carillas, con la clave de respuestas impresa.** Primero todas las carillas 4 de todos los exámenes; después volteo la pila y sigo con la carilla 3, luego la 2 y por último la 1. Como una pregunta puede tener varias respuestas correctas, el puntaje de la pregunta se reparte entre ellas, se reconoce puntaje parcial y en el cálculo final de cada pregunta entran también las respuestas incorrectas. Por ejemplo, si en una pregunta de dos correctas marcó una correcta y una incorrecta, le doy solo el puntaje de la respuesta correcta **[COMPLETAR otros casos]**.
3. **Sumo los puntos, examen por examen.** Junto los puntos de las cuatro carillas y anoto la nota en el frente del examen.
4. **Ordeno todos los exámenes por número de registro**, de menor a mayor.
5. **Paso las notas a una planilla de Excel**, con los datos de cada alumno, y verifico contra el listado de inscriptos que estén todos, que no haya repetidos y que ningún examen haya quedado sin identificar.
6. **Comparto las notas con los alumnos.**
7. **Subo las notas a MiEcon**, la web de la facultad.
8. **Aplico el criterio de aprobación** sobre la planilla **[VALIDAR en qué momento]**. Eso lo decido yo después de ver los puntajes.

Como el trabajo se hace por lotes, **el tiempo por examen no se puede medir directamente**: se obtiene haciendo todo el proceso para el conjunto de exámenes y dividiendo por la cantidad. No lo cronometré. Mi estimación, sin medir, es de entre 4 y 5 minutos por examen, con unos 80 alumnos por turno. Los pasos que más consumen son corregir por carillas, sumar, ordenar los exámenes y volver a tipear los datos en la planilla, y todos dependen de mi atención.

## Qué cambia con la herramienta (material para el diagrama de «hoy» y «propuesto»)

| Paso de hoy | Hoy | Con METSI Corrector |
|---|---|---|
| 1. Cómo marcan los alumnos | En el examen impreso, de cuatro carillas | En una **hoja de respuestas A5** aparte, con birome, que se fotografía |
| 2. Corregir | A mano, por carillas, con la clave impresa y pilas de exámenes | **La app lee todas las marcas** de la foto de cada hoja y las compara con la clave cargada; no hay pilas ni carillas |
| 3. Sumar los puntos | A mano, examen por examen | **La app calcula el puntaje** de cada pregunta y el total (reparto entre correctas, puntaje parcial y las incorrectas con un peso configurable de 0 a 1) |
| 4. Ordenar por registro | Ordeno físicamente todos los exámenes de menor a mayor | **La tabla de resultados sale ordenada por registro** (se verificó en `js/app-results.js`), así que no hace falta ordenar papeles; necesita el registro confirmado |
| 5. Pasar a Excel y verificar contra el listado de inscriptos | Tipeo cada dato y cada nota; verifico a ojo contra el listado | **Exporta un CSV** para Excel o Google Sheets. Lo escrito que la app identifica no se vuelve a tipear (marcas, modalidad, puntaje; el registro como **sugerencia** que se confirma); el **nombre** se escribe mirando el recorte. La app **frena repetidos y hojas sin identificar**, pero **no compara con el listado de inscriptos** |
| 6. Compartir con los alumnos | Manual | **Sigue manual** |
| 7. Subir a MiEcon | Manual | **Sigue manual** (la app no se conecta con MiEcon) |
| 8. Criterio de aprobación | Lo aplico yo | **Lo sigo aplicando yo**: la app solo calcula el puntaje |

## Observaciones útiles para el resto del informe
- **Qué cambia de verdad:** corregir, sumar, ordenar y gran parte de pasar a Excel. Es lo que el autor describe como ahorro: lo que está escrito y la herramienta identifica no se vuelve a tipear (2026-11-09).
- **Qué sigue igual:** compartir las notas, subirlas a MiEcon y el control contra el listado de inscriptos. Mejora posible para la sección 9: comparar el CSV exportado con el listado de inscriptos.
- **Límites del ahorro:** el nombre sigue siendo manual; el registro es una sugerencia que hay que confirmar y su precisión con hojas reales **no está medida**; si la lectura falla, corregir cuesta tiempo.
- **Cambio de proceso para los alumnos:** pasan de marcar en el examen de cuatro carillas a usar una hoja de respuestas aparte. La hoja aclara que, en caso de diferencias, **prevalecen las respuestas marcadas en la hoja** (decisión del autor, N.º 17).
- **Cómo se mide el tiempo, en ambos métodos:** proceso completo de un lote dividido por la cantidad de exámenes del lote (ver `valor-y-costo.md`).
