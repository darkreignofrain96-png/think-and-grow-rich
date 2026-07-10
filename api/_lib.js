// 共有ヘルパー(先頭が _ のファイルはVercelのルートとして公開されない)
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-App-Token');
}

// ACCESS_TOKEN が設定されている場合のみトークンを要求する
function isAuthorized(req) {
  const token = process.env.ACCESS_TOKEN;
  if (!token) return true;
  return (req.headers['x-app-token'] || '') === token;
}

// Vercelの環境変数 GAS_URL (Apps ScriptのウェブアプリURL)
function gasUrl() {
  return (process.env.GAS_URL || '').trim();
}

module.exports = { setCors, isAuthorized, gasUrl };
