const { formatUser, requireSessionProfile } = require('../_lib/custom-auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const profile = await requireSessionProfile(req, res);
  if (!profile) return;

  res.status(200).json({ user: formatUser(profile) });
};
