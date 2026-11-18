// Archivo de examen (.json): lo exporta la app y lo importa la app. Es el mismo archivo que tiene que producir la skill que
// arma exámenes, así que el formato está documentado en docs/formato-examen.md.
//
//   { "formato": "metsi-examen", "version": 1, "titulo": "1er Parcial", "preguntas": 20, "opciones": 5, "penalizacion": 0.33,
//     "clave": [ { "correctas": ["B", "D"], "puntos": 5 }, ... ] }
//
// `parse` valida todo y devuelve TODOS los errores juntos (no solo el primero), para corregir el archivo de una vez.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./layout.js'));
  else root.MetsiExamFile = factory(root.MetsiLayout);
})(typeof self !== 'undefined' ? self : this, function (Layout) {
  const { LETTERS } = Layout;
  const FORMAT = 'metsi-examen', VERSION = 1;

  // Arma el archivo desde la configuración y la clave de la app.
  function build(cfg, key) {
    return {
      formato: FORMAT, version: VERSION,
      titulo: cfg.title || '',
      preguntas: cfg.numQuestions, opciones: cfg.numOptions, penalizacion: cfg.penalty,
      clave: key.slice(0, cfg.numQuestions).map((k) => ({ correctas: k.correct.slice().sort((a, b) => a - b).map((i) => LETTERS[i]), puntos: k.points })),
    };
  }

  const isInt = (v) => typeof v === 'number' && Number.isInteger(v);
  const num = (v) => (typeof v === 'string' ? Number(v.replace(',', '.')) : v);

  // `limits.maxQuestions(numOptions)`: cuántas preguntas entran en la hoja con esas opciones (opcional).
  // Devuelve { ok, errors, exam: { title, numQuestions, numOptions, penalty, key: [{correct:[idx], points}] } }.
  function parse(text, limits) {
    const errors = [];
    let d;
    try { d = JSON.parse(String(text).replace(/^﻿/, '')); } catch (e) { return { ok: false, errors: ['El archivo no es un JSON válido: ' + e.message], exam: null }; }
    if (!d || typeof d !== 'object' || Array.isArray(d)) return { ok: false, errors: ['El archivo no tiene el formato de un examen de METSI.'], exam: null };
    if (d.formato !== FORMAT) errors.push(`Falta "formato": "${FORMAT}" (¿es un archivo de examen de METSI?).`);
    if (d.version !== undefined && d.version !== VERSION) errors.push(`La versión ${d.version} del archivo no se conoce (esta app lee la ${VERSION}).`);

    const nq = num(d.preguntas), no = num(d.opciones);
    if (!isInt(nq) || nq < 1) errors.push('"preguntas" tiene que ser un número entero desde 1.');
    if (!isInt(no) || no < 2 || no > 6) errors.push('"opciones" tiene que ser un número entero de 2 a 6.');
    const maxQ = limits && limits.maxQuestions && isInt(no) && no >= 2 && no <= 6 ? limits.maxQuestions(no) : Infinity;
    if (isInt(nq) && nq > maxQ) errors.push(`Con ${no} opciones la hoja admite hasta ${maxQ} preguntas y el archivo trae ${nq}.`);

    let penalty = 0.33;
    if (d.penalizacion !== undefined) {
      penalty = num(d.penalizacion);
      if (typeof penalty !== 'number' || !isFinite(penalty) || penalty < 0 || penalty > 1) errors.push('"penalizacion" tiene que ser un número de 0 a 1.');
    }

    const key = [];
    if (!Array.isArray(d.clave)) errors.push('Falta "clave": una lista con una entrada por pregunta.');
    else {
      if (isInt(nq) && d.clave.length !== nq) errors.push(`"clave" trae ${d.clave.length} entradas y "preguntas" dice ${nq}.`);
      d.clave.forEach((k, i) => {
        const q = i + 1;
        if (!k || typeof k !== 'object') { errors.push(`Pregunta ${q}: la entrada no es válida.`); return; }
        let letters = k.correctas;
        if (typeof letters === 'string') letters = [...letters.replace(/[\s,;]+/g, '').toUpperCase()];
        if (!Array.isArray(letters)) { errors.push(`Pregunta ${q}: "correctas" tiene que ser una lista de letras (por ejemplo ["B","D"]).`); return; }
        const idx = [];
        for (const l of letters) {
          const L1 = String(l).toUpperCase(), j = L1.length === 1 ? LETTERS.indexOf(L1) : -1;
          if (j < 0 || (isInt(no) && j >= no)) errors.push(`Pregunta ${q}: la opción "${l}" no existe${isInt(no) ? ' (hay ' + [...LETTERS.slice(0, no)].join(', ') + ')' : ''}.`);
          else if (!idx.includes(j)) idx.push(j);
        }
        const pts = num(k.puntos);
        if (typeof pts !== 'number' || !isFinite(pts) || pts < 0) errors.push(`Pregunta ${q}: "puntos" tiene que ser un número desde 0.`);
        key.push({ correct: idx.sort((a, b) => a - b), points: pts });
      });
    }
    if (errors.length) return { ok: false, errors, exam: null };
    return { ok: true, errors: [], exam: { title: String(d.titulo || ''), numQuestions: nq, numOptions: no, penalty, key } };
  }

  return { build, parse, FORMAT, VERSION };
});
