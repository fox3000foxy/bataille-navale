import { Database } from "bun:sqlite";
import { SCHEMA } from "./schema";

let db: Database | null = null;

export function getDB(): Database {
  if (!db) {
    db = new Database("navalcode.db", { create: true });
    db.exec("PRAGMA journal_mode=WAL");
    db.exec("PRAGMA foreign_keys=ON");
    for (const stmt of SCHEMA) {
      db.exec(stmt);
    }
    migrate(db);
  }
  return db;
}

function migrate(db: Database): void {
  const existing = db.query("PRAGMA table_info(users)").all() as { name: string }[];
  const names = new Set(existing.map((c) => c.name));
  if (!names.has("avatar")) { db.exec("ALTER TABLE users ADD COLUMN avatar BLOB"); }
  if (!names.has("bio")) { db.exec("ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''"); }
  if (!names.has("display_name")) { db.exec("ALTER TABLE users ADD COLUMN display_name TEXT DEFAULT ''"); }
  if (!names.has("avatar_mime")) { db.exec("ALTER TABLE users ADD COLUMN avatar_mime TEXT DEFAULT 'image/png'"); }

  const botCols = db.query("PRAGMA table_info(bots)").all() as { name: string }[];
  const botNames = new Set(botCols.map((c) => c.name));
  if (!botNames.has("status")) { db.exec("ALTER TABLE bots ADD COLUMN status TEXT DEFAULT 'dev'"); }
}
