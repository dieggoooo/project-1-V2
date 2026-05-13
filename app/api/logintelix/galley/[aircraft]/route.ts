import { NextRequest, NextResponse } from 'next/server';
import { logintelix, pickGalleyProfile } from '@/app/lib/logintelix';
import { getAirlineCredentials } from '@/app/lib/supabase-server';

// GET /api/logintelix/galley/[aircraft]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ aircraft: string }> }
) {
  try {
    const creds = await getAirlineCredentials(request.headers.get('Authorization'));
    const { aircraft } = await params;
    const profiles = await logintelix.getGalleyProfiles(aircraft, creds);

    const durationParam = request.nextUrl.searchParams.get('duration');
    if (durationParam !== null) {
      const duration = parseInt(durationParam, 10);
      const matched = pickGalleyProfile(profiles, aircraft, duration);
      if (!matched) {
        return NextResponse.json({ error: 'No galley profile found' }, { status: 404 });
      }
      return NextResponse.json(matched);
    }

    return NextResponse.json(profiles);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('unauthorized') || message.includes('Missing') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
