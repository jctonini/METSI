# Pedido para pegar en el chat original

**Cómo usarlo:** abrí el chat donde se hicieron los primeros pedidos del proyecto (METSI · Corrector de multiple choice), pegá el bloque de abajo y esperá la respuesta. Copiá lo que devuelva en `docs/informe/registro-ia-bruto.md` (o pegámelo en la sesión de Claude Code) y yo lo ordeno según el informe.

Si el chat es muy largo y se corta, pedile «continuá desde el pedido N.º X» hasta terminar.

---

````text
Necesito armar el «Registro de uso de IA» de mi trabajo final de la Diplomatura en IA (FCEUBA). Es la sección donde tengo que declarar qué herramientas usé, los pedidos principales COPIADOS TEXTUALMENTE, qué tuve que corregir, qué inventó el asistente y qué decisiones no le delegué.

Tarea: recorré ESTE chat completo, de principio a fin, y extraé todos mis pedidos (mensajes míos) que hayan sido relevantes para construir el proyecto. Descartá saludos, "gracias", "ok" y mensajes sin contenido técnico. Ordenalos cronológicamente.

REGLAS (importantes):
1. Copiá mis pedidos TEXTUALMENTE, palabra por palabra, con mis errores de tipeo. No los resumas ni los mejores. Si un pedido es larguísimo (más de 40 líneas), copialo igual y avisame; no lo cortes.
2. No inventes nada. Si un dato no consta en el chat (fecha, qué corregí, qué falló), escribí «NO CONSTA». No rellenes con suposiciones.
3. Reemplazá por «[OMITIDO]» cualquier dato sensible: claves, tokens, contraseñas, emails, nombres reales de alumnos o personas, URLs privadas.
4. Distinguí lo que dijo la IA de lo que decidí yo. En «qué corregí» y «qué inventó/erró la IA» incluí solo lo que se ve en el chat (por ejemplo: la IA propuso algo, yo lo rechacé o lo corregí; la IA afirmó algo falso o un dato inexistente).

FORMATO DE SALIDA: un único bloque de Markdown. Una entrada por pedido, así:

### N.º <número correlativo> · <fecha o NO CONSTA> · <herramienta/modelo si consta>
- **Etapa:** idea | diseño | construcción | pruebas | despliegue | documentación | otra
- **Pedido (textual):**
  > <mi mensaje completo, copiado tal cual>
- **Qué hizo la IA:** <1 o 2 líneas>
- **Qué hubo que corregir:** <o NO CONSTA / nada>
- **Qué inventó o erró la IA:** <o NO CONSTA / nada>
- **Decisión mía (no delegada):** <o NO CONSTA / ninguna>
- **Sección del informe donde encaja:** 1 Problema | 2 Situación actual | 3 Solución | 4 Cómo se construyó | 5 Registro de IA | 6 Pruebas | 7 Riesgos y controles | 8 Valor y costo | 9 Conclusiones
- **Ítem(s) de la lista de cumplimiento (1 a 12):** ver lista abajo

Al final agregá estas cuatro listas, también solo con lo que consta:
A. Herramientas y modelos usados en este chat (con su rol).
B. Todo lo que la IA inventó o afirmó mal y yo detecté.
C. Decisiones que tomé yo y no le delegué.
D. Datos o cifras mencionados en el chat (por ejemplo, tiempos de corrección a mano, cantidad de alumnos) con su origen si consta; si no consta el origen, marcalo «SIN ORIGEN».

Lista de cumplimiento (usala para el campo «Ítem(s)»):
1 Problema real, quién lo sufre y cuánto pesa · 2 Herramienta/modelo elegido y justificado, con costo · 3 Instrucciones para el modelo (PEDIR o equivalente) · 4 Datos o documentos que usa, de dónde salen y qué queda afuera · 5 Cómo se verifica que está bien (casos de respuesta conocida) · 6 Nivel de autonomía (qué hace sola, qué propone, qué aprueba una persona) · 7 Cómo está construida, paso por paso · 8 Datos en tablas con diccionario de datos · 9 Instalación en la organización (quién la usa, mantiene, capacitación) · 10 Riesgos, datos personales, secreto profesional y quién responde · 11 Uso de IA declarado con pedidos textuales · 12 Valor estimado con supuestos explícitos

Si el chat no entra completo en una sola respuesta, terminá en un pedido completo y decime en qué N.º quedaste para que te pida continuar.
````
