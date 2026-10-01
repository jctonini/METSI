# METSI · Corrector de multiple choice

App web para corregir exámenes multiple choice en papel a partir de una foto de la hoja de respuestas.
Corre entera en el navegador (celular o compu): no hay servidor y las fotos no salen del dispositivo.

## Cómo se usa

1. **Examen**: cargá título, cantidad de preguntas, opciones por pregunta (2 a 6), dígitos del número de registro y las modalidades de cursada. Marcá las respuestas correctas de cada pregunta (puede haber varias) y su puntaje.
2. **Hoja**: imprimí la hoja de respuestas en A4 al 100% (o guardala como PDF). Es la misma para todos los alumnos del examen. Cada alumno completa su nombre y rellena número de registro, modalidad y respuestas.
3. **Corregir**: sacá una foto de cada hoja (entera, en vertical, bien iluminada) o elegí fotos de la galería. La app lee las marcas, muestra el puntaje y señala lo dudoso para que lo revises.
4. **Resultados**: tabla con puntajes y aciertos por pregunta. Se descarga como CSV (Excel en español o Google Sheets) o se copia para pegar directo en una planilla.

La app **no decide quién aprueba**: solo calcula el puntaje. El criterio de aprobación se aplica después sobre la planilla.

## Puntaje

- Cada pregunta tiene un puntaje propio, que se **reparte en partes iguales entre sus respuestas correctas**.
- Se admite **puntaje parcial**: cada opción correcta marcada suma su parte, aunque no se marquen todas.
- Cada opción incorrecta marcada descuenta su parte (configurable: una parte completa, media parte o nada). Una pregunta nunca baja de 0.
- Una pregunta sin ninguna respuesta correcta definida se considera **anulada** y suma sus puntos a todos.

## Cómo usarla

- Abrir `index.html` en el navegador funciona directamente.
- Para usarla desde el celular conviene publicarla (por ejemplo con GitHub Pages sobre este repositorio) y abrir la dirección en el teléfono.
- La configuración y los resultados quedan guardados en el navegador donde se usa la app (no se sincronizan entre dispositivos). Descargá el CSV para conservarlos.

## Cómo sacar buenas fotos

- Hoja completa, con las 4 marcas negras de las esquinas visibles.
- Luz pareja, sin sombras fuertes. Hoja apoyada en una mesa y lo más plana posible.
- Los alumnos deben rellenar el círculo con birome o lápiz oscuro. Las cruces y marcas parciales se leen, pero las muy tenues quedan señaladas como dudosas.

## Desarrollo

```
node tests/run.js      # pruebas (puntaje, lectura de fotos sintéticas, CSV)
```

- `js/layout.js`: geometría de la hoja (compartida por el generador y el lector).
- `js/sheet.js`: genera la hoja imprimible (SVG).
- `js/scanner.js`: detecta las marcas de esquina, corrige la perspectiva y mide el relleno de cada burbuja.
- `js/scoring.js`: cálculo de puntajes.
- `js/csv.js`: exportación.
- `js/app.js`, `index.html`, `css/style.css`: interfaz.
