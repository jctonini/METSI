# Informe · borrador consolidado (Camino A)

> **Cómo usar este archivo.** Es el texto del informe en primera persona, listo para pasar a un procesador de texto. **[COMPLETAR]** marca un dato que solo vos tenés; **[VALIDAR]** y **[VERIFICAR]**, algo a confirmar. **Ninguna marca debe quedar en el PDF final.** El estado de cada ítem de la consigna y la lista de pendientes están en `registro-ia.md`.
>
> **Formato (consigna §4):** PDF de hasta 12 páginas sin contar anexos, Arial o Calibri 11, interlineado 1,5: unas 330 a 380 palabras por página, es decir, **4.000 a 4.400 palabras de cuerpo, tablas incluidas**. Los presupuestos por sección son aproximados. **Archivos (consigna §8):** `Apellido_Nombre_TF_Informe.pdf` y `Apellido_Nombre_TF_Solucion.zip`.

---

## Portada
- **METSI Corrector: corrección asistida de exámenes multiple choice en papel**
- Diplomatura en IA Aplicada a Entornos Digitales de Gestión · FCEUBA · Comisión de los martes 2026 · Camino A (funcional) · Entrega: 11 de diciembre de 2026
- Autor: Perez Tonini, Julio Cesar (trabajo individual)
- Solución: `https://metsi-correcciones.vercel.app` (con usuario y contraseña) y una copia sin login en `https://jctonini.github.io/METSI/`. Código: `https://github.com/jctonini/METSI`
- Acceso para la corrección: usuario de prueba `usuario@mail.com` (rol docente, solo con datos inventados) en la dirección de Vercel. **[COMPLETAR la clave solo en el PDF final: este archivo está en un repositorio público y no debe llevarla.]**
- **[COMPLETAR enlace al video de hasta 3 minutos o a las cinco capturas comentadas]**

---

## 1. El problema · ~350 palabras

**Elegí este problema porque** soy ayudante de primera simple de la materia Metodología de Sistemas de Información (658-1), de la Facultad de Ciencias Económicas de la UBA, y los exámenes son en papel, multiple choice, y corregirlos me lleva mucho tiempo.

**Quién lo sufre.** Yo, que corrijo; los alumnos, que esperan las notas más tiempo cuanto más tarda la corrección; y el resto de la cátedra, que depende de que las notas estén a tiempo.

**Cuánto pesa hoy.** En el primer uso en serio rinden unos 80 alumnos por turno. El primer parcial tiene 10 preguntas y el segundo 20, con 4 o 5 opciones, y una pregunta puede tener varias respuestas correctas. Corrijo por lotes, así que **el tiempo por examen no se mide directamente**: se obtiene haciendo todo el proceso para el conjunto y dividiendo por la cantidad. No lo cronometré. Mi estimación, sin medir, es de **entre 4 y 5 minutos por examen**, es decir, **entre 5 h 20 min y 6 h 40 min por turno de 80 alumnos** Con la herramienta, una tanda de 56 exámenes reales me llevó **como mucho 2 horas** (el 18 y 19 de noviembre), es decir, hasta unos 2,1 minutos por examen. No es una medición controlada: no cronometré ni corregí el mismo lote a mano..

**Errores.** En la corrección a mano puede haber errores. Los suelo detectar en mis propios controles, que suman tiempo, y rara vez los detectó un alumno. No tengo una cifra.

**Qué pasa si no se resuelve.** Las notas se demoran para los alumnos; cada parcial consume horas que no se pueden dedicar a otras tareas docentes; y sigue el riesgo de errores y de controles extra.

## 2. La situación actual · ~450 palabras

Hoy corrijo completamente a mano, y por lotes. El proceso, paso por paso:

1. **Los alumnos rinden en papel.** Marcan sus respuestas en el examen impreso, de cuatro carillas, y anotan nombre, número de registro y modalidad de cursada.
2. **Corrijo por carillas, con la clave impresa:** primero todas las carillas 4 de todos los exámenes, después volteo la pila y sigo con la 3, la 2 y la 1. El puntaje de cada pregunta se reparte entre sus respuestas correctas, se reconoce puntaje parcial y en el cálculo entran también las incorrectas (si en una pregunta de dos correctas marcó una correcta y una incorrecta, le doy solo el puntaje de la correcta).
3. **Sumo los puntos, examen por examen,** juntando las cuatro carillas, y anoto la nota en el frente.
4. **Ordeno todos los exámenes por número de registro,** de menor a mayor.
5. **Paso el puntaje a una planilla de Excel** con los datos de cada alumno. Ahí aplico el criterio de aprobación, fijado de antemano: hace falta el 60 % del examen para un 4, y de ahí hay una correlación hasta el 10 (60 % → 4; 65 % → 5; 70 % → 6; 75 % → 7; 80 % → 8; 90 % → 9; 95 % → 10, valores aproximados), y Excel redondea las notas. También verifico contra el listado de inscriptos que estén todos, que no haya repetidos y que ninguno haya quedado sin identificar.
6. **Comparto las notas con los alumnos.**
7. **Subo las notas a MiEcon,** la web de la facultad.

Qué cambia con la herramienta (insumo para el diagrama de «hoy» y el de «propuesto»):

| Paso | Hoy | Con METSI Corrector |
|---|---|---|
| 1. Marcar | En el examen impreso | En una **hoja de respuestas A5** aparte, con birome; se fotografía. La hoja aclara que, si hay diferencias, prevalece lo marcado en ella |
| 2. Corregir | A mano, por carillas, con la clave impresa | La app **lee las marcas** de la foto y las compara con la clave cargada |
| 3. Sumar | A mano, examen por examen | La app **calcula el puntaje** de cada pregunta y el total |
| 4. Ordenar | Ordeno los exámenes por registro | La **tabla de resultados sale ordenada** por registro (con el registro confirmado) |
| 5. Excel e identificación | Tipeo cada dato; Excel aplica el criterio y redondea; verifico a ojo contra el listado | **Exporta un CSV** con registro, nombre, modalidad, puntaje, máximo, porcentaje y respuestas. Lo que la app identifica no se vuelve a tipear (el registro, como sugerencia que se confirma; el nombre se escribe mirando el recorte). **Frena repetidos y hojas sin identificar.** **No compara con el listado de inscriptos y no convierte el puntaje en nota:** eso sigue en Excel |
| 6. Compartir | Manual | Sigue manual |
| 7. MiEcon | Manual | Sigue manual (no hay conexión) |

## 3. La solución · ~450 palabras

**Qué hace.** Es una app web que corrige exámenes multiple choice en papel a partir de la foto de una hoja de respuestas A5, que el alumno completa con birome. Lee las respuestas marcadas y la modalidad; calcula el puntaje (reparte el de cada pregunta entre sus correctas, reconoce puntaje parcial y resta las incorrectas solo por las marcas que exceden la cantidad de correctas, con un peso configurable que arranca en 0,33); controla identificación y repetidos; y exporta un CSV para Excel o Google Sheets. Se usa desde el navegador del celular o de la PC y sincroniza con el Google Drive del docente.

**Para quién.** Docentes de la cátedra. En la copia de Vercel el acceso es con usuario y contraseña, con rol de administrador y de docente.

**Qué cambia en el proceso.** Ver la tabla de la sección 2. El tiempo baja de 4 a 5 minutos por examen a hasta 2,1 (sección 8).

**Nivel de autonomía:**

| La solución hace sola | La solución propone | Lo decide o aprueba una persona |
|---|---|---|
| Leer las marcas de respuesta y la modalidad | Un número de registro leído de los casilleros (red neuronal que corre en el navegador), siempre como sugerencia | Confirmar o corregir el registro; escribir el nombre |
| Calcular el puntaje de cada pregunta y el total | Marcar como dudosas respuestas, dígitos o fotos | Revisar y corregir lo dudoso |
| Detectar hojas sin nombre ni registro y bloquear la exportación | Avisar de posibles repetidos (mismo registro o mismo nombre) | Resolver cada repetido: personas distintas, misma hoja o dato a corregir |
| Avisar si se cargó dos veces la misma foto o el mismo papel | — | Decidir si se carga igual |
| — | — | **Convertir el puntaje en nota:** el criterio está fijado de antemano y lo aplico yo en Excel |
| — | — | Publicar y administrar usuarios |

## 4. Cómo se construyó · ~800 palabras

**Herramientas y por qué esas.**

| Herramienta | Para qué | Por qué esa | Alternativa | Costo |
|---|---|---|---|---|
| **Claude Code** (Claude Sonnet 5.5, esfuerzo medio) | Escribió el código, corrió las pruebas, hizo commits y fusiones | Ya lo venía usando | Codex, el de las clases 12 y 13 | Ver sección 8 |
| **App web** que lee la foto | La solución | Usarla desde el celular y la PC con Drive | Planilla de Google con Apps Script, el camino que recomienda la consigna | — |
| **Vercel** y **Supabase** | Publicación con login; usuarios y roles | Ya tenía cuentas, tienen plan gratuito para este uso y son herramientas de la cursada (clase 13) | No evalué otra | USD 0 (plan gratuito) |
| **GitHub** y Pages | Código e historial; copia sin login | Es herramienta de la cursada (clase 13); Pages lo propuso el asistente cuando le pedí que me indicara qué convenía | — | USD 0 (plan gratuito) |
| **Google Drive** y selector de Google | Guardar fotos y resultados; cargar fotos desde una carpeta | Ver los resultados y las fotos desde el celular y la PC | Guardar solo en el navegador | USD 0 (sin facturación) |
| **Red neuronal local** | Sugerir el número de registro | Que ninguna imagen salga del dispositivo | Enviar recortes a la API de un modelo: costaría por uso y sacaría datos de alumnos del dispositivo | USD 0 por uso |
| **Python 3**, **Node.js**, **Backlog.md** | Entrenar el lector de dígitos; pruebas, herramientas y login; gestión de tareas | Python lo sugirió el asistente y lo acepté; Node.js es herramienta de la cursada; Backlog.md lo adopté el 1 de noviembre | PyTorch (no estaba disponible en el entorno del asistente) y scikit-learn (no se usó) | USD 0 |

Claude Code no es la herramienta de las clases 12 y 13; la consigna admite «otra herramienta» siempre que se nombre y se explique por qué, y eso hago acá.

**Lenguajes y librerías.**

| Parte | Lenguaje | Librerías y versiones |
|---|---|---|
| App del navegador | JavaScript, HTML y CSS | Ninguna (usa Canvas, `localStorage` e IndexedDB del navegador) |
| Login (`api/`, `server/`) | Node.js 20 o más | `@supabase/supabase-js` 2.45.4 y `jose` 5.9.6 |
| Pruebas y herramientas | Node.js | Solo módulos de Node (`node:assert`, `fs`, `path`, `crypto`) |
| Entrenamiento del lector de dígitos | Python 3 | `numpy` 2.5.3 (la red 784 → 128 → 64 → 10 está escrita con numpy, sin framework de aprendizaje automático) y `scipy` 1.18.1 (`ndimage`: genera las variaciones de imagen de entrenamiento). Versión de Python: 3.13.18 **(inferida; no quedó registrada)** |
| Datos de entrenamiento | MNIST (dígitos manuscritos) | Cuatro archivos `idx`, descargados el 2026-11-08 de `https://ossci-datasets.s3.amazonaws.com/mnist/` |

El entrenamiento corrió con 30 épocas y dio **98,9 % en MNIST limpio y 96,2 % con deformaciones fuertes**; el modelo cuantizado pesa 146 KB (`js/digit-model.js`). **La app no necesita Python para leer el registro:** Python solo hace falta para reentrenar. Con fotos sintéticas de hojas acierta cerca del 99 % de los casilleros. Con letra real, el 19 de noviembre lo reentrené con 108 dígitos de 18 hojas reales (más MNIST) y, en hojas que el modelo no vio, acertó **91,7 % de los dígitos y 12 de 17 registros completos**; por eso el registro siempre es una sugerencia que confirmo.

**Los datos (ítem 4).** Usa las fotos de las hojas, la clave y la configuración del examen, y la identificación de cada alumno (nombre, registro y modalidad, que escribe el alumno y confirma o escribe el docente). Queda afuera, porque no es necesario: el enunciado de las preguntas (solo se carga la clave), el listado de inscriptos y los datos académicos (carrera, comisión, mail). El diccionario completo está en el Anexo B.

**La estructura.** Un repositorio con lectura de la foto, puntaje (`scoring`), identificación y repetidos, casos a revisar, exportación, Drive, lectura del registro, interfaz y login. El mapa de archivos está en el README.

**Cómo se construyó**, en ocho tramos, cada uno con un pedido al asistente, un plan antes de los cambios grandes y pruebas: (1) hoja y puntaje, 1 de octubre; (2) Drive y publicación, 1 de octubre; (3) identificación y repetidos, 2 de octubre; (4) hojas V3 y V4, banderas y regla de puntaje, 24 de octubre; (5) Backlog.md, reintentos y módulos, 1 de noviembre; (6) login, 7 de noviembre; (7) selector de Drive y lectura del registro, 8 de noviembre; (8) corrección de la lectura con exámenes reales y mejoras de uso, 18 y 19 de noviembre. El paso a paso para rehacerla está en el Anexo F.

**Instalación en la organización (ítem 9).** La usan docentes de la cátedra, con usuario y contraseña. La mantengo yo (hasta ahora, con el asistente): corro `node tools/version.js` tras cada cambio, administro usuarios y entro a la app antes de cada parcial. Yo me ocuparía de explicarles a los otros docentes; hay una guía de uso (`docs/guia-de-uso.md`) y una de instalación en Windows (`docs/guia-windows.md`).

## 5. Registro de uso de IA · ~550 palabras

- **Herramienta y modelo:** Claude Code, con **Claude Sonnet 5.5 y esfuerzo medio en las siete sesiones** (lo verifiqué en los datos de cada sesión; la de los exámenes reales, el 2026-11-24). Los pedidos y su análisis completos: 104 pedidos, Anexo C y registros brutos.
- **Pedidos principales, textuales:**
  - Problema (N.º 1): «Resulta que los examenes en papel son multiple choice y lleva mucho tiempo corregirlos / yo estaba pensando en la primera de las opciones, que los alumnos completen una grilla con las respuestas, sacarles una foto y que una app lo corrija».
  - Regla de puntaje (N.º 34): «pero que pasaria si son 4 opciones correctas y marcó las 5 opciones?».
  - Exámenes reales (N.º 81): «Acabo de utilizar la herramienta con 15 exámenes reales, en todos hubo casos de correcciones, problemas de reconocimiento, etc. Podes revisar todo lo que marque para revisar y hacer las correcciones? Anda preguntandome lo que necesites».
  - Desconfianza (N.º 89): «me preocupa que digas cosas que no son ciertas.»
  - Resultado (N.º 102): «terminè, muchisimo mejor, muy poquitas correcciones, el reconocimiento de registros funcionò muy bien.»
  - Dato que faltaba (N.º 52): «los numero de registros oscilan entre 6 o 7 caracteres, con tu propuesta de utilizar "?" siento que todos los registros que sean de 6 caracteres van a quedar asi: '?XXXXXX'  y eso va a ser un freno para mi, más que una solución».
- **Instrucciones con estructura:** la consigna de siete partes de la clase 5: Anexo D, con los pedidos reescritos y la comparación con los originales.
- **Qué tuve que corregir:** la lectura de hojas reales (orientación, cruces finas, hojas con muchas marcas, hoja vecina en la foto); la grilla de respuestas, que con papel curvado o foto inclinada quedaba corrida una fila (la pregunta 1 no se detectaba nunca; N.º 93); el recorte del nombre; la sensibilidad guardada en el examen, que hacía inventar respuestas «E» (N.º 95); la regla de puntaje, que dio resultados raros en dos versiones y que el 9 de noviembre, al compararla con mi corrección manual, volví a la del 24 de octubre (METSI-12); y el selector de Drive, que abría fuera de la raíz.
- **Qué inventó o erró el asistente:** usó mis datos reales como ejemplo de prueba (N.º 13); indicó un paso de Vercel que no existía (N.º 39); dejó un commit con una prueba fallando (N.º 30); propuso mostrar «?» en registros de 6 dígitos (N.º 52) y enviar recortes de letra a la API de un modelo (N.º 51). El 18 de noviembre afirmó que no podía acceder a una skill sin haberlo intentado y presentó cifras de validación sobrestimadas (94 % de dígitos, «7 de cada 10» registros, «75 a 6» errores) que correspondían a otra configuración o a las mismas hojas con que había elegido el umbral; yo se lo señalé (N.º 89) y él lo reconoció punto por punto y volvió a validar con hojas que el modelo no había visto. Al armar este informe supuso un proceso de corrección examen por examen y que el criterio de aprobación se decide después de ver los puntajes: ambos eran falsos y los corregí yo.
- **Decisiones que no le delegué:** que la app no convierta el puntaje en nota (el criterio está fijado de antemano), el puntaje parcial, la identificación obligatoria, qué es un repetido, no enviar imágenes a servicios externos, restringir la clave y probar en producción, y dejar GitHub Pages abierto hasta consultar al profesor.
- **Cifras y normas:** cada cifra de este informe tiene su origen en `valor-y-costo.md` o en el Anexo B. **La Ley 25.326 no la cito por artículo: no pude verificar su texto oficial.**

## 6. Pruebas · ~550 palabras

- **Automáticas:** `node tests/run.js`, **125 pruebas, todas en verde** (2026-11-24, con `npm install`). Cubren puntaje, lectura de fotos sintéticas de hojas V1 a V4, dígitos, identificación, CSV, combinación de datos, reintentos, Drive simulado y acceso.
- **Mi criterio manual contra la app** (pregunta de 1 punto, 4 opciones, peso de las incorrectas 0,33; valores que declaré el 2026-11-09):

  | Caso | Mi criterio | App |
  |---|---|---|
  | 2 correctas (A y B): marcó A y C | 0,5 | 0,5 ✓ |
  | 1 correcta (A): marcó A y C | 0,67 | 0,67 ✓ |
  | 2 correctas (A y B): marcó A, B y C | 0,835 | 0,835 ✓ |
  | 3 correctas (A, B y C): marcó las cuatro | 0,89 | 0,89 ✓ |
  | 2 correctas (A y B): marcó las cuatro | 0,67 (mi valor de 0,5 era una aproximación) | 0,67 ✓ |

  Con la regla anterior («cada incorrecta resta siempre; marcar todas vale 0 si las correctas son la mitad o menos») coincidían 3 de 5; por eso volví a la del 24 de octubre.
- **Ejemplo de la pregunta 8 (N.º 21 y 22):** con la clave A, B, C, D y descuento 1, marcar las cinco opciones no debe dar 0: la regla da 0,75. Es un ejemplo mío del 1 de octubre, no una pregunta de un examen real.
- **Casos que tienen que fallar:** hoja sin nombre ni registro (no deja exportar); mismo registro en dos hojas o mismo nombre con registro faltante (frena); mismo nombre con registros distintos (solo avisa); misma foto cargada dos veces (avisa); foto con una versión de hoja más nueva que la app (avisa); guardado local lleno (aviso persistente); docente que intenta administrar usuarios (rechazado en el servidor).
- **Hojas reales:** las fallas del 2 y del 24 de octubre se detectaron con hojas reales y se corrigieron con pruebas de regresión. El 18 y 19 de noviembre usé la herramienta con exámenes reales (15 hojas con casos a revisar y varias tandas más) y el asistente midió contra mi corrección final; las hojas quedaron como pruebas permanentes sin nombres ni registros (METSI-13, 19, 20, 21 y 22):

  - **Sensibilidad:** con 0,085 había 75 preguntas mal de 269; con ~0,16, 9 en hojas no vistas. Después la dejé como piso con umbral adaptativo por foto: 155 mal con 0,12 fijo contra 11 con 0,18.
  - **Grilla corrida** por papel curvado o foto inclinada (la pregunta 1 no se detectaba): 113 de 220 mal; con el ajuste a los círculos impresos, 10 de 220.
  - **Registro:** de 88,1 % a 94,0 % de dígitos (84 dígitos) y luego 91,7 % con 108; registros completos, 12 de 17.
  - **Otros:** hoja repetida avisada de más (77 de 152 pares a 1) y modalidad marcada con X (37 de 39 acertadas, 0 equivocadas).

  **Cómo leer estas cifras:** el asistente las presentó con sus límites: el umbral se eligió mirando las mismas hojas, las preguntas que no corregí se dieron por bien leídas y todo se probó en un Chromium sin pantalla, no en un celular ni en Vercel. Después de los ajustes escribí: «muy poquitas correcciones, el reconocimiento de registros funcionó muy bien» (N.º 102).
- **Prueba con una persona ajena (consigna §8): no realizada.** La hará el profesor al corregir; por eso dejé un usuario de prueba con datos inventados.
- **Tiempo y notas:** no hice una medición controlada (ver sección 1). Las notas finales tras el redondeo de Excel no se compararon con las de una corrección a mano del mismo lote.
- **Limitaciones:** la lectura del registro se calibró con 108 dígitos de 18 hojas y sigue habiendo registros con algún dígito mal (hay que confirmar cada uno contra el recorte); no se probó el selector de Drive con una cuenta de Google real (METSI-15) ni en un celular; el despliegue de Vercel y de GitHub Pages no lo verificó el asistente; un modelo entrenado con 324 dígitos quedó sin adoptar porque con esa muestra no se puede afirmar que mejore (92,3 % contra 91,2 %).

## 7. Riesgos y controles · ~500 palabras

- **Datos personales (Ley 25.326).** La herramienta procesa nombre, registro, letra manuscrita, la foto de cada hoja y los puntajes. Quedan en el Google Drive del docente (en este caso, una cuenta personal) y en el navegador, no en un servidor de la herramienta; Supabase solo guarda email y rol de los docentes y Vercel solo publica la app. **[VERIFICAR el texto de la ley y qué obligaciones aplican (finalidad, seguridad, conservación, proveedores) y consultar con la facultad: no pude leer el texto oficial.]**
- **Autorización.** Es una iniciativa mía, consultada con el titular de cátedra; la consulta fue verbal y no hay una autorización formal.
- **Secreto profesional.** Las notas y los exámenes son confidenciales en la cátedra. Controles: login con roles validados en el servidor; permiso mínimo de Drive (`drive.file`); casos a revisar sin nombre ni registro y con fotos tapadas; lectura del registro sin enviar imágenes. **Limitación:** la copia de GitHub Pages abre sin login; no expone datos guardados, pero cualquiera con la dirección puede usar la herramienta. Lo dejé abierto a propósito, por si el profesor necesita verlo; todavía no respondió.
- **Conservación.** Con la copia impresa, me comprometo a eliminar las fotos y los resultados del Drive cuando las notas estén en la plataforma oficial y las actas firmadas; todavía no lo apliqué y la herramienta no borra sola.
- **Si se equivoca, quién responde.** La herramienta calcula y marca lo dudoso, pero nunca decide sola: el registro es una sugerencia que confirmo, no exporta hojas sin identificar, frena repetidos y el criterio de aprobación lo aplico yo en Excel. **Respondo yo, como docente que corrige;** las notas las firma el titular de cátedra.
- **Incidente real.** La API key del selector de Drive quedó en un repositorio público y Google la detectó a los 10 segundos (`LEAKED_CREDENTIALS`, solo notificó). La restringí a mis dos sitios y a la API del selector; el proyecto no tiene facturación, así que no puede generar cargos. Lección: una clave que debe ser pública se restringe **antes** de subirla. Cronología y evidencia en el Anexo G.
- **Planes gratuitos (clase 13).** Supabase pausa el proyecto tras una semana sin actividad y el login dejaría de funcionar hasta reactivarlo; el plan Hobby de Vercel es solo para uso personal y no comercial, y no confirmé si una cátedra califica.
- **Riesgos abiertos.** GitHub Pages sin login; la sesión de un usuario dado de baja vale hasta una hora; el token de sesión se guarda en una cookie que escribe el navegador; la nota libre de los casos a revisar y el nombre del archivo de la foto pueden contener datos personales; los datos de alumnos están en una cuenta personal y sin borrado automático; la lectura del registro, aunque calibrada con letra real, deja con algún dígito mal a unos 3 de cada 10 registros, y un registro mal confirmado podría asignar una nota a otro alumno. Para diagnosticar las fallas, el asistente bajó de mi Drive las fotos completas de exámenes reales (con nombre y registro); no se subieron al repositorio y las pruebas permanentes se armaron sin nombres ni registros, pero esas fotos pasaron por un entorno temporal de la herramienta de IA y no las borré (**riesgo abierto**).

## 8. Valor y costo · ~350 palabras

- **Valor.** El ahorro es de tiempo. A mano, un turno de 80 alumnos me lleva entre 5 h 20 min y 6 h 40 min (estimación); con la herramienta, hasta unas 2 h 50 min (cota superior, de una tanda de 56 exámenes en 2 horas como máximo). Con 4 turnos por cuatrimestre y 2 cuatrimestres, son 8 turnos y unas 640 hojas por año: **43 a 53 horas a mano contra hasta 23 con la herramienta, un ahorro de al menos 20 a 30 horas por año.** El armado y los ajustes me llevaron unas 7 a 8 horas, que se recuperan en 2 o 3 turnos. No incluye el mantenimiento futuro, que no estimé.
- **Otros beneficios, no medidos en minutos:** criterio de puntaje uniforme, control de identificación y repetidos, y la foto de cada hoja como respaldo.
- **Costo.** Licencias: USD 0 (Google Cloud sin facturación; planes gratuitos de GitHub, Vercel y Supabase). Uso de IA: pago una suscripción Claude Pro de USD 20 por mes que uso también para otros fines; por los dos meses de trabajo, el tope atribuible es de **USD 40**. La plataforma informa USD 56,13 a precio de uso en las cinco primeras sesiones (referencia, no lo pagado), sin la sesión de los exámenes reales, cuyo costo no consulté.
- **Origen de las cifras:** `valor-y-costo.md`.

## 9. Conclusiones y próximos pasos · ~250 palabras

- **Lo que aprendí:** **[COMPLETAR en tus palabras]**. Ideas con respaldo en el registro: lo que no se escribe en un pedido, el asistente lo completa con lo más probable; una clave pública se restringe antes de subirla; las pruebas con fotos sintéticas no anticiparon el papel curvado, que solo apareció con exámenes reales; y las cifras del asistente hay que leerlas con sus límites y pedirle que las rehaga con hojas que no vio.
- **Limitaciones:** el registro todavía requiere confirmar cada caso; el nombre solo se muestra como recorte; GitHub Pages sin login; no probé en celular ni con el selector de Drive de Google real; el tiempo con la herramienta es una cota superior sin medición controlada.
- **Qué haría después:** seguir calibrando con hojas reales (METSI-1, abierta) y probar el selector de Drive y el celular; comparar el CSV con el listado de inscriptos; decidir lo de GitHub Pages según el profesor; medir el ahorro con cronómetro en un turno.
- **¿Conviene?** Sí, con las cifras de la sección 8: se recupera en 2 o 3 turnos y ahorra al menos 20 a 30 horas por año. La conclusión se apoya en una estimación a mano y en una cota superior con la herramienta, no en una medición controlada.

## 10. Fuentes · ~150 palabras
- Consigna del trabajo final, Diplomatura en IA Aplicada a Entornos Digitales de Gestión, comisión de los martes 2026.
- Clase 5, «El arte de pedir bien: contexto e instrucciones» (`diploiafceuba.vercel.app/05`); clases 12 y 13 (`/12`, `/13`). Consultadas el 2026-11-09.
- Backlog.md (`github.com/MrLesk/Backlog.md`), consultado el 2026-11-01.
- Aviso de Google Cloud sobre la clave pública, recibido el 2026-11-08.
- Ley 25.326 de Protección de los Datos Personales (no pude verificar el texto oficial; no se cita por artículo).
- Documentación de Google Picker y Drive API, Supabase y Vercel.

---

## Anexos (no cuentan para las 12 páginas)

### Anexo A · Dónde se trabaja cada ítem de la lista de cumplimiento (consigna §5)
| # | Ítem | Dónde |
|---|---|---|
| 1 | Problema real, quién lo sufre y cuánto pesa | Sección 1 |
| 2 | Herramienta justificada frente a otra, con costo | Secciones 4 y 8 |
| 3 | Instrucciones armadas con PEDIR o equivalente | Sección 5 y Anexo D |
| 4 | Datos o documentos que usa y qué queda afuera | Sección 4 y Anexo B |
| 5 | Verificación con casos de respuesta conocida | Sección 6 |
| 6 | Nivel de autonomía | Sección 3 |
| 7 | Construcción paso por paso | Sección 4 y Anexo F |
| 8 | Datos en tablas con diccionario | Anexo B |
| 9 | Instalación: quién usa, mantiene y capacita | Sección 4 |
| 10 | Riesgos, datos personales, secreto profesional y responsable | Sección 7 y Anexo G |
| 11 | Uso de IA declarado con pedidos textuales | Sección 5 y Anexo C |
| 12 | Valor estimado con supuestos y conclusión | Sección 8 |

### Los demás anexos
- **Anexo B · Diccionario de datos:** `diccionario-de-datos.md`
- **Anexo C · Pedidos textuales:** `anexo-c-pedidos-textuales.md` (17 pedidos completos e índice de los 80); el texto de todos está en los cuatro `registro-ia-bruto*.md`
- **Anexo D · Instrucciones con la consigna de siete partes:** `instrucciones-para-el-modelo.md`
- **Anexo E · Evidencia de que funciona:** video de hasta 3 minutos o cinco capturas comentadas, **solo con datos inventados** y sin nombres de carpetas ni emails personales **[COMPLETAR]**
- **Anexo F · Cómo rehacer la herramienta, paso por paso:** `anexo-f-paso-a-paso.md`
- **Anexo G · Incidente de la API key:** `incidente-api-key.md`

---

## Lista de verificación antes de entregar (consigna §8)
- [ ] Abrir la solución con otra cuenta (o pedirle a alguien) y probarla desde cero con datos de ejemplo.
- [ ] Mostrársela a alguien ajeno al tema y anotar qué entendió y qué cambié.
- [ ] Revisar que las cifras del informe coincidan con las de la solución (125 pruebas, 4 a 5 minutos, 80 alumnos, USD 56,13 más la sesión de los exámenes reales).
- [ ] Verificar que no quede ningún dato real de una persona, ni en los datos ni en las capturas ni en el historial del repositorio (buscar el nombre y el registro del autor en todo el repo).
- [ ] Nombrar los archivos como pide la consigna y armar el `.zip` con la carpeta del proyecto, sin `node_modules`, sin claves ni contraseñas.
