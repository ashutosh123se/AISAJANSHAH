/**
 * Server-backed local auth (no Firebase).
 * Works in local dig and on Cloudways when VITE_API_BASE_URL points at the API.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const STORAGE_KEY = 'aisajan_local_session';
const LEGACY_KEYS = ['aisajan_dig_session', 'aisajan_dev_session'];

/** Always on — this app uses server auth, not Firebase. */
export const isDevAuthEnabled = true;

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
    onboardingData: user.onboardingData || null,
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

export async function devLogin(email, password) {
  const normalized = email.trim().toLowerCase();
  const pass = String(password ?? '');

  let response;
  try {
    response = await fetch(`${API_BASE}/api/auth/local-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalized, password: pass }),
    });
  } catch {
    throw new Error(
      'Cannot reach the API. Check that the backend is running and VITE_API_BASE_URL is set correctly.'
    );
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

export function devLogout() {
  localStorage.removeItem(STORAGE_KEY);
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function updateLocalSession(profile) {
  const next = normalizeProfile(profile);
  if (!next) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
