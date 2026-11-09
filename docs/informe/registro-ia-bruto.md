# Registro de uso de IA (bruto) · Herramienta de corrección METSI

Material en bruto para la sección «Registro de uso de IA» del informe. Alcance: **solo la herramienta de corrección** (la app que corrige hojas de multiple choice a partir de una foto). Quedan fuera los pedidos de armado del examen del 2.º parcial y su guía, la carga del banco de preguntas y la subida de la skill de armado de exámenes a otro repositorio, porque no pidieron agregados ni correcciones a la herramienta.

## Cómo leer este archivo

- **Origen del texto:** el archivo de esta sesión empieza con un *resumen de contexto* que sustituye la parte inicial del chat, así que los mensajes anteriores a ese resumen los pegó el usuario después (1 y 2 de octubre en la Parte 1, 24 de octubre en la Parte 2) y están copiados tal cual. Los posteriores al resumen (Parte 3) están copiados del archivo de la sesión.
- **Límite:** los pegados traen solo los mensajes del usuario, sin las preguntas ni las respuestas del asistente. Por eso, en «Qué hizo la IA» solo escribo lo que consta en esos mensajes, en el historial de git («según git») o en el resumen de contexto («según el resumen de contexto»).
- **Fechas:** de los pedidos del 1, 2 y 24 de octubre, la fecha la indicó el usuario. De los posteriores al resumen consta la hora (UTC) del archivo de la sesión. Los commits relacionados se citan «(según git)» con su fecha de commit (solo el día).
- «NO CONSTA» significa que no hay dato en lo disponible. No rellené con suposiciones.
- Se reemplazó por «[OMITIDO]» el ID de cliente de Google, y no se incluyen nombres ni registros de alumnos ni datos personales.
- No registro aquí el nombre del modelo. **Completar a mano** en el informe: modelo y versión según el encabezado de la sesión en claude.ai.

Lista de cumplimiento (ítems 1 a 12) usada en el campo «Ítem(s)»: 1 Problema real · 2 Herramienta/modelo y costo · 3 Instrucciones para el modelo · 4 Datos que usa · 5 Verificación · 6 Autonomía · 7 Construcción paso a paso · 8 Datos en tablas · 9 Instalación en la organización · 10 Riesgos y datos personales · 11 Uso de IA declarado · 12 Valor estimado.

---

## Parte 1 · Pedidos del 1 y 2 de octubre (texto pegado por el usuario)

Los mensajes de esta parte son los que el usuario pegó, copiados tal cual. El pegado trae solo sus mensajes: no incluye las preguntas ni las respuestas del asistente (salvo el contexto de la N.º 22, que viene de un pegado previo que sí traía texto del asistente). Por eso, en «Qué hizo la IA» solo escribo lo que consta en esos mensajes o en el historial de git («según git»). Los mensajes del 1 de octubre sobre subir la skill de armado de exámenes a otro repositorio quedan fuera por el alcance de este registro.

### N.º 1 · 2026-10-01 (indicado por el usuario) · Claude Code
- **Etapa:** idea
- **Pedido (textual, mensajes consecutivos):**
  > Yo soy profesor en la universidad, de una materia que se llama Metsi
  >
  > por ahora no quiero hacer nada con el repositorio
  >
  > Estoy pensando en funcion de una necesidad que estoy teniendo
  >
  > Resulta que los examenes en papel son multiple choice y lleva mucho tiempo corregirlos
  >
  > yo estaba pensando en la primera de las opciones, que los alumnos completen una grilla con las respuestas, sacarles una foto y que una app lo corrija
- **Qué hizo la IA:** NO CONSTA el contenido. Por el último mensaje, la IA había presentado opciones de solución y el usuario eligió la primera.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** el problema (corregir a mano exámenes multiple choice lleva mucho tiempo), la opción elegida (grilla en papel, foto y app) y no tocar el repositorio por ahora.
- **Sección del informe donde encaja:** 1 Problema
- **Ítem(s):** 1

### N.º 2 · 2026-10-01 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual; son respuestas a preguntas numeradas del asistente, que no vienen en el pegado):**
  > 1. Es variable, el 1er examen suele tener 10 preguntas, pero por el ejemplo el 2do examen suele tener 20 preguntas.  Con respecto a las respuestas, suelen ser entre 4 y 5 opciones.
  > 2. No solemos tener varios temas dentro de un turno de evaluaciòn,  pero el examen puede variar cada vez que lo tomamos.
  > 3. Yo. Desde un celular.
  > 4.  si es una app tendria que poder verlo ahi y descargarlo como planilla, importable en excel o google spreadsheet.
  > 5. si, entraria en este repositorio
- **Qué hizo la IA:** NO CONSTA el contenido de las preguntas. Después construyó la base de la app («Agrega corrector de multiple choice a partir de fotos», según git, 2026-10-01).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** cantidad de preguntas (10 o 20) y de opciones (4 o 5), quién saca las fotos (yo, con el celular), salida como planilla importable y construir la app en este repositorio.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 1, 4, 6

### N.º 3 · 2026-10-01 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > 1 Nosotros les pedimos a los alumnos: Nombre y apellido, Numero de Registro, Modalidad de cursada.
  > 2 el puntaje tiene que ser configurable. 
  >
  > Algo más: Pueden haber varias respuestas correctas por pregunta, por lo que tengo que poder establecer un puntaje por pregunta, y que este se divida entre sus respuestas correctas, me explico?
  > Tengo que poder también establecer el criterio de aprobación por ejemplo: 50% del examen correcto es un 4 (se aprueba con 4 o mas) o bien que si por ejemplo son 10 preguntas y sumando 4 puntos entre las respuestas correctas aprobas.
- **Qué hizo la IA:** NO CONSTA el contenido. Después la app quedó con clave de respuestas con puntaje por pregunta repartido entre sus correctas (según el README del proyecto).
- **Qué hubo que corregir:** el pedido de criterio de aprobación se reemplazó en el mensaje siguiente (N.º 4).
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** qué datos pedir a los alumnos, puntaje configurable por pregunta repartido entre las respuestas correctas.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 4, 6

### N.º 4 · 2026-10-01 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual):**
  > ahora que lo pienso, quizas a la app no le importa si el alumno aprueba o no, con que me diga el puntaje luego yo establezco el criterio de aprobacion
- **Qué hizo la IA:** NO CONSTA el detalle; la app informa solo el puntaje y no decide quién aprueba (según el README del proyecto).
- **Qué hubo que corregir:** el usuario retiró su pedido anterior del criterio de aprobación (N.º 3).
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que el criterio de aprobación lo decido yo después y no la app.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 6

### N.º 5 · 2026-10-01 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual):**
  > Se admiten respuestas parciales, es decir si una pregunta tiene 3 respuestas correctas, pero la persona marcò solo 1 de las correctas TIENE que recibir ese puntaje.
- **Qué hizo la IA:** NO CONSTA el detalle; el puntaje parcial quedó implementado (según el README del proyecto).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** regla de puntaje parcial.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 5, 6

### N.º 6 · 2026-10-01 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > Si bien la toma de las fotos la voy a hacer con el celular, los resultados si tienen que poder recuperarse desde la pc, quizàs lo conveniente es alojar las imagenes en google drive.
  >
  > tengo que poder recuperar las notas tanto desde el celular como desde la pc
- **Qué hizo la IA:** implementó la sincronización con Google Drive («Prepara la base para sincronizar con Google Drive» y «Sincroniza resultados y fotos con Google Drive», según git, 2026-10-01).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** usar Google Drive para ver los resultados y las fotos desde el celular y la PC.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 2, 4, 9

### N.º 7 · 2026-10-01 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > otra cosa, la grilla de evaluaciòn tiene que entrar en la  mitad de una hoja A4, serìa formato A5?
  >
  > el nombre y el registro los vas a identificar como con ocr?
  > recordà que esos datos van a estar escritos a mano.
  >
  > No entiendo a que te referis con llenar burbujas para completar el registro. podes mostrarme un ejemplo?
  >
  > Sin burbujas para el registro, pero si 7 casilleros para marcar allì su registro
- **Qué hizo la IA:** NO CONSTA el detalle de las respuestas. Generó la hoja A5 con nombre y registro manuscritos («Hoja de respuestas en A5 con nombre y registro manuscritos», según git, 2026-10-01). El último mensaje coincide con el texto de una opción propuesta por la IA, que el usuario eligió.
- **Qué hubo que corregir:** el usuario no entendió la propuesta de burbujas para el registro y pidió un ejemplo antes de decidir.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** hoja en formato A5 (la mitad de una A4); nombre y registro manuscritos, sin burbujas para el registro y con 7 casilleros.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 4, 10

### N.º 8 · 2026-10-01 (indicado por el usuario) · Claude Code
- **Etapa:** despliegue
- **Pedido (textual):**
  > No tengo experiencia en repositorios, asi que necesito que me indiques vos que es mas conveniente.
  > NEcesito que me orientes para crear el ID del cliente de google.
  > Ahora no tengo impresora, y por el momento no me disponibilizaste un pdf o doc o gdoc para ver la hoja e imprimirla.
- **Qué hizo la IA:** NO CONSTA el detalle. Quedó alojada en GitHub Pages desde la rama principal (según el resumen de contexto) y la IA orientó sobre el ID de cliente de Google. Cómo entregó la hoja para imprimir: NO CONSTA.
- **Qué hubo que corregir:** NO CONSTA. El usuario señaló que todavía no tenía un archivo de la hoja para ver e imprimir.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** delegar en la IA la elección de cómo alojar la app; crear yo el ID de cliente.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 2, 9

### N.º 9 · 2026-10-01 (indicado por el usuario) · Claude Code
- **Etapa:** construcción
- **Pedido (textual, mensajes consecutivos):**
  > La modalidad es "Presencial" o "A distancia"
  >
  > Necesito poder modificar las hojas, asi que voy a necesitar que sea editables
- **Qué hizo la IA:** puso «Presencial» y «A distancia» como modalidades por defecto («Modalidades por defecto: Presencial y A distancia», según git, 2026-10-01) y agregó la personalización de la hoja con encabezado, etiquetas, instrucciones y logo («Personalización de la hoja…», según git, 2026-10-01). La grilla de respuestas no es editable.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** valores de modalidad y que la hoja sea editable.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 7, 9

### N.º 10 · 2026-10-01 (indicado por el usuario) · Claude Code
- **Etapa:** despliegue
- **Pedido (textual, mensajes consecutivos):**
  > ya configure el google id
  > id cliente de google [OMITIDO]
  >
  > Puedo mover la carpeta metsi corrector dentro de otra carpeta de google drive?
  > listo
- **Qué hizo la IA:** cargó el ID de cliente en la configuración («Configura el ID de cliente de Google para la sincronización con Drive», según git, 2026-10-01). La respuesta sobre mover la carpeta: NO CONSTA.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** crear y configurar yo el ID de cliente en Google Cloud.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 9, 10

### N.º 11 · 2026-10-01 (indicado por el usuario) · Claude Code
- **Etapa:** despliegue
- **Pedido (textual, mensajes consecutivos):**
  > por que cuando entro en https://jctonini.github.io/ me tira error 404?
  >
  > mi pregunta va mas allà de la carpeta metsi, yo lo que digo es que si entro en https://jctonini.github.io/ quizàs me tendria que mostrar el directorio de carpetas, no error.
  >
  > no, asi esta bien, pero el dia que tenga otro proyecto ademas del corrector de metsi, como tendria que hacer para acceder ahi y ver los dos?
  >
  > hagamos el indice entonces
  > listo, hecho
- **Qué hizo la IA:** NO CONSTA el detalle. Por el último pedido, propuso crear un índice. Los archivos creados no figuran en los commits de este repositorio.
- **Qué hubo que corregir:** el usuario precisó que su pregunta iba más allá de la carpeta de METSI (quería ver un listado de proyectos en la dirección raíz).
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** crear un índice para acceder a varios proyectos; hice yo los pasos que me indicó («listo, hecho»).
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 9

### N.º 12 · 2026-10-01 (indicado por el usuario) · Claude Code
- **Etapa:** despliegue
- **Pedido (textual, mensajes consecutivos):**
  > explicame mas sobre el punto 3
  >
  > hagamoslo
  > hecho

  Contexto (texto del asistente, aportado por el usuario: es el «punto 3» que pidió explicar): «Pasar el código a la rama main del repositorio METSI. Hoy la app se publica desde una rama con nombre automático, y conviene dejarla en main para que quede ordenado. Cuando quieras, lo hacemos.»
- **Qué hizo la IA:** había propuesto pasar el código a la rama `main`, porque la app se publicaba desde una rama con nombre automático. Respondió a la petición de explicación (el texto de la explicación NO CONSTA). Con la aprobación del usuario se fusionó el primer pull request a `main` (el historial de git muestra el pull request n.º 1 fusionado el 2026-10-01). Qué pasos hizo el usuario antes de decir «hecho»: NO CONSTA.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** pedir una explicación antes de aprobar, aprobar el pase a `main` («hagamoslo») y hacer yo los pasos que me indicó («hecho»).
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 7, 9

### N.º 13 · 2026-10-02 (indicado por el usuario) · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, mensajes consecutivos):**
  > tengo la prueba real y tambien tengo algun feedback para compartirte para mejorar la app
  >
  > Las respuestas 4 y 6 no las leyó
  >
  > la sincronizacion con drive anduvo bien.
  >
  > es mi nombre y mi registro de cuando era alumno, mejor no lo subas al repo.
- **Qué hizo la IA:** corrigió la lectura de la foto real («Corrige la lectura de una foto real: orientación y marcas con cruz», según git, 2026-10-02): comparar la orientación contra la hoja girada 180° y restar una línea base para leer cruces finas (según el resumen de contexto).
- **Qué hubo que corregir:** la lectura de las respuestas 4 y 6.
- **Qué inventó o erró la IA (según el resumen de contexto):** el chequeo de orientación fallaba en una foto real (oscuridad de la barra 0,37 contra un umbral de 0,5) y las cruces finas no se leían. Los ejemplos de prueba de la IA coincidían con el nombre y registro reales del usuario; se reemplazaron por datos inventados y se reescribió la historia de la rama propia sin fusionar. Desde entonces se revisó el repositorio y su historial antes de cada commit.
- **Decisión mía (no delegada):** probar con una hoja real; confirmar que la sincronización con Drive funciona; no subir mis datos personales al repositorio.
- **Sección del informe donde encaja:** 6 Pruebas (y 7 Riesgos y controles por el dato personal)
- **Ítem(s):** 5, 10

### N.º 14 · 2026-10-02 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos; son respuestas a puntos numerados del asistente, que no vienen en el pegado):**
  > Todavia no ejecutes ninguna accion, yo te voy a ir mandando el feedback y luego te digo cuando accionar.
  >
  > feedback: y cosas a revisar, un examen tiene que tener si o si o nombre o registro, uno tiene que tener, sino la app me lo tiene que frenar. puede faltar la modalidad pero con los otros dos datos la obtengo del registro de alumnos.
  >
  > claro, falta el dato en la app, con que la imagen recorte ese pedazo esta ok. un registro repetido tiene que frenar, minimo preguntar.
  >
  > lo del registro repetido me parece bien. 
  >
  > Dato repetido es la combinaciòn Nombre  y Registro
  > lo del recuperatorio es correcto.
  > 1 frena y consulta.
  > 2 avisa 
  > 3 es un caso raro, podria repetirse si saque dos veces la foto, o subi dos veces la misma foto, pero dos examenes fisicos con esa info seria raro.
  > 4 me parece bien
- **Qué hizo la IA:** esperó a que el usuario terminara de enviar el feedback. Por el mensaje del usuario, la IA planteó cuatro casos numerados de datos repetidos y una forma de mostrar el recorte del nombre y registro de la foto. Luego aplicó los cambios («Hoja V2, identificación obligatoria y control de repetidos», según git, 2026-10-02).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que cada examen tenga nombre o registro y la app frene si falta; que un registro repetido frene y consulte; qué se considera dato repetido (nombre y registro); qué hacer en cada uno de los cuatro casos; que alcance con mostrar el recorte de la imagen para cargar el nombre y el registro.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 6, 10

### N.º 15 · 2026-10-02 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > la foto duplicada me parece bien. ahora me quedan dudas de como detectar si le saque dos fotos al mismo examen por distraido
  >
  > vamos por la 1. y se complementa con la 3.
- **Qué hizo la IA:** NO CONSTA el detalle. Por el mensaje, planteó alternativas numeradas para detectar si se fotografió dos veces el mismo examen. Después implementó el aviso de la misma foto y el parecido de letra entre fotos (según el resumen de contexto).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** aceptar el aviso de foto duplicada y elegir la alternativa 1, complementada con la 3, para detectar el mismo examen fotografiado dos veces.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 6

### N.º 16 · 2026-10-02 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > El renglon para cargar el nombre y el apellido esta muy cerca del campo superior, se necesita mas espacio ahi.
  > Vamos por la primera alternativa, pero vas a tener que mantener la compatibilidad con el caso actual porque son las que ya imprimi y las voy a usar para hacer pruebas.
- **Qué hizo la IA:** NO CONSTA el detalle. Por el mensaje, planteó alternativas numeradas para dar más espacio al nombre. Creó la hoja V2 y dejó la V1 solo para lectura, con su geometría fija y una prueba (según el resumen de contexto y «Hoja V2…», según git, 2026-10-02).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** elegir la primera alternativa; mantener la compatibilidad con las hojas V1 ya impresas, que uso para las pruebas.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 7

### N.º 17 · 2026-10-02 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > ponele versionado a la hoja e imprimilo al pie
  > me parece bien lo del codigo, el texto solo "Vx" donde X es el numero..
  > La leyenda del pie "Rellenà por completo..." cambiala por "Rellená el cìrculo por completo con birome" no quiero que alguien lo haga con lapiz.
  >
  >
  > Tenes que agregar una leyenda que diga que la grilla de respuestas es la ùnica valida en caso de diferencias con las respuestas marcadas en el examen
  >
  > "En caso de haber diferencias entre las respuestas marcadas en el examen y en esta hoja. Prevalecen aquellas marcadas en la hoja de respuestas"
  > Vamos con tu sugerencia de exto.
- **Qué hizo la IA:** NO CONSTA el detalle. Por los mensajes, propuso un código de versión legible por la app y un texto de leyenda de validez. Los implementó en la hoja V2 («Hoja V2…», según git, 2026-10-02): código de tres cuadraditos más el texto «V#» al pie, y la leyenda de validez.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** versionar la hoja con «Vx» impreso al pie; el texto de la leyenda del pie («Rellená el cìrculo por completo con birome», para evitar el lápiz); la leyenda de que la hoja de respuestas es la única válida; aceptar el texto sugerido por la IA para esa leyenda.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 7, 10

### N.º 18 · 2026-10-02 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > La V1 no voy a volver a imprimirla, solo queda para pruebas
  > Agreguemos un campo para cargar la fecha
  > La fecha tiene que estar incluida en la hoja, pero no hace falta cortarla y guardarla.
  > Formato: "Fecha:       /      /        "   sin los espacios para las letras
  > Vamos con esos cambios por el momento.
- **Qué hizo la IA:** agregó el campo de fecha a la hoja V2 («Hoja V2…», según git, 2026-10-02). Por el último mensaje, quedó a la espera de la indicación de avanzar con los cambios.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** no volver a imprimir la V1; campo de fecha impreso en la hoja, sin recortarlo ni guardarlo, con el formato «Fecha: / /»; dar por cerrada la tanda de cambios.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 7

### N.º 19 · 2026-10-02 (indicado por el usuario) · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, mensajes consecutivos):**
  > ah tengo algo mas
  >
  > La forma de completar las respuestas correctas  en el celular y en la pc es diferente, tienen que ser igual, me refiero al orden de las respuestas en la pc es 
  > 1-2
  > 3-4
  > 5-6
  > 7-8
  > ...
  >
  > Y en el celular es 
  > 1
  > 2
  > 3
  > 4
  > 5
  > ... eso confunde.
  > pasalo a main por favor.
- **Qué hizo la IA:** unificó la disposición de la clave en columnas (CSS, según el resumen de contexto) y se fusionó a `main` (el historial de git muestra el pull request n.º 2 fusionado el 2026-10-02; la correspondencia exacta con este pedido NO CONSTA).
- **Qué hubo que corregir:** el orden de la clave de respuestas era distinto en la PC (de a pares) y en el celular (de a uno).
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que la clave se vea igual en la PC y en el celular; autorizar la publicación en `main`.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 7, 9

### N.º 20 · 2026-10-02 (indicado por el usuario) · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, mensajes consecutivos):**
  > falla me dice asi: Hoja 1
  > 20261002_181455.jpg
  > Quitar
  > No se reconoce la orientación de la hoja. Revisá que sea la hoja correcta y que esté completa en la foto.
  > es la misma foto, por eso tmb me llama la atencion que falle
  >
  > ahi actualice el navegador y la levantò bien
- **Qué hizo la IA:** NO CONSTA el detalle. Por el último mensaje, la lectura funcionó al actualizar el navegador. Más tarde agregó un número de versión visible y en los archivos de la app para evitar copias viejas (ver N.º 22).
- **Qué hubo que corregir:** el navegador seguía con una copia vieja del código y mostraba el error de orientación que ya estaba corregido.
- **Qué inventó o erró la IA (según el resumen de contexto):** la app no tenía protección contra copias viejas en el navegador.
- **Decisión mía (no delegada):** reportar la falla con el mensaje exacto y probar de nuevo con la misma foto.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 21 · 2026-10-02 (indicado por el usuario) · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, mensajes consecutivos):**
  > pero me acorde de algo mas a corregir
  > hay algo con el calculo de las respuestas que quiero revisar.
  >
  > en mi ejemplo en la pregunta 8, las respuestas correctas son A, B, C, D y en el ejemplo marqué todas las letras, de A a E, sin embargo el alumno estaria recibiendo 0 puntos, cuando en realidad.. considero que tendria que recibir puntaje. no perfecto, pero si algun puntaje.
  > asi fue mi configuraciòn del examen de respuestas correctas.
- **Qué hizo la IA:** NO CONSTA el detalle de su explicación. Después propuso un descuento por incorrecta configurable entre 0 y 1 (ver N.º 22).
- **Qué hubo que corregir:** el puntaje de la pregunta 8 con todas las opciones marcadas.
- **Qué inventó o erró la IA:** NO CONSTA. Hay una diferencia a revisar entre lo que dice el usuario (clave A, B, C, D en la pregunta 8) y un mensaje del asistente que hablaba de una clave con B y C para esa pregunta.
- **Decisión mía (no delegada):** señalar que marcar todas las opciones no debe dar cero cuando hay varias correctas.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5, 6

### N.º 22 · 2026-10-02 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes del usuario):**
  > 1. acepto tu propuesta de poder configurar un numero entre 0 y 1. 
  > 2. 3 decimales esta bien. 
  > 3, ok.
  > hoy no puedo imprimrla esto queda pendiente.

  > pasalo a main

  Contexto (texto del asistente, copiado del pegado anterior, no es pedido del usuario): una captura enviada por el usuario con su clave y su foto; el asistente respondió que «la pregunta 8 da 0/1 porque tu clave tiene B y C, y el total de 4,666667 coincide con el que calculé», propuso mostrar los números redondeados a 2 decimales y con coma, un campo numérico libre de 0 a 1 para el descuento por incorrecta (el valor por defecto era 1, con tres opciones fijas), un número de versión en los archivos de la app y generar y probar la hoja V2 impresa.
- **Qué hizo la IA:** esperó las respuestas del usuario y luego implementó un campo numérico de 0 a 1 para el descuento (corrige valores fuera de rango, muestra un ejemplo que se recalcula y avisa con 0), números con hasta 3 decimales y coma en pantalla y en el CSV, y número de versión visible en la app y en los archivos. Verificó con la clave y la foto del usuario (descuento 1 → 4,667; 0,5 → 5,583; 0,33 → 6,065; pregunta 8 → 0,505/1 con 0,33) y pasaron 60 pruebas. Subió a la rama y, ante «pasalo a main», fusionó el pull request n.º 3 («Descuento libre por incorrecta, números con 3 decimales y versión de archivos», según git, 2026-10-02).
- **Qué hubo que corregir:** la propuesta de la IA de 2 decimales; el usuario pidió 3. El descuento fijo de tres opciones pasó a un valor libre.
- **Qué inventó o erró la IA:** NO CONSTA error afirmado. Consta que el valor inicial de 0,33 para un examen nuevo lo eligió la IA sin que el usuario dijera un número (dicho por la IA: «Ese número lo elegí yo, porque no me dijiste uno»).
- **Decisión mía (no delegada):** aceptar un descuento configurable entre 0 y 1, fijar 3 decimales, aceptar el número de versión, dejar pendiente la impresión de la hoja V2 («hoy no puedo imprimirla») y ordenar la publicación en `main`.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 5, 6

---

## Parte 2 · Pedidos del 24 de octubre anteriores al resumen de contexto (texto pegado por el usuario)

Los mensajes de esta parte los pegó el usuario y están copiados tal cual. El pegado trae solo sus mensajes, sin las respuestas del asistente, así que «Qué hizo la IA» se apoya en el historial de git y en el resumen de contexto, marcados como tales.

### N.º 23 · 2026-10-24 (indicado por el usuario) · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, mensajes consecutivos):**
  > Acabo de hacer una prueba y los resultados no fueron buenos, hay varias cosas para revisar.
  > Te paso la foto de la corrección y la foto de lo detectado. 
  > Fallos detectados en respuestas: 4,11,15,18,20
  > Fallos no detectados en la detección: en respuestas en la 12,13,14,17
  > Cuando subi estas hojas con correcciones, el sistema me la rechazaba por no encontrar las esquinas de lectura
- **Qué hizo la IA:** corrigió la lectura de hojas con muchas marcas con una línea base robusta («Corrige la lectura de hojas con muchas marcas (nivel base robusto)», según git, 2026-10-24) y reconoció la hoja correcta cuando la foto trae la hoja vecina («Reconoce la hoja correcta cuando la foto trae la hoja vecina», según git, 2026-10-24).
- **Qué hubo que corregir:** la lectura de las preguntas 4, 11, 15, 18 y 20 (mal detectadas), de la 12, 13, 14 y 17 (no detectadas) y el rechazo de hojas por no encontrar las esquinas.
- **Qué inventó o erró la IA (según el resumen de contexto):** la línea base se inflaba cuando más de la mitad de las burbujas estaban marcadas; se pasó a una línea base solo de burbujas vacías, por columna y ventana local, con una prueba de regresión. Con fotos con la hoja vecina, la lectura salía corrida; una prueba mostró que cuatro burbujas rellenas formaban un cuadrilátero falso y se agregó un control de tamaño físico.
- **Decisión mía (no delegada):** probar con fotos reales y reportar con precisión qué preguntas se detectaron mal y cuáles no se detectaron.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 24 · 2026-10-24 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > Y no podes cambiarle la forma a las marcas de la derecha de la hoja? por ejemplo esperar un cuadrado negro a la izquierda y un triangulo a la derecha? eso seria inequivoco.
  > En una foto no voy a subir dos hojas de correcciòn completas, parte del proceso es cortarla para entregarlas a los alumnos. Si no es un triangulo, podrìa ser un circulo o bien, un rectangulo y un cuadrado, lo que vos prefieras pero que la identificacion sea inequivoca
- **Qué hizo la IA:** diseñó la hoja V3 con marcas de esquina de forma propia: cuadrados a la izquierda y barras a la derecha, con la orientación deducida de las formas («Hoja V3: marcas de esquina con forma propia», según git, 2026-10-24).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que las marcas de esquina se distingan sin ambigüedad; propuse cuadrado a la izquierda y triángulo a la derecha y dejé la forma final al criterio de la IA, con la precisión de que en una foto no suben dos hojas completas.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 5, 7

### N.º 25 · 2026-10-24 (indicado por el usuario) · Claude Code
- **Etapa:** construcción
- **Pedido (textual, mensajes consecutivos):**
  > Otra cosa, agrega la posibilidad de marcar como dudosas o a revisar con un flag las correcciones para que luego puedas analizarlas y corregir la tool
  > hace el merge
- **Qué hizo la IA:** agregó banderas por hoja y por pregunta, notas y registro de correcciones manuales, descarga en JSON y subida a Drive de los casos a revisar con las fotos sin el nombre, el registro ni la fecha («Casos a revisar: banderas, correcciones a mano y análisis en Drive», según git, 2026-10-24); luego se fusionó a `main` (pull request n.º 4, según git, 2026-10-24).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que los casos dudosos se marquen para que la IA los analice y corrija la herramienta; autorizar la fusión.
- **Sección del informe donde encaja:** 3 Solución (y 7 Riesgos y controles, por el enmascarado de datos personales)
- **Ítem(s):** 5, 6, 10

### N.º 26 · 2026-10-24 (indicado por el usuario) · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, mensajes consecutivos):**
  > Esta hoja se detectò bien y todas las respuestas marcadas se detectaron bien
  > lo hice a proposito para ver que pasaba, esta bien no detectarlo, PERO si el punto fuera lo suficientemente grande como para ser una respuesta entonces si tiene que contemplarlo.
  > Hice otra prueba y marquè con el flag la pregunta de algo que no quedó bien.
- **Qué hizo la IA:** analizó la foto marcada con la bandera y ajustó la medición: mide la tinta más cerca del centro de la burbuja («Mide la tinta más cerca del centro para leer mejor las cruces finas», según git, 2026-10-24) y recentró la sensibilidad normal en 0,085 («Centra el umbral de sensibilidad normal en 0,085», según git, 2026-10-24); un punto de al menos 1 mm cuenta como respuesta (según el README del proyecto).
- **Qué hubo que corregir:** el umbral de lectura de cruces finas.
- **Qué inventó o erró la IA (según el resumen de contexto):** las pruebas de tamaño de punto fallaron al cambiar el radio de medición y hubo que actualizarlas; las cruces quedaban en el borde del umbral y se recentró con un análisis de ventanas sobre seis fotos reales.
- **Decisión mía (no delegada):** hice a propósito la prueba con un punto y fijé el criterio: un punto lo bastante grande debe contar como respuesta; marqué con la bandera la pregunta que no quedó bien.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 27 · 2026-10-24 (indicado por el usuario) · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos; el primero lo aportó el usuario después):**
  > Quiero que agregues al pie, separado del espacio para marcar las respuestas, dos ejemplos en una misma fila, uno que indique como es la forma correcta de identificar una respuesta, y otro que indique como no es una forma correcta de marcar una respuesta.
  >
  > mostrame alternativas
  >
  > me gusta la opción A PERO el correcto lo haría pintando todo el circulo, asi como esta parece que hay que hacer rayitas, y del lado incorrecto, pondría los 4 ejemplos incorrectos.
- **Qué hizo la IA:** mostró alternativas y creó la hoja V4 con una banda de ejemplos al pie: correcto con el círculo pintado por completo y cuatro formas incorrectas (tilde, cruz, punto y medio relleno) («Hoja V4: banda de ejemplos de cómo marcar al pie», según git, 2026-10-24).
- **Qué hubo que corregir:** el ejemplo correcto de la alternativa A parecía mostrar rayitas en lugar del círculo pintado.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** pedir ejemplos de marcado correcto e incorrecto al pie; elegir la alternativa A con el círculo correcto pintado por completo y los cuatro incorrectos del otro lado.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 7

### N.º 28 · 2026-10-24 (indicado por el usuario) · Claude Code
- **Etapa:** construcción
- **Pedido (textual, mensajes consecutivos):**
  > Creo que podemos quitar la leyenda que dice "Rellena el circulo por completo con Birome" con lo ultimo agregado, se vuelve redundante
  > quitala y baja un poco más esto que agregamos de correcto / incorrecto. Si, pone lo de la birome en la parte de correcto.
  > Centra en cada espacio los textos Correcto / Incorrecto.
  > hace el merge
- **Qué hizo la IA:** quitó la línea redundante, bajó la banda, puso «con birome» en el lado correcto y centró los títulos («V4: sin la línea de instrucción, banda más abajo y títulos centrados», según git, 2026-10-24); creó el pull request n.º 5 y lo fusionó a `main` (según git, 2026-10-24).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** el diseño final de la banda y autorizar la fusión.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 7, 9

---

## Parte 3 · Pedidos posteriores al resumen (texto copiado del archivo de la sesión)

### N.º 29 · 2026-10-24 20:38 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > [dos imágenes, sin texto: la captura de la app con la hoja V4 corregida y la foto original de la hoja]
- **Qué hizo la IA:** comparó a simple vista las dos imágenes, sin ejecutar el lector sobre el archivo, y respondió que la hoja V4 impresa se leyó bien (hoja, versión V4, modalidad, marcas con rellenos, cruces, punto y garabatos) y que la banda de ejemplos quedó bien. Aclaró que en las preguntas 17 y 18 no estaba del todo seguro.
- **Qué hubo que corregir:** NO CONSTA en este turno. La lectura no tenía errores; el problema que el usuario marcó después es de criterio de puntaje (N.º 30).
- **Qué inventó o erró la IA:** nada que conste.
- **Decisión mía (no delegada):** imprimir y probar la hoja V4 en papel con la app.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 30 · 2026-10-24 20:47 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > En la ultima correcciòn acabo de marcar dos respuestas, para que las identifiques, no es un tema de forma ni de detecciòn, es un tema de criterio a la hora de reducir puntajes por respuestas incorrectas.
- **Qué hizo la IA:** buscó en Google Drive el `casos.json` de la carpeta de casos a revisar (la primera búsqueda falló por un campo de consulta no soportado y se repitió con otra consulta); identificó las preguntas 7 y 9 marcadas; calculó sus puntajes (1,675 y 0,567); preguntó qué criterio usar mediante un formulario de opciones. El usuario eligió «Descuento solo si marca más opciones que las correctas»; la IA lo implementó en `js/scoring.js`, actualizó la ayuda, el README y las pruebas, y lo subió a la rama de trabajo (commits «Descuento solo por marcas por encima de la cantidad de correctas» y «Corrige valores esperados de la prueba de descuento», según git, 2026-10-24).
- **Qué hubo que corregir:** valores esperados de la prueba nueva (un redondeo y dos cálculos mal planteados por la IA); ese criterio fue reemplazado después (N.º 32 a 35).
- **Qué inventó o erró la IA:** en el formulario de opciones, la descripción de una opción traía una cuenta incompleta e incorrecta («Q7: 5 − ... se calcula sobre el total…», «Q7 ≈ 2,5 − 0,55 = 1,95; Q9 ≈ 1,667 − 2×0,825 → 0»). La IA hizo un commit con una prueba fallando (82 pasaron, 1 fallaron) y lo corrigió en un commit posterior.
- **Decisión mía (no delegada):** elegir el criterio «solo si marca más opciones que las correctas» entre las alternativas, y señalar las dos respuestas problemáticas.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 5, 6

### N.º 31 · 2026-10-24 20:54 UTC · Claude Code
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

### N.º 32 · 2026-10-24 20:57 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > Vamos de a poco, los casos 7, 9, 21,24 se me hacen raros.
- **Qué hizo la IA:** explicó el origen de cada resultado (con 2 o más correctas la primera incorrecta sale gratis, con una sola correcta se descuentan todas) y mostró cómo cambiarían si cada incorrecta restara siempre. Preguntó cuál de las dos cosas le parecía mal.
- **Qué hubo que corregir:** el criterio del N.º 30 producía resultados extraños (señalados por el usuario).
- **Qué inventó o erró la IA:** NO CONSTA. El criterio implementado era del propio asistente y el usuario detectó el problema.
- **Decisión mía (no delegada):** reconocer qué casos eran incoherentes.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 33 · 2026-10-24 20:59 UTC · Claude Code
- **Etapa:** diseño
- **Pedido (textual):**
  > Creo que hay que tratar de forma diferente cuando la persona marca todas las opciones de cuando se marcan 1 o 2 de forma incorrecta.
- **Qué hizo la IA:** propuso una regla en dos partes (cada incorrecta resta siempre; marcar todas las opciones vale 0) con una tabla de comparación.
- **Qué hubo que corregir:** la regla de «marcar todas = 0» era demasiado dura (ver N.º 34).
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que marcar todas las opciones se trate distinto de marcar una o dos incorrectas.
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 3, 6

### N.º 34 · 2026-10-24 21:00 UTC · Claude Code
- **Etapa:** diseño
- **Pedido (textual):**
  > pero que pasaria si son 4 opciones correctas y marcó las 5 opciones?
- **Qué hizo la IA:** admitió que su regla daba 0 con 4 correctas de 5 por una sola incorrecta, lo que es injusto; propuso que marcar todas valga 0 solo cuando las correctas sean la mitad o menos de las opciones, con una tabla (con 5 opciones: 1 o 2 correctas valen 0; con 3 o 4 se usa la fórmula normal, 0,78 y 0,9175) y pidió confirmar el caso límite de 3 correctas de 5.
- **Qué hubo que corregir:** la propuesta anterior de la IA.
- **Qué inventó o erró la IA:** la regla propuesta en el N.º 33 aplicaba «todas = 0» sin distinguir cuántas correctas había; el usuario lo detectó con esta pregunta.
- **Decisión mía (no delegada):** detectar el caso límite (4 correctas de 5) y aceptar el umbral «la mitad o menos».
- **Sección del informe donde encaja:** 3 Solución
- **Ítem(s):** 5, 6

### N.º 35 · 2026-10-24 21:05 UTC · Claude Code
- **Etapa:** construcción
- **Pedido (textual):**
  > si, implemetnalo
- **Qué hizo la IA:** implementó la regla (cada incorrecta marcada resta el descuento configurado; marcar todas vale 0 si las correctas son la mitad o menos de las opciones y no son todas), actualizó el texto de ayuda y el ejemplo de la pestaña Examen, el README y las pruebas (83 pruebas pasan) y subió el cambio («Descuento por cada incorrecta; marcar todas vale 0 si las correctas son la mitad o menos», según git, 2026-10-24).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** aprobar la implementación de la regla.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 5, 6, 7

### N.º 36 · 2026-10-24 21:06 UTC · Claude Code
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
- **Herramientas del asistente usadas para la app** (según el resumen y el tramo posterior): ejecutar comandos (Node para las pruebas, git), leer y editar archivos, formulario de opciones (AskUserQuestion), enviar archivos al usuario, buscador de herramientas (ToolSearch).
- **GitHub (servidor MCP):** crear pull requests, fusionarlos y leer archivos. La IA no pudo crear repositorios (error 403).
- **Google Drive (servidor MCP):** buscar y leer archivos; en el tramo posterior al resumen se usó para leer el `casos.json` de casos a revisar de la carpeta del examen.
- **Pruebas automáticas del proyecto:** `tests/run.js` (60 pruebas el 2026-10-02, 82 al inicio del tramo posterior al resumen y 83 al final), `tests/synth.js` (fotos sintéticas con perspectiva y ruido) y `tests/mockdrive.js` (Drive simulado). Según el resumen, además hubo pruebas de extremo a extremo con un navegador automatizado, que no están en el repositorio.
- **Fotos reales** de hojas impresas V1 a V4 aportadas por el usuario.
- **Plataforma de la app:** JavaScript sin dependencias, publicada en GitHub Pages; Google Identity Services y API de Drive (permiso `drive.file`).

### B. Todo lo que la IA inventó o afirmó mal y yo detecté (solo lo que consta)

1. (N.º 13) Las respuestas 4 y 6 de la primera foto real no se leyeron; según el resumen, el chequeo de orientación fallaba y las cruces finas no se leían.
2. (N.º 13, según el resumen) Los ejemplos de prueba de la IA usaban mi nombre y registro reales; pedí que no se subieran al repositorio.
3. (N.º 19) La clave de respuestas se veía distinta en la PC (de a pares) y en el celular (de a una).
4. (N.º 20) La app fallaba con el error de orientación en una foto que ya había leído bien; el navegador tenía una copia vieja del código, y al actualizarlo la leyó. Motivó el número de versión en los archivos (N.º 22).
5. (N.º 21) Con la clave de la pregunta 8 (A, B, C, D) y todas las opciones marcadas, la app daba 0 puntos; pedí que diera algún puntaje.
6. (N.º 23) En la prueba del 24 de octubre, las preguntas 4, 11, 15, 18 y 20 se detectaron mal, las 12, 13, 14 y 17 no se detectaron y varias hojas se rechazaron por no encontrar las esquinas; según el resumen, la lectura fallaba con hojas con más de la mitad de las burbujas marcadas y con la hoja vecina en la foto.
7. (N.º 30) El criterio «descuento solo por marcas por encima de la cantidad de correctas» daba resultados que señalé como raros (casos 7, 9, 21 y 24: la primera incorrecta salía gratis); además, las descripciones de las opciones en el formulario traían una cuenta mal armada.
8. (N.º 34) La regla «marcar todas las opciones vale 0» no distinguía cuántas correctas había; con 4 correctas de 5 daba 0 por una sola incorrecta.
9. (N.º 30) La IA hizo un commit con una prueba fallando y con valores esperados mal calculados.
10. (N.º 8) Al principio no había un archivo de la hoja para ver e imprimir (lo señalé como una falta).

### C. Decisiones que tomé yo y no le delegué

- Qué problema resolver y con qué solución: grilla en papel, foto con el celular y una app que corrige (N.º 1 y 2).
- Cantidad de preguntas (10 o 20), opciones (4 o 5), quién saca las fotos, salida como planilla importable y construir la app en este repositorio (N.º 2).
- Qué datos se piden a los alumnos y puntaje configurable por pregunta repartido entre las respuestas correctas (N.º 3).
- Que el criterio de aprobación lo decida yo después y no la app (N.º 4).
- Puntaje parcial por respuestas correctas (N.º 5).
- Google Drive como lugar de los resultados y las fotos, para verlos desde el celular y la PC (N.º 6).
- Formato A5; nombre y registro manuscritos, sin burbujas para el registro, con 7 casilleros (N.º 7).
- Crear los repositorios, el ID de cliente de Google y el índice de la página, y autorizar la publicación en `main` (N.º 8, 10, 11, 12, 19, 22, 28 y 36).
- Valores de modalidad y que la hoja sea editable (N.º 9).
- No subir mis datos personales al repositorio (N.º 13).
- Reglas de identificación y de repetidos: nombre o registro obligatorio, qué se considera repetido y qué hacer en cada caso (N.º 14); detección de la misma foto y del mismo examen fotografiado dos veces (N.º 15).
- Más espacio para el nombre y compatibilidad con las hojas V1 ya impresas (N.º 16).
- Versionado de la hoja con «Vx», leyendas del pie y leyenda de validez de la hoja de respuestas (N.º 17).
- Fecha en la hoja y no volver a imprimir la V1 (N.º 18).
- Que la clave se vea igual en la PC y en el celular (N.º 19).
- Que marcar todas las opciones no dé cero cuando hay varias correctas (N.º 21); descuento configurable entre 0 y 1 y tres decimales (N.º 22).
- Forma inequívoca de las marcas de esquina (N.º 24), banderas para marcar dudosas (N.º 25), que un punto lo bastante grande cuente como respuesta (N.º 26) y diseño de la banda de ejemplos de la V4 (N.º 27 y 28).
- Criterio de descuento por incorrectas: elegí una alternativa, la rechacé al ver sus resultados y definí el tratamiento de «marcar todas» con el umbral de la mitad (N.º 30 a 35).
- Probar con hojas reales impresas y con casos de respuesta conocida (N.º 13, 20, 23, 26, 29 y 31).

### D. Datos o cifras mencionados en el chat

- 1.er examen con 10 preguntas y 2.º examen con 20; 4 o 5 opciones por pregunta. Origen: usuario (N.º 2).
- Ejemplos de criterio de aprobación que el usuario dio antes de retirar el pedido: «50% del examen correcto es un 4» y «10 preguntas y sumando 4 puntos». Origen: usuario (N.º 3). La app no los usa.
- 7 casilleros para el registro. Origen: elección del usuario (N.º 7).
- Hoja A5, 2 por hoja A4 apaisada. Origen: usuario (formato A5) y IA (2 por A4).
- Descuento por incorrecta: antes 1, con tres opciones fijas; nuevo valor inicial 0,33 en un examen nuevo, configurable de 0 a 1. Origen: valor elegido por la IA (dicho por la IA en el texto pegado); el usuario lo dejó. En el `casos.json` del examen del usuario figura 0,33.
- Puntajes de la clave del usuario con su foto: descuento 1 → 4,667; 0,5 → 5,583; 0,33 → 6,065; pregunta 8 → 0,505 sobre 1 con 0,33. Origen: cálculo de la IA con la clave y la foto del usuario (texto pegado).
- Pregunta 8 de la prueba del usuario: clave A, B, C, D y respuesta marcada de A a E, que daba 0 puntos. Origen: usuario (N.º 21). Un mensaje del asistente hablaba de una clave con B y C: diferencia a revisar.
- Puntos por pregunta en el examen de prueba del usuario: 5. Origen: `casos.json` en Drive.
- Sensibilidad normal 0,085 (alta 0,05, baja 0,16): calibrada por la IA con fotos reales (según el resumen: seis fotos). Origen: pruebas de la IA con fotos del usuario.
- Capacidad de la hoja V4: 32 preguntas con 5 opciones o 48 con 4 opciones. Origen: cálculo de la app.
- Pruebas automáticas: 60 el 2026-10-02, 82 al inicio del tramo posterior al resumen y 83 al final. Origen: salida de `node tests/run.js`.
- Fallas reportadas: respuestas 4 y 6 no leídas en la primera foto real (N.º 13); mal leídas 4, 11, 15, 18 y 20 y no leídas 12, 13, 14 y 17 en la prueba del 24 de octubre (N.º 23). Origen: usuario (texto pegado).
- Costo acumulado de la sesión: USD 39,33 hasta el 2026-11-08, según la consulta de la sesión de la plataforma. **Incluye también el trabajo fuera del alcance de este registro** (armado del examen); no es solo el costo de la herramienta. Origen: la consulta de la sesión hecha en este chat.
- Tiempo de corrección a mano: SIN ORIGEN. El usuario solo dijo «lleva mucho tiempo corregirlos»; no hay cifra.
- Cantidad de alumnos o de exámenes por cuatrimestre: NO CONSTA.
