// Geometría de la hoja de respuestas (A5 vertical, 148 x 210 mm; se imprimen dos por A4).
// La usan el generador de la hoja (sheet.js) y el lector de fotos (scanner.js), así que las
// posiciones de las burbujas siempre coinciden.
//
// VERSIONES
//  - v1: formato de las primeras hojas impresas. Está CONGELADO: solo se usa para leer fotos de
//    esas hojas (no se vuelve a imprimir). tests/fixtures/layout-v1.json fija sus posiciones.
//  - v2: más espacio para escribir el nombre, campo de fecha, leyendas al pie y código de versión.
//
//  - v4: igual que la v3 más una banda de ejemplos al pie (cómo marcar bien y mal una burbuja). La banda ocupa
//    lugar, así que entran menos preguntas (30 en vez de 38 con 5 opciones); la geometría de la v3 queda intacta.
//  - v3: marcas de esquina con forma propia (cuadrados a la izquierda, barras a la derecha), así cada
//    esquina se identifica sola y la orientación de la hoja se deduce de las formas.
//
// El código de versión son 3 cuadraditos negros al pie (bits del número de versión menos 1).
// La v1 no tiene ninguno, así que "sin cuadraditos" equivale a v1.
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
  const BUBBLE_R = 2.2;
  const LIMITS = { minOptions: 2, maxOptions: 6, maxDigits: 9, maxModalidades: 8 };
  const LETTERS = 'ABCDEF';
  const X0 = 16, X1 = 132, Y_MAX = 190;
  const ROW_PITCH = 5.5, OPT_PITCH = 7;
  const LATEST_VERSION = 4;

  // Código de versión: cuadrados de 3 mm centrados en (x0 + i * pitch, y). Bit i = 1 si está impreso.
  const VERSION_CODE = { x0: 19.5, y: 203, size: 3, pitch: 5, bits: 3 };

  // Medidas que cambian entre versiones.
  const GEO = {
    1: {
      bar: { x: 74, y: 10, w: 20, h: 4 },
      header: { titleY: 22, titleYWithSubtitle: 20.5, subtitleY: 25.6, nameLabelY: 30, nameLineY: 30.3, regLabelY: 43 },
      nameCrop: { x: 42, y: 22, w: X1 - 42, h: 10 },
      regBoxY: 36, regCropY: 34.5,
      modLabelY: 55, modY0: 62,
    },
    2: {
      bar: { x: 74, y: 10, w: 28, h: 4 },
      header: { titleY: 22, titleYWithSubtitle: 20.5, subtitleY: 25.6, nameLabelY: 35, nameLineY: 35.3, regLabelY: 48 },
      // Solo la zona de escritura, sin el encabezado ni la línea impresa (sirve para comparar letra).
      nameCrop: { x: 42, y: 26.8, w: X1 - 42, h: 7.8 },
      regBoxY: 41, regCropY: 39.5,
      modLabelY: 60, modY0: 67,
    },
  };

  // v3: a la izquierda cuadrados de 8 x 8 mm; a la derecha barras de 16 x 4 mm (la misma superficie negra).
  // Las barras quedan a 6 mm del borde para que no las recorte el margen de la impresora.
  const MARKERS_V3 = [{ x: 10, y: 10 }, { x: 134, y: 10 }, { x: 10, y: 200 }, { x: 134, y: 200 }];
  const SHAPES_V3 = [
    { x: 10, y: 10, w: 8, h: 8 }, { x: 134, y: 10, w: 16, h: 4 },
    { x: 10, y: 200, w: 8, h: 8 }, { x: 134, y: 200, w: 16, h: 4 },
  ];
  GEO[3] = Object.assign({}, GEO[2], { bar: null, markers: MARKERS_V3, shapes: SHAPES_V3 });

  // v4: la banda de ejemplos ocupa de 179 a 195 mm; las burbujas llegan hasta 173,5 mm. Sin la línea de instrucción
  // (la banda la reemplaza) queda ese lugar libre.
  GEO[4] = Object.assign({}, GEO[3], { yMax: 173.5, examples: true });

  // Banda de ejemplos (v4): a la izquierda la forma correcta (círculo pintado por completo) y a la derecha las
  // formas incorrectas. `symbols` los dibuja sheet.js; los ejemplos nunca están dentro de la grilla de respuestas.
  function exampleBand() {
    // Cada mitad (16-74 y 74-132 mm) tiene su centro (45 y 103 mm): el título va centrado y los ejemplos alineados.
    return {
      line: { x1: 16, x2: 132, y: 179 },
      divider: { x: 74, y1: 181.5, y2: 194.5 },
      texts: [
        { x: 45, y: 183.1, s: 'CORRECTO', size: 2.6, bold: true, anchor: 'middle' },
        { x: 34, y: 188.2, s: 'Pintá todo el círculo', size: 2.4, maxW: 28 },
        { x: 34, y: 191.2, s: 'con birome', size: 2.4, maxW: 28 },
        { x: 103, y: 183.1, s: 'INCORRECTO', size: 2.6, bold: true, anchor: 'middle' },
        { x: 103, y: 193.9, s: 'tilde · cruz · punto · medio relleno', size: 2.2, maxW: 52, anchor: 'middle' },
      ],
      symbols: [
        { kind: 'filled', x: 29, y: 188.5, r: 2.2 },
        { kind: 'tick', x: 92.5, y: 188.5, r: 2.2 }, { kind: 'cross', x: 99.5, y: 188.5, r: 2.2 },
        { kind: 'dot', x: 106.5, y: 188.5, r: 2.2 }, { kind: 'half', x: 113.5, y: 188.5, r: 2.2 },
      ],
    };
  }

  const DEFAULT_TEXTS = {
    subtitle: '',
    nameLabel: 'Nombre y apellido:',
    regLabel: 'N° de registro:',
    modLabel: 'Modalidad de cursada (marcá una)',
    instructions: 'Rellená el círculo por completo con birome',
    legal: 'En caso de haber diferencias entre las respuestas marcadas en el examen y en esta hoja, prevalecen aquellas marcadas en la hoja de respuestas.',
    logo: '',
  };
  // Área reservada para el logo (arriba a la izquierda, junto a la marca de la esquina).
  const LOGO_RECT = { x: 16, y: 14.5, w: 22, h: 11.5 };

  function clampInt(v, min, max, def) {
    v = parseInt(v, 10);
    if (!isFinite(v)) return def;
    return Math.max(min, Math.min(max, v));
  }

  // Las modalidades ocupan filas de 2 columnas; las respuestas empiezan debajo.
  function answerZone(numModalidades, version) {
    const g = GEO[version];
    const modRows = Math.max(1, Math.ceil(numModalidades / 2));
    const labelY = g.modY0 + (modRows - 1) * 6 + 11;
    const firstRowY = labelY + 13;
    return { modRows, labelY, headerY: labelY + 6.5, firstRowY, maxRows: Math.floor(((g.yMax || Y_MAX) - firstRowY) / ROW_PITCH) + 1 };
  }

  // Cuántas columnas de preguntas entran (0 = ninguna combinación sirve).
  function columnsFor(numQuestions, numOptions, numModalidades, version) {
    const z = answerZone(numModalidades, version);
    const need = 12 + (numOptions - 1) * OPT_PITCH + BUBBLE_R + 1;
    const pref = numQuestions <= 12 ? 1 : numQuestions <= 44 ? 2 : 3;
    for (let cols = pref; cols <= 3; cols++) {
      if ((X1 - X0) / cols >= need && Math.ceil(numQuestions / cols) <= z.maxRows) return cols;
    }
    return 0;
  }

  function maxQuestionsFor(numOptions, numModalidades, version) {
    version = version || LATEST_VERSION;
    let best = 0;
    for (let q = 1; q <= 200; q++) if (columnsFor(q, numOptions, numModalidades, version)) best = q; else if (q > best + 1) break;
    return best;
  }

  function buildLayout(cfg, version) {
    cfg = cfg || {};
    version = version || LATEST_VERSION;
    if (!GEO[version]) throw new Error('Versión de hoja desconocida: ' + version);
    const g = GEO[version];
    const numOptions = clampInt(cfg.numOptions, LIMITS.minOptions, LIMITS.maxOptions, 4);
    const regDigits = clampInt(cfg.regDigits, 1, LIMITS.maxDigits, 7);
    const modalidades = (cfg.modalidades || []).map(String).filter(Boolean).slice(0, LIMITS.maxModalidades);
    const maxQ = maxQuestionsFor(numOptions, modalidades.length, version);
    const numQuestions = clampInt(cfg.numQuestions, 1, maxQ, Math.min(10, maxQ));

    const bubbles = [];

    // Campos manuscritos: la app no los lee; recorta esas zonas de la foto para mostrarlas.
    const boxW = 9, boxStart = X1 - regDigits * boxW + 1;
    const fields = {
      name: g.nameCrop,
      regBoxes: { x: boxStart, y: g.regBoxY, w: boxW - 1, h: 9, pitch: boxW, n: regDigits },
      reg: { x: boxStart - 2, y: g.regCropY, w: regDigits * boxW + 3, h: 12 },
    };

    // Modalidad de cursada: una burbuja por opción, en 2 columnas.
    const mod = { labelY: g.modLabelY, items: [] };
    modalidades.forEach((name, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = X0 + 2 + col * 58;
      const item = { index: i, name, x, y: g.modY0 + row * 6, textX: x + 5 };
      mod.items.push(item);
      bubbles.push({ kind: 'mod', index: i, x: item.x, y: item.y });
    });

    // Respuestas: hasta 3 columnas de preguntas.
    const z = answerZone(modalidades.length, version);
    const cols = columnsFor(numQuestions, numOptions, modalidades.length, version);
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

    const custom = cfg.sheet || {};
    const texts = {};
    for (const k of Object.keys(DEFAULT_TEXTS)) {
      const v = typeof custom[k] === 'string' ? custom[k].trim() : '';
      texts[k] = v || (k === 'subtitle' || k === 'logo' || (k === 'instructions' && version >= 4) ? '' : DEFAULT_TEXTS[k]);
    }
    texts.title = (cfg.title || '').trim() || 'Hoja de respuestas';

    // Código de versión (v1 no lleva ninguno) y campo de fecha (solo v2).
    const value = version - 1;
    const versionBits = Array.from({ length: VERSION_CODE.bits }, (_, i) => ({
      x: VERSION_CODE.x0 + i * VERSION_CODE.pitch, y: VERSION_CODE.y, size: VERSION_CODE.size, on: ((value >> i) & 1) === 1,
    }));
    const date = { x: 88, y: g.modLabelY, daySlash: 107.5, monthSlash: 116.5 };

    return {
      version, latestVersion: LATEST_VERSION, page: PAGE, markers: g.markers || MARKERS, markerSize: MARKER_SIZE, orientationBar: g.bar, header: g.header,
      markerShapes: g.shapes || MARKERS.map((m) => ({ x: m.x, y: m.y, w: MARKER_SIZE, h: MARKER_SIZE })),
      texts, logoRect: LOGO_RECT, r: BUBBLE_R, numQuestions, numOptions, regDigits, modalidades, maxQuestions: maxQ,
      fields, mod, ans, bubbles, letters: LETTERS.slice(0, numOptions), versionBits, versionCode: VERSION_CODE, date,
      examples: g.examples ? exampleBand() : null,
    };
  }

  return {
    buildLayout, maxQuestionsFor, DEFAULT_TEXTS, LIMITS, LETTERS, PAGE, MARKERS, MARKER_SIZE,
    BUBBLE_R, LATEST_VERSION, VERSION_CODE,
  };
});
