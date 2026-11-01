// Copia local de las fotos que todavía no se subieron a Drive (IndexedDB), para no perderlas si se
// cierra o recarga la página antes de sincronizar. Si el navegador no permite IndexedDB (ventana privada,
// por ejemplo), todas las operaciones se ignoran en silencio y la app funciona como antes.
(function (root, factory) {
  root.MetsiPhotoStore = factory(root);
})(typeof self !== 'undefined' ? self : this, function (root) {
  const DB = 'metsi.fotos', STORE = 'fotos';
  let dbPromise = null;

  function open() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve) => {
        try {
          const req = root.indexedDB.open(DB, 1);
          req.onupgradeneeded = () => req.result.createObjectStore(STORE);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
          req.onblocked = () => resolve(null);
        } catch (e) { resolve(null); }
      });
    }
    return dbPromise;
  }

  // Ejecuta una operación sobre el almacén y devuelve su resultado (o undefined si algo falla).
  async function run(mode, fn) {
    const db = await open();
    if (!db) return undefined;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE, mode);
        const st = tx.objectStore(STORE);
        const req = fn(st);
        tx.oncomplete = () => resolve(req ? req.result : undefined);
        tx.onerror = tx.onabort = () => resolve(undefined);
      } catch (e) { resolve(undefined); }
    });
  }

  return {
    put: (id, blob) => run('readwrite', (s) => s.put(blob, String(id))),
    remove: (id) => run('readwrite', (s) => s.delete(String(id))),
    clear: () => run('readwrite', (s) => s.clear()),
    // Devuelve [{ id, blob }] con todo lo guardado.
    async all() {
      const keys = (await run('readonly', (s) => s.getAllKeys())) || [];
      const out = [];
      for (const id of keys) {
        const blob = await run('readonly', (s) => s.get(id));
        if (blob) out.push({ id, blob });
      }
      return out;
    },
  };
});
