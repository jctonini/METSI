// Número de versión de la app: un hash del contenido de js/ y css/. Se agrega como `?v=` a los
// archivos que carga index.html, así el navegador no reutiliza copias viejas cuando algo cambia.
//
//   node tools/version.js          -> actualiza index.html y js/version.js
//
// Una prueba (tests/run.js) falla si se olvidó correrlo después de cambiar el código.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const files = () => [
  ...fs.readdirSync(path.join(ROOT, 'js')).filter((f) => f.endsWith('.js') && f !== 'version.js').map((f) => 'js/' + f),
  'css/style.css',
].sort();

function compute() {
  const h = crypto.createHash('sha1');
  for (const f of files()) h.update(f + '\0').update(fs.readFileSync(path.join(ROOT, f))).update('\0');
  return h.digest('hex').slice(0, 8);
}

const TAG = /((?:src|href)="(?:js|css)\/[^"?]+?)(?:\?v=[0-9a-f]+)?(")/g;

function apply() {
  const v = compute();
  fs.writeFileSync(path.join(ROOT, 'js/version.js'), `// Generado por tools/version.js (no editar a mano).\nwindow.METSI_VERSION = '${v}';\n`);
  const p = path.join(ROOT, 'index.html');
  const html = fs.readFileSync(p, 'utf8').replace(TAG, (m, a, b) => `${a}?v=${v}${b}`);
  fs.writeFileSync(p, html);
  return v;
}

// Versiones que figuran en index.html (todas deberían ser iguales a la calculada).
function declared() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  return [...html.matchAll(/(?:src|href)="(?:js|css)\/[^"?]+\?v=([0-9a-f]+)"/g)].map((m) => m[1]);
}

if (require.main === module) console.log('versión', apply());
module.exports = { compute, apply, declared };
