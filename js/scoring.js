// Cálculo del puntaje. No decide aprobación: solo devuelve puntos.
//
// key:      [{ correct: [índices de opciones correctas], points: número }]
// answers:  [[índices marcados], ...] una entrada por pregunta
// penalty:  factor de descuento por cada opción incorrecta marcada, como fracción
//           de lo que vale una opción correcta (1 = cada incorrecta anula una correcta,
//           0 = sin descuento). Ninguna pregunta baja de 0.
//
// El puntaje de la pregunta se reparte en partes iguales entre sus respuestas correctas.
// Una pregunta con `correct` vacío se considera anulada: da el puntaje completo a todos.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiScoring = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const round = (n) => Math.round(n * 1e6) / 1e6;

  function scoreQuestion(marked, keyItem, penalty) {
    const points = Number(keyItem.points) || 0;
    const correct = keyItem.correct || [];
    if (correct.length === 0) return { earned: points, max: points, annulled: true };
    const share = points / correct.length;
    let hits = 0;
    let wrong = 0;
    for (const m of marked || []) {
      if (correct.includes(m)) hits++;
      else wrong++;
    }
    const earned = Math.max(0, share * hits - (Number(penalty) || 0) * share * wrong);
    return { earned: round(Math.min(points, earned)), max: points, annulled: false };
  }

  function scoreSheet(answers, key, penalty) {
    const perQuestion = key.map((k, i) => scoreQuestion(answers[i], k, penalty));
    const total = round(perQuestion.reduce((s, q) => s + q.earned, 0));
    const max = round(perQuestion.reduce((s, q) => s + q.max, 0));
    return { perQuestion, total, max, percent: max > 0 ? round((total / max) * 100) : 0 };
  }

  return { scoreQuestion, scoreSheet };
});
