# Material de referencia de la cátedra (presentaciones)

Presentaciones del Prof. Diego Carralbal (UBA-FCE, Metodología de Sistemas de Información 658-1) convertidas a Markdown.
Sirven para **anclar las preguntas del examen en el contenido que realmente se dicta**: terminología, definiciones, procesos, ITTOs, tipos de contrato, etc.

**Cómo se generaron:** conversión con `markitdown` de los `.pptx` originales (carpeta de Drive `Uba/Metsi/Recursos/Presentaciones/PPTX`).
Cada diapositiva queda como `<!-- Slide number: N -->`, con el texto de las diapositivas y, después de `### Notes:`, las notas del orador.
**Las imágenes y los diagramas no se convierten** (aparecen como `![](...)`): fórmulas o esquemas dibujados como imagen no están en el texto.
La única excepción curada a mano es `segundo_parcial/Frameworks operativos.md`, transcrito a partir del PDF.

## Cómo usar estas referencias al armar un examen

1. **No leas todo.** Son ~2 MB. Elegí los archivos según los temas de la distribución pedida (tablas de abajo) y leé solo esos. Para ubicar un concepto concreto usá `grep -n -i "<término>"` sobre la carpeta.
2. Las **notas del orador** (`### Notes:`) suelen traer la explicación más completa, incluso citas textuales del PMBOK.
3. Usá el vocabulario de las presentaciones (por ejemplo "Efectuar las adquisiciones", "Línea base de alcance", "Precio fijo cerrado (FFP)") para que las preguntas suenen como las del profesor.
4. **No inventes contenido que no esté en el material.** Si un tema del banco de preguntas no aparece en ninguna presentación (ver "Huecos conocidos"), avisá al usuario antes de armar preguntas sobre ese tema.
5. Si una fórmula o un diagrama es clave y aparece como imagen, no la reconstruyas de memoria como si estuviera en la presentación: usá la definición estándar y decilo, o pedí la imagen.

## 1er parcial (`primer_parcial/`)

| Tema | Archivo | Slides |
|---|---|---|
| Organización / marco general | `00 - Organization - ISM-PM-00-Organization.md` | 13 |
| Organización / marco general | `00 - Organization - PM-00-Organization.md` | 31 |
| Marco: estándares, ciclo de vida, clasificación de problemas (menciona Cynefin) | `01 - Framework - PM-01-Framework Standard.md` | 56 |
| Integración, tailoring | `02 - Integration - PM-02-Integration.md` | 46 |
| Interesados | `03 - Stakeholders - PM-13-Stakeholders.md` | 42 |
| Alcance | `04 - Scope - PM-03-Scope.md` | 49 |
| Alcance: EDT/WBS | `04 - Scope - PM-04-Scope-WBS.md` | 11 |
| Cronograma | `05 - Time - PM-04-Time.md` | 66 |
| Cronograma: resumen y ejercicio | `05 - Time - PM-04-Time-Resumen y ejercicio.md` | 24 |
| Agilidad | `Agil - Agile Nueva.md` | 68 |
| Agilidad (también menciona Cynefin) | `Agil - METSI - Agile.md` | 20 |
| Agilidad: Scrum | `Agil - METSI - Scrum.md` | 19 |
| Comunicaciones | `compartido/PM-10-Comunications.md` | 31 |

## 2do parcial (`segundo_parcial/`)

| Tema | Archivo | Slides |
|---|---|---|
| Costos y valor ganado (EVM) | `PM-05-Cost.md` | 54 |
| Riesgos | `PM-06-Risk.md` | 53 |
| Calidad | `PM-06-Quality.md` | 38 |
| Adquisiciones y contratos | `UBA-FCE-PM-12-Procurements.md` | 29 |
| Comunicaciones | `compartido/PM-10-Comunications.md` | 31 |
| Negociación / conflictos | `PM-09-Negotiation.md` | 24 (charla de "10 ideas"; varias diapositivas son solo títulos) |
| Marcos operativos: ITIL/ITSM, modelos operativos, gobierno de TI, XLA, Customer Journey | `Frameworks operativos.md` (transcripción completa) y `Frameworks operativos.pdf` (original) | 41 págs. |

### Qué cubre cada uno (2do parcial)

- **Cost:** EVM (PV, EV, AC, CV, SV, CPI, SPI, ETC, EAC, VAC), métodos de medición del valor ganado (unidades equivalentes, relación proporcional, estándar ganado, nivel de esfuerzo), estimación (paramétrica, ascendente), reservas, costos directos e indirectos.
- **Risk:** riesgo inherente y residual, matriz de probabilidad e impacto, análisis cualitativo y cuantitativo, árbol de decisión, Monte Carlo, estrategias de respuesta (mitigar, transferir, evitar, aceptar; explotar, compartir, mejorar), reservas de gestión.
- **Quality:** Gestionar vs. Controlar la calidad, aseguramiento, herramientas básicas (Pareto, Ishikawa, histograma, diagrama de dispersión), costo de la calidad, muestreo, Deming, ISO.
- **Procurements:** hacer o comprar, RFI/RFQ/RFP, criterios de selección, SOW, tipos de contrato (FFP, FPIF, FP-EPA, CPFF, CPIF, CPAF, T&M) y quién asume el riesgo, administración de reclamaciones (negociación y ADR), inspección y auditoría, cierre.
- **Frameworks operativos:** modelos operativos (coordinación, unificación, diversificación, replicación), madurez, COBIT/ITIL/CMMI/TOGAF/COSO/ISO, ITIL 4 (principios, 4 dimensiones, SVS, cadena de valor), gestión del cambio (normal, standard, emergencia, CAB/ECAB), eventos, incidentes, problemas, solicitudes, accesos, Service Desk, mejora continua (Deming, 7 pasos), Customer Journey, SLA vs. XLA.

## Huecos conocidos (2do parcial)

Temas que el banco de preguntas del 2do parcial evalúa, pero que **no están en el material de arriba**. No armes preguntas sobre ellos sin confirmarlo con el usuario:

- MTTR y RCA (análisis de causa raíz) en Gestión de Problemas.
- Mediación y arbitraje (Procurements solo menciona ADR, "resolución alternativa de conflictos", en general) y retención de pagos.
- Costos hundidos (apenas se mencionan), estimación análoga, TCPI.
- Anclaje como sesgo de estimación; benchmarking en Calidad.

Si el usuario aclara que esos temas se dictan en clase, se pueden usar como conocimiento estándar de la materia.
Para el 1er parcial no se hizo esta auditoría de huecos.
