// Arranque de la interfaz: pestañas e inicio. El resto está en app-core, app-exam, app-scan, app-results y app-drive.
(function () {
  const App = window.MetsiApp;
  const { $, state, memory, Photos, clientId } = App;

  // ---------- pestañas ----------
  document.querySelectorAll('#tabs button').forEach((b) => {
    b.addEventListener('click', () => showTab(b.dataset.tab));
  });
  function showTab(name) {
    document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.id === 'tab-' + name));
    if (name === 'sheet') App.renderSheet();
    if (name === 'scan') App.renderCards();
    if (name === 'results') App.renderResults();
    if (name === 'users' && App.renderUsers) App.renderUsers();
    if (name === 'drive') $('drive-client').value = clientId();
  }

  // ---------- inicio ----------
  App.fillConfig();
  App.syncKeyToConfig();
  App.renderKey();
  $('app-version').textContent = window.METSI_VERSION ? 'versión ' + window.METSI_VERSION : '';
  App.renderPenaltyExample();
  $('drive-client').value = clientId();
  if (clientId()) App.loadGis().catch(() => {});
  App.updateSyncBar();

  // Recupera las fotos que no llegaron a subirse a Drive antes de cerrar la página.
  Photos.all().then(async (saved) => {
    let restored = 0;
    for (const { id, blob } of saved) {
      const sh = state.sheets.find((x) => x.id === id);
      if (!sh) { Photos.remove(id); continue; } // sin hoja asociada
      if (sh.photoId || memory.get(id)) { Photos.remove(id); continue; } // ya está en Drive o en memoria
      try {
        const bmp = await createImageBitmap(blob);
        const c = document.createElement('canvas');
        c.width = bmp.width; c.height = bmp.height;
        c.getContext('2d').drawImage(bmp, 0, 0);
        memory.set(id, { thumb: c });
        restored++;
      } catch (e) { /* foto ilegible: se ignora */ }
    }
    if (restored) { App.renderCards(); App.updateSyncBar(); }
  });

  Object.assign(App, { showTab });
})();
