# Sección 7 · Riesgos y controles (borrador)

> **Fuente:** respuestas del autor del 2026-11-09 (confidencialidad, conservación, autorización y responsable), `diccionario-de-datos.md` §7, el README, `registro-ia.md` (pendiente 12, el aviso de Google) y la clase 13. Presupuesto: ~500 palabras. Esta sección responde el ítem 10. **No se afirma qué exige la Ley 25.326: hay que verificarla contra el texto oficial antes de citarla (marcado [VERIFICAR]).**

## Texto para el informe

**Datos personales (Ley 25.326).** La herramienta procesa datos de alumnos: nombre y apellido, número de registro, letra manuscrita (recortes de la foto), la foto completa de cada hoja, y puntajes asociados a cada alumno. Esos datos quedan en el **Google Drive del docente que sincroniza** y en el navegador del dispositivo; **no van a un servidor de la herramienta**. Supabase solo guarda el email y el rol de los docentes, y Vercel solo publica la app: ninguno de los dos recibe datos de alumnos. En este caso, la cuenta de Google que se usa es una **cuenta personal** del autor. **[VERIFICAR el texto de la ley y qué obligaciones aplican a este tratamiento: por ejemplo finalidad, seguridad, conservación y el uso de un proveedor como Google; consultar con la facultad]**

**Autorización.** La herramienta es una iniciativa del autor, **consultada con el titular de cátedra**. No consta una autorización formal de la facultad ni de la cátedra para guardar datos de alumnos en una cuenta personal de Google **[VALIDAR antes del primer uso en serio]**.

**Secreto profesional.** Las notas y los exámenes de los alumnos **son confidenciales** en la cátedra. Los controles que lo respaldan: la copia publicada en Vercel pide usuario y contraseña, con roles validados en el servidor; los datos solo se ven desde la cuenta de Google del docente (permiso mínimo `drive.file`); los «casos a revisar» que se mandan a analizar van sin nombre ni registro y con las fotos tapadas; y la lectura del registro corre en el navegador sin enviar imágenes a ningún servicio. **Limitación:** la copia de GitHub Pages abre sin login. No expone datos ya guardados (viven en cada navegador y en cada Drive), pero cualquiera con esa dirección puede usar la herramienta. La decisión de mantenerla así quedó pendiente de la respuesta del profesor de la diplomatura.

**Conservación.** Como existe la copia impresa de los exámenes, no hace falta guardar mucho tiempo la versión digital. El criterio del autor es **eliminar las fotos y los resultados del Drive una vez confirmado que las notas fueron subidas y firmadas por el titular de cátedra** **[VALIDAR si ya lo aplica; hoy no hay un borrado automático en la herramienta]**.

**Qué pasa si la herramienta se equivoca y quién responde.** La herramienta calcula el puntaje y marca lo dudoso (dígitos del registro, preguntas, fotos ilegibles), pero **nunca decide por sí sola**: el registro es una sugerencia que el docente confirma; no deja exportar hojas sin identificar; frena repetidos; y el criterio de aprobación lo aplica el docente en Excel. Si la lectura falla, se corrige a mano. **Responde el autor, como docente que corrige**; además, las notas las firma el titular de cátedra antes de subirlas.

**Incidente real, para mostrar el control.** La API key del selector de Drive quedó en un repositorio público y Google la detectó a los 10 segundos (`LEAKED_CREDENTIALS`, acción `NOTIFY`: solo notificó). Se restringió a los dos sitios de la app y solo a la API del selector; el proyecto de Google Cloud no tiene cuenta de facturación, así que no puede generar cargos, y el tráfico no mostró picos anómalos. La lección: una clave que debe ser pública se restringe **antes** de subirla.

**Riesgos abiertos:**
- GitHub Pages sin login (decisión pendiente con el profesor).
- **Planes gratuitos (clase 13):** Supabase pausa el proyecto tras una semana sin actividad (el login dejaría de funcionar hasta reactivarlo) y el plan Hobby de Vercel es para uso personal y no comercial **[VALIDAR si una cátedra califica]**.
- Al dar de baja a un usuario, su sesión vale hasta una hora; el token de sesión se guarda en una cookie que escribe el navegador.
- La nota libre de los casos a revisar y el nombre del archivo de la foto pueden contener datos personales si el docente los escribe.
- Datos de alumnos en una cuenta personal de Google, sin autorización formal y sin borrado automático.
- La lectura del registro **no está calibrada con hojas reales**; una lectura mal confirmada podría asignar una nota a otro alumno.

## Respuestas del autor que sustentan la sección (2026-11-09)

| Pregunta | Respuesta |
|---|---|
| ¿Las notas y los exámenes son confidenciales? | Sí, son confidenciales |
| ¿Cuánto tiempo conserva fotos y resultados? | «Teniendo la copia impresa, no necesito guardar demasiado tiempo la versión digital. Podría eliminarla una vez confirmado que las notas fueron subidas y firmadas por el titular de cátedra.» |
| ¿La cátedra o la facultad autorizó usar la herramienta con datos en su cuenta de Google? | «Es una iniciativa mía, que fue consultada con el titular de cátedra.» |
| Si la herramienta se equivoca, ¿quién responde? | Yo, como docente que corrige |
