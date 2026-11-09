# Registro de uso de IA (bruto) · Sesión de armado del informe (8 y 9 de noviembre de 2026)

Continúa `registro-ia-bruto.md` (N.º 1 a 36), `registro-ia-bruto-login.md` (N.º 37 a 43) y `registro-ia-bruto-noviembre.md` (N.º 44 a 53). Cubre la sesión **«Asistente de corrección de exámenes»** de Claude Code (Claude Sonnet 5.5, esfuerzo medio), en la que se armó el informe, se verificaron los pendientes y se hizo el último cambio de código (METSI-12).

## Cómo leer este archivo
- **Origen del texto:** los mensajes del autor se copiaron **tal cual** del historial de esta sesión, incluidos los que mandó mientras el asistente trabajaba y sus respuestas a las preguntas del asistente (marcadas como «respuestas a preguntas del asistente»). Se generó con un script que copia el texto, no retipeado. Las horas son UTC.
- **Lo que escribe el asistente** en «Qué hizo la IA», «Qué hubo que corregir» y «Qué inventó o erró la IA» es su propia descripción de su trabajo en esta sesión, contrastable con el historial de git de la rama y con los documentos de `docs/informe/`.
- **Tapado como «[OMITIDO]»:** correos electrónicos, la API key que figura en el aviso de Google, un enlace privado a una sesión y el nombre del autor (que pidió no subirlo al repositorio, N.º 13). Las capturas de pantalla no se transcriben.
- **Costo de esta sesión:** ver el cuadro de modelo y costo por sesión en `registro-ia.md` (§2).

---

### N.º 54 · 2026-11-08 23:18 UTC · Claude Code
- **Etapa:** idea
- **Pedido (textual, un mensaje):**
  > [PDF adjunto: consigna del trabajo final] Quiero presentar el asistente de correcciòn de examenes como parte de mi trabajo final de una diplomatura en IA que estoy haciendo.  Primero quiero que conviertas este PDF a Markdown y que luego lo leas, analises el desarrollo que estamos haciedno y me digas si te parece que lo puedo presentar y si cumple con lo pedido.
- **Qué hizo la IA:** Convirtió el PDF de la consigna a Markdown (la conversión automática desordenaba las tablas y se reescribió a mano en `docs/consigna-trabajo-final.md`), leyó el repositorio y evaluó el trabajo contra la consigna. Concluyó que se podía presentar con el Camino A, pero que faltaba el informe, y listó qué faltaba.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA. La conversión automática desordenó las tablas de la consigna y hubo que reescribirlas.
- **Decisión mía (no delegada):** Presentar la herramienta como trabajo final; pedir primero la conversión y el análisis antes de escribir nada.
- **Sección del informe donde encaja:** 5 Registro de IA
- **Ítem(s):** 11

### N.º 55 · 2026-11-08 23:23 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, un mensaje):**
  > revisemos esto primero:
  > Pruebas: hay 115 pruebas, con casos que deben fallar. En mi entorno 114 pasan y una falla porque falta npm install (tests/access.js no encuentra un módulo). Conviene que lo corras vos antes de citar el número.
- **Qué hizo la IA:** Instaló las dependencias, corrió `node tests/run.js` y confirmó 115 pruebas en verde (antes había informado 114, con una falla por falta de `npm install`).
- **Qué hubo que corregir:** El número de pruebas que había citado: pasó de 114 con 1 falla a 115 sin fallas.
- **Qué inventó o erró la IA:** NO CONSTA un error. La falla anterior era de entorno (faltaban las dependencias), no del código.
- **Decisión mía (no delegada):** Pedir verificar la cifra antes de citarla en el informe.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 56 · 2026-11-08 23:29 a 23:30 UTC · Claude Code
- **Etapa:** gestión
- **Pedido (textual, mensajes consecutivos):**
  > Encontrè el chat original con los primeros pedidos, como hacemos para que puedas ordenarlos de acuerdo al informe que hay que armar, pensa como una alternativa generar algo en el repo que lo pueda consumir desde ese otro chat.
  >
  > ambos ven el repo porque ese otro chat comenzò con el desarrollo de la tool.
- **Qué hizo la IA:** Creó `docs/informe/PEDIDO-para-el-chat-original.md` y un esqueleto de registro. Primero propuso que el otro chat devolviera el resultado pegado a mano; tras la aclaración, lo cambió para que ese chat escriba el resultado en el repositorio.
- **Qué hubo que corregir:** El autor aclaró que ambos chats ven el repositorio, porque el otro chat empezó el desarrollo.
- **Qué inventó o erró la IA:** Supuso que el otro chat no veía el repositorio; era falso.
- **Decisión mía (no delegada):** Usar el chat original como fuente de los pedidos y pasarlos por el repositorio.
- **Sección del informe donde encaja:** 5 Registro de IA
- **Ítem(s):** 11

### N.º 57 · 2026-11-09 00:43 a 00:55 UTC · Claude Code
- **Etapa:** gestión
- **Pedido (textual, mensajes consecutivos):**
  > usò la misma rama: y la subí a la misma rama, claude/focused-ptolemy-eswnu0 (commit 95ba9a7).
  >
  > aqui es donde pido el login, queres probar a ver si podes leer el chat? [OMITIDO: enlace privado a una sesión]
  >
  > por el momento decido dejar asi el github. quiero esperar a ver que me dice el profesor sobre ese punto.
  >
  > si, avanza con las otras sesiones
- **Qué hizo la IA:** Trajo la rama del otro chat (`claude/focused-ptolemy-eswnu0`), leyó el registro bruto de 36 pedidos y lo ordenó según las secciones del informe y los 12 ítems. Intentó leer la sesión del login con las herramientas de sesiones; leyó los mensajes del autor y completó los pedidos N.º 37 a 43. Registró la decisión sobre GitHub Pages.
- **Qué hubo que corregir:** El autor indicó la rama en la que el otro chat había subido su trabajo.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** Dejar GitHub Pages publicado sin login por ahora, a la espera de lo que diga el profesor de la diplomatura.
- **Sección del informe donde encaja:** 5 Registro de IA y 7 Riesgos y controles
- **Ítem(s):** 10, 11

### N.º 58 · 2026-11-09 03:05 a 03:07 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, mensajes consecutivos):**
  > Que es Metsi-6? que incluye?
  >
  > #1 al cerrar sesion se dirige al login.
  > #2 funciona ok.
  > #3 si, confirmado.
  > #4 como admin he creado, desactivado y eliminado un usuario.
- **Qué hizo la IA:** Explicó qué es la tarea METSI-6 (acceso con usuario y contraseña), con sus seis criterios. Marcó como cumplidos los criterios 2, 3 y 4 con la evidencia que dio el autor y dejó abierto el 1.
- **Qué hubo que corregir:** El autor aportó resultados de producción para los criterios 1 a 4; el asistente aceptó marcar solo los que estaban probados.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** Probar el login yo mismo en producción antes de dar los criterios por cumplidos.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5, 10

### N.º 59 · 2026-11-09 03:08 a 03:12 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, mensajes consecutivos):**
  > https://metsi-correcciones.vercel.app/login
  >
  > logueate usando chrome.
  >
  > [captura de pantalla]
  >
  > si

  Nota: Los mensajes que traen una captura de pantalla se muestran como `[captura de pantalla]`; no se transcribe su contenido.
- **Qué hizo la IA:** No pudo entrar a la dirección de Vercel (la red de la sesión no la permitía) ni loguearse con Chrome (no había herramientas de Chrome ni credenciales); propuso que el autor hiciera la prueba sin sesión. Con las dos capturas de «Sesión no válida» en `/js/app.js` y `/css/style.css`, cerró METSI-6 y actualizó el resumen final.
- **Qué hubo que corregir:** El resumen final de METSI-6 se corrigió cuando llegó la prueba de `/css/`.
- **Qué inventó o erró la IA:** NO CONSTA. Intentó dos veces leer el sitio antes de reconocer que no tenía acceso.
- **Decisión mía (no delegada):** Hacer la prueba de los archivos sin sesión en una ventana privada y reportar con capturas.
- **Sección del informe donde encaja:** 6 Pruebas y 7 Riesgos y controles
- **Ítem(s):** 5, 10

### N.º 60 · 2026-11-09 03:12 UTC · Claude Code
- **Etapa:** documentación
- **Pedido (textual, un mensaje):**
  > volvamos sobre estos dos puntos:
  >
  > 1. La guía para Windows no está en el repo. Se entregó como archivo suelto en esa sesión (N.º 46). Si querés citarla, hay que guardarla.
  > 2. Falta saber cómo se resolvió el error de autenticación de Drive. Pasó en la versión publicada (N.º 48), y esas sesiones no dicen la causa.
- **Qué hizo la IA:** Guardó la guía de Windows en `docs/guia-windows.md` (recortada a METSI, sin las partes de otro proyecto). Leyó las respuestas del asistente de la sesión del selector de Drive y encontró que el error de autenticación fue `origin_mismatch`: se abría la app desde una vista previa de Vercel que no estaba en los orígenes autorizados de Google.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** El mensaje de un commit decía que incluía la causa del error de Drive, pero ese commit solo traía la guía (falló un reemplazo de texto y no se aplicó). Se corrigió en un commit posterior.
- **Decisión mía (no delegada):** Pedir resolver los dos pendientes que había dejado abiertos el asistente.
- **Sección del informe donde encaja:** 4 Cómo se construyó y 5 Registro de IA
- **Ítem(s):** 9, 11

### N.º 61 · 2026-11-09 03:15 a 03:17 UTC · Claude Code
- **Etapa:** riesgos
- **Pedido (textual, mensajes consecutivos):**
  > antes de eso, podes leer este correo en mi cuenta de gmail personal? METSI Corrector (id: metsi-corrector) tiene claves de las APIs de Google a las que se puede acceder públicamente
  >
  > mi cuenta personal es [OMITIDO]
  >
  > [el autor interrumpió el trabajo del asistente]
  >
  > Notificación	Alerta de actividad sospechosa
  > El proyecto METSI Corrector (id: metsi-corrector) de Google Cloud tiene claves de las APIs de Google a las que se puede acceder públicamente
  > […el resto del texto del aviso de Google se omite; ver el pendiente 12 de registro-ia.md]
- **Qué hizo la IA:** Buscó el correo en el Gmail conectado y no encontró nada; la cuenta conectada era la de trabajo, no la personal. Con la aclaración del autor dejó de buscar y se apoyó en el texto del aviso que el autor pegó: Google había detectado la API key del selector de Drive en `js/config.js` del repositorio público.
- **Qué hubo que corregir:** El autor aclaró cuál era su cuenta personal y pegó el texto del correo.
- **Qué inventó o erró la IA:** Hizo una búsqueda demasiado amplia en una cuenta que resultó ser de trabajo y listó asuntos y remitentes de correos ajenos al proyecto, sin abrirlos. Lo reconoció y no volvió a buscar en esa cuenta.
- **Decisión mía (no delegada):** Pegar el texto del correo en lugar de dar acceso a su cuenta personal.
- **Sección del informe donde encaja:** 7 Riesgos y controles
- **Ítem(s):** 10, 11

### N.º 62 · 2026-11-09 03:20 a 03:25 UTC · Claude Code
- **Etapa:** riesgos
- **Pedido (textual, solo capturas de pantalla):**
  > [capturas de pantalla de Google Cloud: restricciones de la clave, lista de credenciales y el selector de Drive abierto]

  Nota: Los mensajes de esta etapa son solo capturas de pantalla (restricciones de aplicación, restricciones de API, lista de credenciales y el selector de Drive abierto); no se transcribe su contenido.
- **Qué hizo la IA:** Guió la restricción de la clave en Google Cloud con capturas: sitios web con `/*` y solo Google Picker API. Pidió comprobar que la restricción se guardó y que el selector seguía funcionando; lo confirmaron las capturas de la lista de credenciales («URL de referencia HTTP, 1 API») y del selector abierto.
- **Qué hubo que corregir:** Las direcciones del primer intento no tenían `/*`; el asistente lo señaló y el autor las corrigió.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** Restringir la clave él mismo en Google Cloud y comprobar el selector en producción.
- **Sección del informe donde encaja:** 7 Riesgos y controles
- **Ítem(s):** 10

### N.º 63 · 2026-11-09 03:26 a 03:33 UTC · Claude Code
- **Etapa:** riesgos
- **Pedido (textual, mensajes consecutivos):**
  > Guiame con esto: Qué falta: revisar el uso y la facturación del proyecto, el registro de Cloud Logging que cita el aviso, y anotar la fecha del correo de Google. Esas tres cosas las tenés que ver vos en la consola.
  >
  > Facturación
  > Este proyecto no tiene cuenta de facturación
  > Este proyecto no está vinculado con una cuenta de facturación
  >
  > [captura de pantalla]
  > cloud logging
  >
  > [captura de pantalla]
  > solo esto
- **Qué hizo la IA:** Guió la revisión del proyecto de Google Cloud: no tenía cuenta de facturación (sin posibilidad de cargos), el tráfico del 8 de noviembre era compatible con las pruebas del autor (sin detalle por API ni por credencial), y Cloud Logging mostraba un único evento `LEAKED_CREDENTIALS` con acción `NOTIFY`, 10 segundos después del commit. Registró la cronología en `registro-ia.md`.
- **Qué hubo que corregir:** La estimación inicial («menos de un minuto») se corrigió por el dato exacto de 10 segundos que dio el registro.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** Revisar facturación, tráfico y registros en la consola y reportar lo que veía.
- **Sección del informe donde encaja:** 7 Riesgos y controles
- **Ítem(s):** 10

### N.º 64 · 2026-11-09 03:34 UTC · Claude Code
- **Etapa:** documentación
- **Pedido (textual, un mensaje):**
  > escribilo
- **Qué hizo la IA:** Escribió el diccionario de datos desde el código (`docs/informe/diccionario-de-datos.md`) y verificó dos afirmaciones dudosas antes de commitear (de dónde sale la foto que se sube a Drive y cómo se guarda el logo).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** Pedir el diccionario de datos para el ítem 8.
- **Sección del informe donde encaja:** 4 Cómo se construyó (Anexo B)
- **Ítem(s):** 8

### N.º 65 · 2026-11-09 03:37 a 03:40 UTC · Claude Code
- **Etapa:** documentación
- **Pedido (textual, mensajes consecutivos):**
  > arranquemos por el punto 3.
  >
  > Revisa estas clases:
  > https://diploiafceuba.vercel.app/12
  > https://diploiafceuba.vercel.app/13 
  > fijate si encontras lo que necesitas.
  >
  > (respuestas a preguntas del asistente) "¿Qué significa PEDIR en tu diplomatura? La consigna lo nombra sin definirlo y no quiero inventar el acrónimo ni sus pasos."="[no respondió; mandó un mensaje]", "¿Sobre qué pedido armo la versión con estructura? La app no usa un modelo de lenguaje cuando corre, así que el pedido es el que se le da al asistente para construirla."="[no respondió; mandó un mensaje]"
- **Qué hizo la IA:** No encontró PEDIR en las notas de Granola ni en Drive (las búsquedas trajeron reuniones de trabajo y archivos viejos sin relación; dejó de usarlas). Con el pedido del autor, propuso un entorno personal con el sitio de la cursada habilitado y, aprobado, leyó las 16 clases: PEDIR no aparece escrito; la clase 5 enseña una consigna de siete partes, que usó como equivalente. Escribió `instrucciones-para-el-modelo.md` con dos pedidos reescritos y la comparación con los originales.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** Intentó ejecutar un script descargado del sitio de la cursada para medir los pedidos; el clasificador de permisos lo bloqueó y no lo repitió por otra vía. Las búsquedas en Granola y Drive trajeron información ajena al trabajo.
- **Decisión mía (no delegada):** Pedir que leyera las clases 12 y 13; aprobar la creación del entorno `metsi` con el sitio de la cursada habilitado.
- **Sección del informe donde encaja:** 5 Registro de IA y Anexo D
- **Ítem(s):** 3, 11

### N.º 66 · 2026-11-09 03:49 a 03:50 UTC · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > debo estar tardando enrte 4 y 5 minutos por examen.
  >
  > cuando tome el pròximo examen, el 18 e noviembre, uno de los parciales lo corrijo a mano y tomo el tiempo.
- **Qué hizo la IA:** Escribió `valor-y-costo.md`: cuenta del tiempo manual con la estimación del autor, hipótesis de sensibilidad marcadas como no medidas, costos y un plan de medición para el 18 de noviembre con plantilla.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA. Dejó marcadas como **SIN DATO** las cifras que el autor no había dado.
- **Decisión mía (no delegada):** Dar su estimación de 4 a 5 minutos por examen y comprometerse a medir en el examen del 18 de noviembre.
- **Sección del informe donde encaja:** 8 Valor y costo
- **Ítem(s):** 12

### N.º 67 · 2026-11-09 03:51 a 03:56 UTC · Claude Code
- **Etapa:** documentación
- **Pedido (textual, mensajes consecutivos):**
  > si por favor.
  >
  > mi nombre completo es "[OMITIDO: nombre del autor]"
- **Qué hizo la IA:** Armó el esqueleto del informe con las diez secciones, el anexo de cumplimiento y la lista de verificación, marcando con `[COMPLETAR]` lo que solo el autor sabía. No cargó el nombre del autor en el repositorio, porque en el N.º 13 había pedido que su nombre no se subiera.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** Dejar su nombre afuera del repositorio público y ponerlo solo en el PDF.
- **Sección del informe donde encaja:** 5 Registro de IA y estructura del informe
- **Ítem(s):** 1 a 12

### N.º 68 · 2026-11-09 03:58 UTC · Claude Code
- **Etapa:** documentación
- **Pedido (textual, un mensaje):**
  > si avanza con el anexo C
- **Qué hizo la IA:** Generó el Anexo C con un script que copia los pedidos literalmente de los registros brutos (17 pedidos completos y el índice de todos), y verificó que no quedaran datos sensibles.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** Pedir el Anexo C para tener los pedidos textuales.
- **Sección del informe donde encaja:** 5 Registro de IA (Anexo C)
- **Ítem(s):** 11

### N.º 69 · 2026-11-09 04:02 UTC · Claude Code
- **Etapa:** documentación
- **Pedido (textual, un mensaje):**
  > Se utilizò siempre Sonnet 5.5 medio
- **Qué hizo la IA:** Registró el modelo (Claude Sonnet 5.5, esfuerzo medio) y lo verificó en los datos de las seis sesiones. Corrigió la cifra de costo de IA con el costo por sesión que informa la plataforma.
- **Qué hubo que corregir:** La cifra de costo: USD 39,33 (dato viejo de una sesión) pasó a una suma de USD 56,13 para las cinco sesiones de desarrollo, como cota superior.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** Declarar el modelo y el esfuerzo usados.
- **Sección del informe donde encaja:** 5 Registro de IA y 8 Valor y costo
- **Ítem(s):** 2, 11, 12

### N.º 70 · 2026-11-09 04:10 a 04:13 UTC · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > si, seccion 2
  >
  > (respuestas a preguntas del asistente) "Hoy, sin la herramienta, ¿cómo marcan sus respuestas los alumnos?"="En el mismo examen impreso"
  >
  > (respuestas a preguntas del asistente) "¿Cómo corregís cada examen hoy?"="Con la clave impresa, pregunta por pregunta"
  >
  > (respuestas a preguntas del asistente) "¿Cómo calculás el puntaje de cada examen hoy, cuando una pregunta tiene varias respuestas correctas o el alumno marcó opciones incorrectas?"="Lo calculo a mano, pregunta por pregunta"
  >
  > (respuestas a preguntas del asistente) "¿Adónde van las notas después de corregir?"="primero en una planilla de excel y luego en miEcon que es la web de la facultad."
  >
  > (respuestas a preguntas del asistente) "¿Cómo identificás a cada alumno y verificás que no haya repetidos o exámenes sin nombre?"="es un mix de las opciones 1 y 2, ellos anotan sus datos, yo los incluyo en la planilla y verifico contra el listado de inscriptos."
- **Qué hizo la IA:** Hizo cinco preguntas, una por una, sobre cómo corrige hoy, y escribió la sección 2 y una tabla «hoy / con la herramienta».
- **Qué hubo que corregir:** El primer borrador de la sección 2 tenía pasos supuestos que el autor corrigió con sus respuestas.
- **Qué inventó o erró la IA:** El primer borrador del proceso de hoy estaba armado con supuestos (por ejemplo, un orden examen por examen) que no eran los del autor; estaban marcados para validar.
- **Decisión mía (no delegada):** Contar cómo corrige hoy.
- **Sección del informe donde encaja:** 2 La situación actual
- **Ítem(s):** 1, 6

### N.º 71 · 2026-11-09 04:15 a 04:17 UTC · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > no es que descuento, pero forma parte del calculo final de puntaje de cada pregunta.
  >
  > otra cosa, esta nueva herramienta tambièn me va a ayudar para el punto 4 ya que todo aquello que este escrito y sea identificado reresenta un ahorro para mi.
  >
  > si marcó una correcta y una incorrecta en una pregunta de dos correctas, le doy solo el puntaje de la respuesta correcta.
- **Qué hizo la IA:** Ajustó el texto («forma parte del cálculo final de cada pregunta», no un descuento aparte), incorporó que el ahorro incluye pasar los datos a la planilla y comparó el criterio manual del autor con la regla del puntaje.
- **Qué hubo que corregir:** El autor corrigió que las incorrectas no son un «descuento» aparte, y amplió el ahorro al paso de la planilla.
- **Qué inventó o erró la IA:** El borrador hablaba de «descuento» como una cosa aparte del cálculo.
- **Decisión mía (no delegada):** Dar la regla manual de una pregunta de dos correctas con una correcta y una incorrecta (le da solo el puntaje de la correcta).
- **Sección del informe donde encaja:** 2 La situación actual y 6 Pruebas
- **Ítem(s):** 5, 12

### N.º 72 · 2026-11-09 04:20 UTC · Claude Code
- **Etapa:** diseño
- **Pedido (textual, un mensaje):**
  > Es dificil determinar el tiempo por examen por lo menos de entrada, creo que lo que habria que hacer, cosa que no voy a hacer, es hacer todo el proceso para todo el set de examenes y luego dividirlo por la cantidad de examenes que tengo.
  > Cual es el proceso que hago, corrijo los examenes por carillas, primero todas las carillas 4 de todos los examenes, luego volteo la pila y sigo con la carilla 3, luego la 2 y finalmente la 1, luego examen por examen sumo el punto de las 4 carillas y lo anoto en el frente del examen. 
  > Luego ordeno todos los examenes por numero de registro, de menor a mayor.
  > Finalmente paso las notas a un excel.
  > Luego de compartir las notas con los alumnos, subo las notas a miecon.
- **Qué hizo la IA:** Reescribió la sección 2 con el proceso real por carillas y por lotes (corregir por carillas, sumar, ordenar por registro, pasar a Excel, compartir, subir a MiEcon) y detectó, con el código, que la tabla de resultados ya sale ordenada por registro. Dejó el tiempo por examen como una estimación sin cronometrar.
- **Qué hubo que corregir:** El autor corrigió el proceso: se corrige por carillas y en lotes, y el tiempo por examen no se puede medir directamente.
- **Qué inventó o erró la IA:** Había supuesto un proceso examen por examen y no incluía ordenar los exámenes por registro.
- **Decisión mía (no delegada):** No cronometrar el proceso completo del conjunto de exámenes a mano.
- **Sección del informe donde encaja:** 2 La situación actual y 8 Valor y costo
- **Ítem(s):** 1, 12

### N.º 73 · 2026-11-09 04:24 a 04:30 UTC · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > paso 8, a que te referis con criterio de aprobacioon?
  >
  > El criterio se establece de antemano, hay que tener el 60% del examen aprobado para obtener un 4, luego hay una correlacion de puntajes hasta el 10.
  >
  > numeros aproximados.
  > 60% -> 4
  > 65% -> 5
  > 70% -> 6
  > 75% -> 7
  > 80% -> 8
  > 90% -> 9 
  > 95%->10
  >
  > ¿En qué momento la aplicás? si, el excel redondea las notas
- **Qué hizo la IA:** Explicó qué es el criterio de aprobación (viene de lo que el autor dijo el 1 de octubre) y lo incorporó con la escala aproximada y el hecho de que Excel redondea las notas. Unió ese paso al de la planilla.
- **Qué hubo que corregir:** El autor corrigió que el criterio está fijado de antemano y que se aplica en Excel.
- **Qué inventó o erró la IA:** Había escrito que el criterio se decide después de ver los puntajes; era al revés.
- **Decisión mía (no delegada):** Fijar el criterio de antemano (60 % del examen = 4, correlación hasta el 10) y aplicarlo en Excel.
- **Sección del informe donde encaja:** 2 La situación actual y 3 La solución
- **Ítem(s):** 6, 12

### N.º 74 · 2026-11-09 04:31 a 04:35 UTC · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > seccion 1
  >
  > (respuestas a preguntas del asistente) "¿Cuál es el nombre completo de la materia para la portada y la sección 1?"="Metodología de Sistemas de Información (658-1), FCE-UBA"
  >
  > (respuestas a preguntas del asistente) "¿Cuál es tu rol en la materia? Va en la primera frase: «Eligí este problema porque soy…»"="Ayudante de primera simple"
  >
  > (respuestas a preguntas del asistente) "¿Quién más sufre el problema de la corrección a mano, además de vos?"="Los alumnos,El resto de la cátedra"
  >
  > (respuestas a preguntas del asistente) "En la corrección a mano, ¿hay errores (de suma, de lectura de una marca o al pasar la nota a la planilla)?"="Si hay errores los suelo detectar en mis controles, rara vez un alumno haya detectado errores."
  >
  > (respuestas a preguntas del asistente) "Si el problema no se resuelve, ¿qué pasa? Marcá lo que corresponda; lo que no figure lo agregás con el botón de otra respuesta."="Las notas se demoran para los alumnos,Cada parcial consume horas de trabajo que no se pueden dedicar a otras tareas docentes,Sigue el riesgo de errores y los controles extra"
- **Qué hizo la IA:** Hizo preguntas sobre la materia, el rol, quién sufre el problema, los errores y las consecuencias, y escribió la sección 1 con una tabla de datos y su origen.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA. Dejó marcado que no hay cifra de errores.
- **Decisión mía (no delegada):** Contar quién sufre el problema, el rol y las consecuencias.
- **Sección del informe donde encaja:** 1 El problema
- **Ítem(s):** 1

### N.º 75 · 2026-11-09 04:37 a 04:41 UTC · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > seccion 4
  >
  > (respuestas a preguntas del asistente) "¿Por qué usaste Claude Code para construir la herramienta, y no Codex (clases 12 y 13) u otra opción?"="Ya lo venía usando", "¿Por qué una app web que lee fotos y no una planilla de Google con Apps Script (el camino recomendado en la consigna)?"="Quería usarla desde el celular y la PC con Drive", "¿Por qué Vercel y Supabase para publicar y para el login, y Google Drive para guardar los datos?"="Ya tenía cuentas en Vercel y Supabase,Tienen plan gratuito para este uso"
  >
  > Con respecto a Vercel y Supabase, tambien tiene que ver que son las que utilizamos en la diplomatura.
  >
  > (respuestas a preguntas del asistente) "¿Qué plan usás en cada servicio? Lo necesito para la sección de costos."="[no respondió; mandó un mensaje]", "¿Quién mantiene la herramienta?"="[no respondió; mandó un mensaje]", "¿Cómo se capacita a otros docentes para usarla?"="[no respondió; mandó un mensaje]", "¿Qué datos o documentos quedan afuera de la herramienta a propósito?"="[no respondió; mandó un mensaje]"
  >
  > 1 planes todos gratuitos.
  > 2 Yo
  > 3 Yo me ocuparia de explicarles
  > 4 Para la herramienta toda esa informaciòn no es necesaria.
- **Qué hizo la IA:** Hizo preguntas sobre los motivos de cada herramienta y escribió la sección 4 con una tabla de herramientas, alternativas y costos. Encontró en la clase 13 dos avisos sobre los planes gratuitos de Vercel y Supabase y los incorporó a costos y riesgos.
- **Qué hubo que corregir:** El autor agregó que Vercel y Supabase también son las herramientas de la cursada.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** Elegir y justificar las herramientas; planes gratuitos; mantiene y capacita el autor.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 2, 4, 9

### N.º 76 · 2026-11-09 04:43 a 04:46 UTC · Claude Code
- **Etapa:** riesgos
- **Pedido (textual, mensajes consecutivos):**
  > hagamosla
  >
  > (respuestas a preguntas del asistente) "¿Las notas y los exámenes de los alumnos son confidenciales en tu cátedra (secreto profesional o reserva sobre calificaciones)?"="Sí, son confidenciales", "¿Cuánto tiempo conservás las fotos de las hojas y los resultados en tu Drive?"="La verdad es que teniendo la copia impresa, no necesito guardar demasiado tiempo la versiòn digital. Podrìa eliminarla una vez confirmado que las notas fueron subidas y firmadas por el titular de catedra.", "¿La cátedra o la facultad autorizó usar la herramienta y guardar fotos y resultados de alumnos en tu cuenta de Google?"="Es una inicitiava mia, que fue consultada con el titular de catedra.", "Si la herramienta se equivoca con una nota, ¿quién responde?"="Yo, como docente que corrige"
- **Qué hizo la IA:** Hizo cuatro preguntas sobre confidencialidad, conservación, autorización y responsable, y escribió la sección 7. No afirmó qué exige la Ley 25.326 y la dejó para verificar contra el texto oficial.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** Responder sobre confidencialidad, conservación, autorización y quién responde.
- **Sección del informe donde encaja:** 7 Riesgos y controles
- **Ítem(s):** 10

### N.º 77 · 2026-11-09 04:48 UTC · Claude Code
- **Etapa:** documentación
- **Pedido (textual, un mensaje):**
  > hace el paso 7.
- **Qué hizo la IA:** Escribió el Anexo F con el paso a paso para rehacer la herramienta (cuentas, arquitectura, hoja, lectura, puntaje, sincronización, login, Google Cloud y problemas conocidos), contrastando con el código lo que no había leído antes.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** Pedir el paso a paso del ítem 7.
- **Sección del informe donde encaja:** 4 Cómo se construyó (Anexo F)
- **Ítem(s):** 7

### N.º 78 · 2026-11-09 17:33 a 17:37 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, mensajes consecutivos):**
  > retomemos esto que mencionas
  >
  > (respuestas a preguntas del asistente) "Pregunta de UNA correcta (A): el alumno marcó A y C (la correcta y una incorrecta). ¿Qué puntaje le das?"="Menos del completo", "Pregunta de DOS correctas (A y B): el alumno marcó A, B y C (las dos correctas y una incorrecta). ¿Qué puntaje le das?"="Menos del completo", "Pregunta de DOS correctas (A y B): el alumno marcó las cuatro opciones. ¿Qué puntaje le das?"="Algo de puntaje", "Pregunta de TRES correctas (A, B y C): el alumno marcó las cuatro opciones. ¿Qué puntaje le das?"="Menos del completo"
  >
  > (respuestas a preguntas del asistente) "UNA correcta (A): marcó A y C. ¿Cuánto le das, sobre 1 punto?"="0,67", "DOS correctas (A y B): marcó A, B y C. ¿Cuánto le das, sobre 1 punto?"="0,835", "DOS correctas (A y B): marcó las cuatro opciones. ¿Cuánto le das, sobre 1 punto?"="0,5", "TRES correctas (A, B y C): marcó las cuatro opciones. ¿Cuánto le das, sobre 1 punto?"="0,89"
- **Qué hizo la IA:** Retomó la regla de puntaje: hizo cuatro preguntas sobre casos de puntaje y luego pidió los valores numéricos. Con los cinco valores declarados comparó el criterio manual con la regla actual y con la del 24 de octubre.
- **Qué hubo que corregir:** El autor respondió «menos del completo» a tres casos y «algo de puntaje» al cuarto, y luego dio los valores 0,67; 0,835; 0,5 y 0,89.
- **Qué inventó o erró la IA:** Las opciones numéricas que ofreció como referencia eran propias; el autor eligió entre ellas.
- **Decisión mía (no delegada):** Dar su criterio de puntaje caso por caso.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5, 6

### N.º 79 · 2026-11-09 17:40 UTC · Claude Code
- **Etapa:** construcción
- **Pedido (textual, un mensaje):**
  > vamos a la regla del 24
- **Qué hizo la IA:** Creó la tarea METSI-12, volvió a la regla del 24 de octubre en `js/scoring.js`, quitó la regla de marcar todas y el parámetro `numOptions`, actualizó pruebas, textos y documentos, corrió `node tools/version.js` y las 115 pruebas (todas en verde) y cerró la tarea.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA. Dejó anotada una diferencia abierta: marcar las cuatro con dos correctas da 0,67 y el autor declaró 0,5.
- **Decisión mía (no delegada):** Volver a la regla del 24 de octubre.
- **Sección del informe donde encaja:** 3 La solución y 6 Pruebas
- **Ítem(s):** 5, 6, 7

### N.º 80 · 2026-11-09 17:45 UTC · Claude Code
- **Etapa:** documentación
- **Pedido (textual, un mensaje):**
  > agrega esta sesion, el orden me es indistinto
- **Qué hizo la IA:** Extrajo los mensajes de esta sesión del historial en disco (incluidos los que el autor mandó mientras el asistente trabajaba y sus respuestas a las preguntas) y los registró en este archivo, con los datos sensibles tapados.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** Registrar esta sesión en el registro de uso de IA.
- **Sección del informe donde encaja:** 5 Registro de IA
- **Ítem(s):** 11
