// Exportación a texto tabular (CSV para descargar, TSV para pegar en Excel / Sheets).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiCsv = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  function cell(v, sep) {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return s.includes(sep) || /["\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  // sep: ';' (Excel en español) | ',' (Google Sheets / Excel en inglés) | '\t'
  function toDelimited(rows, sep) {
    return rows.map((r) => r.map((v) => cell(v, sep)).join(sep)).join('\r\n') + '\r\n';
  }

  // Excel en configuración regional hispana espera ';' y usa coma decimal.
  const round3 = (n) => Math.round(Number(n) * 1000) / 1000;
  // Hasta 3 decimales (sin ceros de más); con coma decimal si `decimalComma`.
  function formatNumber(n, decimalComma) {
    const s = String(round3(n));
    return decimalComma ? s.replace('.', ',') : s;
  }

  return { toDelimited, formatNumber, round3 };
});
