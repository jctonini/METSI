// Selección de hojas (casillas de la pestaña Corregir): una a una, todas, y limpieza de las que ya no existen.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiSelection = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  function createSelection() {
    const ids = new Set();
    return {
      has: (id) => ids.has(id),
      size: () => ids.size,
      ids: () => [...ids],
      toggle(id, on) { if (on === undefined ? !ids.has(id) : on) ids.add(id); else ids.delete(id); },
      clear: () => ids.clear(),
      // Marca todas las hojas indicadas, o las desmarca si ya estaban todas marcadas.
      toggleAll(all) {
        if (all.length && all.every((id) => ids.has(id))) ids.clear();
        else all.forEach((id) => ids.add(id));
      },
      // Descarta ids de hojas que ya no están (por ejemplo, quitadas o traídas distintas desde Drive).
      prune(all) { const keep = new Set(all); for (const id of [...ids]) if (!keep.has(id)) ids.delete(id); },
      allSelected: (all) => all.length > 0 && all.every((id) => ids.has(id)),
    };
  }
  return { createSelection };
});
