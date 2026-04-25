const {
  createPasswordRecord,
  createSession,
  ensureShadowAuthUser,
  formatUser,
  supabaseRest
} = require('../_lib/custom-auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const username = String(req.body?.username || '').trim().toLowerCase();
  const fullName = String(req.body?.fullName || '').trim();

  if (!email || !password || !username || !fullName) {
    res.status(400).json({ error: 'Email, password, username, and full name are required.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters.' });
    return;
  }

  try {
    const [existingByEmail, existingByUsername] = await Promise.all([
      supabaseRest(`profiles?select=id,email&email=eq.${encodeURIComponent(email)}&limit=1`),
      supabaseRest(`profiles?select=id,username&username=eq.${encodeURIComponent(username)}&limit=1`)
    ]);
    if (existingByEmail.length || existingByUsername.length) {
      res.status(409).json({ error: 'An account with that email or username already exists.' });
      return;
    }

    const shadowUser = await ensureShadowAuthUser({ email, fullName, username });
    const passwordRecord = createPasswordRecord(password);

    const createdProfiles = await supabaseRest('profiles', {
      method: 'POST',
      body: {
        id: shadowUser.id,
        email,
        username,
        full_name: fullName,
        role: 'Team member',
        password_hash: passwordRecord.hash,
        password_salt: passwordRecord.salt,
        password_iterations: passwordRecord.iterations,
        password_algorithm: 'pbkdf2-sha256'
      }
    });

    const profile = createdProfiles[0];
    await createSession(res, profile.id);
    res.status(200).json({ user: formatUser(profile) });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not create the account.' });
  }
};
