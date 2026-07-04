import { getDB } from "../db/database";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function createSession(userId: number): string {
  const db = getDB();
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
  db.run("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)", [token, userId, expiresAt]);
  return token;
}

export function getUserIdFromToken(token: string): number | null {
  const db = getDB();
  const row = db.query(
    "SELECT user_id, expires_at FROM sessions WHERE id = ?",
  ).get(token) as { user_id: number; expires_at: string } | undefined;
  if (!row) { return null; }
  if (new Date(row.expires_at) < new Date()) {
    db.run("DELETE FROM sessions WHERE id = ?", [token]);
    return null;
  }
  return row.user_id;
}

export function deleteSession(token: string): void {
  const db = getDB();
  db.run("DELETE FROM sessions WHERE id = ?", [token]);
}

export function getUserFromToken(token: string): { id: number; email: string; username: string } | null {
  const userId = getUserIdFromToken(token);
  if (!userId) { return null; }
  const db = getDB();
  const user = db.query(
    "SELECT id, email, username FROM users WHERE id = ?",
  ).get(userId) as { id: number; email: string; username: string } | undefined;
  return user ?? null;
}

export function extractToken(req: Request): string | null {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) { return null; }
  return auth.slice(7);
}
