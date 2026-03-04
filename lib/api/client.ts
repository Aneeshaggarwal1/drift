import type { TravelerProfile, Trip, ChatRequest, ProfileData, TripCreate } from '@/lib/types';

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function fetchProfile(): Promise<TravelerProfile | null> {
  const res = await fetch('/api/profile');
  if (!res.ok) return null;
  return res.json();
}

export async function saveProfile(data: {
  profile_data: ProfileData;
  traveler_type?: string;
  traveler_description?: string;
}): Promise<TravelerProfile> {
  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save profile');
  return res.json();
}

export async function updateProfile(data: Partial<ProfileData>): Promise<TravelerProfile> {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

// ─── Trips ────────────────────────────────────────────────────────────────────

export async function fetchTrips(status?: string): Promise<Trip[]> {
  const url = status && status !== 'all' ? `/api/trips?status=${status}` : '/api/trips';
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchTrip(id: string): Promise<Trip | null> {
  const res = await fetch(`/api/trips/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createTrip(data: Omit<TripCreate, 'user_id'>): Promise<Trip> {
  const res = await fetch('/api/trips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create trip');
  return res.json();
}

export async function updateTrip(id: string, data: Partial<Trip>): Promise<Trip> {
  const res = await fetch(`/api/trips/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update trip');
  return res.json();
}

// ─── Chat (streaming) ─────────────────────────────────────────────────────────

export async function streamChat(
  params: ChatRequest,
  onChunk: (text: string) => void,
  onDone: (conversationId: string) => void,
  onError: (error: string) => void,
): Promise<void> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    onError('Failed to connect to AI. Try again.');
    return;
  }

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) { onError('No response stream'); return; }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

      for (const line of lines) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.error) {
            onError(data.error);
          } else if (data.done) {
            onDone(data.conversationId ?? '');
          } else if (data.text) {
            onChunk(data.text);
          }
        } catch {
          // malformed chunk — skip
        }
      }
    }
  } catch (err) {
    onError(err instanceof Error ? err.message : 'Stream error');
  } finally {
    reader.releaseLock();
  }
}
