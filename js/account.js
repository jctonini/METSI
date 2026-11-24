// Sesión del usuario en la app: mantiene al día la cookie que valida el servidor, muestra quién está
// conectado, permite salir y avisa si es administrador. El control real de acceso está en el servidor
// (api/app.js y api/users.js); lo de acá solo muestra u oculta botones.
(function () {
  const App = window.MetsiApp;
  const $ = (id) => document.getElementById(id);
  let sb = null, session = null;

  const loadScript = (src) => new Promise((ok, no) => {
    const s = document.createElement('script');
    s.src = src; s.onload = ok; s.onerror = () => no(new Error('No se pudo cargar ' + src));
    document.head.appendChild(s);
  });

  // La cookie la crea el servidor (HttpOnly: la página no puede leerla). Si el servidor no responde, se usa
  // el método anterior (cookie escrita desde la página) para no dejar a nadie sin entrar.
  async function setCookie(s) {
    try {
      const r = await fetch('/api/session', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ access_token: s.access_token }) });
      if (r.ok) return;
    } catch (e) { /* se usa el respaldo */ }
    const age = Math.max(60, Math.floor(s.expires_at - Date.now() / 1000));
    document.cookie = 'metsi-at=' + s.access_token + '; Path=/; Max-Age=' + age + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
  }
  async function clearCookie() {
    try { await fetch('/api/session', { method: 'DELETE', credentials: 'same-origin' }); } catch (e) { /* se usa el respaldo */ }
    document.cookie = 'metsi-at=; Path=/; Max-Age=0; SameSite=Lax';
  }
  const isAdmin = () => !!(session && session.user.app_metadata && session.user.app_metadata.role === 'admin');

  function paint() {
    $('acct-email').textContent = session ? session.user.email : '';
    $('acct-bar').hidden = !session;
    $('tab-users-btn').hidden = !isAdmin();
  }

  // Token vigente para llamar a /api/users.
  async function token() {
    if (!sb) throw new Error('Sesión no disponible');
    const { data } = await sb.auth.getSession();
    if (!data.session) { location.replace('/login'); throw new Error('Sesión vencida'); }
    return data.session.access_token;
  }

  async function logout() {
    try { if (sb) await sb.auth.signOut(); } catch (e) { /* se sale igual */ }
    await clearCookie();
    location.replace('/login');
  }

  async function init() {
    $('acct-logout').addEventListener('click', logout);
    try {
      const cfg = await (await fetch('/api/config', { cache: 'no-store' })).json();
      await loadScript('/supabase.js');
      sb = window.supabase.createClient(cfg.url, cfg.anonKey);
      const { data } = await sb.auth.getSession();
      if (!data.session) { await clearCookie(); location.replace('/login'); return; }
      session = data.session; await setCookie(session); paint();
      sb.auth.onAuthStateChange(async (ev, s) => {
        if (ev === 'SIGNED_OUT' || !s) { await clearCookie(); location.replace('/login'); return; }
        session = s; await setCookie(s); paint();
      });
    } catch (e) { /* sin red o sin el script: la app sigue funcionando con la sesión actual */ }
  }

  Object.assign(App, { authToken: token, isAdmin });
  init();
})();
