// Procesa una tanda de fotos de a una y guarda el estado después de cada una.
// Así, si la pestaña se cierra o se recarga a mitad de la tanda (por ejemplo, por falta de memoria en el
// celular), las hojas ya leídas no se pierden.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiBatch = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  // `items`: lista de elementos a procesar. `processOne(item, i)` devuelve el resultado ('added', 'skipped', etc.)
  // o lanza un error (el elemento se cuenta como 'failed' y se sigue). `save()` se llama después de cada elemento.
  // `onProgress(i, total)` es opcional. Devuelve el conteo por resultado.
  async function runBatch(items, processOne, save, onProgress) {
    const tally = { added: 0, skipped: 0, discarded: 0, failed: 0 };
    for (let i = 0; i < items.length; i++) {
      if (onProgress) await onProgress(i, items.length);
      let res;
      try { res = await processOne(items[i], i); } catch (e) { res = 'failed'; }
      if (res) tally[res] = (tally[res] || 0) + 1;
      save();
    }
    return tally;
  }
  // Corre `fn(item, i)` sobre todos los elementos con hasta `limit` en simultáneo (por ejemplo, subir fotos a Drive
  // de a 3). Si una falla, no se empiezan más, se espera a las que ya van y se lanza el primer error.
  async function mapLimit(items, limit, fn) {
    let next = 0, failed = false, firstError = null;
    const worker = async () => {
      while (!failed && next < items.length) {
        const i = next++;
        try { await fn(items[i], i); } catch (e) { if (!failed) { failed = true; firstError = e; } }
      }
    };
    await Promise.all(Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, worker));
    if (failed) throw firstError;
  }
  return { runBatch, mapLimit };
});
