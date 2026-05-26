export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { b64, prompt } = req.body;
  if (!b64) return res.status(400).json({ error: 'PDF não recebido.' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'pdfs-2024-09-25',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: b64 }
            },
            { type: 'text', text: prompt }
          ]
        }]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data?.error?.message || 'Erro na API.' });
    }

    const raw = data.content?.map(b => b.type === 'text' ? b.text : '').join('').trim();
    return res.status(200).json({ raw });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
