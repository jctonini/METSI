# Anexo F · Cómo rehacer METSI Corrector, paso por paso (ítem 7)

> **Para quién es:** una persona con conocimientos básicos de informática que quiere armar la herramienta desde cero, con o sin asistente de IA. Todo lo que figura acá sale del repositorio (`https://github.com/jctonini/METSI`) y se puede verificar contra el código; donde un dato depende de tu cuenta o de tus hojas, se aclara. **No incluye hojas de alumnos ni datos reales.** Versión de referencia: 115 pruebas automáticas en verde (2026-11-08).

---

## 0. Qué hace falta

| Qué | Para qué | Costo |
|---|---|---|
| Una computadora con **Node.js 20 o más** y **Git** | Correr las pruebas y publicar | Gratis |
| Cuenta de **GitHub** | Guardar el código; publicar una copia sin login (GitHub Pages) | Plan gratuito |
| Cuenta de **Vercel** | Publicar la app con login | Plan gratuito (el Hobby es para uso personal y no comercial) |
| Cuenta de **Supabase** | Usuarios, contraseñas y roles | Plan gratuito (pausa el proyecto tras una semana sin actividad) |
| Cuenta de **Google** y un proyecto de **Google Cloud** (sin facturación) | Sincronizar con Drive y elegir fotos desde Drive | Sin cargo dentro de las cuotas gratuitas |
| **Python 3** con `numpy` y `scipy` | **Solo** si querés reentrenar el lector de dígitos | Gratis |
| Un asistente de IA (opcional) | Escribir el código; ver el paso 12 | Según el servicio |

---

## 1. Obtener el código y comprobar que anda

```bash
git clone https://github.com/jctonini/METSI.git
cd METSI
npm install
node tests/run.js
```

Tiene que terminar con **«115 pasaron, 0 fallaron»**. Sin `npm install`, falla solo la prueba de acceso (`tests/access.js`), porque le falta el módulo de Supabase. La app del navegador **no tiene dependencias**: `package.json` solo trae las que usan las funciones de Vercel (`@supabase/supabase-js` y `jose`).

---

## 2. Cómo está armada

```
HOJA (papel)            FOTO (celular)             REVISIÓN (docente)         SALIDA
layout.js  sheet.js  →  scanner.js  digits.js  →   identity.js  similar.js →  csv.js
geometría y SVG         lee marcas y registro      review.js                   resultados.csv
scoring.js (puntaje)    ────────── interfaz: index.html + js/app-*.js ──────────
drive.js auth.js picker.js photostore.js merge.js  (sincronización y copia local)
api/ server/  (solo el login con Supabase, en Vercel)
```

- **Todo corre en el navegador**: el servidor (funciones de Vercel) solo valida la sesión y administra usuarios. La lectura de fotos, el puntaje y la lectura de dígitos no usan servicios externos.
- **Cada módulo se puede probar en Node** (la mayoría usa el patrón «UMD», que funciona en el navegador y en Node). La interfaz comparte lo común por `window.MetsiApp`.
- La pantalla tiene cinco pestañas: **Examen**, **Hoja**, **Corregir**, **Resultados** y **Drive**; más **Usuarios**, solo para administradores.

---

## 3. La hoja de respuestas (`js/layout.js`, `js/sheet.js`)

1. **Tamaño:** A5 vertical (148 × 210 mm); se imprimen dos por hoja A4 apaisada y se corta por la mitad.
2. **Una sola geometría** (`layout.js`) la usan el generador de la hoja y el lector de fotos, así las burbujas siempre coinciden.
3. **Elementos:** cuatro marcas negras en las esquinas, una grilla de burbujas (de 2 a 6 opciones por pregunta), una fila de **modalidad**, **7 casilleros** (hasta 9) para el número de registro, espacios para nombre y fecha, y un **código de versión** de tres cuadraditos más el texto «Vx» al pie.
4. **Versiones:** V1 a V4. **Las versiones ya impresas no se cambian** (una prueba por versión fija sus posiciones en `tests/fixtures/layout-v*.json`). La V3 hace que las marcas de la izquierda sean cuadrados y las de la derecha, barras, para que la orientación se deduzca sola; la V4 agrega una banda de ejemplos de cómo marcar bien y mal.
5. **Capacidad de la V4 (A5):** 32 preguntas con 5 opciones o 48 con 4 (con dos modalidades). La app avisa si te pasás.
6. **Generar e imprimir:** pestaña **Hoja**; se pueden personalizar encabezado, etiquetas, leyendas y logo sin tocar la grilla.

---

## 4. Leer la foto (`js/scanner.js`)

El lector recibe la imagen (conviene lado mayor de ~1600 px) y el layout, y hace esto:

1. **Escala de grises y binarización** de la foto; **componentes conectados** para encontrar manchas negras.
2. **Busca las cuatro marcas** de esquina (`findMarkers`, `findSheet`), deduce **la orientación** (al derecho o dada vuelta) y **la versión** de la hoja (`detectVersion`). Si la foto trae una versión más nueva que la que conoce la app, avisa en vez de leer mal.
3. **Corrige la perspectiva:** calcula la transformación de la foto a la hoja (`solveHomography`, `applyH`).
4. **Mide la tinta** de cada burbuja en un círculo de 1,2 mm alrededor del centro, respecto del nivel del papel y de una línea base de las burbujas vacías de esa foto (`bubbleStats`, `darkness`).
5. **Decide** (`interpret`) qué burbujas cuentan como marcadas según una **sensibilidad** (normal 0,085; alta 0,05; baja 0,16). Un punto de ~1 mm o más cuenta; entre ~0,8 y ~1 mm queda como dudoso.
6. **Recorta** nombre y registro (`cropRegion`) para que el docente los lea al lado de los campos.

---

## 5. Sugerir el número de registro (`js/digits.js`, `js/digit-model.js`)

1. Cada casillero se recorta por separado, se le saca el borde impreso, se centra y escala a 28 × 28 como MNIST.
2. Una **red neuronal chica (784 → 128 → 64 → 10)**, entrenada con MNIST más variaciones de una foto real (`tools/train-digits.py`), clasifica cada dígito. Los pesos van cuantizados en `js/digit-model.js` (~150 KB, generado: no se edita a mano).
3. Un casillero **sin tinta queda vacío**; si la red duda, queda **dudoso**. Con 7 casilleros, los vacíos de los **extremos** no cuentan (los registros tienen 6 o 7 dígitos).
4. El resultado es **una sugerencia**: el registro queda vacío hasta que el docente toca «Es correcto» o lo escribe. **Nunca se carga solo.**
5. Para reentrenar: `python3 tools/train-digits.py --mnist <carpeta con los 4 archivos idx> --epochs 30`. Las semillas son fijas.

---

## 6. Puntaje (`js/scoring.js`)

- El puntaje de cada pregunta se **reparte en partes iguales** entre sus respuestas correctas; cada correcta marcada suma su parte (puntaje parcial).
- Las incorrectas **solo restan por las marcas que exceden la cantidad de correctas**: cada marca de más resta `penalty` × el valor de una correcta (`penalty` va de 0 a 1; vale 0,33 en un examen nuevo). Marcar tantas opciones como correctas hay no resta. **Una pregunta nunca baja de 0.** No hay una regla especial para «marcar todas».
- Sin correctas definidas, la pregunta se anula y da el puntaje completo a todos.
- Devuelve puntaje, máximo y porcentaje. **No convierte el puntaje en nota ni decide quién aprueba.**

---

## 7. Identificar alumnos y evitar repetidos (`js/identity.js`, `js/similar.js`)

- Cada hoja necesita **nombre o registro**; si falta, no se puede exportar.
- **Mismo registro** (con el mismo nombre, otro o sin nombre) o **mismo nombre con registro faltante**: la app **frena** y pregunta si son personas distintas, la misma hoja o un dato a corregir.
- **Mismo nombre con registros distintos**: solo avisa (puede ser un homónimo). Los nombres se comparan sin mayúsculas, tildes ni espacios de más.
- **Misma foto cargada dos veces** (huella del archivo) o **mismo papel fotografiado de nuevo** (parecido del mapa de tinta de la letra): avisa.

---

## 8. Guardar y sincronizar

1. **En el navegador:** el estado del examen va a `localStorage` (con aviso si se llena, `js/storage.js`); las fotos que todavía no se subieron, a `IndexedDB` (`js/photostore.js`).
2. **En Google Drive** (permiso `drive.file`): una carpeta por examen, `METSI Corrector / <examen> /`, con `datos.json`, `resultados.csv` y `hoja-<id>.jpg`. Si se edita en dos dispositivos, **gana el cambio más reciente de cada hoja** (`js/merge.js`).
3. **Reintentos** con espera creciente ante cortes de red o errores 408, 429 y 5xx (`js/retry.js`); el token de Google se renueva solo antes de vencer (`js/auth.js`).
4. **Cargar fotos desde Drive** con el selector de Google (`js/picker.js`): elegir una carpeta **no** habilita lo que tiene adentro; hay que abrirla y marcar las fotos (Ctrl+A marca todas).

---

## 9. Casos a revisar y calibración

1. En cada hoja hay una bandera 🚩 y otra por pregunta. La app guarda lo que leyó **por su cuenta** y marca con ✎ lo que el docente corrigió.
2. **Resultados → Casos a revisar** descarga un `casos.json` **sin nombres ni registros** y, con Drive conectado, lo guarda con las fotos **con nombre, registro y fecha tapados** (`js/review.js`).
3. Para calibrar la lectura con hojas reales: copiar los `casos.json` a `tests/fixtures/real/` (con las respuestas mal leídas ya corregidas a mano) y correr `node tools/calibrar.js`.

---

## 10. Publicar con login (Supabase + Vercel)

1. **Supabase:** crear un proyecto. En *Authentication → Providers → Email* desactivar **«Allow new users to sign up»**.
2. Crear el primer usuario en *Authentication → Users → Add user* (con «Auto Confirm User») y hacerlo administrador en el *SQL Editor*:
   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'
   where email = 'tu@email.com';
   ```
3. **Vercel:** *Add New → Project*, importar el repositorio, dejar el preset en «Other». `vercel.json` ya define la salida (`public/` solo trae el login; todo lo demás pasa por `api/app.js`, que solo sirve la app con una sesión válida).
4. En *Settings → Environment Variables* (alcance Production y Preview) cargar: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (**secreta**: solo va en Vercel, nunca en el código ni en el navegador) y, solo si el proyecto usa el secreto JWT antiguo, `SUPABASE_JWT_SECRET`.
5. Volver a desplegar, entrar a la dirección de Vercel y crear los docentes desde la pestaña **Usuarios**.
6. **Comprobar:** en una ventana privada, sin sesión, `/`, `/js/app.js` y `/css/style.css` tienen que redirigir al login o responder «Sesión no válida».

> La copia de **GitHub Pages** no ejecuta `api/`, así que abre **sin login**. Es una decisión a tomar según el uso.

---

## 11. Configurar Google Cloud (Drive y selector)

1. En <https://console.cloud.google.com> crear un proyecto. **No vincularle una cuenta de facturación.**
2. Habilitar **Google Drive API** y **Google Picker API**.
3. Configurar la pantalla de consentimiento (tipo Externo, agregándote como usuario de prueba) y crear un **ID de cliente OAuth** de tipo *Aplicación web*, con **cada dirección de la app** como *origen de JavaScript autorizado* (la de producción y, si se usa, la de GitHub Pages). **Las direcciones de vista previa de Vercel no sirven: dan el error `origin_mismatch`.**
4. Crear una **clave de API** y **restringirla antes de subirla al repositorio**: *Sitios web* con las direcciones de la app terminadas en `/*`, y *API* solo **Google Picker API**. (Una clave pública sin restringir se detecta en segundos: ver la sección 7 del informe.)
5. Copiar el **número de proyecto**.
6. Cargar el ID de cliente, la clave y el número en `js/config.js` (`METSI_GOOGLE_CLIENT_ID`, `METSI_GOOGLE_API_KEY`, `METSI_GOOGLE_APP_ID`). No son secretos, pero la clave tiene que estar restringida.

---

## 12. Cómo se construyó, en orden (y cómo pedírselo a un asistente)

Se hizo en siete tramos, cada uno con un pedido al asistente, un plan antes de los cambios grandes y pruebas. Los pedidos textuales están en el Anexo C; dos de ellos, reescritos con la consigna de siete partes de la clase 5, en `instrucciones-para-el-modelo.md`.

| Tramo | Fecha | Qué se construyó | Archivos principales |
|---|---|---|---|
| 1 | 1 oct | Hoja A5, lectura de la foto, puntaje con parcial, exportación | `layout.js`, `sheet.js`, `scanner.js`, `scoring.js`, `csv.js` |
| 2 | 1 oct | Sincronización con Drive y publicación | `drive.js`, `app-drive.js` |
| 3 | 2 oct | Identificación obligatoria, repetidos, hoja V2 | `identity.js`, `similar.js` |
| 4 | 24 oct | Hojas V3 y V4, banderas, regla de «marcar todas» (reemplazada el 9 de nov por la de marcas en exceso, METSI-12) | `layout.js`, `review.js`, `scoring.js` |
| 5 | 1 nov | Backlog.md, reintentos, módulos, guía de uso | `retry.js`, `auth.js`, `photostore.js`, `app-*.js` |
| 6 | 7 nov | Login con roles | `api/`, `server/`, `public/login.*`, `account.js`, `app-users.js` |
| 7 | 8 nov | Selector de Drive, selección múltiple, lectura del registro | `picker.js`, `selection.js`, `digits.js`, `digit-model.js` |

**Método que funcionó:** pedir **el plan primero y esperar la aprobación**, hacer **un tramo por vez**, correr `node tests/run.js` después de cada cambio, probar con **hojas reales** y reportar los errores con el mensaje exacto. Después de cambiar código o estilos, correr `node tools/version.js` (una prueba falla si se olvida).

---

## 13. Qué no se puede rehacer sin datos propios

- **Las hojas reales** con las que se calibró la lectura **no están en el repositorio** (contienen datos de alumnos). Con hojas inventadas la lectura se prueba con fotos sintéticas (`tests/synth.js`); la **calibración con hojas reales** hay que hacerla con las propias (paso 9).
- **La clave de respuestas y la configuración** de cada examen las carga el docente.
- **El criterio de aprobación** (de nota o de aprobación) **no está en la herramienta**: se aplica en la planilla.

## 14. Problemas conocidos al rehacerla

| Síntoma | Causa y arreglo |
|---|---|
| Error `origin_mismatch` al conectar con Google | Se abrió la app desde una dirección que no figura en los orígenes autorizados (por ejemplo, una vista previa de Vercel). Usar la dirección de producción o agregarla |
| El selector de Drive da error 403 | La restricción de la clave no incluye esa dirección (con `/*`) o no incluye Picker API |
| El login no responde después de una semana sin uso | Supabase pausó el proyecto gratuito: reactivarlo desde el panel |
| La app vieja sigue apareciendo | El navegador guardó copias viejas: correr `node tools/version.js`, publicar y recargar con Ctrl+F5 |
| `tests/access.js` falla | Falta `npm install` |
| El registro sale con «?» | Hay un hueco entre dígitos; los vacíos de los extremos no cuentan |
