import { RESET, BOLD, DIM, CYAN, PURPLE, TEXT, MUTED, GRAY, GREEN, BG_DARK, gradient, box, logo } from "./ansi.ts";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const API = process.env.NAVALCODE_API || "http://localhost:3000";

interface CodeResponse {
  code: string;
  expires_at: string;
}

interface StatusResponse {
  status: "pending" | "confirmed" | "expired" | "not_found";
  token?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function auth(): Promise<void> {
  console.log(`\n${BG_DARK}${logo()}${RESET}\n`);

  const codeRes = await fetch(`${API}/api/auth/device/code`);
  if (!codeRes.ok) {
    console.error(`${BOLD}${gradient(" Erreur ", [239, 68, 68], [239, 68, 68])} Impossible de contacter le serveur${RESET}`);
    process.exit(1);
  }

  const { code } = await codeRes.json() as CodeResponse;

  const codeBlock = `  ${BOLD}${CYAN}╔═══════════════╗${RESET}
  ${BOLD}${CYAN}║${RESET}   ${gradient(code, [0, 212, 255], [124, 58, 237])}   ${BOLD}${CYAN}║${RESET}
  ${BOLD}${CYAN}╚═══════════════╝${RESET}`;

  console.log(`${box("Authentification CLI")}\n`);
  console.log(`  ${MUTED}Code d'authentification :${RESET}\n`);
  console.log(`${codeBlock}\n`);
  console.log(`  ${MUTED}Rendez-vous sur${RESET} ${TEXT}${BOLD}${API}/device${RESET} ${MUTED}dans votre navigateur${RESET}`);
  console.log(`  ${MUTED}et entrez ce code pour autoriser le CLI.${RESET}\n`);
  console.log(`  ${GRAY}Le code expire dans 10 minutes.${RESET}\n`);
  console.log(`  ${DIM}${"─".repeat(40)}${RESET}`);
  console.log(`  ${DIM}En attente de confirmation...${RESET}`);

  const pollInterval = 2000;
  const maxAttempts = 300;

  for (let i = 0; i < maxAttempts; i++) {
    await sleep(pollInterval);
    const statusRes = await fetch(`${API}/api/auth/device/status?code=${encodeURIComponent(code)}`);
    if (!statusRes.ok) { continue; }
    const data = await statusRes.json() as StatusResponse;

    if (data.status === "confirmed" && data.token) {
      console.log(`  ${GREEN}✓ CLI authentifié avec succès !${RESET}\n`);
      const home = process.env.HOME || process.env.USERPROFILE || ".";
      const configDir = join(home, ".config", "navalcode");
      if (!existsSync(configDir)) {
        mkdirSync(configDir, { recursive: true });
      }
      writeFileSync(join(configDir, "token"), data.token, "utf-8");
      console.log(`  ${GREEN}✓ Token sauvegardé${RESET}\n`);
      console.log(`  ${MUTED}Vous pouvez maintenant utiliser${RESET} ${CYAN}navalcode sync${RESET} ${MUTED}pour synchroniser vos robots.${RESET}\n`);
      return;
    }

    if (data.status === "expired") {
      console.log(`\n  ${gradient(" Code expiré ", [239, 68, 68], [200, 50, 50])} Veuillez relancer ${CYAN}navalcode auth${RESET}\n`);
      process.exit(1);
    }

    if (i % 5 === 0) {
      process.stdout.write(".");
    }
  }

  console.log(`\n  ${gradient(" Délai dépassé ", [239, 68, 68], [200, 50, 50])} Veuillez relancer ${CYAN}navalcode auth${RESET}\n`);
  process.exit(1);
}

