// Parecido de letra entre dos hojas: sirve para avisar cuando se fotografió dos veces el mismo papel.
//
// De cada foto se guarda una "firma": el mapa de tinta (manuscrita) de los casilleros del registro
// y, en la v2, de la zona del nombre. Las partes impresas (bordes de los casilleros, línea del nombre,
// encabezado) quedan afuera, porque son iguales en todas las hojas y harían parecer todo idéntico.
// Dos fotos del mismo papel dan mapas casi iguales (con un pequeño corrimiento); dos alumnos
// distintos no.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiSimilar = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const PPM = 4; // píxeles por mm de los recortes usados
  const SIMILAR_THRESHOLD = 0.55;
  const MIN_INK_REG = 25, MIN_INK_NAME = 60;

  // ---------- tinta ----------
  function inkBits(img) {
    const { width: w, height: h, data } = img;
    const gray = new Uint8Array(w * h);
    for (let i = 0, p = 0; i < gray.length; i++, p += 4) gray[i] = (299 * data[p] + 587 * data[p + 1] + 114 * data[p + 2]) / 1000;
    const sorted = Array.from(gray).sort((a, b) => a - b);
    const paper = Math.max(40, sorted[Math.floor(sorted.length * 0.9)]);
    const bits = new Uint8Array(w * h);
    for (let i = 0; i < bits.length; i++) bits[i] = 1 - gray[i] / paper > 0.22 ? 1 : 0;
    return { bits, w, h };
  }

  // ---------- empaquetado (para guardar la firma en JSON) ----------
  function b64enc(bytes) {
    let s = '';
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return typeof btoa === 'function' ? btoa(s) : Buffer.from(s, 'binary').toString('base64');
  }
  function b64dec(str) {
    const s = typeof atob === 'function' ? atob(str) : Buffer.from(str, 'base64').toString('binary');
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }
  function pack(bits) {
    const bytes = new Uint8Array(Math.ceil(bits.length / 8));
    for (let i = 0; i < bits.length; i++) if (bits[i]) bytes[i >> 3] |= 1 << (i & 7);
    return b64enc(bytes);
  }
  function unpack(str, len) {
    const bytes = b64dec(str);
    const bits = new Uint8Array(len);
    for (let i = 0; i < len; i++) bits[i] = (bytes[i >> 3] >> (i & 7)) & 1;
    return bits;
  }
  const count = (bits) => { let n = 0; for (let i = 0; i < bits.length; i++) n += bits[i]; return n; };

  // Arma una firma a partir de mapas ya calculados (también la usan las pruebas).
  function makeSignature(reg, name) {
    return {
      v: 1,
      reg: reg ? { n: reg.n, w: reg.w, h: reg.h, ink: count(reg.bits), bits: pack(reg.bits) } : null,
      name: name ? { w: name.w, h: name.h, ink: count(name.bits), bits: pack(name.bits) } : null,
    };
  }

  // cropFn(rect, pxPorMm) => { width, height, data } enderezado. layout: el de la versión de la hoja.
  function signature(cropFn, layout) {
    const rb = layout.fields.regBoxes;
    const parts = [];
    let bw = 0, bh = 0;
    for (let i = 0; i < rb.n; i++) {
      const rect = { x: rb.x + i * rb.pitch + 1.2, y: rb.y + 1.2, w: rb.w - 2.4, h: rb.h - 2.4 };
      const m = inkBits(cropFn(rect, PPM));
      bw = m.w; bh = m.h;
      parts.push(m.bits);
    }
    const all = new Uint8Array(parts.length * bw * bh);
    parts.forEach((p, i) => all.set(p, i * bw * bh));
    const reg = { n: rb.n, w: bw, h: bh, bits: all };
    // Solo la v2 tiene una zona de nombre sin partes impresas.
    let name = null;
    if (layout.version >= 2) {
      const m = inkBits(cropFn(layout.fields.name, PPM));
      name = { w: m.w, h: m.h, bits: m.bits };
    }
    return makeSignature(reg, name);
  }


  // Reduce un recorte gris RGBA a (tw x th) promediando área; devuelve un objeto como el de cropFn.
  function shrink(img, x0, y0, w, h, tw, th) {
    const data = new Uint8ClampedArray(tw * th * 4);
    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        const xa = x0 + Math.floor((x * w) / tw), xb = Math.max(xa + 1, x0 + Math.floor(((x + 1) * w) / tw));
        const ya = y0 + Math.floor((y * h) / th), yb = Math.max(ya + 1, y0 + Math.floor(((y + 1) * h) / th));
        let sum = 0, n = 0;
        for (let yy = ya; yy < yb && yy < img.height; yy++) for (let xx = xa; xx < xb && xx < img.width; xx++) { sum += img.data[(yy * img.width + xx) * 4]; n++; }
        const k = (y * tw + x) * 4;
        data[k] = data[k + 1] = data[k + 2] = n ? sum / n : 255; data[k + 3] = 255;
      }
    }
    return { width: tw, height: th, data };
  }

  // Firma con los recortes que la app ya ubicó sobre lo impreso (v2): `cells` = interior de cada casillero a 10 px/mm y
  // `nameImg` = recorte del nombre enderezado sobre su línea (a 10 px/mm, con la línea a `lineRow` filas del borde de arriba).
  // Con las ventanas fijas de la v1, el papel corrido hacía caer la ventana sobre las líneas y los casilleros impresos (iguales
  // en todas las hojas): 163 de 435 pares de hojas distintas daban «parecido» >= 0,55.
  // Del nombre solo se toma la banda de escritura, sin la línea ni la etiqueta ni el subtítulo impresos.
  function signatureFromCrops(cells, nameImg, lineRow, regBox) {
    const tw = Math.round((regBox.w - 2.4) * PPM), th = Math.round((regBox.h - 2.4) * PPM);
    const parts = cells.map((c) => inkBits(shrink(c, 0, 0, c.width, c.height, tw, th)).bits);
    const all = new Uint8Array(parts.length * tw * th);
    parts.forEach((p, i) => all.set(p, i * tw * th));
    let name = null;
    if (nameImg) {
      const x0 = 320, w = Math.max(1, nameImg.width - x0 - 40); // de 48 a 132 mm
      const y0 = Math.max(0, lineRow - 80), y1 = Math.max(y0 + 1, lineRow - 12);    // de 8 a 1,2 mm arriba de la línea
      const m = inkBits(shrink(nameImg, x0, y0, w, y1 - y0, Math.round((w * PPM) / 10), Math.round(((y1 - y0) * PPM) / 10)));
      name = { w: m.w, h: m.h, bits: m.bits };
    }
    const sig = makeSignature({ n: parts.length, w: tw, h: th, bits: all }, name);
    sig.v = 2;
    return sig;
  }

  // ---------- comparación ----------
  function blur(bits, w, h) {
    const out = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let s = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx, yy = y + dy;
            if (xx >= 0 && yy >= 0 && xx < w && yy < h) { s += bits[yy * w + xx]; n++; }
          }
        }
        out[y * w + x] = s / n;
      }
    }
    return out;
  }

  // Correlación (Pearson) entre dos conjuntos de mapas, probando pequeños corrimientos.
  function bestCorrelation(mapsA, mapsB, w, h, maxDx, maxDy) {
    let best = -1;
    for (let dy = -maxDy; dy <= maxDy; dy++) {
      for (let dx = -maxDx; dx <= maxDx; dx++) {
        let n = 0, sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
        for (let k = 0; k < mapsA.length; k++) {
          const A = mapsA[k], B = mapsB[k];
          for (let y = Math.max(0, -dy); y < Math.min(h, h - dy); y++) {
            for (let x = Math.max(0, -dx); x < Math.min(w, w - dx); x++) {
              const a = A[y * w + x], b = B[(y + dy) * w + (x + dx)];
              n++; sa += a; sb += b; saa += a * a; sbb += b * b; sab += a * b;
            }
          }
        }
        const den = Math.sqrt((n * saa - sa * sa) * (n * sbb - sb * sb));
        if (den > 0) best = Math.max(best, (n * sab - sa * sb) / den);
      }
    }
    return best;
  }

  // Los mapas desenfocados de cada firma se calculan una sola vez (antes se decodificaban y desenfocaban en cada par).
  const mapsCache = new WeakMap();
  const maps = (part, n) => {
    let m = mapsCache.get(part);
    if (!m) {
      const len = part.w * part.h;
      const bits = unpack(part.bits, len * n);
      const full = Array.from({ length: n }, (_, k) => blur(bits.subarray(k * len, (k + 1) * len), part.w, part.h));
      m = { full, coarse: null };
      mapsCache.set(part, m);
    }
    return m;
  };

  // Versión a mitad de resolución (promedio de 2x2) para descartar rápido los pares claramente distintos.
  function halve(map, w, h) {
    const cw = w >> 1, ch = h >> 1, out = new Float32Array(cw * ch);
    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        out[y * cw + x] = (map[2 * y * w + 2 * x] + map[2 * y * w + 2 * x + 1] + map[(2 * y + 1) * w + 2 * x] + map[(2 * y + 1) * w + 2 * x + 1]) / 4;
      }
    }
    return out;
  }
  const coarseMaps = (part, n) => {
    const m = maps(part, n);
    if (!m.coarse) m.coarse = m.full.map((f) => halve(f, part.w, part.h));
    return m.coarse;
  };

  // Si a mitad de resolución el parecido del nombre es menor que esto, no hace falta la búsqueda completa:
  // el umbral de «misma hoja» es 0,55 (v1) o 0,75 (v2) y una misma hoja da >= 0,9 también a mitad de resolución.
  const COARSE_REJECT = 0.4;

  // Devuelve { reg, name, score } con valores entre -1 y 1 (null si no hay tinta suficiente para comparar).
  // Con `opts.exact` siempre hace la búsqueda completa (sirve para comprobar que el atajo no cambia el veredicto).
  function compare(a, b, opts) {
    let reg = null, name = null;
    if (a && b && a.reg && b.reg && a.reg.n === b.reg.n && a.reg.w === b.reg.w && a.reg.h === b.reg.h && a.reg.ink >= MIN_INK_REG && b.reg.ink >= MIN_INK_REG) {
      reg = bestCorrelation(maps(a.reg, a.reg.n).full, maps(b.reg, b.reg.n).full, a.reg.w, a.reg.h, 3, 3);
    }
    if (a && b && a.name && b.name && a.name.w === b.name.w && a.name.h === b.name.h && a.name.ink >= MIN_INK_NAME && b.name.ink >= MIN_INK_NAME) {
      const { w, h } = a.name;
      const coarse = !(opts && opts.exact) && w >= 8 && h >= 8
        ? bestCorrelation(coarseMaps(a.name, 1), coarseMaps(b.name, 1), w >> 1, h >> 1, 3, 2) : null;
      name = coarse !== null && coarse < COARSE_REJECT
        ? coarse
        : bestCorrelation(maps(a.name, 1).full, maps(b.name, 1).full, w, h, 6, 3);
    }
    const vals = [reg, name].filter((v) => v !== null);
    return { reg, name, score: vals.length ? Math.max(...vals) : null };
  }

  // Umbral de «parece la misma hoja»: las firmas v2 (recortes ubicados) separan mucho mejor (distintas <= 0,64; misma hoja 0,95).
  const thresholdFor = (sig) => (sig && sig.v === 2 ? 0.75 : SIMILAR_THRESHOLD);

  return { signature, signatureFromCrops, thresholdFor, makeSignature, compare, SIMILAR_THRESHOLD, PPM };
});
