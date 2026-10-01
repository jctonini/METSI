// Geometría de la hoja de respuestas (A4 vertical, medidas en mm).
// La usan tanto el generador de la hoja (sheet.js) como el lector de fotos (scanner.js),
// así que las posiciones de las burbujas siempre coinciden.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiLayout = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const PAGE = { w: 210, h: 297 };
  const MARKER_SIZE = 10;
  // Orden: arriba-izq, arriba-der, abajo-izq, abajo-der.
  const MARKERS = [
    { x: 13, y: 13 },
    { x: 197, y: 13 },
    { x: 13, y: 284 },
    { x: 197, y: 284 },
  ];
  // Barra sólida que permite distinguir si la hoja está al derecho o dada vuelta.
  const ORIENTATION_BAR = { x: 105, y: 13, w: 26, h: 5 };
  const BUBBLE_R = 2.2;
  const LIMITS = { maxQuestions: 66, minOptions: 2, maxOptions: 6, maxDigits: 9, maxModalidades: 8 };
  const LETTERS = 'ABCDEF';

  function clampInt(v, min, max, def) {
    v = parseInt(v, 10);
    if (!isFinite(v)) return def;
    return Math.max(min, Math.min(max, v));
  }

  function buildLayout(cfg) {
    cfg = cfg || {};
    const numQuestions = clampInt(cfg.numQuestions, 1, LIMITS.maxQuestions, 10);
    const numOptions = clampInt(cfg.numOptions, LIMITS.minOptions, LIMITS.maxOptions, 4);
    const regDigits = clampInt(cfg.regDigits, 1, LIMITS.maxDigits, 7);
    const modalidades = (cfg.modalidades || []).map(String).filter(Boolean).slice(0, LIMITS.maxModalidades);

    const bubbles = [];

    // Número de registro: una columna por dígito, filas 0-9.
    const reg = { labelY: 46, boxY: 51, cols: [], rows: [], rowLabelX: 25 };
    for (let c = 0; c < regDigits; c++) reg.cols.push(30 + c * 8);
    for (let d = 0; d < 10; d++) reg.rows.push(62 + d * 6);
    for (let c = 0; c < regDigits; c++) {
      for (let d = 0; d < 10; d++) {
        bubbles.push({ kind: 'reg', col: c, digit: d, x: reg.cols[c], y: reg.rows[d] });
      }
    }

    // Modalidad de cursada: una burbuja por opción.
    const mod = { labelY: 46, x: 118, textX: 124, items: [] };
    modalidades.forEach((name, i) => {
      const item = { index: i, name, x: mod.x, y: 62 + i * 7 };
      mod.items.push(item);
      bubbles.push({ kind: 'mod', index: i, x: item.x, y: item.y });
    });

    // Respuestas: hasta 3 columnas de preguntas.
    const cols = numQuestions <= 12 ? 1 : numQuestions <= 44 ? 2 : 3;
    const perCol = Math.ceil(numQuestions / cols);
    const ans = { labelY: 126, headerY: 133, firstRowY: 140, rowPitch: 6, optPitch: 8, cols: [] };
    const contentX = 22;
    const colWidth = 166 / cols;
    for (let k = 0; k < cols; k++) {
      const qStart = k * perCol;
      const qEnd = Math.min(numQuestions, qStart + perCol);
      if (qStart >= qEnd) break;
      const x0 = contentX + k * colWidth;
      ans.cols.push({ x0, numX: x0, optX0: x0 + 12, qStart, qEnd });
      for (let q = qStart; q < qEnd; q++) {
        for (let o = 0; o < numOptions; o++) {
          bubbles.push({
            kind: 'ans', q, opt: o,
            x: x0 + 12 + o * ans.optPitch,
            y: ans.firstRowY + (q - qStart) * ans.rowPitch,
          });
        }
      }
    }

    return {
      page: PAGE, markers: MARKERS, markerSize: MARKER_SIZE, orientationBar: ORIENTATION_BAR,
      r: BUBBLE_R, numQuestions, numOptions, regDigits, modalidades,
      title: cfg.title || '', reg, mod, ans, bubbles, letters: LETTERS.slice(0, numOptions),
    };
  }

  return { buildLayout, LIMITS, LETTERS, PAGE, MARKERS, MARKER_SIZE, ORIENTATION_BAR, BUBBLE_R };
});
