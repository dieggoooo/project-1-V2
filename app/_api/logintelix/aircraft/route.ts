export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import { logintelix } from '@/app/lib/logintelix';
import { getAirlineCredentials } from '@/app/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const creds = await getAirlineCredentials(request.headers.get('Authorization'));
    const aircraft = await logintelix.getAircraft(creds);
    return NextResponse.json(aircraft);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('unauthorized') || message.includes('Missing') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
