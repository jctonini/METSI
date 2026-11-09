# Anexo C · Pedidos textuales

> Los pedidos están **copiados tal cual** de los registros brutos (`registro-ia-bruto.md`, `registro-ia-bruto-login.md` y `registro-ia-bruto-noviembre.md`), con sus errores de tipeo. Este archivo se generó copiando esos textos, no retipeándolos. Se reemplazó por `[OMITIDO]` lo sensible (ID de cliente, API key, email, URL del proyecto de Supabase). Los pedidos que se hicieron a Claude Code en el chat original pegaron solo los mensajes del usuario, sin las respuestas del asistente; por eso «Qué hizo la IA» se apoya en el historial de git y en el resumen de la sesión. **Modelo: Claude Sonnet 5.5 (`claude-sonnet-5-5`) con esfuerzo medio, en todas las sesiones de desarrollo. Lo declaró el autor («se utilizó siempre Sonnet 5.5 medio») y se verificó el 2026-11-09 en los datos de cada sesión (modelo configurado y último modelo servido).**

## Parte 1 · Pedidos principales para el cuerpo del informe

Cada grupo muestra el pedido textual, lo que hubo que corregir, lo que erró o inventó el asistente y la decisión que no se delegó. Para el cuerpo del informe alcanza con el pedido y una línea; el resto queda acá.

### El problema y la idea (sección 1)

#### N.º 1 · 2026-10-01 (indicado por el usuario) · Claude Code

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

- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** el problema (corregir a mano exámenes multiple choice lleva mucho tiempo), la opción elegida (grilla en papel, foto y app) y no tocar el repositorio por ahora.

### Reglas de puntaje y que la app no decide la aprobación (sección 3)

#### N.º 3 · 2026-10-01 (indicado por el usuario) · Claude Code

- **Pedido (textual, mensajes consecutivos):**
  > 1 Nosotros les pedimos a los alumnos: Nombre y apellido, Numero de Registro, Modalidad de cursada.
  > 2 el puntaje tiene que ser configurable. 
  >
  > Algo más: Pueden haber varias respuestas correctas por pregunta, por lo que tengo que poder establecer un puntaje por pregunta, y que este se divida entre sus respuestas correctas, me explico?
  > Tengo que poder también establecer el criterio de aprobación por ejemplo: 50% del examen correcto es un 4 (se aprueba con 4 o mas) o bien que si por ejemplo son 10 preguntas y sumando 4 puntos entre las respuestas correctas aprobas.

- **Qué hubo que corregir:** el pedido de criterio de aprobación se reemplazó en el mensaje siguiente (N.º 4).
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** qué datos pedir a los alumnos, puntaje configurable por pregunta repartido entre las respuestas correctas.

#### N.º 4 · 2026-10-01 (indicado por el usuario) · Claude Code

- **Pedido (textual):**
  > ahora que lo pienso, quizas a la app no le importa si el alumno aprueba o no, con que me diga el puntaje luego yo establezco el criterio de aprobacion

- **Qué hubo que corregir:** el usuario retiró su pedido anterior del criterio de aprobación (N.º 3).
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que el criterio de aprobación lo decido yo después y no la app.

### Diseño de la hoja: A5, registro manuscrito en 7 casilleros (sección 3)

#### N.º 7 · 2026-10-01 (indicado por el usuario) · Claude Code

- **Pedido (textual, mensajes consecutivos):**
  > otra cosa, la grilla de evaluaciòn tiene que entrar en la  mitad de una hoja A4, serìa formato A5?
  >
  > el nombre y el registro los vas a identificar como con ocr?
  > recordà que esos datos van a estar escritos a mano.
  >
  > No entiendo a que te referis con llenar burbujas para completar el registro. podes mostrarme un ejemplo?
  >
  > Sin burbujas para el registro, pero si 7 casilleros para marcar allì su registro

- **Qué hubo que corregir:** el usuario no entendió la propuesta de burbujas para el registro y pidió un ejemplo antes de decidir.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** hoja en formato A5 (la mitad de una A4); nombre y registro manuscritos, sin burbujas para el registro y con 7 casilleros.

### Primera prueba con una hoja real y datos personales en los ejemplos (secciones 5 y 7)

#### N.º 13 · 2026-10-02 (indicado por el usuario) · Claude Code

- **Pedido (textual, mensajes consecutivos):**
  > tengo la prueba real y tambien tengo algun feedback para compartirte para mejorar la app
  >
  > Las respuestas 4 y 6 no las leyó
  >
  > la sincronizacion con drive anduvo bien.
  >
  > es mi nombre y mi registro de cuando era alumno, mejor no lo subas al repo.

- **Qué hubo que corregir:** la lectura de las respuestas 4 y 6.
- **Qué inventó o erró la IA (según el resumen de contexto):** el chequeo de orientación fallaba en una foto real (oscuridad de la barra 0,37 contra un umbral de 0,5) y las cruces finas no se leían. Los ejemplos de prueba de la IA coincidían con el nombre y registro reales del usuario; se reemplazaron por datos inventados y se reescribió la historia de la rama propia sin fusionar. Desde entonces se revisó el repositorio y su historial antes de cada commit.
- **Decisión mía (no delegada):** probar con una hoja real; confirmar que la sincronización con Drive funciona; no subir mis datos personales al repositorio.

### Un caso de respuesta conocida que cambia una regla (sección 6)

#### N.º 21 · 2026-10-02 (indicado por el usuario) · Claude Code

- **Pedido (textual, mensajes del usuario en el orden del chat; el texto del asistente que sigue lo aportó el usuario en una captura de pantalla):**
  > pero me acorde de algo mas a corregir
  > hay algo con el calculo de las respuestas que quiero revisar.

  Respuesta del asistente (texto de la captura, no es pedido del usuario): «Contame qué viste. Para entenderlo rápido me sirve saber: Qué esperabas como puntaje y qué mostró la app, con el caso concreto: la pregunta, cuáles eran las correctas, qué marcó el alumno y cuántos puntos valía. Si te parece que el error es en cómo se leyeron las respuestas (marcó una y leyó otra) o en cómo se calcularon los puntos a partir de lo leído. Si querés repasar las reglas actuales, por si hay algo ahí que no te cierra: El puntaje de cada pregunta se reparte en partes iguales entre sus respuestas correctas. Cada opción correcta marcada suma su parte, aunque no marque todas. Cada opción incorrecta marcada resta una parte, y la pregunta nunca baja de cero. Eso es configurable: restar una parte, media parte o nada. Una pregunta sin ninguna respuesta correcta definida es anulada y da el puntaje completo a todos. Mandame el caso y lo reviso sin cambiar nada hasta que me digas.»
  > en mi ejemplo en la pregunta 8, las respuestas correctas son A, B, C, D y en el ejemplo marqué todas las letras, de A a E, sin embargo el alumno estaria recibiendo 0 puntos, cuando en realidad.. considero que tendria que recibir puntaje. no perfecto, pero si algun puntaje.
  > asi fue mi configuraciòn del examen de respuestas correctas.

- **Qué hubo que corregir:** el puntaje de la pregunta 8 con todas las opciones marcadas.
- **Qué inventó o erró la IA:** NO CONSTA un error afirmado. Diferencia a revisar: con las reglas que repasó el asistente y el descuento de 1 que tenía la clave del usuario, una clave A, B, C, D con las cinco opciones marcadas daría 0,75 de 1 y no 0 (cálculo de quien redacta este registro, no del chat); el 0 que vio el usuario coincide con una clave B y C, que es la que mencionaba un mensaje del asistente. La clave real de la pregunta 8 NO CONSTA con certeza.
- **Decisión mía (no delegada):** señalar que marcar todas las opciones no debe dar cero cuando hay varias correctas y que se espera algún puntaje, «no perfecto».

#### N.º 22 · 2026-10-02 (indicado por el usuario) · Claude Code

- **Pedido (textual, mensajes del usuario):**
  > 1. acepto tu propuesta de poder configurar un numero entre 0 y 1. 
  > 2. 3 decimales esta bien. 
  > 3, ok.
  > hoy no puedo imprimrla esto queda pendiente.

  > pasalo a main

  Contexto (texto del asistente, copiado del pegado anterior, no es pedido del usuario): una captura enviada por el usuario con su clave y su foto; el asistente respondió que «la pregunta 8 da 0/1 porque tu clave tiene B y C, y el total de 4,666667 coincide con el que calculé», propuso mostrar los números redondeados a 2 decimales y con coma, un campo numérico libre de 0 a 1 para el descuento por incorrecta (el valor por defecto era 1, con tres opciones fijas), un número de versión en los archivos de la app y generar y probar la hoja V2 impresa.

- **Qué hubo que corregir:** la propuesta de la IA de 2 decimales; el usuario pidió 3. El descuento fijo de tres opciones pasó a un valor libre.
- **Qué inventó o erró la IA:** NO CONSTA error afirmado. Consta que el valor inicial de 0,33 para un examen nuevo lo eligió la IA sin que el usuario dijera un número (dicho por la IA: «Ese número lo elegí yo, porque no me dijiste uno»).
- **Decisión mía (no delegada):** aceptar un descuento configurable entre 0 y 1, fijar 3 decimales, aceptar el número de versión, dejar pendiente la impresión de la hoja V2 («hoy no puedo imprimirla») y ordenar la publicación en `main`.

### Prueba real con fallas y rediseño de las marcas de esquina (secciones 3 y 6)

#### N.º 23 · 2026-10-24 (indicado por el usuario) · Claude Code

- **Pedido (textual, mensajes consecutivos):**
  > Acabo de hacer una prueba y los resultados no fueron buenos, hay varias cosas para revisar.
  > Te paso la foto de la corrección y la foto de lo detectado. 
  > Fallos detectados en respuestas: 4,11,15,18,20
  > Fallos no detectados en la detección: en respuestas en la 12,13,14,17
  > Cuando subi estas hojas con correcciones, el sistema me la rechazaba por no encontrar las esquinas de lectura

- **Qué hubo que corregir:** la lectura de las preguntas 4, 11, 15, 18 y 20 (mal detectadas), de la 12, 13, 14 y 17 (no detectadas) y el rechazo de hojas por no encontrar las esquinas.
- **Qué inventó o erró la IA (según el resumen de contexto):** la línea base se inflaba cuando más de la mitad de las burbujas estaban marcadas; se pasó a una línea base solo de burbujas vacías, por columna y ventana local, con una prueba de regresión. Con fotos con la hoja vecina, la lectura salía corrida; una prueba mostró que cuatro burbujas rellenas formaban un cuadrilátero falso y se agregó un control de tamaño físico.
- **Decisión mía (no delegada):** probar con fotos reales y reportar con precisión qué preguntas se detectaron mal y cuáles no se detectaron.

#### N.º 24 · 2026-10-24 (indicado por el usuario) · Claude Code

- **Pedido (textual, mensajes consecutivos):**
  > Y no podes cambiarle la forma a las marcas de la derecha de la hoja? por ejemplo esperar un cuadrado negro a la izquierda y un triangulo a la derecha? eso seria inequivoco.
  > En una foto no voy a subir dos hojas de correcciòn completas, parte del proceso es cortarla para entregarlas a los alumnos. Si no es un triangulo, podrìa ser un circulo o bien, un rectangulo y un cuadrado, lo que vos prefieras pero que la identificacion sea inequivoca

- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que las marcas de esquina se distingan sin ambigüedad; propuse cuadrado a la izquierda y triángulo a la derecha y dejé la forma final al criterio de la IA, con la precisión de que en una foto no suben dos hojas completas.

### Casos dudosos para analizar, con fotos sin datos personales (secciones 3 y 7)

#### N.º 25 · 2026-10-24 (indicado por el usuario) · Claude Code

- **Pedido (textual, mensajes consecutivos):**
  > Otra cosa, agrega la posibilidad de marcar como dudosas o a revisar con un flag las correcciones para que luego puedas analizarlas y corregir la tool
  > hace el merge

- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que los casos dudosos se marquen para que la IA los analice y corrija la herramienta; autorizar la fusión.

### Cómo se llegó a la regla de «marcar todas» (secciones 3 y 5)

#### N.º 30 · 2026-10-24 20:47 UTC · Claude Code

- **Pedido (textual):**
  > En la ultima correcciòn acabo de marcar dos respuestas, para que las identifiques, no es un tema de forma ni de detecciòn, es un tema de criterio a la hora de reducir puntajes por respuestas incorrectas.

- **Qué hubo que corregir:** valores esperados de la prueba nueva (un redondeo y dos cálculos mal planteados por la IA); ese criterio fue reemplazado después (N.º 32 a 35).
- **Qué inventó o erró la IA:** en el formulario de opciones, la descripción de una opción traía una cuenta incompleta e incorrecta («Q7: 5 − ... se calcula sobre el total…», «Q7 ≈ 2,5 − 0,55 = 1,95; Q9 ≈ 1,667 − 2×0,825 → 0»). La IA hizo un commit con una prueba fallando (82 pasaron, 1 fallaron) y lo corrigió en un commit posterior.
- **Decisión mía (no delegada):** elegir el criterio «solo si marca más opciones que las correctas» entre las alternativas, y señalar las dos respuestas problemáticas.

#### N.º 31 · 2026-10-24 20:54 UTC · Claude Code

- **Pedido (textual):**
  > Planteemos ejemplos a ver como responderia: 
  > Por ejemplo: 
  > 0 opcion marcada correcta, cuando eran dos correctas.
  > 1 opcion marcada correcta, cuando eran dos correctas.
  > 1 opcion marcada correcta y una incorrecta, cuando eran dos correctas.
  > 2 opciones marcadas correctas y una incorrecta, cuando eran dos correctas.
  >
  > Segui enumerando los ejemplos para cubrir muchas posibilidades, y luego revisa como responderia la herramienta

- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA. Los resultados son los del criterio que la IA acababa de implementar.
- **Decisión mía (no delegada):** probar el puntaje con casos de respuesta conocida (esta es la verificación pedida por el ítem 5 de la lista).

#### N.º 32 · 2026-10-24 20:57 UTC · Claude Code

- **Pedido (textual):**
  > Vamos de a poco, los casos 7, 9, 21,24 se me hacen raros.

- **Qué hubo que corregir:** el criterio del N.º 30 producía resultados extraños (señalados por el usuario).
- **Qué inventó o erró la IA:** NO CONSTA. El criterio implementado era del propio asistente y el usuario detectó el problema.
- **Decisión mía (no delegada):** reconocer qué casos eran incoherentes.

#### N.º 33 · 2026-10-24 20:59 UTC · Claude Code

- **Pedido (textual):**
  > Creo que hay que tratar de forma diferente cuando la persona marca todas las opciones de cuando se marcan 1 o 2 de forma incorrecta.

- **Qué hubo que corregir:** la regla de «marcar todas = 0» era demasiado dura (ver N.º 34).
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** que marcar todas las opciones se trate distinto de marcar una o dos incorrectas.

#### N.º 34 · 2026-10-24 21:00 UTC · Claude Code

- **Pedido (textual):**
  > pero que pasaria si son 4 opciones correctas y marcó las 5 opciones?

- **Qué hubo que corregir:** la propuesta anterior de la IA.
- **Qué inventó o erró la IA:** la regla propuesta en el N.º 33 aplicaba «todas = 0» sin distinguir cuántas correctas había; el usuario lo detectó con esta pregunta.
- **Decisión mía (no delegada):** detectar el caso límite (4 correctas de 5) y aceptar el umbral «la mitad o menos».

#### N.º 35 · 2026-10-24 21:05 UTC · Claude Code

- **Pedido (textual):**
  > si, implemetnalo

- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** aprobar la implementación de la regla.

### Lectura local del registro: decisión de privacidad (secciones 3 y 7)

#### N.º 51 · 2026-11-08 21:48 a 21:51 UTC · Claude Code

- **Pedido (textual, mensajes consecutivos):**
  > Estaba pensando, quisiera saber si vos pudieras leer lo que los alumnos escriben a mano (su nombre y su numero de registro) y pedirme a mi una correcciòn o una confirmaciòn, si lo que vos leiste es correcto yo lo confirmo y me ahorro tener que escribirlo, y si es incorrecto, lo corrijo.
  >
  > no entiendo porque habria que enviar los recortes a la api de anthorpic, acaso no es lo mismo que ya haces para detectar las respuestas completadas?
  >
  > vamos con la opciòn 3, si ya puede leer los registros seria una ventaja para mi.

- **Qué hubo que corregir:** NO CONSTA. Cuestionaste por qué enviar los recortes a un servicio externo.
- **Qué inventó o erró la IA:** NO CONSTA un error afirmado. **Límites declarados (según README y Backlog):** el nombre sigue siendo manual (solo se lee el registro); la precisión de cerca del 99 % se midió con dígitos de MNIST dibujados sobre fotos sintéticas, es una prueba optimista, y con birome real puede fallar más.
- **Decisión mía (no delegada):** que lo manuscrito lo confirme una persona (la lectura es solo una sugerencia); **no enviar a un servicio externo los recortes de lo que escriben los alumnos** y elegir la lectura local (opción 3).

## Parte 2 · Índice de los 53 pedidos

El texto completo de cada uno está en el archivo indicado, con su número. Orden cronológico.

| N.º | Fecha | Etapa | Sección del informe | Ítems | Archivo |
|---|---|---|---|---|---|
| 1 | 2026-10-01 | idea | 1 Problema | 1 | `registro-ia-bruto.md` |
| 2 | 2026-10-01 | diseño | 3 Solución | 1, 4, 6 | `registro-ia-bruto.md` |
| 3 | 2026-10-01 | diseño | 3 Solución | 4, 6 | `registro-ia-bruto.md` |
| 4 | 2026-10-01 | diseño | 3 Solución | 6 | `registro-ia-bruto.md` |
| 5 | 2026-10-01 | diseño | 3 Solución | 5, 6 | `registro-ia-bruto.md` |
| 6 | 2026-10-01 | diseño | 3 Solución | 2, 4, 9 | `registro-ia-bruto.md` |
| 7 | 2026-10-01 | diseño | 3 Solución | 4, 10 | `registro-ia-bruto.md` |
| 8 | 2026-10-01 | despliegue | 4 Cómo se construyó | 2, 9 | `registro-ia-bruto.md` |
| 9 | 2026-10-01 | construcción | 3 Solución | 7, 9 | `registro-ia-bruto.md` |
| 10 | 2026-10-01 | despliegue | 4 Cómo se construyó | 9, 10 | `registro-ia-bruto.md` |
| 11 | 2026-10-01 | despliegue | 4 Cómo se construyó | 9 | `registro-ia-bruto.md` |
| 12 | 2026-10-01 | despliegue | 4 Cómo se construyó | 7, 9 | `registro-ia-bruto.md` |
| 13 | 2026-10-02 | pruebas | 6 Pruebas | 5, 10 | `registro-ia-bruto.md` |
| 14 | 2026-10-02 | diseño | 3 Solución | 3, 6, 10 | `registro-ia-bruto.md` |
| 15 | 2026-10-02 | diseño | 3 Solución | 3, 6 | `registro-ia-bruto.md` |
| 16 | 2026-10-02 | diseño | 3 Solución | 3, 7 | `registro-ia-bruto.md` |
| 17 | 2026-10-02 | diseño | 3 Solución | 3, 7, 10 | `registro-ia-bruto.md` |
| 18 | 2026-10-02 | diseño | 3 Solución | 3, 7 | `registro-ia-bruto.md` |
| 19 | 2026-10-02 | pruebas | 4 Cómo se construyó | 7, 9 | `registro-ia-bruto.md` |
| 20 | 2026-10-02 | pruebas | 6 Pruebas | 5 | `registro-ia-bruto.md` |
| 21 | 2026-10-02 | pruebas | 6 Pruebas | 5, 6 | `registro-ia-bruto.md` |
| 22 | 2026-10-02 | diseño | 3 Solución | 3, 5, 6 | `registro-ia-bruto.md` |
| 23 | 2026-10-24 | pruebas | 6 Pruebas | 5 | `registro-ia-bruto.md` |
| 24 | 2026-10-24 | diseño | 3 Solución | 5, 7 | `registro-ia-bruto.md` |
| 25 | 2026-10-24 | construcción | 3 Solución | 5, 6, 10 | `registro-ia-bruto.md` |
| 26 | 2026-10-24 | pruebas | 6 Pruebas | 5 | `registro-ia-bruto.md` |
| 27 | 2026-10-24 | diseño | 3 Solución | 3, 7 | `registro-ia-bruto.md` |
| 28 | 2026-10-24 | construcción | 3 Solución | 7, 9 | `registro-ia-bruto.md` |
| 29 | 2026-10-24 20:38 | pruebas | 6 Pruebas | 5 | `registro-ia-bruto.md` |
| 30 | 2026-10-24 20:47 | pruebas | 3 Solución | 3, 5, 6 | `registro-ia-bruto.md` |
| 31 | 2026-10-24 20:54 | pruebas | 6 Pruebas | 5 | `registro-ia-bruto.md` |
| 32 | 2026-10-24 20:57 | pruebas | 6 Pruebas | 5 | `registro-ia-bruto.md` |
| 33 | 2026-10-24 20:59 | diseño | 3 Solución | 3, 6 | `registro-ia-bruto.md` |
| 34 | 2026-10-24 21:00 | diseño | 3 Solución | 5, 6 | `registro-ia-bruto.md` |
| 35 | 2026-10-24 21:05 | construcción | 4 Cómo se construyó | 5, 6, 7 | `registro-ia-bruto.md` |
| 36 | 2026-10-24 21:06 | despliegue | 4 Cómo se construyó | 9 | `registro-ia-bruto.md` |
| 44 | 2026-11-01 16:28 | idea (gestión del proyecto) | 4 Cómo se construyó | 2, 9, 11 | `registro-ia-bruto-noviembre.md` |
| 45 | 2026-11-01 16:57 | construcción | 4 Cómo se construyó y 6 Pruebas | 5, 7, 9 | `registro-ia-bruto-noviembre.md` |
| 46 | 2026-11-01 17:17 | despliegue | 4 Cómo se construyó | 9 | `registro-ia-bruto-noviembre.md` |
| 37 | 2026-11-07 19:13 | idea | 3 Solución | 6, 9, 10 | `registro-ia-bruto-login.md` |
| 38 | 2026-11-07 19:27 | despliegue | 4 Cómo se construyó | 7, 9 | `registro-ia-bruto-login.md` |
| 39 | 2026-11-07 19:43 | pruebas | 5 Registro de IA y 6 Pruebas | 5, 11 | `registro-ia-bruto-login.md` |
| 40 | 2026-11-07 20:01 | despliegue | 4 Cómo se construyó y 6 Pruebas | 5, 9 | `registro-ia-bruto-login.md` |
| 41 | 2026-11-07 20:05 | pruebas | 6 Pruebas | 5 | `registro-ia-bruto-login.md` |
| 42 | 2026-11-07 20:09 | documentación | 4 Cómo se construyó | 9 | `registro-ia-bruto-login.md` |
| 43 | 2026-11-07 20:13 | pruebas | 7 Riesgos y controles | 10 | `registro-ia-bruto-login.md` |
| 47 | 2026-11-08 19:10 | diseño | 1 Problema | 1, 4, 7, 12 | `registro-ia-bruto-noviembre.md` |
| 48 | 2026-11-08 20:04 | despliegue | 4 Cómo se construyó y 6 Pruebas | 2, 5, 9, 10 | `registro-ia-bruto-noviembre.md` |
| 49 | 2026-11-08 20:44 | pruebas | 3 Solución y 6 Pruebas | 5, 6, 7 | `registro-ia-bruto-noviembre.md` |
| 50 | 2026-11-08 21:46 | gestión | 4 Cómo se construyó | 11 | `registro-ia-bruto-noviembre.md` |
| 51 | 2026-11-08 21:48 | diseño | 3 Solución | 4, 5, 6, 10 | `registro-ia-bruto-noviembre.md` |
| 52 | 2026-11-08 22:03 | pruebas | 6 Pruebas y 5 Registro de IA | 4, 5 | `registro-ia-bruto-noviembre.md` |
| 53 | 2026-11-08 22:42 | documentación | 4 Cómo se construyó y 7 Riesgos y controles | 9, 10 | `registro-ia-bruto-noviembre.md` |

Total: 53 pedidos.
