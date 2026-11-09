# Informe · borrador consolidado (Camino A)

> **Cómo usar este archivo.** Es el texto del informe en primera persona, listo para pasar a un procesador de texto. **[COMPLETAR]** marca un dato que solo vos tenés; **[VALIDAR]** y **[VERIFICAR]**, algo a confirmar. **Ninguna marca debe quedar en el PDF final.** El estado de cada ítem de la consigna y la lista de pendientes están en `registro-ia.md`.
>
> **Formato (consigna §4):** PDF de hasta 12 páginas sin contar anexos, Arial o Calibri 11, interlineado 1,5: unas 330 a 380 palabras por página, es decir, **4.000 a 4.400 palabras de cuerpo, tablas incluidas**. Los presupuestos por sección son aproximados. **Archivos (consigna §8):** `Apellido_Nombre_TF_Informe.pdf` y `Apellido_Nombre_TF_Solucion.zip`.

---

## Portada
- **METSI Corrector: corrección asistida de exámenes multiple choice en papel**
- Diplomatura en IA Aplicada a Entornos Digitales de Gestión · FCEUBA · Comisión de los martes 2026 · Camino A (funcional) · Entrega: 11 de diciembre de 2026
- Autor: **[COMPLETAR nombre y apellido]** (trabajo individual)
- Solución: `https://metsi-correcciones.vercel.app` (con usuario y contraseña) y una copia sin login en `https://jctonini.github.io/METSI/`. Código: `https://github.com/jctonini/METSI`
- **[COMPLETAR acceso para la corrección]:** decidí si creás un usuario de prueba para el equipo docente (con datos inventados) o si indicás la copia sin login. **Nunca pegues una contraseña real en el informe.**
- **[COMPLETAR enlace al video de hasta 3 minutos o a las cinco capturas comentadas]**

---

## 1. El problema · ~350 palabras

**Elegí este problema porque** soy ayudante de primera simple de la materia Metodología de Sistemas de Información (658-1), de la Facultad de Ciencias Económicas de la UBA, y los exámenes son en papel, multiple choice, y corregirlos me lleva mucho tiempo.

**Quién lo sufre.** Yo, que corrijo; los alumnos, que esperan las notas más tiempo cuanto más tarda la corrección; y el resto de la cátedra, que depende de que las notas estén a tiempo.

**Cuánto pesa hoy.** En el primer uso en serio rinden unos 80 alumnos por turno. El primer parcial tiene 10 preguntas y el segundo 20, con 4 o 5 opciones, y una pregunta puede tener varias respuestas correctas. Corrijo por lotes, así que **el tiempo por examen no se mide directamente**: se obtiene haciendo todo el proceso para el conjunto y dividiendo por la cantidad. No lo cronometré. Mi estimación, sin medir, es de **entre 4 y 5 minutos por examen**, es decir, **entre 5 h 20 min y 6 h 40 min por turno de 80 alumnos** **[COMPLETAR si se mide el 18/11: para cuántas preguntas vale y qué pasos incluye]**.

**Errores.** En la corrección a mano puede haber errores. Los suelo detectar en mis propios controles, que suman tiempo, y rara vez los detectó un alumno. No tengo una cifra **[VALIDAR si tenés alguna]**.

**Qué pasa si no se resuelve.** Las notas se demoran para los alumnos; cada parcial consume horas que no se pueden dedicar a otras tareas docentes; y sigue el riesgo de errores y de controles extra.

## 2. La situación actual · ~450 palabras

Hoy corrijo completamente a mano, y por lotes. El proceso, paso por paso:

1. **Los alumnos rinden en papel.** Marcan sus respuestas en el examen impreso, de cuatro carillas, y anotan nombre, número de registro y modalidad de cursada.
2. **Corrijo por carillas, con la clave impresa:** primero todas las carillas 4 de todos los exámenes, después volteo la pila y sigo con la 3, la 2 y la 1. El puntaje de cada pregunta se reparte entre sus respuestas correctas, se reconoce puntaje parcial y en el cálculo entran también las incorrectas (si en una pregunta de dos correctas marcó una correcta y una incorrecta, le doy solo el puntaje de la correcta) **[COMPLETAR otros casos]**.
3. **Sumo los puntos, examen por examen,** juntando las cuatro carillas, y anoto la nota en el frente.
4. **Ordeno todos los exámenes por número de registro,** de menor a mayor.
5. **Paso el puntaje a una planilla de Excel** con los datos de cada alumno. Ahí aplico el criterio de aprobación, fijado de antemano: hace falta el 60 % del examen para un 4, y de ahí hay una correlación hasta el 10 (60 % → 4; 65 % → 5; 70 % → 6; 75 % → 7; 80 % → 8; 90 % → 9; 95 % → 10, valores aproximados), y Excel redondea las notas. También verifico contra el listado de inscriptos que estén todos, que no haya repetidos y que ninguno haya quedado sin identificar **[VALIDAR: nota de los porcentajes intermedios y de los menores a 60 %]**.
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

**Qué cambia en el proceso.** Ver la tabla de la sección 2. **[COMPLETAR el 18/11 con cuánto cambia el tiempo]**

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

El entrenamiento corrió con 30 épocas y dio **98,9 % en MNIST limpio y 96,2 % con deformaciones fuertes**; el modelo cuantizado pesa 146 KB (`js/digit-model.js`). **La app no necesita Python para leer el registro:** Python solo hace falta para reentrenar. Con fotos sintéticas de hojas acierta cerca del 99 % de los casilleros; con letra real no está medido.

**Los datos (ítem 4).** Usa las fotos de las hojas, la clave y la configuración del examen, y la identificación de cada alumno (nombre, registro y modalidad, que escribe el alumno y confirma o escribe el docente). Queda afuera, porque no es necesario: el enunciado de las preguntas (solo se carga la clave), el listado de inscriptos y los datos académicos (carrera, comisión, mail). El diccionario completo está en el Anexo B.

**La estructura.** Un repositorio con lectura de la foto (`scanner`, `layout`, `sheet`), puntaje (`scoring`), identificación y repetidos (`identity`, `similar`), casos a revisar (`review`), exportación (`csv`), Drive y sesión (`drive`, `auth`, `picker`), lectura del registro (`digits`, `digit-model`), interfaz (`app-*`) y login (`api/`, `server/`). El mapa está en el README.

**Cómo se construyó**, en siete tramos, cada uno con un pedido al asistente, un plan antes de los cambios grandes y pruebas: (1) hoja y puntaje, 1 de octubre; (2) Drive y publicación, 1 de octubre; (3) identificación y repetidos, 2 de octubre; (4) hojas V3 y V4, banderas y regla de puntaje, 24 de octubre; (5) Backlog.md, reintentos y módulos, 1 de noviembre; (6) login, 7 de noviembre; (7) selector de Drive y lectura del registro, 8 de noviembre. El paso a paso para rehacerla está en el Anexo F.

**Instalación en la organización (ítem 9).** La usan docentes de la cátedra, con usuario y contraseña. La mantengo yo (hasta ahora, con el asistente **[VALIDAR si seguirá así]**): corro `node tools/version.js` tras cada cambio, administro usuarios y entro a la app antes de cada parcial. Yo me ocuparía de explicarles a los otros docentes; hay una guía de uso (`docs/guia-de-uso.md`) y una de instalación en Windows (`docs/guia-windows.md`).

## 5. Registro de uso de IA · ~550 palabras

- **Herramienta y modelo:** Claude Code, con **Claude Sonnet 5.5 y esfuerzo medio en las seis sesiones** (lo verifiqué en los datos de cada sesión el 2026-11-09). Los pedidos y su análisis completos: 80 pedidos, Anexo C y registros brutos.
- **Pedidos principales, textuales:**
  - Problema (N.º 1): «Resulta que los examenes en papel son multiple choice y lleva mucho tiempo corregirlos / yo estaba pensando en la primera de las opciones, que los alumnos completen una grilla con las respuestas, sacarles una foto y que una app lo corrija».
  - Datos personales (N.º 13): «es mi nombre y mi registro de cuando era alumno, mejor no lo subas al repo».
  - Caso de respuesta conocida (N.º 21): «en mi ejemplo en la pregunta 8, las respuestas correctas son A, B, C, D y en el ejemplo marqué todas las letras, de A a E, sin embargo el alumno estaria recibiendo 0 puntos, cuando en realidad.. considero que tendria que recibir puntaje. no perfecto, pero si algun puntaje».
  - Regla de puntaje (N.º 34): «pero que pasaria si son 4 opciones correctas y marcó las 5 opciones?».
  - Privacidad (N.º 51): «no entiendo porque habria que enviar los recortes a la api de anthorpic, acaso no es lo mismo que ya haces para detectar las respuestas completadas?».
  - Dato que faltaba (N.º 52): «los numero de registros oscilan entre 6 o 7 caracteres, con tu propuesta de utilizar "?" siento que todos los registros que sean de 6 caracteres van a quedar asi: '?XXXXXX'  y eso va a ser un freno para mi, más que una solución».
- **Instrucciones con estructura:** la consigna de siete partes de la clase 5, que uso como equivalente de PEDIR **[confirmar la sigla]**: Anexo D, con los pedidos reescritos y la comparación con los originales.
- **Qué tuve que corregir:** la lectura de hojas reales (orientación, cruces finas, hojas con muchas marcas, hoja vecina en la foto); la regla de puntaje, que dio resultados raros en dos versiones y que el 9 de noviembre, al compararla con mi corrección manual, volví a la del 24 de octubre (METSI-12); el selector de Drive, que abría fuera de la raíz; y el README, que decía que solo se publicaba en Vercel.
- **Qué inventó o erró el asistente:** usó mis datos reales como ejemplo de prueba (N.º 13); indicó un paso de Vercel que no existía (N.º 39); dejó un commit con una prueba fallando (N.º 30); propuso mostrar «?» en registros de 6 dígitos (N.º 52) y enviar recortes de letra a la API de un modelo (N.º 51). Al armar este informe supuso un proceso de corrección examen por examen y que el criterio de aprobación se decide después de ver los puntajes: ambos eran falsos y los corregí yo. **[COMPLETAR si recordás otros]**
- **Decisiones que no le delegué:** que la app no convierta el puntaje en nota (el criterio está fijado de antemano), el puntaje parcial, la identificación obligatoria, qué es un repetido, no enviar imágenes a servicios externos, restringir la clave y probar en producción, y dejar GitHub Pages abierto hasta consultar al profesor.
- **Cifras y normas:** cada cifra de este informe tiene su origen en `valor-y-costo.md` o en el Anexo B. **[VERIFICAR la Ley 25.326 contra el texto oficial antes de citarla.]**

## 6. Pruebas · ~550 palabras

- **Automáticas:** `node tests/run.js`, **115 pruebas, todas en verde** (2026-11-09, con `npm install`). Cubren puntaje, lectura de fotos sintéticas de hojas V1 a V4, dígitos, identificación, CSV, combinación de datos, reintentos, Drive simulado y acceso. Ejemplo de planilla calculada con la función de puntaje: Anexo B, §4.
- **Mi criterio manual contra la app** (pregunta de 1 punto, 4 opciones, peso de las incorrectas 0,33; valores que declaré el 2026-11-09):

  | Caso | Mi criterio | App |
  |---|---|---|
  | 2 correctas (A y B): marcó A y C | 0,5 | 0,5 ✓ |
  | 1 correcta (A): marcó A y C | 0,67 | 0,67 ✓ |
  | 2 correctas (A y B): marcó A, B y C | 0,835 | 0,835 ✓ |
  | 3 correctas (A, B y C): marcó las cuatro | 0,89 | 0,89 ✓ |
  | 2 correctas (A y B): marcó las cuatro | 0,5 | 0,67 ✗ (diferencia abierta) |

  Con la regla anterior («cada incorrecta resta siempre; marcar todas vale 0 si las correctas son la mitad o menos») coincidían 3 de 5; por eso volví a la del 24 de octubre. **[CONFIRMAR si el 0,5 del último caso es mi valor real o una aproximación]**
- **Caso real de la pregunta 8 (N.º 21 y 22):** marcar todas las opciones no debía dar 0 cuando hay varias correctas. **[CONFIRMAR la clave real de esa pregunta antes de citar un valor: con la clave A, B, C, D y descuento 1, marcar las cinco da 0,75.]**
- **Casos que tienen que fallar:** hoja sin nombre ni registro (no deja exportar); mismo registro en dos hojas o mismo nombre con registro faltante (frena); mismo nombre con registros distintos (solo avisa); misma foto cargada dos veces (avisa); foto con una versión de hoja más nueva que la app (avisa); guardado local lleno (aviso persistente); docente que intenta administrar usuarios (rechazado en el servidor).
- **Hojas reales:** las fallas del 2 y del 24 de octubre se detectaron con hojas reales y se corrigieron con pruebas de regresión.
- **Probar desde cero con otra cuenta** y **mostrárselo a alguien ajeno al tema** (consigna §8): **[COMPLETAR quién, cuándo y qué cambié]**.
- **Medición del 18 de noviembre:** **[COMPLETAR resultados, nota final tras el redondeo y precisión real de la lectura del registro]**.
- **Limitaciones:** la lectura del registro no está calibrada con hojas reales (tarea METSI-1 abierta); el umbral del «punto suelto» se deja para revisar con ejemplos reales.

## 7. Riesgos y controles · ~500 palabras

- **Datos personales (Ley 25.326).** La herramienta procesa nombre, registro, letra manuscrita, la foto de cada hoja y los puntajes. Quedan en el Google Drive del docente (en este caso, una cuenta personal) y en el navegador, no en un servidor de la herramienta; Supabase solo guarda email y rol de los docentes y Vercel solo publica la app. **[VERIFICAR el texto de la ley y qué obligaciones aplican (finalidad, seguridad, conservación, proveedor) y consultar con la facultad]**
- **Autorización.** Es una iniciativa mía, consultada con el titular de cátedra; no hay una autorización formal **[VALIDAR antes del primer uso en serio]**.
- **Secreto profesional.** Las notas y los exámenes son confidenciales en la cátedra. Controles: login con roles validados en el servidor; permiso mínimo de Drive (`drive.file`); casos a revisar sin nombre ni registro y con fotos tapadas; lectura del registro sin enviar imágenes. **Limitación:** la copia de GitHub Pages abre sin login; no expone datos guardados, pero cualquiera con la dirección puede usar la herramienta. Quedó pendiente de lo que diga el profesor.
- **Conservación.** Con la copia impresa, elimino las fotos y los resultados del Drive una vez que las notas fueron subidas y firmadas por el titular **[VALIDAR si ya lo aplico; la herramienta no borra sola]**.
- **Si se equivoca, quién responde.** La herramienta calcula y marca lo dudoso, pero nunca decide sola: el registro es una sugerencia que confirmo, no exporta hojas sin identificar, frena repetidos y el criterio de aprobación lo aplico yo en Excel. **Respondo yo, como docente que corrige;** las notas las firma el titular de cátedra.
- **Incidente real.** La API key del selector de Drive quedó en un repositorio público y Google la detectó a los 10 segundos (`LEAKED_CREDENTIALS`, solo notificó). La restringí a mis dos sitios y a la API del selector; el proyecto no tiene facturación, así que no puede generar cargos. Lección: una clave que debe ser pública se restringe **antes** de subirla. Cronología y evidencia en el Anexo G.
- **Planes gratuitos (clase 13).** Supabase pausa el proyecto tras una semana sin actividad y el login dejaría de funcionar hasta reactivarlo; el plan Hobby de Vercel es solo para uso personal y no comercial **[VALIDAR si una cátedra califica]**.
- **Riesgos abiertos.** GitHub Pages sin login; la sesión de un usuario dado de baja vale hasta una hora; el token de sesión se guarda en una cookie que escribe el navegador; la nota libre de los casos a revisar y el nombre del archivo de la foto pueden contener datos personales; los datos de alumnos están en una cuenta personal y sin borrado automático; la lectura del registro no está calibrada con hojas reales, y un registro mal confirmado podría asignar una nota a otro alumno.

## 8. Valor y costo · ~350 palabras

- **Valor.** El ahorro es de tiempo. A mano, un turno de 80 alumnos me lleva entre 5 h 20 min y 6 h 40 min (estimación, sección 1). El ahorro sale de corregir y sumar sin pilas ni carillas, de no ordenar los exámenes por registro y de no volver a tipear lo que la hoja trae escrito y la app identifica. **[COMPLETAR el 18/11: tiempo por hoja con la herramienta, ahorro por turno y turnos por año]**
- **Otros beneficios, no medidos en minutos:** criterio de puntaje uniforme, control de identificación y repetidos, y la foto de cada hoja como respaldo.
- **Costo.** Licencias: USD 0 (Google Cloud sin facturación; planes gratuitos de GitHub, Vercel y Supabase). Uso de IA: hasta **USD 56,13** en las cinco sesiones de desarrollo (cota superior, porque dos incluyen trabajo ajeno a la herramienta; USD 7,24 en las tres que solo la tocan) **[COMPLETAR si se cobró o está incluido en una suscripción]**. Horas de armado y mantenimiento: **[COMPLETAR]**.
- **Cómo leer las cifras.** Cada una figura con su origen y sus supuestos en `valor-y-costo.md`. Las hipótesis de sensibilidad de ese archivo **no son resultados**.

## 9. Conclusiones y próximos pasos · ~250 palabras

- **Lo que aprendí:** **[COMPLETAR en tus palabras]**. Ideas con respaldo en el registro: lo que no se escribe en un pedido, el asistente lo completa con lo más probable (la restricción de privacidad, los registros de 6 o 7 dígitos); una clave pública se detecta en segundos, así que se restringe antes de subirla; los casos de respuesta conocida detectaron errores que el asistente no vio.
- **Limitaciones:** lectura del registro sin calibrar con hojas reales; el nombre solo se muestra como recorte; GitHub Pages sin login; costos y tiempos sin medir hasta el 18 de noviembre.
- **Qué haría después:** calibrar con hojas reales (METSI-1); aplicar la escala de equivalencias dentro de la app; comparar el CSV con el listado de inscriptos; decidir lo de GitHub Pages según el profesor; medir el ahorro en más de un turno.
- **¿Conviene?** **[COMPLETAR según la medición del 18/11; si no conviene, decilo: es un resultado válido]**.

## 10. Fuentes · ~150 palabras
- Consigna del trabajo final, Diplomatura en IA Aplicada a Entornos Digitales de Gestión, comisión de los martes 2026.
- Clase 5, «El arte de pedir bien: contexto e instrucciones» (`diploiafceuba.vercel.app/05`); clases 12 y 13 (`/12`, `/13`). Consultadas el 2026-11-09.
- Backlog.md (`github.com/MrLesk/Backlog.md`), consultado el 2026-11-01 **[VALIDAR la fecha]**.
- Aviso de Google Cloud sobre la clave pública, recibido el 2026-11-08.
- Ley 25.326 de Protección de los Datos Personales **[VERIFICAR el texto oficial y anotar la fecha de consulta]**.
- Documentación de Google Picker y Drive API, Supabase y Vercel **[COMPLETAR solo las que cites, con fecha]**.

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
- [ ] Revisar que las cifras del informe coincidan con las de la solución (115 pruebas, 4 a 5 minutos, 80 alumnos, USD 56,13).
- [ ] Verificar que no quede ningún dato real de una persona, ni en los datos ni en las capturas ni en el historial del repositorio (buscar el nombre y el registro del autor en todo el repo).
- [ ] Nombrar los archivos como pide la consigna y armar el `.zip` con la carpeta del proyecto, sin `node_modules`, sin claves ni contraseñas.
