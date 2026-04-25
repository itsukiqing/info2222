const {
  createSession,
  formatUser,
  supabaseRest,
  verifyPassword
} = require('../_lib/custom-auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const profiles = await supabaseRest(`profiles?select=id,username,email,full_name,role,password_hash,password_salt,password_iterations&email=eq.${encodeURIComponent(email)}&limit=1`);
    const profile = profiles[0];

    if (!profile || !profile.password_hash || !verifyPassword(password, profile)) {
      res.status(401).json({ error: 'Email or password is incorrect.' });
      return;
    }

    await createSession(res, profile.id);
    res.status(200).json({ user: formatUser(profile) });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not sign in.' });
  }
};
