# Diccionario de datos · METSI Corrector

Describe cada dato que guarda la app, dónde vive, qué significa y si es un dato personal. Sale de leer el código (`js/app-core.js`, `js/app-scan.js`, `js/app-drive.js`, `js/app-results.js`, `js/review.js`, `js/scoring.js`, `js/layout.js`, `js/merge.js`, `api/users.js`) y se puede verificar contra él. Los ejemplos usan **datos inventados**.

Convenciones: las opciones de respuesta se guardan como números desde 0 (0 = A, 1 = B, …; hasta 6 opciones, A a F); las marcas de tiempo son milisegundos desde 1970 (`Date.now()`); «docente» es quien usa la app.

---

## 1. Dónde vive cada dato

| Dónde | Nombre | Contenido | Quién lo ve |
|---|---|---|---|
| Navegador (localStorage) | `metsi.corrector.v1` | Todo el estado del examen en curso (sección 2) | Quien usa ese navegador |
| Navegador (localStorage) | `metsi.settings.v1` | Ajustes del dispositivo: `clientId` (ID de cliente de Google) | Quien usa ese navegador |
| Navegador (IndexedDB) | base `metsi.fotos`, almacén `fotos` | Copia de las fotos que todavía no se subieron a Drive | Quien usa ese navegador |
| Navegador (cookie) | `metsi-at` | Token de sesión de Supabase (login) | El navegador; lo valida el servidor |
| Google Drive del docente | `METSI Corrector / <examen> / datos.json` | Estado completo del examen (sección 2), sin las hojas ilegibles | Dueño de la cuenta de Google |
| Google Drive del docente | `.../ resultados.csv` | Tabla de resultados (sección 4) | Dueño de la cuenta de Google |
| Google Drive del docente | `.../ hoja-<id>.jpg` | Foto de cada hoja (lado mayor 900 px) | Dueño de la cuenta de Google |
| Google Drive del docente | `.../ a-revisar / casos.json` y fotos tapadas | Casos que el docente marcó para analizar (sección 5) | Dueño de la cuenta de Google |
| Supabase Auth | usuarios | Email, rol y estado de cada docente (sección 6) | Administradores del proyecto |

La app solo accede a los archivos que ella misma crea o que el docente elige en el selector (permiso `drive.file`). Cada carpeta de examen se identifica con `examId`.

---

## 2. Estado del examen (`datos.json` y `metsi.corrector.v1`)

`datos.json` contiene: `version`, `examId`, `examCreatedAt`, `cfg`, `key`, `cfgUpdatedAt`, `cfgHash`, `sheets` (sin las hojas ilegibles) y `deleted`. El estado local además guarda `lastSync` y `driveFolderName`, que **no** se suben.

| Campo | Tipo | Significado | Reglas |
|---|---|---|---|
| `version` | número | Versión del formato de `datos.json` | Hoy 1 |
| `examId` | texto | Identificador del examen | Se genera solo; une el estado local con su carpeta de Drive |
| `examCreatedAt` | número | Cuándo se creó el examen | — |
| `cfg` | objeto | Configuración del examen (sección 2.1) | — |
| `key` | lista | Clave de respuestas: un elemento por pregunta (sección 2.2) | Largo igual a `cfg.numQuestions` |
| `sheets` | lista | Hojas corregidas (sección 2.3) | — |
| `deleted` | objeto | `{ idDeHoja: momento }` de las hojas quitadas | Evita que una hoja borrada reaparezca al combinar dos dispositivos |
| `cfgUpdatedAt` | número | Última vez que cambió `cfg` o `key` | Al combinar dispositivos, gana la configuración más reciente |
| `cfgHash` | texto | Huella de `cfg` y `key` | Detecta si cambiaron |
| `lastSync` | número | Última sincronización con Drive | Solo local |
| `driveFolderName` | texto | Nombre de la carpeta del examen en Drive | Solo local |

### 2.1 Configuración (`cfg`)

| Campo | Tipo | Significado | Valor inicial y reglas |
|---|---|---|---|
| `title` | texto | Título del examen | Vacío; da el nombre del CSV descargado |
| `numQuestions` | entero | Cantidad de preguntas | 10; máximo según la capacidad de la hoja A5 (hoja V4: 32 con 5 opciones o 48 con 4, con dos modalidades) |
| `numOptions` | entero | Opciones por pregunta | 4; de 2 a 6 |
| `regDigits` | entero | Casilleros del número de registro | 7; de 1 a 9 |
| `modalidades` | lista de textos | Modalidades de cursada | «Presencial» y «A distancia»; hasta 8 |
| `penalty` | número | Descuento por cada opción incorrecta marcada, como fracción de lo que vale una opción correcta | 0,33 en un examen nuevo; de 0 a 1 |
| `threshold` | número | Sensibilidad de lectura de marcas | 0,085 (normal); 0,05 (alta) o 0,16 (baja) |
| `thrVersion` | entero | Escala de la sensibilidad | 3; sirve para convertir exámenes guardados con escalas viejas |
| `sheet` | objeto | Textos de la hoja impresa: `subtitle`, `nameLabel`, `regLabel`, `modLabel`, `instructions`, `legal`, `logo` | Vacíos; `logo` es una imagen en texto codificado |

### 2.2 Clave de respuestas (`key[i]`)

| Campo | Tipo | Significado | Reglas |
|---|---|---|---|
| `correct` | lista de enteros | Opciones correctas de la pregunta | Puede haber varias. **Vacía = pregunta anulada**: da el puntaje completo a todos |
| `points` | número | Puntaje de la pregunta | Inicial 1; se reparte en partes iguales entre las opciones correctas |

### 2.3 Hoja corregida (`sheets[i]`)

| Campo | Tipo | Significado | Dato personal |
|---|---|---|---|
| `id` | texto | Identificador de la hoja | No |
| `fileName` | texto | Nombre del archivo de la foto | Depende del nombre que tenga el archivo |
| `fileHash` | texto | Huella de la foto, para detectar la misma foto cargada dos veces | No |
| `failed` | booleano | La foto no se pudo leer | No. Estas hojas **no** van a `datos.json` |
| `error` | texto | Motivo cuando `failed` es verdadero | No |
| `version` | entero | Versión de la hoja impresa (1 a 4), leída del código de 3 cuadraditos | No |
| `nombre` | texto | Nombre y apellido del alumno, **cargado por el docente** | **Sí** |
| `registro` | texto | Número de registro del alumno, confirmado o escrito por el docente. Un hueco entre dígitos queda como «?» | **Sí** |
| `modalidad` | entero o nulo | Índice dentro de `cfg.modalidades` | No (puede faltar) |
| `answers` | lista de listas | Opciones marcadas por pregunta, tal como quedaron tras la revisión | No |
| `autoAnswers` | lista de listas | Lo que leyó la app por su cuenta, para saber qué corrigió el docente | No |
| `autoModalidad` | entero o nulo | Modalidad leída por la app | No |
| `regAuto` | objeto | Sugerencia de registro leída por la red neuronal (sección 2.4) | **Sí** (es una lectura del registro) |
| `crops` | objeto | `name` y `reg`: recortes de la foto con lo escrito a mano, como imagen codificada en texto | **Sí** (letra y datos del alumno) |
| `sig` | objeto | Firma numérica de la letra (`bits`, `w`, `h`) para avisar si se fotografió dos veces el mismo papel | Es un derivado de la letra |
| `scan` | objeto | `H`: transformación de la foto a la hoja, ya escalada a la miniatura; `scores`: medida de tinta de cada burbuja de modalidad (`mod`) y de respuestas (`ans`), 3 decimales | No |
| `fullScale` | número | Escala entre la foto analizada y la miniatura | No |
| `photoId` | texto o nulo | Identificador del archivo `hoja-<id>.jpg` en Drive | No |
| `review` | objeto | Marcas del docente para analizar (sección 2.5) | Puede serlo si el docente escribe datos en la nota |
| `ack` | lista de textos | Ids de otras hojas con las que el docente confirmó «son personas distintas» | No |
| `createdAt`, `updatedAt` | números | Alta y última edición; la más reciente gana al combinar dispositivos | No |
| `appVersion` | texto | Versión de la app que la leyó | No |

### 2.4 Sugerencia de registro (`regAuto`)

| Campo | Tipo | Significado |
|---|---|---|
| `text` | texto | Dígitos leídos, uno por casillero. Un casillero vacío no se completa con un dígito inventado |
| `st` | texto | Una letra por casillero: `k` leído, `u` dudoso, `e` vacío |
| `ok` | booleano | La lectura es segura (sin dudosos ni huecos entre dígitos) |

**Regla clave:** `regAuto` es solo una sugerencia. `registro` queda vacío hasta que el docente confirma («✓ Es correcto» o «Usar y revisar») o lo escribe. Con 7 casilleros, los vacíos de los **extremos** no cuentan, porque los registros tienen 6 o 7 dígitos.

### 2.5 Marcas de revisión (`review`)

| Campo | Tipo | Significado |
|---|---|---|
| `flag` | booleano | La hoja está marcada «a revisar» (🚩) |
| `note` | texto | Nota libre del docente |
| `q` | objeto | `{ númeroDePregunta: verdadero }` para las preguntas marcadas |
| `sendImage` | booleano | El docente pidió enviar a análisis una foto ilegible tal cual |
| `imageFile` | texto | Nombre de la foto tapada subida a `a-revisar` |

---

## 3. Reglas que validan los datos

| Regla | Dónde actúa |
|---|---|
| Cada hoja necesita **nombre o registro**; si falta, no se puede descargar ni copiar el CSV | `js/identity.js`, pestañas Corregir y Resultados |
| Mismo registro (con el mismo nombre, otro nombre o sin nombre) o mismo nombre con registro faltante: la app **frena** y pregunta si son personas distintas, la misma hoja cargada dos veces o un dato a corregir | `js/identity.js` |
| Mismo nombre con registros distintos: **solo avisa** (puede ser un homónimo) | `js/identity.js` |
| Los nombres se comparan sin mayúsculas, tildes ni espacios de más | `js/identity.js` |
| Misma foto cargada dos veces (huella del archivo) o mismo papel fotografiado de nuevo (parecido de letra): avisa | `js/identity.js`, `js/similar.js` |
| Una foto con una versión de hoja más nueva que la que conoce la app: avisa que hay que actualizarla | `js/scanner.js` |
| Si el guardado local falla (almacenamiento lleno), aparece un aviso persistente | `js/storage.js` |
| Rangos de la configuración: 2 a 6 opciones, 1 a 9 dígitos de registro, hasta 8 modalidades, descuento de 0 a 1 | `js/layout.js`, pestaña Examen |
| La app calcula puntajes pero **no decide quién aprueba** | `js/scoring.js` |

### Cálculo del puntaje (`scoring.js`)
- Puntaje de la pregunta ÷ cantidad de correctas = valor de cada opción correcta.
- Cada correcta marcada suma ese valor, aunque no se marquen todas.
- Cada incorrecta marcada resta `penalty` × ese valor. Una pregunta nunca baja de 0.
- Marcar **todas** las opciones vale 0 cuando las correctas son la mitad o menos de las opciones.
- Sin correctas definidas, la pregunta se anula y da el puntaje completo a todos.
- `percent` = puntaje total ÷ puntaje máximo × 100. En pantalla y en el CSV, hasta 3 decimales.

---

## 4. Tabla de resultados (`resultados.csv`)

Una fila por hoja legible, ordenada por registro. En Drive se sube con coma como separador y punto decimal; al descargarla, el docente elige `;` (Excel en español, coma decimal) o `,`. Si hay hojas sin identificar o repetidos sin resolver, **no se puede exportar**.

| Columna | Significado | Dato personal |
|---|---|---|
| `Registro` | Número de registro | **Sí** |
| `Nombre y apellido` | Nombre cargado por el docente | **Sí** |
| `Modalidad` | Texto de la modalidad (vacío si falta) | No |
| `Puntaje` | Puntaje total | No (asociado a un alumno) |
| `Puntaje máximo` | Suma de los puntos de la clave | No |
| `Porcentaje` | Puntaje ÷ máximo × 100 | No (asociado a un alumno) |
| `P1` … `Pn` | Letras marcadas en cada pregunta (por ejemplo `CD`; vacío si no marcó) | No (asociado a un alumno) |
| `Puntos P1` … `Puntos Pn` | Puntos obtenidos en cada pregunta | No (asociado a un alumno) |

### Ejemplo (datos inventados)
Clave: pregunta 1 → A; pregunta 2 → B; pregunta 3 → C y D. Cuatro opciones, 1 punto por pregunta, descuento 0,33. Los puntajes se calcularon con la propia función `scoreSheet` de `js/scoring.js`.

```csv
Registro,Nombre y apellido,Modalidad,Puntaje,Puntaje máximo,Porcentaje,P1,P2,P3,Puntos P1,Puntos P2,Puntos P3
1000001,Alumno Ejemplo Uno,Presencial,3,3,100,A,B,CD,1,1,1
1000002,Alumno Ejemplo Dos,A distancia,2.17,3,72.333,A,BC,C,1,0.67,0.5
1000003,Alumno Ejemplo Tres,Presencial,1.835,3,61.167,B,B,ACD,0,1,0.835
```

- Fila 2: en la pregunta 2 marcó la correcta (B) y una incorrecta (C): 1 − 0,33 = 0,67. En la 3 marcó solo una de las dos correctas: 0,5.
- Fila 3: en la pregunta 3 marcó las dos correctas y una incorrecta (A): 1 − 0,33 × 0,5 = 0,835.

---

## 5. Casos a revisar (`casos.json`)

Se genera desde **Resultados → Casos a revisar** (se descarga) y, con Drive conectado, se guarda solo en `METSI Corrector / <examen> / a-revisar`. Sirve para calibrar la lectura. **No incluye nombres, registros ni recortes.**

| Campo | Significado | Dato personal |
|---|---|---|
| `generado` | Fecha de generación | No |
| `appVersion` | Versión de la app | No |
| `examen` | Datos del examen: `numQuestions`, `numOptions`, `threshold`, `penalty`, `key` | No |
| `casos[].id` | Identificador de la hoja | No |
| `casos[].fileName` | Nombre del archivo de la foto | Depende del nombre del archivo |
| `casos[].failed`, `error` | Foto ilegible y motivo | No |
| `casos[].version`, `appVersion` | Versión de la hoja y de la app | No |
| `casos[].flagged` y `note` | Hoja marcada y nota libre del docente | **La nota puede contener datos personales si el docente los escribe** |
| `casos[].flaggedQuestions` | Preguntas marcadas (desde 1) | No |
| `casos[].edited` | Respuestas que el docente corrigió: `{ q, auto, final }` con letras | No |
| `casos[].modalidad` | `{ auto, final }` | No |
| `casos[].scores`, `H`, `fullScale` | Medida de tinta de cada burbuja, geometría y escala | No |
| `casos[].imageFile` | Foto tapada subida a `a-revisar` | La foto va con nombre, registro y fecha **tapados**; una foto ilegible no se puede tapar y **solo se sube si el docente lo pide** |

---

## 6. Usuarios (Supabase Auth)

Se gestionan desde la pestaña **Usuarios** (solo administradores) con `api/users.js`, que usa la clave de servicio, que existe solo en Vercel.

| Campo | Significado | Dato personal |
|---|---|---|
| `id` | Identificador del usuario | No |
| `email` | Correo del docente | **Sí** (del docente) |
| `role` | `admin` o `docente`. Vive en `app_metadata.role`, que el usuario no puede modificar | No |
| `banned_until` | Si está dado de baja (desactivado) | No |
| contraseña | La gestiona Supabase; no se guarda en la app | — |

Reglas: un administrador no puede desactivarse, degradarse ni borrarse a sí mismo; un docente no puede llamar a las acciones de administración (se valida en el servidor). Al desactivar o borrar a alguien, su sesión actual vale hasta una hora.

---

## 7. Datos personales: resumen

| Dato | Persona | Dónde queda | Observaciones |
|---|---|---|---|
| Nombre y apellido del alumno | Alumno | `datos.json`, `resultados.csv`, navegador | Lo carga el docente |
| Número de registro | Alumno | `datos.json`, `resultados.csv`, navegador | Lo confirma el docente; hay una sugerencia previa en `regAuto` |
| Recortes de la letra (nombre y registro) y firma de la letra | Alumno | `datos.json`, navegador | Sirven para que el docente transcriba y para detectar duplicados |
| Foto completa de la hoja (con nombre, registro y fecha escritos) | Alumno | `hoja-<id>.jpg` en Drive, copia local pendiente en IndexedDB | Es lo más sensible: es la hoja entera |
| Puntajes y respuestas | Alumno (asociados a su nombre o registro) | `datos.json`, `resultados.csv` | — |
| Email y rol del docente | Docente | Supabase Auth | — |
| Token de sesión | Docente | Cookie `metsi-at` | La escribe el navegador con `document.cookie` |

- **Quién accede:** los datos de alumnos van al Google Drive de **quien sincroniza** (no a un servidor de la app). Supabase solo controla quién entra a la app y no recibe datos de alumnos.
- **Lectura del registro:** corre dentro del navegador. **Ningún recorte ni imagen sale del dispositivo** para leerla.
- **Casos a revisar:** se diseñaron sin nombre ni registro, y las fotos van tapadas. El único campo libre es la nota del docente.
- **Con datos de ejemplo:** para el trabajo final se usan hojas **inventadas**; no hay alumnos reales en los datos ni en las capturas.
