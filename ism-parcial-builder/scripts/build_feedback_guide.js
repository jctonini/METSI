// Build the "Guía de Corrección y Feedback" .docx from the same questions.json
// used to build the exam (each question additionally needs an "explanation"
// field). Preserves the format established for this course: title, one
// section per question with numbered options (their correct/incorrect
// status in bold) and a closing "Explicación:" paragraph.
//
// Usage: node build_feedback_guide.js questions.json output.docx "1er Examen Parcial" "Dificultad normal"

const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
        LevelFormat, convertInchesToTwip } = require("docx");
const fs = require("fs");

const [, , questionsPath, outputPath, examLabel, difficultyLabel] = process.argv;

if (!questionsPath || !outputPath) {
  console.error("Usage: node build_feedback_guide.js questions.json output.docx [examLabel] [difficultyLabel]");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));
const questions = data.questions;

questions.forEach((q, i) => {
  if (!q.explanation) {
    throw new Error(`Question ${i + 1} is missing "explanation" - required for the feedback guide.`);
  }
});

const numberingConfigs = [];
questions.forEach((q, idx) => {
  numberingConfigs.push({
    reference: `guide-options-${idx}`,
    levels: [{
      level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.START,
      style: { paragraph: { indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.3) } } },
    }],
  });
});

const children = [
  new Paragraph({
    text: `Guía de Corrección y Feedback - ${examLabel || "1er Examen Parcial"}${difficultyLabel ? " (" + difficultyLabel + ")" : ""}`,
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 200 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: "Esta guía contiene el desglose completo del examen: para cada pregunta se incluye su texto exacto en negrita, el detalle de todas las opciones con su estado (Correcta/Incorrecta), y la explicación conceptual correspondiente.",
    })],
    spacing: { after: 300 },
  }),
];

questions.forEach((q, idx) => {
  children.push(new Paragraph({
    text: `Pregunta ${idx + 1}`,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: q.stem, bold: true })],
    spacing: { after: 150 },
  }));
  q.options.forEach((opt) => {
    children.push(new Paragraph({
      numbering: { reference: `guide-options-${idx}`, level: 0 },
      children: [
        new TextRun({ text: opt.text + " - " }),
        new TextRun({ text: opt.correct ? "[Correcta.]" : "[Incorrecta.]", bold: true }),
      ],
      spacing: { after: 60 },
    }));
  });
  children.push(new Paragraph({
    children: [
      new TextRun({ text: "Explicación: ", bold: true }),
      new TextRun({ text: q.explanation }),
    ],
    spacing: { after: 250 },
  }));
});

const doc = new Document({
  numbering: { config: numberingConfigs },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 } } }, // A4
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.mkdirSync(require("path").dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buf);
  console.log(`Wrote ${outputPath} (${questions.length} questions)`);
});
