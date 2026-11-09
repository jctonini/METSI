// Pestañas «1. Examen» y «2. Hoja»: configuración, clave de respuestas y hoja imprimible.
(function () {
  const App = window.MetsiApp;
  const { maxQuestionsFor, DEFAULT_TEXTS, LETTERS } = MetsiLayout;
  const { scoreQuestion } = MetsiScoring;
  const { sheetSVG } = MetsiSheet;
  const { $, state, memory, save, layout, fmt } = App;

  // ---------- 1. examen ----------
  const SHEET_FIELDS = [['sh-subtitle', 'subtitle'], ['sh-name', 'nameLabel'], ['sh-reg', 'regLabel'], ['sh-mod', 'modLabel'], ['sh-instr', 'instructions'], ['sh-legal', 'legal']];
  function fillConfig() {
    const c = state.cfg;
    $('cfg-title').value = c.title;
    $('cfg-q').value = c.numQuestions;
    $('cfg-q').max = maxQuestionsFor(c.numOptions, c.modalidades.length);
    $('cfg-opts').value = String(c.numOptions);
    $('cfg-digits').value = c.regDigits;
    $('cfg-mod').value = c.modalidades.join('\n');
    $('cfg-penalty').value = String(c.penalty);
    renderPenaltyExample();
    $('cfg-thr').value = String(c.threshold);
    for (const [id, k] of SHEET_FIELDS) {
      $(id).value = c.sheet[k] || '';
      $(id).placeholder = k === 'instructions' ? '(vacío: la hoja V4 no lleva este texto, la banda de ejemplos lo reemplaza)' : (DEFAULT_TEXTS[k] || '');
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
  function renderPenaltyExample() {
    const f = state.cfg.penalty;
    const key = { correct: [1, 2], points: 1 }; // ejemplo: correctas B y C, vale 1 punto
    const p = (marked) => fmt(scoreQuestion(marked, key, f).earned);
    $('penalty-example').textContent = `Ejemplo con el descuento actual (${fmt(f)}): en una pregunta de 1 punto con correctas B y C, si el alumno marca solo B y C recibe ${p([1, 2])}; si marca B y una incorrecta (tantas marcas como correctas) recibe ${p([1, 0])}; si marca B, C y una incorrecta recibe ${p([1, 2, 0])}; si marca las cinco opciones (A–E) recibe ${p([0, 1, 2, 3, 4])}.`;
  }
  $('cfg-penalty').addEventListener('change', (e) => {
    const v = Number(String(e.target.value).replace(',', '.'));
    state.cfg.penalty = isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.33;
    e.target.value = String(state.cfg.penalty);
    save(); renderPenaltyExample(); renderKey(); rescoreEverything();
  });
  $('cfg-thr').addEventListener('change', (e) => { state.cfg.threshold = Number(e.target.value); save(); App.renderCards(); });
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
      lbl.textContent = k.correct.length === 0 ? 'pts · anulada' : k.correct.length > 1 ? `pts · ${fmt(k.points / k.correct.length)} c/u` : 'pts';
      row.appendChild(lbl);
      box.appendChild(row);
    });
    $('max-total').textContent = fmt(state.key.reduce((s, k) => s + (Number(k.points) || 0), 0));
  }
  function rescoreEverything() { /* el puntaje se calcula al dibujar; esto refresca vistas abiertas */
    if ($('tab-scan').classList.contains('active')) App.renderCards();
    if ($('tab-results').classList.contains('active')) App.renderResults();
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
      const bmp = await App.loadBitmap(f);
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

  Object.assign(App, { fillConfig, syncKeyToConfig, renderKey, renderSheet, renderPenaltyExample, rescoreEverything });
})();
