// ─── Logintelix API Types ────────────────────────────────────────────────────

export interface LtxAircraft {
  code: string;
  description: string;
  type: 'AMX' | 'AMC' | string;
  yseats: number;
  cseats: number;
}

export interface LtxItem {
  code: string;
  itemType: string;
  description: string;
  description2: string;
  category: string;
  subCategory: string;
  barSource: string | null;
}

export interface LtxGalleyBox {
  type: string;
  title: string;
  exchange: string;
  cartType: string | null;
  displayText: string;
  cartConfig: unknown | null;
}

export interface LtxRoom {
  id: string;
  roomId: string;
  name: string;
  boxes: Record<string, LtxGalleyBox>;
}

export interface LtxGalleyProfile {
  id: string;
  aircraft: string;
  profileName: string;
  order: number;
  duration: number | null;  // null = Default profile; number = pre-product duration tier (200, 240, 300, 480, 720, 900)
  froms: string[] | null;
  tos: string[] | null;
  rooms: LtxRoom[];
}

export interface LtxFlight {
  flightNumber: string;
  aircraft: string;
  from: string;
  to: string;
  fromDateTime: string;   // "dd/MM/yyyy HH:mm"
  fromTimezone: string;
  toDateTime: string;     // "dd/MM/yyyy HH:mm"
  toTimezone: string;
  duration: number;       // minutes; -1 = unknown
}

// ─── Inventory Submission (sent TO Logintelix) ───────────────────────────────

export interface LtxInventorySubmissionItem {
  itemCode: string;
  description: string;
  roomId: string;
  roomName: string;
  boxId: string;
  quantityLoaded: number;
  quantityConsumed: number;
  quantityRemaining: number;
}

export interface LtxInventorySubmission {
  flightNumber: string;
  aircraft: string;
  from: string;
  to: string;
  flightDate: string;       // "dd/MM/yyyy"
  galleyProfileId: string;
  submittedAt: string;      // ISO 8601
  submittedBy: string;
  items: LtxInventorySubmissionItem[];
}

// ─── Shared Fetch Helper ─────────────────────────────────────────────────────

export interface LogintelixCredentials {
  baseUrl: string;
  token: string;
}

async function logintelixFetch<T>(
  path: string,
  credentials: LogintelixCredentials,
  options?: RequestInit
): Promise<T> {
  const { baseUrl, token } = credentials;

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (res.status === 401) throw new Error('Third-party service authentication failed');
  if (!res.ok) throw new Error(`Logintelix API error: ${res.status} ${res.statusText}`);

  const json = await res.json();

  // Handle both raw array/object and wrapped { success, data, error } format
  if (Array.isArray(json)) return json as T;
  if (json && typeof json === 'object' && 'success' in json) {
    if (!json.success) throw new Error(json.error?.message ?? 'Logintelix error');
    return json.data as T;
  }
  return json as T;
}

// ─── API Methods ─────────────────────────────────────────────────────────────

export const logintelix = {
  getAircraft: (creds: LogintelixCredentials) =>
    logintelixFetch<LtxAircraft[]>('/aircraft/list', creds),

  getItems: (creds: LogintelixCredentials) =>
    logintelixFetch<LtxItem[]>('/item/list', creds),

  getGalleyProfiles: (aircraft: string, creds: LogintelixCredentials) =>
    logintelixFetch<LtxGalleyProfile[]>(`/galley/profile/${encodeURIComponent(aircraft)}/list`, creds),

  getFlights: (year: number, month: number, creds: LogintelixCredentials, published = true) =>
    logintelixFetch<LtxFlight[]>(
      `/serviceguide/flight/${year}/${String(month).padStart(2, '0')}/${published}`,
      creds
    ),

  submitInventory: (payload: LtxInventorySubmission, creds: LogintelixCredentials) =>
    logintelixFetch<{ success: boolean }>('/inventory/submit', creds, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// ─── Duration Tier Matching ───────────────────────────────────────────────────

const DURATION_TIERS = [200, 240, 300, 480, 720, 900];

/**
 * Given a flight duration in minutes, returns the closest pre-product tier.
 * Returns null if duration is unknown (-1) or zero.
 */
export function matchDurationTier(durationMinutes: number): number | null {
  if (durationMinutes <= 0) return null;
  let closest = DURATION_TIERS[0];
  let minDiff = Math.abs(durationMinutes - closest);
  for (const tier of DURATION_TIERS) {
    const diff = Math.abs(durationMinutes - tier);
    if (diff < minDiff) {
      minDiff = diff;
      closest = tier;
    }
  }
  return closest;
}

/**
 * Picks the best galley profile for a given aircraft type and flight duration.
 * Filters profiles by aircraft first, then matches closest duration tier.
 * Falls back to the Default profile if no duration-specific profile exists.
 */
export function pickGalleyProfile(
  profiles: LtxGalleyProfile[],
  aircraft: string,
  flightDuration: number
): LtxGalleyProfile | null {
  if (!profiles.length) return null;

  // Filter to profiles matching this aircraft
  const aircraftProfiles = profiles.filter((p) => p.aircraft === aircraft);
  const pool = aircraftProfiles.length ? aircraftProfiles : profiles;

  const defaultProfile = pool.find(
    (p) => p.duration === null || p.profileName === 'Default'
  );

  const tier = matchDurationTier(flightDuration);
  if (tier === null) return defaultProfile ?? pool[0];

  const tieredProfiles = pool.filter((p) => p.duration !== null && p.duration > 0);
  if (!tieredProfiles.length) return defaultProfile ?? pool[0];

  // Find the tiered profile whose duration is closest to our tier
  let best = tieredProfiles[0];
  let bestDiff = Math.abs((best.duration ?? 0) - tier);
  for (const p of tieredProfiles) {
    const diff = Math.abs((p.duration ?? 0) - tier);
    if (diff < bestDiff) {
      best = p;
      bestDiff = diff;
    }
  }
  return best;
}
