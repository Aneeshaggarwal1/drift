import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { getTrip } from '@/lib/db/queries';
import TripDetailClient from './TripDetailClient';

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const { id } = await params;
  const trip = getTrip(session.user.id, id);
  if (!trip) notFound();

  return <TripDetailClient trip={trip} />;
}
