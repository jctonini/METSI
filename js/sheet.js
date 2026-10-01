// Genera la hoja de respuestas como SVG (A4, unidades en mm) lista para imprimir.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiSheet = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function sheetSVG(L) {
    const o = [];
    const text = (x, y, s, size, extra) =>
      o.push(`<text x="${x}" y="${y}" font-size="${size}" ${extra || ''}>${esc(s)}</text>`);
    const line = (x1, y1, x2, y2, w) =>
      o.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000" stroke-width="${w || 0.3}"/>`);

    o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.page.w} ${L.page.h}" width="${L.page.w}mm" height="${L.page.h}mm" font-family="Arial, Helvetica, sans-serif" fill="#000">`);
    o.push(`<rect width="${L.page.w}" height="${L.page.h}" fill="#fff"/>`);

    // Marcas de esquina y barra de orientación
    const s = L.markerSize;
    for (const m of L.markers) o.push(`<rect x="${m.x - s / 2}" y="${m.y - s / 2}" width="${s}" height="${s}"/>`);
    const b = L.orientationBar;
    o.push(`<rect x="${b.x - b.w / 2}" y="${b.y - b.h / 2}" width="${b.w}" height="${b.h}"/>`);

    // Encabezado
    text(105, 26, L.title || 'Hoja de respuestas', 5, 'text-anchor="middle" font-weight="bold"');
    text(24, 36, 'Nombre y apellido:', 3.4);
    line(56, 36.2, 140, 36.2);
    text(146, 36, 'Fecha:', 3.4);
    line(158, 36.2, 188, 36.2);

    // Número de registro
    text(24, L.reg.labelY, 'Número de registro', 3.6, 'font-weight="bold"');
    const bw = 6.4, bh = 7;
    L.reg.cols.forEach((x) => {
      o.push(`<rect x="${x - bw / 2}" y="${L.reg.boxY - 1}" width="${bw}" height="${bh}" fill="none" stroke="#000" stroke-width="0.3"/>`);
    });
    L.reg.rows.forEach((y, d) => text(L.reg.rowLabelX, y + 1.2, d, 3.4, 'text-anchor="middle"'));

    // Modalidad
    if (L.mod.items.length) {
      text(L.mod.x - 4, L.mod.labelY, 'Modalidad de cursada', 3.6, 'font-weight="bold"');
      L.mod.items.forEach((it) => text(L.mod.textX, it.y + 1.2, it.name, 3.4));
    }

    // Respuestas
    text(24, L.ans.labelY, 'Respuestas', 3.6, 'font-weight="bold"');
    L.ans.cols.forEach((c) => {
      for (let o2 = 0; o2 < L.numOptions; o2++) {
        text(c.optX0 + o2 * L.ans.optPitch, L.ans.headerY, L.letters[o2], 3.4, 'text-anchor="middle"');
      }
      for (let q = c.qStart; q < c.qEnd; q++) {
        text(c.numX + 7, L.ans.firstRowY + (q - c.qStart) * L.ans.rowPitch + 1.2, q + 1, 3.4, 'text-anchor="end"');
      }
    });

    // Burbujas
    for (const bb of L.bubbles) {
      o.push(`<circle cx="${bb.x}" cy="${bb.y}" r="${L.r}" fill="none" stroke="#000" stroke-width="0.35"/>`);
    }

    text(105, 272, 'Marcá con birome o lápiz oscuro, rellenando por completo el círculo. Pueden marcarse varias opciones si la pregunta lo permite.', 2.6, 'text-anchor="middle"');
    o.push('</svg>');
    return o.join('\n');
  }

  return { sheetSVG };
});
