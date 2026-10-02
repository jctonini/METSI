// Interfaz de la app: configuración del examen, hoja imprimible, corrección por foto y resultados.
(function () {
  const { buildLayout, maxQuestionsFor, DEFAULT_TEXTS, LETTERS } = MetsiLayout;
  const { scoreSheet } = MetsiScoring;
  const { sheetSVG } = MetsiSheet;
  const { scanImage, interpret, applyH, cropRegion } = MetsiScanner;
  const { toDelimited, formatNumber } = MetsiCsv;
  const { mergeStates } = MetsiMerge;

  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = 'metsi.corrector.v1';
  const SETTINGS_KEY = 'metsi.settings.v1';
  const MAX_SIDE = 1600; // lado mayor con el que se analiza cada foto
  const THUMB_SIDE = 900; // lado mayor de la imagen que se conserva para revisar

  // ---------- estado ----------
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const defaults = () => ({
    examId: newId(),
    examCreatedAt: Date.now(),
    cfg: { title: '', numQuestions: 10, numOptions: 4, regDigits: 7, modalidades: ['Presencial', 'A distancia'], penalty: 1, threshold: 0.1, thrVersion: 2,
      sheet: { subtitle: '', nameLabel: '', regLabel: '', modLabel: '', instructions: '', logo: '' } },
    key: Array.from({ length: 10 }, () => ({ correct: [], points: 1 })),
    sheets: [],
    deleted: {},
    cfgUpdatedAt: 0,
    cfgHash: '',
    lastSync: 0,
    driveFolderName: '',
  });
  // Completa campos nuevos en estados guardados antes (o provenientes de otro dispositivo).
  const fixCfg = (st) => {
    st.cfg.sheet = Object.assign({}, defaults().cfg.sheet, st.cfg.sheet);
    // La sensibilidad cambió de escala (ahora se mide sobre el nivel base de cada foto).
    if (st.cfg.thrVersion !== 2) {
      const old = Number(st.cfg.threshold);
      st.cfg.threshold = old <= 0.2 ? 0.06 : old >= 0.35 ? 0.2 : 0.1;
      st.cfg.thrVersion = 2;
    }
    return st;
  };
  let state = load();
  const memory = new Map(); // id -> { thumb } (fotos en memoria; no se guardan en localStorage)

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (s && s.cfg && s.key && s.sheets) {
        const merged = fixCfg(Object.assign(defaults(), s));
        merged.sheets.forEach((sh) => { sh.id = String(sh.id); sh.createdAt = sh.createdAt || 0; sh.updatedAt = sh.updatedAt || 0; });
        return merged;
      }
    } catch (e) { /* sin almacenamiento: se usa el estado por defecto */ }
    return defaults();
  }
  function save() {
    // Si cambió la configuración o la clave, se marca como modificada (para la sincronización).
    const h = JSON.stringify([state.cfg, state.key]);
    if (h !== state.cfgHash) { state.cfgHash = h; state.cfgUpdatedAt = Date.now(); }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignorado */ }
    updateSyncBar();
  }
  const touch = (sheet) => { sheet.updatedAt = Date.now(); save(); };
  function removeSheet(id) {
    state.sheets = state.sheets.filter((x) => x.id !== id);
    state.deleted[id] = Date.now();
    memory.delete(id);
  }

  const loadSettings = () => { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch (e) { return {}; } };
  const saveSettings = (s) => { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) { /* ignorado */ } };
  const clientId = () => (loadSettings().clientId || window.METSI_GOOGLE_CLIENT_ID || '').trim();

  const layout = () => buildLayout(state.cfg);
  const letters = (arr) => arr.map((i) => LETTERS[i]).join('');

  function scoreOf(sheet) {
    return scoreSheet(sheet.answers, state.key, state.cfg.penalty);
  }

  // ---------- pestañas ----------
  document.querySelectorAll('#tabs button').forEach((b) => {
    b.addEventListener('click', () => showTab(b.dataset.tab));
  });
  function showTab(name) {
    document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.id === 'tab-' + name));
    if (name === 'sheet') renderSheet();
    if (name === 'scan') renderCards();
    if (name === 'results') renderResults();
    if (name === 'drive') $('drive-client').value = clientId();
  }

  // ---------- 1. examen ----------
  const SHEET_FIELDS = [['sh-subtitle', 'subtitle'], ['sh-name', 'nameLabel'], ['sh-reg', 'regLabel'], ['sh-mod', 'modLabel'], ['sh-instr', 'instructions']];
  function fillConfig() {
    const c = state.cfg;
    $('cfg-title').value = c.title;
    $('cfg-q').value = c.numQuestions;
    $('cfg-q').max = maxQuestionsFor(c.numOptions, c.modalidades.length);
    $('cfg-opts').value = String(c.numOptions);
    $('cfg-digits').value = c.regDigits;
    $('cfg-mod').value = c.modalidades.join('\n');
    $('cfg-penalty').value = String(c.penalty);
    $('cfg-thr').value = String(c.threshold);
    for (const [id, k] of SHEET_FIELDS) {
      $(id).value = c.sheet[k] || '';
      $(id).placeholder = DEFAULT_TEXTS[k] || '';
    }
    $('sh-logo-prev').hidden = !c.sheet.logo;
    $('sh-logo-prev').src = c.sheet.logo || '';
  }

  function confirmClearIfNeeded() {
    if (!state.sheets.length) return true;
    if (!confirm('Cambiar la estructura de la hoja borra las hojas ya corregidas. ¿Continuar?')) return false;
    state.sheets.forEach((s) => { state.deleted[s.id] = Date.now(); });
    state.sheets = [];
    memory.clear();
    return true;
  }

  function structuralChange(apply) {
    const before = JSON.stringify([state.cfg.numQuestions, state.cfg.numOptions, state.cfg.regDigits, state.cfg.modalidades]);
    const prev = JSON.parse(JSON.stringify(state.cfg));
    apply();
    const after = JSON.stringify([state.cfg.numQuestions, state.cfg.numOptions, state.cfg.regDigits, state.cfg.modalidades]);
    if (before !== after && !confirmClearIfNeeded()) {
      state.cfg = prev;
      fillConfig();
      return;
    }
    syncKeyToConfig();
    save();
    renderKey();
  }

  function syncKeyToConfig() {
    const n = state.cfg.numQuestions;
    while (state.key.length < n) state.key.push({ correct: [], points: Number($('cfg-allpts').value) || 1 });
    state.key.length = n;
    state.key.forEach((k) => { k.correct = k.correct.filter((i) => i < state.cfg.numOptions); });
  }

  $('cfg-title').addEventListener('input', (e) => { state.cfg.title = e.target.value; save(); });
  $('cfg-q').addEventListener('change', (e) => {
    const cap = maxQuestionsFor(state.cfg.numOptions, state.cfg.modalidades.length);
    const want = parseInt(e.target.value, 10) || 10;
    if (want > cap) alert(`Con ${state.cfg.numOptions} opciones y ${state.cfg.modalidades.length} modalidades, la hoja A5 admite hasta ${cap} preguntas.`);
    structuralChange(() => { state.cfg.numQuestions = Math.max(1, Math.min(cap, want)); });
    fillConfig();
  });
  $('cfg-opts').addEventListener('change', (e) => {
    structuralChange(() => { state.cfg.numOptions = parseInt(e.target.value, 10); });
  });
  $('cfg-digits').addEventListener('change', (e) => {
    structuralChange(() => { state.cfg.regDigits = Math.max(1, Math.min(9, parseInt(e.target.value, 10) || 7)); });
    fillConfig();
  });
  $('cfg-mod').addEventListener('change', (e) => {
    structuralChange(() => {
      state.cfg.modalidades = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 8);
    });
    fillConfig();
  });
  $('cfg-penalty').addEventListener('change', (e) => { state.cfg.penalty = Number(e.target.value); save(); renderKey(); });
  $('cfg-thr').addEventListener('change', (e) => { state.cfg.threshold = Number(e.target.value); save(); renderCards(); });
  $('apply-pts').addEventListener('click', () => {
    const p = Number($('cfg-allpts').value);
    if (!(p >= 0)) return;
    state.key.forEach((k) => { k.points = p; });
    save(); renderKey();
  });

  function renderKey() {
    const box = $('key');
    box.innerHTML = '';
    state.key.forEach((k, q) => {
      const row = document.createElement('div');
      row.className = 'key-row' + (k.correct.length === 0 ? ' annulled' : '');
      const num = document.createElement('span');
      num.className = 'qnum';
      num.textContent = q + 1;
      row.appendChild(num);
      for (let o = 0; o < state.cfg.numOptions; o++) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip' + (k.correct.includes(o) ? ' on' : '');
        chip.textContent = LETTERS[o];
        chip.addEventListener('click', () => {
          k.correct = k.correct.includes(o) ? k.correct.filter((x) => x !== o) : [...k.correct, o].sort();
          save(); renderKey(); rescoreEverything();
        });
        row.appendChild(chip);
      }
      const pts = document.createElement('input');
      pts.type = 'number'; pts.min = 0; pts.step = 0.25; pts.value = k.points;
      pts.className = 'pts';
      pts.addEventListener('change', () => {
        k.points = Math.max(0, Number(pts.value) || 0);
        save(); renderKey(); rescoreEverything();
      });
      row.appendChild(pts);
      const lbl = document.createElement('span');
      lbl.className = 'ptslabel';
      lbl.textContent = k.correct.length === 0 ? 'pts · anulada' : k.correct.length > 1 ? `pts · ${round2(k.points / k.correct.length)} c/u` : 'pts';
      row.appendChild(lbl);
      box.appendChild(row);
    });
    $('max-total').textContent = round2(state.key.reduce((s, k) => s + (Number(k.points) || 0), 0));
  }
  const round2 = (n) => Math.round(n * 100) / 100;
  function rescoreEverything() { /* el puntaje se calcula al dibujar; esto refresca vistas abiertas */
    if ($('tab-scan').classList.contains('active')) renderCards();
    if ($('tab-results').classList.contains('active')) renderResults();
  }

  // ---------- 2. hoja ----------
  for (const [id, k] of SHEET_FIELDS) {
    $(id).addEventListener('input', (e) => { state.cfg.sheet[k] = e.target.value; save(); renderSheet(); });
  }
  $('sh-logo-file').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      const bmp = await loadBitmap(f);
      const w0 = bmp.width || bmp.naturalWidth, h0 = bmp.height || bmp.naturalHeight;
      const k = Math.min(1, 330 / w0, 170 / h0);
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(w0 * k)); c.height = Math.max(1, Math.round(h0 * k));
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(bmp, 0, 0, c.width, c.height);
      let url = c.toDataURL('image/png');
      if (url.length > 90000) url = c.toDataURL('image/jpeg', 0.85);
      state.cfg.sheet.logo = url;
      save(); fillConfig(); renderSheet();
    } catch (err) { alert('No se pudo abrir esa imagen.'); }
  });
  $('sh-logo-clear').addEventListener('click', () => { state.cfg.sheet.logo = ''; save(); fillConfig(); renderSheet(); });
  function renderSheet() {
    $('sheet-preview').innerHTML = sheetSVG(layout());
  }
  $('print-sheet').addEventListener('click', () => {
    const svg = sheetSVG(layout());
    const two = $('print-mode').value === '2';
    $('print-area').innerHTML = two ? `${svg}<div class="cut"></div>${svg}` : svg;
    $('page-style').textContent = `@page { size: ${two ? 'A4 landscape' : 'A5 portrait'}; margin: 0; }`;
    window.print();
  });

  // ---------- 3. corregir ----------
  $('file').addEventListener('change', async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    for (let i = 0; i < files.length; i++) {
      $('status').textContent = `Procesando ${i + 1} de ${files.length}…`;
      await new Promise((r) => setTimeout(r, 20)); // deja que se actualice la pantalla
      await processFile(files[i]);
    }
    $('status').textContent = files.length ? `Listo: ${files.length} foto(s) procesada(s).` : '';
    save();
    renderCards();
    if (files.length && clientId() && !hasToken()) setStatus('Tocá “Sincronizar” para subir estas hojas a Drive.', 'warn-text');
  });

  async function loadBitmap(file) {
    if (window.createImageBitmap) {
      try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) { /* cae al método clásico */ }
    }
    const url = URL.createObjectURL(file);
    try {
      return await new Promise((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = url;
      });
    } finally { URL.revokeObjectURL(url); }
  }

  async function processFile(file) {
    const id = newId();
    const L = layout();
    const now = Date.now();
    try {
      const bmp = await loadBitmap(file);
      const bw = bmp.width || bmp.naturalWidth, bh = bmp.height || bmp.naturalHeight;
      const k = Math.min(1, MAX_SIDE / Math.max(bw, bh));
      const c = document.createElement('canvas');
      c.width = Math.round(bw * k); c.height = Math.round(bh * k);
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(bmp, 0, 0, c.width, c.height);
      const img = ctx.getImageData(0, 0, c.width, c.height);
      const scan = scanImage(img, L);
      const fail = (error) => state.sheets.push({ id, fileName: file.name, failed: true, error, answers: [], registro: '', modalidad: null, nombre: '', createdAt: now, updatedAt: now });
      if (!scan.ok) { fail(scan.error); return; }
      const t = document.createElement('canvas');
      const tk = Math.min(1, THUMB_SIDE / Math.max(c.width, c.height));
      t.width = Math.round(c.width * tk); t.height = Math.round(c.height * tk);
      t.getContext('2d').drawImage(c, 0, 0, t.width, t.height);
      memory.set(id, { thumb: t });
      const r = interpret(scan, state.cfg.threshold);
      const p7 = (v) => Number(v.toPrecision(7));
      const p3 = (v) => Math.round(v * 1000) / 1000;
      // Recortes de lo escrito a mano (nombre y registro) para transcribirlos mirando la imagen.
      const crop = (rect) => {
        const cr = cropRegion(img, scan.H, rect, 10);
        const cc = document.createElement('canvas');
        cc.width = cr.width; cc.height = cr.height;
        cc.getContext('2d').putImageData(new ImageData(cr.data, cr.width, cr.height), 0, 0);
        return cc.toDataURL('image/jpeg', 0.8);
      };
      state.sheets.push({
        id, fileName: file.name, failed: false, nombre: '', registro: '', modalidad: r.modalidad,
        answers: r.answers, createdAt: now, updatedAt: now, photoId: null,
        crops: { name: crop(L.fields.name), reg: crop(L.fields.reg) },
        // Datos para revisar más tarde (también desde otro dispositivo): homografía ya
        // escalada a la miniatura y puntajes de cada burbuja.
        scan: {
          H: scan.H.map((v, i) => p7(i < 6 ? v * tk : v)),
          scores: { mod: scan.scores.mod.map(p3), ans: scan.scores.ans.map((a) => a.map(p3)) },
        },
      });
    } catch (err) {
      state.sheets.push({ id, fileName: file.name, failed: true, error: 'No se pudo abrir la imagen.', answers: [], registro: '', modalidad: null, nombre: '', createdAt: now, updatedAt: now });
    }
  }

  // Dudas de lectura según la sensibilidad actual (usa los puntajes guardados de la hoja).
  function flagsFor(sheet) {
    return sheet.scan ? interpret(sheet.scan, state.cfg.threshold) : null;
  }

  function drawOverlay(canvas, sheet, mem) {
    const L = layout();
    canvas.width = mem.thumb.width; canvas.height = mem.thumb.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(mem.thumb, 0, 0);
    const H = sheet.scan.H;
    const pts = (b) => applyH(H, b.x, b.y);
    const o = applyH(H, 0, 0), e = applyH(H, 2.2, 0);
    const rad = Math.max(3, Math.hypot(o.x - e.x, o.y - e.y));
    for (const b of L.bubbles) {
      let marked = false;
      if (b.kind === 'ans') marked = sheet.answers[b.q] && sheet.answers[b.q].includes(b.opt);
      else marked = sheet.modalidad === b.index;
      if (!marked) continue;
      const p = pts(b);
      ctx.beginPath(); ctx.arc(p.x, p.y, rad * 1.15, 0, 2 * Math.PI);
      ctx.lineWidth = 2; ctx.strokeStyle = '#0a8f3c'; ctx.stroke();
    }
  }

  function renderCards() {
    const box = $('cards');
    box.innerHTML = '';
    const L = layout();
    state.sheets.forEach((sheet, idx) => {
      const card = document.createElement('div');
      card.className = 'card' + (sheet.failed ? ' failed' : '');
      box.appendChild(card);
      const head = document.createElement('div');
      head.className = 'card-head';
      head.innerHTML = `<b>Hoja ${idx + 1}</b> <span class="muted">${escapeHtml(sheet.fileName || '')}</span>`;
      const del = document.createElement('button');
      del.className = 'danger small'; del.textContent = 'Quitar';
      del.addEventListener('click', () => {
        removeSheet(sheet.id); save(); renderCards();
      });
      head.appendChild(del);
      card.appendChild(head);
      if (sheet.failed) {
        const p = document.createElement('p');
        p.className = 'error'; p.textContent = sheet.error;
        card.appendChild(p);
        return;
      }
      const r = flagsFor(sheet);
      const score = scoreOf(sheet);
      const fields = document.createElement('div');
      fields.className = 'grid fields';
      const hasCrops = sheet.crops && sheet.crops.reg;
      fields.innerHTML = `
        ${hasCrops ? `<div class="crops wide"><img alt="Nombre escrito" src="${sheet.crops.name}"><img alt="Registro escrito" src="${sheet.crops.reg}"></div>` : ''}
        <label>Nombre y apellido <input type="text" class="f-name" placeholder="(opcional)" value="${escapeHtml(sheet.nombre || '')}"></label>
        <label>N° de registro <input type="text" class="f-reg ${sheet.registro ? '' : 'warn'}" inputmode="numeric" placeholder="escribilo mirando la imagen" value="${escapeHtml(sheet.registro)}"></label>
        <label>Modalidad <select class="f-mod ${r && r.modalidadProblem ? 'warn' : ''}"><option value="">— sin dato —</option>${
          L.modalidades.map((m, i) => `<option value="${i}" ${sheet.modalidad === i ? 'selected' : ''}>${escapeHtml(m)}</option>`).join('')}</select></label>
        <div class="score">Puntaje <b>${score.total}</b> / ${score.max}</div>`;
      card.appendChild(fields);
      fields.querySelector('.f-name').addEventListener('change', (e) => { sheet.nombre = e.target.value.trim(); touch(sheet); });
      fields.querySelector('.f-reg').addEventListener('change', (e) => { sheet.registro = e.target.value.trim(); e.target.classList.toggle('warn', !sheet.registro); touch(sheet); });
      fields.querySelector('.f-mod').addEventListener('change', (e) => {
        sheet.modalidad = e.target.value === '' ? null : Number(e.target.value); touch(sheet);
      });

      const rows = document.createElement('div');
      rows.className = 'answers';
      for (let q = 0; q < L.numQuestions; q++) {
        const row = document.createElement('div');
        const f = r && r.flags[q];
        row.className = 'ans-row' + (f && f.dubious ? ' dubious' : '') + (sheet.answers[q].length === 0 ? ' blank' : '');
        row.innerHTML = `<span class="qnum">${q + 1}</span>`;
        for (let o = 0; o < L.numOptions; o++) {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'chip' + (sheet.answers[q].includes(o) ? ' on' : '');
          chip.textContent = LETTERS[o];
          chip.addEventListener('click', () => {
            const a = sheet.answers[q];
            sheet.answers[q] = a.includes(o) ? a.filter((x) => x !== o) : [...a, o].sort();
            touch(sheet); renderCards();
          });
          row.appendChild(chip);
        }
        const pq = score.perQuestion[q];
        const pt = document.createElement('span');
        pt.className = 'qpts'; pt.textContent = `${pq.earned}/${pq.max}`;
        row.appendChild(pt);
        rows.appendChild(row);
      }
      card.appendChild(rows);

      if (sheet.scan && (memory.get(sheet.id) || sheet.photoId)) {
        const det = document.createElement('details');
        det.innerHTML = '<summary>Ver foto con lo detectado</summary>';
        const canvas = document.createElement('canvas');
        canvas.className = 'photo';
        const msg = document.createElement('p');
        msg.className = 'muted';
        det.appendChild(msg);
        det.appendChild(canvas);
        det.addEventListener('toggle', async () => {
          if (!det.open) return;
          try {
            let mem = memory.get(sheet.id);
            if (!mem) {
              msg.textContent = 'Descargando la foto desde Drive…';
              mem = await fetchPhoto(sheet);
            }
            msg.textContent = '';
            drawOverlay(canvas, sheet, mem);
          } catch (e) { msg.textContent = 'No se pudo traer la foto: ' + e.message; }
        });
        card.appendChild(det);
      }
      const warn = [];
      if (r && r.modalidadProblem) warn.push('revisá la modalidad');
      const nr = sheet.answers.filter((a) => a.length === 0).length;
      if (nr) warn.push(`${nr} pregunta(s) sin marcar`);
      const nd = r ? r.flags.filter((f) => f.dubious).length : 0;
      if (nd) warn.push(`${nd} pregunta(s) con marcas dudosas`);
      const regWarn = document.createElement('p');
      regWarn.className = 'warn-text';
      regWarn.textContent = '⚠ falta cargar el número de registro';
      regWarn.hidden = !!sheet.registro;
      card.insertBefore(regWarn, rows);
      fields.querySelector('.f-reg').addEventListener('input', (e) => { regWarn.hidden = !!e.target.value.trim(); });
      if (warn.length) {
        const w = document.createElement('p');
        w.className = 'warn-text'; w.textContent = '⚠ ' + warn.join(' · ');
        card.insertBefore(w, rows);
      }
    });
    if (!state.sheets.length) box.innerHTML = '<p class="muted">Todavía no cargaste ninguna hoja.</p>';
  }

  // ---------- 4. resultados ----------
  function tableData() {
    const L = layout();
    const rows = state.sheets.filter((s) => !s.failed).map((s) => ({ s, score: scoreOf(s) }));
    rows.sort((a, b) => String(a.s.registro).localeCompare(String(b.s.registro), undefined, { numeric: true }));
    const regCount = {};
    rows.forEach((r) => { regCount[r.s.registro] = (regCount[r.s.registro] || 0) + 1; });
    return { L, rows, regCount };
  }

  function renderResults() {
    const { L, rows, regCount } = tableData();
    const t = $('results-table');
    if (!rows.length) {
      t.innerHTML = '<p class="muted">Todavía no hay hojas corregidas.</p>';
      $('item-stats').innerHTML = '';
      return;
    }
    t.innerHTML = `<table><thead><tr><th>Registro</th><th>Nombre</th><th>Modalidad</th><th>Puntaje</th><th>Máx.</th><th>%</th></tr></thead><tbody>${
      rows.map(({ s, score }) => {
        const dup = !s.registro || regCount[s.registro] > 1;
        const img = (k) => (s.crops && s.crops[k] ? `<img class="mini" alt="" src="${s.crops[k]}">` : '');
        return `<tr><td class="${dup ? 'warn' : ''}">${s.registro ? escapeHtml(s.registro) : img('reg') || 'falta'}${dup ? ' ⚠' : ''}</td><td>${s.nombre ? escapeHtml(s.nombre) : img('name')}</td><td>${
          s.modalidad == null ? '' : escapeHtml(L.modalidades[s.modalidad] || '')}</td><td><b>${score.total}</b></td><td>${score.max}</td><td>${score.percent}%</td></tr>`;
      }).join('')}</tbody></table><p class="muted">${rows.length} hoja(s). ⚠ = registro repetido o sin cargar.</p>`;

    const stats = [];
    for (let q = 0; q < L.numQuestions; q++) {
      const full = rows.filter((r) => r.score.perQuestion[q].earned >= r.score.perQuestion[q].max).length;
      const counts = Array.from({ length: L.numOptions }, (_, o) => rows.filter((r) => r.s.answers[q].includes(o)).length);
      const blank = rows.filter((r) => r.s.answers[q].length === 0).length;
      const pct = Math.round((full / rows.length) * 100);
      stats.push(`<tr><td>${q + 1}</td><td><div class="bar"><i style="width:${pct}%"></i></div></td><td>${pct}%</td><td class="muted">${
        counts.map((c, o) => `${LETTERS[o]}: ${c}`).join(' · ')}${blank ? ` · en blanco: ${blank}` : ''}</td></tr>`);
    }
    $('item-stats').innerHTML = `<table><thead><tr><th>#</th><th>Puntaje completo</th><th></th><th>Opciones marcadas</th></tr></thead><tbody>${stats.join('')}</tbody></table>`;
  }

  function exportRows(sep) {
    const { L, rows } = tableData();
    const comma = sep === ';';
    const n = (v) => formatNumber(v, comma);
    const header = ['Registro', 'Nombre y apellido', 'Modalidad', 'Puntaje', 'Puntaje máximo', 'Porcentaje']
      .concat(Array.from({ length: L.numQuestions }, (_, i) => 'P' + (i + 1)))
      .concat(Array.from({ length: L.numQuestions }, (_, i) => 'Puntos P' + (i + 1)));
    const body = rows.map(({ s, score }) => [
      s.registro, s.nombre || '', s.modalidad == null ? '' : L.modalidades[s.modalidad] || '',
      n(score.total), n(score.max), n(score.percent),
      ...s.answers.map(letters),
      ...score.perQuestion.map((p) => n(p.earned)),
    ]);
    return [header, ...body];
  }

  $('dl-csv').addEventListener('click', () => {
    const sep = $('csv-sep').value;
    const text = '﻿' + toDelimited(exportRows(sep), sep);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
    const name = (state.cfg.title || 'resultados').replace(/[^\w\-áéíóúñÁÉÍÓÚÑ ]+/g, '').trim().replace(/\s+/g, '_');
    a.download = `${name || 'resultados'}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });

  $('copy-tsv').addEventListener('click', async () => {
    // Al pegar en una planilla de Sheets o Excel se usa punto como decimal si el separador no es ';'.
    const text = toDelimited(exportRows(','), '\t');
    try {
      await navigator.clipboard.writeText(text);
      alert('Copiado. Pegalo en una celda de Excel o Google Sheets.');
    } catch (e) {
      prompt('Copiá este texto (Ctrl+C) y pegalo en la planilla:', text);
    }
  });

  $('clear-all').addEventListener('click', () => {
    if (!state.sheets.length || !confirm('¿Borrar todas las hojas corregidas?')) return;
    state.sheets.slice().forEach((x) => removeSheet(x.id)); save(); renderResults();
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---------- Drive ----------
  let token = null, tokenExpiry = 0, gisPromise = null, syncing = false, autoTimer = null;
  const hasToken = () => !!token && Date.now() < tokenExpiry - 60000;

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

  function getToken() {
    if (hasToken()) return Promise.resolve(token);
    const id = clientId();
    if (!id) return Promise.reject(new Error('Falta el ID de cliente de Google (pestaña Drive).'));
    return loadGis().then(() => new Promise((res, rej) => {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: id,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (r) => {
          if (r.error) return rej(new Error(r.error_description || r.error));
          token = r.access_token;
          tokenExpiry = Date.now() + (Number(r.expires_in) || 3600) * 1000;
          res(token);
        },
        error_callback: (e) => rej(new Error('No se completó el inicio de sesión de Google (' + ((e && e.type) || 'cancelado') + ').')),
      });
      client.requestAccessToken({ prompt: '' });
    }));
  }

  const drive = MetsiDrive.createDrive({ fetch: (...a) => fetch(...a), getToken });
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
    $('sync-btn').textContent = '☁ Sincronizar';
    const n = pendingCount();
    if (!state.lastSync) setStatus(n ? 'Todavía no sincronizado con Drive.' : 'Conectado a Drive (sin datos para subir).', n ? 'warn-text' : 'muted');
    else if (n) setStatus(`Cambios sin sincronizar (${n}).`, 'warn-text');
    else setStatus('Sincronizado con Drive ✔ ' + new Date(state.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 'ok-text');
    // Si ya hay sesión abierta, los cambios suben solos a los pocos segundos.
    clearTimeout(autoTimer);
    if (n && hasToken()) autoTimer = setTimeout(() => syncNow().catch(() => {}), 2500);
  }

  function dataPayload() {
    return {
      version: 1, examId: state.examId, examCreatedAt: state.examCreatedAt,
      cfg: state.cfg, key: state.key, cfgUpdatedAt: state.cfgUpdatedAt, cfgHash: state.cfgHash,
      sheets: state.sheets.filter((x) => !x.failed), deleted: state.deleted,
    };
  }

  function refreshAll() {
    fillConfig(); syncKeyToConfig(); renderKey();
    renderSheet(); renderCards(); renderResults();
  }

  async function syncNow() {
    if (syncing) return;
    syncing = true;
    setStatus('Sincronizando con Drive…', 'muted');
    try {
      const root = await ensureRoot();
      let folderId = await drive.findExamFolder(root, state.examId);
      if (!folderId) folderId = await drive.createExamFolder(root, state.examId, folderName());
      else if (state.driveFolderName && state.driveFolderName !== folderName()) await drive.renameFolder(folderId, folderName());

      const remote = await drive.readJson(folderId, 'datos.json');
      if (remote && remote.examId === state.examId) {
        const before = state.cfgUpdatedAt;
        state = fixCfg(Object.assign(defaults(), mergeStates(state, remote)));
        if (state.cfgUpdatedAt !== before) { fillConfig(); renderKey(); }
      }

      for (const sh of state.sheets) {
        const mem = memory.get(sh.id);
        if (sh.failed || sh.photoId || !mem) continue;
        const blob = await new Promise((r) => mem.thumb.toBlob(r, 'image/jpeg', 0.8));
        sh.photoId = await drive.upsertFile(folderId, `hoja-${sh.id}.jpg`, 'image/jpeg', blob, { examId: state.examId, sheetId: sh.id });
      }

      state.lastSync = Date.now();
      state.driveFolderName = folderName();
      await drive.upsertFile(folderId, 'datos.json', 'application/json', JSON.stringify(dataPayload()), { examId: state.examId });
      await drive.upsertFile(folderId, 'resultados.csv', 'text/csv', toDelimited(exportRows(','), ','), { examId: state.examId });
      syncing = false;
      save();
      renderCards(); renderResults();
    } catch (e) {
      syncing = false;
      if (e.status === 401) token = null;
      setStatus('No se pudo sincronizar: ' + (e.message || e), 'error');
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
    if (!clientId()) showTab('drive'); else runSync();
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
      state = fixCfg(Object.assign(defaults(), remote, { lastSync: Date.now(), driveFolderName: ex.name }));
      state.sheets.forEach((sh) => { sh.id = String(sh.id); });
      save();
      refreshAll();
      showTab('results');
    } catch (e) { alert('No se pudo abrir el examen: ' + (e.message || e)); }
  }

  $('new-exam').addEventListener('click', async () => {
    if (!confirm('Se cierra este examen y se empieza uno nuevo con la misma configuración. Los resultados del actual quedan guardados (en Drive, si lo sincronizaste). ¿Seguir?')) return;
    if (clientId() && pendingCount()) {
      try { await syncNow(); } catch (e) { if (!confirm('No se pudo sincronizar con Drive. Si seguís, los cambios pendientes de este examen se pierden. ¿Seguir igual?')) return; }
    }
    const keep = { cfg: state.cfg, key: state.key };
    memory.clear();
    state = Object.assign(defaults(), { cfg: JSON.parse(JSON.stringify(keep.cfg)), key: JSON.parse(JSON.stringify(keep.key)) });
    save();
    refreshAll();
    showTab('scan');
  });


  // ---------- inicio ----------
  fillConfig();
  syncKeyToConfig();
  renderKey();
  $('drive-client').value = clientId();
  if (clientId()) loadGis().catch(() => {});
  updateSyncBar();
})();
