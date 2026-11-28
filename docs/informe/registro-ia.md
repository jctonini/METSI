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
| Uso con 15 y luego más de 50 exámenes reales: lectura de la grilla, sensibilidad, nombre, registro y modalidad; mejoras pedidas | 18 y 19 de nov | N.º 81 a 104 | `registro-ia-bruto-examenes-reales.md` | Fusiones a `main` (tareas METSI-13 a METSI-22) |

El orden de los N.º no es cronológico (el login se extrajo antes que las demás sesiones de noviembre); el índice del Anexo C los ordena por fecha. **No se registran** las sesiones que no tocaron la herramienta: armado del examen del 2.º parcial y su guía, la skill de armado de exámenes, la escala de calificación no lineal (4 de oct), el acceso a Drive para el examen (23 de oct) y el trabajo en otro proyecto (EjeZ3D).

## 2. Estado de los 12 ítems

| Ítem | Estado | Dónde está | Qué falta |
|---|---|---|---|
| 1 Problema real | Parcial | Borrador §1 | Medición del tiempo por turno (el 18 y 19/11 usé la herramienta con exámenes reales, pero no cronometré) |
| 2 Herramienta y costo | Cubierto | Borrador §4 y §8; `valor-y-costo.md` | Aclarar si el uso de IA se cobró; validar si el plan Hobby de Vercel admite una cátedra |
| 3 Instrucciones para el modelo | Cubierto con un equivalente | Borrador §5; `instrucciones-para-el-modelo.md` (Anexo D) | Confirmar si PEDIR es una sigla oral (no aparece en las 16 clases) |
| 4 Datos o documentos | Cubierto | Borrador §4; `diccionario-de-datos.md` (Anexo B) | — |
| 5 Verificación con casos conocidos | Cubierto | Borrador §6 (125 pruebas, 5 casos de mi criterio manual y calibración con exámenes reales del 18 y 19/11) | Confirmar la clave de la pregunta 8 y el valor 0,5; resultados del 18/11 |
| 6 Autonomía | Cubierto | Borrador §3 (tabla) | — |
| 7 Construcción paso por paso | Cubierto | Borrador §4; `anexo-f-paso-a-paso.md` (Anexo F) | Que una persona ajena la rehaga siguiendo el Anexo F |
| 8 Diccionario de datos | Cubierto | `diccionario-de-datos.md` (Anexo B) | — |
| 9 Instalación en la organización | Cubierto | Borrador §4; `docs/guia-de-uso.md`, `docs/guia-windows.md` | Validar si el mantenimiento seguirá con el asistente |
| 10 Riesgos y datos personales | Casi cubierto | Borrador §7; `incidente-api-key.md` (Anexo G) | Verificar la Ley 25.326; autorización formal; decisión sobre GitHub Pages |
| 11 Uso de IA declarado | Cubierto | Borrador §5; Anexo C; los cinco registros brutos (N.º 1 a 104) | — |
| 12 Valor estimado | Parcial | Borrador §8; `valor-y-costo.md` | Medición del 18/11, horas de armado, turnos por año |

## 3. Pendientes

**Resueltos el 2026-11-28** (decisiones del autor, ya volcadas en el borrador): tiempo (estimación a mano de 4 a 5 min por examen y hasta 2,1 min con la herramienta, sin medición controlada); turnos por año (8, unas 640 hojas); horas de armado (7 a 8); costo (suscripción Pro de USD 20 por mes, tope atribuible USD 40); valor 0,67 y ejemplo de la pregunta 8; escala de notas fuera del informe; consulta con la cátedra verbal; conservación de datos como compromiso; fotos de diagnóstico: riesgo abierto, no se borra nada; GitHub Pages abierto a propósito; prueba con un tercero: no realizada (la hará el profesor); sigla PEDIR descartada; nombre de los archivos `PerezTonini_JulioCesar_TF_Informe.pdf` y `_TF_Solucion.zip`.

**Del autor (lo que sigue abierto):**
1. **Clave del usuario de prueba:** va solo en el PDF final, no en el repositorio. Revisar que el usuario tenga rol docente, que el proyecto de Supabase no esté pausado y que la cuenta no tenga datos reales.
2. **Anexo E:** cinco capturas comentadas con datos inventados (o un video de hasta 3 minutos).
3. **Sección 9, «Lo que aprendí»:** en tus palabras.
4. **Ley 25.326:** verificar el texto oficial (desde la sesión no se pudo abrir el sitio) y qué obligaciones aplican.
5. **Opcional:** fecha de consulta de Backlog.md y si el plan Hobby de Vercel admite una cátedra.
6. Buscar el nombre y el registro del autor en todo el repositorio antes de armar el `.zip`.

**Del asistente:** pasar a PDF con el formato pedido (Calibri 11, interlineado 1,5), dejar las marcas de la lista de verificación y armar el `.zip` sin `node_modules` ni claves.

**Opcionales:**
- Tráfico por API y por credencial en la consola de Google Cloud (Anexo G).
- Mejoras que quedaron anotadas: comparar el CSV con el listado de inscriptos; calibrar con hojas reales (tarea METSI-1, abierta).
- En la pantalla Examen, la etiqueta del campo dice «Descuento por cada opción incorrecta marcada»; con la regla vigente el descuento es por cada marca **de más** sobre la cantidad de correctas (el texto de ayuda lo explica bien). Es un cambio de código que no se hizo.
