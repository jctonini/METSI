// Reintentos con espera creciente (1 s, 2 s, 4 s… hasta un tope), para fallos pasajeros de red o de Drive.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiRetry = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  // ¿Vale la pena reintentar? Sí para cortes de red (err.network) y para 408, 429 y errores 5xx del servidor.
  // No para el resto (401, 403, 404…): repetir el pedido no los arregla.
  function isRetryable(err) {
    if (!err) return false;
    if (err.network) return true;
    const s = err.status;
    return s === 408 || s === 429 || (s >= 500 && s <= 599);
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // Ejecuta fn() y, si falla con un error reintentable, vuelve a intentar hasta `retries` veces.
  // opts: { retries = 4, baseMs = 1000, maxMs = 15000, sleep, shouldRetry, onRetry(err, intento, espera) }
  async function withRetry(fn, opts) {
    const o = { retries: 4, baseMs: 1000, maxMs: 15000, sleep: wait, shouldRetry: isRetryable };
    for (const k of Object.keys(opts || {})) if (opts[k] !== undefined) o[k] = opts[k]; // lo no indicado queda por defecto
    for (let attempt = 0; ; attempt++) {
      try {
        return await fn(attempt);
      } catch (err) {
        if (attempt >= o.retries || !o.shouldRetry(err)) throw err;
        const ms = Math.min(o.maxMs, o.baseMs * Math.pow(2, attempt));
        if (o.onRetry) o.onRetry(err, attempt + 1, ms);
        await o.sleep(ms);
      }
    }
  }

  return { withRetry, isRetryable };
});
