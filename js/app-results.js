// Pestaña «4. Resultados»: tabla, aciertos por pregunta y exportación a CSV.
(function () {
  const App = window.MetsiApp;
  const { toDelimited, formatNumber } = MetsiCsv;
  const { LETTERS } = MetsiLayout;
  const Identity = MetsiIdentity;
  const { $, state, save, removeSheet, scoreOf, layout, letters, fmt, escapeHtml } = App;

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
    const an = Identity.analyze(state.sheets);
    App.renderBanner($('results-blockers'), an);
    App.renderReviewPanel();
    $('dl-csv').disabled = $('copy-tsv').disabled = App.isBlocked(an);
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
          s.modalidad == null ? '' : escapeHtml(L.modalidades[s.modalidad] || '')}</td><td><b>${fmt(score.total)}</b></td><td>${fmt(score.max)}</td><td>${fmt(score.percent)}%</td></tr>`;
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

  const blockExport = () => {
    const an = App.exportBlockers();
    if (!App.isBlocked(an)) return false;
    renderResults();
    alert('No se puede exportar todavía: ' + (an.missing.length ? an.missing.length + ' hoja(s) sin nombre ni registro. ' : '') + (an.hard.length ? an.hard.length + ' posible(s) repetido(s) sin resolver.' : ''));
    return true;
  };

  $('dl-csv').addEventListener('click', () => {
    if (blockExport()) return;
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
    if (blockExport()) return;
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

  Object.assign(App, { renderResults, exportRows });
})();
