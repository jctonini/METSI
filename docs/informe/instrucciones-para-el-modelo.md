# Instrucciones para el modelo (ítem 3 de la lista de cumplimiento)

> **Qué es este archivo:** los pedidos que se le dan al asistente de IA para construir METSI Corrector, reescritos con la estructura de siete partes de la **clase 5** de la diplomatura, junto con los pedidos **originales textuales**. Es el material para la sección «Registro de uso de IA» y el anexo del informe.

## 1. Estructura usada y de dónde sale

La consigna del trabajo final pide «instrucciones armadas con PEDIR o equivalente». Consulté el sitio de la cursada (`diploiafceuba.vercel.app`, clases 1 a 16, el 2026-11-09) y **la sigla PEDIR no aparece escrita en ninguna de las 16 clases** (busqué en el texto de cada página y en el script de cada clase, que es donde está parte del contenido). Lo que sí enseña la **clase 5, «El arte de pedir bien: contexto e instrucciones»** (`/05`, martes 1 de septiembre de 2026), es una *consigna completa de siete partes*. Uso esa estructura como el **equivalente**:

| # | Parte (clase 5) | Qué pide la clase |
|---|---|---|
| 1 | La tarea | Empezar con un verbo (resumí, compará, extraé, clasificá) |
| 2 | El material | Decir sobre qué trabajar y marcar dónde empieza |
| 3 | El formato de salida | La forma exacta de la respuesta |
| 4 | El criterio de calidad | Qué hace que el resultado sirva, qué tiene que estar sí o sí |
| 5 | Las restricciones | Qué no se quiere |
| 6 | El destinatario y el registro | Para quién es y en qué tono |
| 7 | Qué hacer ante la duda | «Si un dato no está, dejalo en blanco y avisá; no lo estimes» |

La clase 5 aclara que «no hace falta que estén las siete en todos los pedidos, pero cada una que falta es una decisión que estás delegando sin querer». Las clases 12 y 13 agregan dos prácticas que METSI también usó: **pedirle al agente que cuente el plan y espere la aprobación antes de escribir código**, y dejar instrucciones permanentes en un archivo del proyecto (`AGENTS.md`; en este repositorio, `CLAUDE.md`).

**Pendiente de confirmar con el docente de la cursada:** si «PEDIR» es una sigla que se explicó en forma oral o en otro material. Si es así, hay que reordenar las partes de abajo con las letras de la sigla; el contenido sirve igual.

## 2. Aclaración importante: qué son estos pedidos

Los pedidos de las secciones 3 y 4 **no son los que se usaron**: son una **reescritura hecha el 2026-11-09** con las decisiones que quedaron documentadas en el registro de uso de IA. Los pedidos reales fueron conversacionales y están transcriptos tal cual en `registro-ia-bruto.md` y `registro-ia-bruto-noviembre.md`. Se incluye la comparación para mostrar qué cambia al estructurar.

La app, cuando corre, **no usa ningún modelo de lenguaje** (la lectura de dígitos es una red neuronal chica que corre en el navegador). Por eso las «instrucciones para el modelo» son las que se le dieron al asistente para **construirla**.

---

## 3. Pedido A · construir el corrector (versión estructurada)

```text
Construí una app web (HTML, CSS y JavaScript, sin dependencias en el navegador) que corrija exámenes multiple choice en papel a partir de una foto de la hoja de respuestas.

Material: la hoja de respuestas es A5 (se imprimen 2 por hoja A4 apaisada y se corta por la mitad) y el alumno la completa con birome. Tiene cuatro marcas negras en las esquinas, una grilla de burbujas (de 2 a 6 opciones por pregunta), una fila de modalidad («Presencial» o «A distancia»), un casillero por dígito para el número de registro (7 casilleros) y espacios para escribir a mano el nombre y la fecha. El primer examen tiene 10 preguntas y el segundo 20, con 4 o 5 opciones, y puede haber varias respuestas correctas por pregunta.

Formato: archivos separados por responsabilidad (geometría de la hoja, generador de la hoja imprimible, lectura de la foto, puntaje, exportación), con comentarios en castellano; pruebas automáticas con fotos sintéticas en un solo archivo; una pantalla con las pestañas Examen, Hoja, Corregir y Resultados; los resultados se descargan como CSV importable en Excel y Google Sheets. Antes de escribir código, proponé la estructura de archivos y esperá mi confirmación.

Criterio: tiene que leer la foto aunque esté algo torcida. Cada pregunta tiene su puntaje, que se reparte en partes iguales entre sus respuestas correctas; se admite puntaje parcial; el descuento por cada incorrecta es un número de 0 a 1 que configuro yo. Lo importante es que yo pueda revisar todo lo dudoso antes de exportar.

Restricciones: no decidas quién aprueba (devolvé solo el puntaje); no inventes ni completes datos que no se puedan leer; no uses datos reales de alumnos en los ejemplos ni en las pruebas; no envíes imágenes a servicios externos; no cambies una versión de hoja que ya se imprimió.

Destinatario: yo, docente sin experiencia en programación ni en repositorios. Explicame cada paso en castellano rioplatense y sin tecnicismos. La van a usar docentes desde el celular y desde la PC.

Si falta un dato (cantidad de preguntas, opciones, formato de la hoja, qué hacer con un repetido), preguntame y esperá mi respuesta: no lo decidas vos. Mostrame un plan antes de cada cambio grande.
```

### De dónde sale cada decisión (trazabilidad al registro)
| Parte del pedido | Decisión | Dónde consta |
|---|---|---|
| Material | 10 y 20 preguntas, 4 o 5 opciones; hoja A5; 7 casilleros de registro; modalidades | N.º 2, 7, 9 |
| Criterio | Puntaje por pregunta repartido entre correctas; parcial; descuento 0 a 1 | N.º 3, 5, 22 |
| Restricciones | La app no decide quién aprueba; hojas ya impresas no se cambian | N.º 4, 16 |
| Restricciones | Sin datos reales de alumnos en pruebas | N.º 13 |
| Ante la duda | Plan antes de cambios y confirmación | Práctica de las clases 12 y 13; N.º 14 |

### Comparación con el pedido original (N.º 1 y 2)
Pedido original, textual (resumen del primer mensaje; el texto completo está en `registro-ia-bruto.md`): «Yo soy profesor en la universidad, de una materia que se llama Metsi … los examenes en papel son multiple choice y lleva mucho tiempo corregirlos … yo estaba pensando en la primera de las opciones, que los alumnos completen una grilla con las respuestas, sacarles una foto y que una app lo corrija».

Evaluación hecha **a mano por mí** contra las siete partes (no con el detector de la clase 5):

| Parte | Original | Qué pasó |
|---|---|---|
| Tarea | Implícita («que una app lo corrija») | Sin pedido directo al asistente |
| Material | Parcial | Faltaban cantidad de preguntas, opciones y formato; el asistente lo preguntó y contestaste en el N.º 2 |
| Formato | Ausente | Se definió después (planilla importable, N.º 2) |
| Criterio | Ausente | El puntaje se definió pregunta por pregunta (N.º 3, 4, 5) |
| Restricciones | Parcial («por ahora no quiero hacer nada con el repositorio») | — |
| Destinatario | Parcial («soy profesor en la universidad») | — |
| Ante la duda | Ausente | Lo cubrió el asistente: hizo preguntas numeradas y esperó |

**Lectura:** lo que no estaba escrito se resolvió en una vuelta de preguntas. No salió mal, pero fueron decisiones que se tomaron en 3 o 4 intercambios en vez de en uno.

---

## 4. Pedido B · lectura local del registro (versión estructurada)

```text
Sugerí el número de registro de cada hoja leyendo los dígitos que el alumno escribió a mano en los casilleros, para que yo solo lo confirme o lo corrija.

Material: la foto de la hoja ya alineada (la app sabe dónde está cada casillero del registro). Son 7 casilleros, un dígito por casillero, y los registros tienen 6 o 7 dígitos.

Formato: un módulo de JavaScript que corra dentro del navegador, sin librerías ni servicios externos. El resultado se muestra al lado del recorte de la foto, con los dígitos dudosos resaltados. Agregá pruebas automáticas con dígitos dibujados sobre fotos sintéticas y explicá en el README cómo se reentrena el modelo.

Criterio: tiene que ser una sugerencia y no un dato: el registro queda vacío hasta que yo toque «es correcto» o lo escriba. Un casillero vacío queda vacío (no inventes un dígito). Los registros de 6 dígitos no deben quedar marcados como dudosos solo porque falta un dígito en un extremo.

Restricciones: ninguna imagen ni recorte puede salir del dispositivo; no agregues llamadas a servicios externos, tampoco a la API de un modelo de lenguaje; no completes el registro por tu cuenta; no cambies cómo se carga hoy el nombre, que sigue siendo manual.

Destinatario: el docente que corrige desde el celular o la PC. Mensajes en castellano claro.

Si una lectura no es segura, mostrala como dudosa y no la completes. Si una opción de diseño cambia dónde viajan los datos de los alumnos, preguntame antes de elegir.
```

### De dónde sale cada decisión
| Parte del pedido | Decisión | Dónde consta |
|---|---|---|
| Criterio | Es una sugerencia que el docente confirma | N.º 51; tarea METSI-11 |
| Restricciones | Nada sale del dispositivo; no se usa la API de un modelo | N.º 51 (lo decidiste vos) |
| Material | Los registros tienen 6 o 7 dígitos | N.º 52 (lo aportaste vos, **después**) |
| Criterio | Un hueco en un extremo no cuenta como dudoso | N.º 52; commit «Registros de 6 o 7 dígitos…» |

### Comparación con el pedido original (N.º 51)
Pedido original, textual: «Estaba pensando, quisiera saber si vos pudieras leer lo que los alumnos escriben a mano (su nombre y su numero de registro) y pedirme a mi una correcciòn o una confirmaciòn, si lo que vos leiste es correcto yo lo confirmo y me ahorro tener que escribirlo, y si es incorrecto, lo corrijo.»

| Parte | Original | Qué pasó |
|---|---|---|
| Tarea | Presente | — |
| Material | Parcial (nombre y registro a mano) | No decía los casilleros ni que los registros tienen **6 o 7 dígitos** |
| Formato | Parcial («pedirme una corrección o una confirmación») | — |
| Criterio | Parcial (yo confirmo o corrijo) | — |
| Restricciones | **Ausente** | No decía que las imágenes no debían salir del dispositivo |
| Destinatario | Ausente | — |
| Ante la duda | Ausente | — |

**Dos consecuencias reales, ambas documentadas en el registro de IA:**
1. **Restricción no escrita (N.º 51).** El asistente propuso, entre sus opciones, enviar los recortes de la letra de los alumnos a la API de Anthropic. Lo cuestionaste y elegiste la lectura local. Con la restricción escrita desde el principio, esa opción no habría aparecido.
2. **Material incompleto (N.º 52).** El asistente propuso mostrar «?» en los casilleros vacíos. Con registros de 6 dígitos, todos habrían salido como «?XXXXXX». El dato de los 6 o 7 dígitos lo tenías vos y no estaba escrito.

Es exactamente lo que dice la clase 5: lo que no se escribe, el modelo lo completa con lo más probable, y lo más probable no es lo tuyo.

---

## 5. Cómo se verificó que los pedidos sirven

La clase 5 pide verificar una consigna con casos de respuesta conocida, no con opinión («eso lo dice tu banco de pruebas»). En METSI la verificación es:
- **Pruebas automáticas** (`node tests/run.js`, 115 pruebas, todas en verde el 2026-11-08) con fotos sintéticas de hojas V1 a V4, el puntaje y la lectura de dígitos.
- **Pruebas con hojas reales** del docente (N.º 13, 20, 23, 26, 29): detectaron fallas que las sintéticas no mostraron.
- **Limitación honesta:** la lectura del registro se midió con dígitos de MNIST sobre fotos sintéticas (cerca del 99 %), que es una prueba optimista. Falta calibrar con hojas reales (tarea METSI-1, abierta).

## 6. Instrucciones permanentes del proyecto

Las clases 12 y 13 recomiendan un archivo con las reglas de la casa que el agente lee antes de cada tarea. En este repositorio, `CLAUDE.md` hoy solo contiene el flujo de Backlog.md. **Mejora posible:** sumarle las reglas de METSI que hoy se repiten en cada pedido (no usar datos reales de alumnos, no enviar imágenes a servicios externos, correr `node tools/version.js` después de cambiar código o estilos, no editar a mano `js/digit-model.js` ni `js/version.js`).

## 7. Fuentes
- Clase 5, «El arte de pedir bien: contexto e instrucciones», `diploiafceuba.vercel.app/05` (consultada el 2026-11-09); las siete partes figuran en el código de la propia página (`clase05.js`).
- Clases 12 y 13, `diploiafceuba.vercel.app/12` y `/13` (consultadas el 2026-11-09).
