#!/usr/bin/env python3
"""
Build an ISM parcial exam .docx from a JSON question set, using the official
FCE/UBA template (logos, header, nombre/registro fields) preserved exactly.

Usage:
    python3 build_exam.py questions.json output.docx [--parcial 1|2]

    --parcial 1 (default) uses assets/template_1erparcial.docx.
    --parcial 2 uses assets/template_2doparcial.docx (see "2do parcial" below).

questions.json schema:
{
  "questions": [
    {
      "stem": "...",
      "options": [
        {"text": "...", "correct": true},
        {"text": "...", "correct": false},
        ... (5 options, a-e)
      ]
    },
    ...
  ]
}

The script reuses the template's pre-built list definitions (numId 21-30,
one per question, each an independent lowerLetter a/b/c/d/e list) for the
first 10 questions. If more than 10 questions are requested, it clones the
abstractNum/num pattern to generate additional independent lettered lists
on the fly, so the skill isn't hard-capped at 10 questions.

2do parcial: its template is the professor's own 2do exam, whose numbering is a
single multilevel list (level 0 = "0." certificate line / "1. 2. 3." question
stems, level 1 = "a. b. c." options). Level-1 lettering restarts by itself after
each stem, so there are no per-question lists and no cap on the number of
questions. Questions may have 4 or 5 options. The professor's 2do exam forces a
page break after question 12 and repeats the "APELLIDO Y NOMBRE ... REGISTRO"
line at the top of the new page; this is reproduced by default when the exam has
more than 12 questions, and can be changed with an optional top-level key in
questions.json: "page_breaks_after": [12]  (1-based question numbers; use []
for no manual break).

Spacing/margins are left exactly as in the official template - untouched.
Fitting the exam into 2 pages is a TEXT LENGTH problem, not a spacing
problem (see SKILL.md budget guidance) - do not loosen this script's
spacing to "solve" overflow; shorten the questions instead.
"""
import json
import re
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
# The template is stored as a single .docx file (not an exploded folder) --
# .docx internals include filenames like "[Content_Types].xml" and ".rels"
# that some skill-upload validators reject when they appear as loose files
# in the skill package. Keeping it zipped avoids that; we unzip to a temp
# dir at build time instead.
PARCIALES = {
    1: {"template": "template_1erparcial.docx", "fragments": "fragments"},
    2: {"template": "template_2doparcial.docx", "fragments": "fragments_2do"},
}
# Set by configure(); defaults to the 1er parcial so existing callers keep working.
TEMPLATE_DOCX = None
HEAD_XML = TAIL_XML = PAGE_BREAK_XML = ""


def configure(parcial: int = 1):
    global TEMPLATE_DOCX, HEAD_XML, TAIL_XML, PAGE_BREAK_XML
    if parcial not in PARCIALES:
        raise SystemExit(f"Unknown parcial {parcial!r}; expected one of {sorted(PARCIALES)}")
    cfg = PARCIALES[parcial]
    TEMPLATE_DOCX = SKILL_DIR / "assets" / cfg["template"]
    frag = SKILL_DIR / "assets" / cfg["fragments"]
    HEAD_XML = (frag / "doc_head.xml").read_text(encoding="utf-8")
    TAIL_XML = (frag / "doc_tail.xml").read_text(encoding="utf-8")
    pb = frag / "page_break_header.xml"
    PAGE_BREAK_XML = pb.read_text(encoding="utf-8") if pb.exists() else ""


configure(1)

# numId used for the shared, auto-continuing "1. 2. 3. ..." question-stem list
STEM_NUM_ID = 20
# numIds 21-30 are the ten pre-built independent lowerLetter (a-e) lists,
# one per question, already defined in the template's numbering.xml
PREBUILT_OPTION_NUM_IDS = list(range(21, 31))


def xml_escape(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def stem_paragraph_xml(text: str) -> str:
    return (
        f'<w:p><w:pPr><w:pStyle w:val="Prrafodelista"/>'
        f'<w:numPr><w:ilvl w:val="0"/><w:numId w:val="{STEM_NUM_ID}"/></w:numPr>'
        f'<w:suppressAutoHyphens w:val="0"/>'
        f'<w:spacing w:after="120" w:line="240" w:lineRule="auto"/>'
        f'<w:ind w:leftChars="0" w:left="5" w:firstLineChars="0" w:hanging="7"/>'
        f'<w:contextualSpacing w:val="0"/><w:textDirection w:val="lrTb"/>'
        f'<w:textAlignment w:val="auto"/><w:outlineLvl w:val="9"/></w:pPr>'
        f'<w:r><w:rPr><w:b/><w:bCs/></w:rPr>'
        f'<w:t xml:space="preserve">{xml_escape(text)}</w:t></w:r></w:p>'
    )


def option_paragraph_xml(text: str, correct: bool, num_id: int) -> str:
    highlight = '<w:highlight w:val="yellow"/>' if correct else ""
    return (
        f'<w:p><w:pPr><w:pStyle w:val="Prrafodelista"/>'
        f'<w:numPr><w:ilvl w:val="0"/><w:numId w:val="{num_id}"/></w:numPr>'
        f'<w:suppressAutoHyphens w:val="0"/>'
        f'<w:spacing w:after="60" w:line="240" w:lineRule="auto"/>'
        f'<w:ind w:leftChars="0" w:left="5" w:firstLineChars="0" w:hanging="7"/>'
        f'<w:contextualSpacing w:val="0"/><w:textDirection w:val="lrTb"/>'
        f'<w:textAlignment w:val="auto"/><w:outlineLvl w:val="9"/></w:pPr>'
        f'<w:r><w:rPr>{highlight}</w:rPr>'
        f'<w:t xml:space="preserve">{xml_escape(text)}</w:t></w:r></w:p>'
    )


def separator_paragraph_xml() -> str:
    return (
        '<w:p><w:pPr><w:spacing w:after="160"/>'
        '<w:ind w:left="0" w:hanging="2"/></w:pPr></w:p>'
    )


# ---------------------------------------------------------------------------
# 2do parcial: single multilevel list (numId 1; ilvl 0 = stems, ilvl 1 = a. b. c.)
# ---------------------------------------------------------------------------
ARIAL = '<w:rFonts w:ascii="Arial" w:cs="Arial" w:eastAsia="Arial" w:hAnsi="Arial"/>'
ML_NUM_ID = 1
DEFAULT_PAGE_BREAKS_2DO = [12]   # the professor's 2do exam breaks after question 12
EXPECTED_QUESTIONS_2DO = 20      # question 0 (certificate) is in the template
MAX_PAGES_2DO = 4                # hard limit: the 2do exam must not exceed 4 carillas


def ml_spacer_xml(left: int = 360) -> str:
    return (
        f'<w:p><w:pPr><w:ind w:left="{left}" w:firstLine="0"/><w:jc w:val="both"/>'
        f'<w:rPr>{ARIAL}</w:rPr></w:pPr></w:p>'
    )


def ml_stem_xml(text: str) -> str:
    bold = '<w:b w:val="1"/><w:bCs w:val="1"/>'
    return (
        f'<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="{ML_NUM_ID}"/></w:numPr>'
        f'<w:ind w:left="360" w:hanging="360"/><w:jc w:val="both"/>'
        f'<w:rPr>{ARIAL}{bold}</w:rPr></w:pPr>'
        f'<w:r><w:rPr>{ARIAL}{bold}</w:rPr>'
        f'<w:t xml:space="preserve">{xml_escape(text)}</w:t></w:r></w:p>'
    )


def ml_option_xml(text: str, correct: bool) -> str:
    hl = '<w:highlight w:val="yellow"/>' if correct else ""
    return (
        f'<w:p><w:pPr><w:numPr><w:ilvl w:val="1"/><w:numId w:val="{ML_NUM_ID}"/></w:numPr>'
        f'<w:ind w:left="851" w:hanging="360"/><w:jc w:val="both"/>'
        f'<w:rPr>{ARIAL}{hl}</w:rPr></w:pPr>'
        f'<w:r><w:rPr>{ARIAL}{hl}</w:rPr>'
        f'<w:t xml:space="preserve">{xml_escape(text)}</w:t></w:r></w:p>'
    )


def build_document_xml_2do(questions, page_breaks) -> str:
    parts = [HEAD_XML]
    for i, q in enumerate(questions):
        opts = q["options"]
        assert 4 <= len(opts) <= 5, f"Question {i+1} must have 4 or 5 options, got {len(opts)}"
        assert any(o.get("correct") for o in opts), f"Question {i+1} has no correct option marked"
        parts.append(ml_spacer_xml(360))
        parts.append(ml_stem_xml(q["stem"]))
        parts.append(ml_spacer_xml(851))
        for opt in opts:
            parts.append(ml_option_xml(opt["text"], bool(opt.get("correct"))))
        if (i + 1) in page_breaks and i + 1 < len(questions):
            parts.append(PAGE_BREAK_XML)
    parts.append(TAIL_XML)
    return "".join(parts)


def ensure_option_num_ids(working_dir: Path, n_questions: int):
    """Make sure there are enough independent lettered-list numIds for
    n_questions. Reuses the 10 pre-built ones; clones the pattern for more."""
    if n_questions <= len(PREBUILT_OPTION_NUM_IDS):
        return PREBUILT_OPTION_NUM_IDS[:n_questions]

    numbering_path = working_dir / "word" / "numbering.xml"
    content = numbering_path.read_text(encoding="utf-8")

    template_match = re.search(
        r'<w:abstractNum w:abstractNumId="23">.*?</w:abstractNum>', content, re.S
    )
    if not template_match:
        raise RuntimeError("Could not find template abstractNum block to clone")
    template_block = template_match.group()

    existing_abstract_ids = [int(x) for x in re.findall(r'w:abstractNumId="(\d+)"', content)]
    existing_num_ids = [int(x) for x in re.findall(r'<w:num w:numId="(\d+)"', content)]
    next_abstract_id = max(existing_abstract_ids) + 1
    next_num_id = max(existing_num_ids) + 1

    extra_needed = n_questions - len(PREBUILT_OPTION_NUM_IDS)
    new_ids = []
    new_abstract_blocks = []
    new_num_blocks = []
    for i in range(extra_needed):
        aid = next_abstract_id + i
        nid = next_num_id + i
        block = template_block.replace('w:abstractNumId="23"', f'w:abstractNumId="{aid}"', 1)
        new_abstract_blocks.append(block)
        new_num_blocks.append(f'<w:num w:numId="{nid}"><w:abstractNumId w:val="{aid}"/></w:num>')
        new_ids.append(nid)

    # abstractNum defs go before the first <w:num> element; <w:num> defs go
    # right before </w:numbering>
    first_num_pos = content.find("<w:num ")
    content = (
        content[:first_num_pos]
        + "".join(new_abstract_blocks)
        + content[first_num_pos:]
    )
    content = content.replace("</w:numbering>", "".join(new_num_blocks) + "</w:numbering>")
    numbering_path.write_text(content, encoding="utf-8")

    return PREBUILT_OPTION_NUM_IDS + new_ids


def build_document_xml(questions, option_num_ids) -> str:
    parts = [HEAD_XML]
    for i, q in enumerate(questions):
        if i > 0:
            parts.append(separator_paragraph_xml())
        parts.append(stem_paragraph_xml(q["stem"]))
        opts = q["options"]
        assert len(opts) == 5, f"Question {i+1} must have exactly 5 options, got {len(opts)}"
        n_correct = sum(1 for o in opts if o.get("correct"))
        assert n_correct >= 1, f"Question {i+1} has no correct option marked"
        for opt in opts:
            parts.append(option_paragraph_xml(opt["text"], bool(opt.get("correct")), option_num_ids[i]))
    parts.append(TAIL_XML)
    return "".join(parts)


def build_exam(questions_json_path: str, output_docx_path: str, parcial: int = 1):
    configure(parcial)
    with open(questions_json_path, encoding="utf-8") as f:
        data = json.load(f)
    questions = data["questions"]

    work_dir = Path("/tmp/ism_exam_build")
    if work_dir.exists():
        shutil.rmtree(work_dir)
    work_dir.mkdir(parents=True)
    with zipfile.ZipFile(TEMPLATE_DOCX) as zf:
        zf.extractall(work_dir)

    if parcial == 2:
        if len(questions) != EXPECTED_QUESTIONS_2DO:
            print(f"WARNING: the 2do parcial has {EXPECTED_QUESTIONS_2DO} questions (plus question 0, "
                  f"the certificate line); got {len(questions)}.")
        page_breaks = data.get("page_breaks_after", DEFAULT_PAGE_BREAKS_2DO)
        doc_xml = build_document_xml_2do(questions, set(page_breaks))
    else:
        option_num_ids = ensure_option_num_ids(work_dir, len(questions))
        doc_xml = build_document_xml(questions, option_num_ids)
    (work_dir / "word" / "document.xml").write_text(doc_xml, encoding="utf-8")

    output_path = Path(output_docx_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if output_path.exists():
        output_path.unlink()

    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for file in sorted(work_dir.rglob("*")):
            if file.is_file():
                zf.write(file, file.relative_to(work_dir))

    print(f"Wrote {output_path} ({len(questions)} questions)")
    return str(output_path)


def check_page_count(docx_path: str) -> int:
    """Convert to PDF with LibreOffice and return the page count. Requires
    soffice on PATH (available in the sandboxed environment this skill runs in)."""
    out_dir = Path(docx_path).parent
    subprocess.run(
        ["soffice", "--headless", "--convert-to", "pdf", "--outdir", str(out_dir), docx_path],
        check=True, capture_output=True,
    )
    pdf_path = out_dir / (Path(docx_path).stem + ".pdf")
    result = subprocess.run(["pdfinfo", str(pdf_path)], check=True, capture_output=True, text=True)
    for line in result.stdout.splitlines():
        if line.startswith("Pages:"):
            return int(line.split(":")[1].strip())
    raise RuntimeError("Could not determine page count")


if __name__ == "__main__":
    args = sys.argv[1:]
    parcial = 1
    if "--parcial" in args:
        i = args.index("--parcial")
        parcial = int(args[i + 1])
        del args[i:i + 2]
    if len(args) != 2:
        print("Usage: python3 build_exam.py questions.json output.docx [--parcial 1|2]")
        sys.exit(1)
    out = build_exam(args[0], args[1], parcial)
    try:
        pages = check_page_count(out)
        print(f"Page count: {pages}")
        if parcial == 1 and pages > 2:
            print("WARNING: exceeds 2 pages. Shorten the longest stems/options and rebuild.")
        elif parcial == 2:
            if pages > MAX_PAGES_2DO:
                print(f"WARNING: exceeds {MAX_PAGES_2DO} pages (hard limit for the 2do parcial). "
                      "Shorten the longest stems/options and rebuild; do not touch spacing.")
    except Exception as e:
        print(f"(Could not auto-check page count: {e})")
