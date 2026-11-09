# Sección 2 · La situación actual (borrador)

> **Fuente:** respuestas del autor del 2026-11-09 a cinco preguntas sobre cómo corrige hoy (cómo marcan los alumnos, cómo se corrige, cómo se calcula el puntaje, adónde van las notas y cómo se identifica a cada alumno). Las aclaraciones posteriores del autor ya están incorporadas. Presupuesto: ~350 palabras en el informe.

## Texto para el informe

Hoy corrijo los exámenes completamente a mano, uno por uno. El proceso, paso por paso:

1. **Los alumnos rinden en papel.** Marcan sus respuestas directamente en el examen impreso y anotan sus datos: nombre, número de registro y modalidad de cursada.
2. **Corrijo cada examen con la clave de respuestas impresa**, comparando pregunta por pregunta.
3. **Calculo el puntaje de cada examen a mano**, también pregunta por pregunta. Como una pregunta puede tener varias respuestas correctas, el puntaje de la pregunta se reparte entre ellas, se reconoce puntaje parcial y en el cálculo final de cada pregunta entran también las respuestas incorrectas que marcó el alumno.
4. **Paso las notas a una planilla de Excel.** Incluyo a cada alumno con sus datos.
5. **Verifico contra el listado de inscriptos** que estén todos, que no haya repetidos y que ningún examen haya quedado sin identificar.
6. **Cargo las notas en MiEcon**, la web de la facultad.
7. **Aplico el criterio de aprobación** sobre la planilla. Eso lo decido yo después de ver los puntajes.

Este proceso es lento y repetitivo en los pasos 2, 3 y 4 (corregir, calcular y volver a tipear cada dato en la planilla), que son los que consumen el tiempo: según mi estimación, entre 4 y 5 minutos por examen, con unos 80 alumnos por turno. También depende de mi atención en cada pregunta, en el cálculo del puntaje parcial y en el control de repetidos y de exámenes sin identificar, que hago a ojo contra el listado de inscriptos.

## Qué cambia con la herramienta (material para el diagrama de «hoy» y «propuesto»)

| Paso | Hoy | Con METSI Corrector |
|---|---|---|
| 1. Cómo marcan los alumnos | En el examen impreso | En una **hoja de respuestas A5** aparte, con birome, que se fotografía |
| 2. Corregir | A mano, con la clave impresa | **La app lee las marcas** de la foto y compara con la clave cargada |
| 3. Puntaje | A mano, pregunta por pregunta | **La app lo calcula** (reparto entre correctas, puntaje parcial y las incorrectas marcadas entran en el cálculo con un peso configurable de 0 a 1) |
| 4. Planilla | Cargo cada alumno y su nota a mano en Excel | **Exporta un CSV** para Excel o Google Sheets con registro, nombre, modalidad, puntaje y respuestas de cada hoja. Lo que está escrito en la hoja y la app logra identificar no se vuelve a tipear: marcas, modalidad y puntaje solos; el registro como **sugerencia** que se confirma; el **nombre** se escribe mirando el recorte de la foto |
| 5. Identificación y repetidos | A ojo, contra el listado de inscriptos | La app exige nombre o registro, **frena repetidos** entre las hojas cargadas y avisa de fotos duplicadas; **sigue sin comparar con el listado de inscriptos** |
| 6. MiEcon | A mano | **Sigue a mano** (la app no se conecta con MiEcon) |
| 7. Criterio de aprobación | Lo aplico yo | **Lo sigo aplicando yo**: la app solo calcula el puntaje |

## Observaciones útiles para el resto del informe
- **Qué sigue igual:** el paso 6 (MiEcon) y el control contra el listado de inscriptos. Conviene decirlo en la sección 3 y en los próximos pasos (sección 9): una mejora posible es comparar la planilla exportada con el listado de inscriptos.
- **Qué cambia de verdad:** los pasos 2 y 3 y buena parte del 4. Según el autor, todo lo que está escrito en la hoja y la herramienta identifica representa un ahorro de tipeo (2026-11-09). Es lo que se mide el 18 de noviembre, **incluyendo el tiempo de volcar los datos a la planilla en los dos métodos**.
- **Límites de ese ahorro:** el nombre sigue siendo manual; el registro es una sugerencia que hay que confirmar y su precisión con hojas reales **no está medida**; si la lectura falla, corregir cuesta tiempo.
- **Cambio de proceso para los alumnos:** pasan de marcar en el examen a usar una hoja de respuestas aparte. La hoja aclara que, en caso de diferencias, **prevalecen las respuestas marcadas en la hoja** (decisión del autor, N.º 17).
