# Registro de uso de IA (bruto) · Herramienta de corrección METSI

Material en bruto para la sección «Registro de uso de IA» del informe. Alcance: **solo la herramienta de corrección** (la app que corrige hojas de multiple choice a partir de una foto). Quedan fuera los pedidos posteriores de armado del examen del 2.º parcial y su guía, y la carga del banco de preguntas, porque no pidieron agregados ni correcciones a la herramienta. También queda fuera la subida de la skill de armado de exámenes a otro repositorio.

## Cómo leer este archivo

- **Límite importante:** el archivo de esta sesión empieza con un *resumen de contexto* que sustituye la parte inicial del chat. De los pedidos anteriores a ese resumen **no está disponible el texto completo**. Para esos pedidos copio solo los fragmentos que el resumen reproduce entre comillas y lo indico con «(fragmento)». Lo que el resumen cuenta con palabras propias lo marco «(paráfrasis del resumen, no textual)». El mensaje completo figura como **NO CONSTA**.
- Los pedidos posteriores al resumen (N.º 23 a 30) están copiados textualmente del archivo de la sesión, con sus errores de tipeo.
- **Fechas:** de los pedidos posteriores al resumen consta la hora (UTC) del archivo de la sesión. De los anteriores, la fecha del pedido **NO CONSTA**; indico, marcados «(según git)», los commits relacionados con su fecha de commit (solo el día).
- «NO CONSTA» significa que no hay dato en lo disponible. No rellené con suposiciones.
- Se reemplazó por «[OMITIDO]» el ID de cliente de Google, y no se incluyen nombres ni registros de alumnos ni datos personales.
- No registro aquí el nombre del modelo. **Completar a mano** en el informe: modelo y versión según el encabezado de la sesión en claude.ai.

Lista de cumplimiento (ítems 1 a 12) usada en el campo «Ítem(s)»: 1 Problema real · 2 Herramienta/modelo y costo · 3 Instrucciones para el modelo · 4 Datos que usa · 5 Verificación · 6 Autonomía · 7 Construcción paso a paso · 8 Datos en tablas · 9 Instalación en la organización · 10 Riesgos y datos personales · 11 Uso de IA declarado · 12 Valor estimado.

---

## Parte 1 · Pedidos anteriores al resumen de contexto (texto completo NO CONSTA)

### N.º 1 · NO CONSTA · Claude Code
- **Etapa:** idea
- **Pedido (textual, fragmentos de mensajes separados):**
  > Yo soy profesor en la universidad, de una materia que se llama Metsi
  >
  > por ahora no quiero hacer nada con el repositorio
  >
  > Estoy pensando en funcion de una necesidad que estoy teniendo
  >
  > Resulta que los examenes en papel son multiple choice y lleva mucho tiempo corregirlos
  >
  > yo estaba pensando en la primera de las opciones, que los alumnos completen una grilla con las respuestas, sacarles una foto y que una app lo corrija
- **Qué hizo la IA:** presentó opciones de solución (consta por la referencia «la primera de las opciones»); el contenido de las opciones NO CONSTA.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** definir el problema (corrección en papel lenta), elegir la opción «grilla + foto + app» y no tocar el repositorio al principio.
- **Sección del informe donde encaja:** 1 Problema
- **Ítem(s):** 1

### N.º 2 · NO CONSTA · Claude Code
- **Etapa:** diseño
- **Pedido (textual):** NO CONSTA. El resumen indica solo que respondió preguntas de la IA con estos datos (paráfrasis del resumen, no textual): 10 o 20 preguntas, 4 o 5 opciones, un examen por vez, fotos sacadas con el celular por el profesor, ver los resultados en la app y descargar una planilla, y construir la app en ese repositorio.
- **Qué hizo la IA:** preguntó mediante un formulario de opciones (AskUserQuestion, según el resumen) y construyó una app web estática («Agrega corrector de multiple choice a partir de fotos», según git, 2026-10-01).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** cantidad de preguntas y opciones, quién saca las fotos, formato de salida (planilla) y lugar de construcción.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 1, 4, 6

### N.º 3 · NO CONSTA · Claude Code
- **Etapa:** diseño
- **Pedido (textual, fragmento):**
  > quizás a la app no le importa si el alumno aprueba o no...
  
  El resto del mensaje NO CONSTA. Datos del resumen (paráfrasis, no textual): se piden nombre, registro y modalidad; el puntaje debe ser configurable; puede haber varias respuestas correctas por pregunta con el puntaje repartido entre ellas.
- **Qué hizo la IA:** diseñó la clave de respuestas con puntos por pregunta repartidos entre las correctas; dejó la aprobación fuera de la app (la app solo informa el puntaje).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que el criterio de aprobación lo decide el profesor después y no la app.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 6

### N.º 4 · NO CONSTA · Claude Code
- **Etapa:** diseño
- **Pedido (textual, fragmento):**
  > Se admiten respuestas parciales, es decir si una pregunta tiene 3 respuestas correctas, pero la persona marcò solo 1 de las correctas TIENE que recibir ese puntaje.
- **Qué hizo la IA:** implementó puntaje parcial: cada opción correcta marcada suma su parte (`js/scoring.js`, según el resumen).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** regla de puntaje parcial.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 5, 6

### N.º 5 · NO CONSTA · Claude Code
- **Etapa:** diseño
- **Pedido (textual, fragmentos):**
  > recordà que esos datos van a estar escritos a mano

  Elección entre opciones del formulario (texto de la opción, fragmento): «Sin burbujas para el registro, pero si 7 casilleros para marcar allì su registro».

  Paráfrasis del resumen, no textual: preguntó si la grilla entraba en media hoja A4 (A5) y pidió ver un ejemplo de cómo se rellenan las burbujas del registro.
- **Qué hizo la IA:** propuso lectura de nombre y registro (preguntó si se leerían con OCR); generó la hoja A5, 2 por A4, con nombre y registro manuscritos («Hoja de respuestas en A5 con nombre y registro manuscritos», según git, 2026-10-01).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que nombre y registro sean manuscritos, sin lectura automática en esta etapa, con 7 casilleros para el registro; formato A5.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 4, 10

### N.º 6 · NO CONSTA · Claude Code
- **Etapa:** diseño
- **Pedido (textual, fragmentos de mensajes separados):**
  > Si bien la toma de las fotos la voy a hacer con el celular, los resultados si tienen que poder recuperarse desde la pc, quizàs lo conveniente es alojar las imagenes en google drive.

  > tengo que poder recuperar las notas tanto desde el celular como desde la pc
- **Qué hizo la IA:** implementó sincronización con Google Drive (carpeta por examen con fotos, `datos.json` y `resultados.csv`; permiso `drive.file`) y combinación de datos entre dispositivos por hoja («Sincroniza resultados y fotos con Google Drive», según git, 2026-10-01).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** usar Google Drive como almacenamiento para ver resultados desde el celular y la PC.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 2, 4, 9

### N.º 7 · NO CONSTA · Claude Code
- **Etapa:** despliegue
- **Pedido (textual, fragmento):**
  > No tengo experiencia en repositorios, asi que necesito que me indiques vos que es mas conveniente. NEcesito que me orientes para crear el ID del cliente de google. Ahora no tengo impresora, y por el momento no me disponibilizaste un pdf o doc o gdoc para ver la hoja e imprimirla.
- **Qué hizo la IA:** orientó sobre dónde alojar la app (GitHub Pages desde `main`, según el resumen) y sobre cómo crear el ID de cliente de Google. Cómo entregó la hoja para imprimir: NO CONSTA.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA. Dato del resumen: la IA no puede crear repositorios en GitHub (error 403); el repositorio lo creó el usuario.
- **Decisión mía (no delegada):** delegué la elección de alojamiento; creé yo los repositorios y el ID de cliente de Google.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 2, 9

### N.º 8 · NO CONSTA · Claude Code
- **Etapa:** construcción
- **Pedido (textual, fragmento):**
  > La modalidad es 'Presencial' o 'A distancia'
- **Qué hizo la IA:** puso «Presencial» y «A distancia» como modalidades por defecto («Modalidades por defecto: Presencial y A distancia», según git, 2026-10-01).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** valores de la modalidad de cursada.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 4

### N.º 9 · NO CONSTA · Claude Code
- **Etapa:** construcción
- **Pedido (textual, fragmento):**
  > Necesito poder modificar las hojas, asi que voy a necesitar que sea editables

  Elección del formulario (paráfrasis del resumen, no textual): textos y logo editables desde la app.
- **Qué hizo la IA:** agregó la personalización de la hoja: encabezado, etiquetas, instrucciones y logo («Personalización de la hoja…», según git, 2026-10-01). La grilla de respuestas no es editable, para no romper la lectura.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** qué se puede editar (textos y logo).
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 7, 9

### N.º 10 · NO CONSTA · Claude Code
- **Etapa:** despliegue
- **Pedido (textual, fragmentos de mensajes separados):**
  > ya configure el google id

  Compartió el ID de cliente de Google: [OMITIDO].

  > Puedo mover la carpeta metsi corrector dentro de otra carpeta de google drive?

  > listo
- **Qué hizo la IA:** cargó el ID de cliente en la configuración («Configura el ID de cliente de Google para la sincronización con Drive», según git, 2026-10-01). Respuesta sobre mover la carpeta: NO CONSTA.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** crear y configurar yo el ID de cliente en Google Cloud.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 9, 10

### N.º 11 · NO CONSTA · Claude Code
- **Etapa:** despliegue
- **Pedido (textual, fragmentos de mensajes separados):**
  > por que cuando entro en https://jctonini.github.io/ me tira error 404?

  > hagamos el indice entonces

  > listo, hecho
- **Qué hizo la IA:** respondió sobre el error 404 y, según lo que implica el pedido siguiente («hagamos el indice entonces»), propuso crear un índice. El detalle de la respuesta y los archivos creados: NO CONSTA (en los commits de este repositorio no figura).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** crear el índice; hice yo los pasos que me indicó la IA («listo, hecho»).
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 9

### N.º 12 · NO CONSTA · Claude Code
- **Etapa:** despliegue
- **Pedido (textual, fragmentos de mensajes separados):**
  > explicame mas sobre el punto 3

  > hagamoslo

  > hecho
- **Qué hizo la IA:** respondió sobre ese punto (el detalle NO CONSTA); con la aprobación del usuario se fusionó el primer pull request a `main` (merge del PR n.º 1, según git, 2026-10-01).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** autorizar la publicación en `main` y hacer yo lo que me indicó.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 7, 9

### N.º 13 · NO CONSTA · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, fragmentos de mensajes separados):**
  > tengo la prueba real y tambien tengo algun feedback...

  Envió una foto de una hoja real. Fragmento:

  > Las respuestas 4 y 6 no las leyó

  > la sincronizacion con drive anduvo bien.

  > es mi nombre y mi registro de cuando era alumno, mejor no lo subas al repo.
- **Qué hizo la IA:** analizó la foto real y corrigió la lectura («Corrige la lectura de una foto real: orientación y marcas con cruz», según git, 2026-10-02): comparar la orientación contra la hoja girada 180° y restar una línea base para leer cruces finas.
- **Qué hubo que corregir:** la lectura de las respuestas 4 y 6 de la foto real; el usuario pidió no subir al repositorio su nombre y registro (datos de su época de alumno) que aparecían en los ejemplos de prueba de la IA.
- **Qué inventó o erró la IA (según el resumen de contexto):** el chequeo de orientación fallaba en una foto real (oscuridad de la barra 0,37 contra un umbral de 0,5); las cruces finas no se leían. Los ejemplos de prueba de la IA coincidían con el nombre y registro reales del usuario; se reemplazaron por datos inventados y se reescribió la historia de la rama propia sin fusionar. Desde entonces se revisó el repositorio y su historial antes de cada commit.
- **Decisión mía (no delegada):** probar con una hoja real; decidir que mis datos personales no se suben al repositorio.
- **Sección del informe donde encaja:** 6 Pruebas (y 7 Riesgos y controles por el dato personal)
- **Ítem(s):** 5, 10

### N.º 14 · NO CONSTA · Claude Code
- **Etapa:** diseño
- **Pedido (textual, fragmentos de mensajes separados):**
  > Todavia no ejecutes ninguna accion, yo te voy a ir mandando el feedback y luego te digo cuando accionar.

  Fragmentos de los pedidos de la tanda:

  > sino la app me lo tiene que frenar

  > vamos con la 1 y se complementa con la 3

  > vas a tener que mantener la compatibilidad con el caso actual

  > ponele versionado a la hoja e imprimilo al pie

  > Rellená el círculo por completo con birome

  > En caso de haber diferencias entre las respuestas marcadas en el examen y en esta hoja, prevalecen aquellas marcadas en la hoja de respuestas.

  > La V1 no voy a volver a imprimirla

  > la fecha tiene que estar incluida en la hoja, pero no hace falta cortarla y guardarla

  > Vamos con esos cambios por el momento.

  Paráfrasis del resumen, no textual: reglas de nombre o registro obligatorio, de repetidos y de foto duplicada (incluido el mismo papel fotografiado dos veces), más espacio para el nombre, código de versión de 3 cuadraditos con «Vx», leyenda de validez y campo de fecha.
- **Qué hizo la IA:** esperó a que el usuario terminara de enviar los cambios y luego los aplicó: hoja V2 con versión impresa y código de versión, identificación obligatoria y control de repetidos («Hoja V2, identificación obligatoria y control de repetidos», según git, 2026-10-02), detección de la misma foto y de la misma hoja fotografiada otra vez (parecido de letra), V1 solo de lectura con su geometría congelada y una prueba.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** reglas de identificación (nombre o registro obligatorio, si no, la app frena), compatibilidad con las hojas ya impresas, versionado de la hoja, leyenda de validez, campo de fecha y dejar de imprimir la V1.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 6, 10

### N.º 15 · NO CONSTA · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):** NO CONSTA. Paráfrasis del resumen, no textual: queja por el orden de la clave de respuestas (en la PC se ve de a pares 1–2 y 3–4 y en el celular de a una).
- **Qué hizo la IA:** corrigió la disposición de la clave en columnas (CSS, según el resumen).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** NO CONSTA
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 7

### N.º 16 · NO CONSTA · Claude Code
- **Etapa:** diseño
- **Pedido (textual, fragmentos de mensajes separados):**
  > 3 decimales esta bien

  > ok

  > hoy no puedo imprimirla esto queda pendiente

  > pasalo a main

  Contexto del resumen (paráfrasis, no textual): una captura de la clave mostraba 0 o 1 para la pregunta 8 y el usuario dudó del descuento; los «ok» corresponden a los números de versión de la hoja.
- **Qué hizo la IA:** explicó el cálculo; reemplazó el descuento fijo por un número libre de 0 a 1; mostró hasta 3 decimales; agregó números de versión visibles en la app y en los archivos (`?v=hash`); fusionó a `main` («Descuento libre por incorrecta, números con 3 decimales y versión de archivos», según git, 2026-10-02).
- **Qué hubo que corregir:** la regla de descuento (la IA había fijado un esquema fijo) para pasarla a un valor libre entre 0 y 1.
- **Qué inventó o erró la IA (según el resumen de contexto):** confusión con la pregunta 8 (en la clave del usuario solo B y C eran correctas). La caché del navegador hacía ver comportamientos viejos (el error de orientación); se resolvió con la versión de archivos.
- **Decisión mía (no delegada):** que el descuento sea un número libre de 0 a 1, tres decimales, y dejar la impresión para otro día.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 6

### N.º 17 · NO CONSTA · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, fragmento):**
  > Acabo de hacer una prueba y los resultados no fueron buenos...

  Siguieron fotos y listas de fallas (paráfrasis del resumen, no textual): respuestas mal leídas en las preguntas 4, 11, 15, 18 y 20, y no leídas en la 12, 13, 14 y 17; más fotos donde las hojas fueron rechazadas por no encontrar las esquinas.
- **Qué hizo la IA:** corrigió la lectura de hojas con muchas marcas con una línea base robusta («Corrige la lectura de hojas con muchas marcas (nivel base robusto)», según git, 2026-10-24) y reconoció la hoja correcta cuando la foto trae la hoja vecina («Reconoce la hoja correcta cuando la foto trae la hoja vecina», según git, 2026-10-24).
- **Qué hubo que corregir:** la lectura en fotos con más de la mitad de las burbujas marcadas, y la elección de la hoja cuando aparece la vecina.
- **Qué inventó o erró la IA (según el resumen de contexto):** la línea base se inflaba cuando más de la mitad de las burbujas estaban marcadas; se pasó a una línea base solo de burbujas vacías, por columna y ventana local, con una prueba de regresión. Con fotos con la hoja vecina, la lectura salía corrida; una prueba mostró que cuatro burbujas rellenas formaban un cuadrilátero falso, y se agregó un control de tamaño físico.
- **Decisión mía (no delegada):** probar con fotos reales y reportar qué preguntas fallaron.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 18 · NO CONSTA · Claude Code
- **Etapa:** diseño
- **Pedido (textual, fragmento):**
  > En una foto no voy a subir dos hojas de corrección completas... podría ser un círculo o bien, un rectángulo y un cuadrado, lo que vos prefieras pero que la identificación sea inequívoca

  (Los puntos suspensivos son los del resumen; lo omitido NO CONSTA.) Paráfrasis del resumen, no textual: el usuario sugirió cambiar la forma de las marcas de esquina (cuadrados a la izquierda y triángulos a la derecha).
- **Qué hizo la IA:** diseñó la hoja V3 con marcas de esquina de forma propia: cuadrados a la izquierda y barras a la derecha, con la orientación deducida de las formas («Hoja V3: marcas de esquina con forma propia», según git, 2026-10-24).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que las marcas de esquina se distingan sin ambigüedad (dejé la forma al criterio de la IA).
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 5, 7

### N.º 19 · NO CONSTA · Claude Code
- **Etapa:** construcción
- **Pedido (textual, fragmentos de mensajes separados):**
  > Otra cosa, agrega la posibilidad de marcar como dudosas o a revisar con un flag las correcciones para que luego puedas analizarlas y corregir la tool

  > hace el merge
- **Qué hizo la IA:** agregó banderas por hoja y por pregunta, notas y registro de correcciones manuales, descarga en JSON y subida a Drive de los casos a revisar con las fotos sin el nombre, el registro ni la fecha («Casos a revisar: banderas, correcciones a mano y análisis en Drive», según git, 2026-10-24); luego se fusionó a `main`.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que los casos dudosos se marquen para que la IA los analice y corrija la herramienta; autorizar la fusión.
- **Sección del informe donde encaja:** 3 Solución (y 7 Riesgos y controles, por el enmascarado de datos personales)
- **Ítem(s):** 5, 6, 10

### N.º 20 · NO CONSTA · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, fragmentos de mensajes separados):**
  > Esta hoja se detectò bien y todas las respuestas marcadas se detectaron bien

  > lo hice a proposito para ver que pasaba, esta bien no detectarlo, PERO si el punto fuera lo suficientemente grande como para ser una respuesta entonces si tiene que contemplarlo.

  > Hice otra prueba y marquè con el flag la pregunta de algo que no quedó bien.

  Envió además la foto original de la hoja con la bandera.
- **Qué hizo la IA:** analizó la foto marcada con la bandera y ajustó la medición: mide la tinta más cerca del centro de la burbuja («Mide la tinta más cerca del centro para leer mejor las cruces finas», según git, 2026-10-24) y recentró la sensibilidad normal en 0,085 («Centra el umbral de sensibilidad normal en 0,085», según git, 2026-10-24); un punto de al menos 1 mm cuenta como respuesta.
- **Qué hubo que corregir:** el umbral de lectura de cruces finas.
- **Qué inventó o erró la IA (según el resumen de contexto):** las pruebas de tamaño de punto fallaron al cambiar el radio de medición y hubo que actualizarlas; las cruces quedaban en el borde del umbral y se recentró con un análisis de ventanas sobre seis fotos reales.
- **Decisión mía (no delegada):** hice la prueba del punto a propósito y fijé el criterio: un punto lo bastante grande debe contar como respuesta.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 21 · NO CONSTA · Claude Code
- **Etapa:** diseño
- **Pedido (textual, fragmentos de mensajes separados):**
  > Quiero que agregues al pie, separado del espacio para marcar las respuestas, dos ejemplos en una misma fila, uno que indique como es la forma correcta de identificar una respuesta, y otro que indique como no es una forma correcta de marcar una respuesta.

  > mostrame alternativas

  > me gusta la opción A PERO el correcto lo haría pintando todo el circulo... y del lado incorrecto, pondría los 4 ejemplos incorrectos.
- **Qué hizo la IA:** mostró alternativas y creó la hoja V4 con una banda de ejemplos al pie: correcto con el círculo pintado por completo y cuatro formas incorrectas (tilde, cruz, punto y medio relleno) («Hoja V4: banda de ejemplos de cómo marcar al pie», según git, 2026-10-24).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** elegir la alternativa A y definir qué mostrar en cada lado (círculo pintado y cuatro incorrectos).
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 7

### N.º 22 · NO CONSTA · Claude Code
- **Etapa:** construcción
- **Pedido (textual, fragmentos de mensajes separados):**
  > Creo que podemos quitar la leyenda que dice 'Rellena el circulo por completo con Birome' con lo ultimo agregado, se vuelve redundante

  > quitala y baja un poco más esto que agregamos de correcto / incorrecto. Si, pone lo de la birome en la parte de correcto.

  > Centra en cada espacio los textos Correcto / Incorrecto.

  > hace el merge
- **Qué hizo la IA:** quitó la línea redundante, bajó la banda, puso «con birome» en el lado correcto y centró los títulos («V4: sin la línea de instrucción, banda más abajo y títulos centrados», según git, 2026-10-24); creó el pull request n.º 5 y lo fusionó a `main`.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** el diseño final de la banda y autorizar la fusión.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 7, 9

---

## Parte 2 · Pedidos posteriores al resumen (texto copiado del archivo de la sesión)

### N.º 23 · 2026-10-24 20:38 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > [dos imágenes, sin texto: la captura de la app con la hoja V4 corregida y la foto original de la hoja]
- **Qué hizo la IA:** comparó a simple vista las dos imágenes, sin ejecutar el lector sobre el archivo, y respondió que la hoja V4 impresa se leyó bien (hoja, versión V4, modalidad, marcas con rellenos, cruces, punto y garabatos) y que la banda de ejemplos quedó bien. Aclaró que en las preguntas 17 y 18 no estaba del todo seguro.
- **Qué hubo que corregir:** NO CONSTA en este turno. La lectura no tenía errores; el problema que el usuario marcó después es de criterio de puntaje (N.º 24).
- **Qué inventó o erró la IA:** nada que conste.
- **Decisión mía (no delegada):** imprimir y probar la hoja V4 en papel con la app.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 24 · 2026-10-24 20:47 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > En la ultima correcciòn acabo de marcar dos respuestas, para que las identifiques, no es un tema de forma ni de detecciòn, es un tema de criterio a la hora de reducir puntajes por respuestas incorrectas.
- **Qué hizo la IA:** buscó en Google Drive el `casos.json` de la carpeta de casos a revisar (la primera búsqueda falló por un campo de consulta no soportado y se repitió con otra consulta); identificó las preguntas 7 y 9 marcadas; calculó sus puntajes (1,675 y 0,567); preguntó qué criterio usar mediante un formulario de opciones. El usuario eligió «Descuento solo si marca más opciones que las correctas»; la IA lo implementó en `js/scoring.js`, actualizó la ayuda, el README y las pruebas, y lo subió a la rama de trabajo (commits «Descuento solo por marcas por encima de la cantidad de correctas» y «Corrige valores esperados de la prueba de descuento», según git, 2026-10-24).
- **Qué hubo que corregir:** valores esperados de la prueba nueva (un redondeo y dos cálculos mal planteados por la IA); ese criterio fue reemplazado después (N.º 26 a 29).
- **Qué inventó o erró la IA:** en el formulario de opciones, la descripción de una opción traía una cuenta incompleta e incorrecta («Q7: 5 − ... se calcula sobre el total…», «Q7 ≈ 2,5 − 0,55 = 1,95; Q9 ≈ 1,667 − 2×0,825 → 0»). La IA hizo un commit con una prueba fallando (82 pasaron, 1 fallaron) y lo corrigió en un commit posterior.
- **Decisión mía (no delegada):** elegir el criterio «solo si marca más opciones que las correctas» entre las alternativas, y señalar las dos respuestas problemáticas.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 5, 6

### N.º 25 · 2026-10-24 20:54 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > Planteemos ejemplos a ver como responderia: 
  > Por ejemplo: 
  > 0 opcion marcada correcta, cuando eran dos correctas.
  > 1 opcion marcada correcta, cuando eran dos correctas.
  > 1 opcion marcada correcta y una incorrecta, cuando eran dos correctas.
  > 2 opciones marcadas correctas y una incorrecta, cuando eran dos correctas.
  >
  > Segui enumerando los ejemplos para cubrir muchas posibilidades, y luego revisa como responderia la herramienta
- **Qué hizo la IA:** ejecutó la función de puntaje con 25 casos (claves A,B / A,B,C / A) y mostró tres tablas con los resultados; señaló tres incoherencias: marcar una incorrecta en lugar de una correcta salía gratis, había saltos al marcar de más y con una sola correcta el descuento arrancaba enseguida.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA. Los resultados son los del criterio que la IA acababa de implementar.
- **Decisión mía (no delegada):** probar el puntaje con casos de respuesta conocida (esta es la verificación pedida por el ítem 5 de la lista).
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 26 · 2026-10-24 20:57 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > Vamos de a poco, los casos 7, 9, 21,24 se me hacen raros.
- **Qué hizo la IA:** explicó el origen de cada resultado (con 2 o más correctas la primera incorrecta sale gratis, con una sola correcta se descuentan todas) y mostró cómo cambiarían si cada incorrecta restara siempre. Preguntó cuál de las dos cosas le parecía mal.
- **Qué hubo que corregir:** el criterio del N.º 24 producía resultados extraños (señalados por el usuario).
- **Qué inventó o erró la IA:** NO CONSTA. El criterio implementado era del propio asistente y el usuario detectó el problema.
- **Decisión mía (no delegada):** reconocer qué casos eran incoherentes.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 27 · 2026-10-24 20:59 UTC · Claude Code
- **Etapa:** diseño
- **Pedido (textual):**
  > Creo que hay que tratar de forma diferente cuando la persona marca todas las opciones de cuando se marcan 1 o 2 de forma incorrecta.
- **Qué hizo la IA:** propuso una regla en dos partes (cada incorrecta resta siempre; marcar todas las opciones vale 0) con una tabla de comparación.
- **Qué hubo que corregir:** la regla de «marcar todas = 0» era demasiado dura (ver N.º 28).
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que marcar todas las opciones se trate distinto de marcar una o dos incorrectas.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 6

### N.º 28 · 2026-10-24 21:00 UTC · Claude Code
- **Etapa:** diseño
- **Pedido (textual):**
  > pero que pasaria si son 4 opciones correctas y marcó las 5 opciones?
- **Qué hizo la IA:** admitió que su regla daba 0 con 4 correctas de 5 por una sola incorrecta, lo que es injusto; propuso que marcar todas valga 0 solo cuando las correctas sean la mitad o menos de las opciones, con una tabla (con 5 opciones: 1 o 2 correctas valen 0; con 3 o 4 se usa la fórmula normal, 0,78 y 0,9175) y pidió confirmar el caso límite de 3 correctas de 5.
- **Qué hubo que corregir:** la propuesta anterior de la IA.
- **Qué inventó o erró la IA:** la regla propuesta en el N.º 27 aplicaba «todas = 0» sin distinguir cuántas correctas había; el usuario lo detectó con esta pregunta.
- **Decisión mía (no delegada):** detectar el caso límite (4 correctas de 5) y aceptar el umbral «la mitad o menos».
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 5, 6

### N.º 29 · 2026-10-24 21:05 UTC · Claude Code
- **Etapa:** construcción
- **Pedido (textual):**
  > si, implemetnalo
- **Qué hizo la IA:** implementó la regla (cada incorrecta marcada resta el descuento configurado; marcar todas vale 0 si las correctas son la mitad o menos de las opciones y no son todas), actualizó el texto de ayuda y el ejemplo de la pestaña Examen, el README y las pruebas (83 pruebas pasan) y subió el cambio («Descuento por cada incorrecta; marcar todas vale 0 si las correctas son la mitad o menos», según git, 2026-10-24).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** aprobar la implementación de la regla.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 5, 6, 7

### N.º 30 · 2026-10-24 21:06 UTC · Claude Code
- **Etapa:** despliegue
- **Pedido (textual):**
  > hace el merge
- **Qué hizo la IA:** creó el pull request n.º 6 y lo fusionó a `main` (merge del PR n.º 6, según git, 2026-10-24). Avisó que había que recargar sin caché para ver el número de versión nuevo.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** autorizar la fusión a `main`. La IA no fusiona sin que yo lo pida.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 9

---

## Listas finales (solo lo que consta)

### A. Herramientas y modelos usados en este chat (con su rol)

- **Claude Code** (asistente de Anthropic, sesión en la nube de claude.ai/code): arma y modifica la app, ejecuta pruebas, hace commits y pull requests. Modelo: completar a mano en el informe (no se registra en el repositorio).
- **Herramientas del asistente usadas para la app** (según el resumen y este tramo del chat): ejecutar comandos (Node para las pruebas, git), leer y editar archivos, formulario de opciones (AskUserQuestion), enviar archivos al usuario, buscador de herramientas (ToolSearch).
- **GitHub (servidor MCP):** crear pull requests, fusionarlos y leer archivos. La IA no pudo crear repositorios (error 403).
- **Google Drive (servidor MCP):** buscar y leer archivos; en este tramo se usó para leer el `casos.json` de casos a revisar de la carpeta del examen.
- **Pruebas automáticas del proyecto:** `tests/run.js` (82 pruebas al inicio de este tramo, 83 al final), `tests/synth.js` (fotos sintéticas con perspectiva y ruido) y `tests/mockdrive.js` (Drive simulado). Según el resumen, además hubo pruebas de extremo a extremo con un navegador automatizado, que no están en el repositorio.
- **Fotos reales** de hojas impresas V1 a V4 aportadas por el usuario (seis analizadas según el resumen, más las de este tramo).
- **Plataforma de la app:** JavaScript sin dependencias, publicada en GitHub Pages; Google Identity Services y API de Drive (permiso `drive.file`).

### B. Todo lo que la IA inventó o afirmó mal y yo detecté (solo lo que consta)

1. (Según el resumen, N.º 13) El chequeo de orientación fallaba en una foto real y las cruces finas no se leían; lo detecté probando con una hoja real.
2. (Según el resumen, N.º 13) Los ejemplos de prueba de la IA usaban mi nombre y registro reales; pedí que no se subieran al repositorio.
3. (Según el resumen, N.º 16) Confusión con el cálculo de la pregunta 8; la caché del navegador mostraba versiones viejas.
4. (Según el resumen, N.º 17) La lectura fallaba con hojas con más de la mitad de las burbujas marcadas, y con la hoja vecina en la foto.
5. (N.º 24) El criterio «descuento solo por marcas por encima de la cantidad de correctas» daba resultados que señalé como raros (casos 7, 9, 21 y 24: la primera incorrecta salía gratis); además, las descripciones de las opciones en el formulario traían una cuenta mal armada.
6. (N.º 28) La regla «marcar todas las opciones vale 0» no distinguía cuántas correctas había; con 4 correctas de 5 daba 0 por una sola incorrecta.
7. (N.º 24) La IA hizo un commit con una prueba fallando y con valores esperados mal calculados.

### C. Decisiones que tomé yo y no le delegué

- Qué problema resolver y con qué solución (grilla en papel, foto con el celular, app que corrige) (N.º 1 y 2).
- Que el criterio de aprobación lo decida yo y no la app (N.º 3).
- Puntaje parcial por respuestas correctas (N.º 4).
- Nombre y registro manuscritos, con 7 casilleros para el registro (N.º 5).
- Google Drive como lugar de los resultados y las fotos, para verlos desde el celular y la PC (N.º 6).
- Crear los repositorios y el ID de cliente de Google, y publicar en `main` (N.º 7, 10, 12, 19, 22, 30).
- Valores de modalidad y qué parte de la hoja se puede editar (N.º 8 y 9).
- No subir mis datos personales al repositorio (N.º 13).
- Reglas de identificación (nombre o registro obligatorio, repetidos, foto duplicada), versionado de la hoja, leyenda de validez, fecha y compatibilidad con hojas ya impresas (N.º 14).
- Descuento libre de 0 a 1 y tres decimales (N.º 16).
- Forma inequívoca de las marcas de esquina (N.º 18).
- Banderas para marcar dudosas y que la IA las analice (N.º 19).
- Que un punto lo bastante grande cuente como respuesta (N.º 20).
- Diseño de la banda de ejemplos de la hoja V4 (N.º 21 y 22).
- Criterio de descuento por incorrectas: elegí la primera alternativa, la rechacé al ver sus resultados y definí el tratamiento de «marcar todas» con el umbral de la mitad (N.º 24 a 29).
- Probar con hojas reales impresas y con casos de respuesta conocida (N.º 13, 17, 20, 23, 25).

### D. Datos o cifras mencionados en el chat

- 10 o 20 preguntas, 4 o 5 opciones por pregunta: respuestas del usuario a la IA (paráfrasis del resumen). Origen: usuario.
- 7 casilleros para el registro: elección del usuario en el formulario. Origen: usuario.
- Hoja A5, 2 por hoja A4 apaisada: propuesta de la IA, aceptada por el usuario. Origen: IA.
- Descuento por incorrecta: valor inicial 0,33 en un examen nuevo, configurable de 0 a 1. Origen: valor puesto por la IA (según el resumen); el usuario lo dejó. En el `casos.json` del examen del usuario figura 0,33.
- Puntos por pregunta en el examen de prueba del usuario: 5 (`casos.json`). Origen: archivo del usuario en Drive.
- Sensibilidad normal 0,085 (alta 0,05, baja 0,16): calibrada por la IA con fotos reales (según el resumen: seis fotos). Origen: pruebas de la IA con fotos del usuario.
- Capacidad de la hoja V4: 32 preguntas con 5 opciones o 48 con 4 opciones. Origen: cálculo de la app.
- Pruebas automáticas: 82 al inicio de este tramo y 83 al final. Origen: salida de `node tests/run.js`.
- Fallas reportadas en la primera prueba real: respuestas 4 y 6 no leídas (N.º 13); en la segunda prueba, mal leídas 4, 11, 15, 18 y 20 y no leídas 12, 13, 14 y 17 (N.º 17). Origen: usuario (según el resumen).
- Costo acumulado de la sesión: USD 39,33 hasta el 2026-11-08, según la consulta de la sesión de la plataforma. **Incluye también el trabajo fuera del alcance de este registro** (armado del examen); no es solo el costo de la herramienta. Origen: la consulta de la sesión hecha en este chat.
- Tiempo de corrección a mano: SIN ORIGEN. El usuario solo dijo «lleva mucho tiempo corregirlos»; no hay cifra.
- Cantidad de alumnos o de exámenes por cuatrimestre: NO CONSTA.
