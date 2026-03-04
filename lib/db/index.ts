import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = process.env.DATABASE_URL || './drift.db';
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    -- Auth.js required tables
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      name TEXT,
      email TEXT UNIQUE,
      emailVerified TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      providerAccountId TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at INTEGER,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      sessionToken TEXT NOT NULL UNIQUE,
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires TEXT NOT NULL,
      PRIMARY KEY (identifier, token)
    );

    -- Application tables
    CREATE TABLE IF NOT EXISTS traveler_profile (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT NOT NULL REFERENCES users(id),
      profile_data TEXT NOT NULL,
      traveler_type TEXT,
      traveler_description TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT NOT NULL REFERENCES users(id),
      destination TEXT NOT NULL,
      start_date TEXT,
      end_date TEXT,
      duration_days INTEGER,
      companions TEXT,
      status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed')),
      itinerary TEXT,
      destination_options TEXT,
      budget_estimated TEXT,
      budget_actual TEXT,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      feedback TEXT,
      profile_updates_applied TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT NOT NULL REFERENCES users(id),
      conversation_type TEXT NOT NULL CHECK (conversation_type IN ('onboarding', 'trip_planning', 'trip_review', 'profile_edit')),
      trip_id TEXT REFERENCES trips(id),
      messages TEXT NOT NULL DEFAULT '[]',
      metadata TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
}
