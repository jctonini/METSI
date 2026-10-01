// Genera "fotos" sintéticas de una hoja de respuestas (perspectiva, ruido, iluminación despareja)
// para probar el lector sin necesidad de fotos reales.
const { solveHomography, applyH } = require('../js/scanner.js');

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// marks: lista de { x, y, kind: 'fill' | 'cross' | 'light' } en mm de la hoja.
function renderPhoto(layout, marks, opts) {
  opts = opts || {};
  const W = opts.width || 1200, Hh = opts.height || 1600;
  const rand = rng(opts.seed || 1);
  const rot180 = !!opts.rot180;
  const p = layout.page;
  // Esquinas de la hoja en la foto (con deformación).
  const j = opts.jitter == null ? 40 : opts.jitter;
  let corners = [
    { x: 90 + (rand() - 0.5) * j, y: 110 + (rand() - 0.5) * j },
    { x: 1110 + (rand() - 0.5) * j, y: 90 + (rand() - 0.5) * j },
    { x: 70 + (rand() - 0.5) * j, y: 1490 + (rand() - 0.5) * j },
    { x: 1130 + (rand() - 0.5) * j, y: 1510 + (rand() - 0.5) * j },
  ];
  if (rot180) corners = [corners[3], corners[2], corners[1], corners[0]];
  const sheetCorners = [{ x: 0, y: 0 }, { x: p.w, y: 0 }, { x: 0, y: p.h }, { x: p.w, y: p.h }];
  const T = solveHomography(sheetCorners, corners); // hoja -> foto
  const Tinv = solveHomography(corners, sheetCorners); // foto -> hoja

  const base = opts.paper || 232, ink = 28;
  const gray = new Float32Array(W * Hh).fill(base);

  function paint(minX, minY, maxX, maxY, inside) {
    const pts = [applyH(T, minX, minY), applyH(T, maxX, minY), applyH(T, minX, maxY), applyH(T, maxX, maxY)];
    const x0 = Math.max(0, Math.floor(Math.min(...pts.map((q) => q.x))) - 1);
    const x1 = Math.min(W - 1, Math.ceil(Math.max(...pts.map((q) => q.x))) + 1);
    const y0 = Math.max(0, Math.floor(Math.min(...pts.map((q) => q.y))) - 1);
    const y1 = Math.min(Hh - 1, Math.ceil(Math.max(...pts.map((q) => q.y))) + 1);
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const s = applyH(Tinv, x, y);
        if (inside(s.x, s.y)) gray[y * W + x] = ink;
      }
    }
  }

  // Marcas de esquina y barra de orientación.
  const ms = layout.markerSize / 2;
  for (const c of layout.markers) paint(c.x - ms, c.y - ms, c.x + ms, c.y + ms, () => true);
  const b = layout.orientationBar;
  paint(b.x - b.w / 2, b.y - b.h / 2, b.x + b.w / 2, b.y + b.h / 2, () => true);

  // Contorno de todas las burbujas.
  const R = layout.r, lw = 0.17;
  for (const bb of layout.bubbles) {
    paint(bb.x - R - 1, bb.y - R - 1, bb.x + R + 1, bb.y + R + 1, (sx, sy) => {
      const d = Math.hypot(sx - bb.x, sy - bb.y);
      return d > R - lw && d < R + lw;
    });
  }

  // Marcas del alumno.
  for (const m of marks) {
    const ox = (rand() - 0.5) * 0.6, oy = (rand() - 0.5) * 0.6;
    const cx = m.x + ox, cy = m.y + oy;
    if (m.kind === 'cross') {
      paint(cx - R, cy - R, cx + R, cy + R, (sx, sy) => {
        const dx = sx - cx, dy = sy - cy;
        return Math.abs(dx - dy) < 0.45 && Math.abs(dx) < R + 0.4 || Math.abs(dx + dy) < 0.45 && Math.abs(dx) < R + 0.4;
      });
    } else if (m.kind === 'light') {
      paint(cx - R, cy - R, cx + R, cy + R, (sx, sy) => Math.hypot(sx - cx, sy - cy) < 0.75);
    } else {
      paint(cx - R, cy - R, cx + R, cy + R, (sx, sy) => Math.hypot(sx - cx, sy - cy) < R * 0.92);
    }
  }

  // Manchas de "texto" para que haya ruido en la imagen.
  for (let k = 0; k < 40; k++) {
    const sx = 18 + rand() * 110, sy = 14 + rand() * 6;
    paint(sx, sy, sx + 1.5, sy + 0.4, () => true);
  }
  // Tinta extra en zonas indicadas (por ejemplo, escritura a mano), en mm de la hoja.
  for (const r of opts.ink || []) paint(r.x, r.y, r.x + r.w, r.y + r.h, () => true);

  // Desenfoque 3x3, iluminación despareja y ruido.
  const out = new Uint8ClampedArray(W * Hh * 4);
  const light = opts.lighting == null ? 0.28 : opts.lighting;
  for (let y = 0; y < Hh; y++) {
    for (let x = 0; x < W; x++) {
      let sum = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx, yy = y + dy;
          if (xx >= 0 && yy >= 0 && xx < W && yy < Hh) { sum += gray[yy * W + xx]; n++; }
        }
      }
      let v = sum / n;
      v *= 1 - light * (x / W) * 0.6 - light * (y / Hh) * 0.4;
      v += (rand() - 0.5) * (opts.noise == null ? 14 : opts.noise);
      const i = (y * W + x) * 4;
      out[i] = out[i + 1] = out[i + 2] = Math.max(0, Math.min(255, v));
      out[i + 3] = 255;
    }
  }
  return { width: W, height: Hh, data: out };
}

module.exports = { renderPhoto, rng };
