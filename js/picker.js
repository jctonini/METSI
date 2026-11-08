// Selector de archivos de Google Drive (Google Picker). Con el permiso `drive.file` la app solo ve lo que ella
// creó; en cambio, lo que el docente elige en este selector queda habilitado para la app. Elegir una carpeta
// NO habilita lo que tiene adentro: hay que abrir la carpeta y marcar las fotos (Ctrl+A marca todas).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiPicker = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const isImage = (doc) => !!doc && typeof doc.mimeType === 'string' && /^image\//.test(doc.mimeType);

  // De lo que devuelve el selector, deja solo las imágenes (id, nombre, tipo), sin repetir.
  function imagesFrom(docs) {
    const seen = new Set(), out = [];
    for (const d of docs || []) {
      if (!isImage(d) || !d.id || seen.has(d.id)) continue;
      seen.add(d.id);
      out.push({ id: d.id, name: d.name || d.id, mimeType: d.mimeType });
    }
    return out;
  }

  // Qué falta configurar (js/config.js) para poder usar el selector; [] si está todo.
  function missingConfig(cfg) {
    const m = [];
    if (!cfg || !String(cfg.apiKey || '').trim()) m.push('METSI_GOOGLE_API_KEY');
    if (!cfg || !String(cfg.appId || '').trim()) m.push('METSI_GOOGLE_APP_ID');
    return m;
  }

  // Carga el script de Google y su módulo "picker" (una sola vez).
  let loading = null;
  function loadPicker() {
    if (!loading) {
      loading = new Promise((res, rej) => {
        const ready = () => window.gapi.load('picker', { callback: res, onerror: () => rej(new Error('No se pudo cargar el selector de Google.')) });
        if (window.gapi && window.gapi.load) return ready();
        const sc = document.createElement('script');
        sc.src = 'https://apis.google.com/js/api.js';
        sc.onload = ready;
        sc.onerror = () => rej(new Error('No se pudo cargar el selector de Google. Revisá la conexión.'));
        document.head.appendChild(sc);
      }).catch((e) => { loading = null; throw e; });
    }
    return loading;
  }

  // Abre el selector. Devuelve una promesa con las imágenes elegidas ([] si se cancela).
  async function pickImages(cfg, token) {
    await loadPicker();
    const g = window.google.picker;
    return new Promise((resolve) => {
      const view = new g.DocsView(g.ViewId.DOCS_IMAGES).setIncludeFolders(true).setSelectFolderEnabled(false);
      new g.PickerBuilder()
        .setDeveloperKey(cfg.apiKey)
        .setAppId(cfg.appId)
        .setOAuthToken(token)
        .setLocale('es')
        .setTitle('Elegí las fotos de las hojas (Ctrl+A marca todas las de la carpeta)')
        .enableFeature(g.Feature.MULTISELECT_ENABLED)
        .addView(view)
        .setCallback((data) => {
          if (data.action === g.Action.PICKED) resolve(imagesFrom(data.docs));
          else if (data.action === g.Action.CANCEL) resolve([]);
        })
        .build()
        .setVisible(true);
    });
  }

  return { isImage, imagesFrom, missingConfig, pickImages };
});
