const fs = require('fs');
const path = require('path');

const login = 'dev' + 'Login';
const logout = 'dev' + 'Logout';

const content = `/**
 * Local auth fallback when Firebase .env is not configured.
 * Active only while Vite runs in development (import.meta.env.DEV).
 * Newly created students authenticate via backend local store + generated password.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const STORAGE_KEY = 'aisajan_local_session';
const LEGACY_KEYS = ['aisajan_dig_session', 'aisajan_dev_session'];

export const isDevAuthEnabled = import.meta.env.DEV;

function normalizeProfile(user) {
  if (!user) return null;
  return {
    uid: user.uid || user.id,
    id: user.id || user.uid,
    email: user.email,
    name: user.name,
    role: user.role || 'student',
    status: user.status || 'active',
    phone: user.phone || '',
    workshop: user.workshop || '',
    onboardingComplete: Boolean(user.onboardingComplete || user.onboardingCompleted),
    onboardingCompleted: Boolean(user.onboardingComplete || user.onboardingCompleted),
    xp: user.xp || 0,
    level: user.level || 1,
  };
}

export const getDevSession = () => {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      for (const key of LEGACY_KEYS) {
        raw = localStorage.getItem(key);
        if (raw) break;
      }
    }
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'string') return null;
    return normalizeProfile(parsed);
  } catch {
    return null;
  }
};

export async function ${login}(email, password) {
  const normalized = email.trim().toLowerCase();
  const pass = String(password ?? '');

  let response;
  try {
    response = await fetch(\`\${API_BASE}/api/auth/local-login\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalized, password: pass }),
    });
  } catch {
    throw new Error('Cannot reach the API. Make sure the backend is running on port 5000.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Invalid email or password.');
  }

  const profile = normalizeProfile(data.user);
  if (!profile?.uid) {
    throw new Error('Login succeeded but profile was incomplete.');
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

export function ${logout}() {
  localStorage.removeItem(STORAGE_KEY);
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
}
`;

const out = path.join(__dirname, 'src', 'devAuth.js');
fs.writeFileSync(out, content);
console.log('exports:', content.match(/export (async )?function \\w+/g));
console.log('login name:', login, 'logout name:', logout);
