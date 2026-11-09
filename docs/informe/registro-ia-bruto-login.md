# Registro de uso de IA (bruto) · Sesión «Autenticación y gestión de usuarios» (7 de noviembre de 2026)

Continúa `registro-ia-bruto.md` (N.º 1 a 36). Se extrajo de la propia sesión con las herramientas de sesiones de Claude Code, filtrando **solo los mensajes del usuario**. No se leyeron las respuestas del asistente, así que «Qué hizo la IA» se apoya en el historial de git (commit «Acceso con usuario y contraseña (Supabase Auth + Vercel) con rol admin y docentes», 2026-11-07, pull request n.º 9), en el resumen que la plataforma guarda de la sesión («según el resumen de la sesión») y en lo que se deduce de los mensajes. Lo demás: **NO CONSTA**.

Tapado como «[OMITIDO]»: email, URL del proyecto de Supabase e id del usuario. Las horas son UTC. Los mensajes con imagen traen una captura que no se transcribe.

Sesión creada el 2026-11-07 19:12 UTC; plataforma: Claude Code en la nube. Modelo: completar a mano.

### N.º 37 · 2026-11-07 19:13 y 19:16 UTC · Claude Code
- **Etapa:** idea
- **Pedido (textual, mensajes consecutivos):**
  > Si quisera que el proyecto de correcciòn de examenes, si bien es publico en github, tenga un logeo con usuario y contraseña, y que yo pueda administrar al menos 3 ususarios diferentes, es eso posible?
  >
  > vamos a implemenarlo utilizando mis cuentas de supabase y de versel
- **Qué hizo la IA:** NO CONSTA el detalle de la respuesta. Después implementó el acceso con Supabase Auth y Vercel, con rol admin y docentes (según git).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** querer acceso con usuario y contraseña aunque el repositorio sea público; administrar al menos 3 usuarios; usar mis propias cuentas de Supabase y Vercel.
- **Sección del informe donde encaja:** 3 Solución (y 7 Riesgos y controles)
- **Ítem(s):** 6, 9, 10

### N.º 38 · 2026-11-07 19:27 a 19:39 UTC · Claude Code
- **Etapa:** despliegue
- **Pedido (textual, mensajes del usuario en el orden del chat; las preguntas del asistente no vienen):**
  > 1, orientame donde encuentro de lo allow new users y dame el readme asi copio el sql
  >
  > update auth.users
  > set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'
  > where email = '[OMITIDO]';
  >
  > Dice 0 rows affected
  >
  > id,email,raw_app_meta_data
  > [OMITIDO],[OMITIDO],"{""role"":""admin"",""provider"":""email"",""providers"":[""email""]}"
  >
  > puede ser esta la url? [OMITIDO: URL del proyecto de Supabase]
  >
  > guiame en vercel, no se donde hacer todo esto
  >
  > [imagen]
  > C
- **Qué hizo la IA:** NO CONSTA el detalle. Por los mensajes, la guio paso a paso en Supabase (desactivar «Allow new users to sign up», crear el usuario, hacerlo admin con SQL) y en Vercel; dejó los pasos en el README (el usuario pidió «el readme» para copiar el SQL; el README actual los tiene).
- **Qué hubo que corregir:** el SQL del rol admin devolvió «0 rows affected», pero la consulta siguiente mostró el usuario ya con `role: admin` (el rol ya estaba cargado). NO CONSTA qué diagnosticó la IA.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** crear yo las cuentas y los usuarios en Supabase y Vercel; verificar con una consulta que el rol quedó cargado; pedir guía paso a paso en Vercel.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 7, 9

### N.º 39 · 2026-11-07 19:43 a 19:46 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > me llevò aca, sin login: https://metsi-correcciones.vercel.app/
  >
  > no hay otro deployment que el que te mostre, lo que me indicas vos no existe en vercel
  >
  > [imagen]
  > ahora si
- **Qué hizo la IA:** NO CONSTA el detalle. La app publicada en Vercel abría sin pedir login; la IA indicó un paso que el usuario no encontró en Vercel; con una captura posterior el usuario confirmó «ahora si» (según el resumen de la sesión, se resolvió con la configuración de Vercel).
- **Qué hubo que corregir:** la app publicada no pedía login; el usuario corrigió a la IA.
- **Qué inventó o erró la IA (según el mensaje del usuario):** indicó un deployment que **no existe en Vercel**. NO CONSTA el detalle de la indicación.
- **Decisión mía (no delegada):** probar la URL real y reportar con captura que no había login; contradecir a la IA cuando lo que decía no coincidía con lo que veo en pantalla.
- **Sección del informe donde encaja:** 5 Registro de IA y 6 Pruebas
- **Ítem(s):** 5, 11

### N.º 40 · 2026-11-07 20:01 y 20:04 UTC · Claude Code
- **Etapa:** despliegue
- **Pedido (textual):**
  > podes hacer el merge
  >
  > ya hice las pruebas y funciona
- **Qué hizo la IA:** fusionó el pull request n.º 9 a `main` (según git, 2026-11-07).
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** probar el login yo mismo antes de aprobar y autorizar la fusión a `main`.
- **Sección del informe donde encaja:** 4 Cómo se construyó y 6 Pruebas
- **Ítem(s):** 5, 9

### N.º 41 · 2026-11-07 20:05 y 20:09 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > [imagen]
  > cuando quise sincronizar con google drive
  >
  > ya sincronizo ok.
- **Qué hizo la IA:** NO CONSTA. Con una captura de un error al sincronizar con Drive, la IA lo atendió y la sincronización quedó funcionando.
- **Qué hubo que corregir:** error al sincronizar con Google Drive después del login. NO CONSTA la causa.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** reportar el error con una captura y confirmar que quedó resuelto.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 42 · 2026-11-07 20:09 UTC · Claude Code
- **Etapa:** documentación
- **Pedido (textual, mensajes consecutivos):**
  > corregi el readme
  >
  > la guia no hace falta ahora.
- **Qué hizo la IA:** NO CONSTA. Por los mensajes, había propuesto corregir el README y escribir una guía (probablemente de administración de usuarios); el usuario aprobó lo primero y rechazó la guía.
- **Qué hubo que corregir:** NO CONSTA
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** corregir el README y dejar la guía para después.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 9

### N.º 43 · 2026-11-07 20:13 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > por que en esta url no veo el acceso a usuarios? https://jctonini.github.io/METSI/
- **Qué hizo la IA:** según el resumen de la sesión: «GitHub Pages no ejecuta el login de Vercel y deja la app abierta; hay que desactivarlo en Settings → Pages». El 8 de noviembre un commit del README documenta que la app también se publica en GitHub Pages **sin login** (según git).
- **Qué hubo que corregir:** el usuario descubrió que en GitHub Pages no aparece el acceso de usuarios: la copia publicada ahí **no tiene el control de acceso**. NO CONSTA si se desactivó Pages; el README actual lo deja como advertencia.
- **Qué inventó o erró la IA:** NO CONSTA
- **Decisión mía (no delegada):** probar la otra URL de publicación; mantener Pages abierto o desactivarlo es decisión mía.
- **Sección del informe donde encaja:** 7 Riesgos y controles
- **Ítem(s):** 10

## Cifras y datos de esta sesión

- Mínimo 3 usuarios administrables. Origen: usuario (N.º 37).
- Roles: `admin` y `docente`. Origen: la IA propuso; el usuario aceptó (según git y README).
- Ambas URLs de publicación (Vercel y GitHub Pages) conviven; solo Vercel exige login. Origen: README y N.º 43.
