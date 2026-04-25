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
      supabaseRest(`profiles?select=id,email,username,full_name,password_hash,password_salt&email=eq.${encodeURIComponent(email)}&limit=1`),
      supabaseRest(`profiles?select=id,email,username,password_hash,password_salt&username=eq.${encodeURIComponent(username)}&limit=1`)
    ]);

    const existingEmailProfile = existingByEmail[0] || null;
    const existingUsernameProfile = existingByUsername[0] || null;
    const usernameTakenByAnotherUser =
      existingUsernameProfile && String(existingUsernameProfile.id) !== String(existingEmailProfile?.id || '');

    if (usernameTakenByAnotherUser) {
      res.status(409).json({ error: 'An account with that email or username already exists.' });
      return;
    }

    const passwordRecord = createPasswordRecord(password);

    let profile = null;

    if (existingEmailProfile) {
      if (existingEmailProfile.password_hash && existingEmailProfile.password_salt) {
        res.status(409).json({ error: 'An account with that email already exists.' });
        return;
      }

      await supabaseRest(`profiles?id=eq.${existingEmailProfile.id}`, {
        method: 'PATCH',
        body: {
          username,
          full_name: fullName,
          password_hash: passwordRecord.hash,
          password_salt: passwordRecord.salt,
          password_iterations: passwordRecord.iterations,
          password_algorithm: 'pbkdf2-sha256'
        }
      });

      const refreshedProfiles = await supabaseRest(`profiles?select=id,username,email,full_name,role,password_hash,password_salt,password_iterations&id=eq.${existingEmailProfile.id}&limit=1`);
      profile = refreshedProfiles[0];
    } else {
      const shadowUser = await ensureShadowAuthUser({ email, fullName, username });
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
      profile = createdProfiles[0];
    }

    await createSession(res, profile.id);
    res.status(200).json({ user: formatUser(profile) });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not create the account.' });
  }
};
