// Interfaz de la app: configuración del examen, hoja imprimible, corrección por foto y resultados.
(function () {
  const { buildLayout, LETTERS } = MetsiLayout;
  const { scoreSheet } = MetsiScoring;
  const { sheetSVG } = MetsiSheet;
  const { scanImage, interpret, applyH } = MetsiScanner;
  const { toDelimited, formatNumber } = MetsiCsv;

  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = 'metsi.corrector.v1';
  const MAX_SIDE = 1600; // lado mayor con el que se analiza cada foto
  const THUMB_SIDE = 900; // lado mayor de la imagen que se conserva para revisar

  // ---------- estado ----------
  const defaults = () => ({
    cfg: { title: '', numQuestions: 10, numOptions: 4, regDigits: 7, modalidades: ['Presencial', 'Virtual'], penalty: 1, threshold: 0.25 },
    key: Array.from({ length: 10 }, () => ({ correct: [], points: 1 })),
    sheets: [],
  });
  let state = load();
  let nextId = state.sheets.reduce((m, s) => Math.max(m, s.id), 0) + 1;
  const memory = new Map(); // id -> { thumb, scan, error } (no se guarda en localStorage)

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (s && s.cfg && s.key && s.sheets) return s;
    } catch (e) { /* sin almacenamiento: se usa el estado por defecto */ }
    return defaults();
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignorado */ }
  }

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
  }

  // ---------- 1. examen ----------
  function fillConfig() {
    const c = state.cfg;
    $('cfg-title').value = c.title;
    $('cfg-q').value = c.numQuestions;
    $('cfg-opts').value = String(c.numOptions);
    $('cfg-digits').value = c.regDigits;
    $('cfg-mod').value = c.modalidades.join('\n');
    $('cfg-penalty').value = String(c.penalty);
    $('cfg-thr').value = String(c.threshold);
  }

  function confirmClearIfNeeded() {
    if (!state.sheets.length) return true;
    if (!confirm('Cambiar la estructura de la hoja borra las hojas ya corregidas. ¿Continuar?')) return false;
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
    structuralChange(() => { state.cfg.numQuestions = Math.max(1, Math.min(66, parseInt(e.target.value, 10) || 10)); });
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
  function renderSheet() {
    $('sheet-preview').innerHTML = sheetSVG(layout());
  }
  $('print-sheet').addEventListener('click', () => { renderSheet(); window.print(); });

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
    const id = nextId++;
    const L = layout();
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
      if (!scan.ok) {
        state.sheets.push({ id, fileName: file.name, failed: true, error: scan.error, answers: [], registro: '', modalidad: null, nombre: '' });
        return;
      }
      const t = document.createElement('canvas');
      const tk = Math.min(1, THUMB_SIDE / Math.max(c.width, c.height));
      t.width = Math.round(c.width * tk); t.height = Math.round(c.height * tk);
      t.getContext('2d').drawImage(c, 0, 0, t.width, t.height);
      memory.set(id, { thumb: t, scan, scale: tk });
      const r = interpret(scan, state.cfg.threshold);
      state.sheets.push({
        id, fileName: file.name, failed: false, nombre: '', registro: r.registro, modalidad: r.modalidad,
        answers: r.answers,
      });
    } catch (err) {
      state.sheets.push({ id, fileName: file.name, failed: true, error: 'No se pudo abrir la imagen.', answers: [], registro: '', modalidad: null, nombre: '' });
    }
  }

  // Burbujas dudosas según la sensibilidad actual (solo mientras la foto está en memoria).
  function flagsFor(sheet) {
    const mem = memory.get(sheet.id);
    if (!mem) return null;
    return interpret(mem.scan, state.cfg.threshold);
  }

  function drawOverlay(canvas, sheet, mem) {
    const L = layout();
    canvas.width = mem.thumb.width; canvas.height = mem.thumb.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(mem.thumb, 0, 0);
    const s = mem.scale * (mem.scan.imgScale || 1);
    const pts = (b) => { const p = applyH(mem.scan.H, b.x, b.y); return { x: p.x * s, y: p.y * s }; };
    const rad = Math.max(3, Math.abs(applyH(mem.scan.H, 0, 0).x - applyH(mem.scan.H, 2.2, 0).x) * s);
    for (const b of L.bubbles) {
      let marked = false;
      if (b.kind === 'ans') marked = sheet.answers[b.q] && sheet.answers[b.q].includes(b.opt);
      else if (b.kind === 'mod') marked = sheet.modalidad === b.index;
      else marked = sheet.registro[b.col] === String(b.digit);
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
        state.sheets = state.sheets.filter((x) => x.id !== sheet.id);
        memory.delete(sheet.id); save(); renderCards();
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
      fields.innerHTML = `
        <label>Nombre y apellido <input type="text" class="f-name" placeholder="(opcional)" value="${escapeHtml(sheet.nombre || '')}"></label>
        <label>N° de registro <input type="text" class="f-reg ${r && r.registroProblem ? 'warn' : ''}" inputmode="numeric" value="${escapeHtml(sheet.registro)}"></label>
        <label>Modalidad <select class="f-mod ${r && r.modalidadProblem ? 'warn' : ''}"><option value="">— sin dato —</option>${
          L.modalidades.map((m, i) => `<option value="${i}" ${sheet.modalidad === i ? 'selected' : ''}>${escapeHtml(m)}</option>`).join('')}</select></label>
        <div class="score">Puntaje <b>${score.total}</b> / ${score.max}</div>`;
      card.appendChild(fields);
      fields.querySelector('.f-name').addEventListener('change', (e) => { sheet.nombre = e.target.value; save(); });
      fields.querySelector('.f-reg').addEventListener('change', (e) => { sheet.registro = e.target.value.trim(); save(); });
      fields.querySelector('.f-mod').addEventListener('change', (e) => {
        sheet.modalidad = e.target.value === '' ? null : Number(e.target.value); save();
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
            save(); renderCards();
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

      const mem = memory.get(sheet.id);
      if (mem) {
        const det = document.createElement('details');
        det.innerHTML = '<summary>Ver foto con lo detectado</summary>';
        const canvas = document.createElement('canvas');
        canvas.className = 'photo';
        det.appendChild(canvas);
        det.addEventListener('toggle', () => { if (det.open) drawOverlay(canvas, sheet, mem); });
        card.appendChild(det);
      }
      const warn = [];
      if (r && r.registroProblem) warn.push('revisá el número de registro');
      if (r && r.modalidadProblem) warn.push('revisá la modalidad');
      const nr = sheet.answers.filter((a) => a.length === 0).length;
      if (nr) warn.push(`${nr} pregunta(s) sin marcar`);
      const nd = r ? r.flags.filter((f) => f.dubious).length : 0;
      if (nd) warn.push(`${nd} pregunta(s) con marcas dudosas`);
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
        const dup = regCount[s.registro] > 1 || /\?/.test(s.registro);
        return `<tr><td class="${dup ? 'warn' : ''}">${escapeHtml(s.registro)}${dup ? ' ⚠' : ''}</td><td>${escapeHtml(s.nombre || '')}</td><td>${
          s.modalidad == null ? '' : escapeHtml(L.modalidades[s.modalidad] || '')}</td><td><b>${score.total}</b></td><td>${score.max}</td><td>${score.percent}%</td></tr>`;
      }).join('')}</tbody></table><p class="muted">${rows.length} hoja(s). ⚠ = registro repetido o con dígitos sin leer.</p>`;

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
    state.sheets = []; memory.clear(); save(); renderResults();
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---------- inicio ----------
  fillConfig();
  syncKeyToConfig();
  renderKey();
})();
