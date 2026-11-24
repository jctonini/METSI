// Cabeceras de seguridad de las respuestas de Vercel.
//
// - La política que se EXIGE (`Content-Security-Policy`) solo lleva reglas que no pueden romper la app:
//   sin plugins, sin cambiar la base de las direcciones, sin que otro sitio la meta en un marco.
// - La política completa (qué scripts, conexiones e imágenes se permiten) va en `Content-Security-Policy-Report-Only`:
//   el navegador NO bloquea nada, solo avisa en la consola (F12) lo que bloquearía. Cuando se confirme en un
//   navegador real que no avisa nada con Drive, el selector y el login, se pasa a `Content-Security-Policy`.
const ENFORCED = "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";

function supabaseOrigin(env) {
  try { return new URL(String((env && env.SUPABASE_URL) || '')).origin; } catch (e) { return 'https://*.supabase.co'; }
}

function fullPolicy(env) {
  return [
    "default-src 'self'",
    "script-src 'self' https://cdn.jsdelivr.net https://accounts.google.com https://apis.google.com",
    "style-src 'self' 'unsafe-inline'", // la app usa estilos en línea (barras, hoja imprimible)
    "img-src 'self' data: blob: https://*.googleusercontent.com https://*.gstatic.com",
    `connect-src 'self' https://www.googleapis.com https://accounts.google.com ${supabaseOrigin(env)}`,
    'frame-src https://accounts.google.com https://docs.google.com https://drive.google.com https://content.googleapis.com',
    "worker-src 'self' blob:",
    ENFORCED,
  ].join('; ');
}

function securityHeaders(env) {
  return {
    'Content-Security-Policy': ENFORCED,
    'Content-Security-Policy-Report-Only': fullPolicy(env),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), payment=(), usb=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
  };
}

const apply = (res, env) => { for (const [k, v] of Object.entries(securityHeaders(env))) res.setHeader(k, v); };

module.exports = { ENFORCED, fullPolicy, securityHeaders, apply };
