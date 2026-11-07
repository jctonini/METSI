// Sirve la app (index.html, js/, css/ y docs/) solo a quien tiene una sesión válida de Supabase.
// vercel.json redirige todo lo que no es /login ni /api/* a esta función (`?path=<ruta pedida>`).
const fs = require('fs');
const path = require('path');
const { tokenFromRequest, verifyToken } = require('../server/auth.js');

const ROOT = path.join(__dirname, '..');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
};
// Solo estas rutas se sirven; nada más del repositorio queda accesible.
const ALLOWED = /^(index\.html|(js|css|docs)\/[A-Za-z0-9._-]+)$/;

function requestedPath(req) {
  let p = req.query && req.query.path;
  if (Array.isArray(p)) p = p.join('/');
  if (p == null) p = String(req.url || '').split('?')[0];
  p = decodeURIComponent(String(p)).replace(/^\/+/, '');
  return p === '' ? 'index.html' : p;
}

module.exports = async (req, res, deps) => {
  const env = (deps && deps.env) || process.env;
  const rel = requestedPath(req);
  const user = await verifyToken(tokenFromRequest(req), env, deps);
  if (!user) {
    res.setHeader('Cache-Control', 'no-store');
    if (rel === 'index.html') {
      res.statusCode = 302;
      res.setHeader('Location', '/login');
      return res.end();
    }
    res.statusCode = 401;
    return res.end('Sesión no válida');
  }
  if (!ALLOWED.test(rel) || rel.includes('..')) {
    res.statusCode = 404;
    return res.end('No encontrado');
  }
  let body;
  try { body = fs.readFileSync(path.join(ROOT, rel)); } catch (e) {
    res.statusCode = 404;
    return res.end('No encontrado');
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', TYPES[path.extname(rel)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'private, no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.end(body);
};
