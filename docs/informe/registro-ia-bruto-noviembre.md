# Registro de uso de IA (bruto) · Sesiones de noviembre de 2026

Continúa `registro-ia-bruto.md` (N.º 1 a 36) y `registro-ia-bruto-login.md` (N.º 37 a 43). Cubre tres sesiones de Claude Code: **«Backlog.md repository overview»** (1 de nov), **«Capacidad del corrector de exámenes»** (8 de nov) y **«Lectura de escritura manual de alumnos»** (8 de nov).

## Cómo leer este archivo

- **Origen:** se extrajo de las propias sesiones con las herramientas de sesiones de Claude Code, filtrando **solo los mensajes del usuario**. No se leyeron las respuestas del asistente: «Qué hizo la IA» se apoya en el historial de git («según git»), en las tareas de Backlog.md del repositorio («según Backlog»), en el README («según README») y en lo que se deduce de los mensajes. Lo demás es **NO CONSTA**.
- **Horas:** UTC. Los mensajes con imagen traen una captura que no se transcribe.
- **Tapado como [OMITIDO]:** la API key y el número de proyecto de Google Cloud que pegaste en el chat (el README dice que son públicos, pero no hace falta repetirlos).
- **Fuera de alcance:** en la sesión del 1 de noviembre también se trabajó en otro proyecto (EjeZ3D). No se registra acá.
- **Modelo de cada sesión:** Claude Sonnet 5.5, esfuerzo medio, en las tres (verificado el 2026-11-09).

---

## Sesión «Backlog.md repository overview» · 1 de noviembre

### N.º 44 · 2026-11-01 16:28 a 16:41 UTC · Claude Code
- **Etapa:** idea (gestión del proyecto)
- **Pedido (textual, mensajes del usuario en el orden del chat; lo marcado «contexto» es texto del asistente que pegaste):**
  > Explicame como puede ayudarme a trabajar este repo: https://github.com/MrLesk/Backlog.md.git
  >
  > Quiero que lo instales para poder usarlo tanto en metsi como en ejez3d
  >
  > Enumera las tareas pendientes asi te las puedo identificar con numeros.
  >
  > op 1
  >
  > no entiendo donde tengo que encotnrar la opcion "edit"
  >
  > creo que ya lo hice, podes verificar?
  >
  > REpo metsi, avanza en las tareas 1,2,3,4,7.
  > Ejez carga todas las tareas
  >
  > ah y mergea el repo metsi

  Contexto (texto del asistente que pegaste junto con tu respuesta): «Para que quede disponible en cada sesión nuestra, hay que agregar `npm i -g backlog.md` al setup script del entorno. Puedo explicarte cómo hacerlo.» Tu respuesta: «explicame esto.»
- **Qué hizo la IA:** explicó Backlog.md (tablero de tareas en archivos Markdown dentro del repositorio, pensado para trabajar con agentes de IA). Lo instaló (versión 1.55.3) y lo inicializó en METSI, con un `CLAUDE.md` que obliga a leer sus instrucciones al empezar cada conversación. Cargó las tareas iniciales («Agrega Backlog.md para gestionar tareas del proyecto» y «Carga tareas iniciales en el backlog de METSI», según git, 2026-11-01) y fusionó el pull request n.º 7. Te guio para agregar la instalación al *setup script* del entorno. Los números «1,2,3,4,7» son los de la lista enumerada por el asistente, no los ID de Backlog.
- **Qué hubo que corregir:** no encontrabas la opción «edit» del entorno (la IA te guio); después le pediste verificar que lo habías hecho bien. NO CONSTA el detalle.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** adoptar Backlog.md; qué tareas avanzar y en qué repositorio; autorizar la fusión a `main`.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 2, 9, 11

### N.º 45 · 2026-11-01 16:57 a 17:16 UTC · Claude Code
- **Etapa:** construcción
- **Pedido (textual):**
  > mergea todo
- **Qué hizo la IA:** en la rama `claude/determined-ramanujan-ktx7dh` avanzó las tareas de Backlog elegidas (METSI-1 a METSI-5, según Backlog): reintentos y renovación automática de la sesión de Google con Drive, copia local de las fotos pendientes, división de `js/app.js` en módulos, la herramienta de calibración con casos reales (`tools/calibrar.js`) y la guía de uso (`docs/guia-de-uso.md`). Commit «Drive con reintentos y renovación de sesión, copia local de fotos, módulos de la interfaz, calibración y guía de uso» (según git, 2026-11-01). Corrió pruebas (100 pasaron, 0 fallaron) y una prueba de extremo a extremo con un navegador y un Drive simulado. Fusionó el pull request n.º 8 a `main`.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA. **Limitación declarada por la propia herramienta:** `node tools/calibrar.js` se construyó, pero la salida de la sesión dice «No hay casos reales para evaluar»: `tests/fixtures/real/` estaba vacía. La tarea METSI-1 quedó «In Progress» (1 de 3 criterios).
- **Decisión mía (no delegada):** autorizar la fusión de todo lo avanzado.
- **Sección del informe donde encaja:** 4 Cómo se construyó y 6 Pruebas
- **Ítem(s):** 5, 7, 9

### N.º 46 · 2026-11-01 17:17 a 18:17 UTC · Claude Code
- **Etapa:** despliegue
- **Pedido (textual, mensajes del usuario en el orden del chat):**
  > como hago para ver los backlogs y el kanban?
  >
  > 1 npm i -g backlog.md
  > PS C:\WINDOWS\system32> npm i -g backlog.md
  > npm : El término 'npm' no se reconoce como nombre de un cmdlet, función, archivo de script o programa ejecutable.
  > [mensaje de error de PowerShell]
  >
  > algo no quedo bien, las carpetas de metsi y de ejez3d quedaron dentro del system32
  >
  > PS C:\WINDOWS\system32\ejez3d> Move-Item C:\WINDOWS\system32\EjeZ3D "$env:USERPROFILE\Documents\proyectos\"
  > Move-Item : No se puede mover el elemento porque está en uso el elemento situado en 'C:\WINDOWS\system32\EjeZ3D'.
  > [resto del error]
  >
  > Armame un documento de texto con todas las instrucciones como actualizar los repos, como ver los backlogs, y demas cosas que sean utiles
- **Qué hizo la IA:** explicó cómo ver el tablero (`backlog browser`, `backlog board`) y armó una guía para Windows/PowerShell (instalar Node, Git y Backlog.md, actualizar los repositorios, ver el tablero, mover carpetas, problemas frecuentes). La guía se entregó como archivo suelto en la sesión; el 2026-11-09 se guardó en el repositorio como `docs/guia-windows.md` (recortada a METSI, sin las partes de otro proyecto).
- **Qué hubo que corregir:** `npm` no estaba instalado en tu computadora y los repositorios se clonaron dentro de `C:\WINDOWS\system32` (PowerShell abierto como administrador). La guía lo resuelve (abrir PowerShell sin administrador, mover las carpetas).
- **Qué inventó o erró la IA:** NO CONSTA. No consta si la IA anticipó que PowerShell como administrador deja los repositorios en `system32`.
- **Decisión mía (no delegada):** pedir una guía de uso para mí; reportar los errores con el texto exacto.
- **Sección del informe donde encaja:** 4 Cómo se construyó (herramientas) y 9 Instalación
- **Ítem(s):** 9

---

## Sesión «Capacidad del corrector de exámenes» · 8 de noviembre

### N.º 47 · 2026-11-08 19:10 a 19:14 UTC · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > Dentro de poco tiempo se va a venir el primer uso en serio del corrector de examenes de Metsi, estaba pensando en la carga que va a tener que soportar. Estamos hablando de aproximadamente 80 alumnos. Hoy la herramienta soportaria trabajar con 80 fotos de examens?
  >
  > Las fotos las voy a tomar con el celular, PERO podrìa subirlas a una carpeta de Google Drive, podrìa pedirle a la tool de correcciòn que tome las fotos desde esa carpeta?
  >
  > Si hagamoslo. Yo selecciono una carpeta y la tool administra el acceso a cada una de las fotos.
- **Qué hizo la IA:** analizó la capacidad con unas 80 hojas y creó tres tareas en Backlog (19:15): METSI-7 (redibujado lento con muchas hojas), METSI-8 (aviso si el guardado local se llena) y METSI-9 (cargar fotos desde Drive con el selector de Google). Según Backlog, con 80 hojas el cálculo de repetidos tardaba unos 561 ms por redibujo (en Node) y bajó a unos 17 ms; el aviso de guardado local se probó con una cuota simulada. Commit «Acelerar redibujado con muchas hojas, avisar si el guardado local falla y elegir fotos desde Drive» (según git, 2026-11-08).
- **Qué hubo que corregir:** tu expectativa era elegir una carpeta y que la herramienta accediera a todas sus fotos. Según el README, Google no da acceso al contenido de una carpeta con el permiso `drive.file`: hay que abrirla y marcar las fotos (con Ctrl+A se marcan todas). El pedido original se adaptó a eso.
- **Qué inventó o erró la IA:** NO CONSTA. Según Backlog, METSI-7 y METSI-8 se verificaron en Node y el aviso de la METSI-8 «no se probó en un navegador real».
- **Decisión mía (no delegada):** el volumen real (unos 80 alumnos, **cifra tuya**), tomar las fotos con el celular, subirlas a Drive, y avanzar con el selector de Google.
- **Sección del informe donde encaja:** 1 Problema (volumen) y 3 Solución
- **Ítem(s):** 1, 4, 7, 12

### N.º 48 · 2026-11-08 20:04 a 20:20 UTC · Claude Code
- **Etapa:** despliegue
- **Pedido (textual, mensajes del usuario en el orden del chat):**
  > que debo hacer?
  >
  > [imagen]
  >
  > [imagen]
  >
  > [OMITIDO: API key pública del selector de Google]
  >
  > [OMITIDO: número del proyecto de Google Cloud]
  >
  > en el deploy todo tira error al querer sincronizar con drive, es un tema de auth
  >
  > [imagen]
  >
  > no quiiero hacer todo esto, desplega el cambio y probamos en produccion
  >
  > [imagen]
  > que es esta carpeta?
  >
  > me tendria que ofrecer el root de mi drive
  >
  > [imagen]
  > ahora si
- **Qué hizo la IA:** te guio para crear la API key y obtener el número de proyecto en Google Cloud. Antes de cargar la clave te pidió que la pegaras como texto (en la captura se confundían la `I` mayúscula, la `l` minúscula y el `1`) y te aconsejó **restringirla** (solo tu sitio web y solo la API del selector), porque la clave queda visible en el código de la página. Después cargó la clave y el número de proyecto en `js/config.js` («Cargar la API key pública del selector de Drive» y «Cargar el número de proyecto para el selector de Drive», según git, 2026-11-08). Cuando el selector se abrió en una carpeta que no esperabas, lo corrigió: ahora abre en «Mi unidad» (la raíz) y deja las imágenes de toda la cuenta en otra pestaña (según git, 2026-11-08). Fusionó los pull requests n.º 10 y 11.
- **Qué hubo que corregir:** (1) **Error de autenticación de Drive.** La causa fue `origin_mismatch` (según la respuesta del asistente a tu captura): abrías la app desde la dirección que Vercel le asigna a la **rama** (una vista previa), y esa dirección no estaba en los *Orígenes autorizados de JavaScript* del ID de cliente OAuth de Google. No era un problema del código. El asistente propuso agregar esa dirección en Google Cloud; vos preferiste no hacerlo («no quiiero hacer todo esto, desplega el cambio y probamos en produccion»), se fusionó a `main` y en la dirección de producción, que ya estaba autorizada, la sincronización volvió a funcionar («Sincronizado con Drive ✔»). (2) El selector abría en una carpeta que no era la raíz de tu Drive; se corrigió para que abra en «Mi unidad».
- **Qué inventó o erró la IA:** antes de ver la captura, el asistente listó cuatro causas posibles del error de autenticación sin saber cuál era (la que propuso como más probable resultó ser la correcta). Fusionó a `main` el cambio del selector sin preguntar, con el argumento de que habías dicho de probar en producción (lo declaró en su respuesta). Según Backlog, METSI-9 se implementó sin poder probarlo con Google real («ningún criterio se marca hasta probarlo») y quedó cerrado después de tu prueba en producción.
- **Decisión mía (no delegada):** crear yo los datos en Google Cloud; no agregar la dirección de la vista previa en Google Cloud y probar en producción (la versión publicada) en vez de armar un entorno local; exigir que el selector abra en la raíz de mi Drive.
- **Sección del informe donde encaja:** 4 Cómo se construyó y 6 Pruebas
- **Ítem(s):** 2, 5, 9, 10

### N.º 49 · 2026-11-08 20:44 a 20:52 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual, mensajes del usuario en el orden del chat):**
  > seleccione 11 fotos y las cargo todas
  >
  > agrega un botòn que me permita quitar todas las fotos de la solapa Corregir
  >
  > [interrumpido por el usuario]
  >
  > Agregá la posibilidad de selecciona una a una las fotos y la posibilidad de un seleccionar todo, para poder quitar las fotos seleccionadas de la solapa Corregir
  >
  > hacelo, y tambièn confirmame si estas subiendo los cambios al gitub
- **Qué hizo la IA:** cerró la tarea METSI-9 como probada en producción («Backlog: cerrar METSI-9 (selector de Drive probado en producción)», según git, 2026-11-08). Implementó la selección de hojas con casilla en cada hoja, «seleccionar todo» y «Quitar seleccionadas» con confirmación («Seleccionar hojas y quitar varias a la vez en Corregir», según git, 2026-11-08); verificó con una simulación (6 hojas, selección de 2, selección total, quitar). Confirmó que la rama local y la remota estaban en el mismo commit y fusionó el pull request n.º 12. Suite: 106 pruebas pasaron y 1 falló: era `tests/access.js` (falta instalar las dependencias), que ya fallaba antes.
- **Qué hubo que corregir:** tu primer pedido («quitar todas») lo interrumpiste y lo reemplazaste por uno más preciso (seleccionar una a una y seleccionar todo).
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** probar con 11 fotos reales cargadas desde Drive; refinar el pedido; pedir confirmación de que los cambios llegaban a GitHub.
- **Sección del informe donde encaja:** 3 Solución y 6 Pruebas
- **Ítem(s):** 5, 6, 7

### N.º 50 · 2026-11-08 21:46 UTC · Claude Code
- **Etapa:** gestión
- **Pedido (textual):**
  > Quiero discutir una nueva funcionalidad, conviene hacerlo aquì o en otro chat?
- **Qué hizo la IA:** según el resumen de la sesión, recomendó abrir un chat nuevo, salvo que la funcionalidad se apoyara en el selector de Drive o la carga de fotos. Seguiste el consejo: la funcionalidad nueva se discutió en la sesión siguiente (N.º 51).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** separar cada funcionalidad en una sesión distinta.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 11

---

## Sesión «Lectura de escritura manual de alumnos» · 8 de noviembre

### N.º 51 · 2026-11-08 21:48 a 21:51 UTC · Claude Code
- **Etapa:** diseño
- **Pedido (textual, mensajes consecutivos):**
  > Estaba pensando, quisiera saber si vos pudieras leer lo que los alumnos escriben a mano (su nombre y su numero de registro) y pedirme a mi una correcciòn o una confirmaciòn, si lo que vos leiste es correcto yo lo confirmo y me ahorro tener que escribirlo, y si es incorrecto, lo corrijo.
  >
  > no entiendo porque habria que enviar los recortes a la api de anthorpic, acaso no es lo mismo que ya haces para detectar las respuestas completadas?
  >
  > vamos con la opciòn 3, si ya puede leer los registros seria una ventaja para mi.
- **Qué hizo la IA:** propuso opciones numeradas para leer lo manuscrito. Por tu segundo mensaje, una de ellas enviaba los recortes de la foto a la API de Anthropic. NO CONSTA el resto de las opciones ni cómo explicó la diferencia. Con la opción 3 creó la tarea METSI-11 (a las 21:52) y construyó una **lectura local de los dígitos del registro**: una red neuronal chica entrenada con MNIST (`tools/train-digits.py`), exportada a `js/digit-model.js` (unos 150 KB) y usada por `js/digits.js`, que corre dentro del navegador sin enviar nada a servicios externos. El resultado es solo una **sugerencia**: el campo queda vacío hasta que confirmás o escribís el número. Commit «Proponer el número de registro leyendo los casilleros (OCR local)» (según git, 2026-11-08).
- **Qué hubo que corregir:** NO CONSTA. Cuestionaste por qué enviar los recortes a un servicio externo.
- **Qué inventó o erró la IA:** NO CONSTA un error afirmado. **Límites declarados (según README y Backlog):** el nombre sigue siendo manual (solo se lee el registro); la precisión de cerca del 99 % se midió con dígitos de MNIST dibujados sobre fotos sintéticas, es una prueba optimista, y con birome real puede fallar más.
- **Decisión mía (no delegada):** que lo manuscrito lo confirme una persona (la lectura es solo una sugerencia); **no enviar a un servicio externo los recortes de lo que escriben los alumnos** y elegir la lectura local (opción 3).
- **Sección del informe donde encaja:** 3 Solución (autonomía) y 7 Riesgos y controles (datos personales)
- **Ítem(s):** 4, 5, 6, 10

### N.º 52 · 2026-11-08 22:03 a 22:11 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > [imagen: captura de la app con una lectura del registro]
  >
  > los numero de registros oscilan entre 6 o 7 caracteres, con tu propuesta de utilizar "?" siento que todos los registros que sean de 6 caracteres van a quedar asi: '?XXXXXX'  y eso va a ser un freno para mi, más que una solución.
- **Qué hizo la IA:** cambió la regla: con 7 casilleros, los vacíos de los **extremos** (al principio o al final) no cuentan como faltantes; un vacío entre dígitos se muestra como «?». Commit «Registros de 6 o 7 dígitos: los casilleros vacíos de los extremos no cuentan» (según git, 2026-11-08).
- **Qué hubo que corregir:** la propuesta de mostrar «?» en los casilleros vacíos habría marcado como dudosos todos los registros de 6 dígitos.
- **Qué inventó o erró la IA:** el diseño no contemplaba que los registros reales tienen 6 o 7 dígitos (dato tuyo, que la IA no tenía). Lo detectaste vos al ver el comportamiento.
- **Decisión mía (no delegada):** el dato de que los registros tienen 6 o 7 dígitos; rechazar la solución con «?».
- **Sección del informe donde encaja:** 6 Pruebas y 5 Registro de IA
- **Ítem(s):** 4, 5

### N.º 53 · 2026-11-08 22:42 a 22:50 UTC · Claude Code
- **Etapa:** documentación
- **Pedido (textual, mensajes consecutivos):**
  > Quiero que revises el readme y que lo optimices.
  >
  > ok, dejamos todo asi por el momento
  >
  > no se publica solo en vercel, esta ahì pero tambien en github pages. lo del punto suelto, dejalo asi ahora. lo revisamos mas adelante, cuando haya ejemplos reales
  >
  > ya corregiste el readme en github?
  >
  > publicalo
- **Qué hizo la IA:** reordenó el README por tipo de lector y lo puso al día («README: reordenar por lector y poner al día», según git, 2026-11-08), agregó que la app también se publica en GitHub Pages sin login («README: la app también se publica en GitHub Pages (sin login)», según git) y fusionó el pull request n.º 13.
- **Qué hubo que corregir:** el README decía que la app se publicaba solo en Vercel; corregiste que también está en GitHub Pages.
- **Qué inventó o erró la IA:** una afirmación incompleta en el README (publicación solo en Vercel), corregida por vos.
- **Decisión mía (no delegada):** dejar sin cambios el umbral de «punto suelto» hasta tener ejemplos reales; mantener GitHub Pages publicado; ordenar publicar el README.
- **Sección del informe donde encaja:** 4 Cómo se construyó y 7 Riesgos y controles
- **Ítem(s):** 9, 10

---

## Cifras y datos de estas sesiones

- Unos **80 alumnos** en el primer uso en serio. Origen: usuario (N.º 47). Sirve para el ítem 1 (volumen) y para estimar el ítem 12.
- **11 fotos** cargadas desde Drive en la prueba. Origen: usuario (N.º 49).
- Registros de **6 o 7** dígitos, con 7 casilleros. Origen: usuario (N.º 52).
- Redibujo con 80 hojas: ~561 ms → ~17 ms. Origen: medición de la IA en Node (según Backlog METSI-7). No se midió en un celular.
- Precisión de la lectura de dígitos cercana al 99 %. Origen: prueba de la IA con MNIST sobre fotos sintéticas (README). **No es una medida con hojas reales.**
- Pruebas: 100 pasaron el 2026-11-01 (N.º 45) y 106 el 2026-11-08 (N.º 49, con 1 falla por falta de dependencias). Hoy: 115, todas en verde (corrida del 2026-11-08 con `npm install`).
- Tiempo de corrección a mano y tiempo con la herramienta: **SIN ORIGEN**. No se midió en estas sesiones.
