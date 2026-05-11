import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service role key.
// Only used in API routes — never exposed to the browser.
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export interface AirlineCredentials {
  integration: string;
  baseUrl: string;
  token: string;
}

/**
 * Extracts the Supabase JWT from an Authorization header, looks up the user's
 * profile → airline → settings, and returns the integration credentials.
 *
 * Throws if the header is missing, the user has no profile, or the airline has
 * no integration config.
 */
export async function getAirlineCredentials(authHeader: string | null): Promise<AirlineCredentials> {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }

  const jwt = authHeader.slice(7);
  const supabase = getServiceClient();

  // Verify the JWT signature and extract the user. Using getUser() ensures
  // Supabase validates the token — manual base64 decoding skips signature
  // verification and would allow forged tokens.
  const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
  if (authError || !user) throw new Error('Invalid or expired token');
  const userId: string = user.id;

  // Get airline settings via profile lookup
  const { data, error } = await supabase
    .from('profiles')
    .select('airline_id, airlines(settings)')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new Error('User profile not found — complete sign-up first');
  }

  const settings = (data.airlines as any)?.settings as Record<string, string> | null;

  if (!settings?.integration || !settings?.baseUrl || !settings?.token) {
    throw new Error('Airline integration not configured — contact your administrator');
  }

  return {
    integration: settings.integration,
    baseUrl: settings.baseUrl,
    token: settings.token,
  };
}
