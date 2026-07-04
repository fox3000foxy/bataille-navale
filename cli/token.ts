import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export function getToken(): string | null {
  const home = process.env.HOME || process.env.USERPROFILE || ".";
  const tokenPath = join(home, ".config", "navalcode", "token");
  if (!existsSync(tokenPath)) { return null; }
  return readFileSync(tokenPath, "utf-8").trim();
}
