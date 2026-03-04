import { auth } from '@/lib/auth';

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user as { id: string; email: string; name?: string | null };
}
