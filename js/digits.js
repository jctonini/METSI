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
    // Un casillero tachado con una X (alumnos que escriben 6 dígitos en 7 casilleros) o con una raya no tiene dígito:
    // cuenta como vacío (si no, la red lo lee como un 8, un 4 o un 7).
    if (isCrossedOut(label, keep, minx, miny, bw, bh, w, h) || isDash(bw, bh, w, h)) return { empty: true, ink: inkPx / n, crossed: true };
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

  // X: un trazo recto por cada diagonal de la caja de la tinta y los cuatro puntos medios de los bordes VACÍOS (los brazos
  // de la X van a las esquinas). Ningún dígito cumple las dos cosas: el 2, el 8, el 0, el 7... tocan algún punto medio.
  function isCrossedOut(label, keep, minx, miny, bw, bh, w, h) {
    if (bw < 0.7 * w || bh < 0.7 * h) return false;
    const ink = (x0, y0, x1, y1) => {
      let c = 0, n = 0;
      for (let y = Math.round(y0); y < Math.round(y1); y++) for (let x = Math.round(x0); x < Math.round(x1); x++) { n++; if (keep[label[y * w + x]]) c++; }
      return n ? c / n : 0;
    };
    const mid = 0.06;
    const midEdgesEmpty = ink(minx + 0.4 * bw, miny, minx + 0.6 * bw, miny + 0.15 * bh) < mid
      && ink(minx + 0.4 * bw, miny + 0.85 * bh, minx + 0.6 * bw, miny + bh) < mid
      && ink(minx, miny + 0.4 * bh, minx + 0.15 * bw, miny + 0.6 * bh) < mid
      && ink(minx + 0.85 * bw, miny + 0.4 * bh, minx + bw, miny + 0.6 * bh) < mid;
    if (!midEdgesEmpty) return false;
    const r = Math.max(2, Math.round(0.07 * Math.min(bw, bh)));
    const inked = (cx, cy) => {
      for (let y = Math.max(0, cy - r); y <= Math.min(h - 1, cy + r); y++) for (let x = Math.max(0, cx - r); x <= Math.min(w - 1, cx + r); x++) if (keep[label[y * w + x]]) return true;
      return false;
    };
    let d1 = 0, d2 = 0; const N = 24;
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      if (inked(Math.round(minx + t * (bw - 1)), Math.round(miny + t * (bh - 1)))) d1++;
      if (inked(Math.round(minx + (1 - t) * (bw - 1)), Math.round(miny + t * (bh - 1)))) d2++;
    }
    return d1 >= 0.7 * (N + 1) && d2 >= 0.7 * (N + 1);
  }
  // Raya horizontal: muy ancha y muy baja.
  function isDash(bw, bh, w, h) { return bw >= 0.5 * w && bh <= 0.16 * h; }

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

  // ---------- ubicar el casillero impreso ----------
  // Con la foto sacada con el celular el casillero impreso sale corrido y torcido (hasta ~3 mm) respecto de donde
  // lo calcula la geometría de la hoja, y el recorte le corta el dibujo al dígito (un 9 cortado parece un 4 o un 2).
  // Se busca el marco impreso en una ventana más grande: el desplazamiento donde las cuatro líneas del marco son
  // más oscuras que el papel que tienen al lado.
  const SEARCH = 3;           // mm que se busca hacia cada lado
  const STEP = 2;             // px entre posiciones probadas (0,2 mm)
  const LINE_MIN = 18;        // oscurecimiento mínimo (0-255) del marco para fiarse de la posición encontrada

  // `win`: recorte gris de la ventana; (fx, fy) es el marco esperado dentro de la ventana, en px; (fw, fh) su tamaño.
  function locateFrame(win, fx, fy, fw, fh) {
    const W = win.width, H = win.height, d = win.data;
    const g = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 255 : d[(y * W + x) * 4]);
    const off = Math.round(0.6 * PPM);
    // oscurecimiento de un punto de la línea frente al papel a ambos lados (perpendicular a la línea)
    const side = (x, y, horiz) => {
      const c = g(x, y);
      const a = horiz ? g(x, y - off) : g(x - off, y), b = horiz ? g(x, y + off) : g(x + off, y);
      return Math.max(0, (a + b) / 2 - c);
    };
    let best = null;
    const R = Math.round(SEARCH * PPM);
    for (let oy = -R; oy <= R; oy += STEP) {
      for (let ox = -R; ox <= R; ox += STEP) {
        let tot = 0, n = 0;
        const x0 = Math.round(fx) + ox, y0 = Math.round(fy) + oy, x1 = x0 + Math.round(fw), y1 = y0 + Math.round(fh);
        for (let t = Math.round(0.15 * fw); t < Math.round(0.85 * fw); t += 2) { tot += side(x0 + t, y0, true) + side(x0 + t, y1, true); n += 2; }
        for (let t = Math.round(0.15 * fh); t < Math.round(0.85 * fh); t += 2) { tot += side(x0, y0 + t, false) + side(x1, y0 + t, false); n += 2; }
        const sc = tot / n;
        if (!best || sc > best.sc) best = { sc, ox, oy };
      }
    }
    return best && best.sc >= LINE_MIN ? best : null;
  }

  // Recorta de `win` el rectángulo (x, y, w, h) en px, en gris RGBA.
  function subCrop(win, x, y, w, h) {
    const out = new Uint8ClampedArray(w * h * 4);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const X = x + i, Y = y + j;
      const v = X < 0 || Y < 0 || X >= win.width || Y >= win.height ? 255 : win.data[(Y * win.width + X) * 4];
      const k = (j * w + i) * 4; out[k] = out[k + 1] = out[k + 2] = v; out[k + 3] = 255;
    }
    return { width: w, height: h, data: out };
  }

  // Recorte del interior del casillero `i`, ya con el marco impreso ubicado (ver arriba).
  function cellCrop(regBoxes, i, crop) {
    const bx = regBoxes.x + i * regBoxes.pitch, by = regBoxes.y;
    // Ventana más grande que el casillero, para encontrar el marco impreso aunque salga corrido.
    const win = crop({ x: bx - SEARCH, y: by - SEARCH, w: regBoxes.w + 2 * SEARCH, h: regBoxes.h + 2 * SEARCH }, PPM);
    const loc = locateFrame(win, SEARCH * PPM, SEARCH * PPM, regBoxes.w * PPM, regBoxes.h * PPM);
    const dx = loc ? loc.ox : 0, dy = loc ? loc.oy : 0;
    const m = Math.round(MARGIN * PPM);
    return subCrop(win, Math.round(SEARCH * PPM) + dx + m, Math.round(SEARCH * PPM) + dy + m,
      Math.round(regBoxes.w * PPM) - 2 * m, Math.round(regBoxes.h * PPM) - 2 * m);
  }

  // Lee todos los casilleros de la hoja. `crop(rect, ppm)` recorta una zona de la hoja (en mm) de la foto.
  // Los registros pueden tener menos dígitos que casilleros (6 o 7 en 7 casilleros): los casilleros vacíos de los
  // extremos son normales y no se cuentan. Un vacío ENTRE dígitos sí es un dato que falta («?»).
  // opts.minDigits: cuántos dígitos se esperan como mínimo (por defecto, uno menos que casilleros).
  function readRegistro(regBoxes, crop, opts) {
    const cells = [];
    for (let i = 0; i < regBoxes.n; i++) cells.push(readCell(cellCrop(regBoxes, i, crop)));
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

  return { readRegistro, readCell, cellCrop, prepare, classify, constants: { SIZE, BOX, PPM, MARGIN, SURE, GAP } };
});
