import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getProfile, getRecentTrips } from '@/lib/db/queries';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const profile = getProfile(session.user.id);
  if (!profile) redirect('/onboard');

  const recentTrips = getRecentTrips(session.user.id, 5);

  return <HomeClient recentTrips={recentTrips} />;
}
