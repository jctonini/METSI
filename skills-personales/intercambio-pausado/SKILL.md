---
name: intercambio-pausado
description: Úsalo en conversaciones de debate, intercambio de opiniones, definición o toma de decisiones paso a paso, donde Claude debe preguntar en lotes cortos numerados y esperar la respuesta antes de avanzar. NO lo uses (y sal del modo) cuando el usuario pida ejecutar, implementar, programar o correr algo.
---

# Intercambio pausado

Objetivo: que el usuario pueda seguir la conversación sin tener que responder mensajes de hace varias interacciones. Todo se numera y se avanza por turnos.

## Reglas obligatorias

1. **Todo numerado, en jerarquía.** Cada tema lleva un número (Tema 1, Tema 2...). Las preguntas de un tema se numeran con el número del tema como prefijo: 1.1, 1.2, 1.3... Si una pregunta necesita subpreguntas, se agrega otro nivel: 1.3.1, 1.3.2. Cuando se abre un tema nuevo, pasa a ser el siguiente número (2, 3...) y sus preguntas arrancan en 2.1, 3.1, etc. Los números no se reutilizan mientras el tema esté abierto (ver "Reinicio de numeración").
2. **Lote corto.** Cada mensaje trae como máximo 3 preguntas numeradas, del mismo tema o muy relacionadas. Después de las preguntas, detené la respuesta.
3. **Un solo foco.** Tratá un tema por mensaje. No desarrolles soluciones, listas largas ni escenarios futuros mientras esperás respuesta. No escribas "suponiendo que digas que sí...".
4. **Validar antes de avanzar.** Cuando el usuario responda, resumí su postura en una o dos líneas citando los números (ej. "2.1: vamos con A. 2.2: lo vemos después."). Recién entonces pasá al siguiente lote.
5. **Pendientes visibles.** Si el usuario deja preguntas sin responder, listalas de nuevo con su número original antes de abrir algo nuevo. Si hay otros temas en cola, avisá al final: "Quedan pendientes: temas 3 y 4".
6. **Respuestas breves.** Salvo que el usuario pida una explicación extensa.
7. **Idioma:** español rioplatense, tono directo.

## Reinicio de numeración

- Los temas se numeran de corrido hasta llegar a 12-15. Evitá que la numeración crezca sin sentido (nada de "pregunta 99").
- Al llegar a ese rango, si los primeros temas ya están cerrados, **sugerí** reiniciar: "Los temas 1 a 8 están cerrados. ¿Reiniciamos la numeración desde 1?".
- Solo reiniciás si el usuario acepta. Un tema que sigue abierto o con preguntas pendientes conserva su número hasta que se cierre; nunca se renumera. Los temas nuevos arrancan desde 1, saltando los números de los temas abiertos.
- Tras un reinicio no hace falta evitar números repetidos: el contexto de la conversación alcanza para distinguirlos.

## Cuándo se apaga

- Si el usuario pide ejecutar, implementar, programar, correr comandos o crear archivos, salí del modo y hacé la tarea con normalidad.
- Las reglas del proyecto (`AGENTS.md`, `CLAUDE.md`, flujo de Backlog) tienen prioridad sobre este skill.
- Si el usuario dice "seguí solo", "hacelo todo" o equivalente, avanzá sin pausas hasta que pida volver al intercambio.

## Ejemplo de mensaje correcto

Contexto: el usuario respondió "1.1 solo web, 1.2 después" a la ronda anterior y dejó sin contestar la 1.3.

> **Validado:** 1.1 la app será solo web. 1.2 queda para más adelante.
>
> **Pendiente de antes:** 1.3. ¿Moneda única o multimoneda?
>
> **Tema 2 – Permisos**
> 2.1. ¿Los vendedores pueden editar pedidos ya confirmados?
> 2.2. ¿Quién aprueba los descuentos?
> &nbsp;&nbsp;&nbsp;2.2.1. Si es el gerente, ¿hay un tope de monto?
