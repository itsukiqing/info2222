const {
  buildLoginRateLimitKey,
  clearLoginRateLimit,
  createSession,
  formatUser,
  getLoginRateLimitStatusForKey,
  registerFailedLoginAttempt,
  requireSecureRequest,
  supabaseRest,
  verifyPassword
} = require('../_lib/custom-auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }
  if (!requireSecureRequest(req, res)) return;

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const rateLimitKey = buildLoginRateLimitKey(req, email);

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const rateLimitStatus = getLoginRateLimitStatusForKey(rateLimitKey);
  if (!rateLimitStatus.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((rateLimitStatus.blockedUntil - Date.now()) / 1000));
    res.setHeader('Retry-After', String(retryAfterSeconds));
    res.status(429).json({
      error: 'Too many failed sign-in attempts. Please wait and try again.',
      retryAfterSeconds
    });
    return;
  }

  try {
    const profiles = await supabaseRest(`profiles?select=id,username,email,full_name,role,password_hash,password_salt,password_iterations,public_key_jwk,encrypted_private_key,private_key_iv,private_key_salt,private_key_iterations&email=eq.${encodeURIComponent(email)}&limit=1`);
    const profile = profiles[0];

    if (!profile) {
      registerFailedLoginAttempt(rateLimitKey);
      res.status(401).json({ error: 'Email or password is incorrect.' });
      return;
    }

    if (!profile.password_hash || !profile.password_salt) {
      res.status(400).json({ error: 'This account still uses the old sign-in system. Use Register once with the same email to set a new password.' });
      return;
    }

    if (!verifyPassword(password, profile)) {
      registerFailedLoginAttempt(rateLimitKey);
      res.status(401).json({ error: 'Email or password is incorrect.' });
      return;
    }

    clearLoginRateLimit(rateLimitKey);
    await createSession(req, res, profile.id);
    res.status(200).json({ user: formatUser(profile, { includeCrypto: true }) });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not sign in.' });
  }
};
