import { getDB } from "../src/db/database";

const db = getDB();

interface BotRow { id: number; username: string }
interface CountRow { c: number }

const existing = db.query("SELECT COUNT(*) as c FROM events").get() as CountRow;
if (existing.c > 0) {
  console.log("Events already exist. Skipping.");
  process.exit(0);
}

const bots = db.query(
  "SELECT b.id, u.username FROM bots b JOIN users u ON u.id = b.user_id WHERE b.status = 'finalized'"
).all() as BotRow[];

if (bots.length === 0) {
  console.log("No finalized bots found. Run tests/seed.ts first.");
  process.exit(1);
}

const transaction = db.transaction(() => {
  const insert = db.run(
    "INSERT INTO events (name, description, submission_deadline, event_date, status) VALUES (?, ?, ?, ?, ?)",
    ["Semaine 1 — Tournoi de lancement", "Premier tournoi NavalCode ! 8 bots s'affrontent en bracket.", "2026-07-03T23:59:00Z", "2026-07-05T14:00:00Z", "completed"]
  );
  const eventId = Number(insert.lastInsertRowid);

  const insertBot = db.prepare(
    "INSERT INTO event_bots (event_id, bot_id, rank, score, prize) VALUES (?, ?, ?, ?, ?)"
  );

  const prizes = [20, 12, 8, 5];
  const shuffled = [...bots].sort(() => Math.random() - 0.5);

  for (let i = 0; i < shuffled.length; i++) {
    const rank = i + 1;
    const score = Math.max(0, 100 - i * 12 + Math.floor(Math.random() * 10 - 5));
    const prize = i < prizes.length ? prizes[i]! : 0;
    const bot = shuffled[i]!;
    insertBot.run(eventId, bot.id, rank, score, prize);
  }

  console.log(`Event #${eventId} created with ${bots.length} bots.`);
});

console.log("Creating test event...");
transaction();
