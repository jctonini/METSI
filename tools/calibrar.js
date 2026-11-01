// Calibración de la lectura con casos reales.
//
// Entrada: archivos `casos.json` que genera la app (Resultados → «Descargar casos (JSON)», o la carpeta
// `a-revisar` del examen en Drive). No traen nombres ni registros: solo los puntajes de cada burbuja y lo
// que corrigió el docente.
//
//   node tools/calibrar.js [carpeta-o-archivo ...]     (por defecto: tests/fixtures/real)
//
// Para cada pregunta se reconstruye la respuesta correcta (la que leyó la app, salvo donde el docente la
// corrigió a mano) y se compara con lo que lee hoy `interpret()`. Se omiten las preguntas marcadas con 🚩
// y las hojas ilegibles, porque no se sabe cuál era la respuesta correcta.
const fs = require('fs');
const path = require('path');
const { buildLayout, LETTERS } = require('../js/layout.js');
const { interpret } = require('../js/scanner.js');

const DEFAULT_DIR = path.join(__dirname, '..', 'tests', 'fixtures', 'real');
const toIdx = (letters) => [...letters].map((c) => LETTERS.indexOf(c)).filter((i) => i >= 0);
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

function listFiles(inputs) {
  const out = [];
  for (const p of inputs) {
    if (!fs.existsSync(p)) continue;
    if (fs.statSync(p).isDirectory()) {
      for (const f of fs.readdirSync(p).sort()) if (f.endsWith('.json')) out.push(path.join(p, f));
    } else out.push(p);
  }
  return out;
}

// Convierte un archivo de casos en una lista de hojas evaluables.
function loadCases(files) {
  const sheets = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const exam = data.examen || {};
    for (const c of data.casos || []) {
      if (c.failed || !c.scores || !c.scores.ans) continue;
      sheets.push({ file: path.basename(file), id: c.id, exam, caso: c });
    }
  }
  return sheets;
}

// Preguntas evaluables de una hoja: { q, expected } con q desde 0. Devuelve null si no se puede evaluar.
function expectedAnswers(sheet, threshold0) {
  const { caso, exam } = sheet;
  const groups = groupsFor(sheet);
  const base = interpret({ scores: caso.scores }, exam.threshold == null ? threshold0 : exam.threshold, groups);
  const flagged = new Set((caso.flaggedQuestions || []).map((q) => q - 1));
  const edited = new Map((caso.edited || []).map((e) => [e.q - 1, toIdx(e.final)]));
  const out = [];
  caso.scores.ans.forEach((_, q) => {
    if (flagged.has(q) && !edited.has(q)) return; // no se sabe cuál era la respuesta correcta
    out.push({ q, expected: edited.has(q) ? edited.get(q) : base.answers[q] });
  });
  return out;
}

function groupsFor(sheet) {
  const { caso, exam } = sheet;
  try {
    const mods = Math.max(1, (caso.scores.mod || []).length);
    const L = buildLayout({ numQuestions: exam.numQuestions || caso.scores.ans.length, numOptions: exam.numOptions || (caso.scores.ans[0] || []).length,
      modalidades: Array.from({ length: mods }, (_, i) => 'm' + i), regDigits: 7 }, caso.version || 4);
    return L.ans.cols.map((c) => [c.qStart, c.qEnd]);
  } catch (e) { return null; }
}

// Cuántas preguntas lee mal `interpret` con un umbral dado.
function evaluate(sheets, threshold, referenceThreshold) {
  let total = 0, wrong = 0;
  const detail = [];
  for (const sh of sheets) {
    const expected = expectedAnswers(sh, referenceThreshold);
    const got = interpret({ scores: sh.caso.scores }, threshold, groupsFor(sh));
    for (const { q, expected: exp } of expected) {
      total++;
      if (!same(got.answers[q], exp)) { wrong++; detail.push({ file: sh.file, id: sh.id, q: q + 1, esperado: exp, leyo: got.answers[q] }); }
    }
  }
  return { total, wrong, detail };
}

function sweep(sheets, from, to, step, referenceThreshold) {
  const rows = [];
  for (let t = from; t <= to + 1e-9; t += step) {
    const thr = Math.round(t * 1000) / 1000;
    rows.push({ threshold: thr, ...evaluate(sheets, thr, referenceThreshold) });
  }
  return rows;
}

function main(argv) {
  const inputs = argv.length ? argv : [DEFAULT_DIR];
  const sheets = loadCases(listFiles(inputs));
  if (!sheets.length) {
    console.log('No hay casos reales para evaluar. Poné archivos casos.json en tests/fixtures/real/ (ver README) o indicá la ruta.');
    return;
  }
  const ref = 0.085;
  const now = evaluate(sheets, ref, ref);
  console.log(`${sheets.length} hoja(s), ${now.total} pregunta(s) evaluables. Con el umbral por defecto (${ref}): ${now.wrong} mal leída(s).`);
  now.detail.slice(0, 20).forEach((d) => console.log(`  ${d.file} hoja ${d.id} pregunta ${d.q}: esperado [${d.esperado.map((i) => LETTERS[i])}], leyó [${d.leyo.map((i) => LETTERS[i])}]`));
  const rows = sweep(sheets, 0.03, 0.2, 0.005, ref);
  const best = Math.min(...rows.map((r) => r.wrong));
  console.log('\numbral  errores');
  rows.forEach((r) => console.log(`${r.threshold.toFixed(3)}   ${String(r.wrong).padStart(4)}${r.wrong === best ? '  ← mínimo' : ''}`));
  const bestRows = rows.filter((r) => r.wrong === best);
  console.log(`\nMenos errores (${best}) entre ${bestRows[0].threshold} y ${bestRows[bestRows.length - 1].threshold}; centro del rango: ${((bestRows[0].threshold + bestRows[bestRows.length - 1].threshold) / 2).toFixed(3)}.`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = { listFiles, loadCases, expectedAnswers, evaluate, sweep, DEFAULT_DIR };
