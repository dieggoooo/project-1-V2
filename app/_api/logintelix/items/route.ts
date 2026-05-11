export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import { logintelix } from '@/app/lib/logintelix';
import { getAirlineCredentials } from '@/app/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const creds = await getAirlineCredentials(request.headers.get('Authorization'));
    const items = await logintelix.getItems(creds);
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('unauthorized') || message.includes('Missing') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
