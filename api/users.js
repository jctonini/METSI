// Administración de usuarios (solo rol admin). Usa la service role key, que solo existe en Vercel.
//
//   GET    /api/users                       -> lista de usuarios
//   POST   /api/users {email,password,role} -> crea un usuario (ya confirmado)
//   PATCH  /api/users {id, ...}             -> active:true|false, password:"…" o role:"admin"|"docente"
//   DELETE /api/users {id}                  -> borra el usuario
// El rol se guarda en app_metadata.role y la baja usa `ban_duration` de Supabase.
const { tokenFromRequest, verifyToken } = require('../server/auth.js');

const BAN = '876000h'; // ~100 años: equivale a "desactivado"
const send = (res, code, obj) => {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
};
const isBanned = (u) => !!u.banned_until && new Date(u.banned_until).getTime() > Date.now();
const publicUser = (u) => ({
  id: u.id, email: u.email, role: (u.app_metadata && u.app_metadata.role) === 'admin' ? 'admin' : 'docente',
  active: !isBanned(u), lastSignIn: u.last_sign_in_at || null,
});

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  return {};
}

module.exports = async (req, res, deps) => {
  const env = (deps && deps.env) || process.env;
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return send(res, 500, { error: 'Falta configurar SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en Vercel' });
  const me = await verifyToken(tokenFromRequest(req), env, deps);
  if (!me) return send(res, 401, { error: 'Sesión no válida' });
  if (me.role !== 'admin') return send(res, 403, { error: 'Solo el administrador puede gestionar usuarios' });

  const createClient = (deps && deps.createClient) || require('@supabase/supabase-js').createClient;
  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } }).auth.admin;
  const fail = (e) => send(res, e && e.status >= 400 && e.status < 500 ? e.status : 500, { error: (e && e.message) || 'Error' });

  try {
    if (req.method === 'GET') {
      const { data, error } = await admin.listUsers({ page: 1, perPage: 200 });
      if (error) return fail(error);
      return send(res, 200, { users: data.users.map(publicUser), me: me.id });
    }
    const body = await readBody(req);
    if (req.method === 'POST') {
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      if (!/^\S+@\S+\.\S+$/.test(email)) return send(res, 400, { error: 'Email no válido' });
      if (password.length < 8) return send(res, 400, { error: 'La contraseña debe tener al menos 8 caracteres' });
      const role = body.role === 'admin' ? 'admin' : 'docente';
      const { data, error } = await admin.createUser({ email, password, email_confirm: true, app_metadata: { role } });
      if (error) return fail(error);
      return send(res, 201, { user: publicUser(data.user) });
    }
    const id = String(body.id || '');
    if (!id) return send(res, 400, { error: 'Falta el usuario' });
    if (req.method === 'PATCH') {
      if (id === me.id && (body.active === false || (body.role && body.role !== 'admin'))) return send(res, 400, { error: 'No podés desactivarte ni quitarte el rol de admin a vos mismo' });
      const attrs = {};
      if (typeof body.active === 'boolean') attrs.ban_duration = body.active ? 'none' : BAN;
      if (body.password != null) {
        if (String(body.password).length < 8) return send(res, 400, { error: 'La contraseña debe tener al menos 8 caracteres' });
        attrs.password = String(body.password);
      }
      if (body.role) attrs.app_metadata = { role: body.role === 'admin' ? 'admin' : 'docente' };
      if (!Object.keys(attrs).length) return send(res, 400, { error: 'Nada para cambiar' });
      const { data, error } = await admin.updateUserById(id, attrs);
      if (error) return fail(error);
      return send(res, 200, { user: publicUser(data.user) });
    }
    if (req.method === 'DELETE') {
      if (id === me.id) return send(res, 400, { error: 'No podés borrarte a vos mismo' });
      const { error } = await admin.deleteUser(id);
      if (error) return fail(error);
      return send(res, 200, { ok: true });
    }
    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return send(res, 405, { error: 'Método no permitido' });
  } catch (e) {
    return fail(e);
  }
};
