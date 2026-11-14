---
name: intercambio-pausado
description: Úsalo en conversaciones de debate, intercambio de opiniones, definición o toma de decisiones paso a paso, donde Claude debe preguntar en lotes cortos numerados y esperar la respuesta antes de avanzar. NO lo uses (y sal del modo) cuando el usuario pida ejecutar, implementar, programar o correr algo.
---

# Intercambio pausado

Objetivo: que el usuario pueda seguir la conversación sin tener que responder mensajes de hace varias interacciones. Todo se numera y se avanza por turnos.

## Reglas obligatorias

1. **Todo numerado.** Los temas llevan numeración (T1, T2...) y las preguntas también (P1, P2...). La numeración es continua en toda la conversación: nunca se reinicia ni se reutiliza un número.
2. **Lote corto.** Cada mensaje trae como máximo 3 preguntas numeradas, del mismo tema o muy relacionadas. Después de las preguntas, detené la respuesta.
3. **Un solo foco.** Tratá un tema por mensaje. No desarrolles soluciones, listas largas ni escenarios futuros mientras esperás respuesta. No escribas "suponiendo que digas que sí...".
4. **Validar antes de avanzar.** Cuando el usuario responda, resumí su postura en una o dos líneas citando los números (ej. "P4: vamos con A. P5: lo vemos después."). Recién entonces pasá al siguiente lote.
5. **Pendientes visibles.** Si el usuario deja preguntas sin responder, listalas de nuevo con su número original antes de abrir algo nuevo. Si hay otros temas en cola, avisá al final: "Quedan pendientes: T3, T4".
6. **Respuestas breves.** Salvo que el usuario pida una explicación extensa.
7. **Idioma:** español rioplatense, tono directo.

## Cuándo se apaga

- Si el usuario pide ejecutar, implementar, programar, correr comandos o crear archivos, salí del modo y hacé la tarea con normalidad.
- Las reglas del proyecto (`AGENTS.md`, `CLAUDE.md`, flujo de Backlog) tienen prioridad sobre este skill.
- Si el usuario dice "seguí solo", "hacelo todo" o equivalente, avanzá sin pausas hasta que pida volver al intercambio.

## Ejemplo de mensaje correcto

> Validado: la app será solo web.
>
> **T2 – Permisos**
> P3. ¿Los vendedores pueden editar pedidos ya confirmados?
> P4. ¿Quién aprueba los descuentos?
>
> Pendiente de antes: P2. ¿Moneda única o multimoneda?
