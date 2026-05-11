export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import { logintelix, LtxInventorySubmission } from '@/app/lib/logintelix';
import { getAirlineCredentials } from '@/app/lib/supabase-server';

// POST /api/logintelix/inventory
export async function POST(request: NextRequest) {
  try {
    const creds = await getAirlineCredentials(request.headers.get('Authorization'));
    const body: LtxInventorySubmission = await request.json();

    if (!body.flightNumber || !body.aircraft || !body.items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields: flightNumber, aircraft, items' },
        { status: 400 }
      );
    }

    const result = await logintelix.submitInventory(body, creds);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('unauthorized') || message.includes('Missing') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
