# Anexo G · Incidente de la API key del selector de Drive (8 de noviembre de 2026)

> **Qué es:** la cronología y la evidencia del aviso de Google sobre una clave de API que quedó en el repositorio público. Se usa como ejemplo de riesgo y de control en la sección 7 del informe. Toda la evidencia sale de capturas de Google Cloud, del correo de aviso y del historial de git; la clave no se reproduce.

## Resumen
La clave de API que usa el selector de Google Drive (Google Picker) tiene que viajar en la página, así que **es pública por diseño**. Quedó cargada en `js/config.js` del repositorio público y Google la detectó **10 segundos después** del commit. El evento fue solo una notificación (`NOTIFY`): no suspendió la clave ni el proyecto. La clave se restringió a los dos sitios de la app y a una sola API, y el proyecto no tiene cuenta de facturación, así que no puede generar cargos.

## Cronología (hora de Argentina, UTC-3)
| Cuándo | Qué pasó | Evidencia |
|---|---|---|
| 2026-11-08 | Se crea la clave («Clave de API 1») | Lista de credenciales de Google Cloud |
| 2026-11-08 17:06:37 | El commit `6a92cc7` («Cargar la API key pública del selector de Drive») sube la clave a `js/config.js` (20:06:37 UTC) | `git log` |
| 2026-11-08 17:06:47 | Cloud Logging registra un único evento `AbuseEvent`, con `action: NOTIFY` y `detectionType: LEAKED_CREDENTIALS`: 10 segundos después del commit | Captura del Explorador de registros |
| 2026-11-08 17:06 | Llega el correo de Google («tiene claves de las APIs de Google a las que se puede acceder públicamente») | Captura del correo; remitente `noreply-google-cloud-compliance` |
| 2026-11-09 | La clave aparece restringida: sitios web `https://metsi-correcciones.vercel.app/*` y `https://jctonini.github.io/METSI/*`, y solo **Google Picker API** | Capturas de las restricciones y de la lista («URL de referencia HTTP, 1 API») |
| 2026-11-09 | El selector de Drive abre sin error con la clave restringida (app versión `e7cada98`) | Captura de la app |

**Ventana de exposición sin restringir:** como máximo unas 7 horas (la restricción se confirmó el 9 de noviembre; si se hizo antes, fue menos, pero no consta cuándo).

## Qué se verificó
| Verificación | Resultado |
|---|---|
| Facturación | El proyecto `metsi-corrector` **no tiene cuenta de facturación**: no puede generar cargos. Si se agotan las cuotas gratuitas, las llamadas fallan, no se cobran |
| Tráfico (gráfico general de «APIs y servicios») | Sin tráfico antes de las ~17:30 del 8 de noviembre ni durante la noche; un pico de ~0,07 solicitudes por segundo hacia las 17:40, que coincide con la prueba de 11 fotos desde Drive, y unos pocos puntos de errores y solicitudes más tarde. **Sin picos anómalos visibles** |
| Cloud Logging | **1 solo evento** de ese tipo entre el 8/11 00:00 y el 9/11 00:45, a la hora del commit |
| Tráfico por API y por credencial | **Sin verificar** (opcional): falta ver las métricas de Picker API y Drive API agrupadas por credencial |

## Qué enseña
- **Una clave pública se detecta en segundos:** hay que **restringirla antes de subirla**, no después. El asistente lo había recomendado antes de cargarla (registro de IA, N.º 48); no consta si la restricción estaba hecha a tiempo.
- **Restringir es lo que protege, no esconder:** regenerar la clave no borra la vieja del historial de git.
- **El control económico fue indirecto:** el proyecto sin facturación acotó el daño posible a un abuso de cuota.

## Referencias
Registro de IA: N.º 48 (configuración del selector), N.º 61 a 63 (aviso, restricción y revisión de la consola). Sección 7 del informe.
