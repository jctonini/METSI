// Lector de hojas de respuestas a partir de una foto.
// Entrada: imagen RGBA { width, height, data } (conviene que el lado mayor sea ~1600 px)
// y el layout de la hoja. No depende del navegador, así que se puede probar en Node.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiScanner = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  // ---------- imagen ----------
  function toGray(img) {
    const { width: w, height: h, data } = img;
    const g = new Uint8ClampedArray(w * h);
    for (let i = 0, p = 0; i < g.length; i++, p += 4) {
      g[i] = (299 * data[p] + 587 * data[p + 1] + 114 * data[p + 2]) / 1000;
    }
    return g;
  }

  // Binarización adaptativa: un píxel es "tinta" si es bastante más oscuro que su entorno.
  function binarize(g, w, h, win, ratio) {
    const W = w + 1;
    const I = new Float64Array(W * (h + 1));
    for (let y = 0; y < h; y++) {
      let row = 0;
      for (let x = 0; x < w; x++) {
        row += g[y * w + x];
        I[(y + 1) * W + x + 1] = I[y * W + x + 1] + row;
      }
    }
    const half = win >> 1;
    const bin = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
      const y0 = Math.max(0, y - half), y1 = Math.min(h, y + half + 1);
      for (let x = 0; x < w; x++) {
        const x0 = Math.max(0, x - half), x1 = Math.min(w, x + half + 1);
        const sum = I[y1 * W + x1] - I[y0 * W + x1] - I[y1 * W + x0] + I[y0 * W + x0];
        const mean = sum / ((x1 - x0) * (y1 - y0));
        bin[y * w + x] = g[y * w + x] < mean * ratio ? 1 : 0;
      }
    }
    return bin;
  }

  // Componentes conexas (4-vecinos) de la imagen binaria.
  function components(bin, w, h) {
    const seen = new Uint8Array(w * h);
    const stack = new Int32Array(w * h);
    const comps = [];
    for (let start = 0; start < bin.length; start++) {
      if (!bin[start] || seen[start]) continue;
      let sp = 0;
      stack[sp++] = start;
      seen[start] = 1;
      let area = 0, sx = 0, sy = 0;
      let minx = w, maxx = 0, miny = h, maxy = 0;
      while (sp > 0) {
        const p = stack[--sp];
        const x = p % w, y = (p - x) / w;
        area++; sx += x; sy += y;
        if (x < minx) minx = x;
        if (x > maxx) maxx = x;
        if (y < miny) miny = y;
        if (y > maxy) maxy = y;
        if (x > 0 && bin[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack[sp++] = p - 1; }
        if (x < w - 1 && bin[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack[sp++] = p + 1; }
        if (y > 0 && bin[p - w] && !seen[p - w]) { seen[p - w] = 1; stack[sp++] = p - w; }
        if (y < h - 1 && bin[p + w] && !seen[p + w]) { seen[p + w] = 1; stack[sp++] = p + w; }
      }
      comps.push({ area, cx: sx / area, cy: sy / area, minx, maxx, miny, maxy });
    }
    return comps;
  }

  // ---------- geometría ----------
  // Homografía que lleva los puntos src[i] -> dst[i] (4 pares).
  function solveHomography(src, dst) {
    const A = [];
    for (let i = 0; i < 4; i++) {
      const { x: X, y: Y } = src[i];
      const { x: u, y: v } = dst[i];
      A.push([X, Y, 1, 0, 0, 0, -u * X, -u * Y, u]);
      A.push([0, 0, 0, X, Y, 1, -v * X, -v * Y, v]);
    }
    const n = 8;
    for (let c = 0; c < n; c++) {
      let piv = c;
      for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
      if (Math.abs(A[piv][c]) < 1e-12) return null;
      [A[c], A[piv]] = [A[piv], A[c]];
      for (let r = 0; r < n; r++) {
        if (r === c) continue;
        const f = A[r][c] / A[c][c];
        for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k];
      }
    }
    const h = [];
    for (let i = 0; i < n; i++) h.push(A[i][n] / A[i][i]);
    h.push(1);
    return h;
  }

  function applyH(H, x, y) {
    const d = H[6] * x + H[7] * y + H[8];
    return { x: (H[0] * x + H[1] * y + H[2]) / d, y: (H[3] * x + H[4] * y + H[5]) / d };
  }

  // ---------- detección de las 4 marcas ----------
  function findMarkers(comps, w, h) {
    const L = Math.max(w, h);
    const cands = comps.filter((c) => {
      const bw = c.maxx - c.minx + 1, bh = c.maxy - c.miny + 1;
      if (bw < 0.012 * L || bh < 0.012 * L || bw > 0.15 * L || bh > 0.15 * L) return false;
      const ratio = bw / bh;
      if (ratio < 0.5 || ratio > 2) return false;
      return c.area / (bw * bh) >= 0.5;
    });
    cands.sort((a, b) => b.area - a.area);
    const top = cands.slice(0, 8);
    if (top.length < 4) return null;
    const pick = (score) => top.reduce((best, c) => (score(c) < score(best) ? c : best));
    const tl = pick((c) => c.cx + c.cy);
    const br = pick((c) => -(c.cx + c.cy));
    const tr = pick((c) => -(c.cx - c.cy));
    const bl = pick((c) => c.cx - c.cy);
    const set = new Set([tl, tr, bl, br]);
    if (set.size < 4) return null;
    const areas = [tl, tr, bl, br].map((c) => c.area);
    if (Math.max(...areas) / Math.min(...areas) > 3) return null;
    return { tl, tr, bl, br };
  }

  // ---------- muestreo ----------
  function sampleGray(g, w, h, x, y) {
    if (x < 0 || y < 0 || x > w - 1 || y > h - 1) return null;
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const x1 = Math.min(w - 1, x0 + 1), y1 = Math.min(h - 1, y0 + 1);
    const fx = x - x0, fy = y - y0;
    const a = g[y0 * w + x0] * (1 - fx) + g[y0 * w + x1] * fx;
    const b = g[y1 * w + x0] * (1 - fx) + g[y1 * w + x1] * fx;
    return a * (1 - fy) + b * fy;
  }

  const INNER_RINGS = [[0, 1], [0.6, 6], [1.2, 10], [1.7, 14]]; // [radio mm, puntos]
  const PAPER_RADIUS = 3.0;
  const PAPER_POINTS = 12;

  // 0 = burbuja vacía, 1 = totalmente rellena. null si cae fuera de la imagen.
  function bubbleScore(g, w, h, H, bx, by) {
    let sum = 0, n = 0;
    for (const [rad, pts] of INNER_RINGS) {
      for (let i = 0; i < pts; i++) {
        const a = (2 * Math.PI * i) / pts;
        const p = applyH(H, bx + rad * Math.cos(a), by + rad * Math.sin(a));
        const v = sampleGray(g, w, h, p.x, p.y);
        if (v === null) return null;
        sum += v; n++;
      }
    }
    const paper = [];
    for (let i = 0; i < PAPER_POINTS; i++) {
      const a = (2 * Math.PI * i) / PAPER_POINTS + 0.3;
      const p = applyH(H, bx + PAPER_RADIUS * Math.cos(a), by + PAPER_RADIUS * Math.sin(a));
      const v = sampleGray(g, w, h, p.x, p.y);
      if (v === null) return null;
      paper.push(v);
    }
    paper.sort((a, b) => a - b);
    const paperLevel = Math.max(40, paper[paper.length >> 1]);
    return Math.max(0, Math.min(1, 1 - sum / n / paperLevel));
  }

  function barDarkness(g, w, h, H, layout) {
    const b = layout.orientationBar;
    let sum = 0, n = 0;
    for (let i = -2; i <= 2; i++) {
      for (let j = -1; j <= 1; j++) {
        const p = applyH(H, b.x + i * (b.w / 5), b.y + j * (b.h / 4));
        const v = sampleGray(g, w, h, p.x, p.y);
        if (v === null) return 0;
        sum += v; n++;
      }
    }
    // Se compara con el papel unos mm más abajo de la barra.
    const q = applyH(H, b.x, b.y + 7);
    const paper = sampleGray(g, w, h, q.x, q.y) || 255;
    return 1 - sum / n / Math.max(40, paper);
  }

  function buildH(layout, m) {
    const src = layout.markers;
    const dst = [m.tl, m.tr, m.bl, m.br].map((c) => ({ x: c.cx, y: c.cy }));
    return solveHomography(src, dst);
  }

  // ---------- API ----------
  // Devuelve { ok:true, H, scores:{ reg:[col][dígito], mod:[i], ans:[q][opción] } }
  // o { ok:false, error }.
  function scanImage(img, layout) {
    const { width: w, height: h } = img;
    const g = toGray(img);
    const win = Math.max(15, Math.round(Math.max(w, h) / 12)) | 1;
    const bin = binarize(g, w, h, win, 0.8);
    const comps = components(bin, w, h);
    const m = findMarkers(comps, w, h);
    if (!m) {
      return { ok: false, error: 'No se encontraron las 4 marcas negras de las esquinas. Sacá la foto con la hoja completa, bien iluminada y sin tapar las esquinas.' };
    }
    const wd = Math.hypot(m.tr.cx - m.tl.cx, m.tr.cy - m.tl.cy);
    const ht = Math.hypot(m.bl.cx - m.tl.cx, m.bl.cy - m.tl.cy);
    const aspect = wd / ht; // esperado ~ 184/271 = 0.68
    if (aspect < 0.45 || aspect > 0.95) {
      return { ok: false, error: 'La hoja parece estar girada o muy inclinada. Sacá la foto con la hoja en vertical.' };
    }

    let H = buildH(layout, m);
    if (!H) return { ok: false, error: 'No se pudo calcular la posición de la hoja.' };
    let rotated = false;
    if (barDarkness(g, w, h, H, layout) < 0.5) {
      // Probar con la hoja dada vuelta 180°.
      const m2 = { tl: m.br, tr: m.bl, bl: m.tr, br: m.tl };
      const H2 = buildH(layout, m2);
      if (H2 && barDarkness(g, w, h, H2, layout) >= 0.5) {
        H = H2; rotated = true;
      } else {
        return { ok: false, error: 'No se reconoce la orientación de la hoja. Revisá que sea la hoja correcta y que esté completa en la foto.' };
      }
    }

    const scores = {
      reg: Array.from({ length: layout.regDigits }, () => new Array(10).fill(0)),
      mod: new Array(layout.modalidades.length).fill(0),
      ans: Array.from({ length: layout.numQuestions }, () => new Array(layout.numOptions).fill(0)),
    };
    for (const b of layout.bubbles) {
      const s = bubbleScore(g, w, h, H, b.x, b.y);
      if (s === null) {
        return { ok: false, error: 'Parte de la hoja quedó fuera de la foto. Sacala de nuevo con la hoja completa.' };
      }
      if (b.kind === 'reg') scores.reg[b.col][b.digit] = s;
      else if (b.kind === 'mod') scores.mod[b.index] = s;
      else scores.ans[b.q][b.opt] = s;
    }
    return { ok: true, H, rotated, scores };
  }

  // Convierte los puntajes de burbuja en respuestas. `threshold`: desde qué relleno cuenta como marcada.
  // Las burbujas con relleno intermedio se marcan como dudosas para revisión manual.
  function interpret(scan, threshold) {
    const thr = threshold == null ? 0.25 : threshold;
    const lo = thr * 0.4, hi = thr * 1.2;
    const dubious = (s) => s >= lo && s <= hi;
    const pickMarked = (arr) => arr.map((s, i) => (s >= thr ? i : -1)).filter((i) => i >= 0);

    const regDigits = scan.scores.reg.map((col) => {
      const marked = pickMarked(col);
      return {
        digit: marked.length === 1 ? marked[0] : null,
        problem: marked.length !== 1 || col.some(dubious),
      };
    });
    const registro = regDigits.map((d) => (d.digit === null ? '?' : String(d.digit))).join('');
    const modMarked = pickMarked(scan.scores.mod);
    const modalidad = modMarked.length === 1 ? modMarked[0] : null;
    const answers = scan.scores.ans.map(pickMarked);
    const flags = scan.scores.ans.map((arr, q) => ({
      blank: answers[q].length === 0,
      dubious: arr.some(dubious),
    }));
    return {
      registro,
      registroProblem: regDigits.some((d) => d.problem),
      modalidad,
      modalidadProblem: scan.scores.mod.length > 0 && (modMarked.length !== 1 || scan.scores.mod.some(dubious)),
      answers,
      flags,
    };
  }

  return { scanImage, interpret, solveHomography, applyH, toGray, binarize, components };
});
