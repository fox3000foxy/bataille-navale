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
  }
  return db;
}
