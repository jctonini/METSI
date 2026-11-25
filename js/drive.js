// Cliente mínimo de Google Drive (API REST v3) con el permiso `drive.file`:
// la app solo ve los archivos que ella misma crea.
// Estructura en Drive:  METSI Corrector / <examen> / datos.json, resultados.csv, hoja-<id>.jpg
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MetsiDrive = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const API = 'https://www.googleapis.com/drive/v3/files';
  const UPLOAD = 'https://www.googleapis.com/upload/drive/v3/files';
  const FOLDER = 'application/vnd.google-apps.folder';
  const ROOT_NAME = 'METSI Corrector';
  const q = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  // Los identificadores de Drive van dentro de URLs y de búsquedas: solo letras, números, guion y guion bajo.
  const safeId = (x) => {
    if (!/^[A-Za-z0-9_-]{1,100}$/.test(String(x))) throw new Error('Identificador de Drive no válido');
    return String(x);
  };

  const { withRetry } = typeof require === 'function' ? require('./retry.js') : self.MetsiRetry;

  // deps: { fetch, getToken, refreshToken?, sleep?, retries?, baseMs?, onRetry? }
  //  - getToken devuelve una promesa con el access token.
  //  - refreshToken (opcional) pide un token nuevo: se usa una vez si Drive responde 401 (token vencido).
  //  - Los cortes de red y las respuestas 408/429/5xx se reintentan con espera creciente (ver js/retry.js).
  function createDrive(deps) {
    function send(url, opts, token) {
      return deps.fetch(url, Object.assign({}, opts, {
        headers: Object.assign({ Authorization: 'Bearer ' + token }, (opts && opts.headers) || {}),
      })).catch((cause) => {
        const err = new Error('Sin conexión con Drive');
        err.network = true;
        err.cause = cause;
        throw err;
      });
    }

    async function call(url, opts) {
      let refreshed = false;
      return withRetry(async () => {
        let res = await send(url, opts, await deps.getToken());
        if (res.status === 401 && deps.refreshToken && !refreshed) {
          refreshed = true;
          res = await send(url, opts, await deps.refreshToken());
        }
        if (!res.ok) {
          const err = new Error('Drive respondió ' + res.status);
          err.status = res.status;
          try { err.detail = await res.text(); } catch (e) { /* sin detalle */ }
          throw err;
        }
        return res;
      }, { retries: deps.retries, baseMs: deps.baseMs, sleep: deps.sleep, onRetry: deps.onRetry });
    }

    async function list(query, fields) {
      const out = [];
      let pageToken = '';
      do {
        const url = `${API}?q=${encodeURIComponent(query)}&fields=${encodeURIComponent('nextPageToken,files(' + (fields || 'id,name') + ')')}&pageSize=200` +
          (pageToken ? '&pageToken=' + encodeURIComponent(pageToken) : '');
        const data = await (await call(url)).json();
        out.push(...(data.files || []));
        pageToken = data.nextPageToken || '';
      } while (pageToken);
      return out;
    }

    function multipart(meta, body, mime) {
      const boundary = 'metsi' + Math.random().toString(36).slice(2);
      const head = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n--${boundary}\r\nContent-Type: ${mime}\r\n\r\n`;
      return { body: new Blob([head, body, `\r\n--${boundary}--`]), type: `multipart/related; boundary=${boundary}` };
    }

    async function createFile(meta, body, mime) {
      const m = multipart(meta, body, mime);
      const res = await call(`${UPLOAD}?uploadType=multipart&fields=id,md5Checksum`, { method: 'POST', headers: { 'Content-Type': m.type }, body: m.body });
      return res.json(); // { id, md5Checksum }
    }

    // Identificadores ya conocidos de los archivos de cada carpeta (solo mientras la página está abierta): evita
    // buscar el mismo archivo en cada sincronización. `primed`: carpetas cuyo contenido ya se listó completo.
    const known = new Map(), primed = new Set();
    const key = (folderId, name) => folderId + '/' + name;

    async function createFolder(name, parent, appProperties) {
      const meta = { name, mimeType: FOLDER, appProperties };
      if (parent) meta.parents = [parent];
      const res = await call(`${API}?fields=id`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(meta) });
      return (await res.json()).id;
    }

    return {
      async ensureRootFolder() {
        const found = await list(`mimeType='${FOLDER}' and name='${q(ROOT_NAME)}' and trashed=false`);
        return found.length ? found[0].id : createFolder(ROOT_NAME, null, { kind: 'metsi-root' });
      },

      async findExamFolder(rootId, examId) {
        const found = await list(`'${safeId(rootId)}' in parents and mimeType='${FOLDER}' and appProperties has { key='examId' and value='${q(examId)}' } and trashed=false`);
        return found.length ? found[0].id : null;
      },

      createExamFolder(rootId, examId, name) {
        return createFolder(name, rootId, { kind: 'metsi-exam', examId });
      },

      // Subcarpeta con nombre fijo dentro de otra carpeta (se crea una sola vez).
      async ensureSubfolder(parentId, name) {
        const found = await list(`'${safeId(parentId)}' in parents and mimeType='${FOLDER}' and name='${q(name)}' and trashed=false`);
        return found.length ? found[0].id : createFolder(name, parentId, { kind: 'metsi-sub' });
      },

      async renameFolder(folderId, name) {
        await call(`${API}/${safeId(folderId)}?fields=id`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      },

      async listExams(rootId) {
        const files = await list(`'${safeId(rootId)}' in parents and mimeType='${FOLDER}' and appProperties has { key='kind' and value='metsi-exam' } and trashed=false`,
          'id,name,modifiedTime,appProperties');
        return files.map((f) => ({ folderId: f.id, name: f.name, modifiedTime: f.modifiedTime, examId: f.appProperties && f.appProperties.examId }))
          .sort((a, b) => String(b.modifiedTime).localeCompare(String(a.modifiedTime)));
      },

      // Lista una vez todo lo que hay en la carpeta y recuerda los identificadores: después, subir muchas fotos
      // nuevas no necesita una búsqueda por cada una.
      async prime(folderId) {
        if (primed.has(folderId)) return;
        const files = await list(`'${safeId(folderId)}' in parents and trashed=false`, 'id,name,mimeType');
        for (const f of files) if (f.mimeType !== FOLDER && !known.has(key(folderId, f.name))) known.set(key(folderId, f.name), f.id);
        primed.add(folderId);
      },

      // Olvida lo recordado de una carpeta (después de un error, o si alguien cambió la carpeta por fuera).
      forget(folderId) {
        primed.delete(folderId);
        for (const k of [...known.keys()]) if (k.startsWith(folderId + '/')) known.delete(k);
      },

      // Olvida todo lo recordado (todas las carpetas).
      forgetAll() { known.clear(); primed.clear(); },

      // Crea o reemplaza el archivo `name` dentro de la carpeta. Devuelve { id, md5Checksum } de lo que quedó en Drive.
      async upsertFileInfo(folderId, name, mime, content, appProperties) {
        const k = key(folderId, name);
        let id = known.get(k);
        if (!id && !primed.has(folderId)) {
          const found = await list(`'${safeId(folderId)}' in parents and name='${q(name)}' and trashed=false`);
          id = found.length ? found[0].id : null;
        }
        if (id) {
          try {
            const res = await call(`${UPLOAD}/${safeId(id)}?uploadType=media&fields=id,md5Checksum`, { method: 'PATCH', headers: { 'Content-Type': mime }, body: content });
            known.set(k, id);
            return res.json();
          } catch (e) {
            if (e.status !== 404) throw e; // el archivo ya no existe (lo borraron): se crea de nuevo
            known.delete(k);
          }
        }
        const created = await createFile({ name, parents: [folderId], appProperties }, content, mime);
        known.set(k, created.id);
        return created;
      },

      async upsertFile(folderId, name, mime, content, appProperties) {
        return (await this.upsertFileInfo(folderId, name, mime, content, appProperties)).id;
      },

      // Identificador de un archivo de la carpeta (o null si no está), usando lo recordado si se puede.
      async fileId(folderId, name) {
        const k = key(folderId, name);
        if (known.has(k)) return known.get(k);
        if (primed.has(folderId)) return null;
        const found = await list(`'${safeId(folderId)}' in parents and name='${q(name)}' and trashed=false`);
        if (!found.length) return null;
        known.set(k, found[0].id);
        return found[0].id;
      },

      // Huella (md5) del archivo en Drive, sin bajarlo; null si no existe.
      async fileMd5(folderId, name) {
        const id = await this.fileId(folderId, name);
        if (!id) return null;
        try {
          return (await (await call(`${API}/${safeId(id)}?fields=md5Checksum`)).json()).md5Checksum || null;
        } catch (e) {
          if (e.status === 404) { known.delete(key(folderId, name)); return null; }
          throw e;
        }
      },

      async readJson(folderId, name) {
        const id = await this.fileId(folderId, name);
        if (!id) return null;
        try {
          return await (await call(`${API}/${safeId(id)}?alt=media`)).json();
        } catch (e) {
          if (e.status === 404) { known.delete(key(folderId, name)); return null; }
          throw e;
        }
      },

      // Como readJson, pero si la huella actual es igual a `knownMd5` (lo último que esta app escribió o leyó)
      // no baja nada: { changed: false, md5 }. Si no, { changed: true, data, md5 } (data null si el archivo no existe).
      async readJsonIfChanged(folderId, name, knownMd5) {
        const md5 = await this.fileMd5(folderId, name);
        if (md5 && knownMd5 && md5 === knownMd5) return { changed: false, md5 };
        return { changed: true, data: md5 ? await this.readJson(folderId, name) : null, md5 };
      },

      async downloadBlob(fileId) {
        return (await call(`${API}/${safeId(fileId)}?alt=media`)).blob();
      },
    };
  }

  return { createDrive, ROOT_NAME };
});
