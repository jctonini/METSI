// Identificación de alumnos: qué hojas no tienen datos suficientes y cuáles pueden estar repetidas.
//
// Reglas:
//  - Cada hoja necesita nombre O registro. La modalidad es opcional.
//  - Mismo registro (con el mismo nombre, con otro nombre o sin nombre en alguna): conflicto que
//    frena hasta que se resuelva ("hard").
//  - Si alguna de las dos hojas no tiene registro, se compara por el dato que tienen en común:
//    mismo nombre => conflicto que frena.
//  - Mismo nombre con registros distintos: solo avisa ("soft"), pueden ser homónimos.
//  - Los nombres se comparan sin distinguir mayúsculas, tildes, signos ni espacios de más.
//  - Un conflicto se da por resuelto cuando se confirmó que son personas distintas
//    (sheet.ack contiene el id de la otra hoja).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiIdentity = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  function normName(s) {
    return String(s == null ? '' : s)
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9ñ]+/g, ' ').trim().replace(/\s+/g, ' ');
  }
  // Se comparan solo letras y números (los separadores no cuentan).
  const normReg = (s) => String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, '');

  const isIdentified = (sheet) => !!(normName(sheet.nombre) || normReg(sheet.registro));

  // Tipo de coincidencia entre dos hojas, o null si no hay.
  const pairKind = (a, b) => kindOf(normReg(a.registro), normName(a.nombre), normReg(b.registro), normName(b.nombre));
  // Igual que pairKind pero con registro y nombre ya normalizados (analyze los normaliza una sola vez por hoja).
  function kindOf(ra, na, rb, nb) {
    if (ra && rb) {
      if (ra === rb) {
        if (na && nb) return na === nb ? 'same-data' : 'same-reg-diff-name';
        return 'same-reg';
      }
      return na && nb && na === nb ? 'same-name-diff-reg' : null;
    }
    if (na && nb && na === nb) return 'same-name-incomplete';
    return null;
  }

  const isHard = (kind) => !!kind && kind !== 'same-name-diff-reg';
  const acked = (a, b) => (a.ack || []).includes(b.id) || (b.ack || []).includes(a.id);

  function analyze(sheets) {
    const list = sheets.filter((s) => !s.failed);
    const norm = list.map((s) => ({ r: normReg(s.registro), n: normName(s.nombre) }));
    const missing = list.filter((s, i) => !(norm[i].n || norm[i].r));
    const hard = [], soft = [];
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const kind = kindOf(norm[i].r, norm[i].n, norm[j].r, norm[j].n);
        if (!kind) continue;
        if (isHard(kind)) { if (!acked(list[i], list[j])) hard.push({ a: list[i], b: list[j], kind }); }
        else soft.push({ a: list[i], b: list[j], kind });
      }
    }
    return { missing, hard, soft };
  }

  // Conflictos (sin resolver) que involucran a una hoja concreta.
  // `an` (opcional) es un análisis ya calculado de las mismas hojas; evita repetirlo.
  const conflictsFor = (sheet, sheets, an) => (an || analyze(sheets)).hard
    .filter((c) => c.a.id === sheet.id || c.b.id === sheet.id)
    .map((c) => ({ other: c.a.id === sheet.id ? c.b : c.a, kind: c.kind }));

  const softFor = (sheet, sheets, an) => (an || analyze(sheets)).soft
    .filter((c) => c.a.id === sheet.id || c.b.id === sheet.id)
    .map((c) => ({ other: c.a.id === sheet.id ? c.b : c.a, kind: c.kind }));

  // Hash rápido (cyrb53) de los bytes de un archivo, para detectar la misma foto cargada dos veces.
  function hashBytes(bytes) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < bytes.length; i++) {
      const ch = bytes[i];
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0') + '-' + bytes.length;
  }

  return { normName, normReg, isIdentified, pairKind, isHard, analyze, conflictsFor, softFor, hashBytes };
});
