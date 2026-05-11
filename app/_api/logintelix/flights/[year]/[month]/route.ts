export const dynamic = 'force-static';
export async function generateStaticParams() { return []; }
import { NextRequest, NextResponse } from 'next/server';
import { logintelix } from '@/app/lib/logintelix';
import { getAirlineCredentials } from '@/app/lib/supabase-server';

// GET /api/logintelix/flights/[year]/[month]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ year: string; month: string }> }
) {
  try {
    const creds = await getAirlineCredentials(request.headers.get('Authorization'));
    const { year: yearStr, month: monthStr } = await params;
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    if (isNaN(year) || year < 2000 || year > 2100) {
      return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
    }
    if (isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json({ error: 'Invalid month (1–12)' }, { status: 400 });
    }

    const publishedParam = request.nextUrl.searchParams.get('published');
    const published = publishedParam === 'false' ? false : true;

    const flights = await logintelix.getFlights(year, month, creds, published);
    return NextResponse.json(flights);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('unauthorized') || message.includes('Missing') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
