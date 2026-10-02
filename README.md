# METSI · Corrector de multiple choice

App web para corregir exámenes multiple choice en papel a partir de una foto de la hoja de respuestas.
Se usa desde el navegador del celular o de la PC. Los resultados se sincronizan con Google Drive para verlos desde cualquier dispositivo.

## Cómo se usa

1. **Examen**: cargá título, cantidad de preguntas, opciones por pregunta (2 a 6), casilleros del número de registro y las modalidades de cursada. Marcá las respuestas correctas de cada pregunta (puede haber varias) y su puntaje.
2. **Hoja**: imprimí la hoja de respuestas. Es de tamaño **A5** y se imprimen **2 por hoja A4** apaisada (después se corta por la mitad). Es la misma para todos los alumnos del examen.
   En la pestaña **Hoja** podés personalizar el encabezado (línea de materia/comisión/fecha), las etiquetas, las instrucciones del pie y poner tu **logo**. Los textos largos se ajustan solos y la grilla no se modifica, así la lectura de las fotos siempre funciona.
   El alumno escribe a mano su **nombre y apellido**, su **número de registro** (en los casilleros) y la **fecha**, marca su **modalidad de cursada** y rellena las burbujas de las respuestas **con birome**. Al pie, la hoja aclara que en caso de diferencias prevalecen las respuestas marcadas en la grilla.
3. **Corregir**: sacá una foto de cada hoja (entera, en vertical, bien iluminada) o elegí fotos de la galería. La app lee las marcas de respuesta y la modalidad, y calcula el puntaje. El nombre y el registro son manuscritos: la app los **recorta de la foto y los muestra** para que los cargues mirando la imagen. Señala lo dudoso para que lo revises.
   - **Identificación obligatoria:** cada hoja necesita **nombre o registro** cargado (la modalidad puede faltar). Mientras haya hojas sin ninguno de los dos, la app no deja descargar ni copiar los resultados.
   - **Repetidos:** si el **registro** coincide con el de otra hoja (con el mismo nombre, con otro o sin nombre), o el **nombre** coincide y a una le falta el registro, la app frena y pregunta si son personas distintas, si es la misma hoja cargada dos veces, o si hay que corregir el dato. El mismo nombre con registros distintos solo avisa (pueden ser homónimos). Los nombres se comparan sin importar mayúsculas, tildes ni espacios de más.
   - **Foto repetida:** avisa si cargás el mismo archivo dos veces, y también si una foto parece ser **el mismo papel fotografiado otra vez** (compara la letra del nombre y del registro).
4. **Resultados**: tabla con puntajes y aciertos por pregunta. Se descarga como CSV (Excel en español o Google Sheets) o se copia para pegar directo en una planilla.
5. **Drive**: sincronización entre celular y PC (ver abajo).

La app **no decide quién aprueba**: solo calcula el puntaje. El criterio de aprobación se aplica después sobre la planilla.

## Puntaje

- Cada pregunta tiene un puntaje propio, que se **reparte en partes iguales entre sus respuestas correctas**.
- Se admite **puntaje parcial**: cada opción correcta marcada suma su parte, aunque no se marquen todas.
- Cada opción incorrecta marcada resta una fracción de lo que vale una opción correcta. Esa fracción es un **número entre 0 y 1 que elegís** en la pestaña Examen (0 = no resta; 1 = cada incorrecta anula un acierto; el valor inicial de un examen nuevo es 0,33). Una pregunta nunca baja de 0. Con 0, marcar todas las opciones da el puntaje completo, y la app lo avisa. Ejemplo con 0,33: pregunta de 1 punto con correctas B y C; marcando solo B y C se recibe 1, marcando B, C y una incorrecta 0,835 y marcando A–E 0,505.
- En pantalla y en el CSV los puntajes se muestran con hasta 3 decimales.
- Una pregunta sin ninguna respuesta correcta definida se considera **anulada** y suma sus puntos a todos.

## Versiones de la hoja

La hoja lleva una versión impresa al pie ("V2") y un código de 3 cuadraditos que la app lee sola, así cada foto se interpreta con el diseño que le corresponde:

- **V1** (sin código): las primeras hojas impresas. Solo se **leen**; la app ya no las genera. Su geometría está congelada y una prueba (`tests/fixtures/layout-v1.json`) evita que cambie por error.
- **V2**: más espacio para escribir el nombre, campo de fecha, leyendas al pie y código de versión.

Si una foto trae una versión más nueva que la que conoce la app, avisa que hay que actualizarla en vez de leerla mal. Se pueden mezclar hojas V1 y V2 en una misma tanda.

## Capacidad de la hoja A5

Hasta ~38 preguntas con 5 opciones, o ~57 con 4 opciones (según cuántas modalidades haya). La app avisa si te pasás.

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

## Cómo sacar buenas fotos

- Hoja completa, con las 4 marcas negras de las esquinas visibles.
- Luz pareja, sin sombras fuertes. Hoja apoyada en una mesa y lo más plana posible.
- Los alumnos deben rellenar el círculo con **birome** (no lápiz). Las cruces y marcas parciales se leen; las muy tenues quedan señaladas como dudosas.

## Desarrollo

Los archivos de la app se cargan con un número de versión (`?v=…`, visible arriba en la app) para que el navegador no use copias viejas. **Después de cambiar código o estilos, correr `node tools/version.js`**; una prueba avisa si se olvidó.

```
node tools/version.js  # actualiza el número de versión de los archivos
node tests/run.js      # pruebas: puntaje, lectura de fotos sintéticas, CSV, combinación de datos y Drive simulado
```

- `js/layout.js`: geometría de la hoja (compartida por el generador y el lector).
- `js/sheet.js`: genera la hoja imprimible (SVG).
- `js/scanner.js`: detecta las marcas de esquina, corrige la perspectiva, mide el relleno de cada burbuja y recorta los campos manuscritos.
- `js/scoring.js`: cálculo de puntajes.
- `js/csv.js`: exportación.
- `js/merge.js`: combina los datos de dos dispositivos.
- `js/identity.js`: reglas de identificación y duplicados, y detección del mismo archivo.
- `js/similar.js`: parecido de letra entre fotos (misma hoja fotografiada dos veces).
- `js/drive.js`: cliente de la API de Google Drive.
- `tools/version.js`: calcula y aplica el número de versión.
- `js/app.js`, `index.html`, `css/style.css`: interfaz.
