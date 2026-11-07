// Pestaña "Usuarios" (solo administrador): altas, bajas y cambio de contraseña, usando /api/users.
(function () {
  const App = window.MetsiApp;
  const $ = (id) => document.getElementById(id);
  let me = '';

  async function api(method, body) {
    const res = await fetch('/api/users', {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (await App.authToken()) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Error ' + res.status);
    return data;
  }
  const say = (t, bad) => { const s = $('users-status'); s.textContent = t || ''; s.style.color = bad ? 'var(--danger)' : ''; };
  const act = async (fn) => { try { say(''); await fn(); await render(); } catch (e) { say(e.message, true); } };

  async function render() {
    const { users, me: id } = await api('GET');
    me = id;
    const tb = $('users-body');
    tb.textContent = '';
    users.forEach((u) => {
      const tr = document.createElement('tr');
      const cell = (t) => { const td = document.createElement('td'); td.textContent = t; tr.appendChild(td); return td; };
      cell(u.email + (u.id === me ? ' (vos)' : ''));
      cell(u.role === 'admin' ? 'Admin' : 'Docente');
      cell(u.active ? 'Activo' : 'Desactivado');
      const td = cell('');
      const btn = (label, fn, cls) => {
        const b = document.createElement('button');
        b.type = 'button'; b.textContent = label; b.className = 'small' + (cls ? ' ' + cls : '');
        b.addEventListener('click', fn); td.appendChild(b);
      };
      btn('Contraseña', () => {
        const p = prompt('Nueva contraseña para ' + u.email + ' (mínimo 8 caracteres):');
        if (p) act(async () => { await api('PATCH', { id: u.id, password: p }); say('Contraseña cambiada.'); });
      });
      if (u.id !== me) {
        btn(u.active ? 'Desactivar' : 'Reactivar', () => act(() => api('PATCH', { id: u.id, active: !u.active })));
        btn('Borrar', () => { if (confirm('¿Borrar a ' + u.email + '? No se puede deshacer.')) act(() => api('DELETE', { id: u.id })); }, 'danger');
      }
      tb.appendChild(tr);
    });
  }

  $('user-add').addEventListener('click', () => act(async () => {
    await api('POST', { email: $('user-email').value, password: $('user-pass').value, role: $('user-role').value });
    $('user-email').value = ''; $('user-pass').value = '';
    say('Usuario creado. Pasale el email y la contraseña por un canal seguro.');
  }));

  Object.assign(App, { renderUsers: () => render().catch((e) => say(e.message, true)) });
})();
