# METSI · Corrector de multiple choice

App web para corregir exámenes multiple choice en papel a partir de una foto de la hoja de respuestas. Se usa desde el navegador del celular o de la PC.

- Lee las **respuestas marcadas** y la **modalidad de cursada**, y calcula el puntaje (con puntaje parcial y penalización configurable).
- Propone el **número de registro** leyendo los casilleros a mano alzada, sin enviar nada a servicios externos; vos lo confirmás o lo corregís.
- Avisa de **repetidos** (mismo alumno cargado dos veces, misma foto) y no deja exportar hojas sin identificar.
- Los resultados se sincronizan con **Google Drive** para verlos desde cualquier dispositivo, y el acceso es con **usuario y contraseña**.

La app **no decide quién aprueba**: solo calcula el puntaje. El criterio de aprobación se aplica después sobre la planilla.

**Índice:** [Cómo se usa](#cómo-se-usa) · [Cómo sacar buenas fotos](#cómo-sacar-buenas-fotos) · [Puntaje](#puntaje) · [Lectura del registro](#lectura-del-registro) · [Casos a revisar](#casos-a-revisar) · [La hoja](#la-hoja) · [Puesta en marcha](#puesta-en-marcha) · [Drive](#sincronización-con-google-drive) · [Calibración](#calibrar-la-lectura-con-casos-reales) · [Desarrollo](#desarrollo)

---

## Cómo se usa

1. **Examen**: cargá título, cantidad de preguntas, opciones por pregunta (2 a 6), casilleros del número de registro y modalidades de cursada. Marcá las respuestas correctas de cada pregunta (puede haber varias) y su puntaje.
2. **Hoja**: imprimí la hoja de respuestas, igual para todos los alumnos del examen. Es **A5**: se imprimen **2 por hoja A4** apaisada y después se corta por la mitad. En la pestaña **Hoja** podés personalizar el encabezado (materia/comisión/fecha), las etiquetas, las instrucciones del pie y poner tu **logo**. Los textos largos se ajustan solos y la grilla no cambia, así la lectura de las fotos siempre funciona.
   - **El alumno** escribe a mano su **nombre y apellido**, su **número de registro** (un dígito por casillero) y la **fecha**, marca su **modalidad** y rellena las burbujas **con birome**. Al pie, la hoja aclara que ante diferencias prevalecen las respuestas marcadas en la grilla.
3. **Corregir**: sacá una foto de cada hoja (ver [consejos](#cómo-sacar-buenas-fotos)) o elegí fotos de la galería o de Drive. La app lee las respuestas y la modalidad, calcula el puntaje y **señala lo dudoso** para que lo revises. El nombre y el registro son manuscritos: la app los **recorta de la foto** y te los muestra al lado de los campos. Ver [qué controla](#qué-controla-corregir) antes de exportar.
4. **Resultados**: tabla con puntajes y aciertos por pregunta. Se descarga como CSV (Excel en español o Google Sheets) o se copia para pegar directo en una planilla.
5. **Drive**: sincronización entre celular y PC ([ver abajo](#sincronización-con-google-drive)).

### Qué controla «Corregir»

- **Registro sugerido:** la app lee los casilleros y muestra su lectura junto al recorte. Es solo una **sugerencia**: el campo queda vacío y la hoja sigue sin identificar hasta que tocás **✓ Es correcto** o escribís el número. Si hay dígitos dudosos o faltantes, el botón pasa a **Usar y revisar**: carga lo leído y te deja el cursor en el campo para corregir mirando la imagen. Detalles y límites en [Lectura del registro](#lectura-del-registro). El **nombre** sigue siendo manual.
- **Identificación obligatoria:** cada hoja necesita **nombre o registro** cargado (la modalidad puede faltar). Mientras haya hojas sin ninguno de los dos, la app no deja descargar ni copiar los resultados.
- **Repetidos:** si el **registro** coincide con el de otra hoja (con el mismo nombre, con otro o sin nombre), o el **nombre** coincide y a una le falta el registro, la app frena y pregunta si son personas distintas, si es la misma hoja cargada dos veces o si hay que corregir el dato. El mismo nombre con registros distintos solo avisa (pueden ser homónimos). Los nombres se comparan sin importar mayúsculas, tildes ni espacios de más.
- **Foto repetida:** avisa si cargás el mismo archivo dos veces y también si una foto parece ser **el mismo papel fotografiado otra vez** (compara la letra del nombre y del registro).
- **Selección:** podés marcar varias hojas y quitarlas a la vez.

---

## Cómo sacar buenas fotos

Hay una guía corta para imprimir junto al examen en [`docs/guia-de-uso.md`](docs/guia-de-uso.md).

- Hoja **completa, en vertical**, con las 4 marcas negras de las esquinas visibles.
- **Luz pareja**, sin sombras fuertes, con la hoja apoyada en una mesa y lo más plana posible.
- Si imprimiste dos hojas por A4 y no las cortaste, se puede fotografiar igual: la app elige la hoja que está completa en la foto. Conviene que la hoja a corregir quede entera y lo más centrada posible.
- Los alumnos deben rellenar el círculo con **birome** (no lápiz). Las cruces y marcas parciales se leen.
- Cuánto cuenta un punto suelto: **desde ~1 mm** cuenta como respuesta, **entre ~0,8 y ~1 mm** queda señalado como dudoso y uno menor se ignora. La tinta se mide en un círculo de 1,2 mm alrededor del centro de cada burbuja.

---

## Puntaje

- Cada pregunta tiene un puntaje propio, que se **reparte en partes iguales entre sus respuestas correctas**.
- Se admite **puntaje parcial**: cada opción correcta marcada suma su parte, aunque no se marquen todas.
- Cada opción **incorrecta** marcada resta una fracción de lo que vale una opción correcta. Esa fracción es un número entre 0 y 1 que elegís en la pestaña Examen (0 = no resta; 1 = cada incorrecta anula un acierto; un examen nuevo arranca en 0,33). **Una pregunta nunca baja de 0.**
- Una pregunta sin ninguna respuesta correcta definida se considera **anulada** y suma sus puntos a todos.
- En pantalla y en el CSV los puntajes se muestran con hasta 3 decimales.

Ejemplo con penalización 0,33 y una pregunta de 1 punto con correctas B y C:

| Marcó | Recibe |
|---|---|
| B y C | 1 |
| B, C y una incorrecta | 0,835 |

**Marcar todas las opciones vale 0** cuando las correctas son la mitad o menos de las opciones (con 5 opciones: 1 o 2 correctas; con 4: 1 o 2). Si hay más correctas se aplica la fórmula normal: con 5 opciones y 4 correctas, marcarlas todas da 0,9175.

---

## Lectura del registro

La lectura corre **dentro del navegador, sin enviar nada a ningún servicio externo**: una red neuronal chica (`js/digit-model.js`, unos 150 KB) mira cada casillero por separado.

- **Vacíos:** un casillero sin tinta queda vacío (no se inventa un dígito). Los registros pueden tener un dígito menos que casilleros (**6 o 7 en 7 casilleros**): los vacíos de los **extremos** (al principio o al final) son normales y no se cuentan. Un vacío **entre** dígitos se muestra como «?», y si quedan menos dígitos que casilleros menos uno, la lectura se marca para revisar.
- **Dudosos:** si la red no está segura, o duda entre dos dígitos, el dígito se resalta.
- **Precisión medida:** con dígitos manuscritos de MNIST dibujados sobre fotos sintéticas de hojas V1 a V4 (perspectiva, ruido, borde impreso), acierta cerca del **99 %** de los casilleros y los errores casi siempre quedan marcados como dudosos.
- **Es una prueba optimista:** son dígitos de otra población y dibujados por computadora. Con birome real, letra apurada o dígitos que se salen del casillero va a fallar más. Por eso **nunca se carga sola**. La medida que vale es la línea «acertó X de Y casilleros» que muestra la app en Corregir con tus hojas reales.
- **Límites conocidos:** un dígito pegado o cruzado con el borde del casillero, o una foto con el borde desalineado más de ~1 mm, se leen peor.

Cómo reentrenar el modelo: ver [Desarrollo](#desarrollo).

---

## Casos a revisar

Sirven para avisar que la app leyó algo mal y mejorar la lectura.

- En cada hoja hay un botón **🚩 Marcar a revisar** (con una nota opcional) y una **🚩 por pregunta**. Una foto que la app no pudo leer también se puede marcar.
- La app guarda lo que leyó **por su cuenta**; si después corregís una respuesta a mano, queda marcada con **✎**. Esas diferencias son lo más útil para calibrar.
- En **Resultados → Casos a revisar** aparece la lista, que se puede **descargar en JSON**. Con Drive conectado se guardan solos en `METSI Corrector / <examen> / a-revisar`: un `casos.json` (puntajes de cada burbuja, geometría, tus correcciones y notas) y la **foto de cada hoja con el nombre, el registro y la fecha tapados**.
- **Privacidad:** los casos no incluyen nombres, registros (ni cargados ni sugeridos) ni recortes de la foto.
- Una foto que la app no pudo leer no se puede tapar (no se sabe dónde está el nombre), así que **solo se sube si vos lo pedís** con «Enviar esta foto a análisis» y confirmás el aviso.

---

## La hoja

La hoja lleva una versión impresa al pie (por ejemplo «V4») y un código de 3 cuadraditos que la app lee sola, así cada foto se interpreta con el diseño que le corresponde. Se pueden mezclar hojas de distintas versiones en una misma tanda.

| Versión | Qué cambia |
|---|---|
| **V1** | Las primeras hojas impresas: sin código de versión y con cuatro cuadrados en las esquinas. Solo se **leen**; la app ya no las genera. |
| **V2** | Más espacio para escribir el nombre, campo de fecha, leyendas al pie y código de versión. |
| **V3** | Igual que la V2, pero las **marcas de las esquinas tienen forma propia**: cuadrados a la izquierda y barras a la derecha (misma superficie negra). Cada esquina se identifica sola, la orientación (al derecho o dada vuelta) se deduce de las formas, y una mancha o la marca de otra hoja no se confunde con una esquina. |
| **V4** | La que genera la app hoy. Igual que la V3 más una **banda de ejemplos al pie**, separada de la grilla, que muestra cómo marcar bien (círculo pintado por completo, con birome) y mal (tilde, cruz, punto, medio relleno). Reemplaza a la línea «Rellená el círculo por completo con birome» (en la pestaña Hoja, «Instrucciones del pie» solo se imprime si escribís un texto propio). La banda ocupa lugar: entran menos preguntas. |

- Las versiones V1, V2 y V3 **no se pueden cambiar**: una prueba por versión fija sus posiciones (por ejemplo `tests/fixtures/layout-v1.json`), así que las hojas ya impresas se siguen leyendo igual.
- Si una foto trae una versión más nueva que la que conoce la app, avisa que hay que actualizarla en vez de leerla mal.

**Capacidad (A5, hoja V4):** hasta **32 preguntas con 5 opciones**, o **48 con 4 opciones** (con dos modalidades; menos si hay más filas de modalidades). La app avisa si te pasás. Las hojas V3 ya impresas admiten hasta 38 y 57.

---

## Puesta en marcha

Configuración que se hace **una sola vez**, en este orden: primero el acceso (Vercel + Supabase) y después, si querés sincronizar, Google Drive. Sin Drive la app funciona igual, pero los resultados quedan solo en el dispositivo donde se cargaron (descargá el CSV para conservarlos).

### Acceso con usuario y contraseña (Supabase + Vercel)

La app publicada en Vercel pide **email y contraseña**. Sin sesión no se sirve ningún archivo de la app (`index.html`, `js/`, `css/`): lo valida una función de Vercel (`api/app.js`), no la pantalla. Solo `/login` es público. El repositorio de GitHub sigue siendo público: el código se puede leer allí, pero no usar la app publicada.

- **Roles:** `admin` (gestiona usuarios desde la pestaña **👥 Usuarios**) y `docente`. El rol vive en `app_metadata.role` de Supabase, que el usuario no puede modificar. Las acciones de administración (`api/users.js`) se validan en el servidor.
- **Baja de usuarios:** al desactivar o borrar a alguien, su sesión actual sigue valiendo hasta una hora (lo que dura el token); después no puede entrar.
- **Los datos de los exámenes** van al Google Drive de quien sincroniza. Supabase solo controla quién entra.

Pasos:

1. En **supabase.com** creá un proyecto. En **Authentication → Providers → Email** desactivá «Allow new users to sign up» (así nadie se registra solo) y, si querés, «Confirm email».
2. Creá tu usuario en **Authentication → Users → Add user** (con «Auto Confirm User») y hacelo admin en el **SQL Editor**:
   ```sql
   update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}' where email = 'tu@email.com';
   ```
3. En **vercel.com → Add New → Project**, importá este repositorio. Dejá el preset en «Other» y no cambies el resto (`vercel.json` ya define la salida).
4. En **Settings → Environment Variables** cargá (todas con alcance Production y Preview):
   - `SUPABASE_URL`: Project Settings → API → Project URL.
   - `SUPABASE_ANON_KEY`: la clave `anon` / publishable.
   - `SUPABASE_SERVICE_ROLE_KEY`: la clave `service_role` / secret. **Es secreta: solo va en Vercel, nunca en el código ni en el navegador.**
   - `SUPABASE_JWT_SECRET`: solo si tu proyecto de Supabase usa el secreto JWT antiguo (HS256). Si usa claves asimétricas, no la cargues.
5. Hacé un nuevo deploy, entrá a la URL de Vercel, ingresá con tu usuario y creá los docentes desde **👥 Usuarios**.

### Google Drive (sincronización)

1. Necesitás la app publicada en una dirección **https** (la de Vercel): el inicio de sesión de Google no funciona abriendo `index.html` desde el disco.
2. En <https://console.cloud.google.com> creá un proyecto, habilitá **Google Drive API**, configurá la pantalla de consentimiento (tipo Externo, agregándote como usuario de prueba) y creá un **ID de cliente OAuth** de tipo *Aplicación web*, con la dirección de la app como *origen de JavaScript autorizado*.
3. En la app, pestaña **Drive**, pegá el ID de cliente y tocá **Conectar con Google**. Repetilo en cada dispositivo (el ID se guarda en ese navegador). También se puede dejar fijo en `js/config.js`.

### Elegir fotos desde Drive (opcional)

Requiere, en el mismo proyecto de Google Cloud:

1. Habilitar **Google Picker API**.
2. En *Credenciales*, crear una **clave de API** y restringirla a la Picker API y a la dirección de la app.
3. Copiar el **número de proyecto** (Project number).
4. Pegar la clave y el número en `js/config.js` como `METSI_GOOGLE_API_KEY` y `METSI_GOOGLE_APP_ID`. No son secretos.

Mientras estén vacíos, el botón avisa qué falta.

---

## Sincronización con Google Drive

Se guarda una carpeta por examen, `METSI Corrector / <examen> /`, con las fotos de las hojas (`hoja-….jpg`), `datos.json` (lo que usa la app) y `resultados.csv` (para abrir directo en Sheets). La app solo accede a los archivos que ella misma crea (permiso `drive.file`).

Con la misma cuenta de Google se puede:

- cargar hojas desde el celular y verlas, corregirlas o descargar el CSV desde la PC (y al revés);
- abrir un examen anterior desde la pestaña **Drive → Ver exámenes en Drive**;
- empezar un examen nuevo conservando la configuración.

Si se edita lo mismo en dos dispositivos, para cada hoja gana el cambio más reciente. Mientras haya una sesión de Google abierta (dura ~1 hora) los cambios suben solos; si no, tocá **Sincronizar**.

### Cargar las fotos desde una carpeta de Drive

Si sacás las fotos con el celular y las subís a Drive, en **Corregir** tocá **☁ Elegir fotos desde Drive**: se abre el selector de Google, entrás a la carpeta y marcás las fotos (**Ctrl+A** marca todas las de la carpeta). La app las baja de a una, con los mismos reintentos que la sincronización, y solo recibe permiso sobre las fotos que marcaste (sigue usando `drive.file`, no ve el resto de tu Drive).

Elegir la carpeta en sí no alcanza: Google no da acceso a lo que tiene adentro, por eso hay que abrirla y marcar las fotos. Para activarlo, ver [Elegir fotos desde Drive](#elegir-fotos-desde-drive-opcional) en Puesta en marcha.

---

## Calibrar la lectura con casos reales

Las pruebas usan fotos sintéticas. Para ajustar la lectura con hojas reales:

1. En **Resultados → Casos a revisar** tocá **Descargar casos (JSON)** (o bajá `casos.json` de la carpeta `a-revisar` del examen en Drive). No trae nombres ni registros: solo los puntajes de cada burbuja y tus correcciones.
2. Copiá ese archivo a `tests/fixtures/real/` (podés sumar varios). **Corregí a mano las respuestas mal leídas antes de descargarlo**: esa es la respuesta correcta que se usa. Las preguntas con 🚩 que no corregiste se omiten.
3. `node tools/calibrar.js` muestra cuántas preguntas lee mal hoy la app y cuántas leería mal con cada umbral de sensibilidad, para elegir el valor por defecto con datos reales.
4. `node tests/run.js` incluye esos casos: falla si la lectura deja de coincidir con tus correcciones.

---

## Desarrollo

```bash
npm install            # una vez: dependencias de las funciones de Vercel (login y usuarios)
node tests/run.js      # pruebas: puntaje, lectura de fotos sintéticas y casos reales, registro, CSV, combinación de datos, reintentos, Drive simulado, acceso y roles
node tools/version.js  # actualiza el número de versión de los archivos
```

**Después de cambiar código o estilos, correr `node tools/version.js`.** Los archivos se cargan con un número de versión (`?v=…`, visible arriba en la app) para que el navegador no use copias viejas, y una prueba avisa si se olvidó.

**Reentrenar el lector de dígitos** (solo si cambia el modelo): hace falta Python con `numpy` y `scipy`, y los cuatro archivos `idx` de MNIST descomprimidos en una carpeta.

```bash
python3 tools/train-digits.py --mnist <carpeta-con-mnist> --epochs 30
```

Regenera `js/digit-model.js` y `tests/fixtures/digits-sample.json`. Entrena con MNIST más variaciones propias de una foto real: trazo fino o grueso, escritura rotada o corrida, restos del borde del casillero, 7 con barrita y 1 con base. Las semillas son fijas: con los mismos datos da el mismo modelo.

**Tareas pendientes:** se llevan con Backlog.md en `backlog/`. Usar el comando `backlog` y no editar a mano los archivos `.md` de tareas.

### Mapa de archivos

**Hoja y lectura**
- `js/layout.js`: geometría de la hoja, compartida por el generador y el lector.
- `js/sheet.js`: genera la hoja imprimible (SVG).
- `js/scanner.js`: detecta las marcas de esquina, corrige la perspectiva, mide el relleno de cada burbuja y recorta los campos manuscritos.
- `js/digits.js`: lee los dígitos del registro (preparación del casillero y clasificación).
- `js/digit-model.js`: pesos de la red de dígitos. **Generado** por `tools/train-digits.py`: no editar a mano.
- `js/scoring.js`: cálculo de puntajes.

**Revisión, identificación y exportación**
- `js/identity.js`: reglas de identificación y duplicados, y detección del mismo archivo.
- `js/similar.js`: parecido de letra entre fotos (misma hoja fotografiada dos veces).
- `js/review.js`: casos a revisar (banderas, correcciones a mano) y su exportación.
- `js/selection.js`: selección de hojas en Corregir.
- `js/csv.js`: exportación a CSV.

**Datos, Drive y sesión**
- `js/merge.js`: combina los datos de dos dispositivos.
- `js/storage.js`: guardado local que avisa si falla (por ejemplo, almacenamiento lleno).
- `js/photostore.js`: copia local (IndexedDB) de las fotos que todavía no se subieron a Drive.
- `js/drive.js`: cliente de la API de Google Drive (reintenta cortes de red y errores 408, 429 y 5xx; ante un 401 pide un token nuevo).
- `js/retry.js`: reintentos con espera creciente.
- `js/auth.js`: token de Google (se reutiliza, se renueva solo antes de vencer y avisa cuando hace falta volver a iniciar sesión).
- `js/picker.js`: selector de fotos de Google Drive (Google Picker).
- `js/config.js`: ID de cliente de Google y claves públicas del selector.
- `js/account.js`: sesión del usuario en la app (cookie, quién está conectado, salir).

**Interfaz** (`index.html`, `css/style.css` y los `js/app*.js`, que comparten lo común por `window.MetsiApp`)
- `js/app-core.js`: estado, almacenamiento local y utilidades compartidas.
- `js/app-exam.js`: pestañas «Examen» y «Hoja».
- `js/app-scan.js`: pestaña «Corregir» (fotos, lectura, registro sugerido, duplicados, casos a revisar).
- `js/app-results.js`: pestaña «Resultados» y exportación a CSV.
- `js/app-drive.js`: pestaña «Drive» y sincronización.
- `js/app-users.js`: pestaña «Usuarios» (solo admin).
- `js/app.js`: pestañas y arranque.
- `js/version.js`: número de versión. **Generado** por `tools/version.js`.

**Servidor (Vercel)**
- `api/app.js`: sirve la app solo con sesión válida. `api/users.js`: administración de usuarios (solo admin). `api/config.js`: datos públicos de Supabase para el navegador.
- `server/auth.js`: verificación de la sesión de Supabase.
- `public/login.*`: pantalla de ingreso (lo único público).

**Herramientas y pruebas**
- `tools/version.js`: calcula y aplica el número de versión.
- `tools/calibrar.js`: calibración con casos reales (ver arriba).
- `tools/train-digits.py`: entrena el lector de dígitos.
- `tests/run.js`: todas las pruebas. `tests/access.js`: acceso y roles con Supabase simulado. `tests/synth.js`: fotos sintéticas de hojas. `tests/mockdrive.js`: Drive simulado. `tests/fixtures/`: geometría congelada de V1 a V3, dígitos de muestra y (opcional) casos reales.
