#!/usr/bin/env python3
"""
Append new questions to the ISM question bank (banco de preguntas), matching
its existing numbering/formatting exactly (auto-continuing question numbers,
one independent a-e lettered list per question, correct answers highlighted
yellow).

Usage:
    python3 append_to_bank.py bank.docx questions.json output.docx

questions.json schema: same as build_exam.py's - {"questions": [{"stem":...,
"options": [{"text":..., "correct": bool}, ...]}]}.

Two bank layouts are supported, detected automatically:
  * 1er parcial bank: one shared numId for the question numbers plus one
    independent a-e list per question (new lists are cloned per question).
  * 2do parcial bank: a single multilevel list (numId N; ilvl 0 = question
    number, ilvl 1 = a. b. c. options). Level-1 lettering restarts by itself,
    so nothing is added to numbering.xml; new paragraphs reuse that numId.

Safe to run repeatedly on the growing bank: each run reads whatever the
current last paragraph in the bank is and appends after it, so the bank
keeps accumulating rather than needing to be rebuilt from scratch.
"""
import json
import re
import shutil
import sys
import zipfile
from pathlib import Path


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_separator(rpr_extra: str = "") -> str:
    return (
        '<w:p><w:pPr><w:spacing w:line="276" w:lineRule="auto"/>'
        '<w:ind w:left="0" w:hanging="2"/><w:jc w:val="both"/>'
        '<w:rPr><w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>'
        f'{rpr_extra}</w:rPr></w:pPr></w:p>'
    )


def build_stem(text: str, stem_num_id: int) -> str:
    return (
        f'<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="{stem_num_id}"/></w:numPr>'
        '<w:spacing w:line="276" w:lineRule="auto"/><w:ind w:left="0" w:hanging="2"/>'
        '<w:jc w:val="both"/><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/></w:rPr>'
        '</w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>'
        f'<w:b/></w:rPr><w:t xml:space="preserve">{esc(text)}</w:t></w:r></w:p>'
    )


def build_option(text: str, correct: bool, num_id: int) -> str:
    highlight = '<w:highlight w:val="yellow"/>' if correct else ""
    return (
        f'<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="{num_id}"/></w:numPr>'
        '<w:spacing w:line="276" w:lineRule="auto"/><w:ind w:left="0" w:hanging="2"/>'
        f'<w:jc w:val="both"/><w:rPr><w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>{highlight}</w:rPr>'
        '</w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>'
        f'{highlight}</w:rPr><w:t xml:space="preserve">{esc(text)}</w:t></w:r></w:p>'
    )


def find_stem_num_id(document_xml: str) -> int:
    """The bank uses one shared numId for the auto-continuing question-number
    list (1, 2, 3, ...) -- find it by looking at the very first numbered
    paragraph in the document."""
    m = re.search(r'<w:numPr><w:ilvl w:val="0"/><w:numId w:val="(\d+)"/></w:numPr>', document_xml)
    if not m:
        raise RuntimeError("Could not find the question-number list's numId in the bank")
    return int(m.group(1))


def multilevel_num_id(document_xml: str):
    """If the bank uses ONE multilevel list (the same numId carries both the
    ilvl-0 question stems and the ilvl-1 options), return that numId; else None."""
    pairs = re.findall(r'<w:numPr><w:ilvl w:val="(\d+)"/><w:numId w:val="(\d+)"/></w:numPr>', document_xml)
    stem_ids = {n for l, n in pairs if l == "0"}
    opt_ids = {n for l, n in pairs if l == "1"}
    shared = stem_ids & opt_ids
    if not shared:
        return None
    # the dominant one (the bank's main list)
    return int(max(shared, key=lambda n: sum(1 for _, x in pairs if x == n)))


_ML_RFONTS = '<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>'


def ml_separator(left: int, bold: bool = False) -> str:
    b = "<w:b/>" if bold else ""
    return (f'<w:p><w:pPr><w:spacing w:line="260" w:lineRule="atLeast"/><w:ind w:left="{left}"/>'
            f'<w:jc w:val="both"/><w:rPr>{_ML_RFONTS}{b}</w:rPr></w:pPr></w:p>')


def ml_stem(text: str, num_id: int) -> str:
    return (f'<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="{num_id}"/></w:numPr>'
            f'<w:spacing w:line="260" w:lineRule="atLeast"/><w:jc w:val="both"/>'
            f'<w:rPr>{_ML_RFONTS}<w:b/></w:rPr></w:pPr>'
            f'<w:r><w:rPr>{_ML_RFONTS}<w:b/></w:rPr><w:t xml:space="preserve">{esc(text)}</w:t></w:r></w:p>')


def ml_option(text: str, correct: bool, num_id: int) -> str:
    hl = '<w:highlight w:val="yellow"/>' if correct else ""
    return (f'<w:p><w:pPr><w:numPr><w:ilvl w:val="1"/><w:numId w:val="{num_id}"/></w:numPr>'
            f'<w:spacing w:line="260" w:lineRule="atLeast"/><w:ind w:left="851"/><w:jc w:val="both"/>'
            f'<w:rPr>{_ML_RFONTS}{hl}</w:rPr></w:pPr>'
            f'<w:r><w:rPr>{_ML_RFONTS}{hl}</w:rPr><w:t xml:space="preserve">{esc(text)}</w:t></w:r></w:p>')


def append_multilevel(document_xml: str, new_questions, num_id: int) -> str:
    """Append questions to a single-multilevel-list bank. Inserted right before
    the body-level <w:sectPr> (these banks have no trailing empty paragraph)."""
    parts = []
    for q in new_questions:
        assert len(q["options"]) >= 2, "each question needs at least 2 options"
        assert any(o.get("correct") for o in q["options"]), "each question needs a correct option marked"
        parts.append(ml_separator(360, bold=True))
        parts.append(ml_stem(q["stem"], num_id))
        parts.append(ml_separator(851))
        for opt in q["options"]:
            parts.append(ml_option(opt["text"], bool(opt.get("correct")), num_id))
    sect_pos = document_xml.rindex("<w:sectPr")
    return document_xml[:sect_pos] + "".join(parts) + document_xml[sect_pos:]


def write_docx(work_dir: Path, output_docx_path: str):
    output_path = Path(output_docx_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if output_path.exists():
        output_path.unlink()
    files = sorted((f for f in work_dir.rglob("*") if f.is_file()),
                   key=lambda f: (f.relative_to(work_dir).as_posix() != "[Content_Types].xml",
                                  f.relative_to(work_dir).as_posix()))
    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for file in files:
            zf.write(file, file.relative_to(work_dir))


def append_to_bank(bank_docx_path: str, questions_json_path: str, output_docx_path: str):
    with open(questions_json_path, encoding="utf-8") as f:
        new_questions = json.load(f)["questions"]

    work_dir = Path("/tmp/ism_bank_append")
    if work_dir.exists():
        shutil.rmtree(work_dir)
    work_dir.mkdir(parents=True)
    with zipfile.ZipFile(bank_docx_path) as zf:
        zf.extractall(work_dir)

    doc_path = work_dir / "word" / "document.xml"
    numbering_path = work_dir / "word" / "numbering.xml"
    document_xml = doc_path.read_text(encoding="utf-8")
    numbering_xml = numbering_path.read_text(encoding="utf-8")

    ml_id = multilevel_num_id(document_xml)
    if ml_id is not None:
        document_xml = append_multilevel(document_xml, new_questions, ml_id)
        doc_path.write_text(document_xml, encoding="utf-8")
        write_docx(work_dir, output_docx_path)
        print(f"Appended {len(new_questions)} questions to {output_docx_path} (multilevel bank, numId {ml_id})")
        return str(output_docx_path)

    stem_num_id = find_stem_num_id(document_xml)

    # Clone the lettered-list pattern for each new question.
    template_match = re.search(r'<w:abstractNum w:abstractNumId="(\d+)">.*?</w:abstractNum>',
                                numbering_xml, re.S)
    if not template_match:
        raise RuntimeError("Could not find an abstractNum block to clone in numbering.xml")
    template_id = template_match.group(1)
    template_block = template_match.group(0)

    existing_abstract_ids = [int(x) for x in re.findall(r'w:abstractNumId="(\d+)"', numbering_xml)]
    existing_num_ids = [int(x) for x in re.findall(r'<w:num w:numId="(\d+)"', numbering_xml)]
    next_abstract_id = max(existing_abstract_ids) + 1
    next_num_id = max(existing_num_ids) + 1

    new_abstract_blocks, new_num_blocks, option_num_ids = [], [], []
    for i in range(len(new_questions)):
        aid = next_abstract_id + i
        nid = next_num_id + i
        new_abstract_blocks.append(template_block.replace(f'w:abstractNumId="{template_id}"',
                                                            f'w:abstractNumId="{aid}"', 1))
        new_num_blocks.append(f'<w:num w:numId="{nid}"><w:abstractNumId w:val="{aid}"/></w:num>')
        option_num_ids.append(nid)

    first_num_pos = numbering_xml.find("<w:num ")
    numbering_xml = numbering_xml[:first_num_pos] + "".join(new_abstract_blocks) + numbering_xml[first_num_pos:]

    # w:num elements must be inserted before <w:numIdMacAtCleanup> if present
    # (schema element order), not after it.
    cleanup_pos = numbering_xml.find("<w:numIdMacAtCleanup")
    if cleanup_pos != -1:
        numbering_xml = numbering_xml[:cleanup_pos] + "".join(new_num_blocks) + numbering_xml[cleanup_pos:]
        numbering_xml = re.sub(r'<w:numIdMacAtCleanup w:val="\d+"/>',
                                f'<w:numIdMacAtCleanup w:val="{option_num_ids[-1]}"/>', numbering_xml)
    else:
        numbering_xml = numbering_xml.replace("</w:numbering>",
                                               "".join(new_num_blocks) + "</w:numbering>")
    numbering_path.write_text(numbering_xml, encoding="utf-8")

    # Build the new paragraphs and insert them right before the body's last
    # paragraph (bank files end with one trailing empty/bookmark paragraph
    # before <w:sectPr> -- insert ahead of that, not after).
    new_paragraphs = []
    for q, num_id in zip(new_questions, option_num_ids):
        new_paragraphs.append(build_separator())
        new_paragraphs.append(build_stem(q["stem"], stem_num_id))
        new_paragraphs.append(build_separator())
        assert len(q["options"]) >= 2, "each question needs at least 2 options"
        assert any(o.get("correct") for o in q["options"]), "each question needs a correct option marked"
        for opt in q["options"]:
            new_paragraphs.append(build_option(opt["text"], bool(opt.get("correct")), num_id))
    new_block = "".join(new_paragraphs)

    sect_pos = document_xml.find("<w:sectPr")
    last_p_start = document_xml.rfind("<w:p ", 0, sect_pos)
    document_xml = document_xml[:last_p_start] + new_block + document_xml[last_p_start:]
    doc_path.write_text(document_xml, encoding="utf-8")

    output_path = Path(output_docx_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if output_path.exists():
        output_path.unlink()
    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for file in sorted(work_dir.rglob("*")):
            if file.is_file():
                zf.write(file, file.relative_to(work_dir))

    print(f"Appended {len(new_questions)} questions to {output_path}")
    return str(output_path)


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python3 append_to_bank.py bank.docx questions.json output.docx")
        sys.exit(1)
    append_to_bank(sys.argv[1], sys.argv[2], sys.argv[3])
