// Guardado local que avisa si falla (por ejemplo, almacenamiento lleno) en vez de ignorarlo.
//
// `write(text)` intenta guardar y devuelve true/false. Cada vez que cambia el resultado (de bien a mal o
// de mal a bien) llama a `onChange(ok, error)`, para mostrar u ocultar un aviso.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiStorage = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  function createSaver(deps) {
    let ok = true;
    return {
      write(text) {
        let error = null;
        try { deps.setItem(text); } catch (e) { error = e; }
        if ((error === null) !== ok) { ok = error === null; if (deps.onChange) deps.onChange(ok, error); }
        return ok;
      },
      isOk: () => ok,
    };
  }
  // Agrupa varios pedidos de guardado en uno solo: `schedule()` hace que `fn` corra una vez dentro de `ms`
  // (las llamadas siguientes mientras espera no suman). `flush()` la corre ya si hay una pendiente (para
  // cuando se cierra o se oculta la página) y `cancel()` descarta la pendiente. `timers` es para probarlo.
  function createDeferred(fn, ms, timers) {
    const t = timers || { setTimeout: (f, d) => setTimeout(f, d), clearTimeout: (h) => clearTimeout(h) };
    let handle = null;
    const run = () => { handle = null; fn(); };
    return {
      schedule() { if (handle === null) handle = t.setTimeout(run, ms); },
      cancel() { if (handle !== null) { t.clearTimeout(handle); handle = null; } },
      flush() { if (handle !== null) { t.clearTimeout(handle); run(); } },
      pending: () => handle !== null,
    };
  }
  return { createSaver, createDeferred };
});
