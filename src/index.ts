import { serve } from "bun";
import index from "./index.html";
import { getDB } from "./db/database";
import { hashPassword, verifyPassword } from "./auth/password";
import { createSession, deleteSession, getUserFromToken, extractToken } from "./auth/session";
import { Brain } from "./classes/Brain";
import { Board } from "./classes/Board";
import { Strategy } from "./classes/Strategy";
import { State } from "./types/State";
import { Boats } from "./types/Boats";

getDB();

function secureHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  if (!headers.has("Content-Security-Policy")) {
    headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
    );
  }
  if (!headers.has("X-Content-Type-Options")) {
    headers.set("X-Content-Type-Options", "nosniff");
  }
  if (!headers.has("X-Frame-Options")) {
    headers.set("X-Frame-Options", "DENY");
  }
  if (!headers.has("Referrer-Policy")) {
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  }
  if (!headers.has("Permissions-Policy")) {
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function json(data: unknown, status = 200) {
  return secureHeaders(new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  }));
}

// Simple in-memory rate limiter
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) { return false; }
  entry.count++;
  return true;
}

function getIP(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
}

function serveFile(path: string, filename: string) {
  return secureHeaders(new Response(Bun.file(path), {
    headers: {
      "Content-Type": "text/typescript; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  }));
}

function requireAuth(req: Request): { id: number; email: string; username: string; display_name: string; bio: string } | Response {
  const token = extractToken(req);
  if (!token) { return json({ error: "Non authentifié" }, 401); }
  const user = getUserFromToken(token);
  if (!user) { return json({ error: "Session invalide" }, 401); }
  return user as never;
}

function validateBotCode(code: string): { valid: boolean; checks: { label: string; passed: boolean }[]; errors: string[] } {
  const checks: { label: string; passed: boolean }[] = [];
  const errors: string[] = [];
  let js: string;
  let bot: Brain | null = null;

  // --- Transpile ---
  try {
    const t = new Bun.Transpiler({ loader: "ts" });
    js = t.transformSync(code)
      .replace(/import\s+.*\s+from\s+["'].*["'];?\n?/g, "")
      .replace(/export\s+/g, "");
  } catch {
    checks.push({ label: "Aucun import autre que le SDK", passed: false });
    checks.push({ label: "Classe qui extend Brain", passed: false });
    checks.push({ label: "Nom du robot (this.name)", passed: false });
    checks.push({ label: "4 bateaux placés (AircraftCarrier, Cruiser, TorpedoBoat, Submarine)", passed: false });
    checks.push({ label: "Méthode think() implémentée", passed: false });
    checks.push({ label: "Méthode turn(x, y) implémentée", passed: false });
    errors.push("Erreur de transpilation du code");
    return { valid: false, checks, errors };
  }

  // --- 1. Bad imports (check on transpiled JS: only value imports remain) ---
  const remainingImports = js.match(/import\s+.*\s+from\s+["'].*["']/g) || [];
  const badImports = remainingImports.filter((imp) => !imp.includes("@navalcode/sdk"));
  if (badImports.length > 0) {
    checks.push({ label: "Aucun import autre que le SDK", passed: false });
    for (const imp of badImports) {
      errors.push(`Import non autorisé : ${imp}`);
    }
  } else {
    checks.push({ label: "Aucun import autre que le SDK", passed: true });
  }

  // --- Find class name ---
  const className = js.match(/class\s+(\w+)\s+extends\s+\w+/)?.[1];

  // --- 2. Class extends Brain ---
  if (!className) {
    checks.push({ label: "Classe qui extend Brain", passed: false });
    checks.push({ label: "Nom du robot (this.name)", passed: false });
    checks.push({ label: "4 bateaux placés (AircraftCarrier, Cruiser, TorpedoBoat, Submarine)", passed: false });
    checks.push({ label: "Méthode think() implémentée", passed: false });
    checks.push({ label: "Méthode turn(x, y) implémentée", passed: false });
    errors.push("Le robot doit contenir une classe qui extend Brain");
    return { valid: false, checks, errors };
  }
  checks.push({ label: "Classe qui extend Brain", passed: true });

  // --- Instantiate ---
  try {
    const deps = { Brain, Board, Strategy, State, Boats };
    // biome-ignore lint/nursery/noImpliedEval: needed to instantiate user bot for runtime validation
    const fn = new Function(
      ...Object.keys(deps),
      `${js}\nreturn new ${className}();`,
    );
    bot = fn(...Object.values(deps)) as Brain;
  } catch (e) {
    const msg = (e as Error).message;
    checks.push({ label: "Nom du robot (this.name)", passed: false });
    checks.push({ label: "4 bateaux placés (AircraftCarrier, Cruiser, TorpedoBoat, Submarine)", passed: false });
    checks.push({ label: "Méthode think() implémentée", passed: false });
    checks.push({ label: "Méthode turn(x, y) implémentée", passed: false });
    errors.push(`Impossible d'instancier le robot : ${msg}`);
    return { valid: false, checks, errors };
  }

  // --- 3. Name ---
  const nameOk = typeof bot.name === "string" && bot.name.length > 0;
  checks.push({ label: "Nom du robot (this.name)", passed: nameOk });
  if (!nameOk) { errors.push("Le robot doit avoir un nom (this.name = \"...\")"); }

  // --- 4. Strategy (4 boats, correct types, sizes, bounds, no overlap) ---
  const boatDefs: { type: number; name: string; size: number }[] = [
    { type: Boats.AircraftCarrier, name: "AircraftCarrier", size: 5 },
    { type: Boats.Cruiser, name: "Cruiser", size: 4 },
    { type: Boats.TorpedoBoat, name: "TorpedoBoat", size: 3 },
    { type: Boats.Submarine, name: "Submarine", size: 2 },
  ];
  let strategyOk = false;
  let strategyError: string | null = null;
  try {
    const strategy = bot.getStrategy();
    if (strategy?.placements.length === 4) {
      const usedTypes = new Set<number>();
      const occupied = new Set<string>();
      for (const p of strategy.placements) {
        const def = boatDefs.find(d => d.type === p.boat);
        if (!def) { strategyError = `Type de bateau inconnu : ${p.boat}`; break; }
        usedTypes.add(p.boat);
        const cells = strategy.getCells(p);
        if (cells.length !== def.size) {
          strategyError = `Bateau ${def.name} : attendu ${def.size} cellules, reçu ${cells.length}`; break;
        }
        for (const c of cells) {
          if (c.x < 0 || c.x >= 10 || c.y < 0 || c.y >= 10) {
            strategyError = `Bateau ${def.name} hors limites (${c.x},${c.y})`; break;
          }
          const k = `${c.x},${c.y}`;
          if (occupied.has(k)) {
            strategyError = `Bateaux qui se chevauchent à (${c.x},${c.y})`; break;
          }
          occupied.add(k);
        }
        if (strategyError) { break; }
      }
      if (!strategyError) {
        if (usedTypes.size === 4) {
          strategyOk = true;
        } else {
          const missing = boatDefs.filter(d => !usedTypes.has(d.type)).map(d => d.name);
          strategyError = `Bateaux manquants dans getStrategy() : ${missing.join(", ")}`;
        }
      }
    } else {
      strategyError = "getStrategy() doit placer exactement 4 bateaux";
    }
  } catch (e) {
    strategyError = `Erreur dans getStrategy() : ${(e as Error).message}`;
  }
  checks.push({ label: "4 bateaux placés (AircraftCarrier, Cruiser, TorpedoBoat, Submarine)", passed: strategyOk });
  if (strategyError) { errors.push(strategyError); }

  // --- 5. think() ---
  let thinkOk = false;
  try {
    const result = bot.think();
    if (typeof result === "object" && result !== null && typeof result.x === "number" && typeof result.y === "number") {
      thinkOk = true;
    }
  } catch {}
  checks.push({ label: "Méthode think() implémentée", passed: thinkOk });
  if (!thinkOk) { errors.push("Le robot doit implémenter la méthode think() retournant {x, y}"); }

  // --- 6. turn() ---
  let turnOk = false;
  try {
    bot.turn(0, 0);
    turnOk = true;
  } catch {}
  checks.push({ label: "Méthode turn(x, y) implémentée", passed: turnOk });
  if (!turnOk) { errors.push("Le robot doit implémenter la méthode turn(x, y)"); }

  return { valid: errors.length === 0, checks, errors };
}

const SERVER = serve({
  routes: {
    "/*": index,

    "/api/bots/Random.ts": {
      GET() { return serveFile("bots/Random.ts", "Random.ts"); },
    },
    "/api/bots/SmartBot.ts": {
      GET() { return serveFile("bots/SmartBot.ts", "SmartBot.ts"); },
    },
    "/api/bots/StrategicBot.ts": {
      GET() { return serveFile("bots/StrategicBot.ts", "StrategicBot.ts"); },
    },

    "/api/health": {
      GET() {
        const db = getDB();
        const result = db.query("SELECT COUNT(*) as count FROM users").get() as { count: number };
        return json({ status: "ok", users: result.count });
      },
    },

    "/api/stats": {
      GET() {
        const db = getDB();
        const bots = (db.query("SELECT COUNT(*) as c FROM bots").get() as { c: number }).c;
        const events = (db.query("SELECT COUNT(*) as c FROM events").get() as { c: number }).c;
        const users = (db.query("SELECT COUNT(*) as c FROM users").get() as { c: number }).c;
        return json({ bots, events, users });
      },
    },

    "/api/auth/register": {
      async POST(req: Request) {
        if (!checkRateLimit(getIP(req))) {
          return json({ error: "Trop de requêtes" }, 429);
        }
        const body = await req.json();
        const { email, username, password } = body;

        // biome-ignore lint/complexity/useSimplifiedLogicExpression: readability
        if (!email || !username || !password) {
          return json({ error: "Champs requis : email, username, password" }, 400);
        }
        if (password.length < 8) {
          return json({ error: "Mot de passe trop court (8 caractères minimum)" }, 400);
        }
        if (username.length < 2) {
          return json({ error: "Nom d'utilisateur trop court" }, 400);
        }

        const db = getDB();
        const existing = db.query(
          "SELECT id FROM users WHERE email = ? OR username = ?",
        ).get(email, username);

        if (existing) {
          return json({ error: "Email ou nom d'utilisateur déjà utilisé" }, 409);
        }

        const passwordHash = await hashPassword(password);
        const result = db.run(
          "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
          [email, username, passwordHash],
        );
        const userId = result.lastInsertRowid as number;
        const token = createSession(userId);

        return json({ token, user: { id: userId, email, username } }, 201);
      },
    },

    "/api/auth/login": {
      async POST(req: Request) {
        if (!checkRateLimit(getIP(req))) {
          return json({ error: "Trop de requêtes" }, 429);
        }
        const body = await req.json();
        const { email, password } = body;

        // biome-ignore lint/complexity/useSimplifiedLogicExpression: readability
        if (!email || !password) {
          return json({ error: "Champs requis : email, password" }, 400);
        }

        const db = getDB();
        const user = db.query(
          "SELECT id, email, username, password_hash FROM users WHERE email = ?",
        ).get(email) as { id: number; email: string; username: string; password_hash: string } | undefined;

        if (!user) {
          return json({ error: "Email ou mot de passe incorrect" }, 401);
        }

        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
          return json({ error: "Email ou mot de passe incorrect" }, 401);
        }

        const token = createSession(user.id);
        return json({ token, user: { id: user.id, email: user.email, username: user.username } });
      },
    },

    "/api/auth/logout": {
      POST(req: Request) {
        const token = extractToken(req);
        if (token) { deleteSession(token); }
        return json({ success: true });
      },
    },

    "/api/auth/me": {
      GET(req: Request) {
        const token = extractToken(req);
        if (!token) { return json({ error: "Non authentifié" }, 401); }
        const user = getUserFromToken(token);
        if (!user) { return json({ error: "Session invalide" }, 401); }
        return json({ user });
      },
    },

    "/api/auth/device/code": {
      GET() {
        const db = getDB();
        db.run("DELETE FROM device_codes WHERE expires_at < datetime('now')");
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        const group = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        const code = `${group()}-${group()}`;
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        db.run("INSERT INTO device_codes (code, expires_at) VALUES (?, ?)", [code, expiresAt]);
        return json({ code, expires_at: expiresAt });
      },
    },

    "/api/auth/device/confirm": {
      async POST(req: Request) {
        const auth = requireAuth(req);
        if (auth instanceof Response) { return auth; }
        const db = getDB();
        const { code } = await req.json() as { code: string };
        const row = db.query(
          "SELECT code, expires_at, confirmed_at FROM device_codes WHERE code = ?",
        ).get(code) as { code: string; expires_at: string; confirmed_at: string | null } | undefined;
        if (!row) { return json({ error: "Code invalide" }, 404); }
        if (row.confirmed_at) { return json({ error: "Code déjà utilisé" }, 400); }
        if (new Date(row.expires_at) < new Date()) { return json({ error: "Code expiré" }, 400); }
        db.run("UPDATE device_codes SET user_id = ?, confirmed_at = datetime('now') WHERE code = ?", [auth.id, code]);
        return json({ success: true });
      },
    },

    "/api/auth/device/status": {
      GET(req: Request) {
        const url = new URL(req.url);
        const code = url.searchParams.get("code");
        if (!code) { return json({ error: "code requis" }, 400); }
        const db = getDB();
        const row = db.query(
          "SELECT code, user_id, expires_at, confirmed_at FROM device_codes WHERE code = ?",
        ).get(code) as { code: string; user_id: number | null; expires_at: string; confirmed_at: string | null } | undefined;
        if (!row) { return json({ status: "not_found" }); }
        if (new Date(row.expires_at) < new Date()) { return json({ status: "expired" }); }
        if (!row.confirmed_at) { return json({ status: "pending" }); }
        const token = createSession(row.user_id!);
        return json({ status: "confirmed", token });
      },
    },

    "/api/profile": {
      GET(req: Request) {
        const auth = requireAuth(req);
        if (auth instanceof Response) { return auth; }
        const db = getDB();
        const user = db.query(
          "SELECT id, email, username, display_name, bio, created_at FROM users WHERE id = ?",
        ).get(auth.id) as { id: number; email: string; username: string; display_name: string; bio: string; created_at: string };
        const bots = db.query(
          "SELECT id, name, wins, losses, draws, status, created_at, updated_at FROM bots WHERE user_id = ? ORDER BY created_at DESC",
        ).all(auth.id);
        return json({ user, bots });
      },
      async PUT(req: Request) {
        const auth = requireAuth(req);
        if (auth instanceof Response) { return auth; }
        const body = await req.json();
        const db = getDB();
        db.run("UPDATE users SET display_name = ?, bio = ?, updated_at = datetime('now') WHERE id = ?",
          [body.display_name || "", body.bio || "", auth.id]);
        return json({ success: true });
      },
    },

    "/api/profile/avatar": {
      async POST(req: Request) {
        const auth = requireAuth(req);
        if (auth instanceof Response) { return auth; }
        const form = await req.formData();
        const file = form.get("avatar") as File | null;
        if (!file) { return json({ error: "Fichier requis" }, 400); }
        const buf = Buffer.from(await file.arrayBuffer());
        const db = getDB();
        db.run("UPDATE users SET avatar = ?, avatar_mime = ?, updated_at = datetime('now') WHERE id = ?",
          [buf, file.type || "image/png", auth.id]);
        return json({ success: true });
      },
      GET(req: Request) {
        const url = new URL(req.url);
        const userId = Number.parseInt(url.searchParams.get("userId") || "", 10);
        if (!userId) {
          const auth = requireAuth(req);
          if (auth instanceof Response) { return auth; }
        }
        const db = getDB();
        const row = db.query("SELECT avatar, avatar_mime FROM users WHERE id = ?").get(userId || 0) as
          { avatar: Uint8Array | null; avatar_mime: string } | undefined;
        if (!row?.avatar) { return secureHeaders(new Response(null, { status: 404 })); }
        return secureHeaders(new Response(new Uint8Array(row.avatar), {
          headers: { "Content-Type": row.avatar_mime, "Cache-Control": "public, max-age=86400" },
        }));
      },
    },

    "/api/bots/download": {
      GET(req: Request) {
        const auth = requireAuth(req);
        if (auth instanceof Response) { return auth; }
        const url = new URL(req.url);
        const botId = Number.parseInt(url.searchParams.get("id") || "", 10);
        if (!botId) { return json({ error: "id requis" }, 400); }
        const db = getDB();
        const bot = db.query(
          "SELECT name, code FROM bots WHERE id = ? AND user_id = ?",
        ).get(botId, auth.id) as { name: string; code: string } | undefined;
        if (!bot) { return json({ error: "Robot introuvable" }, 404); }
        return secureHeaders(new Response(bot.code, {
          headers: {
            "Content-Type": "text/typescript; charset=utf-8",
            "Content-Disposition": `attachment; filename="${bot.name}.ts"`,
          },
        }));
      },
    },

    "/api/bots/dev": {
      GET(req: Request) {
        const auth = requireAuth(req);
        if (auth instanceof Response) { return auth; }
        const db = getDB();
        const bot = db.query(
          "SELECT id, name, code, status, created_at, updated_at FROM bots WHERE user_id = ? AND status = 'dev' ORDER BY created_at DESC LIMIT 1",
        ).get(auth.id) as { id: number; name: string; code: string; status: string; created_at: string; updated_at: string } | undefined;
        const validation = bot ? validateBotCode(bot.code) : null;
        return json({ bot: bot || null, validation });
      },
    },

    "/api/bots/validate": {
      async POST(req: Request) {
        const auth = requireAuth(req);
        if (auth instanceof Response) { return auth; }
        const { code } = await req.json() as { code: string };
        const result = validateBotCode(code);

        if (result.valid) {
          const tmpDir = `/tmp/navalcode-validate-${auth.id}-${Date.now()}`;
          const tmpFile = `${tmpDir}/bot.ts`;
          await Bun.$`mkdir -p ${tmpDir}`;
          await Bun.write(tmpFile, code);

          const biome = await Bun.$`bunx @biomejs/biome check ${tmpFile} 2>&1`.quiet().nothrow();
          if (biome.exitCode !== 0) {
            result.errors.push("Biome : le code doit être linté et formaté");
            result.valid = false;
          }

          if (result.valid) {
            const tsc = await Bun.$`bunx tsc --noEmit --lib ESNext,DOM --target ESNext --module Preserve --moduleResolution bundler --strict --skipLibCheck ${tmpFile} 2>&1`.quiet().nothrow();
            if (tsc.exitCode !== 0) {
              result.errors.push("TypeScript : le code doit passer les vérifications");
              result.valid = false;
            }
          }

          await Bun.$`rm -rf ${tmpDir}`;
        }

        return json(result);
      },
    },

    "/api/bots/sync": {
      async POST(req: Request) {
        const auth = requireAuth(req);
        if (auth instanceof Response) { return auth; }
        const userId = auth.id;
        const { code } = await req.json() as { code: string };
        const nameMatch = code.match(/name\s*[:=]\s*["']([^"']+)["']/);
        const baseName = nameMatch?.[1] || "MonRobot";
        const db = getDB();

        // Find next available name if baseName is taken by a non-dev bot
        function resolveName(name: string): string {
          const taken = db.query(
            "SELECT name FROM bots WHERE user_id = ? AND status != 'dev'",
          ).all(userId) as { name: string }[];
          const takenNames = new Set(taken.map(b => b.name));
          if (!takenNames.has(name)) { return name; }
          const allWithPrefix = db.query(
            "SELECT name FROM bots WHERE user_id = ? AND status != 'dev' AND name LIKE ?",
          ).all(userId, `${name}-%`) as { name: string }[];
          const usedSuffixes = new Set(allWithPrefix.map(b => b.name));
          let suffix = 1;
          while (usedSuffixes.has(`${name}-${suffix}`)) { suffix++; }
          return `${name}-${suffix}`;
        }

        const finalName = resolveName(baseName);

        // If user already has a dev bot, update it in-place
        const existing = db.query(
          "SELECT id FROM bots WHERE user_id = ? AND status = 'dev' LIMIT 1",
        ).get(userId) as { id: number } | undefined;
        if (existing) {
          db.run("UPDATE bots SET name = ?, code = ?, updated_at = datetime('now') WHERE id = ?",
            [finalName, code, existing.id]);
          return json({ bot: { id: existing.id, name: finalName, status: "dev" } });
        }

        const info = db.query(
          "INSERT INTO bots (user_id, name, code, status) VALUES (?, ?, ?, 'dev') RETURNING id",
        ).get(userId, finalName, code) as { id: number };
        return json({ bot: { id: info.id, name: finalName, status: "dev" } });
      },
    },

    "/api/bots/finalize": {
      POST(req: Request) {
        const auth = requireAuth(req);
        if (auth instanceof Response) { return auth; }
        const db = getDB();
        const bot = db.query(
          "SELECT id, code FROM bots WHERE user_id = ? AND status = 'dev' ORDER BY created_at DESC LIMIT 1",
        ).get(auth.id) as { id: number; code: string } | undefined;
        if (!bot) { return json({ error: "Aucun robot en développement" }, 404); }
        const validation = validateBotCode(bot.code);
        if (!validation.valid) {
          return json({ error: "Validation échouée", details: validation.errors }, 400);
        }
        db.run("UPDATE bots SET status = 'finalized', updated_at = datetime('now') WHERE id = ?", [bot.id]);
        return json({ success: true, bot: { id: bot.id, status: "finalized" } });
      },
    },

    "/api/leaderboard": {
      GET() {
        const db = getDB();
        const rows = db.query(`
          SELECT u.id, u.username, u.display_name,
            SUM(b.wins) as wins, SUM(b.losses) as losses, SUM(b.draws) as draws,
            (SUM(b.wins) + SUM(b.losses) + SUM(b.draws)) as total,
            CASE WHEN (SUM(b.wins) + SUM(b.losses) + SUM(b.draws)) > 0
              THEN ROUND(CAST(SUM(b.wins) AS REAL) / (SUM(b.wins) + SUM(b.losses) + SUM(b.draws)), 3)
              ELSE 0 END as winrate
          FROM users u
          JOIN bots b ON b.user_id = u.id
          GROUP BY u.id
          HAVING total > 0
          ORDER BY wins DESC, winrate DESC
          LIMIT 100
        `).all();
        return json(rows);
      },
    },

    "/api/bots/train/transpile": {
      GET(req: Request) {
        const auth = requireAuth(req);
        if (auth instanceof Response) { return auth; }
        const db = getDB();
        const bot = db.query(
          "SELECT code FROM bots WHERE user_id = ? AND status = 'dev'",
        ).get(auth.id) as { code: string } | undefined;
        if (!bot) { return json({ error: "Aucun robot en développement" }, 404); }

        const t = new Bun.Transpiler({ loader: "ts" });
        try {
          const js = t.transformSync(bot.code)
            .replace(/import\s+.*\s+from\s+["'].*["'];?\n?/g, "")
            .replace(/export\s+/g, "");
          return json({ js });
        } catch {
          return json({ error: "Erreur de transpilation" }, 500);
        }
      },
    },

    "/api/bots/train/templates": {
      async GET() {
        const names = ["Random", "SmartBot", "StrategicBot"];
        const t = new Bun.Transpiler({ loader: "ts" });
        const templates = await Promise.all(names.map(async (name) => {
          const file = Bun.file(`bots/${name}.ts`);
          const code = await file.text();
          const js = t.transformSync(code)
            .replace(/import\s+.*\s+from\s+["'].*["'];?\n?/g, "")
            .replace(/export\s+/g, "");
          return { name, js };
        }));
        return json(templates);
      },
    },

    "/api/events": {
      GET() {
        const db = getDB();
        const events = db.query("SELECT id, name, description, event_date, status FROM events ORDER BY event_date DESC").all();
        return json(events);
      },
    },

    "/api/events/leaderboard": {
      GET(req: Request) {
        const url = new URL(req.url);
        const eventId = Number.parseInt(url.searchParams.get("eventId") || "", 10);
        if (!eventId) { return json({ error: "eventId requis" }, 400); }
        const db = getDB();
        const rows = db.query(`
          SELECT u.id, u.username, u.display_name, eb.rank, eb.score, eb.prize
          FROM event_bots eb
          JOIN bots b ON b.id = eb.bot_id
          JOIN users u ON u.id = b.user_id
          WHERE eb.event_id = ?
          ORDER BY eb.rank ASC
        `).all(eventId);
        return json(rows);
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${SERVER.url}`);
