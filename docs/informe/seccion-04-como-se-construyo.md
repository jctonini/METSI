# Sección 4 · Cómo se construyó (borrador)

> **Fuente:** respuestas del autor del 2026-11-09 sobre sus motivos, el registro de IA (N.º 1 a 80), el README, el diccionario de datos y la clase 13 de la cursada (`diploiafceuba.vercel.app/13`, consultada el 2026-11-09). Presupuesto: ~700 palabras. Lo que falta está marcado **[COMPLETAR]** o **[VALIDAR]**. Esta sección responde los ítems 2, 4, 7 y 9.

## 4.1 Herramientas y por qué esas (ítem 2)

| Herramienta | Para qué | Por qué esa (motivo declarado) | Alternativa | Costo |
|---|---|---|---|---|
| **Claude Code** (Claude Sonnet 5.5, esfuerzo medio) | Escribió el código, corrió las pruebas, hizo los commits y las fusiones | «Ya lo venía usando» (autor, 2026-11-09) | **Codex**, la herramienta de las clases 12 y 13 | Hasta USD 56,13 informados por la plataforma en las cinco sesiones de desarrollo (cota superior; ver `valor-y-costo.md`). Si se cobró o está incluido en una suscripción: **[COMPLETAR]** |
| **App web** que lee la foto de la hoja | La solución en sí | Poder usarla **desde el celular y la PC con Drive** (autor, 2026-11-09) | **Planilla de Google con Apps Script**, el camino recomendado en la consigna | Sin licencia propia |
| **Vercel** | Publica la app con login | Ya tenía cuenta, tiene plan gratuito para este uso y **es una de las herramientas de la cursada** (clase 13) | No consta una alternativa evaluada | Plan gratuito (USD 0), según el autor |
| **Supabase** | Usuarios, contraseñas y roles | Ya tenía cuenta, tiene plan gratuito para este uso y **es una de las herramientas de la cursada** (clase 13) | No consta una alternativa evaluada | Plan gratuito (USD 0), según el autor |
| **GitHub** y **GitHub Pages** | Código, historial y una copia publicada sin login | GitHub es la herramienta de la cursada (clase 13); la publicación en Pages la propuso el asistente cuando le pediste que te indicara qué era más conveniente (N.º 8) | — | Plan gratuito (USD 0), según el autor |
| **Google Drive** y selector de Google (Picker) | Guardar fotos y resultados; cargar las fotos desde una carpeta | Ver los resultados y las fotos desde el celular y la PC (N.º 6) | Guardar solo en el navegador | Sin cargo: el proyecto de Google Cloud no tiene facturación |
| **Red neuronal local** entrenada con MNIST | Sugerir el número de registro leyendo los casilleros | Que **ninguna imagen salga del dispositivo** (decisión del autor, N.º 51) | Enviar los recortes a la API de un modelo de lenguaje: tendría costo por uso y sacaría datos de alumnos del dispositivo | Sin costo por uso |
| **Backlog.md** | Gestión de tareas con el agente | Adoptado por el autor el 2026-11-01 (N.º 44) | — | Gratuito (código abierto) |

**Sobre salirse del camino recomendado:** la consigna recomienda una planilla de Google con Apps Script, pero también admite «una app hecha con Codex u otra herramienta de la cursada», y las preguntas frecuentes permiten otras herramientas de IA «nombrándolas en el informe y explicando por qué». Claude Code no es la herramienta de la clase 12 y 13; por eso se nombra y se justifica acá.

## 4.2 Costos y avisos de los planes gratuitos

La clase 13 advierte (fuentes consultadas por la cátedra el 20 de octubre de 2026; «los planes gratuitos cambian seguido: revisalos antes de usar la app en serio»):
- **Vercel, plan Hobby:** es solo para uso personal y no comercial. **[VALIDAR si el uso en una cátedra califica como personal y no comercial]**
- **Supabase, plan gratuito:** pausa un proyecto después de una semana sin actividad (avisa por mail antes) y da dos proyectos gratuitos activos. Un proyecto pausado se reactiva desde el panel, con sus datos. **Consecuencia para METSI:** si pasa más de una semana sin que nadie entre, el login deja de funcionar hasta reactivarlo. Conviene entrar a la app unos días antes de cada parcial.

## 4.3 Los datos que usa: de dónde salen y qué queda afuera (ítem 4)

**Usa:** las fotos de las hojas (las saca el docente con el celular), la clave de respuestas y la configuración del examen (las carga el docente), y los datos de identificación de cada alumno (nombre, registro y modalidad, que escribe el alumno a mano y confirma o escribe el docente). Detalle completo en `diccionario-de-datos.md`.

**Queda afuera, porque no es necesario para la herramienta** (según el autor): el enunciado de las preguntas (solo se carga la clave de respuestas), el listado de inscriptos (hoy el control contra el listado es manual) y los datos académicos de los alumnos (carrera, comisión, mail). Hechos ya documentados: la lectura del registro no envía imágenes a ningún servicio; los casos que se mandan a analizar van sin nombre, registro ni recortes; la app no se conecta con MiEcon.

## 4.4 La estructura de la solución (ítem 7)

Un repositorio con: lectura de la foto (`js/scanner.js`, `js/layout.js`, `js/sheet.js`), puntaje (`js/scoring.js`), identificación y repetidos (`js/identity.js`, `js/similar.js`), casos a revisar (`js/review.js`), exportación (`js/csv.js`), Drive y sesión (`js/drive.js`, `js/auth.js`, `js/picker.js`), lectura local del registro (`js/digits.js`, `js/digit-model.js`), interfaz (`js/app-*.js`) y servidor del login (`api/`, `server/`). El mapa completo está en el README.

## 4.5 Cómo se construyó, paso por paso (ítem 7)

1. **Idea y diseño de la hoja (1 de octubre):** grilla A5, 7 casilleros de registro, puntaje parcial.
2. **Sincronización con Drive y publicación (1 de octubre).**
3. **Primeras pruebas con hojas reales, identificación obligatoria y control de repetidos (2 de octubre).**
4. **Hojas V3 y V4, banderas de casos dudosos y regla de «marcar todas» (24 de octubre; el 9 de noviembre se volvió a la regla de las marcas en exceso, tarea METSI-12).**
5. **Backlog.md, reintentos de Drive, módulos y guía de uso (1 de noviembre).**
6. **Login con usuario y contraseña (7 de noviembre).**
7. **Selector de Drive, selección múltiple y lectura local del registro (8 de noviembre).**

Cada paso se hizo con un pedido al asistente, con plan antes de los cambios grandes y con pruebas automáticas (115 hoy). Los pedidos textuales están en el Anexo C.

## 4.6 Instalación en la organización (ítem 9)

- **Quién la usa:** docentes de la cátedra, con usuario y contraseña (roles de administrador y docente).
- **Quién la mantiene:** el autor. Hasta ahora los cambios se hicieron con el asistente de IA en sesiones de Claude Code **[VALIDAR si seguirá así]**. Tareas conocidas: correr `node tools/version.js` tras cada cambio, administrar usuarios, entrar a la app antes de cada parcial (por la pausa de Supabase), revisar los planes gratuitos y calibrar la lectura con hojas reales (tarea METSI-1).
- **Cómo se capacita:** el autor se ocuparía de explicarles a los otros docentes. Además hay una guía corta de uso (`docs/guia-de-uso.md`) y una guía de instalación para Windows (`docs/guia-windows.md`).
