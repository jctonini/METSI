// Lectura de los dígitos del número de registro (escritos a mano, un dígito por casillero).
//
// Corre entero en el dispositivo: no usa servicios externos ni librerías. Una red neuronal chica
// (js/digit-model.js, entrenada con tools/train-digits.py) clasifica cada casillero por separado.
//
// Lo que devuelve es una SUGERENCIA: la app nunca la guarda como registro sin que el docente la
// confirme. Cada casillero queda como:
//   - vacío        (no hay tinta): no se inventa un dígito;
//   - dudoso       (la red no está segura o duda entre dos dígitos): se resalta para revisarlo;
//   - leído        (confianza alta).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./digit-model.js'));
  else root.MetsiDigits = factory(root.MetsiDigitModel);
})(typeof self !== 'undefined' ? self : this, function (MODEL) {
  const SIZE = 28;            // la red mira imágenes de 28x28, como MNIST
  const BOX = 20;             // el dígito se escala para que entre en 20x20 y se centra por su masa
  const PPM = 10;             // píxeles por mm al recortar cada casillero
  const MARGIN = 0.7;         // mm que se dejan de lado en cada borde para no leer la línea impresa del casillero
  const MIN_CONTRAST = 40;    // diferencia mínima (0-255) entre el papel y lo más oscuro para decir que hay tinta
  const MIN_INK = 0.008;      // fracción mínima del casillero con tinta (después de sacar el borde impreso)
  const SURE = 0.85;          // confianza mínima para dar un dígito por leído
  const GAP = 0.35;           // y distancia mínima con el segundo candidato

  // ---------- red ----------
  let net = null;
  function b64ToInt8(s) {
    if (typeof Buffer !== 'undefined') { const b = Buffer.from(s, 'base64'); return new Int8Array(b.buffer, b.byteOffset, b.length); }
    const bin = atob(s), out = new Int8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = (bin.charCodeAt(i) << 24) >> 24;
    return out;
  }
  function loadNet() {
    if (net) return net;
    if (!MODEL || !MODEL.layers) throw new Error('Falta el modelo de dígitos (js/digit-model.js)');
    net = MODEL.layers.map((L) => {
      const q = b64ToInt8(L.w), w = new Float32Array(L.out * L.in);
      for (let o = 0; o < L.out; o++) for (let i = 0; i < L.in; i++) w[o * L.in + i] = q[o * L.in + i] * L.s[o];
      return { n_in: L.in, n_out: L.out, w, b: Float32Array.from(L.b) };
    });
    return net;
  }

  // Probabilidades (0-9) para una imagen de 28x28 (784 valores entre 0 y 1; 1 = tinta).
  function classify(vec) {
    let a = vec;
    const layers = loadNet();
    for (let l = 0; l < layers.length; l++) {
      const { n_in, n_out, w, b } = layers[l];
      const out = new Float32Array(n_out);
      for (let o = 0; o < n_out; o++) {
        let s = b[o];
        const base = o * n_in;
        for (let i = 0; i < n_in; i++) s += w[base + i] * a[i];
        out[o] = l < layers.length - 1 && s < 0 ? 0 : s;
      }
      a = out;
    }
    let max = -Infinity;
    for (let i = 0; i < a.length; i++) if (a[i] > max) max = a[i];
    let sum = 0;
    const p = new Float32Array(a.length);
    for (let i = 0; i < a.length; i++) { p[i] = Math.exp(a[i] - max); sum += p[i]; }
    for (let i = 0; i < p.length; i++) p[i] /= sum;
    return p;
  }

  // ---------- preparación del casillero ----------
  function percentile(sorted, q) { return sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))]; }

  // Componentes conexas de una máscara (4 vecinos). Devuelve etiquetas y datos de cada una.
  function components(mask, w, h) {
    const label = new Int32Array(w * h);
    const comps = [];
    const stack = new Int32Array(w * h);
    for (let s = 0; s < mask.length; s++) {
      if (!mask[s] || label[s]) continue;
      const id = comps.length + 1;
      let sp = 0, area = 0, minx = w, maxx = 0, miny = h, maxy = 0;
      stack[sp++] = s; label[s] = id;
      while (sp > 0) {
        const p = stack[--sp];
        const x = p % w, y = (p - x) / w;
        area++;
        if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
        if (x > 0 && mask[p - 1] && !label[p - 1]) { label[p - 1] = id; stack[sp++] = p - 1; }
        if (x < w - 1 && mask[p + 1] && !label[p + 1]) { label[p + 1] = id; stack[sp++] = p + 1; }
        if (y > 0 && mask[p - w] && !label[p - w]) { label[p - w] = id; stack[sp++] = p - w; }
        if (y < h - 1 && mask[p + w] && !label[p + w]) { label[p + w] = id; stack[sp++] = p + w; }
      }
      comps.push({ id, area, minx, maxx, miny, maxy });
    }
    return { label, comps };
  }

  // Convierte el recorte de un casillero ({width, height, data RGBA en gris}) en la imagen de 28x28 para la red.
  // Devuelve { empty: true } si no hay tinta, o { empty: false, vec, ink } si la hay.
  function prepare(crop) {
    const w = crop.width, h = crop.height, n = w * h;
    const g = new Float32Array(n);
    for (let i = 0; i < n; i++) g[i] = crop.data[i * 4];
    const sorted = Float32Array.from(g).sort();
    const paper = percentile(sorted, 0.85), dark = percentile(sorted, 0.01);
    const contrast = paper - dark;
    if (contrast < MIN_CONTRAST) return { empty: true, ink: 0 };

    // Tinta "suave" (0 papel, 1 trazo oscuro) y máscara para buscar componentes.
    const soft = new Float32Array(n), mask = new Uint8Array(n);
    const thr = paper - 0.4 * contrast;
    for (let i = 0; i < n; i++) {
      soft[i] = Math.min(1, Math.max(0, (paper - g[i]) / contrast));
      mask[i] = g[i] < thr ? 1 : 0;
    }
    // Se descartan motas chicas y los restos de la línea impresa del casillero (finos, largos y pegados al borde).
    const { label, comps } = components(mask, w, h);
    const keep = new Uint8Array(comps.length + 1);
    const minArea = Math.max(6, Math.round(0.0012 * n));
    let inkPx = 0;
    for (const c of comps) {
      const bw = c.maxx - c.minx + 1, bh = c.maxy - c.miny + 1;
      // Un resto del borde impreso es una línea fina y larga pegada (o muy cerca) del lado paralelo a ella:
      // vertical junto a la izquierda o la derecha, horizontal junto a arriba o abajo. Un «1» también es fino
      // y largo, pero va por el medio del casillero.
      const nearSide = Math.min(c.minx, w - 1 - c.maxx) <= 0.12 * w;
      const nearTopBottom = Math.min(c.miny, h - 1 - c.maxy) <= 0.12 * h;
      const lineLike = (bh >= 0.6 * h && bw <= 0.22 * w && nearSide) || (bw >= 0.6 * w && bh <= 0.22 * h && nearTopBottom);
      if (c.area < minArea || lineLike) continue;
      keep[c.id] = 1; inkPx += c.area;
    }
    if (inkPx < MIN_INK * n) return { empty: true, ink: inkPx / n };

    // Caja de la tinta que se queda y área a escalar.
    let minx = w, maxx = 0, miny = h, maxy = 0;
    for (const c of comps) if (keep[c.id]) {
      if (c.minx < minx) minx = c.minx; if (c.maxx > maxx) maxx = c.maxx;
      if (c.miny < miny) miny = c.miny; if (c.maxy > maxy) maxy = c.maxy;
    }
    const bw = maxx - minx + 1, bh = maxy - miny + 1;
    const f = BOX / Math.max(bw, bh);
    const tw = Math.max(1, Math.round(bw * f)), th = Math.max(1, Math.round(bh * f));
    // Reducción por promedio de área, usando solo los píxeles de componentes que se conservan.
    const small = new Float32Array(tw * th);
    for (let ty = 0; ty < th; ty++) {
      const y0 = miny + ty / f, y1 = miny + (ty + 1) / f;
      for (let tx = 0; tx < tw; tx++) {
        const x0 = minx + tx / f, x1 = minx + (tx + 1) / f;
        let sum = 0, cnt = 0;
        for (let y = Math.floor(y0); y < Math.ceil(y1) && y < h; y++) {
          for (let x = Math.floor(x0); x < Math.ceil(x1) && x < w; x++) {
            cnt++;
            if (keep[label[y * w + x]] || (label[y * w + x] === 0 && nearKept(label, keep, x, y, w, h))) sum += soft[y * w + x];
          }
        }
        small[ty * tw + tx] = cnt ? sum / cnt : 0;
      }
    }
    // Se normaliza el brillo (el trazo más fuerte vale 1) y se centra por masa en 28x28, como MNIST.
    let mx = 0, mass = 0, cx = 0, cy = 0;
    for (let i = 0; i < small.length; i++) if (small[i] > mx) mx = small[i];
    if (mx <= 0) return { empty: true, ink: 0 };
    for (let i = 0; i < small.length; i++) small[i] = Math.min(1, small[i] / mx);
    for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) { const v = small[y * tw + x]; mass += v; cx += v * x; cy += v * y; }
    cx /= mass; cy /= mass;
    const offX = Math.round(SIZE / 2 - cx - 0.5), offY = Math.round(SIZE / 2 - cy - 0.5);
    const vec = new Float32Array(SIZE * SIZE);
    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        const X = x + offX, Y = y + offY;
        if (X >= 0 && X < SIZE && Y >= 0 && Y < SIZE) vec[Y * SIZE + X] = small[y * tw + x];
      }
    }
    return { empty: false, vec, ink: inkPx / n };
  }

  // Un píxel sin etiqueta pero pegado a tinta conservada (el borde suave del trazo) también cuenta.
  function nearKept(label, keep, x, y, w, h) {
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const X = x + dx, Y = y + dy;
      if (X >= 0 && X < w && Y >= 0 && Y < h && keep[label[Y * w + X]]) return true;
    }
    return false;
  }

  // Lee un casillero. `conf` es la probabilidad del dígito elegido; `alt`, el segundo candidato.
  function readCell(crop) {
    const prep = prepare(crop);
    if (prep.empty) return { ch: '', empty: true, uncertain: false, conf: 0, alt: '' };
    const p = classify(prep.vec);
    let a = 0, b = -1;
    for (let i = 1; i < p.length; i++) if (p[i] > p[a]) a = i;
    for (let i = 0; i < p.length; i++) if (i !== a && (b < 0 || p[i] > p[b])) b = i;
    const sure = p[a] >= SURE && p[a] - p[b] >= GAP;
    return { ch: String(a), empty: false, uncertain: !sure, conf: Math.round(p[a] * 1000) / 1000, alt: String(b) };
  }

  // Lee todos los casilleros de la hoja. `crop(rect, ppm)` recorta una zona de la hoja (en mm) de la foto.
  // Los registros pueden tener menos dígitos que casilleros (6 o 7 en 7 casilleros): los casilleros vacíos de los
  // extremos son normales y no se cuentan. Un vacío ENTRE dígitos sí es un dato que falta («?»).
  // opts.minDigits: cuántos dígitos se esperan como mínimo (por defecto, uno menos que casilleros).
  function readRegistro(regBoxes, crop, opts) {
    const cells = [];
    for (let i = 0; i < regBoxes.n; i++) {
      const rect = {
        x: regBoxes.x + i * regBoxes.pitch + MARGIN, y: regBoxes.y + MARGIN,
        w: regBoxes.w - 2 * MARGIN, h: regBoxes.h - 2 * MARGIN,
      };
      cells.push(readCell(crop(rect, PPM)));
    }
    const minDigits = opts && opts.minDigits != null ? opts.minDigits : Math.max(1, regBoxes.n - 1);
    let lo = 0, hi = cells.length - 1;
    while (lo <= hi && cells[lo].empty) lo++;
    while (hi >= lo && cells[hi].empty) hi--;
    const read = cells.slice(lo, hi + 1); // lo que queda sin los vacíos de los extremos
    return {
      cells,
      read,
      // Vacíos entre dígitos: «?». Los dudosos conservan su mejor dígito (se resaltan en pantalla).
      text: read.map((c) => (c.empty ? '?' : c.ch)).join(''),
      complete: read.length >= minDigits && read.every((c) => !c.empty),
      sure: read.length >= minDigits && read.every((c) => !c.empty && !c.uncertain),
    };
  }

  return { readRegistro, readCell, prepare, classify, constants: { SIZE, BOX, PPM, MARGIN, SURE, GAP } };
});
