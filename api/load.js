// GET /api/load : GAS(Apps Script)から保存済みデータ(JSON)を取得して返す
const { setCors, isAuthorized, gasUrl } = require('./_lib');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });
  if (!isAuthorized(req)) return res.status(401).json({ error: 'unauthorized' });
  const url = gasUrl();
  if (!url) return res.status(500).json({ error: 'GAS_URL is not configured on Vercel' });
  try {
    const r = await fetch(url, { redirect: 'follow' });
    const text = await r.text();
    if (!r.ok) return res.status(502).json({ error: 'GAS responded with ' + r.status });
    try { JSON.parse(text); } catch (e) {
      return res.status(502).json({ error: 'GAS returned non-JSON (デプロイ設定を確認してください)' });
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).send(text);
  } catch (e) {
    return res.status(502).json({ error: String((e && e.message) || e) });
  }
};
