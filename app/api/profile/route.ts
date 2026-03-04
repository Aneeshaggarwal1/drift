import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getProfile, createProfile, updateProfile } from '@/lib/db/queries';
import { deepMerge } from '@/lib/utils/merge';
import type { ProfileData } from '@/lib/types';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = getProfile(session.user.id);
  return NextResponse.json(profile);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json() as { profile_data: ProfileData; traveler_type?: string; traveler_description?: string };
  if (!body.profile_data) return NextResponse.json({ error: 'profile_data is required' }, { status: 400 });

  const existing = getProfile(session.user.id);
  if (existing) {
    const merged = deepMerge<ProfileData>(existing.profile_data, body.profile_data);
    const updated = updateProfile(session.user.id, merged, body.traveler_type, body.traveler_description);
    return NextResponse.json(updated);
  }

  const profile = createProfile(session.user.id, body.profile_data, body.traveler_type ?? null, body.traveler_description ?? null);
  return NextResponse.json(profile, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const existing = getProfile(session.user.id);
  if (!existing) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const merged = deepMerge<ProfileData>(existing.profile_data, body);
  const updated = updateProfile(session.user.id, merged);
  return NextResponse.json(updated);
}
