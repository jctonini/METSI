// Verificación de la sesión de Supabase en las funciones de Vercel.
//
// El navegador guarda el token de acceso (JWT) en la cookie `metsi-at`. Acá se valida la firma con las
// claves públicas del proyecto (JWKS) o, si el proyecto usa el secreto antiguo, con SUPABASE_JWT_SECRET.
// El rol sale de `app_metadata.role`, que solo se puede cambiar con la service role key (el usuario no puede).
const COOKIE = 'metsi-at';

function parseCookies(header) {
  const out = {};
  String(header || '').split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i < 0) return;
    const k = part.slice(0, i).trim();
    if (k) out[k] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

function tokenFromRequest(req) {
  const h = req.headers || {};
  const auth = h.authorization || '';
  if (/^Bearer /i.test(auth)) return auth.slice(7).trim();
  return parseCookies(h.cookie)[COOKIE] || '';
}

const jwksCache = new Map();

// Devuelve { id, email, role } si el token es válido; si no, null.
async function verifyToken(token, env, deps) {
  if (!token) return null;
  const jose = (deps && deps.jose) || require('jose');
  const base = String(env.SUPABASE_URL || '').replace(/\/+$/, '');
  if (!base) throw new Error('Falta la variable SUPABASE_URL');
  try {
    let key;
    let algorithms;
    if (env.SUPABASE_JWT_SECRET) {
      key = new TextEncoder().encode(env.SUPABASE_JWT_SECRET);
      algorithms = ['HS256'];
    } else {
      if (!jwksCache.has(base)) jwksCache.set(base, jose.createRemoteJWKSet(new URL(base + '/auth/v1/.well-known/jwks.json')));
      key = jwksCache.get(base);
      algorithms = ['ES256', 'RS256'];
    }
    const { payload } = await jose.jwtVerify(token, key, { issuer: base + '/auth/v1', audience: 'authenticated', algorithms });
    if (!payload.sub) return null;
    const meta = payload.app_metadata || {};
    return { id: payload.sub, email: payload.email || '', role: meta.role === 'admin' ? 'admin' : 'docente' };
  } catch (e) {
    return null;
  }
}

module.exports = { COOKIE, parseCookies, tokenFromRequest, verifyToken };
