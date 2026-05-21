export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const response = await fetch(`${process.env.KV_REST_API_URL}/get/dashboard_state`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
    });
    const data = await response.json();
    if (data.result) {
      res.status(200).json(JSON.parse(data.result));
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar dados' });
  }
}
