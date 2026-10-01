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

  // deps: { fetch, getToken }  (getToken devuelve una promesa con el access token)
  function createDrive(deps) {
    async function call(url, opts) {
      const token = await deps.getToken();
      const res = await deps.fetch(url, Object.assign({}, opts, {
        headers: Object.assign({ Authorization: 'Bearer ' + token }, (opts && opts.headers) || {}),
      }));
      if (!res.ok) {
        const err = new Error('Drive respondió ' + res.status);
        err.status = res.status;
        try { err.detail = await res.text(); } catch (e) { /* sin detalle */ }
        throw err;
      }
      return res;
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
      const res = await call(`${UPLOAD}?uploadType=multipart&fields=id`, { method: 'POST', headers: { 'Content-Type': m.type }, body: m.body });
      return (await res.json()).id;
    }

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
        const found = await list(`'${rootId}' in parents and mimeType='${FOLDER}' and appProperties has { key='examId' and value='${q(examId)}' } and trashed=false`);
        return found.length ? found[0].id : null;
      },

      createExamFolder(rootId, examId, name) {
        return createFolder(name, rootId, { kind: 'metsi-exam', examId });
      },

      async renameFolder(folderId, name) {
        await call(`${API}/${folderId}?fields=id`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      },

      async listExams(rootId) {
        const files = await list(`'${rootId}' in parents and mimeType='${FOLDER}' and appProperties has { key='kind' and value='metsi-exam' } and trashed=false`,
          'id,name,modifiedTime,appProperties');
        return files.map((f) => ({ folderId: f.id, name: f.name, modifiedTime: f.modifiedTime, examId: f.appProperties && f.appProperties.examId }))
          .sort((a, b) => String(b.modifiedTime).localeCompare(String(a.modifiedTime)));
      },

      // Crea o reemplaza el archivo `name` dentro de la carpeta.
      async upsertFile(folderId, name, mime, content, appProperties) {
        const found = await list(`'${folderId}' in parents and name='${q(name)}' and trashed=false`);
        if (found.length) {
          await call(`${UPLOAD}/${found[0].id}?uploadType=media&fields=id`, { method: 'PATCH', headers: { 'Content-Type': mime }, body: content });
          return found[0].id;
        }
        return createFile({ name, parents: [folderId], appProperties }, content, mime);
      },

      async readJson(folderId, name) {
        const found = await list(`'${folderId}' in parents and name='${q(name)}' and trashed=false`);
        if (!found.length) return null;
        return (await call(`${API}/${found[0].id}?alt=media`)).json();
      },

      async downloadBlob(fileId) {
        return (await call(`${API}/${fileId}?alt=media`)).blob();
      },
    };
  }

  return { createDrive, ROOT_NAME };
});
