-- Drift Database Schema (SQLite for local dev, mirrors Neon Postgres for production)

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
  providerAccountId TEXT NOT NULL
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

CREATE TABLE IF NOT EXISTS traveler_profile (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  profile_data TEXT NOT NULL,       -- JSON
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
  itinerary TEXT,                   -- JSON
  destination_options TEXT,         -- JSON
  budget_estimated TEXT,            -- JSON
  budget_actual TEXT,               -- JSON
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,                    -- JSON
  profile_updates_applied TEXT,     -- JSON
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  conversation_type TEXT NOT NULL CHECK (conversation_type IN ('onboarding', 'trip_planning', 'trip_review', 'profile_edit')),
  trip_id TEXT REFERENCES trips(id),
  messages TEXT NOT NULL DEFAULT '[]',   -- JSON
  metadata TEXT,                         -- JSON
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
