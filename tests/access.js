// Pruebas del control de acceso (server/auth.js, api/app.js, api/users.js) con Supabase simulado.
// Se corre solo con `node tests/access.js` o desde tests/run.js.
const assert = require('node:assert/strict');
const jose = require('jose');
const app = require('../api/app.js');
const users = require('../api/users.js');
const session = require('../api/session.js');
const { parseCookies } = require('../server/auth.js');

const URL_ = 'https://demo.supabase.co';
const SECRET = 'secreto-de-prueba-secreto-de-prueba';
const env = { SUPABASE_URL: URL_, SUPABASE_JWT_SECRET: SECRET, SUPABASE_SERVICE_ROLE_KEY: 'service' };
const sign = (claims, o = {}) => new jose.SignJWT({ app_metadata: {}, ...claims })
  .setProtectedHeader({ alg: 'HS256' }).setSubject(o.sub || 'u1').setIssuer(URL_ + '/auth/v1').setAudience('authenticated')
  .setExpirationTime(o.exp || '1h').sign(new TextEncoder().encode(o.secret || SECRET));

function mockRes() {
  const r = { statusCode: 0, headers: {}, body: '', setHeader(k, v) { r.headers[k.toLowerCase()] = v; }, end(b) { r.body = b == null ? '' : b; r.done = true; } };
  return r;
}
const call = async (fn, req, deps) => { const res = mockRes(); await fn(req, res, { env, ...deps }); return res; };

// Supabase simulado para api/users.js.
function mockSupabase() {
  const db = new Map([['u1', { id: 'u1', email: 'admin@x.com', app_metadata: { role: 'admin' } }], ['u2', { id: 'u2', email: 'doc@x.com', app_metadata: {} }]]);
  let n = 2;
  const admin = {
    listUsers: async () => ({ data: { users: [...db.values()] }, error: null }),
    createUser: async (a) => { if ([...db.values()].some((u) => u.email === a.email)) return { error: { status: 422, message: 'ya existe' } }; const u = { id: 'u' + (++n), email: a.email, app_metadata: a.app_metadata }; db.set(u.id, u); return { data: { user: u }, error: null }; },
    updateUserById: async (id, a) => { const u = db.get(id); if (a.ban_duration) u.banned_until = a.ban_duration === 'none' ? null : new Date(Date.now() + 1e10).toISOString(); if (a.app_metadata) u.app_metadata = a.app_metadata; return { data: { user: u }, error: null }; },
    deleteUser: async (id) => { db.delete(id); return { error: null }; },
  };
  return { db, createClient: () => ({ auth: { admin } }) };
}

const tests = [];
const test = (name, fn) => tests.push([name, fn]);

test('cookie: se lee el token entre otras cookies', () => {
  assert.equal(parseCookies('a=1; metsi-at=abc.def; b=2')['metsi-at'], 'abc.def');
});
test('cabeceras: toda respuesta de la app lleva la CSP completa exigida y las demás cabeceras de seguridad', async () => {
  const tok = await sign({});
  const respuestas = [
    await call(app, { query: {}, headers: {} }),
    await call(app, { query: { path: 'js/csv.js' }, headers: { authorization: 'Bearer ' + tok } }),
    await call(app, { query: { path: '%E0%A4%A' }, headers: { authorization: 'Bearer ' + tok } }),
    await call(users, { method: 'GET', headers: {} }),
  ];
  for (const r of respuestas) {
    assert.match(r.headers['content-security-policy'], /object-src 'none'.*base-uri 'self'.*frame-ancestors 'none'/);
    assert.match(r.headers['content-security-policy'], /script-src 'self' https:\/\/cdn\.jsdelivr\.net/);
    assert.match(r.headers['content-security-policy'], /connect-src [^;]*https:\/\/demo\.supabase\.co/);
    assert.equal(r.headers['content-security-policy-report-only'], undefined);
    assert.equal(r.headers['x-content-type-options'], 'nosniff');
    assert.equal(r.headers['x-frame-options'], 'DENY');
    assert.equal(r.headers['referrer-policy'], 'strict-origin-when-cross-origin');
    assert.ok(r.headers['strict-transport-security'] && r.headers['permissions-policy']);
  }
  assert.equal(respuestas[2].statusCode, 404); // URL mal codificada: no es un error 500
});
test('sesión: el servidor crea la cookie HttpOnly solo con un token válido, y la borra al salir', async () => {
  const tok = await sign({});
  const ok = await call(session, { method: 'POST', headers: {}, body: { access_token: tok } });
  assert.equal(ok.statusCode, 200);
  const c = ok.headers['set-cookie'];
  assert.match(c, /^metsi-at=/);
  for (const f of ['HttpOnly', 'Secure', 'SameSite=Lax', 'Path=/']) assert.ok(c.includes(f), 'falta ' + f);
  const age = Number(/Max-Age=(\d+)/.exec(c)[1]);
  assert.ok(age > 3000 && age <= 3600, 'Max-Age ' + age);
  assert.equal(parseCookies(c.split(';')[0])['metsi-at'], tok);
  // lo que el servidor puso sirve para entrar a la app
  const pag = await call(app, { query: { path: 'js/csv.js' }, headers: { cookie: c.split(';')[0] } });
  assert.equal(pag.statusCode, 200);
  // tokens malos: 401 y ninguna cookie
  for (const mal of [await sign({}, { secret: 'otro-secreto-otro-secreto-otro-secreto' }), 'basura', '', undefined, 5]) {
    const r = await call(session, { method: 'POST', headers: {}, body: { access_token: mal } });
    assert.equal(r.statusCode, 401);
    assert.equal(r.headers['set-cookie'], undefined);
  }
  const sinCuerpo = await call(session, { method: 'POST', headers: {} });
  assert.equal(sinCuerpo.statusCode, 401);
  const salir = await call(session, { method: 'DELETE', headers: {} });
  assert.match(salir.headers['set-cookie'], /^metsi-at=; Max-Age=0.*HttpOnly/);
  assert.equal((await call(session, { method: 'GET', headers: {} })).statusCode, 405);
  assert.equal((await call(session, { method: 'POST', headers: { 'x-forwarded-proto': 'http' }, body: { access_token: tok } })).headers['set-cookie'].includes('Secure'), false);
});
test('app: sin sesión, la página principal redirige a /login', async () => {
  const r = await call(app, { url: '/', query: { path: '' }, headers: {} });
  assert.equal(r.statusCode, 302); assert.equal(r.headers.location, '/login');
});
test('app: sin sesión, los archivos js dan 401 y no se entrega contenido', async () => {
  const r = await call(app, { url: '/js/scoring.js', query: { path: 'js/scoring.js' }, headers: {} });
  assert.equal(r.statusCode, 401); assert.ok(!r.body.includes('scoreQuestion'));
});
test('app: token firmado con otro secreto, vencido o roto se rechaza', async () => {
  for (const t of [await sign({}, { secret: 'otro-secreto-otro-secreto-otro-sec' }), await sign({}, { exp: Math.floor(Date.now() / 1000) - 60 }), 'basura']) {
    const r = await call(app, { url: '/', query: { path: 'js/scoring.js' }, headers: { cookie: 'metsi-at=' + t } });
    assert.equal(r.statusCode, 401);
  }
});
test('app: con sesión válida sirve index.html y js', async () => {
  const h = { cookie: 'metsi-at=' + await sign({}) };
  const a = await call(app, { url: '/', query: { path: '' }, headers: h });
  assert.equal(a.statusCode, 200); assert.match(a.headers['content-type'], /html/); assert.ok(String(a.body).includes('METSI'));
  const b = await call(app, { url: '/', query: { path: 'js/scoring.js' }, headers: h });
  assert.equal(b.statusCode, 200); assert.match(b.headers['content-type'], /javascript/);
});
test('app: con sesión no se pueden leer archivos fuera de la app (server, .env, ..)', async () => {
  const h = { cookie: 'metsi-at=' + await sign({}) };
  for (const p of ['server/auth.js', 'api/users.js', 'package.json', '.env', 'js/../package.json', '../etc/passwd', 'tests/run.js']) {
    const r = await call(app, { url: '/', query: { path: p }, headers: h });
    assert.equal(r.statusCode, 404, p);
  }
});
test('app: verifica con claves públicas (JWKS) cuando no hay secreto HS256', async () => {
  const { publicKey, privateKey } = await jose.generateKeyPair('ES256');
  const fakeJose = { ...jose, createRemoteJWKSet: () => async () => publicKey };
  const t = await new jose.SignJWT({}).setProtectedHeader({ alg: 'ES256' }).setSubject('u9').setIssuer(URL_ + '/auth/v1').setAudience('authenticated').setExpirationTime('1h').sign(privateKey);
  const e = { SUPABASE_URL: URL_ };
  const ok = await call(app, { url: '/', query: { path: 'css/style.css' }, headers: { authorization: 'Bearer ' + t } }, { env: e, jose: fakeJose });
  assert.equal(ok.statusCode, 200);
});
test('users: sin sesión 401; docente 403; ninguno toca la base', async () => {
  const m = mockSupabase();
  assert.equal((await call(users, { method: 'GET', headers: {} }, m)).statusCode, 401);
  const doc = await sign({ app_metadata: { role: 'docente' } }, { sub: 'u2' });
  for (const method of ['GET', 'POST', 'PATCH', 'DELETE']) {
    const r = await call(users, { method, headers: { authorization: 'Bearer ' + doc }, body: { id: 'u1', email: 'a@b.com', password: '12345678' } }, m);
    assert.equal(r.statusCode, 403, method);
  }
  assert.equal(m.db.size, 2);
});
test('users: un docente no puede ascenderse editando su propio token (el rol sale de app_metadata)', async () => {
  const m = mockSupabase();
  const t = await sign({ user_metadata: { role: 'admin' }, role: 'admin' }, { sub: 'u2' });
  assert.equal((await call(users, { method: 'GET', headers: { authorization: 'Bearer ' + t } }, m)).statusCode, 403);
});
test('users: el admin lista, crea, desactiva, cambia contraseña y borra', async () => {
  const m = mockSupabase();
  const h = { authorization: 'Bearer ' + await sign({ app_metadata: { role: 'admin' } }, { sub: 'u1' }) };
  const list = JSON.parse((await call(users, { method: 'GET', headers: h }, m)).body);
  assert.equal(list.users.length, 2); assert.equal(list.users.find((u) => u.id === 'u1').role, 'admin');
  const c = await call(users, { method: 'POST', headers: h, body: { email: 'Nuevo@X.com', password: '12345678' } }, m);
  assert.equal(c.statusCode, 201); assert.equal(JSON.parse(c.body).user.email, 'nuevo@x.com'); assert.equal(JSON.parse(c.body).user.role, 'docente');
  assert.equal((await call(users, { method: 'POST', headers: h, body: { email: 'nuevo@x.com', password: '12345678' } }, m)).statusCode, 422);
  assert.equal((await call(users, { method: 'POST', headers: h, body: { email: 'x@x.com', password: 'corta' } }, m)).statusCode, 400);
  const off = JSON.parse((await call(users, { method: 'PATCH', headers: h, body: { id: 'u2', active: false } }, m)).body);
  assert.equal(off.user.active, false);
  assert.equal(JSON.parse((await call(users, { method: 'PATCH', headers: h, body: { id: 'u2', active: true } }, m)).body).user.active, true);
  assert.equal((await call(users, { method: 'PATCH', headers: h, body: { id: 'u2', password: '87654321' } }, m)).statusCode, 200);
  assert.equal((await call(users, { method: 'DELETE', headers: h, body: { id: 'u2' } }, m)).statusCode, 200);
  assert.ok(!m.db.has('u2'));
});
test('users: un rol que no sea admin ni docente se rechaza con 400 y no toca la base', async () => {
  const m = mockSupabase();
  const hdr = { authorization: 'Bearer ' + (await sign({ app_metadata: { role: 'admin' } })) };
  const antes = JSON.stringify([...m.db.values()]);
  for (const role of ['superadmin', 'ADMIN', '', 5, ['admin'], { a: 1 }]) {
    const a = await call(users, { method: 'POST', headers: hdr, body: { email: 'nuevo@x.com', password: '12345678', role } }, { createClient: m.createClient });
    assert.equal(a.statusCode, 400, 'POST ' + JSON.stringify(role));
    const b = await call(users, { method: 'PATCH', headers: hdr, body: { id: 'u2', role } }, { createClient: m.createClient });
    assert.equal(b.statusCode, 400, 'PATCH ' + JSON.stringify(role));
  }
  assert.equal(JSON.stringify([...m.db.values()]), antes);
  const ok = await call(users, { method: 'POST', headers: hdr, body: { email: 'nuevo@x.com', password: '12345678', role: 'docente' } }, { createClient: m.createClient });
  assert.equal(ok.statusCode, 201);
});
test('users: el admin no puede desactivarse, degradarse ni borrarse a sí mismo', async () => {
  const m = mockSupabase();
  const h = { authorization: 'Bearer ' + await sign({ app_metadata: { role: 'admin' } }, { sub: 'u1' }) };
  assert.equal((await call(users, { method: 'PATCH', headers: h, body: { id: 'u1', active: false } }, m)).statusCode, 400);
  assert.equal((await call(users, { method: 'PATCH', headers: h, body: { id: 'u1', role: 'docente' } }, m)).statusCode, 400);
  assert.equal((await call(users, { method: 'DELETE', headers: h, body: { id: 'u1' } }, m)).statusCode, 400);
  assert.ok(m.db.has('u1'));
});

(async () => {
  let failed = 0;
  for (const [name, fn] of tests) {
    try { await fn(); console.log('  ok  ' + name); } catch (e) { failed++; console.log('FALLA ' + name + '\n' + (e.stack || e)); }
  }
  console.log(`${tests.length - failed} pasaron, ${failed} fallaron (acceso)`);
  process.exit(failed ? 1 : 0);
})();
