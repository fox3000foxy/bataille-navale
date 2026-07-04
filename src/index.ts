import { serve } from "bun";
import index from "./index.html";
import { getDB } from "./db/database";
import { hashPassword, verifyPassword } from "./auth/password";
import { createSession, deleteSession, getUserFromToken, extractToken } from "./auth/session";

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

const SERVER = serve({
  routes: {
    "/*": index,

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
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${SERVER.url}`);
