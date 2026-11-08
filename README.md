# METSI · Corrector de multiple choice

App web para corregir exámenes multiple choice en papel a partir de una foto de la hoja de respuestas.
Se usa desde el navegador del celular o de la PC. Los resultados se sincronizan con Google Drive para verlos desde cualquier dispositivo.

## Cómo se usa

1. **Examen**: cargá título, cantidad de preguntas, opciones por pregunta (2 a 6), casilleros del número de registro y las modalidades de cursada. Marcá las respuestas correctas de cada pregunta (puede haber varias) y su puntaje.
2. **Hoja**: imprimí la hoja de respuestas. Es de tamaño **A5** y se imprimen **2 por hoja A4** apaisada (después se corta por la mitad). Es la misma para todos los alumnos del examen.
   En la pestaña **Hoja** podés personalizar el encabezado (línea de materia/comisión/fecha), las etiquetas, las instrucciones del pie y poner tu **logo**. Los textos largos se ajustan solos y la grilla no se modifica, así la lectura de las fotos siempre funciona.
   El alumno escribe a mano su **nombre y apellido**, su **número de registro** (en los casilleros) y la **fecha**, marca su **modalidad de cursada** y rellena las burbujas de las respuestas **con birome**. Al pie, la hoja aclara que en caso de diferencias prevalecen las respuestas marcadas en la grilla.
3. **Corregir**: sacá una foto de cada hoja (entera, en vertical, bien iluminada) o elegí fotos de la galería. La app lee las marcas de respuesta y la modalidad, y calcula el puntaje. El nombre y el registro son manuscritos: la app los **recorta de la foto y los muestra** para que los cargues mirando la imagen. Señala lo dudoso para que lo revises.
   - **Lectura sugerida del registro:** la app intenta leer los dígitos de los casilleros y te muestra la lectura al lado del recorte. Es solo una **sugerencia**: el campo queda vacío y la hoja sigue sin identificar hasta que vos tocás **✓ Es correcto** (o escribís el número). Si hay un dígito dudoso o un casillero vacío, el botón pasa a **Usar y revisar**: carga lo leído (con «?» donde falte un dígito entre otros) y te deja el cursor en el campo para corregirlo mirando la imagen. Abajo de la lista aparece cuánto acertó la app en tus hojas.
   - El nombre sigue siendo manual (la lectura automática es solo del registro).
   - **Identificación obligatoria:** cada hoja necesita **nombre o registro** cargado (la modalidad puede faltar). Mientras haya hojas sin ninguno de los dos, la app no deja descargar ni copiar los resultados.
   - **Repetidos:** si el **registro** coincide con el de otra hoja (con el mismo nombre, con otro o sin nombre), o el **nombre** coincide y a una le falta el registro, la app frena y pregunta si son personas distintas, si es la misma hoja cargada dos veces, o si hay que corregir el dato. El mismo nombre con registros distintos solo avisa (pueden ser homónimos). Los nombres se comparan sin importar mayúsculas, tildes ni espacios de más.
   - **Foto repetida:** avisa si cargás el mismo archivo dos veces, y también si una foto parece ser **el mismo papel fotografiado otra vez** (compara la letra del nombre y del registro).
4. **Resultados**: tabla con puntajes y aciertos por pregunta. Se descarga como CSV (Excel en español o Google Sheets) o se copia para pegar directo en una planilla.
5. **Drive**: sincronización entre celular y PC (ver abajo).

La app **no decide quién aprueba**: solo calcula el puntaje. El criterio de aprobación se aplica después sobre la planilla.

## Cómo se lee el registro (y sus límites)

- La lectura corre **dentro del navegador, sin enviar nada a ningún servicio externo**: una red neuronal chica (`js/digit-model.js`, unos 150 KB) mira cada casillero por separado. Se entrena con `python3 tools/train-digits.py --mnist <carpeta>` (MNIST más variaciones: trazo fino o grueso, escritura rotada o corrida, restos del borde, 7 con barrita y 1 con base).
- Un casillero sin tinta queda **vacío** (no se inventa un dígito). Los registros pueden tener un dígito menos que casilleros (6 o 7 en 7 casilleros): los vacíos de los **extremos** (al principio o al final) son normales y no se cuentan. Un vacío **entre** dígitos se muestra como «?», y si quedan menos dígitos que casilleros menos uno, la lectura se marca para revisar. Si la red no está segura, o duda entre dos dígitos, queda **dudoso** y se resalta.
- **Precisión medida:** con dígitos manuscritos de MNIST dibujados sobre fotos sintéticas de hojas V1 a V4 (perspectiva, ruido, borde impreso) acierta cerca del 99 % de los casilleros y los errores quedan casi siempre marcados como dudosos. Es una prueba **optimista**: son dígitos de otra población y dibujados por computadora. Con birome real, letra apurada o dígitos que se salen del casillero va a fallar más. Por eso nunca se carga solo: la medida que vale es la línea «acertó X de Y casilleros» que muestra la app con tus hojas reales.
- Límites conocidos: un dígito pegado o cruzado con el borde del casillero, o una foto con el borde desalineado más de ~1 mm, se leen peor.

## Casos a revisar (para mejorar la lectura)

- En cada hoja hay un botón **🚩 Marcar a revisar** (con una nota opcional) y una **🚩 por pregunta**, para avisar que la app leyó algo mal. Una foto que la app no pudo leer también se puede marcar.
- La app guarda lo que leyó **por su cuenta**; si después corregís una respuesta a mano, queda marcada con **✎**. Esas diferencias son lo más útil para calibrar.
- En **Resultados → Casos a revisar** aparece la lista, y se puede **descargar en JSON**. Con Drive conectado, se guardan solos en `METSI Corrector / <examen> / a-revisar`: un `casos.json` (puntajes de cada burbuja, geometría, tus correcciones y notas) y la **foto de cada hoja con el nombre, el registro y la fecha tapados**. Los casos no incluyen nombres ni registros.
- Una foto que la app no pudo leer no se puede tapar (no se sabe dónde está el nombre), así que **solo se sube si vos lo pedís** con "Enviar esta foto a análisis" y confirmás el aviso.

## Puntaje

- Cada pregunta tiene un puntaje propio, que se **reparte en partes iguales entre sus respuestas correctas**.
- Se admite **puntaje parcial**: cada opción correcta marcada suma su parte, aunque no se marquen todas.
- Cada opción incorrecta marcada resta una fracción de lo que vale una opción correcta. Esa fracción es un **número entre 0 y 1 que elegís** en la pestaña Examen (0 = no resta; 1 = cada incorrecta anula un acierto; el valor inicial de un examen nuevo es 0,33). Una pregunta nunca baja de 0. Ejemplo con 0,33: pregunta de 1 punto con correctas B y C; marcando solo B y C se recibe 1, marcando B, C y una incorrecta 0,835. **Marcar todas las opciones vale 0** cuando las correctas son la mitad o menos de las opciones (con 5 opciones: 1 o 2 correctas; con 4: 1 o 2); si hay más correctas, se aplica la fórmula normal (con 5 opciones y 4 correctas, marcarlas todas da 0,9175).
- En pantalla y en el CSV los puntajes se muestran con hasta 3 decimales.
- Una pregunta sin ninguna respuesta correcta definida se considera **anulada** y suma sus puntos a todos.

## Versiones de la hoja

La hoja lleva una versión impresa al pie ("V2") y un código de 3 cuadraditos que la app lee sola, así cada foto se interpreta con el diseño que le corresponde:

- **V1** (sin código; cuatro cuadrados): las primeras hojas impresas. Solo se **leen**; la app ya no las genera. Su geometría está congelada y una prueba (`tests/fixtures/layout-v1.json`) evita que cambie por error.
- **V2**: más espacio para escribir el nombre, campo de fecha, leyendas al pie y código de versión.
- **V3**: igual que la V2, pero las **marcas de las esquinas tienen forma propia**: cuadrados a la izquierda y barras a la derecha (misma superficie negra). Así cada esquina se identifica sola, la orientación de la hoja (al derecho o dada vuelta) se deduce de las formas, y una mancha o la marca de otra hoja no se confunde con una esquina.

- **V4** (la que genera la app hoy): igual que la V3 más una **banda de ejemplos al pie**, separada de la grilla, que muestra la forma correcta de marcar (círculo pintado por completo, con birome) y las incorrectas (tilde, cruz, punto y medio relleno). Reemplaza a la línea "Rellená el círculo por completo con birome" de las versiones anteriores (en la pestaña Hoja, "Instrucciones del pie" solo se imprime si escribís un texto propio). La banda ocupa lugar: entran menos preguntas.

Las versiones V1, V2 y V3 **no se pueden cambiar** (una prueba por versión fija sus posiciones), así que las hojas ya impresas se siguen leyendo igual.

Si una foto trae una versión más nueva que la que conoce la app, avisa que hay que actualizarla en vez de leerla mal. Se pueden mezclar hojas V1 y V2 en una misma tanda.

## Capacidad de la hoja A5

Hoja V4: hasta **32 preguntas con 5 opciones**, o **48 con 4 opciones** (con dos modalidades; menos si hay más filas de modalidades). La app avisa si te pasás. Las hojas V3 ya impresas admiten hasta 38 y 57.

## Sincronización con Google Drive

Se guarda una carpeta por examen: `METSI Corrector / <examen> / ` con las fotos de las hojas (`hoja-….jpg`), `datos.json` (lo que usa la app) y `resultados.csv` (para abrir directo en Sheets). La app solo accede a los archivos que ella misma crea (permiso `drive.file`).

Con la misma cuenta de Google se puede:
- cargar hojas desde el celular y verlas, corregirlas o descargar el CSV desde la PC (y al revés);
- abrir un examen anterior desde la pestaña **Drive → Ver exámenes en Drive**;
- empezar un examen nuevo conservando la configuración.

Si se edita lo mismo en dos dispositivos, para cada hoja gana el cambio más reciente. Mientras haya una sesión de Google abierta (dura ~1 hora), los cambios suben solos; si no, tocá **Sincronizar**.

### Configuración (una sola vez)

1. Publicá la app en una dirección **https** (por ejemplo GitHub Pages, Netlify o Cloudflare Pages). El inicio de sesión de Google no funciona abriendo `index.html` desde el disco.
2. En <https://console.cloud.google.com> creá un proyecto, habilitá **Google Drive API**, configurá la pantalla de consentimiento (tipo Externo, agregándote como usuario de prueba) y creá un **ID de cliente OAuth** de tipo *Aplicación web*, con la dirección de la app como *origen de JavaScript autorizado*.
3. En la app, pestaña **Drive**, pegá el ID de cliente y tocá **Conectar con Google**. Repetilo en cada dispositivo (el ID se guarda en ese navegador). También se puede dejar fijo en `js/config.js`.

Sin esa configuración la app funciona igual, pero los resultados quedan solo en el dispositivo donde se cargaron (descargá el CSV para conservarlos).

### Elegir fotos desde Drive

Si sacás las fotos con el celular y las subís a una carpeta de Drive, en **Corregir** tocá **☁ Elegir fotos desde Drive**: se abre el selector de Google, entrás a la carpeta y marcás las fotos (**Ctrl+A** marca todas las de la carpeta). La app solo recibe permiso sobre las fotos que marcaste (sigue usando `drive.file`, no ve el resto de tu Drive) y las baja de a una, con los mismos reintentos que la sincronización.

Elegir la carpeta en sí no alcanza: Google no da acceso a lo que tiene adentro, por eso hay que abrirla y marcar las fotos.

**Configuración (una sola vez)**, en el mismo proyecto de Google Cloud de la sección anterior:
1. Habilitá **Google Picker API**.
2. En *Credenciales* creá una **clave de API** y restringila a la Picker API y a la dirección de la app.
3. Copiá el **número de proyecto** (Project number).
4. Pegalos en `js/config.js` como `METSI_GOOGLE_API_KEY` y `METSI_GOOGLE_APP_ID`. No son secretos.

Mientras estén vacíos, el botón avisa qué falta.

## Cómo sacar buenas fotos

Hay una guía corta para imprimir junto al examen en [`docs/guia-de-uso.md`](docs/guia-de-uso.md).

- Hoja completa, con las 4 marcas negras de las esquinas visibles.
- Luz pareja, sin sombras fuertes. Hoja apoyada en una mesa y lo más plana posible.
- Si imprimiste dos hojas por A4 y no las cortaste, se puede fotografiar igual: la app elige la hoja que está completa en la foto (la otra puede verse cortada o a un costado). Conviene que la hoja a corregir quede entera y lo más centrada posible.
- Los alumnos deben rellenar el círculo con **birome** (no lápiz). Las cruces y marcas parciales se leen. Un punto suelto cuenta como respuesta si mide al menos ~1 mm; entre ~0,8 mm queda señalado como dudoso y un puntito menor se ignora. La tinta se mide en un círculo de 1,2 mm alrededor del centro de cada burbuja.

## Calibrar la lectura con casos reales

Las pruebas usan fotos sintéticas. Para ajustar la lectura con hojas reales:

1. En **Resultados → Casos a revisar** tocá **Descargar casos (JSON)** (o bajá `casos.json` de la carpeta `a-revisar` del examen en Drive). No trae nombres ni registros: solo los puntajes de cada burbuja y tus correcciones.
2. Copiá ese archivo a `tests/fixtures/real/` (podés sumar varios). Corregí a mano las respuestas mal leídas antes de descargarlo: esa es la respuesta correcta que se usa. Las preguntas con 🚩 que no corregiste se omiten.
3. `node tools/calibrar.js` muestra cuántas preguntas lee mal hoy la app y cuántas leería mal con cada umbral de sensibilidad, para elegir el valor por defecto con datos reales.
4. `node tests/run.js` incluye esos casos: falla si la lectura deja de coincidir con tus correcciones.

## Acceso con usuario y contraseña (Supabase + Vercel)

La app publicada en Vercel pide **email y contraseña**. Sin sesión no se sirve ningún archivo de la app (`index.html`, `js/`, `css/`): lo valida una función de Vercel (`api/app.js`), no la pantalla. Solo `/login` es público. El repositorio de GitHub sigue siendo público: el código se puede leer allí, pero no usar la app publicada.

- **Roles**: `admin` (gestiona usuarios desde la pestaña **👥 Usuarios**) y `docente`. El rol vive en `app_metadata.role` de Supabase, que el usuario no puede modificar. Las acciones de administración (`api/users.js`) se validan en el servidor.
- **Baja de usuarios**: al desactivar o borrar a alguien, su sesión actual sigue valiendo hasta una hora (lo que dura el token); después no puede entrar.
- **Los datos de los exámenes** siguen yendo al Google Drive de quien sincroniza (ver arriba). Supabase solo controla quién entra.

### Configuración (una sola vez)

1. En **supabase.com** creá un proyecto. En **Authentication → Providers → Email** desactivá "Allow new users to sign up" (así nadie se registra solo) y, si querés, "Confirm email".
2. Creá tu usuario en **Authentication → Users → Add user** (con "Auto Confirm User") y hacelo admin en el **SQL Editor**:
   ```sql
   update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}' where email = 'tu@email.com';
   ```
3. En **vercel.com → Add New → Project**, importá este repositorio. Dejá el preset en "Other" y no cambies el resto (`vercel.json` ya define la salida).
4. En **Settings → Environment Variables** del proyecto cargá (todas con alcance Production y Preview):
   - `SUPABASE_URL`: Project Settings → API → Project URL.
   - `SUPABASE_ANON_KEY`: la clave `anon` / publishable.
   - `SUPABASE_SERVICE_ROLE_KEY`: la clave `service_role` / secret. **Es secreta: solo va en Vercel, nunca en el código ni en el navegador.**
   - `SUPABASE_JWT_SECRET` (solo si tu proyecto de Supabase usa el secreto JWT antiguo HS256; si usa claves asimétricas, no la cargues).
5. Hacé un nuevo deploy, entrá a la URL de Vercel, ingresá con tu usuario y creá los docentes desde **👥 Usuarios**.

## Desarrollo

Los archivos de la app se cargan con un número de versión (`?v=…`, visible arriba en la app) para que el navegador no use copias viejas. **Después de cambiar código o estilos, correr `node tools/version.js`**; una prueba avisa si se olvidó.

```
node tools/version.js  # actualiza el número de versión de los archivos
npm install            # una vez: dependencias de las funciones de Vercel (login y usuarios)
node tests/run.js      # pruebas (acceso y roles incluidos): puntaje, lectura de fotos sintéticas y casos reales, CSV, combinación de datos, reintentos y Drive simulado
```

- `js/layout.js`: geometría de la hoja (compartida por el generador y el lector).
- `js/sheet.js`: genera la hoja imprimible (SVG).
- `js/scanner.js`: detecta las marcas de esquina, corrige la perspectiva, mide el relleno de cada burbuja y recorta los campos manuscritos.
- `js/scoring.js`: cálculo de puntajes.
- `js/csv.js`: exportación.
- `js/merge.js`: combina los datos de dos dispositivos.
- `js/review.js`: casos a revisar (banderas, correcciones a mano) y su exportación.
- `js/identity.js`: reglas de identificación y duplicados, y detección del mismo archivo.
- `js/similar.js`: parecido de letra entre fotos (misma hoja fotografiada dos veces).
- `js/drive.js`: cliente de la API de Google Drive (reintenta cortes de red y errores 408, 429 y 5xx; ante un 401 pide un token nuevo).
- `js/retry.js`: reintentos con espera creciente.
- `js/auth.js`: token de Google (se reutiliza, se renueva solo antes de vencer y avisa cuando hace falta volver a iniciar sesión).
- `js/photostore.js`: copia local (IndexedDB) de las fotos que todavía no se subieron a Drive.
- `tools/version.js`: calcula y aplica el número de versión.
- Interfaz (`index.html`, `css/style.css` y los `js/app*.js`, que comparten lo común por `window.MetsiApp`):
  - `js/app-core.js`: estado, almacenamiento local y utilidades compartidas.
  - `js/app-exam.js`: pestañas «Examen» y «Hoja».
  - `js/app-scan.js`: pestaña «Corregir» (fotos, lectura, duplicados, casos a revisar).
  - `js/app-results.js`: pestaña «Resultados» y exportación a CSV.
  - `js/app-drive.js`: pestaña «Drive» y sincronización.
  - `js/app.js`: pestañas y arranque.
