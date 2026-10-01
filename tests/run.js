// Ejecutar con: node tests/run.js
const assert = require('node:assert/strict');
const { buildLayout } = require('../js/layout.js');
const { scoreQuestion, scoreSheet } = require('../js/scoring.js');
const { toDelimited } = require('../js/csv.js');
const { scanImage, interpret } = require('../js/scanner.js');
const { renderPhoto, rng } = require('./synth.js');

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ok  ' + name); }
  catch (e) { failed++; console.log('FALLA ' + name + '\n' + (e.stack || e)); }
}

// ---------- puntaje ----------
test('una correcta: da el puntaje completo', () => {
  assert.equal(scoreQuestion([1], { correct: [1], points: 2 }, 1).earned, 2);
});
test('una correcta + una incorrecta con penalización 1: 0', () => {
  assert.equal(scoreQuestion([1, 2], { correct: [1], points: 2 }, 1).earned, 0);
});
test('sin penalización, la incorrecta no resta', () => {
  assert.equal(scoreQuestion([1, 2], { correct: [1], points: 2 }, 0).earned, 2);
});
test('varias correctas: el puntaje se reparte', () => {
  const k = { correct: [0, 2, 3], points: 3 };
  assert.equal(scoreQuestion([0], k, 1).earned, 1);
  assert.equal(scoreQuestion([0, 2], k, 1).earned, 2);
  assert.equal(scoreQuestion([0, 2, 3], k, 1).earned, 3);
});
test('varias correctas con penalización parcial', () => {
  const k = { correct: [0, 1], points: 2 };
  // 2 correctas (2) - 1 incorrecta * 0.5 * 1 = 1.5
  assert.equal(scoreQuestion([0, 1, 3], k, 0.5).earned, 1.5);
});
test('marcar todo no da el puntaje completo con penalización', () => {
  const k = { correct: [0, 1], points: 2 };
  assert.equal(scoreQuestion([0, 1, 2, 3], k, 1).earned, 0);
});
test('nunca baja de 0', () => {
  assert.equal(scoreQuestion([1, 2, 3], { correct: [0], points: 1 }, 1).earned, 0);
});
test('pregunta sin marcar: 0', () => {
  assert.equal(scoreQuestion([], { correct: [0], points: 1 }, 1).earned, 0);
});
test('pregunta anulada: puntaje completo a todos', () => {
  assert.equal(scoreQuestion([], { correct: [], points: 1 }, 1).earned, 1);
});
test('total y máximo', () => {
  const key = [{ correct: [0], points: 1 }, { correct: [1, 2], points: 2 }];
  const r = scoreSheet([[0], [1]], key, 1);
  assert.equal(r.total, 2);
  assert.equal(r.max, 3);
});
test('sin errores de punto flotante', () => {
  const k = { correct: [0, 1, 2], points: 1 };
  assert.equal(scoreQuestion([0, 1, 2], k, 1).earned, 1);
  assert.equal(scoreSheet([[0, 1]], [k], 1).total, 0.666667);
});

// ---------- csv ----------
test('csv escapa separadores y comillas', () => {
  assert.equal(toDelimited([['a;b', 'c"d', 'e']], ';'), '"a;b";"c""d";e\r\n');
});

// ---------- layout ----------
test('layout: sin burbujas superpuestas ni fuera de la hoja', () => {
  const mods8 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  for (const [q, opts, mods] of [[10, 4, ['a', 'b']], [20, 5, ['a', 'b', 'c']], [38, 5, ['a', 'b']], [57, 4, ['a', 'b']], [16, 6, mods8]]) {
    const L = buildLayout({ numQuestions: q, numOptions: opts, regDigits: 9, modalidades: mods });
    assert.equal(L.numQuestions, q, `capacidad insuficiente para ${q}x${opts}`);
    assert.equal(L.bubbles.filter((b) => b.kind === 'ans').length, q * opts);
    for (const b of L.bubbles) {
      assert.ok(b.x > 14 && b.x < 134 && b.y > 55 && b.y < 193, `fuera de zona: ${JSON.stringify(b)}`);
    }
    for (let i = 0; i < L.bubbles.length; i++) {
      for (let j = i + 1; j < L.bubbles.length; j++) {
        const a = L.bubbles[i], c = L.bubbles[j];
        assert.ok(Math.hypot(a.x - c.x, a.y - c.y) > 2 * L.r + 0.8, `superpuestas ${JSON.stringify([a, c])}`);
      }
    }
  }
});

test('layout: la capacidad se limita y avisa', () => {
  const L = buildLayout({ numQuestions: 500, numOptions: 5, modalidades: ['a', 'b'] });
  assert.equal(L.numQuestions, L.maxQuestions);
  assert.ok(L.maxQuestions >= 36);
});
test('layout: los campos manuscritos no pisan burbujas', () => {
  const L = buildLayout({ numQuestions: 20, numOptions: 5, regDigits: 9, modalidades: ['a', 'b'] });
  for (const f of [L.fields.name, L.fields.reg]) {
    for (const b of L.bubbles) {
      const inside = b.x > f.x - L.r && b.x < f.x + f.w + L.r && b.y > f.y - L.r && b.y < f.y + f.h + L.r;
      assert.equal(inside, false);
    }
  }
});

// ---------- lectura de fotos sintéticas ----------
const MODALIDADES = ['Presencial', 'Virtual', 'Híbrida'];

function makeExam(cfg, seed, opts) {
  opts = opts || {};
  const L = buildLayout(cfg);
  const rand = rng(seed);
  const modalidad = Math.floor(rand() * L.modalidades.length);
  const answers = Array.from({ length: L.numQuestions }, () => {
    const set = new Set();
    set.add(Math.floor(rand() * L.numOptions));
    if (rand() < 0.3) set.add(Math.floor(rand() * L.numOptions));
    return [...set].sort((a, b) => a - b);
  });
  const marks = [];
  const kind = opts.kind || 'fill';
  for (const b of L.bubbles) {
    if (b.kind === 'mod' && modalidad === b.index) marks.push({ x: b.x, y: b.y, kind });
    if (b.kind === 'ans' && answers[b.q].includes(b.opt)) marks.push({ x: b.x, y: b.y, kind });
  }
  return { L, modalidad, answers, marks };
}

function checkRead(exam, photoOpts) {
  const img = renderPhoto(exam.L, exam.marks, photoOpts);
  const scan = scanImage(img, exam.L);
  assert.ok(scan.ok, scan.error);
  const r = interpret(scan, 0.25);
  assert.equal(r.modalidad, exam.modalidad);
  assert.deepEqual(r.answers, exam.answers);
  assert.equal(r.flags.some((f) => f.dubious || f.blank), false, 'no debería haber dudosas');
  return { scan, r };
}

const CFG10 = { numQuestions: 10, numOptions: 4, regDigits: 7, modalidades: MODALIDADES };
const CFG20 = { numQuestions: 20, numOptions: 5, regDigits: 7, modalidades: MODALIDADES };

test('lee un examen de 10 preguntas (4 opciones)', () => checkRead(makeExam(CFG10, 11), { seed: 5 }));
test('lee un examen de 20 preguntas (5 opciones)', () => checkRead(makeExam(CFG20, 12), { seed: 6 }));
test('lee un examen de 50 preguntas (3 columnas)', () =>
  checkRead(makeExam({ ...CFG20, numQuestions: 50 }, 13), { seed: 7 }));
test('varias semillas y deformaciones', () => {
  for (let s = 1; s <= 6; s++) checkRead(makeExam(CFG20, 100 + s), { seed: s, jitter: 90 });
});
test('con poca luz y mucho ruido', () =>
  checkRead(makeExam(CFG20, 21), { seed: 8, paper: 150, lighting: 0.45, noise: 30 }));
test('hoja dada vuelta 180°', () => {
  const { scan } = checkRead(makeExam(CFG20, 22), { seed: 9, rot180: true });
  assert.equal(scan.rotated, true);
});
test('marcas con cruz', () => checkRead(makeExam(CFG20, 23, { kind: 'cross' }), { seed: 10 }));

test('pregunta en blanco y marca tenue se señalan', () => {
  const exam = makeExam(CFG20, 31);
  // Borra todas las marcas de la pregunta 3 y deja una tenue en la pregunta 4.
  exam.marks = exam.marks.filter((m) => {
    const b = exam.L.bubbles.find((x) => x.x === m.x && x.y === m.y);
    return !(b.kind === 'ans' && (b.q === 3 || b.q === 4));
  });
  const b4 = exam.L.bubbles.find((x) => x.kind === 'ans' && x.q === 4 && x.opt === 1);
  exam.marks.push({ x: b4.x, y: b4.y, kind: 'light' });
  const scan = scanImage(renderPhoto(exam.L, exam.marks, { seed: 3 }), exam.L);
  assert.ok(scan.ok, scan.error);
  const r = interpret(scan, 0.25);
  assert.equal(r.flags[3].blank, true);
  assert.deepEqual(r.answers[3], []);
  assert.equal(r.flags[4].dubious || r.answers[4].length === 0, true, 'la marca tenue debe ser dudosa o no contarse');
  // El resto sigue bien.
  for (let q = 0; q < 20; q++) if (q !== 3 && q !== 4) assert.deepEqual(r.answers[q], exam.answers[q]);
});

test('recorta nombre y registro de la foto, enderezados', () => {
  const { cropRegion } = require('../js/scanner.js');
  const exam = makeExam(CFG10, 41);
  const f = exam.L.fields;
  // "Escritura" simulada: una franja oscura en la mitad izquierda de los casilleros del registro.
  const ink = [{ x: f.reg.x + 3, y: f.reg.y + 4, w: 20, h: 3 }];
  const img = renderPhoto(exam.L, exam.marks, { seed: 4, ink });
  const scan = scanImage(img, exam.L);
  assert.ok(scan.ok, scan.error);
  const crop = cropRegion(img, scan.H, f.reg, 10);
  assert.equal(crop.width, Math.round(f.reg.w * 10));
  assert.equal(crop.height, Math.round(f.reg.h * 10));
  const mean = (x0, x1) => {
    let s = 0, n = 0;
    for (let y = 0; y < crop.height; y++) for (let x = x0; x < x1; x++) { s += crop.data[(y * crop.width + x) * 4]; n++; }
    return s / n;
  };
  const dark = mean(40, 200), clean = mean(crop.width - 150, crop.width - 10);
  assert.ok(dark < clean - 20, `la zona con tinta debe verse más oscura (${dark} vs ${clean})`);
});

test('foto sin hoja devuelve error claro', () => {
  const L = buildLayout(CFG10);
  const data = new Uint8ClampedArray(800 * 600 * 4).fill(200);
  const r = scanImage({ width: 800, height: 600, data }, L);
  assert.equal(r.ok, false);
  assert.match(r.error, /marcas/);
});

test('hoja cortada (falta una esquina) devuelve error', () => {
  const exam = makeExam(CFG10, 51);
  const img = renderPhoto(exam.L, exam.marks, { seed: 2 });
  // Tapa la esquina inferior derecha con "mesa".
  for (let y = 1300; y < img.height; y++) {
    for (let x = 900; x < img.width; x++) {
      const i = (y * img.width + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 200;
    }
  }
  const r = scanImage(img, exam.L);
  assert.equal(r.ok, false);
});

// ---------- Drive (simulado) y combinación de estados ----------
const { createDrive } = require('../js/drive.js');
const { mergeStates } = require('../js/merge.js');
const { createMockDrive } = require('./mockdrive.js');

const asyncTests = [];
function atest(name, fn) { asyncTests.push([name, fn]); }

atest('drive: crea carpetas, sube y lee archivos (texto y binario)', async () => {
  const mock = createMockDrive();
  const d = createDrive({ fetch: mock.fetch, getToken: async () => 'tok' });
  const root = await d.ensureRootFolder();
  assert.equal(await d.ensureRootFolder(), root, 'no duplica la carpeta raíz');
  assert.equal(await d.findExamFolder(root, 'e1'), null);
  const folder = await d.createExamFolder(root, 'e1', "1er parcial · d'Ana");
  assert.equal(await d.findExamFolder(root, 'e1'), folder);
  await d.upsertFile(folder, 'datos.json', 'application/json', JSON.stringify({ hola: 'ñandú' }), { examId: 'e1' });
  await d.upsertFile(folder, 'datos.json', 'application/json', JSON.stringify({ hola: 'ñandú 2' }), { examId: 'e1' });
  assert.deepEqual(await d.readJson(folder, 'datos.json'), { hola: 'ñandú 2' });
  assert.equal([...mock.files.values()].filter((f) => f.name === 'datos.json').length, 1, 'reemplaza, no duplica');
  const bytes = Buffer.from([0xff, 0xd8, 0xff, 0x00, 0x0d, 0x0a, 0x80, 0x7f]);
  const pid = await d.upsertFile(folder, 'hoja-1.jpg', 'image/jpeg', new Blob([bytes]), { examId: 'e1' });
  const back = Buffer.from(await (await d.downloadBlob(pid)).arrayBuffer());
  assert.deepEqual([...back], [...bytes], 'la foto vuelve idéntica');
  const exams = await d.listExams(root);
  assert.equal(exams.length, 1);
  assert.equal(exams[0].examId, 'e1');
  await d.renameFolder(folder, 'Otro nombre');
  assert.equal((await d.listExams(root))[0].name, 'Otro nombre');
});

atest('drive: sin credenciales devuelve 401 con status', async () => {
  const mock = createMockDrive();
  const d = createDrive({ fetch: (u, o) => mock.fetch(u, { ...o, headers: {} }), getToken: async () => 'tok' });
  await assert.rejects(() => d.ensureRootFolder(), (e) => e.status === 401);
});

const sh = (id, t, extra) => ({ id, createdAt: t, updatedAt: t, answers: [[0]], registro: '', ...extra });
test('merge: une hojas de ambos lados, ordenadas por creación', () => {
  const m = mergeStates({ sheets: [sh('a', 1), sh('c', 3)], deleted: {} }, { sheets: [sh('b', 2)], deleted: {} });
  assert.deepEqual(m.sheets.map((x) => x.id), ['a', 'b', 'c']);
});
test('merge: gana la edición más reciente de una misma hoja', () => {
  const local = { sheets: [sh('a', 1, { registro: 'viejo' })], deleted: {} };
  const remote = { sheets: [{ ...sh('a', 1), updatedAt: 9, registro: '123' }], deleted: {} };
  assert.equal(mergeStates(local, remote).sheets[0].registro, '123');
  assert.equal(mergeStates(remote, local).sheets[0].registro, '123');
});
test('merge: una hoja borrada no reaparece, pero una editada después sí', () => {
  const del = { sheets: [], deleted: { a: 5 } };
  assert.equal(mergeStates(del, { sheets: [sh('a', 1)], deleted: {} }).sheets.length, 0);
  assert.equal(mergeStates({ sheets: [sh('a', 1)], deleted: {} }, del).sheets.length, 0);
  assert.equal(mergeStates(del, { sheets: [{ ...sh('a', 1), updatedAt: 8 }], deleted: {} }).sheets.length, 1);
});
test('merge: conserva el photoId aunque gane la otra versión', () => {
  const local = { sheets: [sh('a', 1, { photoId: 'P' })], deleted: {} };
  const remote = { sheets: [{ ...sh('a', 1), updatedAt: 7 }], deleted: {} };
  assert.equal(mergeStates(local, remote).sheets[0].photoId, 'P');
});
test('merge: configuración y clave de la versión más nueva', () => {
  const a = { cfg: { t: 'a' }, key: [1], cfgUpdatedAt: 1, sheets: [], deleted: {} };
  const b = { cfg: { t: 'b' }, key: [2], cfgUpdatedAt: 5, sheets: [], deleted: {} };
  assert.deepEqual(mergeStates(a, b).cfg, { t: 'b' });
  assert.deepEqual(mergeStates(b, a).key, [2]);
});

(async () => {
  for (const [name, fn] of asyncTests) {
    try { await fn(); passed++; console.log('  ok  ' + name); }
    catch (e) { failed++; console.log('FALLA ' + name + '\n' + (e.stack || e)); }
  }
  finish();
})();

function finish() {
console.log(`\n${passed} pasaron, ${failed} fallaron`);
process.exit(failed ? 1 : 0);
}
