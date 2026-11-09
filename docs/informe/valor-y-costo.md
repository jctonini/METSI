# Valor y costo (ítem 12 de la lista de cumplimiento)

> Estado: **datos parciales**. Lo declarado o medido figura con su origen; lo que no se midió figura como **SIN DATO**. Las cifras marcadas como *hipótesis* son ilustrativas y **no deben citarse como resultados**. La sección 8 del informe (`informe-borrador.md`) resume este archivo.

## 1. Qué se estima
El valor de METSI Corrector es el **tiempo que ahorra** al corregir exámenes multiple choice en papel, más beneficios que no se miden en minutos (§6). El costo son las licencias, el uso de IA, las horas de armado y el mantenimiento.

## 2. Datos y su origen
| Dato | Valor | Origen | Tipo |
|---|---|---|---|
| Alumnos del primer uso en serio | ~80 | Autor, 2026-11-08 (registro N.º 47) | Declaración |
| Preguntas por examen | 10 (primer parcial) y 20 (segundo) | Autor, 2026-10-01 (N.º 2) | Declaración |
| Tiempo de corrección a mano por examen | **4 a 5 minutos** | Autor, 2026-11-09: «debo estar tardando entre 4 y 5 minutos por examen» | **Estimación sin cronometrar.** El proceso es por lotes (corregir por carillas, sumar, ordenar, pasar a Excel), así que el tiempo por examen es el del proceso completo de un lote dividido por la cantidad de exámenes. El autor indicó que no va a cronometrar a mano el proceso completo de todo el conjunto |
| Tiempo por hoja con la herramienta | **SIN DATO** | — | Falta medir (§7) |
| Exámenes por año, recuperatorios | **SIN DATO** | — | Falta |
| Horas de armado | **SIN DATO** | — | Las sesiones de trabajo fueron del 1 de octubre al 8 de noviembre de 2026, pero no se registraron las horas dedicadas |
| Costo de uso de IA | hasta USD 56,13 | Plataforma, 2026-11-09 (§5) | **Cota superior** |
| Licencias | USD 0 | Autor (planes gratuitos) y proyecto de Google Cloud sin facturación (§5) | Declaración y verificación |

**Qué no se sabe del 4 a 5 minutos** y debe aclararse en el informe: si es para el examen de 10 o el de 20 preguntas, y si incluye ordenar por registro, pasar a Excel, el control contra el listado de inscriptos, convertir el puntaje en nota, compartir las notas y subirlas a MiEcon.

## 3. Tiempo de corrección a mano (con el dato declarado)
`alumnos × minutos por examen`:

| Alumnos | A 4 min | A 5 min |
|---|---|---|
| 80 (un turno) | 320 min = **5 h 20 min** | 400 min = **6 h 40 min** |

Supuestos: el tiempo es igual para todos los exámenes del turno, corrige una sola persona y no hay recorrección.

## 4. Ahorro posible
`Ahorro por turno = alumnos × (minutos a mano − minutos con la herramienta)`.

**De dónde sale el ahorro** (según el autor, 2026-11-09): de corregir y sumar sin pilas ni carillas, de **no ordenar los exámenes por registro** (la tabla de resultados ya sale ordenada) y de **no volver a tipear lo que la hoja trae escrito y la herramienta identifica** al pasar a Excel (marcas, modalidad, puntaje y, como sugerencia, el registro; el nombre sigue siendo manual). Para que la comparación sea justa, los dos métodos tienen que medir los mismos pasos: **corregir, sumar, ordenar y dejar los datos en la planilla**. El tiempo con la herramienta incluye sacar la foto, cargarla, revisar lo dudoso, confirmar el registro y exportar.

El segundo término es **SIN DATO**. Esta tabla es una **hipótesis de sensibilidad, no una medición**:

| Con la herramienta se tarda… | Ahorro por examen | Ahorro en un turno de 80 |
|---|---|---|
| 1 min por hoja (hipótesis) | 3 a 4 min | 240 a 320 min = 4,0 a 5,3 h |
| 2 min por hoja (hipótesis) | 2 a 3 min | 160 a 240 min = 2,7 a 4,0 h |
| 3 min por hoja (hipótesis) | 1 a 2 min | 80 a 160 min = 1,3 a 2,7 h |

**Punto de equilibrio:** `horas de armado ÷ ahorro por turno` da cuántos turnos hacen falta para recuperar las horas de armado (cuando se tenga esa cifra).

## 5. Costos
| Concepto | Costo | Estado |
|---|---|---|
| Google Cloud (Drive API y selector) | USD 0 | Proyecto **sin cuenta de facturación** (confirmado el 2026-11-09): no puede generar cargos; si se agotan las cuotas, las llamadas fallan |
| GitHub y GitHub Pages | USD 0 | Plan gratuito, según el autor. Herramienta de la cursada (clase 13) |
| Vercel | USD 0 | Plan gratuito, según el autor. Aviso de la clase 13: el plan Hobby es solo para uso personal y no comercial **[VALIDAR si una cátedra califica; si no, haría falta un plan pago]** |
| Supabase | USD 0 | Plan gratuito, según el autor. Aviso de la clase 13: pausa el proyecto tras una semana sin actividad y se reactiva desde el panel, con sus datos: conviene entrar a la app antes de cada parcial |
| Uso de IA | hasta USD 56,13 | Cota superior (cuadro de abajo). Falta saber si se cobró o está incluido en una suscripción |
| Horas de armado | **SIN DATO** | — |
| Mantenimiento | Lo hace el autor; horas **SIN DATO** | `node tools/version.js` tras cada cambio, administrar usuarios, entrar a la app antes de cada parcial, revisar los planes gratuitos y calibrar la lectura con hojas reales (tarea METSI-1) |
| Impresión de las hojas | **SIN DATO** | Hoja A5, dos por A4, igual para todos los alumnos |

**Modelo y costo por sesión de Claude Code** (lo que informa la plataforma al 2026-11-09; en todas el modelo configurado y el último servido son Claude Sonnet 5.5 con esfuerzo medio):

| Sesión | Pedidos | Costo informado (USD) | Qué incluye además |
|---|---|---|---|
| «Profesor Metsi universidad» (desde el 1 de oct) | N.º 1 a 36 | 45,28 | Armado de exámenes y otro repositorio de materiales |
| «Backlog.md repository overview» (1 de nov) | N.º 44 a 46 | 3,62 | Trabajo en otro proyecto (EjeZ3D) |
| «Autenticación y gestión de usuarios» (7 de nov) | N.º 37 a 43 | 1,51 | — |
| «Capacidad del corrector de exámenes» (8 de nov) | N.º 47 a 50 | 2,51 | — |
| «Lectura de escritura manual de alumnos» (8 de nov) | N.º 51 a 53 | 3,22 | — |
| **Suma de las cinco de desarrollo** | | **56,13** | Cota superior: las dos primeras incluyen trabajo ajeno a METSI |
| «Asistente de corrección de exámenes» (8 y 9 de nov) | N.º 54 a 80 | 11,29 (primera consulta) | Informe y documentación: **no es costo de la herramienta** |

Las tres sesiones que solo tocan la herramienta suman USD 7,24.

## 6. Beneficios que no se miden en minutos
- **Criterio de puntaje uniforme:** el puntaje parcial y las incorrectas se aplican igual a todos (`js/scoring.js`). *No medido:* cuántos errores de cálculo había a mano.
- **Control de identificación y repetidos:** frena hojas sin nombre ni registro, avisa de repetidos y detecta la misma foto cargada dos veces.
- **Trazabilidad:** queda la foto de cada hoja en el Drive del docente y se pueden revisar las preguntas dudosas.
- **Costo oculto:** la lectura del registro es una sugerencia que hay que confirmar, y su precisión con hojas reales **no está medida** (cerca del 99 % con fotos sintéticas, una prueba optimista).

## 7. Qué medir: plan del 18 de noviembre de 2026
**Cómo.** Con el parcial real (si preferís no usar hojas de alumnos, con 10 a 20 hojas inventadas): primero **a mano, con cronómetro**, y después **las mismas hojas con la herramienta**, también con cronómetro. Medir el proceso completo de un lote y dividir por la cantidad (la comparación solo vale sobre las mismas hojas). Anotar cuántas preguntas tiene el examen, qué pasos incluye cada tiempo, celular o PC, y si se usó Drive. De paso se obtiene la primera calibración con hojas reales (METSI-1) y la precisión real de la lectura del registro.

**Comparar también los puntajes.** Anotar cuántas hojas obtienen un puntaje distinto con la herramienta que a mano (tu puntaje manual es la respuesta conocida) y comparar la **nota final** tras el redondeo de Excel, porque el redondeo puede cambiar casos de borde. La regla de puntaje y su comparación con tu criterio manual están en el borrador del informe, §6.

**Plantilla** (solo tiempos y cantidades, **sin nombres ni registros de alumnos**; las hojas y las capturas de esa corrida no van al repositorio ni al informe):

| Método | Hojas | Preguntas | Tiempo total | Min. por hoja | Hojas que pidieron revisión | Hojas con puntaje distinto | Observaciones |
|---|---|---|---|---|---|---|---|
| A mano | | | | | — | — | Pasos incluidos |
| Herramienta | | | | | | | Celular o PC; Drive; peso de las incorrectas usado (0,33) |

## 8. Conclusión provisoria
Con la estimación del autor, **la corrección manual de un turno de 80 alumnos cuesta entre 5 h 20 min y 6 h 40 min**. La herramienta conviene si por hoja ahorra más minutos de los que cuestan armarla y mantenerla repartidos en los turnos en que se use. Hoy **no se puede afirmar que conviene** porque faltan tres datos: el tiempo por hoja con la herramienta, los turnos por año y las horas de armado. Si el resultado fuera que no conviene, también es un resultado válido para el informe.
