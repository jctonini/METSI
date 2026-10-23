---
name: ism-parcial-builder
description: "Build exams and their matching feedback guides for the Metodología de Sistemas de Información (658-1, FCE-UBA, Prof. Diego Carralbal) parciales, at two difficulty levels (normal / alta). Use this whenever the user asks to create, renovate, or generate a parcial exam for this course, a version of it at higher/lower difficulty, or a 'guía de feedback' / 'guía de corrección' to go with an exam. Also use it when the user asks to add a new topic, adjust the topic distribution, add tricky/subtle distractors, or fit an exam into a fixed number of pages for this course. Both the 1er parcial and the 2do parcial have their own template and question bank (the 2do is built with `--parcial 2`). The skill also bundles the course presentations converted to Markdown under `references/`, to ground questions in what the professor actually teaches."
---

# ISM Parcial Builder

Builds exams (and their answer-key "guía de feedback") for the Metodología de
Sistemas de Información parciales, reproducing exactly the format the
professor already uses - official FCE/UBA letterhead, numbered/lettered
question format, yellow-highlighted correct answers - at one of two
difficulty tiers.

## Before you start: gather the essentials

Don't guess these - ask if they're not already given in the conversation:

1. **Which parcial?** Both have a template + question bank:
   **1er parcial** (`assets/template_1erparcial.docx`, 10 questions, 2 carillas)
   and **2do parcial** (`assets/template_2doparcial.docx`, see "2do parcial"
   below). Never mix their banks or templates.
2. **Difficulty level(s)?** Normal, alta, or both (see difficulty guide
   below).
3. **Topic distribution.** Don't assume a fixed distribution - always ask.
   A distribution that has worked well for the 1er parcial (10 questions,
   feel free to offer it as a starting suggestion, but let the user set the
   real one):
   - Integración/tailoring - 2
   - Alcance - 1
   - Agilidad - 2
   - Cronograma - 2
   - Interesados - 1
   - Comunicaciones - 1
   - Clasificación de un problema (simple/complicado/complejo/caótico -
     **never name "Cynefin" in the question itself**, see below) - 1
4. **How many versions / parallel forms?** The professor has asked for
   things like "one normal-difficulty version and one harder, similar-but-
   not-identical version" and separately for "a third parallel form at the
   same difficulty as the first, with different scenarios, so it can be used
   as a second call/makeup exam." Confirm how many output files are wanted.

## Difficulty guide

This is the difference that actually matters between "normal" and "alta" -
it's not about harder vocabulary, it's about how many things the student has
to hold in their head at once.

**Dificultad normal:**
- Each question tests **one concept in isolation**, in a realistic but
  single-threaded business scenario (software, construcción, marketing,
  consultoría, I+D...).
- The scenario gives the student everything they need directly; no need to
  infer a second concept to answer.

**Dificultad alta:**
- Questions **combine two related sub-concepts** the student must
  distinguish from each other, not just recall - e.g. holgura *total* vs.
  holgura *libre* on the same activity, or velocity going up *while* quality
  goes down (the student has to diagnose which of two directions is the
  actual problem), or a hybrid project where a change touches both the
  predictive and the agile component at once and needs two different
  processes coordinated together.
- Distractors are closer to correct - "sounds right at first glance,"
  requiring the student to catch a specific wrong detail rather than reject
  an obviously silly option.

Build the "alta" version's questions independently per the distribution -
don't just reuse the "normal" version's scenarios with harder words bolted
on; the underlying scenario should genuinely require combining two ideas.

## Course reference material (`references/`)

`references/` holds the professor's course presentations (UBA-FCE, Prof. Diego Carralbal) converted to Markdown,
plus `references/INDEX.md` with a topic -> file map. Use it so the questions reflect **what is actually taught**
(terminology, definitions, process names, ITTOs, contract types, ITIL concepts...), not generic project-management knowledge.

How to use it:
1. **Read `references/INDEX.md` first.** It lists which file covers which topic for each parcial, what each file contains,
   and the known gaps. Don't read the whole folder (~2 MB): open only the files for the topics in the requested distribution,
   or `grep -n -i "<term>" references/*/*.md` to find a specific concept.
2. Folders: `references/primer_parcial/` (1er parcial), `references/segundo_parcial/` (2do parcial) and
   `references/compartido/` (Comunicaciones, used by both). Never mix the topics of one parcial into the other.
3. In each file, `<!-- Slide number: N -->` marks slides and the text after `### Notes:` is the speaker notes, which usually
   have the fullest explanation. Images and diagrams were **not** converted, so a formula or diagram drawn as an image is
   not in the text. The exception is `references/segundo_parcial/Frameworks operativos.md`, a hand transcription of the PDF
   (the original is next to it).
4. **Stay inside the material.** Before writing a question on a concept, confirm it appears in the references. If a topic
   from the question bank is listed under "Huecos conocidos" in `INDEX.md` (or you can't find it), tell the user and
   ask before writing questions on it. Don't present content as "from the course" if it isn't in the files.
5. Keep the question bank workflow as is: the references are the source of *content*, the bank is the source of *question
   style and already-vetted questions*. Use both.
6. When citing where a correct answer comes from (for example in the feedback guide's explanation), you can point to
   the presentation and slide number.

## Check the question bank before writing anything new

`assets/banco_preguntas_1erparcial.docx` (1er) and
`assets/banco_preguntas_2doparcial.docx` (2do) are growing repositories of every
question ever written for each parcial (the professor's original bank plus
everything this skill has generated since). Before drafting new questions:

1. Read it (`pandoc -t markdown assets/banco_preguntas_1erparcial.docx`, or
   extract via python-docx/XML if you need to know which options are
   highlighted correct) and check whether it already has a good question for
   each slot in the requested topic distribution.
2. Prefer **reusing or lightly adapting** an existing bank question over
   writing a new one from scratch, especially for the "dificultad normal"
   tier - it's already been vetted. For "dificultad alta", the bank
   questions are still a good source of the *scenario*, but you'll usually
   need to combine two of them or add a second sub-concept per the
   difficulty guide below.
3. Never reuse the exact same question twice within one exam, and avoid
   reusing a question that appeared in the *previous* exam for the same
   cohort if you know which one that was - ask if unsure.

After an exam is finalized (and ideally its feedback guide too, so you have
the option texts locked), **append the new questions back into the bank**
so it keeps growing (use the bank of the parcial you are working on; the script
detects the 1er or 2do bank layout by itself):

```bash
python3 scripts/append_to_bank.py assets/banco_preguntas_1erparcial.docx new_questions.json updated_bank.docx
python3 scripts/append_to_bank.py assets/banco_preguntas_2doparcial.docx new_questions.json updated_bank.docx
```

Then replace the bank file you appended to with `updated_bank.docx`
so the next invocation of this skill sees the update. Tell the user you did
this - don't silently grow their bank without mentioning it. `new_questions.json`
uses the same schema as `questions.json` for `build_exam.py` (a `"questions"`
list of `{"stem":..., "options":[{"text":..., "correct": bool}, ...]}` - any
number of options per question, doesn't have to be exactly 5, matching how
the existing bank has some 4-option and some 5-option questions). The script
auto-continues the bank's numbering and clones a fresh independent a/b/c...
lettered list per new question, so it's safe to run repeatedly as the bank
keeps growing.

## Writing the questions

Each question needs a `stem` and exactly 5 `options` lettered a-e (the
generator adds the lettering automatically - just supply them in order; the
2do parcial also accepts 4 options, see below),
with 1 or more marked `correct: true`. All-case-based: no bare definitions.
Ground every question in a short realistic scenario (a couple of sentences)
before asking what the student should do. The concepts behind the options must come from
`references/` (see "Course reference material"), so every correct answer can be defended with a presentation.

### Subtle "not obviously wrong" distractors

The professor specifically wants some (not all) questions to include an
incorrect option that isn't obviously wrong on a first read - a student has
to actually understand the material to rule it out. Use sparingly (roughly
3-5 across a 10-question exam is about right - never in every question, and
never make every option in a question a trap). Two patterns that have worked
well:

1. **Cross-domain mixing** - insert a technique from a *different* knowledge
   area into a question that's clearly about another area. E.g. a pure
   schedule/float question with a distractor that proposes "apply a cost
   contingency reserve technique" - plausible-sounding project-management
   vocabulary, wrong domain for what's actually being asked.
2. **Invalid term chained onto a valid one** - an option that starts with a
   real, correct technique and then appends something that doesn't belong,
   invalidating the whole option even though the first half reads correctly.
   E.g. *"Aplicar fast tracking, el marco de clasificación de problemas
   según su complejidad, o ambos, según el caso"* - fast tracking is a real
   schedule-compression technique, but chaining a completely different
   concept onto it (with "según el caso" implying they're interchangeable)
   makes the whole option wrong.

### Never name "Cynefin" in the exam itself

One recurring question type asks the student to classify a problem as
simple/complicado/complejo/caótico and pick the matching management
approach - this is the Cynefin framework, but **the word "Cynefin" must
never appear in the question stem or in any option** the student sees. The
point is for them to recognize the pattern and reason about it, not pattern-
match on a proper noun. It's fine (expected, even) to name Cynefin in the
**feedback guide's explanation** - that's for the professor/grader, not
something the student reads before or during the exam.

## Fitting the exam onto 2 pages (1er parcial)

The professor wants each 1er-parcial exam to print on exactly 2 A4 carillas. (The 2do parcial has no fixed page target - see "2do parcial".) **This is a
text-length problem, not a spacing problem** - the generator script
(`scripts/build_exam.py`) preserves the template's original spacing and
margins untouched on purpose, because that's what the professor's official
document uses. Don't try to fix overflow by shrinking spacing/margins;
shorten the questions instead.

Rough per-line budgets that have worked (Arial in the template's column
width): **~95-100 characters per line for an option**, aim for options that
fit on 1 line and accept some 2-line options; **stems can run 2-3 lines**
(~190-280 characters) since they carry the scenario. With 10 questions at
that budget, the exam fits in 2 pages with a little room to spare.

Workflow:
1. Draft all questions with those budgets in mind from the start - it's much
   easier than trimming after the fact.
2. Run `scripts/build_exam.py questions.json output.docx` - it builds the
   docx, converts it to PDF, and reports the page count.
3. If it's over 2 pages, don't touch spacing. Find and shorten the longest
   stems/options first (they're the ones most likely wrapping to an extra
   line) - reword for concision without changing the scenario's meaning or
   which answer is correct. Rebuild and recheck. Two or three short rounds
   of trimming, prioritizing the longest paragraphs each time, has been
   enough in practice.
4. If, after trimming everything reasonably, there's still a sliver of
   overflow (a line or two), it's fine to ask the user whether to trim one
   more specific line or accept a small spacing tweak as a last resort -
   don't silently loosen spacing without asking.

## Building the exam file

```bash
python3 scripts/build_exam.py questions.json output.docx              # 1er parcial (default)
python3 scripts/build_exam.py questions.json output.docx --parcial 2  # 2do parcial
```

`questions.json` schema:
```json
{
  "questions": [
    {
      "stem": "...",
      "options": [
        {"text": "...", "correct": true},
        {"text": "...", "correct": false},
        {"text": "...", "correct": false},
        {"text": "...", "correct": false},
        {"text": "...", "correct": false}
      ]
    }
  ]
}
```
The script reuses the template's 10 pre-built independent letter-lists (so
each question restarts at "a)") and will auto-generate more if given over 10
questions. It prints the resulting page count - read that output, don't
assume.

**Always render and look at the result** before presenting it - convert to
PDF, view at least page 1 (to confirm the letterhead/logos came through) and
the last page (to confirm nothing overflowed or left a stray blank page):
```bash
python /mnt/skills/public/docx/scripts/office/soffice.py --headless --convert-to pdf output.docx
pdftoppm -jpeg -r 90 output.pdf page
```
A trailing blank page has bitten us before - it comes from leftover empty
paragraphs before the section break. This template's tail fragment
(`assets/fragments/doc_tail.xml`) already omits them, so a fresh build
shouldn't have this problem; if you ever hand-edit the XML directly instead
of going through the script, watch out for it.

## Building the feedback guide

Only build this once the exam itself is confirmed final - the guide must
reproduce the exam's stems and options **verbatim**, not paraphrased. This
matters a lot: an earlier guide that paraphrased the questions independently
turned out to describe a subtly different scenario in one question (a
stakeholder power/interest quadrant that didn't match the exam's own
framing) and to name "Cynefin" outright in two others, defeating the point
of not naming it in the exam. Always generate the guide *from the same
`questions.json`* used to build the exam - never redraft the text from
memory - plus one added field per question:

```json
{"stem": "...", "options": [...], "explanation": "Teacher-facing rationale, can name frameworks like Cynefin explicitly here."}
```

```bash
node scripts/build_feedback_guide.js questions.json output.docx "1er Examen Parcial" "Dificultad alta"
```

Produces a `.docx` (not a Google Doc) with: title, then per question - the
exact bold stem, all 5 options numbered 1-5 with **[Correcta.]** /
**[Incorrecta.]** in bold, and a closing **Explicación:** paragraph. This
mirrors the structure the professor has been using for the feedback guides.

## Cross-checking an exam against its guide

If asked to check that a guide and an exam agree (this has come up before,
including via a Google Doc link), fetch/read both, extract each question's
stem + options + which are marked correct from each side, and diff them
question by question. Report concretely: which question, what differs (stem
wording, an option's text, which option is marked correct, terminology that
appears in one but not the other), don't just say "looks fine." Two
recurring failure modes worth specifically checking for: (1) the guide
describing a scenario detail that doesn't quite match the exam's framing of
the same setup, and (2) the guide's question text (not its explanation)
naming a framework the exam deliberately doesn't name.

## 2do parcial

What exists: `assets/template_2doparcial.docx` (the professor's own 2do exam
with the questions removed - FCE/UBA letterhead, name/registro line, "0. ¿Necesitas
certificado de examen? SI / NO"), `assets/fragments_2do/` (`doc_head.xml`,
`doc_tail.xml` and `page_break_header.xml`) and
`assets/banco_preguntas_2doparcial.docx` (52 questions, correct answers
highlighted yellow; most have 2+ correct options).

Reference material for the 2do parcial: `references/segundo_parcial/` (Cost, Risk, Quality, Procurements, Negotiation,
Frameworks operativos) and `references/compartido/PM-10-Comunications.md`. See `references/INDEX.md` for what each covers and
the known gaps (MTTR/RCA, mediación/arbitraje, costos hundidos, estimación análoga, TCPI, anclaje, benchmarking are in the
question bank but not in the presentations).

How it differs from the 1er parcial:
- **Numbering:** one multilevel list - question numbers at level 0 (the
  certificate line is "0.", questions start at 1), options "a. b. c." at level 1,
  restarting by themselves. No per-question lists, no question-count cap.
- **Options:** 4 or 5 per question; the professor's style often closes with
  "Ninguna es correcta." / "Todas son correctas." (only mark those correct when
  they truly are). Several options can be correct; highlight every correct one.
- **Fixed format:** **20 questions + question 0** (the certificate line, already in
  the template) and **at most 4 carillas - a hard limit**. `build_exam.py --parcial 2`
  warns if the question count is not 20 or the page count exceeds 4. If it
  overflows, shorten the longest stems/options (same rule as the 1er parcial: text
  length, never spacing/margins) and rebuild.
- **Layout:** the professor's exam forces a page break after question 12 and
  repeats the "APELLIDO Y NOMBRE ... REGISTRO" line at the top of the next page.
  `build_exam.py --parcial 2` reproduces it by default when there are more than 12
  questions; override with `"page_breaks_after": [12]` (1-based; `[]` = none) at
  the top level of `questions.json`. The professor's own 202401 exam renders at 4
  pages in LibreOffice, so it is right at the limit.
- **Topics:** the 2do covers costs/EVM, risks, procurement/contracts, quality,
  communications and operating frameworks (ITIL/ITSM, operating models, customer journey, SLA vs. XLA). The 202401 exam (20 questions)
  had roughly: costs & EVM 8, risks 4, contracts 2, quality 2, communications 1,
  procurement 2, cost control 1. Treat that as a starting suggestion only and
  **always ask the user for the real distribution**, as for the 1er parcial.
- **Reading the bank's correct answers:** they are highlight runs
  (`<w:highlight w:val="yellow"/>`) in `word/document.xml`; extract them from
  the XML (pandoc drops the highlighting).

The difficulty-tier philosophy and the subtle-distractor guidance above carry
over as-is (the "never name Cynefin" rule only matters for problem-classification
questions, which are a 1er-parcial topic). The feedback guide works unchanged:
`node scripts/build_feedback_guide.js questions.json guide.docx "2do Examen Parcial" "Dificultad normal"`.

### Why the template is a single .docx file, not an unzipped folder

A `.docx` is internally a zip of XML files, and OOXML requires some of those
internal filenames to look like `[Content_Types].xml` and `.rels` -
characters (`[`, `]`, a leading dot) that this platform's skill-upload
validator rejects when they appear as actual loose files in an uploaded
skill package. Keeping the template zipped up as one `.docx` file hides
those filenames inside the archive, where they're fine - Word and every
docx-handling script expects them there. `build_exam.py` and
`append_to_bank.py` both unzip their input to a scratch directory under
`/tmp` at build time and rezip the result, so this is invisible during
normal use. If you're ever tempted to `unzip` a template into `assets/` for
easier editing, rezip it back into a single file before packaging the skill
- otherwise the "Save skill" step will fail with an invalid-characters
error that has nothing to do with the exam text itself.
