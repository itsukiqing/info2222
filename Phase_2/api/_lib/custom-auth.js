const crypto = require('crypto');

const SESSION_COOKIE_NAME = 'unigroup_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 14;
const PBKDF2_ITERATIONS = 310000;
const PBKDF2_KEYLEN = 32;
const PBKDF2_DIGEST = 'sha256';
const PRIVATE_KEY_ITERATIONS = 310000;
const LOGIN_RATE_LIMIT_WINDOW_MS = 1000 * 60;
const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 5;

const loginRateLimitStore = globalThis.__unigroupLoginRateLimitStore || new Map();
globalThis.__unigroupLoginRateLimitStore = loginRateLimitStore;

if (typeof globalThis.__unigroupDisableLoginRateLimit === 'undefined') {
  globalThis.__unigroupDisableLoginRateLimit = false;
}

function isLocalHost(hostname) {
  return ['localhost', '127.0.0.1', '::1'].includes(String(hostname || '').split(':')[0]);
}

function getRequestHost(req) {
  return String(req.headers['x-forwarded-host'] || req.headers.host || '');
}

function getForwardedProto(req) {
  return String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim().toLowerCase();
}

function getClientAddress(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '')
    .split(',')[0]
    .trim();
}

function isSecureRequest(req) {
  const forwardedProto = getForwardedProto(req);
  if (forwardedProto) return forwardedProto === 'https';
  if (req.socket?.encrypted) return true;
  return false;
}

function applySecurityHeaders(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  if (isSecureRequest(req)) {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
}

function requireSecureRequest(req, res) {
  applySecurityHeaders(req, res);
  if (isSecureRequest(req) || isLocalHost(getRequestHost(req))) {
    return true;
  }
  res.status(426).json({ error: 'Secure HTTPS transport is required for this action.' });
  return false;
}

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured on the server.`);
  }
  return value;
}

function getSupabaseConfig() {
  return {
    url: getEnv('SUPABASE_URL'),
    serviceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY')
  };
}

async function supabaseRest(path, options = {}) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method: options.method || 'GET',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Supabase database request failed.');
  }
  return payload;
}

async function supabaseAuthAdmin(path, options = {}) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/${path}`, {
    method: options.method || 'GET',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.msg || payload?.message || payload?.error_description || payload?.error || 'Supabase auth admin request failed.');
  }
  return payload;
}

function hashPassword(password, salt, iterations = PBKDF2_ITERATIONS) {
  return crypto.pbkdf2Sync(password, salt, iterations, PBKDF2_KEYLEN, PBKDF2_DIGEST).toString('hex');
}

function createPasswordRecord(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return {
    salt,
    iterations: PBKDF2_ITERATIONS,
    hash: hashPassword(password, salt, PBKDF2_ITERATIONS)
  };
}

function verifyPassword(password, profile) {
  const iterations = Number(profile.password_iterations || PBKDF2_ITERATIONS);
  const expected = String(profile.password_hash || '');
  const actual = hashPassword(password, String(profile.password_salt || ''), iterations);
  const expectedBuffer = Buffer.from(expected, 'hex');
  const actualBuffer = Buffer.from(actual, 'hex');
  if (expectedBuffer.length !== actualBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

function buildLoginRateLimitKey(req, email) {
  return `${String(email || '').trim().toLowerCase()}::${getClientAddress(req) || 'unknown'}`;
}

function pruneLoginAttemptEntry(entry, now = Date.now()) {
  const attempts = (entry?.attempts || []).filter(timestamp => now - timestamp < LOGIN_RATE_LIMIT_WINDOW_MS);
  return {
    attempts,
    blockedUntil: attempts.length >= LOGIN_RATE_LIMIT_MAX_ATTEMPTS
      ? attempts[0] + LOGIN_RATE_LIMIT_WINDOW_MS
      : 0
  };
}

function getLoginRateLimitStatusForKey(key, now = Date.now()) {
  if (!key) {
    return {
      disabled: Boolean(globalThis.__unigroupDisableLoginRateLimit),
      allowed: true,
      blockedUntil: 0,
      remainingAttempts: LOGIN_RATE_LIMIT_MAX_ATTEMPTS
    };
  }

  const entry = pruneLoginAttemptEntry(loginRateLimitStore.get(key), now);
  if (entry.attempts.length) {
    loginRateLimitStore.set(key, entry);
  } else {
    loginRateLimitStore.delete(key);
  }

  const blockedUntil = entry.blockedUntil > now ? entry.blockedUntil : 0;
  return {
    disabled: Boolean(globalThis.__unigroupDisableLoginRateLimit),
    allowed: Boolean(globalThis.__unigroupDisableLoginRateLimit) || !blockedUntil,
    blockedUntil,
    remainingAttempts: Math.max(0, LOGIN_RATE_LIMIT_MAX_ATTEMPTS - entry.attempts.length)
  };
}

function registerFailedLoginAttempt(key, now = Date.now()) {
  if (!key || globalThis.__unigroupDisableLoginRateLimit) return getLoginRateLimitStatusForKey(key, now);
  const entry = pruneLoginAttemptEntry(loginRateLimitStore.get(key), now);
  entry.attempts.push(now);
  const nextEntry = pruneLoginAttemptEntry(entry, now);
  loginRateLimitStore.set(key, nextEntry);
  return getLoginRateLimitStatusForKey(key, now);
}

function clearLoginRateLimit(key) {
  if (!key) return;
  loginRateLimitStore.delete(key);
}

function setLoginRateLimitDisabled(disabled) {
  globalThis.__unigroupDisableLoginRateLimit = Boolean(disabled);
}

function getLoginRateLimitSnapshot() {
  return {
    disabled: Boolean(globalThis.__unigroupDisableLoginRateLimit),
    windowMs: LOGIN_RATE_LIMIT_WINDOW_MS,
    maxAttempts: LOGIN_RATE_LIMIT_MAX_ATTEMPTS
  };
}

function parseCookies(req) {
  return String(req.headers.cookie || '')
    .split(';')
    .map(part => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const [key, ...rest] = part.split('=');
      acc[key] = decodeURIComponent(rest.join('='));
      return acc;
    }, {});
}

function hashSessionToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function createSession(req, res, userId) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashSessionToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  await supabaseRest('app_sessions', {
    method: 'POST',
    body: {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt
    }
  });

  const cookieParts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(rawToken)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${Math.floor(SESSION_DURATION_MS / 1000)}`
  ];
  if (isSecureRequest(req)) {
    cookieParts.push('Secure');
  }
  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

async function clearSession(req, res) {
  const cookies = parseCookies(req);
  const rawToken = cookies[SESSION_COOKIE_NAME];
  if (rawToken) {
    const tokenHash = hashSessionToken(rawToken);
    await supabaseRest(`app_sessions?token_hash=eq.${tokenHash}`, {
      method: 'DELETE',
      prefer: 'return=minimal'
    }).catch(() => {});
  }
  const cookieParts = [`${SESSION_COOKIE_NAME}=`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0'];
  if (isSecureRequest(req)) {
    cookieParts.push('Secure');
  }
  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

function formatCryptoMaterial(profile) {
  if (!profile?.public_key_jwk || !profile?.encrypted_private_key || !profile?.private_key_iv || !profile?.private_key_salt) {
    return null;
  }

  return {
    publicKeyJwk: profile.public_key_jwk,
    encryptedPrivateKey: profile.encrypted_private_key,
    privateKeyIv: profile.private_key_iv,
    privateKeySalt: profile.private_key_salt,
    privateKeyIterations: Number(profile.private_key_iterations || PRIVATE_KEY_ITERATIONS)
  };
}

function formatUser(profile, options = {}) {
  const user = {
    id: profile.id,
    username: profile.username || '',
    name: profile.full_name || profile.username || profile.email || 'Student',
    email: profile.email || '',
    role: profile.role || 'Team member'
  };
  if (options.includeCrypto) {
    user.crypto = formatCryptoMaterial(profile);
  }
  return user;
}

async function getSessionProfile(req) {
  const cookies = parseCookies(req);
  const rawToken = cookies[SESSION_COOKIE_NAME];
  if (!rawToken) return null;

  const tokenHash = hashSessionToken(rawToken);
  const sessions = await supabaseRest(`app_sessions?select=user_id,expires_at&token_hash=eq.${tokenHash}&limit=1`);
  const session = sessions[0];
  if (!session) return null;
  if (new Date(session.expires_at).getTime() <= Date.now()) {
    return null;
  }

  const profiles = await supabaseRest(`profiles?select=id,username,email,full_name,role,password_hash,password_salt,password_iterations,public_key_jwk,encrypted_private_key,private_key_iv,private_key_salt,private_key_iterations&id=eq.${session.user_id}&limit=1`);
  return profiles[0] || null;
}

async function requireSessionProfile(req, res) {
  const profile = await getSessionProfile(req);
  if (!profile) {
    res.status(401).json({ error: 'You must be signed in.' });
    return null;
  }
  return profile;
}

async function ensureShadowAuthUser({ email, fullName, username }) {
  const randomPassword = crypto.randomBytes(24).toString('base64url');
  const payload = await supabaseAuthAdmin('admin/users', {
    method: 'POST',
    body: {
      email,
      password: randomPassword,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        username
      }
    }
  });
  const user = payload?.user || payload;
  if (!user?.id) {
    throw new Error('Supabase did not return the shadow auth user record.');
  }
  return user;
}

module.exports = {
  SESSION_COOKIE_NAME,
  PRIVATE_KEY_ITERATIONS,
  buildLoginRateLimitKey,
  clearLoginRateLimit,
  createPasswordRecord,
  verifyPassword,
  supabaseRest,
  supabaseAuthAdmin,
  applySecurityHeaders,
  getLoginRateLimitSnapshot,
  getLoginRateLimitStatusForKey,
  requireSecureRequest,
  registerFailedLoginAttempt,
  createSession,
  clearSession,
  getSessionProfile,
  requireSessionProfile,
  ensureShadowAuthUser,
  formatCryptoMaterial,
  formatUser,
  setLoginRateLimitDisabled
};
