const CREATE_USERS = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
)`;

const CREATE_BOTS = `
CREATE TABLE IF NOT EXISTS bots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT DEFAULT 'dev',
  is_active INTEGER DEFAULT 1,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;

const CREATE_EVENTS = `
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  submission_deadline TEXT NOT NULL,
  event_date TEXT NOT NULL,
  status TEXT DEFAULT 'upcoming',
  created_at TEXT DEFAULT (datetime('now'))
)`;

const CREATE_EVENT_BOTS = `
CREATE TABLE IF NOT EXISTS event_bots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  bot_id INTEGER NOT NULL,
  rank INTEGER,
  score REAL,
  prize REAL,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (bot_id) REFERENCES bots(id)
)`;

const CREATE_MATCHES = `
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  bot1_id INTEGER NOT NULL,
  bot2_id INTEGER NOT NULL,
  winner_id INTEGER,
  rounds INTEGER,
  played_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (bot1_id) REFERENCES bots(id),
  FOREIGN KEY (bot2_id) REFERENCES bots(id)
)`;

const CREATE_BETS = `
CREATE TABLE IF NOT EXISTS bets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  bot_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (bot_id) REFERENCES bots(id)
)`;

const CREATE_SESSIONS = `
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;

const CREATE_DEVICE_CODES = `
CREATE TABLE IF NOT EXISTS device_codes (
  code TEXT PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  expires_at TEXT NOT NULL,
  confirmed_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
)`;

export const SCHEMA = [
  CREATE_USERS,
  CREATE_SESSIONS,
  CREATE_DEVICE_CODES,
  CREATE_BOTS,
  CREATE_EVENTS,
  CREATE_EVENT_BOTS,
  CREATE_MATCHES,
  CREATE_BETS,
];
