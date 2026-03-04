import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getTrips, createTrip } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') ?? undefined;
  const trips = getTrips(session.user.id, status);
  return NextResponse.json(trips);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.destination) return NextResponse.json({ error: 'destination is required' }, { status: 400 });

  const trip = createTrip(session.user.id, body);
  return NextResponse.json(trip, { status: 201 });
}
