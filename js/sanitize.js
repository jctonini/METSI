// Validación de datos que vienen de afuera (el datos.json de Drive, que otra persona con acceso a la carpeta
// podría haber cambiado) y de imágenes que se pegan en el HTML. Todo es puro: corre también en Node.
//
// - `safeImageUrl`: solo deja pasar imágenes `data:` en base64; cualquier otra cosa devuelve ''.
// - `isSafeId`: identificadores de Drive y de hojas (letras, números, guion y guion bajo).
// - `cleanRemote`: devuelve los datos de Drive ya limpios, o `null` si no tienen el formato esperado.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiSanitize = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const ID = /^[A-Za-z0-9_-]{1,100}$/;
  const IMG = /^data:image\/(?:jpeg|png|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/;

  const isSafeId = (s) => typeof s === 'string' && ID.test(s);
  const safeImageUrl = (s) => (typeof s === 'string' && IMG.test(s) ? s : '');
  const isInt = (n, lo, hi) => Number.isInteger(n) && n >= lo && n <= hi;
  const num = (n, dflt) => (typeof n === 'number' && Number.isFinite(n) ? n : dflt);
  const str = (s, max) => (typeof s === 'string' ? s : s == null ? '' : String(s)).slice(0, max);
  const isObj = (o) => !!o && typeof o === 'object' && !Array.isArray(o);

  // Hoja: se corrigen los tipos de lo que se muestra o se usa para calcular; el resto de los campos se conserva.
  // Devuelve null si la hoja no sirve (sin id válido o con respuestas imposibles).
  function cleanSheet(sh, numQuestions, numOptions) {
    if (!isObj(sh)) return null;
    const id = String(sh.id);
    if (!isSafeId(id)) return null;
    const answers = Array.isArray(sh.answers) ? sh.answers : [];
    const cleanAns = (a) => (Array.isArray(a) ? a : []).filter((i) => isInt(i, 0, numOptions - 1));
    const out = Object.assign({}, sh, {
      id,
      fileName: str(sh.fileName, 255),
      nombre: str(sh.nombre, 300),
      registro: str(sh.registro, 30),
      comentario: str(sh.comentario, 300),
      modalidad: Number.isInteger(sh.modalidad) && sh.modalidad >= 0 && sh.modalidad < 8 ? sh.modalidad : null,
      photoId: isSafeId(sh.photoId) ? sh.photoId : null,
      createdAt: num(sh.createdAt, 0),
      updatedAt: num(sh.updatedAt, 0),
      answers: Array.from({ length: numQuestions }, (_, q) => cleanAns(answers[q])),
    });
    if (Array.isArray(sh.autoAnswers)) out.autoAnswers = Array.from({ length: numQuestions }, (_, q) => cleanAns(sh.autoAnswers[q]));
    if (sh.crops != null) out.crops = isObj(sh.crops) ? { name: safeImageUrl(sh.crops.name), reg: safeImageUrl(sh.crops.reg) } : undefined;
    if (!out.crops) delete out.crops;
    return out;
  }

  function cleanCfg(cfg) {
    if (!isObj(cfg)) return null;
    if (!isInt(cfg.numQuestions, 1, 100) || !isInt(cfg.numOptions, 2, 6) || !isInt(cfg.regDigits, 1, 9)) return null;
    const penalty = num(cfg.penalty, NaN);
    if (!(penalty >= 0 && penalty <= 1)) return null;
    const mods = Array.isArray(cfg.modalidades) ? cfg.modalidades.slice(0, 8).map((m) => str(m, 100)) : null;
    if (!mods || !mods.length) return null;
    const sheet = {};
    const src = isObj(cfg.sheet) ? cfg.sheet : {};
    for (const k of ['subtitle', 'nameLabel', 'regLabel', 'modLabel', 'instructions', 'legal']) sheet[k] = str(src[k], 2000);
    sheet.logo = safeImageUrl(src.logo);
    return Object.assign({}, cfg, { title: str(cfg.title, 300), modalidades: mods, penalty, sheet });
  }

  function cleanKey(key, numQuestions, numOptions) {
    if (!Array.isArray(key) || key.length < numQuestions || key.length > 100) return null;
    return key.map((k) => ({
      correct: (isObj(k) && Array.isArray(k.correct) ? k.correct : []).filter((i) => isInt(i, 0, numOptions - 1)),
      points: Math.min(1000, Math.max(0, num(isObj(k) ? k.points : 1, 1))),
    }));
  }

  // Datos de Drive (datos.json) -> datos limpios, o null si no tienen el formato esperado.
  function cleanRemote(remote) {
    if (!isObj(remote) || !isSafeId(remote.examId)) return null;
    const cfg = cleanCfg(remote.cfg);
    if (!cfg) return null;
    const key = cleanKey(remote.key, cfg.numQuestions, cfg.numOptions);
    if (!key) return null;
    const sheets = [];
    for (const sh of Array.isArray(remote.sheets) ? remote.sheets : []) {
      const c = cleanSheet(sh, cfg.numQuestions, cfg.numOptions);
      if (!c) return null;
      sheets.push(c);
    }
    const deleted = {};
    if (isObj(remote.deleted)) for (const [k, v] of Object.entries(remote.deleted)) if (isSafeId(k) && typeof v === 'number' && Number.isFinite(v)) deleted[k] = v;
    return Object.assign({}, remote, {
      examId: remote.examId, examCreatedAt: num(remote.examCreatedAt, 0), cfg, key, sheets, deleted,
      cfgUpdatedAt: num(remote.cfgUpdatedAt, 0), cfgHash: str(remote.cfgHash, 5000),
    });
  }

  return { isSafeId, safeImageUrl, cleanSheet, cleanCfg, cleanKey, cleanRemote };
});
