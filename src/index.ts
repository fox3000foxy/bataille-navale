import { serve } from "bun";
import index from "./index.html";
import { getDB } from "./db/database";

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

function json(data: unknown) {
  return secureHeaders(Response.json(data));
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
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${SERVER.url}`);
