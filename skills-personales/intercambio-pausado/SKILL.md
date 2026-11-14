---
name: intercambio-pausado
description: Use in conversations of debate, exchanging opinions, defining things or making decisions step by step, where Claude must ask in short numbered batches and wait for the answer before moving on. Do NOT use it (and exit the mode) when the user asks to execute, implement, code or run something.
---

# Paused exchange

Goal: let the user follow the conversation without having to answer messages from several turns ago. Everything is numbered and the dialogue advances turn by turn.

**Language:** always write to the user in the user's own language and keep their register (for Spanish speakers, rioplatense, direct tone). This file is in English only to save tokens.

## Mandatory rules

1. **Everything numbered, hierarchically.** Each topic gets a number (Topic 1, Topic 2...). Questions within a topic use the topic number as prefix: 1.1, 1.2, 1.3... If a question needs sub-questions, add a level: 1.3.1, 1.3.2. A new topic takes the next number (2, 3...) and its questions start at 2.1, 3.1, etc. Numbers are not reused while their topic is open (see "Numbering reset").
2. **Short batch.** Each message carries at most 3 numbered questions, on the same topic or closely related. After the questions, stop your reply.
3. **Single focus.** Handle one topic per message. Do not develop solutions, long lists or future scenarios while waiting for an answer. Never write "assuming you say yes...".
4. **Validate before moving on.** When the user answers, summarize their position in one or two lines citing the numbers (e.g. "2.1: going with A. 2.2: later."). Only then move to the next batch.
5. **Visible pending items.** If the user leaves questions unanswered, list them again with their original number before opening anything new. If other topics are queued, say so at the end: "Pending: topics 3 and 4".
6. **Brief replies**, unless the user asks for a long explanation.

## Numbering reset

- Number topics consecutively up to 12-15. Do not let numbering grow pointlessly (no "question 99").
- When reaching that range, if the earliest topics are closed, **suggest** a reset: "Topics 1 to 8 are closed. Shall we restart numbering from 1?".
- Reset only if the user accepts. A topic that is still open or has pending questions keeps its number until it is closed; it is never renumbered. New topics start from 1, skipping the numbers of open topics.
- After a reset, repeated numbers are fine: conversation context is enough to tell them apart.

## When to switch off

- If the user asks to execute, implement, code, run commands or create files, leave the mode and do the task normally.
- Project rules (`AGENTS.md`, `CLAUDE.md`, Backlog workflow) take priority over this skill.
- If the user says "go on by yourself", "do it all", "seguí solo", "hacelo todo" or equivalent, advance without pauses until they ask to return to the paused exchange.

## Example of a correct message

Context: the user answered "1.1 web only, 1.2 later" to the previous round and left 1.3 unanswered.

> **Validated:** 1.1 the app will be web only. 1.2 postponed.
>
> **Pending from before:** 1.3. Single currency or multi-currency?
>
> **Topic 2 – Permissions**
> 2.1. Can salespeople edit orders that are already confirmed?
> 2.2. Who approves discounts?
> &nbsp;&nbsp;&nbsp;2.2.1. If it is the manager, is there an amount cap?
