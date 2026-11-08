// Pestaña «3. Corregir»: carga de fotos, lectura, revisión de duplicados y casos a revisar.
(function () {
  const App = window.MetsiApp;
  const { buildLayout, LETTERS } = MetsiLayout;
  const { scanImage, interpret, applyH, cropRegion } = MetsiScanner;
  const Identity = MetsiIdentity;
  const Similar = MetsiSimilar;
  const Review = MetsiReview;
  const selection = MetsiSelection.createSelection();
  const { $, state, memory, Photos, save, touch, removeSheet, scoreOf, clientId, layout, fmt, escapeHtml, newId, MAX_SIDE, THUMB_SIDE } = App;

  // ---------- 3. corregir ----------
  $('file').addEventListener('change', async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    await processFiles(files);
  });

  // Procesa una lista de fotos (de la galería o bajadas de Drive), de a una, y muestra el resumen.
  // Cada elemento es un File o { name, load() } (load baja la foto recién cuando le toca, así no se juntan todas en memoria).
  async function processFiles(files, label) {
    const tally = { added: 0, skipped: 0, discarded: 0, failed: 0 };
    const notDownloaded = [];
    for (let i = 0; i < files.length; i++) {
      $('status').textContent = `${label || 'Procesando'} ${i + 1} de ${files.length}…`;
      await new Promise((r) => setTimeout(r, 20)); // deja que se actualice la pantalla
      let file = files[i];
      if (typeof file.load === 'function') {
        try { file = await file.load(); } catch (err) { notDownloaded.push(file.name); tally.failed++; continue; }
      }
      tally[await processFile(file)]++;
    }
    const parts = [];
    if (tally.added) parts.push(`${tally.added} cargada(s)`);
    if (tally.skipped) parts.push(`${tally.skipped} omitida(s) por repetida(s)`);
    if (tally.discarded) parts.push(`${tally.discarded} descartada(s) por parecerse a otra hoja`);
    if (tally.failed) parts.push(`${tally.failed} con error de lectura`);
    $('status').textContent = files.length ? 'Listo: ' + parts.join(', ') + '.' : '';
    if (notDownloaded.length) $('status').textContent += ` No se pudo bajar de Drive: ${notDownloaded.join(', ')}. Volvé a elegirlas.`;
    save();
    renderCards();
    if (files.length && clientId() && !App.hasToken()) App.setStatus('Tocá “Sincronizar” para subir estas hojas a Drive.', 'warn-text');
  }

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

  // ---------- ventana de consulta ----------
  // buttons: [{ label, value, kind }]; `cancel` es el valor si se cierra con Esc.
  function askDialog({ title, html, buttons, cancel }) {
    return new Promise((resolve) => {
      const dlg = $('dlg');
      $('dlg-title').textContent = title;
      $('dlg-body').innerHTML = html;
      const act = $('dlg-actions');
      act.innerHTML = '';
      let done = false;
      const finish = (v) => { if (done) return; done = true; dlg.close(); resolve(v); };
      buttons.forEach((b) => {
        const el = document.createElement('button');
        el.type = 'button';
        el.textContent = b.label;
        if (b.kind) el.className = b.kind;
        el.addEventListener('click', () => finish(b.value));
        act.appendChild(el);
      });
      dlg.addEventListener('cancel', (e) => { e.preventDefault(); finish(cancel); }, { once: true });
      dlg.showModal();
    });
  }

  // Zonas que se recortan de la foto para que el docente lea nombre y registro.
  function displayRects(L) {
    return {
      name: L.version >= 2 ? { x: 16, y: 26.2, w: 116, h: 10.2 } : L.fields.name,
      reg: L.fields.reg,
    };
  }

  const sheetNumber = (sh) => state.sheets.indexOf(sh) + 1;
  const cropsHtml = (sh) => (sh.crops && sh.crops.reg
    ? `<div class="crops"><img alt="" src="${sh.crops.name}"><img alt="" src="${sh.crops.reg}"></div>` : '');

  const KIND_TEXT = {
    'same-data': (n, o) => `Tiene el mismo nombre y el mismo registro que la <b>Hoja ${n}</b>.`,
    'same-reg-diff-name': (n, o, sh) => `El registro <b>${escapeHtml(sh.registro)}</b> ya está en la <b>Hoja ${n}</b> con otro nombre («${escapeHtml(o.nombre)}»; esta hoja dice «${escapeHtml(sh.nombre)}»).`,
    'same-reg': (n, o, sh) => `El registro <b>${escapeHtml(sh.registro || o.registro)}</b> ya está cargado en la <b>Hoja ${n}</b>.`,
    'same-name-incomplete': (n, o, sh) => `El nombre coincide con el de la <b>Hoja ${n}</b> y a alguna de las dos le falta el registro: puede ser la misma persona.`,
  };

  // Consulta por cada conflicto sin resolver de la hoja. Devuelve 'ok' | 'edit' | 'removed'.
  async function resolveConflicts(sheet) {
    for (;;) {
      const list = Identity.conflictsFor(sheet, state.sheets);
      if (!list.length) return 'ok';
      const c = list[0];
      const n = sheetNumber(c.other);
      const ans = await askDialog({
        title: 'Posible alumno repetido',
        html: `<p>Esta hoja (<b>Hoja ${sheetNumber(sheet)}</b>): ${KIND_TEXT[c.kind](n, c.other, sheet)}</p>
          <p class="muted">Hoja ${n}:</p>${cropsHtml(c.other)}
          <p class="muted">Hoja ${sheetNumber(sheet)}:</p>${cropsHtml(sheet)}
          <p>¿Son personas distintas, o es la misma hoja cargada dos veces?</p>`,
        buttons: [
          { label: 'Son personas distintas: mantener las dos', value: 'keep' },
          { label: 'Es la misma hoja: quitar esta', value: 'remove', kind: 'danger' },
          { label: 'Corregir el dato', value: 'edit', kind: 'primary' },
        ],
        cancel: 'edit',
      });
      if (ans === 'keep') {
        sheet.ack = [...(sheet.ack || []), c.other.id];
        c.other.ack = [...(c.other.ack || []), sheet.id];
        sheet.updatedAt = c.other.updatedAt = Date.now();
        save();
      } else if (ans === 'remove') {
        removeSheet(sheet.id); save();
        return 'removed';
      } else return 'edit';
    }
  }

  // Al cambiar el nombre o el registro, la confirmación anterior ("son personas distintas") ya no vale.
  function clearAck(sheet) {
    sheet.ack = [];
    for (const o of state.sheets) if (o.ack && o.ack.includes(sheet.id)) { o.ack = o.ack.filter((x) => x !== sheet.id); o.updatedAt = Date.now(); }
  }

  // ---------- casos a revisar ----------
  function reviewCtx() {
    const c = state.cfg;
    return {
      letters: LETTERS, appVersion: window.METSI_VERSION || null,
      // Datos del examen que ayudan a analizar (sin nombres de alumnos).
      exam: { numQuestions: c.numQuestions, numOptions: c.numOptions, threshold: c.threshold, penalty: c.penalty, key: state.key },
    };
  }
  const buildCases = () => Review.buildCases(state.sheets, reviewCtx());

  function renderReviewPanel() {
    const box = $('review-panel');
    if (!box) return;
    const cases = buildCases();
    if (!cases.length) { box.innerHTML = '<p class="muted">Ninguna hoja marcada a revisar. Usá <b>🚩</b> en una hoja o en una pregunta cuando la app lea algo mal: queda guardado para analizarlo y mejorar la lectura. Las respuestas que corrijas a mano también quedan registradas (✎).</p>'; return; }
    const rows = cases.map((c) => {
      const n = state.sheets.findIndex((x) => x.id === c.id) + 1;
      const bits = [];
      if (c.failed) bits.push('no se pudo leer');
      if (c.flaggedQuestions.length) bits.push('preguntas marcadas: ' + c.flaggedQuestions.join(', '));
      if (c.edited.length) bits.push('corregidas a mano: ' + c.edited.map((e) => `${e.q} (${e.auto || '—'} → ${e.final || '—'})`).join(', '));
      if (c.note) bits.push('nota: ' + escapeHtml(c.note));
      return `<li><b>Hoja ${n}</b> · ${bits.join(' · ') || 'marcada'}</li>`;
    }).join('');
    box.innerHTML = `<p><b>${cases.length}</b> caso(s) para analizar. Si Drive está conectado, se guardan solos en <code>METSI Corrector / &lt;examen&gt; / a-revisar</code>, con la foto de la hoja <b>con el nombre, el registro y la fecha tapados</b>.</p><ul>${rows}</ul>`;
  }

  $('dl-cases').addEventListener('click', () => {
    const data = Review.wrap(buildCases(), reviewCtx());
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' }));
    a.download = 'casos-a-revisar.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });

  // Copia de la foto para análisis: se tapan nombre, registro y fecha (salvo que sea una foto ilegible y el docente haya elegido mandarla tal cual).
  async function maskedFull(sheet, blob) {
    const bmp = await createImageBitmap(blob);
    const c = document.createElement('canvas');
    c.width = bmp.width; c.height = bmp.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(bmp, 0, 0);
    if (sheet.scan && sheet.fullScale) {
      const L = buildLayout(state.cfg, sheet.version || 1);
      const H = sheet.scan.H.map((v, i) => (i < 6 ? v * sheet.fullScale : v));
      const rects = [displayRects(L).name, L.fields.reg];
      if (L.version >= 2) rects.push({ x: L.date.x - 3, y: L.date.y - 4, w: 132 - L.date.x + 3, h: 8 });
      ctx.fillStyle = '#000';
      for (const r of rects) {
        const pts = [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]].map(([x, y]) => applyH(H, x, y));
        ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath(); ctx.fill();
      }
    }
    return new Promise((res) => c.toBlob(res, 'image/jpeg', 0.88));
  }

  // Sube a la carpeta "a-revisar" del examen el archivo de casos y las fotos (tapadas) de las hojas marcadas.
  async function syncCases(folderId) {
    const wanted = state.sheets.filter((s) => Review.needsReview(s));
    if (!wanted.length) return;
    const sub = await App.drive.ensureSubfolder(folderId, 'a-revisar');
    for (const sh of wanted) {
      const mem = memory.get(sh.id);
      const rv = Review.ensure(sh);
      if (rv.imageFile || !mem || !mem.full) continue;
      if (sh.failed && !rv.sendImage) continue; // una foto ilegible solo se sube si el docente lo pidió
      const name = `original-${sh.id}.jpg`;
      await App.drive.upsertFile(sub, name, 'image/jpeg', await maskedFull(sh, mem.full), { examId: state.examId, sheetId: sh.id });
      rv.imageFile = name;
    }
    await App.drive.upsertFile(sub, 'casos.json', 'application/json', JSON.stringify(Review.wrap(buildCases(), reviewCtx()), null, 1), { examId: state.examId });
  }

  // Todo lo que impide exportar: hojas sin nombre ni registro y repetidos sin resolver.
  const exportBlockers = () => Identity.analyze(state.sheets);
  const isBlocked = (b) => b.missing.length > 0 || b.hard.length > 0;

  async function reviewConflicts() {
    for (let guard = 0; guard < 500; guard++) {
      const { hard } = exportBlockers();
      if (!hard.length) break;
      const res = await resolveConflicts(hard[0].a);
      if (res === 'edit') { App.showTab('scan'); focusSheet(hard[0].a.id); return; }
    }
    renderCards(); App.renderResults();
  }
  function focusSheet(id) {
    const card = document.querySelector(`[data-sheet="${id}"]`);
    if (card) { card.scrollIntoView({ block: 'start' }); const f = card.querySelector('.f-reg') || card.querySelector('.f-name'); if (f) f.focus(); }
  }

  // Devuelve 'added' | 'skipped' | 'discarded' | 'failed'
  async function processFile(file) {
    const id = newId();
    const now = Date.now();

    // 1) ¿Es exactamente el mismo archivo que ya se cargó?
    let fileHash = '';
    try { fileHash = Identity.hashBytes(new Uint8Array(await file.arrayBuffer())); } catch (e) { /* sin hash: se procesa igual */ }
    const sameFile = fileHash && state.sheets.find((x) => !x.failed && x.fileHash === fileHash);
    if (sameFile) {
      const ans = await askDialog({
        title: 'Esta foto ya fue cargada',
        html: `<p>«${escapeHtml(file.name)}» es idéntica a la foto de la <b>Hoja ${sheetNumber(sameFile)}</b>.</p>${cropsHtml(sameFile)}<p>¿Querés cargarla de todos modos?</p>`,
        buttons: [{ label: 'Omitir esta foto', value: 'skip', kind: 'primary' }, { label: 'Cargarla igual', value: 'load' }],
        cancel: 'skip',
      });
      if (ans === 'skip') return 'skipped';
    }

    let full = null; // foto reducida (1600 px) para poder mandarla a análisis si hace falta
    const failSheet = (error) => {
      if (full) memory.set(id, { full });
      state.sheets.push({ id, fileName: file.name, failed: true, error, answers: [], registro: '', modalidad: null, nombre: '', createdAt: now, updatedAt: now, appVersion: window.METSI_VERSION || null });
      return 'failed';
    };
    try {
      const bmp = await loadBitmap(file);
      const bw = bmp.width || bmp.naturalWidth, bh = bmp.height || bmp.naturalHeight;
      const k = Math.min(1, MAX_SIDE / Math.max(bw, bh));
      const c = document.createElement('canvas');
      c.width = Math.round(bw * k); c.height = Math.round(bh * k);
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(bmp, 0, 0, c.width, c.height);
      const img = ctx.getImageData(0, 0, c.width, c.height);
      full = await new Promise((res) => c.toBlob(res, 'image/jpeg', 0.88));
      // La app detecta sola la versión de la hoja (V1: las primeras impresas; V2: formato actual).
      const scan = scanImage(img, (v) => buildLayout(state.cfg, v));
      if (!scan.ok) return failSheet(scan.error);
      const L = scan.layout;
      const t = document.createElement('canvas');
      const tk = Math.min(1, THUMB_SIDE / Math.max(c.width, c.height));
      t.width = Math.round(c.width * tk); t.height = Math.round(c.height * tk);
      t.getContext('2d').drawImage(c, 0, 0, t.width, t.height);
      const r = interpret(scan, state.cfg.threshold, groupsOf(L));
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
      const rects = displayRects(L);
      const sheet = {
        id, fileName: file.name, fileHash, failed: false, version: scan.version, nombre: '', registro: '', modalidad: r.modalidad,
        answers: r.answers, createdAt: now, updatedAt: now, photoId: null,
        // Lo que leyó la app por su cuenta, para saber después qué corrigió el docente a mano.
        autoAnswers: r.answers.map((a) => a.slice()), autoModalidad: r.modalidad,
        appVersion: window.METSI_VERSION || null, fullScale: 1 / tk, review: { flag: false, note: '', q: {} },
        crops: { name: crop(rects.name), reg: crop(rects.reg) },
        // Firma de la letra: sirve para avisar si se fotografió dos veces el mismo papel.
        sig: Similar.signature((rect, ppm) => cropRegion(img, scan.H, rect, ppm), L),
        // Datos para revisar más tarde (también desde otro dispositivo): homografía ya
        // escalada a la miniatura y puntajes de cada burbuja.
        scan: {
          H: scan.H.map((v, i) => p7(i < 6 ? v * tk : v)),
          scores: { mod: scan.scores.mod.map(p3), ans: scan.scores.ans.map((a) => a.map(p3)) },
        },
      };

      // 2) ¿Parece el mismo papel fotografiado otra vez? (misma letra de nombre y registro)
      let best = null;
      for (const other of state.sheets) {
        if (other.failed || !other.sig) continue;
        const cmp = Similar.compare(sheet.sig, other.sig);
        if (cmp.score !== null && cmp.score >= Similar.SIMILAR_THRESHOLD && (!best || cmp.score > best.score)) best = { other, score: cmp.score };
      }
      if (best) {
        const ans = await askDialog({
          title: 'Esta foto parece una hoja ya cargada',
          html: `<p>La letra del nombre y del registro es muy parecida a la de la <b>Hoja ${sheetNumber(best.other)}</b> (parecido ${Math.round(best.score * 100)}%). Puede ser el mismo papel fotografiado dos veces.</p>
            <p class="muted">Hoja ${sheetNumber(best.other)} (ya cargada):</p>${cropsHtml(best.other)}
            <p class="muted">Esta foto:</p>${cropsHtml(sheet)}`,
          buttons: [
            { label: 'Es la misma hoja: descartar esta foto', value: 'discard', kind: 'primary' },
            { label: 'Es otra hoja: cargarla', value: 'keep' },
          ],
          cancel: 'keep',
        });
        if (ans === 'discard') return 'discarded';
      }
      memory.set(id, { thumb: t, full });
      t.toBlob((b) => { if (b) Photos.put(id, b); }, 'image/jpeg', 0.8); // copia local hasta que suba a Drive
      state.sheets.push(sheet);
      return 'added';
    } catch (err) {
      return failSheet('No se pudo abrir la imagen.');
    }
  }

  // Columnas de preguntas de la hoja: cada una tiene su propio nivel de fondo al interpretar.
  const groupsOf = (L) => L.ans.cols.map((c) => [c.qStart, c.qEnd]);

  // Dudas de lectura según la sensibilidad actual (usa los puntajes guardados de la hoja).
  function flagsFor(sheet) {
    return sheet.scan ? interpret(sheet.scan, state.cfg.threshold, groupsOf(buildLayout(state.cfg, sheet.version || 1))) : null;
  }

  function drawOverlay(canvas, sheet, mem) {
    const L = buildLayout(state.cfg, sheet.version || 1);
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

  // Aviso con lo que impide exportar (hojas sin nombre ni registro, repetidos sin resolver).
  function renderBanner(el, an) {
    if (!el) return;
    const items = [];
    if (an.missing.length) items.push(`${an.missing.length} hoja(s) sin nombre ni registro: ${an.missing.map((x) => 'Hoja ' + sheetNumber(x)).join(', ')}.`);
    if (an.hard.length) items.push(`${an.hard.length} posible(s) alumno(s) repetido(s) sin resolver: ${an.hard.map((c) => `Hoja ${sheetNumber(c.a)} y Hoja ${sheetNumber(c.b)}`).join('; ')}.`);
    el.hidden = !items.length;
    if (!items.length) { el.innerHTML = ''; return; }
    el.className = 'blockers';
    el.innerHTML = `<b>No se puede exportar todavía</b><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
    if (an.hard.length) {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'primary'; btn.textContent = 'Revisar repetidos';
      btn.addEventListener('click', reviewConflicts);
      el.appendChild(btn);
    }
  }

  // Barra de selección: Seleccionar todo, contador y Quitar seleccionadas.
  function renderBulkBar() {
    const bar = $('bulk-bar');
    const all = state.sheets.map((x) => x.id);
    selection.prune(all);
    bar.hidden = all.length === 0;
    const n = selection.size();
    const allBox = $('sel-all');
    allBox.checked = selection.allSelected(all);
    allBox.indeterminate = n > 0 && !allBox.checked;
    $('sel-count').textContent = n ? `${n} de ${all.length} seleccionada(s)` : `${all.length} hoja(s)`;
    $('sel-remove').disabled = n === 0;
    $('sel-remove').textContent = n ? `Quitar seleccionadas (${n})` : 'Quitar seleccionadas';
  }
  $('sel-all').addEventListener('change', () => {
    selection.toggleAll(state.sheets.map((x) => x.id));
    renderCards();
  });
  $('sel-remove').addEventListener('click', () => {
    const ids = selection.ids();
    if (!ids.length) return;
    if (!confirm(`Se van a quitar ${ids.length} hoja(s) de este examen. ¿Seguir?`)) return;
    ids.forEach((id) => removeSheet(id));
    selection.clear();
    save();
    renderCards();
    App.renderResults();
  });

  function renderCards() {
    renderBulkBar();
    const box = $('cards');
    box.innerHTML = '';
    const L = layout();
    const an = Identity.analyze(state.sheets);
    const missingIds = new Set(an.missing.map((x) => x.id));
    const hardIds = new Set(an.hard.flatMap((c) => [c.a.id, c.b.id]));
    renderBanner($('scan-banner'), an);
    state.sheets.forEach((sheet, idx) => {
      const card = document.createElement('div');
      card.className = 'card' + (sheet.failed ? ' failed' : '') + (missingIds.has(sheet.id) || hardIds.has(sheet.id) ? ' missing' : '');
      card.dataset.sheet = sheet.id;
      box.appendChild(card);
      const head = document.createElement('div');
      head.className = 'card-head';
      const pick = document.createElement('label');
      pick.className = 'sel'; pick.title = 'Seleccionar esta hoja';
      const pickBox = document.createElement('input');
      pickBox.type = 'checkbox'; pickBox.checked = selection.has(sheet.id);
      pickBox.addEventListener('change', () => { selection.toggle(sheet.id, pickBox.checked); renderBulkBar(); });
      pick.appendChild(pickBox);
      head.appendChild(pick);
      const title = document.createElement('span');
      title.innerHTML = `<b>Hoja ${idx + 1}</b> <span class="muted">${sheet.failed ? '' : 'formato V' + (sheet.version || 1) + ' · '}${escapeHtml(sheet.fileName || '')}</span>`;
      head.appendChild(title);
      const del = document.createElement('button');
      del.className = 'danger small'; del.textContent = 'Quitar';
      del.addEventListener('click', () => {
        removeSheet(sheet.id); save(); renderCards();
      });
      const rv = Review.ensure(sheet);
      const flagBtn = document.createElement('button');
      flagBtn.type = 'button';
      flagBtn.className = 'small flagbtn' + (rv.flag ? ' on' : '');
      flagBtn.textContent = rv.flag ? '🚩 A revisar' : '⚑ Marcar a revisar';
      flagBtn.title = 'Marcá esta hoja para que se analice cómo la leyó la app';
      flagBtn.addEventListener('click', () => { rv.flag = !rv.flag; touch(sheet); renderCards(); });
      head.appendChild(flagBtn);
      head.appendChild(del);
      card.appendChild(head);
      if (rv.flag) {
        const note = document.createElement('textarea');
        note.className = 'f-note'; note.rows = 2; note.maxLength = 500;
        note.placeholder = 'Qué pasó (opcional): por ejemplo "la 12 no la leyó" o "rechazó la foto"';
        note.value = rv.note || '';
        note.addEventListener('change', () => { rv.note = note.value.trim(); touch(sheet); });
        card.appendChild(note);
      }
      if (sheet.failed) {
        const p = document.createElement('p');
        p.className = 'error'; p.textContent = sheet.error;
        card.appendChild(p);
        if (memory.get(sheet.id) && memory.get(sheet.id).full) {
          const send = document.createElement('button');
          send.type = 'button'; send.className = 'small';
          send.textContent = rv.sendImage ? '✔ La foto se enviará a análisis' : 'Enviar esta foto a análisis';
          send.disabled = !!rv.sendImage;
          send.title = 'Sube la foto a tu Drive (carpeta a-revisar) sin tapar nada';
          send.addEventListener('click', () => {
            if (!confirm('Esta foto no se pudo leer, así que no se pueden tapar el nombre ni el registro. Se va a subir a tu Drive (carpeta a-revisar) tal cual. ¿Seguir?')) return;
            rv.flag = true; rv.sendImage = true; touch(sheet); renderCards();
          });
          card.appendChild(send);
        }
        return;
      }
      const r = flagsFor(sheet);
      const score = scoreOf(sheet);
      const fields = document.createElement('div');
      fields.className = 'grid fields';
      const hasCrops = sheet.crops && sheet.crops.reg;
      fields.innerHTML = `
        ${hasCrops ? `<div class="crops wide"><img alt="Nombre escrito" src="${sheet.crops.name}"><img alt="Registro escrito" src="${sheet.crops.reg}"></div>` : ''}
        <label>Nombre y apellido <input type="text" class="f-name ${missingIds.has(sheet.id) ? 'warn' : ''}" placeholder="nombre o registro: hace falta uno" value="${escapeHtml(sheet.nombre || '')}"></label>
        <label>N° de registro <input type="text" class="f-reg ${missingIds.has(sheet.id) ? 'warn' : ''}" inputmode="numeric" placeholder="escribilo mirando la imagen" value="${escapeHtml(sheet.registro)}"></label>
        <label>Modalidad <select class="f-mod ${r && r.modalidadProblem ? 'warn' : ''}"><option value="">— sin dato —</option>${
          L.modalidades.map((m, i) => `<option value="${i}" ${sheet.modalidad === i ? 'selected' : ''}>${escapeHtml(m)}</option>`).join('')}</select></label>
        <div class="score">Puntaje <b>${fmt(score.total)}</b> / ${fmt(score.max)}</div>`;
      card.appendChild(fields);
      const afterIdChange = async () => {
        const res = await resolveConflicts(sheet);
        renderCards();
        if (res === 'edit') focusSheet(sheet.id);
      };
      fields.querySelector('.f-name').addEventListener('change', (e) => { sheet.nombre = e.target.value.trim(); clearAck(sheet); touch(sheet); afterIdChange(); });
      fields.querySelector('.f-reg').addEventListener('change', (e) => { sheet.registro = e.target.value.trim(); clearAck(sheet); touch(sheet); afterIdChange(); });
      fields.querySelector('.f-mod').addEventListener('change', (e) => {
        sheet.modalidad = e.target.value === '' ? null : Number(e.target.value); touch(sheet);
      });

      const rows = document.createElement('div');
      rows.className = 'answers';
      for (let q = 0; q < L.numQuestions; q++) {
        const row = document.createElement('div');
        const f = r && r.flags[q];
        const edited = !!sheet.autoAnswers && Review.editedQuestions({ answers: [sheet.answers[q]], autoAnswers: [sheet.autoAnswers[q] || []] }).length > 0;
        const flaggedQ = !!(rv.q && rv.q[q]);
        row.className = 'ans-row' + (f && f.dubious ? ' dubious' : '') + (sheet.answers[q].length === 0 ? ' blank' : '') + (flaggedQ ? ' flagged' : '');
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
        pt.className = 'qpts'; pt.textContent = `${fmt(pq.earned)}/${fmt(pq.max)}`;
        row.appendChild(pt);
        if (edited) {
          const ed = document.createElement('span');
          ed.className = 'edited'; ed.textContent = '✎'; ed.title = 'Corregida a mano (la app había leído otra cosa)';
          row.appendChild(ed);
        }
        const fl = document.createElement('button');
        fl.type = 'button'; fl.className = 'qflag' + (flaggedQ ? ' on' : '');
        fl.textContent = '🚩'; fl.title = flaggedQ ? 'Quitar la bandera de esta pregunta' : 'Marcar esta pregunta a revisar (la app no la leyó bien)';
        fl.addEventListener('click', () => { rv.q[q] = !flaggedQ; if (rv.q[q]) rv.flag = true; touch(sheet); renderCards(); });
        row.appendChild(fl);
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
              mem = await App.fetchPhoto(sheet);
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
      if (missingIds.has(sheet.id)) {
        const w = document.createElement('p');
        w.className = 'warn-text'; w.textContent = '⛔ Falta el nombre o el registro: cargá al menos uno para poder exportar.';
        card.insertBefore(w, rows);
      }
      for (const c of Identity.softFor(sheet, state.sheets, an)) {
        const w = document.createElement('p');
        w.className = 'muted'; w.textContent = `ℹ Mismo nombre que la Hoja ${sheetNumber(c.other)}, con otro registro (${c.other.registro}). Puede ser un homónimo.`;
        card.insertBefore(w, rows);
      }
      if (warn.length) {
        const w = document.createElement('p');
        w.className = 'warn-text'; w.textContent = '⚠ ' + warn.join(' · ');
        card.insertBefore(w, rows);
      }
    });
    if (!state.sheets.length) box.innerHTML = '<p class="muted">Todavía no cargaste ninguna hoja.</p>';
  }

  Object.assign(App, { processFiles, renderCards, renderBanner, renderReviewPanel, isBlocked, exportBlockers, loadBitmap, syncCases });
})();
