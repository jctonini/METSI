// Combina el estado de un examen guardado en este dispositivo con el que hay en Drive.
// - Configuración y clave: gana la versión más reciente (se toman juntas).
// - Hojas: se unen por id; si una hoja está en ambos lados gana la editada más tarde.
// - Hojas borradas: se recuerdan (deleted[id] = momento) para que no reaparezcan.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiMerge = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const ts = (x) => (x && x.updatedAt) || 0;

  function mergeStates(local, remote) {
    const deleted = Object.assign({}, remote.deleted);
    for (const [id, t] of Object.entries(local.deleted || {})) {
      if (!(deleted[id] >= t)) deleted[id] = t;
    }

    const byId = new Map();
    for (const s of [...(remote.sheets || []), ...(local.sheets || [])]) {
      const cur = byId.get(s.id);
      if (!cur) { byId.set(s.id, s); continue; }
      const winner = ts(s) > ts(cur) ? s : cur;
      const loser = winner === s ? cur : s;
      byId.set(s.id, !winner.photoId && loser.photoId ? Object.assign({}, winner, { photoId: loser.photoId }) : winner);
    }
    const sheets = [...byId.values()]
      .filter((s) => !(deleted[s.id] >= ts(s)))
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    const cfgSrc = (remote.cfgUpdatedAt || 0) > (local.cfgUpdatedAt || 0) ? remote : local;
    return Object.assign({}, local, {
      cfg: cfgSrc.cfg, key: cfgSrc.key, cfgUpdatedAt: cfgSrc.cfgUpdatedAt || 0, cfgHash: cfgSrc.cfgHash,
      sheets, deleted,
    });
  }

  return { mergeStates };
});
