// Pantalla de ingreso: inicia sesión en Supabase y deja el token en la cookie `metsi-at`,
// que las funciones de Vercel validan antes de servir la app.
(function () {
  const $ = (id) => document.getElementById(id);
  const msg = (t) => { $('msg').textContent = t || ''; };
  // Solo se vuelve a rutas internas (evita redirecciones a otros sitios).
  const next = (() => {
    const n = new URLSearchParams(location.search).get('next') || '/';
    return /^\/(?![\/\\])/.test(n) ? n : '/';
  })();

  function setCookie(session) {
    const age = Math.max(60, Math.floor(session.expires_at - Date.now() / 1000));
    document.cookie = 'metsi-at=' + session.access_token + '; Path=/; Max-Age=' + age + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
  }

  async function start() {
    const cfg = await (await fetch('/api/config', { cache: 'no-store' })).json();
    if (!cfg.url || !cfg.anonKey) throw new Error('El servidor no tiene configurado Supabase.');
    const sb = window.supabase.createClient(cfg.url, cfg.anonKey);
    // Si ya había una sesión en este navegador, se renueva y se entra sin pedir la contraseña.
    const { data } = await sb.auth.getSession();
    if (data.session) { setCookie(data.session); location.replace(next); return; }
    $('go').disabled = false; $('go').textContent = 'Ingresar';
    $('login').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      msg(''); $('go').disabled = true;
      const { data: d, error } = await sb.auth.signInWithPassword({ email: $('email').value.trim(), password: $('password').value });
      if (error || !d.session) {
        msg(error && /banned/i.test(error.message) ? 'Este usuario está desactivado.' : 'Email o contraseña incorrectos.');
        $('go').disabled = false;
        return;
      }
      setCookie(d.session);
      location.replace(next);
    });
  }
  start().catch((e) => { msg(e.message || 'No se pudo cargar el ingreso.'); });
})();
