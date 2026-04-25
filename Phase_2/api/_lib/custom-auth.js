const crypto = require('crypto');

const SESSION_COOKIE_NAME = 'unigroup_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 14;
const PBKDF2_ITERATIONS = 310000;
const PBKDF2_KEYLEN = 32;
const PBKDF2_DIGEST = 'sha256';

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

async function createSession(res, userId) {
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

  res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=${encodeURIComponent(rawToken)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_DURATION_MS / 1000)}`);
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
  res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function formatUser(profile) {
  return {
    id: profile.id,
    username: profile.username || '',
    name: profile.full_name || profile.username || profile.email || 'Student',
    email: profile.email || '',
    role: profile.role || 'Team member'
  };
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

  const profiles = await supabaseRest(`profiles?select=id,username,email,full_name,role,password_hash,password_salt,password_iterations&id=eq.${session.user_id}&limit=1`);
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
  return payload.user;
}

module.exports = {
  SESSION_COOKIE_NAME,
  createPasswordRecord,
  verifyPassword,
  supabaseRest,
  supabaseAuthAdmin,
  createSession,
  clearSession,
  getSessionProfile,
  requireSessionProfile,
  ensureShadowAuthUser,
  formatUser
};
