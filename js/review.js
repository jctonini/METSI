// Casos "a revisar": hojas o preguntas que el docente marcó con una bandera, y respuestas que corrigió a mano
// después de la lectura automática. Sirven para analizar dónde se equivoca la lectura y mejorarla.
//
// Privacidad: los casos NO incluyen nombre, registro ni recortes de la foto.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiReview = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const sameSet = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
  const ensure = (sheet) => {
    if (!sheet.review) sheet.review = { flag: false, note: '', q: {} };
    if (!sheet.review.q) sheet.review.q = {};
    return sheet.review;
  };

  // Preguntas cuya respuesta final difiere de la que leyó la app (solo si se guardó la lectura original).
  function editedQuestions(sheet) {
    if (!sheet.autoAnswers) return [];
    const out = [];
    sheet.answers.forEach((fin, q) => {
      const auto = sheet.autoAnswers[q] || [];
      if (!sameSet(auto, fin)) out.push({ q, auto: auto.slice(), final: fin.slice() });
    });
    return out;
  }

  const modalidadEdited = (sheet) => sheet.autoModalidad !== undefined && sheet.autoModalidad !== sheet.modalidad;
  const flaggedQuestions = (sheet) => Object.keys((sheet.review && sheet.review.q) || {}).filter((k) => sheet.review.q[k]).map(Number).sort((a, b) => a - b);

  // ¿Esta hoja entra en la lista de casos a revisar?
  function needsReview(sheet) {
    if (sheet.failed) return !!(sheet.review && (sheet.review.flag || sheet.review.sendImage));
    return !!(sheet.review && sheet.review.flag) || flaggedQuestions(sheet).length > 0 || editedQuestions(sheet).length > 0 || modalidadEdited(sheet);
  }

  // ctx: { letters: 'ABCDE', exam: { ...datos del examen sin nombres }, appVersion }
  function buildCases(sheets, ctx) {
    const L = (arr) => arr.map((i) => ctx.letters[i]).join('');
    const cases = sheets.filter(needsReview).map((s) => ({
      id: s.id,
      fileName: s.fileName || '',
      failed: !!s.failed,
      error: s.failed ? s.error || '' : undefined,
      version: s.version || null,
      appVersion: s.appVersion || null,
      flagged: !!(s.review && s.review.flag),
      note: (s.review && s.review.note) || '',
      flaggedQuestions: flaggedQuestions(s).map((q) => q + 1),
      edited: editedQuestions(s).map((e) => ({ q: e.q + 1, auto: L(e.auto), final: L(e.final) })),
      modalidad: s.modalidad === undefined ? undefined : { auto: s.autoModalidad === undefined ? null : s.autoModalidad, final: s.modalidad },
      scores: s.scan ? s.scan.scores : undefined,
      H: s.scan ? s.scan.H : undefined,
      fullScale: s.fullScale,
      imageFile: s.review && s.review.imageFile ? s.review.imageFile : undefined,
    }));
    return cases;
  }

  const wrap = (cases, ctx) => ({ generado: new Date().toISOString(), appVersion: ctx.appVersion || null, examen: ctx.exam, casos: cases });

  return { ensure, editedQuestions, modalidadEdited, flaggedQuestions, needsReview, buildCases, wrap };
});
