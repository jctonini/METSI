// Cabeceras de seguridad de las respuestas de Vercel.
//
// La política de contenido (CSP) se EXIGE: solo se cargan scripts, conexiones, imágenes y marcos de los sitios
// de la lista (la app, Google Drive y su selector, Supabase y el CDN del login). Se probó primero en modo solo-aviso
// (Content-Security-Policy-Report-Only) y la consola del navegador no mostró ningún aviso con el login, Drive y el selector.
// Si Google o Supabase cambian un dominio y algo deja de andar, la consola (F12) dice qué sitio se bloqueó.
const ENFORCED = "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";

function supabaseOrigin(env) {
  try { return new URL(String((env && env.SUPABASE_URL) || '')).origin; } catch (e) { return 'https://*.supabase.co'; }
}

function fullPolicy(env) {
  return [
    "default-src 'self'",
    "script-src 'self' https://accounts.google.com https://apis.google.com",
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
    'Content-Security-Policy': fullPolicy(env),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), payment=(), usb=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
  };
}

const apply = (res, env) => { for (const [k, v] of Object.entries(securityHeaders(env))) res.setHeader(k, v); };

module.exports = { ENFORCED, fullPolicy, securityHeaders, apply };
