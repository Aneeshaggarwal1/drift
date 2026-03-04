import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/db/queries';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const profile = getProfile(session.user.id);
  if (!profile) redirect('/onboard');

  return <ProfileClient profile={profile} />;
}
