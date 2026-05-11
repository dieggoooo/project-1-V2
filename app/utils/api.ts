import { supabase } from './supabase';

/**
 * Fetch wrapper that automatically attaches the current Supabase session token
 * as an Authorization header. Use this for all /api/logintelix/* calls.
 */
export async function authFetch(input: string, init?: RequestInit): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  return fetch(input, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
