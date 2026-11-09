# Esqueleto del informe · Trabajo final integrador

> **Cómo usar este archivo.** Es un borrador por sección, en primera persona, listo para pasar a un procesador de texto. El texto está escrito solo con hechos documentados en el repositorio (cada sección cita de dónde sale). Donde falta un dato que solo vos tenés, figura **[COMPLETAR]**. Donde algo es una suposición tuya a validar, figura **[VALIDAR]**. **Nada de lo que está entre corchetes debe quedar en el PDF final.**
>
> **Formato exigido (consigna §4):** PDF de hasta **12 páginas sin contar anexos**, Arial o Calibri 11, interlineado 1,5. Con esa tipografía entran unas 330 a 380 palabras por página, así que el cuerpo tiene unas **4.000 a 4.400 palabras**. Los presupuestos de abajo son aproximados: verificalo al maquetar.
>
> **Nombres de archivo (consigna §8):** `Apellido_Nombre_TF_Informe.pdf` y `Apellido_Nombre_TF_Solucion.zip`. **Camino A (funcional).**

---

## Portada
- Título: «METSI Corrector: corrección asistida de exámenes multiple choice en papel»
- Diplomatura en IA Aplicada a Entornos Digitales de Gestión · FCEUBA · Comisión de los martes 2026
- Autor: **[COMPLETAR nombre y apellido]** (trabajo individual)
- Camino A · Fecha de entrega: 11 de diciembre de 2026
- Enlace a la solución: `https://metsi-correcciones.vercel.app` (requiere usuario; ver «Acceso para la corrección») y copia sin login en `https://jctonini.github.io/METSI/`; repositorio: `https://github.com/jctonini/METSI`
- **Acceso para la corrección [COMPLETAR]:** la copia de Vercel pide usuario y contraseña. Definí si creás un usuario de prueba para el equipo docente (con datos inventados) o si indicás la copia sin login, y decí cuál. **Nunca pegues una contraseña real en el informe.**
- Enlace al video o a las cinco capturas: **[COMPLETAR]**

---

## 1. El problema · presupuesto ~350 palabras
*Fuentes: `registro-ia-bruto.md` N.º 1, 2 y 47; `valor-y-costo.md`.*

> **Elegí este problema porque** soy docente de la materia METSI **[COMPLETAR nombre completo de la materia y la cátedra]** y los exámenes son en papel, multiple choice, y corregirlos me lleva mucho tiempo.

- **Quién lo sufre:** el docente que corrige. **[VALIDAR si también querés mencionar a los alumnos esperando la nota]**
- **Cuánto pesa hoy:** unos **80 alumnos** en el primer uso en serio (dato tuyo, 2026-11-08). La corrección a mano me lleva, según mi estimación **sin cronometrar**, **entre 4 y 5 minutos por examen**, es decir, entre **5 h 20 min y 6 h 40 min** por turno de 80. **[COMPLETAR el 18/11 con la medición real y si los 4 a 5 minutos son para 10 o 20 preguntas]**
- **Variantes del examen:** 10 preguntas el primer parcial y 20 el segundo; 4 o 5 opciones; puede haber varias respuestas correctas por pregunta; dos modalidades de cursada (Presencial y A distancia).
- **Errores:** **[COMPLETAR si tenés algún dato de errores de cálculo a mano; si no, decí que no se midieron]**
- **Qué pasa si no se resuelve:** **[COMPLETAR en una o dos frases]**

## 2. La situación actual · presupuesto ~350 palabras
*Fuente: respuestas del autor del 2026-11-09. Texto completo y tabla «hoy / propuesto» en `seccion-02-situacion-actual.md`.*

Hoy corrijo los exámenes completamente a mano, y no examen por examen sino por lotes. El proceso, paso por paso:
1. Los alumnos rinden en papel. Marcan sus respuestas directamente en el examen impreso, de cuatro carillas, y anotan nombre, número de registro y modalidad de cursada.
2. Corrijo por carillas, con la clave impresa: primero todas las carillas 4 de todos los exámenes, después volteo la pila y sigo con la 3, luego la 2 y por último la 1. El puntaje de cada pregunta se reparte entre las respuestas correctas, se reconoce puntaje parcial y en el cálculo entran también las incorrectas (si en una pregunta de dos correctas marcó una correcta y una incorrecta, le doy solo el puntaje de la correcta) **[COMPLETAR otros casos]**.
3. Sumo los puntos examen por examen, juntando las cuatro carillas, y anoto la nota en el frente.
4. Ordeno todos los exámenes por número de registro, de menor a mayor.
5. Paso las notas a una planilla de Excel y verifico contra el listado de inscriptos que estén todos, que no haya repetidos y que ninguno haya quedado sin identificar.
6. Comparto las notas con los alumnos.
7. Subo las notas a MiEcon, la web de la facultad.
8. Aplico el criterio de aprobación sobre la planilla **[VALIDAR en qué momento]**.

Como el trabajo es por lotes, el tiempo por examen no se mide directamente: se obtiene haciendo todo el proceso para el conjunto y dividiendo por la cantidad. No lo cronometré; mi estimación, sin medir, es de entre 4 y 5 minutos por examen, con unos 80 alumnos por turno **[COMPLETAR si se mide el 18/11]**.

Incluir un **diagrama del proceso de hoy** y otro del propuesto; la tabla «Paso / Hoy / Con METSI Corrector» de `seccion-02-situacion-actual.md` es el insumo. **Sigue igual con la herramienta:** compartir las notas, MiEcon y el control contra el listado de inscriptos.

## 3. La solución · presupuesto ~500 palabras
*Fuentes: `README.md`, `diccionario-de-datos.md`, `registro-ia-bruto.md` N.º 2 a 7, 14 y 51.*

**Qué hace.** Es una app web que corrige exámenes multiple choice en papel a partir de la foto de una hoja de respuestas A5, que el alumno completa con birome. Lee las respuestas marcadas y la modalidad, calcula el puntaje (con puntaje parcial y un descuento configurable por respuesta incorrecta), controla la identificación y los repetidos, y exporta un CSV para Excel o Google Sheets. Se usa desde el navegador del celular o de la PC y sincroniza con el Google Drive del docente.

**Para quién.** Docentes. En la copia publicada en Vercel el acceso es con usuario y contraseña, con rol de administrador y de docente.

**Qué cambia en el proceso.** En lugar de corregir cada examen a mano, el docente fotografía las hojas, revisa lo que la app marca como dudoso, confirma identificaciones y descarga el resultado. **[COMPLETAR el 18/11 con cuánto cambia el tiempo]**

**Nivel de autonomía** (ítem 6 de la lista de cumplimiento):

| La solución hace sola | La solución propone | Lo aprueba o decide una persona |
|---|---|---|
| Leer las marcas de respuesta y la modalidad | Un número de registro leído de los casilleros (red neuronal que corre en el navegador), siempre como sugerencia | Confirmar o corregir el registro; escribir el nombre |
| Calcular el puntaje de cada pregunta y el total | Marcar como dudosas respuestas, dígitos o fotos | Revisar y corregir lo dudoso |
| Detectar hojas sin nombre ni registro y bloquear la exportación | Avisar de posibles repetidos (mismo registro o mismo nombre) | Resolver cada repetido: personas distintas, misma hoja o dato a corregir |
| Avisar si se cargó dos veces la misma foto o el mismo papel | — | Decidir si se carga igual |
| — | — | **Decidir quién aprueba**: la app solo calcula el puntaje |
| — | — | Autorizar publicar y administrar usuarios |

## 4. Cómo se construyó · presupuesto ~700 palabras
*Fuentes: `README.md` (mapa de archivos), `diccionario-de-datos.md`, `registro-ia.md` §2.*

**Herramientas y por qué esas.** Claude Code (asistente de IA que escribió el código y corrió las pruebas), GitHub (repositorio y GitHub Pages), Vercel (publicación con login), Supabase (usuarios y roles), Google Drive y Google Picker (sincronización y carga de fotos desde Drive), Backlog.md (gestión de tareas). **[COMPLETAR por qué cada una y frente a qué alternativa; por ejemplo, planilla de Google con Apps Script frente a una app web que lee fotos en el navegador]** Esto responde el ítem 2.

**Estructura de la solución.** Todo el código vive en un repositorio. Resumen del mapa de archivos (`README.md`): lectura de la foto (`js/scanner.js`, `js/layout.js`, `js/sheet.js`), puntaje (`js/scoring.js`), identificación y repetidos (`js/identity.js`, `js/similar.js`), casos a revisar (`js/review.js`), exportación (`js/csv.js`), Drive y sesión (`js/drive.js`, `js/auth.js`, `js/picker.js`), lectura local del registro (`js/digits.js`, `js/digit-model.js`), interfaz (`js/app-*.js`), servidor del login (`api/`, `server/`).

**Los datos y su diccionario.** Resumen en una tabla (estado del examen, hoja corregida, `resultados.csv`) y el diccionario completo en el Anexo B (`diccionario-de-datos.md`). Qué datos usa, de dónde salen y qué queda afuera: usa fotos de hojas, la clave de respuestas y datos de identificación que carga el docente; la lectura del registro nunca envía imágenes a servicios externos; los casos que se mandan a analizar van sin nombre, registro ni recortes. **[COMPLETAR qué queda afuera y por qué, por ejemplo: la app no decide aprobación y no guarda datos en un servidor propio]**

**Cómo se construyó, paso por paso** (ítem 7), en orden cronológico según el registro de IA:
1. Idea y diseño de la hoja (1 de octubre): grilla A5, 7 casilleros de registro, puntaje parcial.
2. Sincronización con Drive y publicación (1 de octubre).
3. Primeras pruebas con hojas reales, identificación obligatoria y control de repetidos (2 de octubre).
4. Hojas V3 y V4, banderas de casos dudosos y regla de puntaje de «marcar todas» (24 de octubre).
5. Backlog.md, reintentos de Drive y módulos (1 de noviembre).
6. Login con usuario y contraseña (7 de noviembre).
7. Selector de Drive, selección múltiple y lectura local del registro (8 de noviembre).

**Instalación en la organización** (ítem 9): quién la usa, quién la mantiene y cómo se capacita. Hay una guía de uso (`docs/guia-de-uso.md`) y una guía de instalación para Windows (`docs/guia-windows.md`). **[COMPLETAR quién la mantiene y cómo se capacita a otros docentes]**

## 5. Registro de uso de IA · presupuesto ~600 palabras
*Fuentes: `registro-ia.md`, `registro-ia-bruto*.md` (N.º 1 a 53), `instrucciones-para-el-modelo.md`.*

- **Herramientas:** Claude Code (sesiones en la nube) con **Claude Sonnet 5.5, esfuerzo medio, en todas las sesiones** (verificado el 2026-11-09). Servidores de GitHub y Google Drive del asistente.
- **Pedidos principales copiados textualmente:** elegí 8 y copialos en este apartado, con el resto en el Anexo C. Propuestos: N.º 1, 3 y 4, 7, 13, 21 y 22, 23 y 24, 25, 30 a 35, 51 (ver `registro-ia.md` §3).
- **Instrucciones armadas con la consigna de siete partes de la clase 5** (equivalente de PEDIR **[confirmar]**): el Pedido A y el Pedido B de `instrucciones-para-el-modelo.md`, con la aclaración de que son una reescritura y no los pedidos usados.
- **Qué tuve que corregir:** la lectura de hojas reales (orientación, cruces finas, hojas con muchas marcas, hoja vecina en la foto), la regla de puntaje de «marcar todas» (un primer criterio daba resultados raros y otro daba 0 con 4 correctas de 5), el selector de Drive que abría en una carpeta que no era la raíz, y el README que decía que solo se publicaba en Vercel.
- **Qué inventó o erró el asistente:** usó mis datos reales como ejemplo de prueba (N.º 13); indicó un paso de Vercel que no existía (N.º 39); un commit con una prueba fallando (N.º 30); propuso mostrar «?» en registros de 6 dígitos (N.º 52); propuso enviar recortes de letra a la API de un modelo (N.º 51). **[COMPLETAR si recordás otras]**
- **Decisiones que no le delegué:** que la app no decida quién aprueba, el puntaje parcial, la identificación obligatoria y qué es un repetido, no enviar imágenes a servicios externos, restringir y probar en producción, dejar GitHub Pages abierto hasta consultar al profesor.
- **Cifras y normas:** cada cifra de este informe tiene su origen en el diccionario o en `valor-y-costo.md`. **La cita de la Ley 25.326 hay que verificarla contra el texto oficial antes de ponerla.**

## 6. Pruebas · presupuesto ~600 palabras
*Fuentes: `README.md`, `registro-ia-bruto*.md` (N.º 13, 20, 21, 23, 26, 29 a 32, 39, 41, 49, 52), `diccionario-de-datos.md` §4.*

- **Pruebas automáticas:** `node tests/run.js`, **115 pruebas, todas en verde** (corrida del 2026-11-08, con `npm install` hecho). Cubren puntaje, lectura de fotos sintéticas de hojas V1 a V4, dígitos, identificación, CSV, combinación de datos, reintentos, Drive simulado y acceso.
- **Casos con respuesta conocida del puntaje** (clave: P1 → A; P2 → B; P3 → C y D; 1 punto cada una; descuento 0,33): A, B, CD → 3; A, BC, C → 2,17; B, B, ACD → 1,835. Calculados con la función `scoreSheet`.
- **Caso real de la pregunta 8 (N.º 21 y 22):** marcar todas las opciones no debía dar 0 cuando hay varias correctas. **[CONFIRMAR la clave real de esa pregunta antes de citar el valor: con A, B, C, D marcando las cinco daría 0,75 y no 0]**
- **Casos que tienen que fallar:** hoja sin nombre ni registro (no deja exportar), mismo registro en dos hojas (frena), mismo nombre con registro faltante (frena), mismo nombre con registros distintos (solo avisa), misma foto cargada dos veces (avisa), foto con una versión de hoja más nueva que la app (avisa), guardado local lleno (aviso persistente), docente que intenta administrar usuarios (rechazado en el servidor).
- **Pruebas con hojas reales:** fallas detectadas el 2 y el 24 de octubre y cómo se corrigieron.
- **Probar desde cero con otra cuenta** (consigna §8): **[COMPLETAR quién y cuándo]**. **Mostrárselo a alguien que no sepa del tema y anotar qué entendió y qué cambiaste:** **[COMPLETAR]**.
- **Medición con el examen del 18 de noviembre:** **[COMPLETAR resultados y la precisión real de la lectura del registro]**.
- **Limitaciones honestas:** la lectura del registro se midió con dígitos de MNIST sobre fotos sintéticas (cerca del 99 %), una prueba optimista; con hojas reales no está calibrada (tarea METSI-1 abierta). El umbral de «punto suelto» se dejó para revisar con ejemplos reales.

## 7. Riesgos y controles · presupuesto ~500 palabras
*Fuentes: `diccionario-de-datos.md` §7, `registro-ia.md` §9 (pendientes 12), tarea METSI-6.*

- **Datos personales (Ley 25.326):** la app procesa nombre, registro, letra manuscrita y fotos de hojas de alumnos. Quedan en el Google Drive de quien sincroniza, no en un servidor de la app; Supabase solo guarda email y rol de los docentes. **[COMPLETAR cómo se cumplen las obligaciones aplicables, tras verificar el texto de la ley]**
- **Controles:** lectura del registro dentro del navegador (ninguna imagen sale del dispositivo); casos a revisar sin nombre ni registro y con fotos tapadas; acceso con usuario y contraseña con roles validados en el servidor; permiso mínimo de Drive (`drive.file`).
- **Secreto profesional:** **[COMPLETAR si aplica a las calificaciones y a quién tiene acceso]**.
- **Qué pasa si se equivoca y quién responde:** la app solo calcula el puntaje; el docente revisa lo dudoso, confirma el registro y decide la aprobación. Si la lectura falla, la hoja queda marcada y se corrige a mano. **Responde el docente.** **[VALIDAR la redacción]**
- **Incidente real, para mostrar el control:** la API key del selector de Drive quedó en un repositorio público y Google la detectó a los 10 segundos (`LEAKED_CREDENTIALS`, solo notificó). Se restringió a los dos sitios de la app y solo a la API del selector; el proyecto no tiene facturación, así que no puede generar cargos. Cronología y evidencia en `registro-ia.md` (pendiente 12).
- **Riesgos abiertos:** GitHub Pages sigue publicado **sin login** (decisión pendiente con el profesor); al dar de baja a un usuario su sesión vale hasta una hora; el token de sesión se guarda en una cookie que escribe el navegador; la nota libre de «casos a revisar» y el nombre del archivo de la foto pueden contener datos personales.

## 8. Valor y costo · presupuesto ~350 palabras
*Fuente: `valor-y-costo.md`.*

- **Valor:** tiempo de corrección. Con 80 alumnos y 4 a 5 minutos por examen (estimación), un turno consume 5 h 20 min a 6 h 40 min a mano. **[COMPLETAR el 18/11: tiempo por hoja con la herramienta, ahorro por turno y turnos por año]**
- **Beneficios no medidos en minutos:** criterio de puntaje uniforme, control de identificación y repetidos, trazabilidad con la foto de cada hoja.
- **Costo:** licencias, horas de armado y mantenimiento. Google Cloud sin facturación (USD 0); uso de IA hasta USD 56,13 en las cinco sesiones de desarrollo (cota superior: incluye trabajo ajeno a la herramienta; USD 7,24 en las tres que solo la tocan). **[COMPLETAR planes de GitHub, Vercel y Supabase, horas de armado y mantenimiento]**
- **Todas las cifras con su origen y sus supuestos a la vista.** Las hipótesis de sensibilidad de `valor-y-costo.md` **no** se citan como resultados.

## 9. Conclusiones y próximos pasos · presupuesto ~300 palabras
- **Lo que aprendí:** **[COMPLETAR en tus palabras]**. Ideas con respaldo documentado: lo que no se escribe en un pedido, el asistente lo completa con lo más probable (restricción de privacidad y registros de 6 o 7 dígitos); una clave pública se detecta en segundos, así que se restringe antes de subirla; los casos de prueba con respuesta conocida detectaron errores que el asistente no vio.
- **Limitaciones:** lectura del registro sin calibrar con hojas reales; la herramienta lee el nombre solo como recorte (se escribe a mano); GitHub Pages sin login; costos y tiempos sin medir hasta el 18 de noviembre.
- **Qué haría después:** calibrar con hojas reales (METSI-1), cerrar la restricción de GitHub Pages según lo que diga el profesor, sumar las reglas del proyecto al `CLAUDE.md`, y medir el ahorro en más de un turno.
- **¿Conviene?** **[COMPLETAR según la medición del 18/11; si no conviene, decilo: es un resultado válido]**.

## 10. Fuentes · presupuesto ~150 palabras
- Consigna del trabajo final, Diplomatura en IA Aplicada a Entornos Digitales de Gestión, comisión de los martes 2026.
- Clase 5, «El arte de pedir bien: contexto e instrucciones», `diploiafceuba.vercel.app/05`, consultada el 2026-11-09. Clases 12 y 13, `diploiafceuba.vercel.app/12` y `/13`, consultadas el 2026-11-09.
- Backlog.md (MrLesk/Backlog.md, GitHub). **[COMPLETAR fecha de consulta; el asistente la consultó el 2026-11-01]**
- Aviso de Google Cloud sobre la clave pública, recibido el 2026-11-08.
- Ley 25.326 de Protección de los Datos Personales. **[VERIFICAR el texto oficial y la fecha de consulta antes de citar]**
- Documentación de Google Picker y Drive API, Supabase y Vercel: **[COMPLETAR solo las que cites, con fecha de consulta]**.

---

## Anexos (no cuentan para las 12 páginas)

### Anexo A · Cumplimiento de los 12 ítems (consigna §5)
*Indicá en qué sección se trabaja cada uno. Estado según `registro-ia.md` al 2026-11-09.*

| # | Ítem | Sección | Estado | Qué falta |
|---|---|---|---|---|
| 1 | Problema real, quién lo sufre y cuánto pesa | 1 | Parcial | Medición del 18/11 y el peso en horas |
| 2 | Herramienta justificada frente a otra, con costo | 4 y 8 | Parcial | Comparación y costos reales |
| 3 | Instrucciones armadas con PEDIR o equivalente | 5 y Anexo D | Cubierto con equivalente | Confirmar la sigla PEDIR |
| 4 | Datos o documentos que usa y qué queda afuera | 4 y Anexo B | Parcial | Qué queda afuera y por qué |
| 5 | Verificación con casos de respuesta conocida | 6 | Cubierto | Confirmar la pregunta 8; resultados del 18/11 |
| 6 | Nivel de autonomía | 3 | Cubierto | — |
| 7 | Construcción paso por paso | 4 | Parcial | Paso a paso para que otro la rehaga |
| 8 | Datos en tablas con diccionario | Anexo B | Cubierto | Resumirlo en la sección 4 |
| 9 | Instalación: quién usa, mantiene y capacita | 4 | Parcial | Mantenimiento y capacitación |
| 10 | Riesgos, datos personales, secreto profesional, responsable | 7 | Parcial | Ley 25.326, secreto profesional |
| 11 | Uso de IA declarado con pedidos textuales | 5 y Anexo C | Cubierto | Elegir los pedidos para el cuerpo |
| 12 | Valor estimado con supuestos y conclusión | 8 | Parcial | Medición, planes y horas de armado |

### Anexo B · Diccionario de datos → `diccionario-de-datos.md`
### Anexo C · Pedidos textuales → `anexo-c-pedidos-textuales.md` (los 17 pedidos principales completos, más el índice de los 53); el texto de todos está en `registro-ia-bruto.md`, `registro-ia-bruto-login.md` y `registro-ia-bruto-noviembre.md`
### Anexo D · Instrucciones con la consigna de siete partes → `instrucciones-para-el-modelo.md`
### Anexo E · Evidencia de que funciona
Video de hasta 3 minutos (enlace en el informe) **o** cinco capturas comentadas, **solo con datos inventados** y sin nombres de carpetas ni emails personales. **[COMPLETAR]**

---

## Lista de verificación antes de entregar (consigna §8)
- [ ] Abrir la solución con otra cuenta (o pedirle a alguien) y probarla desde cero con datos de ejemplo.
- [ ] Mostrarla a alguien que no sepa del tema y anotar qué entendió y qué cambiaste.
- [ ] Revisar que las cifras del informe coincidan con las de la solución (115 pruebas, 4 a 5 minutos, 80 alumnos, USD 56,13).
- [ ] Completar el Anexo A.
- [ ] Verificar que no quede ningún dato real de personas, ni en los datos ni en las capturas ni en el historial del repositorio (buscá tu nombre y tu registro en todo el repo).
- [ ] Nombrar los archivos como pide la consigna y armar el `.zip` con la carpeta del proyecto.
- [ ] Ninguna clave ni contraseña en el informe ni en el `.zip` (el `.zip` no debe incluir `node_modules`).
