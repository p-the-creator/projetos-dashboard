export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url   = process.env.STORAGE_KV_REST_API_URL   || process.env.KV_REST_API_URL;
  const token = process.env.STORAGE_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return res.status(500).json({ error: 'Variáveis de ambiente não configuradas', vars: Object.keys(process.env).filter(k => k.includes('KV') || k.includes('REDIS') || k.includes('STORAGE')) });
  }

  try {
    const r = await fetch(`${url}/get/dashboard_state`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await r.json();
    if (data.result) {
      res.status(200).json(JSON.parse(data.result));
    } else {
      res.status(200).json(null);
    }
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
