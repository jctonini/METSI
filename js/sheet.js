// Genera la hoja de respuestas como SVG (A5, unidades en mm) lista para imprimir.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiSheet = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function sheetSVG(L) {
    const o = [];
    const text = (x, y, s, size, extra) =>
      o.push(`<text x="${x}" y="${y}" font-size="${size}" ${extra || ''}>${esc(s)}</text>`);

    o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.page.w} ${L.page.h}" width="${L.page.w}mm" height="${L.page.h}mm" font-family="Arial, Helvetica, sans-serif" fill="#000">`);
    o.push(`<rect width="${L.page.w}" height="${L.page.h}" fill="#fff"/>`);

    // Marcas de esquina y barra de orientación
    const s = L.markerSize;
    for (const m of L.markers) o.push(`<rect x="${m.x - s / 2}" y="${m.y - s / 2}" width="${s}" height="${s}"/>`);
    const b = L.orientationBar;
    o.push(`<rect x="${b.x - b.w / 2}" y="${b.y - b.h / 2}" width="${b.w}" height="${b.h}"/>`);

    // Encabezado: nombre y registro se escriben a mano
    text(L.page.w / 2, 22, L.title || 'Hoja de respuestas', 4.6, 'text-anchor="middle" font-weight="bold"');
    text(16, 30, 'Nombre y apellido:', 3.2);
    o.push(`<line x1="42" y1="30.3" x2="132" y2="30.3" stroke="#000" stroke-width="0.3"/>`);

    text(16, 43, 'N° de registro:', 3.2);
    const rb = L.fields.regBoxes;
    for (let i = 0; i < rb.n; i++) {
      o.push(`<rect x="${rb.x + i * rb.pitch}" y="${rb.y}" width="${rb.w}" height="${rb.h}" fill="none" stroke="#000" stroke-width="0.3"/>`);
    }

    // Modalidad
    if (L.mod.items.length) {
      text(16, L.mod.labelY, 'Modalidad de cursada (marcá una)', 3.2, 'font-weight="bold"');
      L.mod.items.forEach((it) => text(it.textX, it.y + 1.1, it.name, 3.2));
    }

    // Respuestas
    text(16, L.ans.labelY, 'Respuestas', 3.2, 'font-weight="bold"');
    L.ans.cols.forEach((c) => {
      for (let k = 0; k < L.numOptions; k++) {
        text(c.optX0 + k * L.ans.optPitch, L.ans.headerY, L.letters[k], 3.1, 'text-anchor="middle"');
      }
      for (let q = c.qStart; q < c.qEnd; q++) {
        text(c.numX + 7, L.ans.firstRowY + (q - c.qStart) * L.ans.rowPitch + 1.1, q + 1, 3.1, 'text-anchor="end"');
      }
    });

    // Burbujas
    for (const bb of L.bubbles) {
      o.push(`<circle cx="${bb.x}" cy="${bb.y}" r="${L.r}" fill="none" stroke="#000" stroke-width="0.35"/>`);
    }

    text(L.page.w / 2, 195.5, 'Rellená por completo el círculo con birome o lápiz oscuro.', 2.4, 'text-anchor="middle"');
    o.push('</svg>');
    return o.join('\n');
  }

  return { sheetSVG };
});
