import { getDb } from './index';
import type { TravelerProfile, Trip, Conversation, Message, ConversationType, TripCreate, TripUpdate } from '@/lib/types';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function parseJson<T>(value: string | null | undefined): T | null {
  if (!value) return null;
  try { return JSON.parse(value) as T; } catch { return null; }
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export function getProfile(userId: string): TravelerProfile | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM traveler_profile WHERE user_id = ? LIMIT 1').get(userId) as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    ...(row as unknown as TravelerProfile),
    profile_data: parseJson(row.profile_data as string) ?? ({} as TravelerProfile['profile_data']),
  };
}

export function createProfile(userId: string, profileData: TravelerProfile['profile_data'], travelerType: string | null, travelerDescription: string | null): TravelerProfile {
  const db = getDb();
  const id = generateId();
  db.prepare(`
    INSERT INTO traveler_profile (id, user_id, profile_data, traveler_type, traveler_description)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, userId, JSON.stringify(profileData), travelerType, travelerDescription);
  return getProfile(userId)!;
}

export function updateProfile(userId: string, profileData: TravelerProfile['profile_data'], travelerType?: string | null, travelerDescription?: string | null): TravelerProfile {
  const db = getDb();
  db.prepare(`
    UPDATE traveler_profile
    SET profile_data = ?, traveler_type = COALESCE(?, traveler_type), traveler_description = COALESCE(?, traveler_description), updated_at = datetime('now')
    WHERE user_id = ?
  `).run(JSON.stringify(profileData), travelerType ?? null, travelerDescription ?? null, userId);
  return getProfile(userId)!;
}

// ─── Trips ────────────────────────────────────────────────────────────────────

function parseTrip(row: Record<string, unknown>): Trip {
  return {
    ...(row as unknown as Trip),
    itinerary: parseJson(row.itinerary as string),
    destination_options: parseJson(row.destination_options as string),
    budget_estimated: parseJson(row.budget_estimated as string),
    budget_actual: parseJson(row.budget_actual as string),
    feedback: parseJson(row.feedback as string),
    profile_updates_applied: parseJson(row.profile_updates_applied as string),
  };
}

export function getTrips(userId: string, status?: string): Trip[] {
  const db = getDb();
  const rows = status && status !== 'all'
    ? db.prepare('SELECT * FROM trips WHERE user_id = ? AND status = ? ORDER BY created_at DESC').all(userId, status)
    : db.prepare('SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  return (rows as Record<string, unknown>[]).map(parseTrip);
}

export function getTrip(userId: string, tripId: string): Trip | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM trips WHERE id = ? AND user_id = ?').get(tripId, userId) as Record<string, unknown> | undefined;
  if (!row) return null;
  return parseTrip(row);
}

export function getRecentTrips(userId: string, limit = 5): Trip[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC LIMIT ?').all(userId, limit);
  return (rows as Record<string, unknown>[]).map(parseTrip);
}

export function createTrip(userId: string, data: Omit<TripCreate, 'user_id'>): Trip {
  const db = getDb();
  const id = generateId();
  db.prepare(`
    INSERT INTO trips (id, user_id, destination, start_date, end_date, duration_days, companions, status, itinerary, destination_options, budget_estimated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, userId, data.destination, data.start_date ?? null, data.end_date ?? null,
    data.duration_days ?? null, data.companions ?? null, data.status ?? 'planned',
    data.itinerary ? JSON.stringify(data.itinerary) : null,
    data.destination_options ? JSON.stringify(data.destination_options) : null,
    data.budget_estimated ? JSON.stringify(data.budget_estimated) : null,
  );
  return getTrip(userId, id)!;
}

export function updateTrip(userId: string, tripId: string, data: TripUpdate): Trip | null {
  const db = getDb();
  const trip = getTrip(userId, tripId);
  if (!trip) return null;
  db.prepare(`
    UPDATE trips SET
      destination = COALESCE(?, destination),
      start_date = COALESCE(?, start_date),
      end_date = COALESCE(?, end_date),
      status = COALESCE(?, status),
      rating = COALESCE(?, rating),
      feedback = COALESCE(?, feedback),
      itinerary = COALESCE(?, itinerary),
      budget_actual = COALESCE(?, budget_actual),
      updated_at = datetime('now')
    WHERE id = ? AND user_id = ?
  `).run(
    data.destination ?? null, data.start_date ?? null, data.end_date ?? null,
    data.status ?? null, data.rating ?? null,
    data.feedback ? JSON.stringify(data.feedback) : null,
    data.itinerary ? JSON.stringify(data.itinerary) : null,
    data.budget_actual ? JSON.stringify(data.budget_actual) : null,
    tripId, userId,
  );
  return getTrip(userId, tripId);
}

// ─── Conversations ────────────────────────────────────────────────────────────

function parseConversation(row: Record<string, unknown>): Conversation {
  return {
    ...(row as unknown as Conversation),
    messages: parseJson<Message[]>(row.messages as string) ?? [],
    metadata: parseJson(row.metadata as string),
  };
}

export function getConversation(userId: string, conversationId: string): Conversation | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM conversations WHERE id = ? AND user_id = ?').get(conversationId, userId) as Record<string, unknown> | undefined;
  if (!row) return null;
  return parseConversation(row);
}

export function createConversation(userId: string, type: ConversationType, tripId?: string): Conversation {
  const db = getDb();
  const id = generateId();
  db.prepare(`
    INSERT INTO conversations (id, user_id, conversation_type, trip_id, messages)
    VALUES (?, ?, ?, ?, '[]')
  `).run(id, userId, type, tripId ?? null);
  return getConversation(userId, id)!;
}

export function appendMessages(userId: string, conversationId: string, newMessages: Message[]): void {
  const db = getDb();
  const conv = getConversation(userId, conversationId);
  if (!conv) return;
  const updated = [...conv.messages, ...newMessages];
  db.prepare(`
    UPDATE conversations SET messages = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?
  `).run(JSON.stringify(updated), conversationId, userId);
}
