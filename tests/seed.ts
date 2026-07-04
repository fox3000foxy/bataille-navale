import { getDB } from "../src/db/database";
import { hashPassword } from "../src/auth/password";

const USERS = [
  { username: "player1", email: "player1@test.com", display: "Player One" },
  { username: "player2", email: "player2@test.com", display: "Player Two" },
  { username: "player3", email: "player3@test.com", display: "Player Three" },
  { username: "player4", email: "player4@test.com", display: "Player Four" },
  { username: "player5", email: "player5@test.com", display: "Player Five" },
  { username: "player6", email: "player6@test.com", display: "Player Six" },
  { username: "player7", email: "player7@test.com", display: "Player Seven" },
  { username: "player8", email: "player8@test.com", display: "Player Eight" },
];

async function main() {
  const db = getDB();

  const existing = db.query("SELECT COUNT(*) as c FROM users").get() as { c: number };
  if (existing.c > 0) {
    console.log(`Database already has ${existing.c} users. Skipping seed.`);
    console.log("Run: rm navalcode.db && rm -f navalcode.db-wal navalcode.db-shm to reset.");
    process.exit(0);
  }

  const insertUser = db.prepare(
    "INSERT INTO users (email, username, password_hash, display_name) VALUES (?, ?, ?, ?)"
  );
  const insertBot = db.prepare(
    "INSERT INTO bots (user_id, name, code, status) VALUES (?, ?, ?, 'finalized')"
  );

  const password = await hashPassword("test123");

  const transaction = db.transaction(() => {
    for (const u of USERS) {
      const info = insertUser.run(u.email, u.username, password, u.display);
      const userId = Number(info.lastInsertRowid);

      const botCode = `import { Brain, Board, Strategy, Boats, State } from "@navalcode/sdk";

export class ${u.display.replace(/\s/g, "")} extends Brain {
  private myBoard: Board;
  private myStrategy: Strategy;

  constructor() {
    super();
    this.name = "${u.display}Bot";
    this.myBoard = new Board();
    this.myStrategy = this.buildStrategy();
  }

  private buildStrategy(): Strategy {
    const s = new Strategy();
    s.addBoat(Boats.AircraftCarrier, 1, 1, "right");
    s.addBoat(Boats.Cruiser, 3, 3, "down");
    s.addBoat(Boats.TorpedoBoat, 6, 6, "right");
    s.addBoat(Boats.Submarine, 0, 9, "right");
    return s;
  }

  getStrategy(): Strategy {
    return this.myStrategy;
  }

  think(): { x: number; y: number } {
    let x: number, y: number;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (this.myBoard.board[x]?.[y] !== State.None);
    return { x, y };
  }

  turn(x: number, y: number): void {
    if (this.myStrategy.isHit(x, y)) {
      this.myBoard.board[x]![y] = State.Hit;
    }
  }
}`;

      insertBot.run(userId, `${u.display}Bot`, botCode);
      console.log(`  Created ${u.username} / ${u.display}Bot`);
    }
  });

  console.log("Seeding database...");
  transaction();
  console.log("Done! 8 users created (password: test123).");
}

main().catch(console.error);
