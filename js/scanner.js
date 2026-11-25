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

  // Gris de la imagen, calculado una sola vez por foto: leer una hoja hace decenas de recortes sobre la misma
  // imagen y cada uno volvía a convertirla entera. La clave es el objeto de la imagen, que no se modifica después de leerla.
  const grayCache = new WeakMap();
  function grayOf(img) {
    let g = grayCache.get(img);
    if (!g) { g = toGray(img); grayCache.set(img, g); }
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
      let area = 0, sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
      let minx = w, maxx = 0, miny = h, maxy = 0;
      while (sp > 0) {
        const p = stack[--sp];
        const x = p % w, y = (p - x) / w;
        area++; sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y;
        if (x < minx) minx = x;
        if (x > maxx) maxx = x;
        if (y < miny) miny = y;
        if (y > maxy) maxy = y;
        if (x > 0 && bin[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack[sp++] = p - 1; }
        if (x < w - 1 && bin[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack[sp++] = p + 1; }
        if (y > 0 && bin[p - w] && !seen[p - w]) { seen[p - w] = 1; stack[sp++] = p - w; }
        if (y < h - 1 && bin[p + w] && !seen[p + w]) { seen[p + w] = 1; stack[sp++] = p + w; }
      }
      // Elongación (largo / ancho de la mancha, sin importar cómo esté girada): 1 para un cuadrado,
      // ~4 para una barra de 4 a 1.
      const mx = sx / area, my = sy / area;
      const vxx = sxx / area - mx * mx + 1 / 12, vyy = syy / area - my * my + 1 / 12, vxy = sxy / area - mx * my;
      const tr = (vxx + vyy) / 2, df = Math.sqrt(((vxx - vyy) / 2) ** 2 + vxy * vxy);
      const elong = Math.sqrt((tr + df) / Math.max(1e-9, tr - df));
      comps.push({ area, cx: mx, cy: my, minx, maxx, miny, maxy, elong });
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

  // Zona donde se mide la tinta: un círculo de 1,2 mm de radio alrededor del centro. Más afuera, el borde impreso del
  // círculo se "derrama" en la medida cuando la foto es borrosa y tapa a los trazos finos (como una cruz, que pasa
  // justo por el centro).
  const INNER_RINGS = [[0, 1], [0.5, 6], [1.0, 10], [1.2, 10]]; // [radio mm, puntos]
  const PAPER_RADIUS = 3.0;
  const PAPER_POINTS = 12;

  // Mide una burbuja: `mean` = oscurecimiento promedio del interior (0 vacía, 1 llena) y
  // `top` = promedio del cuarto más oscuro de los puntos (detecta trazos finos como una cruz).
  // null si cae fuera de la imagen.
  function bubbleStats(g, w, h, H, bx, by) {
    const dark = [];
    for (const [rad, pts] of INNER_RINGS) {
      for (let i = 0; i < pts; i++) {
        const a = (2 * Math.PI * i) / pts;
        const p = applyH(H, bx + rad * Math.cos(a), by + rad * Math.sin(a));
        const v = sampleGray(g, w, h, p.x, p.y);
        if (v === null) return null;
        dark.push(v);
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
    const d = dark.map((v) => Math.max(0, Math.min(1, 1 - v / paperLevel))).sort((a, b) => b - a);
    const mean = d.reduce((s, v) => s + v, 0) / d.length;
    const k = Math.max(1, Math.round(d.length * TOP_FRACTION));
    const top = d.slice(0, k).reduce((s, v) => s + v, 0) / k;
    return { mean, top };
  }

  const TOP_FRACTION = 0.25;
  // Puntaje final: 0 = burbuja vacía, 1 = totalmente rellena.
  function bubbleScore(g, w, h, H, bx, by) {
    const st = bubbleStats(g, w, h, H, bx, by);
    return st === null ? null : st.mean;
  }

  // Papel de referencia: mediana de varios puntos de la hoja (en mm) para comparar contra la tinta.
  function paperLevel(g, w, h, H, pts) {
    const ref = [];
    for (const [x, y] of pts) {
      const q = applyH(H, x, y);
      const v = sampleGray(g, w, h, q.x, q.y);
      if (v !== null) ref.push(v);
    }
    ref.sort((a, c) => a - c);
    return Math.max(40, ref.length ? ref[ref.length >> 1] : 255);
  }

  // Oscurecimiento medio (0 papel, 1 negro) de un conjunto de puntos en mm, contra `paper`.
  function darkness(g, w, h, H, pts, paper) {
    let sum = 0;
    for (const [x, y] of pts) {
      const q = applyH(H, x, y);
      const v = sampleGray(g, w, h, q.x, q.y);
      if (v === null) return null;
      sum += v;
    }
    return 1 - sum / pts.length / paper;
  }

  // Barra de orientación (parte común a todas las versiones: la v2 es más ancha).
  const BAR_COMMON = { x: 74, y: 10, w: 20, h: 4 };
  function barDarkness(g, w, h, H) {
    const b = BAR_COMMON;
    const pts = [];
    for (let i = -2; i <= 2; i++) for (let j = -1; j <= 1; j++) pts.push([b.x + i * (b.w / 5), b.y + j * (b.h / 4)]);
    const d = darkness(g, w, h, H, pts, paperLevel(g, w, h, H, [-2, -1, 0, 1, 2].map((i) => [b.x + i * (b.w / 5), b.y + 4.5])));
    return d === null ? 0 : d;
  }

  // Versión de la hoja: código de 3 cuadraditos al pie + ancho de la barra (la v2 es más ancha).
  // Las dos señales tienen que coincidir; si no, mejor pedir otra foto que leer con el diseño equivocado.
  function detectVersion(g, w, h, H, vc, latest, family) {
    const refPts = [];
    for (let i = 0; i < 7; i++) refPts.push([vc.x0 - 1 + i * (vc.bits * vc.pitch / 6), vc.y + 3.6]);
    const paper = paperLevel(g, w, h, H, refPts);
    let value = 0;
    for (let i = 0; i < vc.bits; i++) {
      const cx = vc.x0 + i * vc.pitch, cy = vc.y;
      const pts = [[cx, cy]];
      for (let k = 0; k < 8; k++) pts.push([cx + 0.9 * Math.cos(k * Math.PI / 4), cy + 0.9 * Math.sin(k * Math.PI / 4)]);
      const d = darkness(g, w, h, H, pts, paper);
      if (d === null) return { error: 'Parte de la hoja quedó fuera de la foto. Sacala de nuevo con la hoja completa.' };
      if (d >= 0.35) value |= 1 << i;
      else if (d > 0.15) return { error: 'No se pudo reconocer el formato de la hoja (revisá la luz y que el pie de la hoja se vea completo).' };
    }
    const version = value + 1;
    if (version > latest) {
      return { error: 'Esta hoja es de un formato más nuevo (V' + version + '). Actualizá la app para poder leerla.' };
    }
    // La forma de las marcas de esquina (familia) tiene que coincidir con la versión del código.
    if (family === 'bars' ? version < 3 : version >= 3) {
      return { error: 'No se pudo reconocer el formato de la hoja. Sacá otra foto con buena luz y con la hoja completa.' };
    }
    if (family === 'bars') return { version };
    // V1 y V2: control cruzado con el ancho de la barra superior.
    const barRef = paperLevel(g, w, h, H, [-1, 0, 1].map((i) => [BAR_COMMON.x + i * 5, BAR_COMMON.y + 4.5]));
    const wideD = darkness(g, w, h, H, [[BAR_COMMON.x - 12.5, BAR_COMMON.y], [BAR_COMMON.x + 12.5, BAR_COMMON.y], [BAR_COMMON.x - 12.5, BAR_COMMON.y + 1], [BAR_COMMON.x + 12.5, BAR_COMMON.y - 1]], barRef);
    const wide = wideD !== null && wideD >= 0.4;
    if (wideD === null || (wideD > 0.15 && wideD < 0.4) || wide !== (version >= 2)) {
      return { error: 'No se pudo reconocer el formato de la hoja. Sacá otra foto con buena luz y con la hoja completa.' };
    }
    return { version };
  }

  function buildH(layout, m) {
    const src = layout.markers;
    const dst = [m.tl, m.tr, m.bl, m.br].map((c) => ({ x: c.cx, y: c.cy }));
    return solveHomography(src, dst);
  }

  // ¿Los aros impresos de las burbujas caen donde corresponde con esta geometría? Promedio de lo oscuro que
  // es el papel sobre el borde de cada burbuja. Con 4 marcas equivocadas el cuadro de burbujas se corre y baja.
  function ringScore(g, w, h, H, layout) {
    let sum = 0, n = 0;
    for (const b of layout.bubbles) {
      const ring = [], paper = [];
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4 + 0.39;
        const p = applyH(H, b.x + layout.r * Math.cos(a), b.y + layout.r * Math.sin(a));
        const v = sampleGray(g, w, h, p.x, p.y);
        if (v === null) return -1;
        ring.push(v);
        const q = applyH(H, b.x + 3.0 * Math.cos(a), b.y + 3.0 * Math.sin(a));
        const u = sampleGray(g, w, h, q.x, q.y);
        if (u !== null) paper.push(u);
      }
      paper.sort((x, y) => x - y);
      const pl = Math.max(40, paper.length ? paper[paper.length >> 1] : 255);
      for (const v of ring) { sum += Math.max(0, 1 - v / pl); n++; }
    }
    return n ? sum / n : -1;
  }


  // ---------- ajuste de la grilla a los círculos impresos ----------
  // Las cuatro marcas de las esquinas fijan la posición de las burbujas como si la hoja fuera un plano. Con la hoja
  // sobre una pila de papeles, curvada o con la foto muy inclinada, el interior queda corrido respecto de lo que predicen
  // las esquinas (medido: hasta 5 mm arriba a la izquierda y 0 abajo a la derecha, con filas separadas 5,5 mm: una fila
  // entera). Por eso cada columna de respuestas se ajusta a los aros impresos de la propia foto con una corrección
  // chica: desplazamiento (dx, dy), escala vertical (sy) e inclinación horizontal (kx).
  const GRID_OUTER = 1.2; // mm hacia afuera del aro donde se mira el papel
  const GRID_MIN_GAIN = 0.04; // cuánto tiene que mejorar el contraste para aceptar la corrección

  function makeFix(p, yc) {
    const xc = p.xc || 0, sx = p.sx || 1;
    return (b) => ({ x: xc + (b.x - xc) * sx + p.dx + p.kx * (b.y - yc), y: yc + (b.y - yc) * p.sy + p.dy });
  }

  // Contraste de los aros (oscuros) contra el papel justo afuera; 0 si no se puede medir.
  function gridContrast(g, w, h, H, bubbles, fix, r) {
    let sum = 0, n = 0;
    for (const b of bubbles) {
      const c = fix(b);
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4 + 0.39;
        const pr = applyH(H, c.x + r * Math.cos(a), c.y + r * Math.sin(a));
        const po = applyH(H, c.x + (r + GRID_OUTER) * Math.cos(a), c.y + (r + GRID_OUTER) * Math.sin(a));
        const vr = sampleGray(g, w, h, pr.x, pr.y), vo = sampleGray(g, w, h, po.x, po.y);
        if (vr === null || vo === null) continue;
        sum += Math.max(0, (vo - vr) / Math.max(40, vo)); n++;
      }
    }
    return n ? sum / n : 0;
  }

  // Busca la corrección de un bloque de burbujas: barrido grueso de (dy, sy) y después ajuste fino de los cuatro parámetros.
  // La grilla es periódica: correrla una fila entera también encaja con los aros. Para no engancharse a la fila equivocada,
  // se castiga que haya aros una fila antes de la primera o una fila después de la última (ahí tiene que haber papel).
  function refineBlock(g, w, h, H, bubbles, r, pitch) {
    const yc = bubbles.reduce((a, b) => a + b.y, 0) / bubbles.length;
    const xc = bubbles.reduce((a, b) => a + b.x, 0) / bubbles.length;
    const ys = bubbles.map((b) => b.y);
    const top = Math.min(...ys), bot = Math.max(...ys);
    const above = bubbles.filter((b) => b.y === top).map((b) => ({ x: b.x, y: b.y - pitch }));
    const below = bubbles.filter((b) => b.y === bot).map((b) => ({ x: b.x, y: b.y + pitch }));
    const score = (p) => {
      const f = makeFix(Object.assign({ xc }, p), yc);
      const inside = gridContrast(g, w, h, H, bubbles, f, r);
      const out = Math.max(gridContrast(g, w, h, H, above, f, r), gridContrast(g, w, h, H, below, f, r));
      return inside - 0.8 * out;
    };
    let best = { dx: 0, dy: 0, sy: 1, kx: 0, sx: 1 };
    const zero = score(best);
    let bs = zero;
    for (let dx = -3; dx <= 3.001; dx += 0.75) {
      for (let dy = -6; dy <= 6.001; dy += 0.75) {
        for (let sy = 0.9; sy <= 1.1001; sy += 0.0333) {
          const p = { dx, dy, sy, kx: 0, sx: 1 }, v = score(p);
          if (v > bs) { bs = v; best = p; }
        }
      }
    }
    const steps = { dx: [3, 0.25], kx: [0.08, 0.01], dy: [1, 0.1], sy: [0.04, 0.005], sx: [0.06, 0.005] };
    for (let round = 0; round < 2; round++) {
      for (const k of ['dx', 'sx', 'kx', 'dy', 'sy']) {
        const [span, st] = steps[k];
        for (let d = -span; d <= span + 1e-9; d += st) {
          const p = Object.assign({}, best); p[k] = best[k] + d;
          const v = score(p);
          if (v > bs) { bs = v; best = p; }
        }
      }
    }
    return { ...best, yc, xc, gain: zero > 0 ? bs / zero - 1 : (bs > zero ? 1 : 0), score: bs, base: zero };
  }

  // Una corrección por columna de respuestas; si no mejora, queda sin corregir.
  function gridFixes(g, w, h, H, layout) {
    return layout.ans.cols.map((c) => {
      const bubbles = layout.bubbles.filter((b) => b.kind === 'ans' && b.q >= c.qStart && b.q < c.qEnd);
      if (!bubbles.length) return null;
      const f = refineBlock(g, w, h, H, bubbles, layout.r, layout.ans.rowPitch);
      if (f.gain < GRID_MIN_GAIN) return { dx: 0, dy: 0, sy: 1, kx: 0, sx: 1, xc: f.xc, yc: f.yc, gain: f.gain, score: f.score, base: f.base };
      return f;
    });
  }

  // Candidatos a marca de esquina: manchas negras macizas y cuadradas, completas (sin tocar el borde).
  function markerCandidates(comps, w, h) {
    const L = Math.max(w, h);
    return comps.filter((c) => {
      const bw = c.maxx - c.minx + 1, bh = c.maxy - c.miny + 1;
      if (Math.max(bw, bh) < 0.012 * L || Math.max(bw, bh) > 0.2 * L) return false;
      const ratio = bw / bh;
      if (ratio < 0.15 || ratio > 6.5) return false; // cuadrados y barras
      if (c.area / (bw * bh) < 0.4) return false;
      return c.minx > 0 && c.miny > 0 && c.maxx < w - 1 && c.maxy < h - 1; // una marca cortada tiene el centro mal
    }).sort((a, b) => b.area - a.area).slice(0, 14);
  }

  const dist = (a, b) => Math.hypot(a.cx - b.cx, a.cy - b.cy);

  // Forma de una mancha por su elongación: cuadrado (~1) o barra (~4). Sirve aunque esté girada.
  const SQUARE_MAX = 1.8, BAR_MIN = 2.2; // 1,8: una grampa o un tachón sobre el cuadrado lo alarga (medido 1,6 en una hoja real); las barras reales miden 3,9 o más
  const shapeOf = (c) => (c.elong <= SQUARE_MAX ? 'sq' : c.elong >= BAR_MIN ? 'bar' : '?');

  // Devuelve { H, rotated, version, layout, fit } o { error }.
  // Familias de marcas: V1/V2 = 4 cuadrados (la orientación sale de la barra del encabezado);
  // V3 = cuadrados a la izquierda y barras a la derecha (la orientación sale de las formas).
  function findSheet(g, w, h, comps, layoutFor, fixed) {
    const base = layoutFor(1);
    let versionError = null;
    const cands = markerCandidates(comps, w, h);
    if (cands.length < 4) {
      return { error: 'No se encontraron las 4 marcas negras de las esquinas. Sacá la foto con la hoja completa, bien iluminada y sin tapar las esquinas.' };
    }
    const templateBars = fixed && fixed.version >= 3 ? fixed : layoutFor(3);
    let best = null, shapeOk = false, formsOk = false;
    const n = cands.length;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) for (let l = k + 1; l < n; l++) {
      const sub = [cands[i], cands[j], cands[k], cands[l]];
      const areas = sub.map((c) => c.area);
      if (Math.max(...areas) / Math.min(...areas) > 3.5) continue;
      const pick = (score) => sub.reduce((bst, c) => (score(c) < score(bst) ? c : bst));
      const m = { tl: pick((c) => c.cx + c.cy), br: pick((c) => -(c.cx + c.cy)), tr: pick((c) => -(c.cx - c.cy)), bl: pick((c) => c.cx - c.cy) };
      if (new Set([m.tl, m.tr, m.bl, m.br]).size < 4) continue;
      const wt = dist(m.tl, m.tr), wb = dist(m.bl, m.br), hl = dist(m.tl, m.bl), hr = dist(m.tr, m.br);
      const aspect = ((wt + wb) / 2) / ((hl + hr) / 2); // la hoja real: ~0,65 a 0,67
      if (aspect < 0.5 || aspect > 0.9) continue;
      if (wt / wb < 0.6 || wt / wb > 1.67 || hl / hr < 0.6 || hl / hr > 1.67) continue;
      // Tamaño: una marca mide ~8 mm (la barra tiene la misma superficie) y hay ~125 mm entre marcas.
      // Las burbujas rellenas (4,4 mm) y las manchas chicas no cumplen esa proporción.
      const avgW = (wt + wb) / 2;
      if (sub.some((c) => { const r = Math.sqrt(c.area) / avgW; return r < 0.04 || r > 0.1; })) continue;
      shapeOk = true;

      const shapes = { tl: shapeOf(m.tl), tr: shapeOf(m.tr), bl: shapeOf(m.bl), br: shapeOf(m.br) };
      let family = null, rotated = false;
      if (shapes.tl === 'sq' && shapes.tr === 'sq' && shapes.bl === 'sq' && shapes.br === 'sq') family = 'squares';
      else if (shapes.tl === 'sq' && shapes.bl === 'sq' && shapes.tr === 'bar' && shapes.br === 'bar') family = 'bars';
      else if (shapes.tl === 'bar' && shapes.bl === 'bar' && shapes.tr === 'sq' && shapes.br === 'sq') { family = 'bars'; rotated = true; } // hoja dada vuelta
      if (!family) continue;
      formsOk = true;

      let Hc, tpl;
      if (family === 'bars') {
        // Los cuadrados son las esquinas izquierdas de la hoja; si aparecen a la derecha, la foto está dada vuelta.
        const mm = rotated ? { tl: m.br, tr: m.bl, bl: m.tr, br: m.tl } : m;
        Hc = buildH(templateBars, mm);
        tpl = templateBars;
      } else {
        // Orientación con la barra negra del encabezado: se compara contra la hoja dada vuelta 180°
        // en lugar de exigir un negro absoluto (las impresoras y la luz varían).
        const H0 = buildH(base, m);
        const H180 = buildH(base, { tl: m.br, tr: m.bl, bl: m.tr, br: m.tl });
        if (!H0 || !H180) continue;
        const d0 = barDarkness(g, w, h, H0), d180 = barDarkness(g, w, h, H180);
        if (Math.max(d0, d180) < 0.2 || Math.abs(d0 - d180) < 0.15) continue;
        Hc = d180 > d0 ? H180 : H0;
        rotated = d180 > d0;
        tpl = base;
      }
      if (!Hc) continue;

      const cx = (m.tl.cx + m.tr.cx + m.bl.cx + m.br.cx) / 4, cy = (m.tl.cy + m.tr.cy + m.bl.cy + m.br.cy) / 4;
      const centered = Math.hypot(cx - w / 2, cy - h / 2) / Math.hypot(w / 2, h / 2);
      // Versión de la hoja con esta geometría y qué tan bien encajan los aros de las burbujas.
      let version, layout;
      if (fixed) { layout = fixed; version = fixed.version; } else {
        const det = detectVersion(g, w, h, Hc, tpl.versionCode, tpl.latestVersion, family);
        if (det.error) { versionError = det.error; continue; }
        version = det.version; layout = layoutFor(version);
      }
      const fit = ringScore(g, w, h, Hc, layout);
      if (fit < 0) continue;
      const cand = { H: Hc, rotated, version, layout, fit, centered };
      // Gana la combinación cuyos aros encajan mejor; si quedan parejas, la más centrada.
      if (!best || cand.fit > best.fit + 0.02 || (cand.fit > best.fit - 0.02 && cand.centered < best.centered)) best = cand;
    }
    if (best) return best;
    if (versionError) return { error: versionError };
    if (!shapeOk) return { error: 'La hoja parece estar girada o muy inclinada. Sacá la foto con la hoja en vertical.' };
    if (!formsOk) return { error: 'Las marcas de las esquinas no tienen la forma esperada. Revisá que sea la hoja correcta y que esté completa en la foto.' };
    return { error: 'No se reconoce la orientación de la hoja. Revisá que sea la hoja correcta y que esté completa en la foto.' };
  }

  // ---------- API ----------
  // `layoutSource`: función (versión) => layout, o un layout fijo (se omite la detección de versión).
  // Devuelve { ok:true, H, version, layout, scores:{ mod:[i], ans:[q][opción] } } o { ok:false, error }.
  function scanImage(img, layoutSource) {
    const fixed = typeof layoutSource === 'function' ? null : layoutSource;
    const layoutFor = fixed ? () => fixed : layoutSource;
    const base = layoutFor(1);
    const { width: w, height: h } = img;
    const g = grayOf(img);
    const win = Math.max(15, Math.round(Math.max(w, h) / 12)) | 1;
    const bin = binarize(g, w, h, win, 0.8);
    const comps = components(bin, w, h);
    // Se busca cuál de las combinaciones de 4 marcas es realmente la hoja. Puede haber más marcas en la
    // foto (la hoja vecina de una página A4 sin cortar, manchas negras): se prueban las combinaciones
    // posibles y gana la que tiene la forma de la hoja y la barra negra del encabezado en su lugar.
    const found = findSheet(g, w, h, comps, layoutFor, fixed);
    if (found.error) return { ok: false, error: found.error };
    const { H, rotated, version, layout } = found;

    const scores = {
      mod: new Array(layout.modalidades.length).fill(0),
      ans: Array.from({ length: layout.numQuestions }, () => new Array(layout.numOptions).fill(0)),
    };
    // Corrección por columna de respuestas; la modalidad usa la de la primera columna (queda justo arriba).
    const blocks = gridFixes(g, w, h, H, layout);
    const blockOf = (q) => layout.ans.cols.findIndex((c) => q >= c.qStart && q < c.qEnd);
    const fixOf = (b) => {
      const bl = blocks[b.kind === 'mod' ? 0 : blockOf(b.q)];
      if (!bl || !(bl.dx || bl.dy || bl.sy !== 1 || bl.kx || bl.sx !== 1)) return b;
      return makeFix(bl, bl.yc)(b);
    };
    for (const b of layout.bubbles) {
      const c = fixOf(b);
      const s = bubbleScore(g, w, h, H, c.x, c.y);
      if (s === null) {
        return { ok: false, error: 'Parte de la hoja quedó fuera de la foto. Sacala de nuevo con la hoja completa.' };
      }
      if (b.kind === 'mod') scores.mod[b.index] = s;
      else scores.ans[b.q][b.opt] = s;
    }
    const grid = blocks.map((bl) => bl && { xc: +bl.xc.toFixed(1), sx: +bl.sx.toFixed(3), dx: +bl.dx.toFixed(2), dy: +bl.dy.toFixed(2), sy: +bl.sy.toFixed(3), kx: +bl.kx.toFixed(3), yc: +bl.yc.toFixed(1), gain: +bl.gain.toFixed(2) });
    return { ok: true, H, rotated, version, layout, scores, grid };
  }

  // Convierte los puntajes de burbuja en respuestas.
  // A cada puntaje se le descuenta el "nivel base" de su zona de la foto (lo que mide una burbuja
  // vacía por la luz, el papel y la impresora): así se detectan hasta trazos finos como una cruz.
  // El nivel base se calcula SOLO con las burbujas vacías: se separan en dos grupos (claras y
  // oscuras) y se toma un valor bajo del grupo de claras. Así no se rompe cuando el alumno
  // marca más de la mitad de las burbujas (con la mediana de todas, pasaba eso).
  // `groups`: lista de [primera, última+1] pregunta de cada columna de la hoja; cada columna tiene
  // su propio nivel base porque la luz puede cambiar de un lado al otro de la hoja.
  // `threshold`: cuánto más oscura que el fondo tiene que estar una burbuja para contar como
  // marcada. Las que quedan apenas por debajo se señalan como dudosas para revisar a mano.
  const DEFAULT_THRESHOLD = 0.17; // piso del umbral adaptativo (ver interpret): 9 errores en 559 preguntas de 28 hojas reales
  const MIN_CLUSTER_GAP = 0.15; // diferencia mínima entre burbujas vacías y marcadas
  const BASE_QUANTILE = 0.3;
  const ADAPT_FRAC = 0.45, ADAPT_MAX = 0.22; // dónde cae el umbral entre vacías y marcadas, y tope
  const WINDOW_BEFORE = 4, WINDOW_AFTER = 4; // filas vecinas que se usan para el nivel base

  function quantile(sortedAsc, q) {
    if (!sortedAsc.length) return 0;
    return sortedAsc[Math.min(sortedAsc.length - 1, Math.floor(q * sortedAsc.length))];
  }

  // Nivel de una burbuja vacía a partir de todos los puntajes de una zona.
  function emptyLevel(values) {
    const v = values.slice().sort((x, y) => x - y);
    if (!v.length) return 0;
    let lo = v[0], hi = v[v.length - 1];
    if (hi - lo < MIN_CLUSTER_GAP) return quantile(v, BASE_QUANTILE); // sin marcas claras
    for (let it = 0; it < 30; it++) {
      const mid = (lo + hi) / 2;
      const low = v.filter((x) => x <= mid), high = v.filter((x) => x > mid);
      if (!low.length || !high.length) break;
      const nlo = low.reduce((a, c) => a + c, 0) / low.length, nhi = high.reduce((a, c) => a + c, 0) / high.length;
      if (Math.abs(nlo - lo) < 1e-6 && Math.abs(nhi - hi) < 1e-6) break;
      lo = nlo; hi = nhi;
    }
    return quantile(v.filter((x) => x <= (lo + hi) / 2), BASE_QUANTILE);
  }

  function interpret(scan, threshold, groups) {
    const floor = threshold == null ? DEFAULT_THRESHOLD : threshold;
    let thr = floor;
    const ans = scan.scores.ans;
    const grp = groups && groups.length ? groups : [[0, ans.length]];
    // El nivel base de cada pregunta se calcula con las filas cercanas de su misma columna
    // (la luz de una foto suele cambiar de arriba hacia abajo y de un lado al otro).
    const baseOfQ = new Array(ans.length).fill(0);
    for (const [q0, q1] of grp) {
      for (let q = q0; q < Math.min(q1, ans.length); q++) {
        const from = Math.max(q0, q - WINDOW_BEFORE), to = Math.min(q1, q + WINDOW_AFTER + 1);
        baseOfQ[q] = emptyLevel([].concat(...ans.slice(from, to)));
      }
    }
    // Modalidad: se compara con el nivel base de la primera pregunta (queda justo arriba).
    const modBase = ans.length ? baseOfQ[0] : 0;
    const adj = (v, base) => Math.max(0, v - base);
    // Umbral de cada foto: la «sensibilidad» elegida es un PISO y el umbral sube hasta quedar entre el grupo de burbujas
    // vacías y el de marcadas de esa hoja. Un umbral fijo queda siempre en el borde: las vacías llegan a 0,16-0,23 por la
    // luz, la lapicera y el papel, y una marca tenue de una hoja vale lo mismo que el ruido de otra. Medido con 28 hojas
    // reales: con el umbral fijo 0,12 daba 155 preguntas mal; adaptativo, 10 con cualquier piso de 0,12 a 0,20.
    {
      const all = [];
      ans.forEach((arr, q) => arr.forEach((v) => all.push(adj(v, baseOfQ[q]))));
      all.sort((a, b) => a - b);
      if (all.length) {
        let lo2 = all[0], hi2 = all[all.length - 1];
        for (let it = 0; it < 40; it++) {
          const mid = (lo2 + hi2) / 2, low = all.filter((x) => x <= mid), high = all.filter((x) => x > mid);
          if (!low.length || !high.length) break;
          const nl = low.reduce((a, c) => a + c, 0) / low.length, nh = high.reduce((a, c) => a + c, 0) / high.length;
          if (Math.abs(nl - lo2) < 1e-6 && Math.abs(nh - hi2) < 1e-6) break;
          lo2 = nl; hi2 = nh;
        }
        thr = Math.min(ADAPT_MAX, Math.max(floor, lo2 + ADAPT_FRAC * (hi2 - lo2)));
      }
    }
    const lo = thr * 0.7; // por debajo de esto es ruido de la foto, no una marca tenue
    const dubiousV = (v, base) => adj(v, base) >= lo && adj(v, base) < thr;
    const markedIdx = (arr, base) => arr.map((v, i) => (adj(v, base) >= thr ? i : -1)).filter((i) => i >= 0);

    const modMarked = markedIdx(scan.scores.mod, modBase);
    let modalidad = modMarked.length === 1 ? modMarked[0] : null;
    // Respaldo para marcas livianas (una X, un tilde): ninguna burbuja pasa el umbral pero una es claramente más oscura que
    // la otra (medido: 0,12-0,17 contra 0,00-0,05). Se preselecciona y queda como DUDOSA para que el docente la confirme.
    // Con 39 hojas reales: 37 aciertos, 0 errores y 2 sin decidir.
    let modalidadWeak = false;
    if (modMarked.length === 0 && scan.scores.mod.length >= 2) {
      const mv = scan.scores.mod.map((v) => adj(v, modBase));
      const mx = Math.max(...mv), top = mv.indexOf(mx), other = Math.min(...mv.filter((_, k) => k !== top));
      if (mx >= 0.1 && mx - other >= 0.06 && other <= 0.5 * mx) { modalidad = top; modalidadWeak = true; }
    }
    const answers = ans.map((arr, q) => markedIdx(arr, baseOfQ[q]));
    const flags = ans.map((arr, q) => ({
      blank: answers[q].length === 0,
      dubious: arr.some((v) => dubiousV(v, baseOfQ[q])),
    }));
    return {
      threshold: thr,
      modalidad,
      modalidadWeak,
      modalidadProblem: scan.scores.mod.length > 0 && (modalidadWeak || modMarked.length !== 1 || scan.scores.mod.some((v) => dubiousV(v, modBase))),
      answers,
      flags,
    };
  }

  // Recorta del frame una zona rectangular de la hoja (en mm), ya enderezada.
  // Devuelve { width, height, data } RGBA con `pxPerMm` píxeles por mm.
  function cropRegion(img, H, rect, pxPerMm) {
    const w = Math.round(rect.w * pxPerMm), h = Math.round(rect.h * pxPerMm);
    const g = grayOf(img);
    const data = new Uint8ClampedArray(w * h * 4);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = applyH(H, rect.x + (x + 0.5) / pxPerMm, rect.y + (y + 0.5) / pxPerMm);
        const v = sampleGray(g, img.width, img.height, p.x, p.y);
        const i = (y * w + x) * 4;
        data[i] = data[i + 1] = data[i + 2] = v === null ? 255 : v;
        data[i + 3] = 255;
      }
    }
    return { width: w, height: h, data };
  }

  // Recorte del nombre escrito a mano, relativo a la LÍNEA IMPRESA del nombre y no a una ventana fija. Con la hoja curvada
  // o inclinada la línea sale corrida (hasta ~5 mm) y torcida (sube hacia un lado): la ventana fija cortaba la mitad de
  // abajo de lo escrito o dejaba entrar el título. Se busca la recta (pendiente y altura) más oscura del tramo libre de
  // letras y se endereza el recorte sobre ella. Devuelve { width, height, data RGBA gris, line } o null si no ve la línea.
  const NAME_SEARCH = { x: 16, y: 16, w: 120, h: 36 }; // mm de la hoja donde buscar
  const NAME_LINE_X = [48, 128];                        // tramo de la línea que está libre de letras (mm)
  const NAME_ABOVE = 12, NAME_BELOW = 4;                // mm que se recortan arriba y abajo de la línea
  function nameCrop(img, H, lineY, ppm) {
    ppm = ppm || 10;
    const big = cropRegion(img, H, NAME_SEARCH, ppm);
    const W = big.width, Hh = big.height, d = big.data;
    const at = (x, y) => d[(Math.max(0, Math.min(Hh - 1, Math.round(y))) * W + Math.max(0, Math.min(W - 1, Math.round(x)))) * 4];
    const xa = (NAME_LINE_X[0] - NAME_SEARCH.x) * ppm, xb = (NAME_LINE_X[1] - NAME_SEARCH.x) * ppm, xm = (xa + xb) / 2;
    const yExp = (lineY - NAME_SEARCH.y) * ppm;
    let best = null;
    for (let slope = -0.12; slope <= 0.1201; slope += 0.01) {
      for (let y0 = yExp - 6 * ppm; y0 <= yExp + 6 * ppm; y0 += 1) {
        let sum = 0, n = 0;
        for (let x = xa; x <= xb; x += 3) {
          const y = y0 + slope * (x - xm);
          const bg = (at(x, y - 7) + at(x, y + 7)) / 2;
          sum += Math.max(0, bg - Math.min(at(x, y - 1), at(x, y), at(x, y + 1)));
          n++;
        }
        const sc = sum / n;
        if (!best || sc > best.sc) best = { sc, slope, y0 };
      }
    }
    if (!best || best.sc < 25) return null;
    const outH = Math.round((NAME_ABOVE + NAME_BELOW) * ppm);
    const out = new Uint8ClampedArray(W * outH * 4);
    for (let v = 0; v < outH; v++) {
      for (let u = 0; u < W; u++) {
        const y = best.y0 + best.slope * (u - xm) - NAME_ABOVE * ppm + v;
        const val = y < 0 || y > Hh - 1 ? 255 : at(u, y);
        const k = (v * W + u) * 4;
        out[k] = out[k + 1] = out[k + 2] = val; out[k + 3] = 255;
      }
    }
    return { width: W, height: outH, data: out, line: best };
  }

  return { scanImage, interpret, nameCrop, makeFix, gridContrast, cropRegion, findMarkers, bubbleScore, bubbleStats, barDarkness, buildH, solveHomography, applyH, toGray, binarize, components };
});
