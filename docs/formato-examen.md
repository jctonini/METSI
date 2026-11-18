# Formato del archivo de examen (`.json`)

Es el archivo que **exporta e importa la app** (solapa Examen → «Exportar examen» / «Importar examen») y el que **tiene que producir la skill que arma los exámenes**, así la clave, los puntos y el descuento no se vuelven a cargar a mano. Lo lee `js/examfile.js`, que valida todo y avisa todos los errores juntos.

```json
{
  "formato": "metsi-examen",
  "version": 1,
  "titulo": "2do Parcial",
  "preguntas": 4,
  "opciones": 5,
  "penalizacion": 0.33,
  "clave": [
    { "correctas": ["B", "D"], "puntos": 5 },
    { "correctas": ["C"], "puntos": 5 },
    { "correctas": ["A", "C", "D"], "puntos": 5 },
    { "correctas": [], "puntos": 5 }
  ]
}
```

| Campo | Qué es | Reglas |
|---|---|---|
| `formato` | Siempre `"metsi-examen"` | Obligatorio |
| `version` | Siempre `1` | Opcional; si está y no es 1, se rechaza |
| `titulo` | Título del examen | Opcional (si falta, no cambia el actual) |
| `preguntas` | Cantidad de preguntas | Entero desde 1; no puede pasar la capacidad de la hoja con esas opciones (V4: 32 con 5 opciones, 48 con 4, con dos modalidades) |
| `opciones` | Cantidad de opciones por pregunta | Entero de 2 a 6 (letras A a F) |
| `penalizacion` | Descuento por cada opción incorrecta marcada de más | De 0 a 1; si falta, 0,33 |
| `clave` | Una entrada por pregunta, en orden | Tiene que haber exactamente `preguntas` entradas |
| `clave[].correctas` | Letras correctas, como lista (`["B","D"]`) o texto (`"BD"`) | Letras dentro de las opciones; una lista vacía anula la pregunta (da el puntaje completo a todos) |
| `clave[].puntos` | Puntos de la pregunta | Número desde 0, puede tener decimales; se reparte en partes iguales entre las correctas |

Lo que **no** lleva el archivo: modalidades, casilleros del registro, textos de la hoja ni sensibilidad de lectura; eso se sigue configurando en la app. Al importar, si cambia la cantidad de preguntas u opciones y ya hay hojas corregidas, la app avisa que se borran (igual que al cambiarlas a mano).
