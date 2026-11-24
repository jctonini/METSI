// Crea y borra la cookie de sesión `metsi-at` desde el servidor, con HttpOnly: así ningún script de la página
// (por ejemplo, uno inyectado) puede leerla.
//
//   POST   /api/session {access_token}  -> verifica el token de Supabase y lo deja en la cookie
//   DELETE /api/session                 -> borra la cookie (cerrar sesión)
// Si este endpoint falla, el navegador usa el método anterior (cookie escrita desde la página) para no dejar a nadie afuera.
const { COOKIE, verifyToken } = require('../server/auth.js');
const { apply: securityHeaders } = require('../server/headers.js');

const send = (res, code, obj) => {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
};
const flags = (req) => '; Path=/; HttpOnly; SameSite=Lax' + (String((req.headers || {})['x-forwarded-proto'] || 'https') === 'http' ? '' : '; Secure');

module.exports = async (req, res, deps) => {
  const env = (deps && deps.env) || process.env;
  securityHeaders(res, env);
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', COOKIE + '=; Max-Age=0' + flags(req));
    return send(res, 200, { ok: true });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, DELETE');
    return send(res, 405, { error: 'Método no permitido' });
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const token = body && typeof body.access_token === 'string' ? body.access_token : '';
  const user = await verifyToken(token, env, deps);
  if (!user) return send(res, 401, { error: 'Sesión no válida' });
  const age = Math.max(60, Math.floor(user.exp - Date.now() / 1000));
  res.setHeader('Set-Cookie', COOKIE + '=' + token + '; Max-Age=' + age + flags(req));
  return send(res, 200, { ok: true });
};
