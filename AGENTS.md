# METSI · Corrector de multiple choice

Instrucciones permanentes para quien trabaje en este repositorio con un asistente de IA (Codex, Claude Code u otro). Leelas antes de cada tarea: así no hace falta repetir el contexto en cada pedido. Si algo de acá choca con un pedido, avisá antes de seguir.

## Problema que resuelve
Corregir a mano exámenes multiple choice en papel lleva mucho tiempo (unos 80 alumnos por turno). Esta app web lee una foto de la hoja de respuestas, calcula el puntaje y deja que el docente revise lo dudoso, confirme el número de registro y exporte un CSV para Excel o Google Sheets. Se usa desde el navegador del celular o de la PC.

## Roles
- **docente**: saca las fotos, revisa, corrige a mano lo que haga falta y exporta. Es quien responde por la nota.
- **admin**: además administra usuarios desde la pestaña Usuarios (solo en la copia de Vercel con login).
- **alumno**: no usa la app. Completa la hoja de respuestas impresa con birome.
- **sin login**: en Vercel no ve nada salvo `/login`. La copia de GitHub Pages no tiene login: cualquiera con la dirección puede usar la herramienta.

## Datos
Diccionario completo en `docs/informe/diccionario-de-datos.md`. Resumen:
- **examen**: título, cantidad de preguntas, opciones (2 a 6), casilleros del registro (1 a 9), modalidades, peso de las incorrectas (0 a 1) y sensibilidad de lectura; **clave**: opciones correctas y puntos de cada pregunta.
- **hoja**: foto, versión de hoja, nombre, registro, modalidad, respuestas leídas y finales, marcas de revisión.
- **resultados** (`resultados.csv`) y **casos a revisar** (`casos.json`, sin nombres ni registros).
- **usuarios** (Supabase): email y rol (`admin` o `docente`).

### Relaciones
- Un examen tiene varias hojas; cada hoja tiene una foto y un puntaje.
- El puntaje **no se guarda**: se calcula al mostrar y al exportar.

## Reglas del negocio
- El puntaje de cada pregunta se **reparte en partes iguales** entre sus respuestas correctas, y hay puntaje parcial.
- Las incorrectas **solo restan por las marcas que exceden la cantidad de correctas**, con un peso de 0 a 1 (0,33 en un examen nuevo). Marcar tantas opciones como correctas hay no resta. Una pregunta nunca baja de 0; sin correctas definidas se anula y da el puntaje completo. **No hay una regla especial para «marcar todas».** Está fijado en `tests/run.js` (tarea METSI-12).
- La app **no convierte el puntaje en nota ni decide quién aprueba**: el criterio está fijado de antemano y se aplica en Excel.
- Cada hoja necesita **nombre o registro**; si falta, no se puede exportar. Mismo registro, o mismo nombre con el registro faltante: la app **frena** y pregunta. Mismo nombre con registros distintos: solo avisa. Misma foto cargada dos veces: avisa.
- El registro que lee la red neuronal es **solo una sugerencia**: nunca se guarda sin que el docente lo confirme o lo escriba. Los registros tienen 6 o 7 dígitos con 7 casilleros: los casilleros vacíos de los extremos no cuentan. Un casillero vacío no se completa con un dígito inventado.
- Las versiones de hoja **V1, V2 y V3 no se cambian** (hay hojas impresas); la V4 es la que genera la app. Capacidad de la V4: 32 preguntas con 5 opciones o 48 con 4 (con dos modalidades).

## Permisos
- **Vercel:** sin una sesión válida no se sirve ningún archivo de la app (`api/app.js`). El rol sale de `app_metadata.role`, que el usuario no puede modificar. Solo el admin llama a `api/users.js`, y se valida en el servidor.
- **Google Drive:** permiso mínimo `drive.file`: la app solo ve lo que ella creó o lo que el docente elige en el selector. Elegir una carpeta **no** habilita lo que tiene adentro.
- La clave `service_role` de Supabase vive solo en las variables de entorno de Vercel: nunca en el código ni en el navegador.

## Pantallas
Examen (clave y configuración), Hoja (hoja imprimible), Corregir (fotos, lectura, registro sugerido, repetidos, casos a revisar), Resultados (tabla y CSV), Drive (sincronización) y Usuarios (solo admin).

## Fuera de esta versión
No se conecta con MiEcon; no compara con el listado de inscriptos; no convierte el puntaje en nota; no lee el nombre (solo lo recorta para que el docente lo escriba); no borra sola los datos de alumnos; no envía imágenes a servicios externos. No agregar nada de esto salvo que lo pidan.

## Tecnología
- **App del navegador:** JavaScript, HTML y CSS, sin dependencias ni paso de compilación. Módulos en `js/` (la lógica pura corre también en Node) e interfaz en `js/app-*.js`.
- **Node.js 20 o más:** pruebas (`node tests/run.js`), herramientas (`tools/`) y las funciones de Vercel (`api/`, `server/`) con `@supabase/supabase-js` y `jose`.
- **Python 3** con `numpy` y `scipy`, **solo** para reentrenar el lector de dígitos (`tools/train-digits.py`, con MNIST). La app no lo necesita.
- **Publicación:** Vercel (con login de Supabase Auth) y GitHub Pages (sin login). **Google:** Drive API y selector (Picker).
- **Tareas:** Backlog.md en `backlog/` (ver `CLAUDE.md`).
- Mapa de archivos y puesta en marcha: `README.md`. Cómo rehacer todo desde cero: `docs/informe/anexo-f-paso-a-paso.md`.

## Reglas técnicas
- Después de cambiar código o estilos en `js/` o `css/`, correr `node tools/version.js` (una prueba falla si se olvida).
- Antes de cada commit, correr `node tests/run.js`: tienen que pasar todas (hoy 115). `tests/access.js` necesita `npm install`.
- El cálculo del puntaje vive solo en `js/scoring.js`. Cualquier cambio de regla lleva su prueba en `tests/run.js`.
- **No usar datos reales de alumnos** en ejemplos, pruebas, capturas ni commits: el repositorio es público. Los datos de prueba se inventan. Los «casos a revisar» no llevan nombres, registros ni recortes, y las fotos que se mandan a analizar van con nombre, registro y fecha tapados.
- **Claves:** nunca subir claves privadas. La API key del selector de Drive es pública por diseño, pero se **restringe antes de subirla** (sitios web de la app con `/*` y solo Google Picker API); la cronología del aviso de Google está en `docs/informe/incidente-api-key.md`.
- No editar a mano `js/digit-model.js` ni `js/version.js` (se generan). No cambiar la geometría de las versiones de hoja ya impresas: una prueba por versión fija sus posiciones.
- Las tareas se llevan con el comando `backlog`; no editar a mano los archivos de `backlog/`.
- Lo que no se probó en un navegador real o en producción se dice así; no se da por verificado.

## Reglas de trabajo
- Explicame el plan en español simple y esperá mi aprobación antes de los cambios grandes.
- Soy docente y no programo: cuando tenga que hacer algo yo (Google Cloud, Vercel, Supabase, GitHub o la terminal), decime paso a paso qué hacer y qué voy a ver.
- Cambios chicos, una parte por vez, y decime cómo probarla.
- Si falta un dato (cantidad de preguntas, opciones, formato de la hoja, qué hacer con un repetido), preguntame y esperá: no lo decidas vos.
- No toques lo que no pedí. Si algo falla, explicame la causa en palabras simples antes de arreglarlo.
- Textos de la app y comentarios del código en castellano rioplatense.
- Cuando una parte funciona, un commit con un mensaje claro en español. No fusiones a `main` sin que lo pida.
