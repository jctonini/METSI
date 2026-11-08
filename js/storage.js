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
  return { createSaver };
});
