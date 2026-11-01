// Pestaña «Drive»: sesión de Google, sincronización con reintentos y exámenes guardados en Drive.
(function () {
  const App = window.MetsiApp;
  const { toDelimited } = MetsiCsv;
  const { mergeStates } = MetsiMerge;
  const { $, state, replaceState, memory, Photos, save, loadSettings, saveSettings, clientId, escapeHtml, defaults, fixCfg } = App;

  // ---------- Drive ----------
  let gisPromise = null, syncing = false, autoTimer = null;
  let syncError = null, retryTimer = null, retryAt = 0, retryCount = 0; // fallo de la última sincronización y reintento automático
  const RETRY_DELAYS = [15000, 30000, 60000, 120000, 300000]; // espera entre reintentos automáticos (el último se repite)

  function loadGis() {
    if (!gisPromise) {
      gisPromise = new Promise((res, rej) => {
        if (window.google && google.accounts && google.accounts.oauth2) return res();
        const sc = document.createElement('script');
        sc.src = 'https://accounts.google.com/gsi/client';
        sc.onload = res;
        sc.onerror = () => { gisPromise = null; rej(new Error('No se pudo cargar el acceso de Google. Revisá la conexión.')); };
        document.head.appendChild(sc);
      });
    }
    return gisPromise;
  }

  // Pide un token a Google. Con sesión abierta y permiso ya dado no muestra nada; si el navegador exige
  // interacción (ventana bloqueada), falla y el administrador de token pasa a 'needs-login' (botón Reconectar).
  function requestGoogleToken() {
    const id = clientId();
    if (!id) return Promise.reject(new Error('Falta el ID de cliente de Google (pestaña Drive).'));
    return loadGis().then(() => new Promise((res, rej) => {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: id,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (r) => (r.error ? rej(new Error(r.error_description || r.error)) : res(r)),
        error_callback: (e) => rej(new Error('No se completó el inicio de sesión de Google (' + ((e && e.type) || 'cancelado') + ').')),
      });
      client.requestAccessToken({ prompt: '' });
    }));
  }

  const auth = MetsiAuth.createTokenManager({ request: requestGoogleToken, onChange: () => updateSyncBar() });
  const hasToken = () => auth.has();
  const getToken = () => auth.get();

  const drive = MetsiDrive.createDrive({
    fetch: (...a) => fetch(...a),
    getToken,
    refreshToken: () => auth.refresh(), // si Drive responde 401, se pide un token nuevo y se reintenta una vez
    onRetry: (err, n) => { if (syncing) setStatus(`Sin conexión con Drive: reintentando (${n})…`, 'warn-text'); },
  });
  let rootFolderId = null;
  const ensureRoot = async () => rootFolderId || (rootFolderId = await drive.ensureRootFolder());
  const folderName = () => `${state.cfg.title || 'Examen'} · ${new Date(state.examCreatedAt).toISOString().slice(0, 10)}`;

  // ¿Hay algo que todavía no está en Drive?
  function pendingCount() {
    const t = state.lastSync || 0;
    const sheets = state.sheets.filter((x) => !x.failed && ((x.updatedAt || 0) > t || !x.photoId && memory.get(x.id))).length;
    return sheets + (state.cfgUpdatedAt > t ? 1 : 0);
  }

  function setStatus(text, kind) {
    const el = $('sync-status');
    el.textContent = text;
    el.className = kind || '';
  }

  function updateSyncBar() {
    if (syncing) return;
    const bar = $('syncbar');
    if (!clientId()) {
      bar.hidden = false;
      setStatus('Drive sin configurar: los resultados quedan solo en este dispositivo.', 'muted');
      $('sync-btn').textContent = 'Configurar';
      return;
    }
    bar.hidden = false;
    const n = pendingCount();
    const needsLogin = auth.status() === 'needs-login';
    $('sync-btn').textContent = needsLogin ? 'Reconectar con Google' : '☁ Sincronizar';
    const saved = n ? ` Tus cambios (${n}) quedan guardados en este dispositivo.` : '';
    if (needsLogin) setStatus('La sesión de Google venció y no se pudo renovar sola.' + saved + ' Tocá «Reconectar con Google».', 'error');
    else if (syncError) {
      const secs = Math.max(0, Math.round((retryAt - Date.now()) / 1000));
      setStatus('No se pudo sincronizar: ' + syncError + '.' + saved + (retryTimer ? ` Se reintenta solo en ${secs < 60 ? secs + ' s' : Math.round(secs / 60) + ' min'}.` : ''), 'error');
    } else if (!state.lastSync) setStatus(n ? 'Todavía no sincronizado con Drive.' : 'Conectado a Drive (sin datos para subir).', n ? 'warn-text' : 'muted');
    else if (n) setStatus(`Cambios sin sincronizar (${n}).`, 'warn-text');
    else setStatus('Sincronizado con Drive ✔ ' + new Date(state.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 'ok-text');
    // Si ya hay sesión abierta, los cambios suben solos a los pocos segundos.
    clearTimeout(autoTimer);
    if (n && hasToken() && !syncError) autoTimer = setTimeout(() => syncNow().catch(() => {}), 2500);
  }

  function dataPayload() {
    return {
      version: 1, examId: state.examId, examCreatedAt: state.examCreatedAt,
      cfg: state.cfg, key: state.key, cfgUpdatedAt: state.cfgUpdatedAt, cfgHash: state.cfgHash,
      sheets: state.sheets.filter((x) => !x.failed), deleted: state.deleted,
    };
  }

  function refreshAll() {
    App.fillConfig(); App.syncKeyToConfig(); App.renderKey();
    App.renderSheet(); App.renderCards(); App.renderResults();
  }

  function clearRetry() { clearTimeout(retryTimer); retryTimer = null; retryCount = 0; }

  // Tras un fallo, vuelve a sincronizar sola con espera creciente (15 s, 30 s, 1 min, 2 min, 5 min…).
  function scheduleRetry() {
    clearTimeout(retryTimer);
    if (!pendingCount()) { retryTimer = null; return; }
    const ms = RETRY_DELAYS[Math.min(retryCount, RETRY_DELAYS.length - 1)];
    retryCount++;
    retryAt = Date.now() + ms;
    retryTimer = setTimeout(() => { retryTimer = null; syncNow().catch(() => {}); }, ms);
  }

  // Al volver la conexión se reintenta enseguida.
  window.addEventListener('online', () => {
    if (clientId() && syncError && !syncing && auth.status() !== 'needs-login') { clearRetry(); syncNow().catch(() => {}); }
  });

  async function syncNow() {
    if (syncing) return;
    syncing = true;
    clearTimeout(retryTimer); retryTimer = null;
    setStatus('Sincronizando con Drive…', 'muted');
    try {
      const root = await ensureRoot();
      let folderId = await drive.findExamFolder(root, state.examId);
      if (!folderId) folderId = await drive.createExamFolder(root, state.examId, folderName());
      else if (state.driveFolderName && state.driveFolderName !== folderName()) await drive.renameFolder(folderId, folderName());

      const remote = await drive.readJson(folderId, 'datos.json');
      if (remote && remote.examId === state.examId) {
        const before = state.cfgUpdatedAt;
        replaceState(fixCfg(Object.assign(defaults(), mergeStates(state, remote))));
        if (state.cfgUpdatedAt !== before) { App.fillConfig(); App.renderKey(); }
      }

      const uploaded = [];
      for (const sh of state.sheets) {
        const mem = memory.get(sh.id);
        if (sh.failed || sh.photoId || !mem || !mem.thumb) continue;
        const blob = await new Promise((r) => mem.thumb.toBlob(r, 'image/jpeg', 0.8));
        sh.photoId = await drive.upsertFile(folderId, `hoja-${sh.id}.jpg`, 'image/jpeg', blob, { examId: state.examId, sheetId: sh.id });
        uploaded.push(sh.id);
      }

      await App.syncCases(folderId);
      state.lastSync = Date.now();
      state.driveFolderName = folderName();
      await drive.upsertFile(folderId, 'datos.json', 'application/json', JSON.stringify(dataPayload()), { examId: state.examId });
      await drive.upsertFile(folderId, 'resultados.csv', 'text/csv', toDelimited(App.exportRows(','), ','), { examId: state.examId });
      syncing = false;
      clearRetry();
      syncError = null;
      save();
      uploaded.forEach((id) => Photos.remove(id)); // ya están en Drive: se borra la copia local
      App.renderCards(); App.renderResults();
    } catch (e) {
      syncing = false;
      syncError = e.message || String(e);
      if (e.status === 401) auth.invalidate();
      // Los cambios siguen en este dispositivo (localStorage); se vuelve a intentar con espera creciente.
      if (auth.status() !== 'needs-login') scheduleRetry();
      updateSyncBar();
      throw e;
    } finally {
      syncing = false;
    }
  }

  // Fotos descargadas de Drive para revisar una hoja en otro dispositivo.
  async function fetchPhoto(sheet) {
    const blob = await drive.downloadBlob(sheet.photoId);
    const bmp = await createImageBitmap(blob);
    const t = document.createElement('canvas');
    t.width = bmp.width; t.height = bmp.height;
    t.getContext('2d').drawImage(bmp, 0, 0);
    const mem = { thumb: t };
    memory.set(sheet.id, mem);
    return mem;
  }

  async function runSync() {
    try { await syncNow(); } catch (e) { /* el estado ya muestra el error */ }
  }

  $('sync-btn').addEventListener('click', () => {
    if (!clientId()) App.showTab('drive'); else runSync();
  });
  $('drive-connect').addEventListener('click', () => { persistClientId(); runSync(); });
  function persistClientId() {
    const st = loadSettings();
    st.clientId = $('drive-client').value.trim();
    saveSettings(st);
    updateSyncBar();
  }
  $('drive-client').addEventListener('change', persistClientId);

  async function renderDriveExams() {
    const box = $('drive-exams');
    box.innerHTML = '<p class="muted">Buscando…</p>';
    try {
      const exams = await drive.listExams(await ensureRoot());
      if (!exams.length) { box.innerHTML = '<p class="muted">Todavía no hay exámenes guardados en Drive.</p>'; return; }
      box.innerHTML = '';
      exams.forEach((ex) => {
        const row = document.createElement('div');
        row.className = 'exam-row';
        const cur = ex.examId === state.examId;
        row.innerHTML = `<span><b>${escapeHtml(ex.name)}</b>${cur ? ' <span class="muted">(el que tenés abierto)</span>' : ''}<br><span class="muted">modificado ${new Date(ex.modifiedTime).toLocaleString()}</span></span>`;
        const btn = document.createElement('button');
        btn.textContent = cur ? 'Actualizar' : 'Abrir';
        btn.addEventListener('click', () => openFromDrive(ex));
        row.appendChild(btn);
        box.appendChild(row);
      });
    } catch (e) {
      box.innerHTML = `<p class="error">No se pudo leer Drive: ${escapeHtml(e.message || e)}</p>`;
    }
  }
  $('drive-list').addEventListener('click', renderDriveExams);

  async function openFromDrive(ex) {
    if (ex.examId === state.examId) { await runSync(); refreshAll(); return; }
    if (pendingCount() && !confirm('Hay cambios de este dispositivo sin sincronizar. Se subirán a Drive antes de abrir el otro examen. ¿Seguir?')) return;
    try {
      if (pendingCount()) await syncNow();
      const remote = await drive.readJson(ex.folderId, 'datos.json');
      if (!remote) { alert('Ese examen no tiene datos guardados.'); return; }
      memory.clear();
      replaceState(fixCfg(Object.assign(defaults(), remote, { lastSync: Date.now(), driveFolderName: ex.name })));
      state.sheets.forEach((sh) => { sh.id = String(sh.id); });
      save();
      refreshAll();
      App.showTab('results');
    } catch (e) { alert('No se pudo abrir el examen: ' + (e.message || e)); }
  }

  $('new-exam').addEventListener('click', async () => {
    if (!confirm('Se cierra este examen y se empieza uno nuevo con la misma configuración. Los resultados del actual quedan guardados (en Drive, si lo sincronizaste). ¿Seguir?')) return;
    if (clientId() && pendingCount()) {
      try { await syncNow(); } catch (e) { if (!confirm('No se pudo sincronizar con Drive. Si seguís, los cambios pendientes de este examen se pierden. ¿Seguir igual?')) return; }
    }
    const keep = { cfg: state.cfg, key: state.key };
    memory.clear();
    replaceState(Object.assign(defaults(), { cfg: JSON.parse(JSON.stringify(keep.cfg)), key: JSON.parse(JSON.stringify(keep.key)) }));
    save();
    refreshAll();
    App.showTab('scan');
  });

  Object.assign(App, { drive, hasToken, setStatus, updateSyncBar, fetchPhoto, loadGis, syncNow });
})();
