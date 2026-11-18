// Selector de archivos de Google Drive (Google Picker). Con el permiso `drive.file` la app solo ve lo que ella
// creó; en cambio, lo que el docente elige en este selector queda habilitado para la app. Elegir una carpeta
// NO habilita lo que tiene adentro: hay que abrir la carpeta y marcar las fotos (Ctrl+A marca todas).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiPicker = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const IMAGE_TYPES = 'image/jpeg,image/png,image/webp,image/heic,image/heif';
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

  // Carpeta donde están las fotos elegidas (la más repetida): el selector de Google no avisa cuál fue la última carpeta
  // que se visitó, pero sí la carpeta (`parentId`) de cada archivo elegido. '' si no se puede saber.
  function folderOf(docs) {
    const count = new Map();
    for (const d of docs || []) if (isImage(d) && d.parentId) count.set(d.parentId, (count.get(d.parentId) || 0) + 1);
    let best = '', n = 0;
    for (const [id, c] of count) if (c > n) { best = id; n = c; }
    return best;
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
  // `startFolder`: carpeta donde abrir (la última de la que se eligieron fotos); sin ella, «Mi unidad».
  // `onFolder(id)`: se llama con la carpeta de las fotos elegidas para recordarla.
  async function pickImages(cfg, token, startFolder, onFolder) {
    await loadPicker();
    const g = window.google.picker;
    return new Promise((resolve) => {
      // Primero «Mi unidad» (la raíz del Drive, con sus carpetas, mostrando solo imágenes) y, en otra pestaña, todas las imágenes de la cuenta.
      const root = new g.DocsView(g.ViewId.DOCS).setParent(startFolder || 'root').setIncludeFolders(true).setSelectFolderEnabled(false).setMimeTypes(IMAGE_TYPES);
      const all = new g.DocsView(g.ViewId.DOCS_IMAGES).setIncludeFolders(true).setSelectFolderEnabled(false);
      new g.PickerBuilder()
        .setDeveloperKey(cfg.apiKey)
        .setAppId(cfg.appId)
        .setOAuthToken(token)
        .setLocale('es')
        .setTitle('Elegí las fotos de las hojas (Ctrl+A marca todas las de la carpeta)')
        .enableFeature(g.Feature.MULTISELECT_ENABLED)
        .addView(root)
        .addView(all)
        .setCallback((data) => {
          if (data.action === g.Action.PICKED) {
            const f = folderOf(data.docs);
            if (f && onFolder) onFolder(f);
            resolve(imagesFrom(data.docs));
          }
          else if (data.action === g.Action.CANCEL) resolve([]);
        })
        .build()
        .setVisible(true);
    });
  }

  return { isImage, imagesFrom, folderOf, missingConfig, pickImages };
});
