// Administrador del token de acceso de Google: lo guarda hasta que vence, lo renueva solo antes de
// que venza y avisa cuando hace falta que el usuario vuelva a iniciar sesión.
//
// `request()` pide un token nuevo y devuelve una promesa con { access_token, expires_in } (en segundos).
// Cuando hay sesión abierta en Google y el usuario ya dio permiso, el pedido no necesita interacción;
// si el navegador la exige (por ejemplo, bloquea la ventana emergente), falla y el estado pasa a 'needs-login'.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiAuth = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  // Estados: 'none' (nunca hubo token), 'ok', 'needs-login' (no se pudo renovar sin interacción).
  function createTokenManager(deps) {
    const now = deps.now || Date.now;
    const setTimer = deps.setTimer || ((f, ms) => setTimeout(f, ms));
    const clearTimer = deps.clearTimer || ((t) => clearTimeout(t));
    const skewMs = deps.skewMs == null ? 60000 : deps.skewMs; // margen para no usar un token a punto de vencer
    const renewBeforeMs = deps.renewBeforeMs == null ? 300000 : deps.renewBeforeMs; // se renueva 5 min antes
    let token = null, expiry = 0, status = 'none', inflight = null, timer = null;

    const setStatus = (s) => { if (s !== status) { status = s; if (deps.onChange) deps.onChange(s); } };
    const has = () => !!token && now() < expiry - skewMs;

    function scheduleRenewal() {
      if (timer) clearTimer(timer);
      const ms = Math.max(1000, expiry - now() - renewBeforeMs);
      timer = setTimer(() => { timer = null; refresh().catch(() => { /* el estado ya quedó en needs-login */ }); }, ms);
    }

    // Pide un token nuevo (aunque el actual siga vigente). Varios pedidos a la vez comparten uno solo.
    function refresh() {
      if (inflight) return inflight;
      inflight = Promise.resolve().then(() => deps.request()).then((r) => {
        token = r.access_token;
        expiry = now() + (Number(r.expires_in) || 3600) * 1000;
        setStatus('ok');
        scheduleRenewal();
        return token;
      }, (err) => {
        token = null; expiry = 0;
        if (timer) { clearTimer(timer); timer = null; }
        setStatus('needs-login');
        throw err;
      }).finally(() => { inflight = null; });
      return inflight;
    }

    return {
      has,
      status: () => status,
      get: () => (has() ? Promise.resolve(token) : refresh()),
      refresh,
      // Descarta el token actual (por ejemplo, tras un 401) sin cambiar el estado.
      invalidate() { token = null; expiry = 0; if (timer) { clearTimer(timer); timer = null; } },
    };
  }

  return { createTokenManager };
});
