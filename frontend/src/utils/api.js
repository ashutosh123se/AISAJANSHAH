import { getDevSession } from '../devAuth';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function getAuthHeaders() {
  const session = getDevSession();
  if (session?.uid) {
    return { Authorization: `Bearer local-token-${session.uid}` };
  }
  throw new Error('Not authenticated. Please log in again.');
}

export async function apiFetch(path, options = {}) {
  const headers = await getAuthHeaders();
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...options.headers,
    },
  });
}
