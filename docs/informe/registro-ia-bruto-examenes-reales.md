# Registro de uso de IA (bruto) · Lectura con exámenes reales (18 y 19 de noviembre de 2026)

Continúa `registro-ia-bruto.md` (N.º 1 a 36), `registro-ia-bruto-login.md` (N.º 37 a 43), `registro-ia-bruto-noviembre.md` (N.º 44 a 53) y `registro-ia-bruto-sesion-informe.md` (N.º 54 a 80). Cubre la sesión **«Revisión de 15 exámenes reales»** de Claude Code (Claude Sonnet 5.5, `claude-sonnet-5-5`), en la que usé la herramienta con exámenes reales y el asistente corrigió la lectura de la hoja (METSI-13 a METSI-22).

## Cómo leer este archivo
- **Origen del texto:** los mensajes del autor se copiaron del historial de la sesión (leído con la herramienta de sesiones de Claude Code, no retipeado). Las horas son UTC (en la Argentina, UTC-3). Se omitieron los avisos automáticos de tareas y los mensajes de la herramienta que pedían commit y push. Las respuestas del docente a las cuatro preguntas de decisión que el asistente le hizo el 18/11 a las 22:54 se dieron por la interfaz de preguntas y no quedaron como texto en el historial.
- **Lo que escribe el asistente** en «Qué hizo la IA» y «Qué hubo que corregir» es el resumen de lo que dijo en el chat; contrastable con el historial de git (METSI-13 a METSI-22) y con `backlog/`. **Lo que no se verificó:** el despliegue en Vercel y GitHub Pages, el celular y el selector de Google real (METSI-15); todo se probó con Chromium sin pantalla en el servidor.
- **Datos personales:** las fotos originales (con nombre y registro) se bajaron de Drive solo para diagnosticar y no se subieron al repositorio. Las hojas quedaron como pruebas permanentes **sin nombres ni registros**.
- **Mensaje N.º 84:** el texto es un resumen fiel de los siete puntos del original, no una copia literal.

---

### N.º 81 · 2026-11-18 22:49 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > Acabo de utilizar la herramienta con 15 exámenes reales, en todos hubo casos de correcciones, problemas de reconocimiento, etc. Podes revisar todo lo que marque para revisar y hacer las correcciones? Anda preguntandome lo que necesites
- **Qué hizo la IA:** Leyó `AGENTS.md` y Backlog, y buscó en Drive los casos a revisar (15 casos, 269 preguntas). Con el umbral de sensibilidad de entonces (0,085) midió 75 errores de lectura; con 0,16, 6.
- **Qué hubo que corregir / qué erró la IA:** Los casos no estaban en el repositorio (a propósito: no llevan datos de alumnos); hubo que buscarlos en Drive.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 1, 5, 11

### N.º 82 · 2026-11-18 22:52 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > usa las imagenes reales de los examenes que fueron subidas al drive ahi tenes los nombres y los registros sin tachar
- **Qué hizo la IA:** Bajó las 14 fotos completas solo para diagnosticar (no al repositorio). Encontró el recorte del nombre mal ubicado, los casilleros del registro corridos (cortaban el 9), la modalidad con ⊗ o tilde sin reconocer y una hoja con grampa sobre la esquina. Creó METSI-13 y trabajó por partes.
- **Qué hubo que corregir / qué erró la IA:** NO CONSTA
- **Sección del informe donde encaja:** 6 Pruebas y 7 Riesgos
- **Ítem(s):** 5, 10

### N.º 83 · 2026-11-18 23:05 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > necesitas mi ayuda?
- **Qué hizo la IA:** Dijo que no por ahora. Resumió: sensibilidad 0,16, 75 a 6 errores de 269 preguntas, 117 pruebas en verde.
- **Qué hubo que corregir / qué erró la IA:** Las cifras resultaron optimistas (ver N.º 89).
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 84 · 2026-11-18 23:15 UTC · Claude Code
- **Etapa:** construcción
- **Pedido (textual, mensajes consecutivos):**
  > Mientras tanto te dejo un poco de feedback para trabajarlo luego:
  >
  > (1) Corregir hojas: cada vez que Drive sincroniza se pierde el foco y lo escrito; (2) al elegir Drive vuelve siempre al home y no a la última carpeta; (3) en la solapa Drive poder editar el nombre de las carpetas; (4) Examen: poder importar cantidad de preguntas, de respuestas, respuestas correctas, puntaje y penalización; (5) skill que arma exámenes: exportar lo mismo (mismo archivo y proceso); (6) Corregir: poder agregar comentarios (ej. «corregida a mano»); (7) Corregir: abrir una carpeta de Drive en pestaña nueva. [resumen de los siete puntos del mensaje original; el texto exacto está en el historial de la sesión]
- **Qué hizo la IA:** Los registró como METSI-14 a METSI-18 sin implementarlos todavía. Mientras tanto siguió con el lector de dígitos: 88,1 % a 94,0 % por dígito en la validación cruzada de 84 dígitos.
- **Qué hubo que corregir / qué erró la IA:** NO CONSTA
- **Sección del informe donde encaja:** 3 La solución
- **Ítem(s):** 6, 7

### N.º 85 · 2026-11-18 23:17 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > tengo otros 56 exámenes esperando para ser procesados/corregidos!
- **Qué hizo la IA:** Subió el avance a la rama de trabajo (no a `main`) y advirtió que en hojas nuevas esperaba ~94 % de dígitos y «~7 de cada 10» registros completos.
- **Qué hubo que corregir / qué erró la IA:** Esa cifra era una cuenta propia, no una medición (ver N.º 89).
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 86 · 2026-11-18 23:19 UTC · Claude Code
- **Etapa:** construcción
- **Pedido (textual):**
  > Quiero que primero trabajes en el feedback que te pase
- **Qué hizo la IA:** Implementó METSI-14 (foco y texto al sincronizar; probado en Chromium), METSI-15 (selector de Drive en la última carpeta; **no probado con Google real**), METSI-16 (renombrar carpetas; con Drive simulado), METSI-18 (comentario por hoja, última columna del CSV; abrir carpetas de Drive en pestaña nueva) y METSI-17 (importar y exportar el examen en JSON). 121 pruebas.
- **Qué hubo que corregir / qué erró la IA:** NO CONSTA
- **Sección del informe donde encaja:** 3 La solución
- **Ítem(s):** 6, 7

### N.º 87 · 2026-11-18 23:33 UTC · Claude Code
- **Etapa:** construcción
- **Pedido (textual):**
  > por que no podes acceder al skill de armado de examenes?
- **Qué hizo la IA:** Reconoció que no había intentado acceder y abrió la skill `ism-parcial-builder`.
- **Qué hubo que corregir / qué erró la IA:** Había afirmado que no podía acceder a la skill sin haberlo intentado.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 6, 11

### N.º 88 · 2026-11-18 23:34 UTC · Claude Code
- **Etapa:** construcción
- **Pedido (textual):**
  > se llama ISM-Parcial builder
- **Qué hizo la IA:** Cerró METSI-17: `scripts/export_metsi_exam.py` y una sección en `SKILL.md` en la copia local (copia de respaldo en `docs/skill-examenes/`). No probado con un examen real armado por la skill (necesita LibreOffice).
- **Qué hubo que corregir / qué erró la IA:** NO CONSTA
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 6

### N.º 89 · 2026-11-18 23:36 UTC · Claude Code
- **Etapa:** riesgos
- **Pedido (textual):**
  > me preocupa que digas cosas que no son ciertas.
- **Qué hizo la IA:** Auditó sus propias afirmaciones y reconoció cinco: (1) «no pude acceder a la skill» era falso; (2) el 94 % venía de otra configuración de entrenamiento y los «7 de 10» eran una cuenta propia; (3) «75 a 6 errores» era optimista: el umbral se eligió sobre las mismas hojas y la «verdad» de las preguntas no corregidas la daba la propia app; (4) con la sensibilidad Normal una cruz fina en foto borrosa ya no se lee, y había relajado una prueba para tolerar 6 errores; (5) «navegador real» era Chromium sin pantalla en el servidor, no un celular ni Vercel. Ofreció validar el modelo instalado.
- **Qué hubo que corregir / qué erró la IA:** Cifras de validación sobrestimadas y una afirmación falsa sobre sus propias capacidades; las detecté yo.
- **Sección del informe donde encaja:** 5 Registro de IA y 6 Pruebas
- **Ítem(s):** 5, 10, 11

### N.º 90 · 2026-11-18 23:38 UTC · Claude Code
- **Etapa:** construcción
- **Pedido (textual):**
  > La skill original en claude.ai sigue sin el cambio. Hace los cambios que tengas que hacer.
- **Qué hizo la IA:** Buscó una herramienta para modificar skills de claude.ai: no hay. Entregó `ISM-Parcial-builder.zip` con los pasos para subirlo (Configuración, Capacidades, Skills).
- **Qué hubo que corregir / qué erró la IA:** NO CONSTA. Subir la skill quedó a mi cargo.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 6

### N.º 91 · 2026-11-18 23:38 UTC · Claude Code
- **Etapa:** despliegue
- **Pedido (textual):**
  > Si fusiona a main
- **Qué hizo la IA:** Fusionó a `main` (121 pruebas en verde sobre el resultado). No verificó el despliegue en Vercel ni en GitHub Pages.
- **Qué hubo que corregir / qué erró la IA:** NO CONSTA
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 9

### N.º 92 · 2026-11-18 23:40 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > Hace las validaciones que tengas que hacer.
- **Qué hizo la IA:** Validación cruzada por hoja con la configuración final, agrupando las hojas de una misma persona. En hojas que el modelo no vio: dígitos 88,1 % a 94,0 % (79 de 84); registros completos 6 de 14 a 9 de 13; preguntas mal 75 a 9 de 269. Concluyó que había que esperar unos 3 de cada 10 registros con algún dígito mal y revisar cada registro contra el recorte.
- **Qué hubo que corregir / qué erró la IA:** Corrigió un defecto de su propia validación (dos hojas de la misma persona quedaban una dentro y otra fuera del entrenamiento).
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5

### N.º 93 · 2026-11-19 03:31 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > Acabo de subir 14 examenes y fallaron todos, en la gran mayoria sino en todos, la respuesta 1 no se detecto nunca. En todas las imagenes la identificacion de las respuestas esta corrida. Poder revisarlo?
- **Qué hizo la IA:** Encontró la causa: la app ubicaba las burbujas desde las cuatro marcas de esquina como si la hoja fuera plana; con papel curvado o foto muy inclinada el interior se corría hasta unos 5 mm (una fila mide 5,5 mm) y la pregunta 1 caía en el vacío. Ajustó cada columna de respuestas a los círculos impresos de la propia foto (METSI-19): errores 113 a 10 de 220 (5 hojas perfectas) en la tanda nueva y 5 a 0 de 259 (13 hojas perfectas) en la anterior; modalidad 10 de 11; sensibilidad Normal 0,16 a 0,18; prueba nueva de papel curvado; 122 pruebas.
- **Qué hubo que corregir / qué erró la IA:** Con la primera tanda (poco papel curvado) no se notaba; la falla solo apareció con más hojas reales. Dijo que las cifras eran optimistas: umbral elegido con las mismas dos tandas, no contó preguntas sin corregir y todo se probó en Chromium de laboratorio.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5, 6

### N.º 94 · 2026-11-19 12:23 UTC · Claude Code
- **Etapa:** despliegue
- **Pedido (textual):**
  > si fusiona
- **Qué hizo la IA:** Fusionó a `main` (122 pruebas). Indicó refrescar con Ctrl+Shift+R y corregir 2 o 3 hojas primero.
- **Qué hubo que corregir / qué erró la IA:** NO CONSTA
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 9

### N.º 95 · 2026-11-19 12:39 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > Ahi corregi 4 examanes mas, no estoy conforme con los resultados, ahora se la pasa inventando respuestas E en las preguntas que van del 11 al 20. Sigue recortando los nombres, y el registro sigue teniendo problemas, la modalidad practicamente no la reconoce. Las preguntas mejoraron pero sigue habiendo muchos falsos positivos.
- **Qué hizo la IA:** Reanalizó con las cuatro hojas nuevas y las fotos originales (ver el pedido siguiente).
- **Qué hubo que corregir / qué erró la IA:** El problema no era del código nuevo sino de un valor viejo: el examen tenía la sensibilidad guardada en 0,12 (la opción «Alta» de antes).
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5, 6

### N.º 96 · 2026-11-19 12:39 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > Por favor, agarra los examenes de ayer y los que pase ahora y usa las fotos originales para revisar todo lo que tiene que ver con nombre, registro y modalidad.
- **Qué hizo la IA:** Con 0,12 fijo midió 155 preguntas mal sobre 28 hojas; con 0,18, 11. Hizo que la sensibilidad fuera un piso y que cada foto ajuste su propio umbral entre sus burbujas vacías y las marcadas (9 a 10 errores con cualquier piso de 0,12 a 0,20). Nombre: ahora busca la línea impresa y recorta enderezado sobre ella. Aviso de hoja repetida: saltaba en 77 de 152 pares de alumnos distintos y pasó a 1 de 152. Registro: muestra la segunda opción cuando un dígito es dudoso («9 ¿4?»). Modalidad: 25 de 28 hojas. Entrenó el lector con 108 dígitos de 18 hojas (METSI-20).
- **Qué hubo que corregir / qué erró la IA:** Encontró además un problema que nadie había reportado: el aviso de hoja repetida saltaba entre alumnos distintos.
- **Sección del informe donde encaja:** 6 Pruebas
- **Ítem(s):** 5, 6

### N.º 97 · 2026-11-19 12:45 UTC · Claude Code
- **Etapa:** construcción
- **Pedido (textual):**
  > cambio la sensibilidad a normal.
- **Qué hizo la IA:** Respondió que lo hacía, pero esperó a que terminara una prueba de topes que modificaba `js/scanner.js` para no pisarla.
- **Qué hubo que corregir / qué erró la IA:** NO CONSTA
- **Sección del informe donde encaja:** 3 La solución
- **Ítem(s):** 6

### N.º 98 · 2026-11-19 14:01 UTC · Claude Code
- **Etapa:** despliegue
- **Pedido (textual):**
  > si fusiona
- **Qué hizo la IA:** Fusionó a `main` (123 pruebas). Explicó qué esperar: «calculá que aciertan completos unos 6 de cada 10» registros, y que la versión nueva se confirma por el número al pie de la app.
- **Qué hubo que corregir / qué erró la IA:** NO CONSTA
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 9

### N.º 99 · 2026-11-19 14:22 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > Revisè una tanda neuva de examanes, las mejoras son evidentes, los nombres todos bien recortados, los registros mucho mas precisos con ajustes. Falla en casos fallables de la modalidad y en las respuestas, casi nulas correcciones, revisalos igualmente .
- **Qué hizo la IA:** De 140 preguntas el docente corrigió una; la app ya la había marcado como dudosa. Las 3 modalidades que fallaron eran marcas con X: agregó un respaldo que preselecciona la más oscura y la deja resaltada como dudosa (37 de 39 hojas acertadas, 0 equivocadas, 2 sin decidir). Registro: 3 de 7 coincidían.
- **Qué hubo que corregir / qué erró la IA:** Dijo que elegió la regla mirando esas mismas hojas, así que la cifra es algo optimista.
- **Sección del informe donde encaja:** 6 Pruebas y 8 Valor
- **Ítem(s):** 5, 12

### N.º 100 · 2026-11-19 14:48 UTC · Claude Code
- **Etapa:** despliegue
- **Pedido (textual):**
  > fusiona a main
- **Qué hizo la IA:** Fusionó a `main` (124 pruebas).
- **Qué hubo que corregir / qué erró la IA:** NO CONSTA
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 9

### N.º 101 · 2026-11-19 14:48 UTC · Claude Code
- **Etapa:** documentación
- **Pedido (textual):**
  > el casos.json lo podes obtener vos directamente.
- **Qué hizo la IA:** Reconoció que ya lo bajaba él mismo de Drive y dejó de pedirlo.
- **Qué hubo que corregir / qué erró la IA:** Pidió un archivo que podía obtener solo.
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 9

### N.º 102 · 2026-11-19 20:41 UTC · Claude Code
- **Etapa:** pruebas
- **Pedido (textual):**
  > terminè, muchisimo mejor, muy poquitas correcciones, el reconocimiento de registros funcionò muy bien.  Revisa los casos que haya y hace los ajustes.
- **Qué hizo la IA:** Ordenó «Aciertos por pregunta» en Resultados (METSI-21), pegó el rótulo «N° de registro» al primer casillero de la hoja V4 sin tocar casilleros ni marcas (METSI-22), agregó la tanda como prueba permanente (sin nombres ni registros) y entrenó un modelo con 324 dígitos. Validación cruzada con ese modelo: 92,3 % de dígitos y 33 de 53 registros completos (299 de 324 dígitos).
- **Qué hubo que corregir / qué erró la IA:** Dijo que con esa muestra no se puede afirmar que el modelo nuevo sea mejor que el anterior (91,2 %): todavía no lo adoptó.
- **Sección del informe donde encaja:** 6 Pruebas y 8 Valor
- **Ítem(s):** 5, 12

### N.º 103 · 2026-11-19 21:02 UTC · Claude Code
- **Etapa:** despliegue
- **Pedido (textual):**
  > fusiona lo que tengas para fusionar
- **Qué hizo la IA:** Fusionó lo ya probado (125 pruebas) y dejó afuera el modelo nuevo, que todavía no estaba validado.
- **Qué hubo que corregir / qué erró la IA:** NO CONSTA
- **Sección del informe donde encaja:** 4 Cómo se construyó
- **Ítem(s):** 9

### N.º 104 · 2026-11-19 21:04 UTC · Claude Code
- **Etapa:** construcción
- **Pedido (textual):**
  > no hace falta agregar la leyenda
- **Qué hizo la IA:** No agregó la indicación impresa «escribí un dígito por casillero».
- **Qué hubo que corregir / qué erró la IA:** NO CONSTA
- **Sección del informe donde encaja:** 3 La solución
- **Ítem(s):** 6
