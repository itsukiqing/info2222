const { clearSession } = require('../_lib/custom-auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  await clearSession(req, res);
  res.status(200).json({ ok: true });
};
