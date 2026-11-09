# Sección 2 · La situación actual (borrador)

> **Fuente:** respuestas del autor del 2026-11-09 (cómo marcan los alumnos, cómo se corrige, adónde van las notas, cómo se identifica a cada alumno, cómo se pesan las incorrectas y el proceso completo por carillas). Presupuesto: ~350 palabras en el informe. Lo que falta confirmar está marcado **[VALIDAR]** o **[COMPLETAR]**.

## Texto para el informe

Hoy corrijo los exámenes completamente a mano, y no examen por examen sino **por lotes**. El proceso, paso por paso:

1. **Los alumnos rinden en papel.** Marcan sus respuestas directamente en el examen impreso, que tiene cuatro carillas, y anotan sus datos: nombre, número de registro y modalidad de cursada.
2. **Corrijo por carillas, con la clave de respuestas impresa.** Primero todas las carillas 4 de todos los exámenes; después volteo la pila y sigo con la carilla 3, luego la 2 y por último la 1. Como una pregunta puede tener varias respuestas correctas, el puntaje de la pregunta se reparte entre ellas, se reconoce puntaje parcial y en el cálculo final de cada pregunta entran también las respuestas incorrectas. Por ejemplo, si en una pregunta de dos correctas marcó una correcta y una incorrecta, le doy solo el puntaje de la respuesta correcta **[COMPLETAR otros casos]**.
3. **Sumo los puntos, examen por examen.** Junto los puntos de las cuatro carillas y anoto la nota en el frente del examen.
4. **Ordeno todos los exámenes por número de registro**, de menor a mayor.
5. Paso el puntaje de cada examen a una planilla de Excel, con los datos de cada alumno. Ahí aplico el criterio de aprobación, que está fijado de antemano: hace falta el 60 % del examen aprobado para obtener un 4 y a partir de ahí hay una correlación de puntajes hasta el 10 (60 % → 4; 65 % → 5; 70 % → 6; 75 % → 7; 80 % → 8; 90 % → 9; 95 % → 10, valores aproximados), y Excel redondea las notas. También verifico contra el listado de inscriptos que estén todos, que no haya repetidos y que ningún examen haya quedado sin identificar **[VALIDAR: nota de los porcentajes intermedios y de los menores a 60 %]**.
6. **Comparto las notas con los alumnos.**
7. **Subo las notas a MiEcon**, la web de la facultad.

Como el trabajo se hace por lotes, **el tiempo por examen no se puede medir directamente**: se obtiene haciendo todo el proceso para el conjunto de exámenes y dividiendo por la cantidad. No lo cronometré. Mi estimación, sin medir, es de entre 4 y 5 minutos por examen, con unos 80 alumnos por turno. Los pasos que más consumen son corregir por carillas, sumar, ordenar los exámenes y volver a tipear los datos en la planilla, y todos dependen de mi atención.

## Qué cambia con la herramienta (material para el diagrama de «hoy» y «propuesto»)

| Paso de hoy | Hoy | Con METSI Corrector |
|---|---|---|
| 1. Cómo marcan los alumnos | En el examen impreso, de cuatro carillas | En una **hoja de respuestas A5** aparte, con birome, que se fotografía |
| 2. Corregir | A mano, por carillas, con la clave impresa y pilas de exámenes | **La app lee todas las marcas** de la foto de cada hoja y las compara con la clave cargada; no hay pilas ni carillas |
| 3. Sumar los puntos | A mano, examen por examen | **La app calcula el puntaje** de cada pregunta y el total (reparto entre correctas, puntaje parcial y las incorrectas con un peso configurable de 0 a 1) |
| 4. Ordenar por registro | Ordeno físicamente todos los exámenes de menor a mayor | **La tabla de resultados sale ordenada por registro** (se verificó en `js/app-results.js`), así que no hace falta ordenar papeles; necesita el registro confirmado |
| 5. Pasar a Excel, aplicar el criterio de aprobación y verificar contra el listado de inscriptos | Tipeo cada dato y cada puntaje; Excel aplica el criterio (60 % → 4, correlación hasta el 10) y **redondea las notas**; verifico a ojo contra el listado | **Exporta un CSV** para Excel o Google Sheets con registro, nombre, modalidad, puntaje, puntaje máximo, porcentaje y respuestas. Lo escrito que la app identifica no se vuelve a tipear (marcas, modalidad, puntaje; el registro como **sugerencia** que se confirma); el **nombre** se escribe mirando el recorte. **El criterio y el redondeo se siguen aplicando en Excel**: la app no convierte el puntaje en nota. La app **frena repetidos y hojas sin identificar**, pero **no compara con el listado de inscriptos** |
| 6. Compartir con los alumnos | Manual | **Sigue manual** |
| 7. Subir a MiEcon | Manual | **Sigue manual** (la app no se conecta con MiEcon) |

## Observaciones útiles para el resto del informe
- **Qué cambia de verdad:** corregir, sumar, ordenar y gran parte de pasar a Excel. Es lo que el autor describe como ahorro: lo que está escrito y la herramienta identifica no se vuelve a tipear (2026-11-09).
- **Qué sigue igual:** aplicar el criterio y redondear en Excel, compartir las notas, subirlas a MiEcon y el control contra el listado de inscriptos. Mejora posible para la sección 9: comparar el CSV exportado con el listado de inscriptos.
- **Escala de equivalencias** (valores aproximados declarados por el autor el 2026-11-09):

  | Porcentaje del examen | 60 % | 65 % | 70 % | 75 % | 80 % | 90 % | 95 % |
  |---|---|---|---|---|---|---|---|
  | Nota | 4 | 5 | 6 | 7 | 8 | 9 | 10 |

  No es una recta: de 60 % a 80 % la nota sube un punto cada 5 puntos porcentuales, de 80 % a 90 % cada 10, y el 10 se alcanza con el 95 %. Dividir el porcentaje por 10 no sirve; hace falta una tabla de equivalencias. Falta saber qué nota corresponde a los porcentajes intermedios y a los menores de 60 %.
- **El criterio de aprobación no lo decide la app:** está fijado de antemano (60 % del examen = nota 4, correlación de puntajes hasta el 10) y lo aplico yo en Excel, que además redondea las notas. Conviene comparar también la **nota final** (tras el redondeo) en la corrida del 18/11, porque el redondeo puede cambiar casos de borde. El 1 de octubre se discutió que la app lo hiciera y se decidió que no (N.º 3 y 4). **Mejora posible para la sección 9:** aplicar esa escala en la app como una tabla de equivalencias (siete tramos), que hoy no lo hace; es una decisión de diseño del autor.
- **Límites del ahorro:** el nombre sigue siendo manual; el registro es una sugerencia que hay que confirmar y su precisión con hojas reales **no está medida**; si la lectura falla, corregir cuesta tiempo.
- **Cambio de proceso para los alumnos:** pasan de marcar en el examen de cuatro carillas a usar una hoja de respuestas aparte. La hoja aclara que, en caso de diferencias, **prevalecen las respuestas marcadas en la hoja** (decisión del autor, N.º 17).
- **Cómo se mide el tiempo, en ambos métodos:** proceso completo de un lote dividido por la cantidad de exámenes del lote (ver `valor-y-costo.md`).
