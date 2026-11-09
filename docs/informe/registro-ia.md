# Panel de control del informe · estado y pendientes

> Esta es la **única fuente** del estado de los 12 ítems de la consigna y de la lista de pendientes. El texto del informe está en `informe-borrador.md`; los pedidos, en el Anexo C y en los registros brutos. Actualizado el 2026-11-09.

## 1. Qué registros hay

| Tramo | Fechas | Pedidos | Archivo | Pull requests |
|---|---|---|---|---|
| Idea, diseño de la hoja, Drive, publicación | 1 y 2 de oct | N.º 1 a 22 | `registro-ia-bruto.md` | #1, #2, #3 |
| Pruebas con hojas reales, hojas V3 y V4, banderas, regla de puntaje | 24 de oct | N.º 23 a 36 | `registro-ia-bruto.md` | #4, #5, #6 |
| Backlog.md, Drive con reintentos, módulos, guía de uso | 1 de nov | N.º 44 a 46 | `registro-ia-bruto-noviembre.md` | #7, #8 |
| Acceso con usuario y contraseña | 7 de nov | N.º 37 a 43 | `registro-ia-bruto-login.md` | #9 |
| Capacidad, selector de Drive, selección múltiple | 8 de nov | N.º 47 a 50 | `registro-ia-bruto-noviembre.md` | #10, #11, #12 |
| Lectura del registro, README | 8 de nov | N.º 51 a 53 | `registro-ia-bruto-noviembre.md` | #13 |
| Armado del informe, verificaciones y regla de puntaje | 8 y 9 de nov | N.º 54 a 80 | `registro-ia-bruto-sesion-informe.md` | #14, #15, #16 (y tarea METSI-12) |

El orden de los N.º no es cronológico (el login se extrajo antes que las demás sesiones de noviembre); el índice del Anexo C los ordena por fecha. **No se registran** las sesiones que no tocaron la herramienta: armado del examen del 2.º parcial y su guía, la skill de armado de exámenes, la escala de calificación no lineal (4 de oct), el acceso a Drive para el examen (23 de oct) y el trabajo en otro proyecto (EjeZ3D).

## 2. Estado de los 12 ítems

| Ítem | Estado | Dónde está | Qué falta |
|---|---|---|---|
| 1 Problema real | Parcial | Borrador §1 | Medición del 18/11 (horas por turno) |
| 2 Herramienta y costo | Cubierto | Borrador §4 y §8; `valor-y-costo.md` | Aclarar si el uso de IA se cobró; validar si el plan Hobby de Vercel admite una cátedra |
| 3 Instrucciones para el modelo | Cubierto con un equivalente | Borrador §5; `instrucciones-para-el-modelo.md` (Anexo D) | Confirmar si PEDIR es una sigla oral (no aparece en las 16 clases) |
| 4 Datos o documentos | Cubierto | Borrador §4; `diccionario-de-datos.md` (Anexo B) | — |
| 5 Verificación con casos conocidos | Cubierto | Borrador §6 (115 pruebas y 5 casos de mi criterio manual) | Confirmar la clave de la pregunta 8 y el valor 0,5; resultados del 18/11 |
| 6 Autonomía | Cubierto | Borrador §3 (tabla) | — |
| 7 Construcción paso por paso | Cubierto | Borrador §4; `anexo-f-paso-a-paso.md` (Anexo F) | Que una persona ajena la rehaga siguiendo el Anexo F |
| 8 Diccionario de datos | Cubierto | `diccionario-de-datos.md` (Anexo B) | — |
| 9 Instalación en la organización | Cubierto | Borrador §4; `docs/guia-de-uso.md`, `docs/guia-windows.md` | Validar si el mantenimiento seguirá con el asistente |
| 10 Riesgos y datos personales | Casi cubierto | Borrador §7; `incidente-api-key.md` (Anexo G) | Verificar la Ley 25.326; autorización formal; decisión sobre GitHub Pages |
| 11 Uso de IA declarado | Cubierto | Borrador §5; Anexo C; los cuatro registros brutos (N.º 1 a 80) | — |
| 12 Valor estimado | Parcial | Borrador §8; `valor-y-costo.md` | Medición del 18/11, horas de armado, turnos por año |

## 3. Pendientes

**Del autor (datos o decisiones que solo vos tenés):**
1. Nombre y apellido para la portada (ver nombres de archivo en el borrador). No está en el repositorio a propósito.
2. **18 de noviembre:** medir el tiempo y comparar los puntajes y la nota final con la herramienta (plan y plantilla en `valor-y-costo.md` §7).
3. Confirmar el valor real de «marcó las cuatro opciones con dos correctas» (0,5 declarado; la regla da 0,67) y la clave real de la pregunta 8.
4. Qué nota corresponde a los porcentajes intermedios y a los menores de 60 %.
5. Si el uso de IA se cobró o está incluido en una suscripción; horas de armado; fecha de consulta de Backlog.md.
6. Verificar la Ley 25.326 contra el texto oficial; autorización formal de la cátedra; si el plan Hobby de Vercel admite una cátedra; si ya borrás los datos al cerrar las notas.
7. La respuesta del profesor de la diplomatura sobre GitHub Pages sin login, y si PEDIR es una sigla oral.
8. Probar el Anexo F con una persona ajena y mostrarle el diseño a alguien ajeno al tema (consigna §8).
9. Video o cinco capturas con datos inventados (Anexo E). Buscar el nombre y el registro del autor en todo el repositorio antes de armar el `.zip`.

**Del asistente (cuando estén los datos anteriores):** escribir en limpio las secciones 8, 9 y 10 con la medición del 18/11, y actualizar el recuento de pruebas y de pedidos del registro.

**Opcionales:**
- Tráfico por API y por credencial en la consola de Google Cloud (Anexo G).
- Mejoras que quedaron anotadas: aplicar la escala de equivalencias dentro de la app; comparar el CSV con el listado de inscriptos; sumar las reglas del proyecto a `CLAUDE.md`; calibrar con hojas reales (tarea METSI-1, abierta).
- En la pantalla Examen, la etiqueta del campo dice «Descuento por cada opción incorrecta marcada»; con la regla vigente el descuento es por cada marca **de más** sobre la cantidad de correctas (el texto de ayuda lo explica bien). Es un cambio de código que no se hizo.
