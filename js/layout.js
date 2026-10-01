// Geometría de la hoja de respuestas (A5 vertical, 148 x 210 mm; se imprimen dos por A4).
// La usan tanto el generador de la hoja (sheet.js) como el lector de fotos (scanner.js),
// así que las posiciones de las burbujas siempre coinciden.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiLayout = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const PAGE = { w: 148, h: 210 };
  const MARKER_SIZE = 8;
  // Orden: arriba-izq, arriba-der, abajo-izq, abajo-der.
  const MARKERS = [
    { x: 10, y: 10 },
    { x: 138, y: 10 },
    { x: 10, y: 200 },
    { x: 138, y: 200 },
  ];
  // Barra sólida que permite distinguir si la hoja está al derecho o dada vuelta.
  const ORIENTATION_BAR = { x: 74, y: 10, w: 20, h: 4 };
  const BUBBLE_R = 2.2;
  const LIMITS = { minOptions: 2, maxOptions: 6, maxDigits: 9, maxModalidades: 8 };
  const LETTERS = 'ABCDEF';
  const X0 = 16, X1 = 132, Y_MAX = 190;
  const ROW_PITCH = 5.5, OPT_PITCH = 7;

  function clampInt(v, min, max, def) {
    v = parseInt(v, 10);
    if (!isFinite(v)) return def;
    return Math.max(min, Math.min(max, v));
  }

  // Las modalidades ocupan filas de 2 columnas; las respuestas empiezan debajo.
  function answerZone(numModalidades) {
    const modRows = Math.max(1, Math.ceil(numModalidades / 2));
    const labelY = 62 + (modRows - 1) * 6 + 11;
    const firstRowY = labelY + 13;
    return { modRows, labelY, headerY: labelY + 6.5, firstRowY, maxRows: Math.floor((Y_MAX - firstRowY) / ROW_PITCH) + 1 };
  }

  // Cuántas columnas de preguntas entran (0 = ninguna combinación sirve).
  function columnsFor(numQuestions, numOptions, numModalidades) {
    const z = answerZone(numModalidades);
    const need = 12 + (numOptions - 1) * OPT_PITCH + BUBBLE_R + 1;
    const pref = numQuestions <= 12 ? 1 : numQuestions <= 44 ? 2 : 3;
    for (let cols = pref; cols <= 3; cols++) {
      if ((X1 - X0) / cols >= need && Math.ceil(numQuestions / cols) <= z.maxRows) return cols;
    }
    return 0;
  }

  function maxQuestionsFor(numOptions, numModalidades) {
    let best = 0;
    for (let q = 1; q <= 200; q++) if (columnsFor(q, numOptions, numModalidades)) best = q; else if (q > best + 1) break;
    return best;
  }

  function buildLayout(cfg) {
    cfg = cfg || {};
    const numOptions = clampInt(cfg.numOptions, LIMITS.minOptions, LIMITS.maxOptions, 4);
    const regDigits = clampInt(cfg.regDigits, 1, LIMITS.maxDigits, 7);
    const modalidades = (cfg.modalidades || []).map(String).filter(Boolean).slice(0, LIMITS.maxModalidades);
    const maxQ = maxQuestionsFor(numOptions, modalidades.length);
    const numQuestions = clampInt(cfg.numQuestions, 1, maxQ, Math.min(10, maxQ));

    const bubbles = [];

    // Campos manuscritos: la app no los lee; recorta esas zonas de la foto para mostrarlas.
    const boxW = 9, boxStart = X1 - regDigits * boxW + 1;
    const fields = {
      name: { x: 42, y: 22, w: X1 - 42, h: 10 },
      regBoxes: { x: boxStart, y: 36, w: boxW - 1, h: 9, pitch: boxW, n: regDigits },
      reg: { x: boxStart - 2, y: 34.5, w: regDigits * boxW + 3, h: 12 },
    };

    // Modalidad de cursada: una burbuja por opción, en 2 columnas.
    const mod = { labelY: 55, items: [] };
    modalidades.forEach((name, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = X0 + 2 + col * 58;
      const item = { index: i, name, x, y: 62 + row * 6, textX: x + 5 };
      mod.items.push(item);
      bubbles.push({ kind: 'mod', index: i, x: item.x, y: item.y });
    });

    // Respuestas: hasta 3 columnas de preguntas.
    const z = answerZone(modalidades.length);
    const cols = columnsFor(numQuestions, numOptions, modalidades.length);
    const perCol = Math.ceil(numQuestions / cols);
    const ans = { labelY: z.labelY, headerY: z.headerY, firstRowY: z.firstRowY, rowPitch: ROW_PITCH, optPitch: OPT_PITCH, cols: [] };
    const colWidth = (X1 - X0) / cols;
    for (let k = 0; k < cols; k++) {
      const qStart = k * perCol;
      const qEnd = Math.min(numQuestions, qStart + perCol);
      if (qStart >= qEnd) break;
      const x0 = X0 + k * colWidth;
      ans.cols.push({ x0, numX: x0, optX0: x0 + 12, qStart, qEnd });
      for (let q = qStart; q < qEnd; q++) {
        for (let o = 0; o < numOptions; o++) {
          bubbles.push({
            kind: 'ans', q, opt: o,
            x: x0 + 12 + o * OPT_PITCH,
            y: z.firstRowY + (q - qStart) * ROW_PITCH,
          });
        }
      }
    }

    return {
      page: PAGE, markers: MARKERS, markerSize: MARKER_SIZE, orientationBar: ORIENTATION_BAR,
      r: BUBBLE_R, numQuestions, numOptions, regDigits, modalidades, maxQuestions: maxQ,
      title: cfg.title || '', fields, mod, ans, bubbles, letters: LETTERS.slice(0, numOptions),
    };
  }

  return { buildLayout, maxQuestionsFor, LIMITS, LETTERS, PAGE, MARKERS, MARKER_SIZE, ORIENTATION_BAR, BUBBLE_R };
});
