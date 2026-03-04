import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTrips } from '@/lib/db/queries';
import TripsClient from './TripsClient';

export default async function TripsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const trips = getTrips(session.user.id);

  return <TripsClient trips={trips} />;
}
