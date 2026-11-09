# Valor y costo (ítem 12 de la lista de cumplimiento)

> Estado: **borrador con datos parciales**. Lo que está medido o declarado figura con su origen; lo que no se midió figura como **SIN DATO**. Las cifras marcadas como *hipótesis* son ilustrativas, no mediciones, y **no deben citarse en el informe como resultados**.

## 1. Qué se estima

El valor de METSI Corrector es el **tiempo que ahorra** corregir exámenes multiple choice en papel, más algunos beneficios que no se miden en minutos (sección 6). El costo son las licencias, las horas de armado y el mantenimiento.

## 2. Datos y su origen

| Dato | Valor | Origen | Tipo |
|---|---|---|---|
| Cantidad de alumnos del primer uso en serio | ~80 | Declarado por el docente, 2026-11-08 (registro de IA, N.º 47) | Declaración |
| Tiempo de corrección a mano por examen | **4 a 5 minutos** | Declarado por el docente, 2026-11-09: «debo estar tardando entre 4 y 5 minutos por examen» | **Estimación sin cronometrar.** El proceso es por lotes (se corrige por carillas, se suma, se ordena y se pasa a Excel), así que el tiempo por examen no se mide directamente: es el tiempo del proceso completo de un lote dividido por la cantidad de exámenes. El autor indicó que **no va a cronometrar el proceso completo de todo el set a mano** |
| Tiempo por hoja con la herramienta | **SIN DATO** | — | Falta medir (sección 7) |
| Preguntas por examen | 10 (primer parcial) y 20 (segundo) | Declarado por el docente, 2026-10-01 (N.º 2) | Declaración |
| Exámenes por año, recuperatorios | **SIN DATO** | — | Falta |
| Horas de armado de la herramienta | **SIN DATO** | — | Falta (las sesiones de trabajo consta que fueron del 1 de octubre al 8 de noviembre de 2026, pero no las horas dedicadas) |
| Costo de uso de IA | hasta USD 56,13 | Datos que informa la plataforma para las 5 sesiones de desarrollo, 2026-11-09 (detalle en `registro-ia.md` §2); modelo Claude Sonnet 5.5, esfuerzo medio | **Cota superior**: dos sesiones incluyen trabajo ajeno a la herramienta (armado de exámenes y otro proyecto). Solo las tres sesiones que tocan únicamente la herramienta suman USD 7,24. Falta aclarar si se cobró o está incluido en una suscripción |
| Licencias de la app | Ver sección 5 | — | Parcial |

**Qué no se sabe del 4 a 5 minutos** (hay que aclararlo en el informe): si es para el examen de 10 o el de 20 preguntas, si incluye ordenar los exámenes por registro, pasar las notas a Excel y el control contra el listado de inscriptos, y si incluye convertir el puntaje en nota con el criterio de aprobación, compartir las notas y subirlas a MiEcon.

## 3. Tiempo de corrección a mano (con el dato declarado)

Cálculo directo: `alumnos × minutos por examen`.

| Alumnos | A 4 min por examen | A 5 min por examen |
|---|---|---|
| 80 (un turno) | 320 min = **5 h 20 min** | 400 min = **6 h 40 min** |

Supuestos: el tiempo es el mismo para todos los exámenes del turno, el docente corrige solo, y no hay recorrección. **Cada turno de unos 80 alumnos consume entre 5 h 20 min y 6 h 40 min de corrección manual**, según la estimación del docente.

## 4. Ahorro posible: la cuenta que falta cerrar

`Ahorro por turno = alumnos × (minutos a mano − minutos con la herramienta)`.

**De dónde sale el ahorro** (según el autor, 2026-11-09): de corregir por carillas y sumar los puntos, de **no ordenar físicamente los exámenes por registro** (la tabla de resultados ya sale ordenada) y de **no tipear de nuevo lo que ya está escrito en la hoja y la herramienta identifica** al pasar a Excel: marcas, modalidad, puntaje y, como sugerencia, el registro. El nombre sigue siendo manual. Para que la comparación sea justa, el tiempo a mano y el tiempo con la herramienta tienen que incluir los mismos pasos: **corregir, sumar, ordenar y dejar los datos en la planilla**.

El segundo término de la cuenta es **SIN DATO**. La tabla siguiente es una **hipótesis de sensibilidad** para ver cuánto importa ese número; **no es una medición**:

| Si con la herramienta se tarda… | Ahorro por examen | Ahorro en un turno de 80 |
|---|---|---|
| 1 min por hoja (hipótesis) | 3 a 4 min | 240 a 320 min = 4,0 a 5,3 h |
| 2 min por hoja (hipótesis) | 2 a 3 min | 160 a 240 min = 2,7 a 4,0 h |
| 3 min por hoja (hipótesis) | 1 a 2 min | 80 a 160 min = 1,3 a 2,7 h |

El tiempo con la herramienta incluye sacar la foto, cargarla (o elegirla desde Drive), revisar lo que la app marca como dudoso, confirmar o corregir el registro y exportar. **Punto de equilibrio de las horas de armado:** `horas de armado ÷ ahorro por turno` da cuántos turnos hacen falta para recuperarlas (con la cifra de horas de armado, que falta).

## 5. Costos

| Concepto | Costo | Estado |
|---|---|---|
| Google Cloud (Drive API y selector de Drive) | USD 0 | El proyecto **no tiene cuenta de facturación**: no puede generar cargos (confirmado el 2026-11-09). Si se agotan las cuotas gratuitas, las llamadas fallan, no se cobran |
| GitHub (repositorio y GitHub Pages) | **SIN DATO** | Verificar el plan de la cuenta (GitHub es una herramienta de la cursada, clase 13) |
| Vercel (publicación con login) | Plan gratuito, según el autor (2026-11-09) | **Verificar el plan exacto.** Aviso de la clase 13: el plan Hobby es solo para uso personal y no comercial; si el uso en una cátedra lo excede, haría falta un plan pago |
| Supabase (usuarios y login) | Plan gratuito, según el autor (2026-11-09) | **Verificar el plan exacto.** Aviso de la clase 13: pausa el proyecto tras una semana sin actividad (se reactiva desde el panel, con sus datos) |
| Uso de IA para construir la herramienta | hasta USD 56,13 (USD 7,24 en las sesiones que solo tocan la herramienta) | Cota superior (ver sección 2); falta saber si se cobró o está incluido en una suscripción |
| Horas de armado | **SIN DATO** | Falta |
| Mantenimiento | **SIN DATO** | Tareas conocidas: correr `node tools/version.js` tras cada cambio, renovar la clave del selector si se rota, administrar usuarios, calibrar la lectura con hojas reales (tarea METSI-1 abierta) |
| Impresión de las hojas | **SIN DATO** | Hoja A5, 2 por A4, la misma para todos los alumnos |

## 6. Beneficios que no se miden en minutos

- **Criterio de puntaje uniforme:** el puntaje parcial y el descuento por incorrecta se aplican igual a todos (en `js/scoring.js`), sin depender de la atención del corrector. *No medido:* cuántos errores de cálculo había a mano.
- **Control de identificación y repetidos:** la app frena hojas sin nombre ni registro y avisa de repetidos, y detecta la misma foto cargada dos veces.
- **Trazabilidad:** queda la foto de cada hoja en el Drive del docente y se pueden revisar las preguntas dudosas.
- **Costo oculto a considerar:** la lectura de dígitos del registro es una sugerencia que hay que confirmar, y la precisión con hojas reales **no está medida** (la medición disponible usa dígitos de MNIST sobre fotos sintéticas, cerca del 99 %, que es una prueba optimista).

## 7. Qué hay que medir (protocolo)

Con 10 a 20 hojas **inventadas o de prueba**, sin datos de alumnos reales, cronometrar:
1. **A mano:** cuánto lleva corregir cada hoja (incluyendo puntaje parcial y volcar la nota), con el cronómetro del celular. Anotar con cuántas preguntas.
2. **Con la herramienta:** desde que se saca la foto hasta que el resultado queda exportado, para el mismo grupo de hojas. Anotar cuántas hojas obligaron a revisar algo y cuánto tardó.
3. Repetir con 10 y con 20 preguntas si los dos exámenes se usan.
4. Registrar la fecha y las condiciones (celular o PC, con o sin Drive).

Con eso se reemplazan las hipótesis de la sección 4 por una medición propia y se puede escribir la conclusión.

### Plan acordado: examen del 18 de noviembre de 2026
El docente corrige **uno de los parciales a mano y toma el tiempo**. Para poder calcular un ahorro, la comparación tiene que ser contra la herramienta sobre **las mismas hojas** (o una muestra del mismo parcial), no contra otro grupo. Sugerencia de orden: primero a mano con cronómetro; después pasar las mismas hojas (o una muestra de 10 a 20) por la herramienta con cronómetro. Así, además, se obtiene la primera calibración con hojas reales (tarea METSI-1) y la precisión real de la lectura del registro.

**Comparar también los puntajes.** Para el ítem 5 (verificación con casos de respuesta conocida) conviene anotar cuántas hojas obtienen **un puntaje distinto** con la herramienta que a mano, porque tus puntajes manuales son la respuesta conocida. La regla de las incorrectas de la app es configurable (valor inicial 0,33, que **eligió el asistente** y no vos, N.º 22): si difiere de tu cálculo manual, hay que ajustar el valor antes de comparar.

**Tu regla manual, según lo declarado el 2026-11-09:** si en una pregunta de dos correctas el alumno marca una correcta y una incorrecta, le das solo el puntaje de la correcta. En la app eso equivale a poner el valor de las incorrectas en **0**. Con el valor inicial de 0,33 (que eligió el asistente) daría 0,335 en vez de 0,5. Puntajes de la app para otros casos, calculados con `scoreQuestion` (pregunta de 1 punto, 4 opciones), para que anotes qué hacés vos en cada uno:

| Caso | Valor 0 | Valor 0,33 | Valor 1 | **Tu criterio a mano** |
|---|---|---|---|---|
| 2 correctas (A y B): marcó A y C | 0,5 | 0,335 | 0 | 0,5 (declarado) |
| 1 correcta (A): marcó A y C | 1 | 0,67 | 0 | _completar_ |
| 2 correctas (A y B): marcó A, B y C | 1 | 0,835 | 0,5 | _completar_ |
| 2 correctas (A y B): marcó solo C | 0 | 0 | 0 | _completar_ |
| 2 correctas (A y B): marcó las 4 opciones | 0 | 0 | 0 | _completar_ |
| 3 correctas (A, B y C): marcó las 4 opciones | 1 | 0,89 | 0,667 | _completar_ |

Antes de la corrida del 18 de noviembre hay que dejar el valor de las incorrectas de la app de modo que coincida con tu criterio en **todos** estos casos. Si ningún valor coincide en todos (por ejemplo, si no querés puntaje completo en la tercera fila), la regla de la app tendría que cambiar y eso es un hallazgo para el informe. El caso de marcar todas las opciones tiene una regla propia en la app (vale 0 cuando las correctas son la mitad o menos de las opciones), que aceptaste el 2026-10-24 (N.º 34).

Plantilla para anotar (solo tiempos y cantidades, **sin nombres ni registros de alumnos**):

| Parcial | Hojas | Preguntas | Método | Tiempo total | Min. por hoja | Hojas que pidieron revisión | Hojas con puntaje distinto al manual | Observaciones |
|---|---|---|---|---|---|---|---|---|
| _completar_ | | | A mano | | | — | — | Qué incluye el tiempo: puntaje parcial, incorrectas, volcar la nota |
| _completar_ | | | Herramienta | | | | | Celular o PC; con o sin Drive; foto, carga, revisión y exportación; valor de las incorrectas usado |

Datos reales de alumnos: las hojas y las capturas de esa corrida **no van al repositorio ni al informe**. Para calibrar, la herramienta genera `casos.json` sin nombres ni registros.

## 8. Conclusión provisoria

Con la estimación del docente, **la corrección manual de un turno de 80 alumnos cuesta entre 5 h 20 min y 6 h 40 min**. La herramienta conviene si por hoja ahorra más minutos de los que cuestan armarla y mantenerla repartidos en los turnos en que se use. Hoy **no se puede afirmar que conviene** porque faltan tres datos: el tiempo por hoja con la herramienta, la cantidad de turnos por año y las horas de armado. Si el resultado fuera que no conviene, también es un resultado válido para el informe.
