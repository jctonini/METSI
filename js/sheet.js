// Genera la hoja de respuestas como SVG (A5, unidades en mm) lista para imprimir.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiSheet = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const estWidth = (s, size, bold) => String(s).length * size * (bold ? 0.6 : 0.55);

  // Parte un texto en líneas que entren en `maxW` mm (máximo `maxLines`; el resto se comprime en la última).
  function wrap(text, size, maxW, maxLines) {
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let cur = '';
    for (const w of words) {
      const next = cur ? cur + ' ' + w : w;
      if (cur && estWidth(next, size) > maxW && lines.length < maxLines - 1) { lines.push(cur); cur = w; } else cur = next;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function sheetSVG(L) {
    const o = [];
    // Si el texto es más largo que el espacio disponible, se comprime para que no pise nada.
    const text = (x, y, s, size, extra, maxW) => {
      const bold = /bold/.test(extra || '');
      const fit = maxW && estWidth(s, size, bold) > maxW ? ` textLength="${maxW}" lengthAdjust="spacingAndGlyphs"` : '';
      o.push(`<text x="${x}" y="${y}" font-size="${size}" ${extra || ''}${fit}>${esc(s)}</text>`);
    };
    const T = L.texts;
    const H = L.header;
    const v2 = L.version >= 2;

    o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.page.w} ${L.page.h}" width="${L.page.w}mm" height="${L.page.h}mm" font-family="Arial, Helvetica, sans-serif" fill="#000">`);
    o.push(`<rect width="${L.page.w}" height="${L.page.h}" fill="#fff"/>`);

    // Marcas de esquina y barra de orientación
    const s = L.markerSize;
    for (const m of L.markers) o.push(`<rect x="${m.x - s / 2}" y="${m.y - s / 2}" width="${s}" height="${s}"/>`);
    const b = L.orientationBar;
    o.push(`<rect x="${b.x - b.w / 2}" y="${b.y - b.h / 2}" width="${b.w}" height="${b.h}"/>`);

    // Encabezado: nombre y registro se escriben a mano
    const lr = L.logoRect;
    const hasLogo = !!T.logo;
    if (hasLogo) {
      o.push(`<image href="${esc(T.logo)}" x="${lr.x}" y="${lr.y}" width="${lr.w}" height="${lr.h}" preserveAspectRatio="xMidYMid meet"/>`);
    }
    const hx0 = hasLogo ? 42 : 16, hx1 = 132;
    const hc = (hx0 + hx1) / 2;
    text(hc, T.subtitle ? H.titleYWithSubtitle : H.titleY, T.title, 4.6, 'text-anchor="middle" font-weight="bold"', hx1 - hx0);
    if (T.subtitle) text(hc, H.subtitleY, T.subtitle, 3, 'text-anchor="middle"', hx1 - hx0);
    text(16, H.nameLabelY, T.nameLabel, 3.2, '', 24);
    o.push(`<line x1="42" y1="${H.nameLineY}" x2="132" y2="${H.nameLineY}" stroke="#000" stroke-width="0.3"/>`);

    text(16, H.regLabelY, T.regLabel, 3.2, '', L.fields.regBoxes.x - 18);
    const rb = L.fields.regBoxes;
    for (let i = 0; i < rb.n; i++) {
      o.push(`<rect x="${rb.x + i * rb.pitch}" y="${rb.y}" width="${rb.w}" height="${rb.h}" fill="none" stroke="#000" stroke-width="0.3"/>`);
    }

    // Modalidad (y fecha, a la derecha, en la misma línea)
    if (L.mod.items.length) {
      text(16, L.mod.labelY, T.modLabel, 3.2, 'font-weight="bold"', v2 ? 70 : 116);
      L.mod.items.forEach((it) => text(it.textX, it.y + 1.1, it.name, 3.2));
    }
    if (v2) {
      const d = L.date;
      text(d.x, d.y, 'Fecha:', 3.2);
      text(d.daySlash, d.y, '/', 3.2, 'text-anchor="middle"');
      text(d.monthSlash, d.y, '/', 3.2, 'text-anchor="middle"');
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

    // Pie
    const cx = L.page.w / 2;
    if (v2) {
      text(cx, 195.2, T.instructions, 2.4, 'text-anchor="middle"', 112);
      wrap(T.legal, 2.2, 112, 2).forEach((ln, i) => text(cx, 198.3 + i * 2.6, ln, 2.2, 'text-anchor="middle"', 112));
      // Código de versión (cuadraditos) y el número en texto
      for (const bit of L.versionBits) {
        if (bit.on) o.push(`<rect x="${bit.x - bit.size / 2}" y="${bit.y - bit.size / 2}" width="${bit.size}" height="${bit.size}"/>`);
      }
      const last = L.versionBits[L.versionBits.length - 1];
      text(last.x + 5, 204.6, 'V' + L.version, 3, 'font-weight="bold"');
    } else {
      text(cx, 195.5, T.instructions, 2.4, 'text-anchor="middle"', 100);
    }
    o.push('</svg>');
    return o.join('\n');
  }

  return { sheetSVG, wrap };
});
