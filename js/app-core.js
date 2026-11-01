// Estado de la app, almacenamiento local y utilidades que comparten todos los módulos de la interfaz.
// Los demás archivos (app-exam, app-scan, app-results, app-drive y app) obtienen lo compartido de window.MetsiApp.
(function () {
  const App = window.MetsiApp = window.MetsiApp || {};
  const { buildLayout, LETTERS } = MetsiLayout;
  const { scoreSheet } = MetsiScoring;
  const { formatNumber } = MetsiCsv;
  const Photos = MetsiPhotoStore;
  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = 'metsi.corrector.v1';
  const SETTINGS_KEY = 'metsi.settings.v1';
  const MAX_SIDE = 1600; // lado mayor con el que se analiza cada foto
  const THUMB_SIDE = 900; // lado mayor de la imagen que se conserva para revisar
  const fmt = (n) => formatNumber(n, true); // en pantalla: hasta 3 decimales, con coma

  // ---------- estado ----------
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const defaults = () => ({
    examId: newId(),
    examCreatedAt: Date.now(),
    cfg: { title: '', numQuestions: 10, numOptions: 4, regDigits: 7, modalidades: ['Presencial', 'A distancia'], penalty: 0.33, threshold: 0.085, thrVersion: 3,
      sheet: { subtitle: '', nameLabel: '', regLabel: '', modLabel: '', instructions: '', legal: '', logo: '' } },
    key: Array.from({ length: 10 }, () => ({ correct: [], points: 1 })),
    sheets: [],
    deleted: {},
    cfgUpdatedAt: 0,
    cfgHash: '',
    lastSync: 0,
    driveFolderName: '',
  });
  // Completa campos nuevos en estados guardados antes (o provenientes de otro dispositivo).
  const fixCfg = (st) => {
    st.cfg.sheet = Object.assign({}, defaults().cfg.sheet, st.cfg.sheet);
    // La sensibilidad cambió de escala (ahora se mide sobre el nivel base de cada foto).
    if (st.cfg.thrVersion !== 3) {
      const old = Number(st.cfg.threshold);
      if (st.cfg.thrVersion !== 2) st.cfg.threshold = old <= 0.2 ? 0.06 : old >= 0.35 ? 0.2 : 0.1; // escala vieja -> escala 2
      const t = Number(st.cfg.threshold);
      st.cfg.threshold = t <= 0.07 ? 0.05 : t >= 0.15 ? 0.16 : 0.085; // escala 2 -> escala 3 (se mide más cerca del centro)
      st.cfg.thrVersion = 3;
    }
    return st;
  };
  const state = load();
  const memory = new Map(); // id -> { thumb } (fotos en memoria; las que faltan subir también se copian en IndexedDB)
  // Al descartar fotos de la memoria también se borra su copia local.
  { const del = memory.delete.bind(memory), clr = memory.clear.bind(memory);
    memory.delete = (id) => { Photos.remove(id); return del(id); };
    memory.clear = () => { Photos.clear(); clr(); }; }

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (s && s.cfg && s.key && s.sheets) {
        const merged = fixCfg(Object.assign(defaults(), s));
        merged.sheets.forEach((sh) => { sh.id = String(sh.id); sh.createdAt = sh.createdAt || 0; sh.updatedAt = sh.updatedAt || 0; });
        return merged;
      }
    } catch (e) { /* sin almacenamiento: se usa el estado por defecto */ }
    return defaults();
  }
  function save() {
    // Si cambió la configuración o la clave, se marca como modificada (para la sincronización).
    const h = JSON.stringify([state.cfg, state.key]);
    if (h !== state.cfgHash) { state.cfgHash = h; state.cfgUpdatedAt = Date.now(); }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignorado */ }
    if (App.updateSyncBar) App.updateSyncBar();
  }
  const touch = (sheet) => { sheet.updatedAt = Date.now(); save(); };
  function removeSheet(id) {
    state.sheets = state.sheets.filter((x) => x.id !== id);
    state.deleted[id] = Date.now();
    memory.delete(id);
  }

  const loadSettings = () => { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch (e) { return {}; } };
  const saveSettings = (s) => { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) { /* ignorado */ } };
  const clientId = () => (loadSettings().clientId || window.METSI_GOOGLE_CLIENT_ID || '').trim();

  const layout = () => buildLayout(state.cfg);
  const letters = (arr) => arr.map((i) => LETTERS[i]).join('');

  function scoreOf(sheet) {
    return scoreSheet(sheet.answers, state.key, state.cfg.penalty, state.cfg.numOptions);
  }

  // Reemplaza el contenido del estado sin cambiar el objeto (los demás archivos guardan la referencia).
  function replaceState(next) {
    Object.keys(state).forEach((k) => delete state[k]);
    Object.assign(state, next);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  Object.assign(App, { $, state, replaceState, memory, Photos, save, touch, removeSheet, scoreOf, loadSettings, saveSettings, clientId, layout, letters, fmt, escapeHtml, newId, defaults, fixCfg, load, MAX_SIDE, THUMB_SIDE });
})();
