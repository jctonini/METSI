// Drive simulado en memoria: implementa solo los pedidos que usa js/drive.js.
function createMockDrive() {
  const files = new Map();
  let counter = 0;
  const log = [];
  const respond = (obj, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
  const unq = (s) => s.replace(/\\(.)/g, '$1');

  function matches(f, q) {
    const parent = /'([^']+)' in parents/.exec(q);
    if (parent && !(f.parents || []).includes(parent[1])) return false;
    const mime = /mimeType='([^']+)'/.exec(q);
    if (mime && f.mimeType !== mime[1]) return false;
    const name = /(?<![A-Za-z])name='((?:[^'\\]|\\.)*)'/.exec(q);
    if (name && f.name !== unq(name[1])) return false;
    const prop = /appProperties has \{ key='([^']+)' and value='((?:[^'\\]|\\.)*)' \}/.exec(q);
    if (prop && !(f.appProperties && f.appProperties[prop[1]] === unq(prop[2]))) return false;
    if (/trashed=false/.test(q) && f.trashed) return false;
    return true;
  }

  async function bodyBuffer(body) {
    if (body == null) return Buffer.alloc(0);
    if (typeof body === 'string') return Buffer.from(body);
    if (Buffer.isBuffer(body)) return body;
    return Buffer.from(await body.arrayBuffer());
  }

  function parseMultipart(buf, contentType) {
    const boundary = /boundary=(.+)$/.exec(contentType)[1];
    const text = buf.toString('latin1');
    const parts = text.split('--' + boundary).slice(1, -1);
    const split = (p) => {
      const i = p.indexOf('\r\n\r\n');
      return { head: p.slice(0, i), body: p.slice(i + 4).replace(/\r\n$/, '') };
    };
    const meta = JSON.parse(Buffer.from(split(parts[0]).body, 'latin1').toString('utf8'));
    return { meta, content: Buffer.from(split(parts[1]).body, 'latin1') };
  }

  async function mockFetch(url, opts = {}) {
    const u = new URL(url);
    const method = (opts.method || 'GET').toUpperCase();
    const headers = {};
    for (const [k, v] of Object.entries(opts.headers || {})) headers[k.toLowerCase()] = v;
    log.push(`${method} ${u.pathname}${u.search.slice(0, 80)}`);
    if (!/^Bearer .+/.test(headers.authorization || '')) return respond({ error: 'sin credenciales' }, 401);
    const id = (u.pathname.match(/\/files\/([^/?]+)/) || [])[1];

    if (u.pathname === '/drive/v3/files' && method === 'GET') {
      const q = u.searchParams.get('q') || '';
      const list = [...files.values()].filter((f) => matches(f, q))
        .map((f) => ({ id: f.id, name: f.name, modifiedTime: f.modifiedTime, appProperties: f.appProperties, mimeType: f.mimeType }));
      return respond({ files: list });
    }
    if (u.pathname === '/drive/v3/files' && method === 'POST') {
      const meta = JSON.parse((await bodyBuffer(opts.body)).toString('utf8'));
      const f = { id: 'f' + ++counter, ...meta, content: Buffer.alloc(0), modifiedTime: new Date().toISOString() };
      files.set(f.id, f);
      return respond({ id: f.id });
    }
    if (u.pathname === '/upload/drive/v3/files' && method === 'POST') {
      const { meta, content } = parseMultipart(await bodyBuffer(opts.body), headers['content-type']);
      const f = { id: 'f' + ++counter, mimeType: 'application/octet-stream', ...meta, content, modifiedTime: new Date().toISOString() };
      files.set(f.id, f);
      return respond({ id: f.id });
    }
    if (u.pathname.startsWith('/upload/drive/v3/files/') && method === 'PATCH') {
      const f = files.get(id);
      if (!f) return respond({ error: 'no existe' }, 404);
      f.content = await bodyBuffer(opts.body);
      f.modifiedTime = new Date().toISOString();
      return respond({ id });
    }
    if (u.pathname.startsWith('/drive/v3/files/') && method === 'GET' && u.searchParams.get('alt') === 'media') {
      const f = files.get(id);
      if (!f) return respond({ error: 'no existe' }, 404);
      return new Response(f.content, { status: 200, headers: { 'Content-Type': f.mimeType } });
    }
    if (u.pathname.startsWith('/drive/v3/files/') && method === 'PATCH') {
      const f = files.get(id);
      if (!f) return respond({ error: 'no existe' }, 404);
      Object.assign(f, JSON.parse((await bodyBuffer(opts.body)).toString('utf8')));
      f.modifiedTime = new Date().toISOString();
      return respond({ id });
    }
    return respond({ error: 'no soportado: ' + method + ' ' + u.pathname }, 400);
  }

  return { fetch: mockFetch, files, log };
}

module.exports = { createMockDrive };
