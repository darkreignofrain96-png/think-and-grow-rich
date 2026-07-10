// POST /api/save : 受け取ったデータをGAS(Apps Script)へ中継して保存
const { setCors, isAuthorized, gasUrl } = require('./_lib');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!isAuthorized(req)) return res.status(401).json({ error: 'unauthorized' });
  const url = gasUrl();
  if (!url) return res.status(500).json({ error: 'GAS_URL is not configured on Vercel' });
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(req.body || {}),
      redirect: 'follow',
    });
    if (!r.ok) return res.status(502).json({ error: 'GAS responded with ' + r.status });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: String((e && e.message) || e) });
  }
};
