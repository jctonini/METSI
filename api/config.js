// Datos públicos de Supabase para el navegador (la anon key está pensada para ir en el cliente).
module.exports = (req, res, deps) => {
  const env = (deps && deps.env) || process.env;
  require('../server/headers.js').apply(res, env);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify({ url: env.SUPABASE_URL || '', anonKey: env.SUPABASE_ANON_KEY || '' }));
};
