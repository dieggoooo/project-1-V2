import { supabase } from './supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

/**
 * Fetch wrapper that automatically attaches the current Supabase session token
 * as an Authorization header. Use this for all /api/logintelix/* calls.
 * In Capacitor builds, API_BASE points to the deployed server so relative
 * paths resolve correctly even when the app runs as a local file bundle.
 */
export async function authFetch(input: string, init?: RequestInit): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  return fetch(`${API_BASE}${input}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
