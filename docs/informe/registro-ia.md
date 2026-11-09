# Registro de uso de IA · ordenado para el informe

Este archivo ordena el material en bruto (`registro-ia-bruto.md`, 36 pedidos, del 1 al 24 de octubre de 2026) según las secciones del informe y los 12 ítems de la lista de cumplimiento. Los pedidos textuales completos están en el bruto; acá se cita por **N.º**. Nada de lo que sigue es nuevo: sale del bruto, del historial de git y del README. Lo que no consta figura como **NO CONSTA** o **PENDIENTE**.

## 1. Estado del material

| Tramo | Fechas | Pedidos | Archivo | Pull requests (según git) |
|---|---|---|---|---|
| Idea, diseño de la hoja, Drive, publicación | 1 y 2 de oct | N.º 1 a 22 | `registro-ia-bruto.md` | #1, #2, #3 |
| Pruebas con hojas reales, hojas V3 y V4, banderas, regla de puntaje | 24 de oct | N.º 23 a 36 | `registro-ia-bruto.md` | #4, #5, #6 |
| Backlog.md, Drive con reintentos, módulos, calibración, guía de uso | 1 de nov | N.º 44 a 46 | `registro-ia-bruto-noviembre.md` | #7, #8 |
| Acceso con usuario y contraseña (Supabase + Vercel) | 7 de nov | N.º 37 a 43 | `registro-ia-bruto-login.md` | #9 |
| Capacidad, selector de Drive, selección múltiple | 8 de nov | N.º 47 a 50 | `registro-ia-bruto-noviembre.md` | #10, #11, #12 |
| Lectura del registro (OCR local), README | 8 de nov | N.º 51 a 53 | `registro-ia-bruto-noviembre.md` | #13 |

**Cobertura.** Quedan cubiertas todas las sesiones de la herramienta, del 1 de octubre al 8 de noviembre. El orden numérico de los N.º no es cronológico (el login, del 7 de noviembre, lleva los N.º 37 a 43 porque se extrajo antes). Si querés, se pueden renumerar por fecha al armar el anexo.

**Sesiones que no se registran** (no pidieron agregados ni correcciones a la herramienta): armado del examen del 2.º parcial y su guía, la skill de armado de exámenes, la escala de calificación no lineal (4 de oct), el acceso a Google Drive para el examen (23 de oct), y el trabajo en el otro proyecto (EjeZ3D).

## 2. Herramientas usadas (para la sección 4 y el ítem 2)

| Herramienta | Rol | Dato que falta |
|---|---|---|
| Claude Code (sesiones en la nube de claude.ai/code) | Escribió y modificó la app, corrió las pruebas, hizo commits y pull requests | Modelo y versión por sesión (completar a mano) |
| GitHub (servidor MCP) | Pull requests y fusiones a `main` | — |
| Google Drive (servidor MCP) | Leer `casos.json` para analizar casos marcados | — |
| Backlog.md | Gestión de tareas (11 tareas, ver `backlog/tasks/`) | — |
| Supabase, Vercel, GitHub Pages, Google Cloud (Drive API y Picker) | Servicios de la app publicada | Costo real de cada uno |
| Selector de archivos de Google (Picker), Google Identity Services y Drive API | Cargar fotos desde Drive y sincronizar | Costo (hoy gratuito con los límites de cuota; verificar) |
| Red neuronal chica entrenada con MNIST (`tools/train-digits.py`) | Sugerir el número de registro, dentro del navegador | Sin costo; no usa servicios externos |
| Pruebas propias (`tests/run.js`) | Verificación | — |

- **Costo de uso de IA:** el bruto registra USD 39,33 acumulados hasta el 2026-11-08, pero ese número **incluye trabajo fuera de la herramienta** (armado del examen). No se puede citar tal cual como costo de la herramienta.
- **Alternativa justificada (ítem 2):** no consta una comparación. Hay que redactarla: por ejemplo, Apps Script sobre una planilla frente a una app web con lectura de fotos en el navegador. Esto es una decisión de diseño tuya y no se puede inferir del material.

## 3. Pedidos sugeridos para el cuerpo del informe

El informe tiene 12 páginas, así que no entran los 36 pedidos. Propongo citar textualmente estos y dejar el resto como anexo. Los elegí porque muestran una decisión tuya, una corrección o un error de la IA.

| N.º | Por qué sirve | Sección del informe |
|---|---|---|
| 1 | El problema y la solución elegida, en tus palabras | 1 Problema |
| 3 y 4 | Puntaje por pregunta repartido entre correctas, y la decisión de que la app no decida quién aprueba | 3 Solución, ítem 6 |
| 7 | Hoja A5, registro manuscrito en 7 casilleros | 3 Solución |
| 13 | Primera prueba real; la IA usó tu nombre y registro reales en los ejemplos | 5 Registro y 7 Riesgos |
| 21 y 22 | Caso de respuesta conocida (pregunta 8) que lleva al descuento configurable entre 0 y 1; valor 0,33 elegido por la IA | 6 Pruebas |
| 23 y 24 | Prueba real con fallas y rediseño de las marcas de esquina | 6 Pruebas, 3 Solución |
| 25 | Banderas de casos dudosos con fotos sin nombre ni registro | 3 Solución, 7 Riesgos |
| 30 a 35 | Cómo se llegó a la regla de puntaje: criterio elegido, rechazado al probar casos, corregido | 5 Registro (mejor ejemplo de verificación humana) |

## 4. Mapa de todos los pedidos a las secciones del informe

(Según el campo «Sección» del bruto.)

| Sección del informe | Pedidos |
|---|---|
| 1 El problema | 1, 47 (volumen: unos 80 alumnos) |
| 3 La solución | 2, 3, 4, 5, 6, 7, 9, 14, 15, 16, 17, 18, 22, 24, 25, 27, 28, 30, 33, 34, 37, 47, 49, 51 |
| 4 Cómo se construyó | 8, 10, 11, 12, 19, 35, 36, 38, 40, 42, 44, 45, 46, 48, 50, 53 |
| 6 Pruebas | 13, 20, 21, 23, 26, 29, 31, 32, 39, 41, 45, 48, 49, 52 |
| 7 Riesgos y controles | 7, 10, 13, 14, 17, 25, 37, 43, 51, 53 (datos personales, enmascarado, acceso y lectura local) |

## 5. Qué hubo que corregir y qué erró la IA (sección 5)

Todo consta en la lista B del bruto. Los cuatro casos más útiles para el informe:

1. **Datos reales en las pruebas (N.º 13).** Los ejemplos de prueba de la IA coincidían con tu nombre y registro reales. Se reemplazaron por datos inventados y se reescribió la historia de la rama. Desde entonces se revisa el repositorio antes de cada commit.
2. **Lectura de hojas reales (N.º 13, 23, 26).** Falló el chequeo de orientación, la línea base se inflaba con más de la mitad de las burbujas marcadas, y una foto con la hoja vecina daba una lectura corrida. Cada caso se corrigió con una prueba de regresión.
3. **Regla de puntaje (N.º 30 a 34).** Un primer criterio dejaba la primera incorrecta sin descuento; el siguiente daba 0 con 4 correctas de 5 por una sola incorrecta. Las dos fallas las detectaste vos probando casos concretos.
4. **Copia vieja en el navegador (N.º 20).** Motivó el número de versión en los archivos.

Además hubo un commit con una prueba fallando (82 pasaron, 1 falló) y una cuenta mal armada en una descripción de opciones (N.º 30).

## 6. Decisiones que no se delegaron

Resumen por tema (detalle en la lista C del bruto):

- **Problema y alcance:** qué resolver, 10 o 20 preguntas, 4 o 5 opciones, quién fotografía, salida en planilla (N.º 1 y 2).
- **Quién decide qué:** la app calcula el puntaje y **no** decide quién aprueba (N.º 4).
- **Hoja:** A5, registro manuscrito, 7 casilleros, versión impresa «Vx», fecha, leyenda de que prevalece la hoja de respuestas, banda de ejemplos de marcado (N.º 7, 16 a 18, 27 y 28).
- **Controles de identificación:** nombre o registro obligatorio, qué es un repetido y qué hacer en cada caso (N.º 14 y 15).
- **Privacidad:** no subir tus datos al repositorio (N.º 13); los casos a revisar sin nombre ni registro (N.º 25).
- **Puntaje:** parcial, descuento entre 0 y 1, tres decimales, tratamiento de «marcar todas» (N.º 5, 22, 33 y 34).
- **Publicación:** vos autorizás cada fusión a `main` (N.º 12, 19, 22, 28 y 36).

## 7. Cifras y su origen (ítems 1 y 12)

| Cifra | Origen |
|---|---|
| 10 y 20 preguntas por examen; 4 o 5 opciones | Tu indicación (N.º 2) |
| 7 casilleros de registro; hoja A5 | Tu elección (N.º 7) |
| Sensibilidad normal 0,085 (alta 0,05; baja 0,16) | Calibración con seis fotos reales (según el resumen de contexto) |
| 0,33 como valor inicial del descuento | **Lo eligió la IA**, sin que dijeras un número |
| 32 preguntas con 5 opciones o 48 con 4 (hoja V4) | Cálculo de la app (README) |
| 115 pruebas automáticas, todas en verde | Corrida de `node tests/run.js` del 2026-11-08 con `npm install` hecho |
| USD 39,33 de uso de IA | Consulta de la sesión; **incluye trabajo ajeno a la herramienta** |
| Tiempo de corrección a mano | **SIN ORIGEN**: solo dijiste que «lleva mucho tiempo». Hay que medirlo |
| Unos 80 alumnos en el primer uso en serio | Tu indicación (N.º 47) |
| Corrección a mano: 4 a 5 minutos por examen | Tu estimación del 2026-11-09 («debo estar tardando entre 4 y 5 minutos por examen»), **sin cronometrar**; no consta si es para 10 o 20 preguntas |
| 11 fotos de la prueba con el selector de Drive; registros de 6 o 7 dígitos | Tu indicación (N.º 49 y 52) |
| Redibujo con 80 hojas: 561 ms → 17 ms | Medición de la IA en Node, no en un celular (Backlog METSI-7) |
| Exámenes por cuatrimestre | **NO CONSTA** |

## 8. Cumplimiento de los 12 ítems: qué hay y qué falta

| Ítem | Estado hoy | Evidencia en el material | Qué falta |
|---|---|---|---|
| 1 Problema real | Parcial | N.º 1, 2 y 47 (unos 80 alumnos) | Cuánto pesa en horas: hay que medir la corrección a mano |
| 2 Herramienta y costo | Parcial | N.º 6 y 8, lista de herramientas | Comparación con otra opción y costo real |
| 3 Instrucciones para el modelo (PEDIR) | **Cubierto con un equivalente** (confirmar la sigla) | `docs/informe/instrucciones-para-el-modelo.md`: dos pedidos de construcción reescritos con la consigna de siete partes de la clase 5, junto a los originales textuales y la comparación | PEDIR no aparece en las 16 clases del sitio; confirmar con el docente si es una sigla oral. Citar en el informe el pedido A (y el B si hay espacio) |
| 4 Datos o documentos | Parcial | N.º 2, 3, 6, 7; README | Qué queda afuera y por qué (por ejemplo, nombres y registros en los casos a revisar) |
| 5 Verificación con casos conocidos | Bien cubierto | N.º 13, 21, 23, 26, 29, 31, 32; 115 pruebas | Resolver la duda de la pregunta 8 (ver sección 9) |
| 6 Autonomía | Bien cubierto | N.º 4, 14, 25; README (el registro sugerido nunca se carga solo) | Redactarlo como tabla: hace sola / propone / aprueba una persona |
| 7 Construcción paso a paso | Parcial | N.º 9, 12, 16 a 19, 24, 27, 28, 35, 45, 47, 49; README y mapa de archivos | Falta redactar un paso a paso para que otra persona la rehaga |
| 8 Datos en tablas y diccionario | **Cubierto** (falta citarlo en el informe) | `docs/informe/diccionario-de-datos.md`: estado del examen, hoja, `resultados.csv`, `casos.json`, usuarios, reglas de validación y datos personales, con un ejemplo inventado | Resumirlo en la sección 4 del informe (tablas clave) y dejar el diccionario completo como anexo |
| 9 Instalación en la organización | Parcial | N.º 6, 8, 10 a 12, 19, 28, 36, 37, 38, 44, 46, 48, 53; README; `docs/guia-de-uso.md` | Quién la mantiene y cómo se capacita; costo de Supabase y Vercel |
| 10 Riesgos y datos personales | Parcial | N.º 7, 10, 13, 14, 17, 25, 37, 43, 51, 53 | Ley 25.326, quién responde si se equivoca, el acceso público de GitHub Pages (decisión pendiente con el profesor) |
| 11 Uso de IA declarado | Casi completo | Los tres archivos brutos (N.º 1 a 53) | El modelo de cada sesión y al menos un pedido con PEDIR |
| 12 Valor estimado | **Parcial** | `docs/informe/valor-y-costo.md`: tiempo manual declarado (4 a 5 min por examen, ~80 alumnos = 5 h 20 min a 6 h 40 min por turno), costos y beneficios, con su origen | Falta medir el tiempo con la herramienta, los turnos por año, las horas de armado y los planes de Vercel, Supabase y GitHub |

## 9. Pendientes y dudas a resolver antes de citar

1. **Pregunta 8 (N.º 21).** El bruto señala una diferencia: con la clave A, B, C, D, marcar las cinco opciones daría 0,75 y no 0; el 0 coincide con una clave B y C. Confirmá cuál era tu clave real antes de usar el caso como ejemplo.
2. **Backlog desactualizado.** METSI-6 (login) sigue «In Progress» con 4 de 6 criterios sin marcar, aunque dijiste que probaste y funciona (N.º 40). METSI-1 (calibrar) sigue en curso por falta de casos reales. Conviene cerrar o aclarar METSI-6 antes de entregar, con el comando `backlog` y no editando el archivo.
3. **Error de autenticación de Drive: resuelto (N.º 48).** Fue `origin_mismatch`: abrías la app desde la dirección de vista previa de una rama de Vercel, que no figuraba en los orígenes autorizados del ID de cliente de Google. Se resolvió probando en producción. Sirve de ejemplo en el informe de un error de configuración que no era de código.
4. **Umbral del «punto suelto»** (N.º 53): lo dejaste para revisar con ejemplos reales; va en limitaciones.
5. **La guía para Windows: guardada** en `docs/guia-windows.md` (recortada a METSI).
6. **Datos personales en el historial.** El bruto cuenta que se reescribió la historia de una rama por tu nombre y registro. Conviene que busques tu nombre y tu registro en todo el repositorio (`git log -p`, `tests/`, `docs/`) antes de entregar el `.zip`.
7. **Modelo y versión** de cada sesión: completar a mano.
8. **Tiempo de corrección a mano:** medirlo (por ejemplo, cronometrar la corrección manual de 20 hojas de prueba) y registrar el supuesto.
9. **Pedido con PEDIR** para el ítem 3.
10. **GitHub Pages sin login:** decidiste dejarlo publicado y consultar al profesor. Anotá su respuesta y, según lo que diga, ajustá la sección 7 del informe (Riesgos y controles).
11. **Capturas o video** con hojas inventadas, sin datos reales.
12. **Aviso de Google Cloud por la API key del selector de Drive** (proyecto `metsi-corrector`). Google detectó la clave en `js/config.js` del repositorio público (commit `6a92cc7`, «Cargar la API key pública del selector de Drive»). Es una clave que debe ser pública (corre en el navegador), así que lo que corresponde es **restringirla**, no esconderla. **Hecho el 2026-11-09 (confirmado con capturas de Google Cloud):** restricción de sitios web a `https://metsi-correcciones.vercel.app/*` y `https://jctonini.github.io/METSI/*`, y restricción de API a solo Google Picker API; la lista de credenciales muestra la clave con «URL de referencia HTTP, 1 API» (creada el 2026-11-08). **Prueba posterior (2026-11-09, captura de la app versión `e7cada98`):** el selector de Drive abre sin error con la clave ya restringida y la sincronización sigue en «Sincronizado con Drive ✔» (la captura no muestra desde cuál de las dos direcciones se probó). **Cronología (hora de Argentina, UTC-3):** commit con la clave el 2026-11-08 a las 17:06:37 (20:06:37 UTC, según git) y aviso de Google (remitente `noreply-google-cloud-compliance`) recibido ese mismo día a las 17:06 (según la captura del correo): Google la detectó a los pocos segundos (ver Cloud Logging, abajo). La clave se creó el 2026-11-08; la restricción se confirmó el 2026-11-09, así que estuvo expuesta sin restringir **como máximo unas 7 horas** (si la restringiste antes, menos; no consta). **Facturación (2026-11-09):** el proyecto `metsi-corrector` **no tiene cuenta de facturación vinculada**, por lo que no puede generar cargos; si se agotan las cuotas gratuitas, las llamadas fallan en vez de cobrarse. **Tráfico (2026-11-09, gráfico general de «APIs y servicios», UTC-3):** sin tráfico antes de las ~17:30 del 8 de noviembre ni durante la noche; un pico de ~0,07 solicitudes por segundo alrededor de las 17:40, que coincide con la prueba de 11 fotos desde Drive (17:44, según la sesión), y unos pocos puntos de errores y solicitudes más tarde. Sin picos anómalos visibles; **sin verificar** qué API es cada serie ni cuánto del tráfico usó la clave (falta mirar Picker API y Drive API agrupando por credencial). **Cloud Logging (2026-11-09):** la consulta `AbuseEvent` del proyecto, con rango del 2026-11-08 00:00 al 2026-11-09 00:45, devuelve **1 resultado**, alrededor de las 17:00 a 17:10 del 8 de noviembre (la hora del commit y del correo); no hay otros eventos de ese tipo en el rango (la carga seguía en curso al tomar la captura). **Detalle de la entrada (captura):** `2026-11-08 17:06:47.913`, `@type` `google.cloud.abuseevent.logging.v1.AbuseEvent`, `action: NOTIFY`, `detectionType: LEAKED_CREDENTIALS`: Google detectó la credencial a los **10 segundos** del commit (17:06:37) y solo **notificó** (no suspendió la clave ni el proyecto); es un evento de exposición, no de uso indebido. El resto del texto de la entrada no se veía en la captura. **Falta (opcional):** la vista por API y credencial en las métricas. Para el informe: sección 7 (riesgos) y registro de IA (el asistente recomendó restringirla antes de cargarla, N.º 48; la clave estuvo sin restringir, o no consta que lo estuviera, hasta este aviso).
