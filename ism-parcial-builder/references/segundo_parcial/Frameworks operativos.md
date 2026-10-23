# Frameworks Operativos

> Transcripción manual de `Frameworks operativos.pdf` (41 páginas), hecha leyendo las imágenes.
> La conversión automática con markitdown había perdido todos los diagramas; este archivo los recupera.
> Los textos entre comillas son literales del PDF. Los nombres de ITIL 4 están en inglés porque así figuran en los diagramas.

## 1. Modelo de excelencia (pág. 2)

Esquema de cajas, de izquierda a derecha:
**Liderazgo** → **Personas / Política y estrategia / Alianzas y recursos** → **Procesos** → **Resultados en personas / Resultados en clientes / Resultados en sociedad** → **Resultados clave**.

## 2. Qué / Cómo / Quién (pág. 3)

Triángulo con tres vértices: **Cómo** (procesos), **Qué** (producto o regalo) y **Quién** (identidad).

## 3. Modelos operativos (págs. 4-7)

Matriz de 2×2.
- Eje vertical: **necesidad de integración de datos** (arriba: clientes, productos o proveedores compartidos; abajo: algunos productos, clientes o proveedores compartidos).
- Eje horizontal: **estandarización de procesos de negocio** (izquierda: gestión autónoma de procesos; derecha: gestión centralizada de procesos).

| Modelo | Posición | Características |
|---|---|---|
| **Coordinación** | arriba izquierda | Clientes, productos o proveedores compartidos. Unidades de negocio con control sobre el diseño de procesos. |
| **Unificación** | arriba derecha | Clientes, productos o proveedores compartidos. Dueños de procesos de alto nivel diseñan procesos estandarizados. |
| **Diversificación** | abajo izquierda | Algunos productos, clientes o proveedores compartidos. Unidades de negocio con control sobre el diseño de procesos. |
| **Replicación** | abajo derecha | Algunos productos, clientes o proveedores compartidos. Gestión de datos local. Procesos de negocio compartidos. |

Definiciones del PDF:
- "El Modelo Operativo determina la arquitectura empresarial."
- **Arquitectura empresarial**: "la lógica de organización para los procesos de negocio, aplicaciones, datos e infraestructura tecnológica que permite a la compañía alcanzar sus objetivos estratégicos."
- Esquema: Modelo operativo → Arquitectura empresarial → Procesos, Aplicaciones, Datos, Infraestructura.

## 4. Modelo, arquitectura y madurez (pág. 8)

| Etapa | 1. Silos de negocio | 2. Estandarización de tecnología | 3. Datos racionalizados / Core optimizado | 4. Arquitectura modular |
|---|---|---|---|---|
| Capacidad de IT | Aplicaciones de IT apoyando necesidades locales | Plataforma de infraestructura compartida | Procesos y datos estandarizados | Procesos modulares, plug-and-play |
| Objetivos de negocio | ROI o iniciativas funcionales | Reducir costos de IT | Costo y calidad de operaciones de negocio | Velocidad time-to-market. Estrategia Agile |
| Aplicaciones estratégicas | Optimización local o funcional | Eficiencia de IT | Eficiencia operativa de negocio | Agilidad estratégica |

## 5. Modelos y frameworks de gobierno de TI (págs. 9-11)

Qué responde cada framework, según el PDF:

| Framework | Qué aporta |
|---|---|
| Malcolm Baldrige National Quality Award | Características de la gestión empresarial de excelencia |
| APQC | Qué tengo que hacer según mi industria |
| TOGAF | Arquitectura empresarial |
| COSO | Qué tan bien estoy gestionando los riesgos y el control interno |
| **COBIT 2019** | **Qué** tengo que hacer |
| **ITIL** | **Cómo** tengo que hacerlo |
| **CMMI** | **Qué tan bien** estoy |
| ISO 27001 | Especificaciones de calidad de gestión de seguridad |

- Pág. 10: "The IT Governance Framework" (hexágono) con **ISO 38500** en el centro. Ubica COSO, CobiT, SOX, ISO 27001, ISO 38500, Balanced Scorecard y Baldrige en riesgo/conformidad; TOGAF y Zachman en estrategia de TI; PRINCE2, PMBOK, MSP, MoR, CMMI y OPM3 en cambio; ISO 20000, ITIL, 6Sigma, BCM e ITPO en operaciones.
- Pág. 11: "Alcance de modelos y frameworks": mapa con eje vertical **Qué ↔ Cómo** y eje horizontal **Cobertura**. De arriba hacia abajo: TOGAF, FAIR, COSO, COBIT, ISO 27000, ISO 9000, ITIL, ISO 20000. COBIT queda en la zona del "qué" e ITIL en la del "cómo".

## 6. ITIL (págs. 12-13)

- Enfoque sistémico para la provisión de servicios de TI con alto nivel de calidad.
- Recopilación de las mejores prácticas para la gestión de servicios de TI.
- Provee un lenguaje común con términos bien definidos.

**ITIL NO es:** software; una solución integral provista por un proveedor externo; un conjunto de procedimientos a cumplir; reemplazo de lo que ya se hace bien; lo único necesario para brindar un mejor servicio; independiente de la cultura organizacional.

## 7. Fases del ciclo de vida, ITIL v3 (pág. 14)

Estrategia del servicio (centro) · Diseño del servicio · Transición del servicio · Operación del servicio · **Mejora continua del servicio** (anillo exterior, Continual Service Improvement).

## 8. ITIL 4 (págs. 15-18)

**7 principios guía (pág. 15):** Focus on value · Start where you are · Progress iteratively with feedback · Collaborate and promote visibility · Think and work holistically · Keep it simple and practical · Optimize and automate.

**Las 4 dimensiones (pág. 16):** 1. Organizations & people · 2. Information & technology · 3. Partners & suppliers · 4. Value streams & processes. Alrededor de Products & services y Value.

**Sistema de valor de servicio (pág. 17):** Opportunity/demand → [Guiding principles · Governance · **Service value chain** · Practices · Continual improvement] → Value.

**Cadena de valor de servicio (pág. 18):** seis actividades: **Plan · Improve · Engage · Design & transition · Obtain/build · Deliver & support**. Entra Demand y sale Value, con Products & services.

**Flujo de valor (pág. 37):** la misma cadena con una ruta numerada del 1 al 6 que atraviesa las actividades, de Demand a Value.

## 9. Funciones y procesos (págs. 19-20)

Mapa del ciclo de vida v3 con sus procesos:
- **Estrategia del servicio:** gestión financiera, de la cartera de servicios, de la demanda, de la estrategia, de relaciones con el negocio.
- **Diseño del servicio:** catálogo de servicios, nivel de servicios, capacidad, suministradores, disponibilidad, continuidad, seguridad de la información, coordinador del diseño.
- **Transición del servicio:** planificación y soporte, **gestión de cambios**, configuración y activos, entregas y despliegues, validación y pruebas, evaluación del cambio, conocimiento.
- **Operación del servicio:** **eventos, incidencias, peticiones de servicio, problemas, accesos**. Funciones: centro de servicio al usuario, monitorización y control, operación de TI.
- **Mejora continua del servicio:** mejora en 7 pasos, modelo CSI, proceso de mejora en 7 pasos, **PDCA**.

Definiciones:
- **Proceso**: conjunto de actividades diseñado para cumplir un objetivo; tiene entradas y salidas; es medible.
- **Función**: equipo de personas y herramientas que operan procesos.

## 10. Servicios y SLA (págs. 21-23)

- **Servicio**: entrega valor al cliente, facilitándole los resultados buscados sin tener que adueñarse de los costos y riesgos específicos.
- **Nivel de servicio**: valor medible que debe ser alcanzado. Ej.: 1 hora de respuesta 24/7; next business day.
- **Acuerdo de nivel de servicio (SLA)**: celebrado entre el proveedor de servicios de TI y el cliente. **Describe** los servicios de TI, **documenta** los objetivos de nivel de servicio y **especifica** las responsabilidades del proveedor y del cliente.
- **Ejemplos de contenido de un SLA:** descripción del servicio, horarios de operación, disponibilidad, tiempo de respuesta, tiempo de resolución, continuidad, responsabilidades del consumidor, períodos críticos de operación, capacidad.

## 11. Gestión del cambio (págs. 24-26)

- Brinda respuesta a las solicitudes de cambio de servicio generadas por el negocio.
- **Roles:** Change Manager; Change Authority (**CAB** = Change Advisory Board, **ECAB** = Emergency CAB).
- "80% de las interrupciones del servicio son causadas por error del operador o por un pobre control de cambios (Gartner)."
- **Tipos de cambio:**
  - **Normal**: requiere aprobaciones.
  - **Standard**: sigue un procedimiento establecido, no pide aprobación.
  - **Emergencia**: requiere aprobación urgente, demasiado rápido para ser clasificado como Normal.
- **Composición del CAB:** Change Manager, cliente/usuario, cliente/usuario manager, desarrollador/mantenimiento, experto/consultor, contratista.
- **Las 7 "R":** Who RAISED?, REASON, RETURN, RISKS, RESOURCES, RESPONSIBLE, RELATIONSHIPS.

## 12. Operación del servicio (pág. 27)

Realiza el objetivo estratégico. Es donde se percibe el valor.

## 13. Incidentes, eventos, solicitudes, problemas y accesos (págs. 28-33)

- **Gestión de incidentes**: gestiona interrupciones o degradaciones no planificadas del servicio. Los reportan usuarios, personal técnico y herramientas de monitoreo.
  - **Incidente**: interrupción o degradación no planificada de un servicio de TI.
  - **Work-around**: reducir o eliminar el impacto de un incidente, pero sin resolverlo.
  - **Problema**: causa subyacente desconocida de uno o más incidentes.
- **Gestión de eventos**: herramientas de monitoreo. **3 tipos de eventos: información, advertencia, excepción.**
- **Gestión de solicitudes**: información o cambio estándar. No debe categorizarse como incidente ni como cambio normal.
- **Gestión de problemas**: busca prevenir problemas (e incidentes resultantes), minimiza el impacto de incidentes inevitables y elimina incidentes recurrentes.
  - **Proactiva**: identifica puntos débiles; define workarounds.
  - **Reactiva**: detecta causas subyacentes; dispara cambios para prevenir recurrencias.
- **Gestión de accesos**: permisos correctos para los usuarios correctos en el momento correcto. Conceptos: acceso, identidad (autenticación), permisos (autorización).

## 14. Service Desk (pág. 34)

Local, central o virtual. **Single point of contact.** Habilidades de los operadores: focalizado en el cliente, articulador, habilidades interpersonales (especialmente paciencia), entendimiento del negocio, metódico/analítico, conocimiento técnico, multilingüe. Suele estar al último de las prioridades, pero es el área más visible, por lo que es sumamente importante que funcione bien.

## 15. Mejora continua (págs. 35-36)

- **Pérdida progresiva de valor**, causada por: contexto cambiante, estrategia de negocio que evoluciona, servicios que sufren sucesivas adaptaciones, avances tecnológicos constantes, cambios organizativos, mejor comprensión de los procesos.
- **Modelo de mejora:** Visión → ¿Dónde estamos? → ¿Dónde queremos estar? → ¿Cómo hacemos para estar donde queremos? → ¿Cómo sabemos que llegamos? → ¿Cómo nos mantenemos?
- **Ciclo de Deming:** Planificar, Hacer, Revisar, Actuar.
- **Los 7 pasos de la mejora de proceso:** identificar qué debo medir; determinar qué puedo medir; reunir los datos; procesar los datos; analizar la información; presentar y usar la información; implementar acciones correctivas.
- **Caso de negocio:** articular razones para justificar la mejora, proveer datos de costo y beneficios, analizar el ROI.
- **Análisis de riesgos:** identificar amenazas actuales y el riesgo de cada una; identificar situaciones de exposición inaceptables; determinar alternativas de mitigación para reducir la probabilidad o el impacto de la amenaza.

## 16. Customer Journey (págs. 38-39)

- **Definición**: la experiencia completa, punta a punta, que los clientes tienen con uno o más proveedores de servicios y/o productos a través de puntos de contacto e interacciones con el proveedor.
- **7 pasos:** Explore, Engage, Offer, Agree, Onboard, Co-create, Realize.
- Elementos del mapa: service interaction, line of visibility, band of visibility; el cliente y el proveedor de servicio como carriles.
- **Customer Journey Map (ejemplo):** duración por etapa: Explore 12 días, Engage 16 días, Offer 62 días, Agree 3 días, Onboard 23 días. Incluye touchpoints (intranet, e-mail, reunión, workshop, plantilla, demo, negociación, acuerdo firmado, catálogo de servicios, migración de datos, prueba de aceptación, portal de acceso, service desk, dashboard, encuesta de satisfacción, factura), el nivel de experiencia y los equipos del proveedor. Personas: sponsor, customer, user.

## 17. SLA vs. XLA (pág. 40)

| | SLA | XLA |
|---|---|---|
| Orientación | Service-oriented / provider-centric | Experience-oriented / customer-centric |
| Características | Métricas del proveedor (legacy, base de infraestructura) | Nuevas métricas internas; maximizar la productividad del negocio; asegurar buena experiencia; ágil y adaptativo |

El XLA se apoya sobre el SLA heredado ("Legacy SLA, infrastructure foundation").

## 18. Estructura organizacional (pág. 41)

- **Modelo tradicional:** CEO con áreas funcionales (Sales, Marketing, Product, Claims, IT, Support), cada una con su staff.
- **Modelo orientado a producto:** Chief product owner; equipos por producto, cada uno con Product owner, Scrum Master, Developers/Testers, User Experience y Marketing/Sales/Other; los especialistas funcionales cruzan transversalmente.
