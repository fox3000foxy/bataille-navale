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
    console.error(`${BOLD}${gradient(" Error ", [239, 68, 68], [239, 68, 68])} Could not reach the server${RESET}`);
    process.exit(1);
  }

  const { code } = await codeRes.json() as CodeResponse;

  const codeBlock = `  ${BOLD}${CYAN}╔═══════════════╗${RESET}
  ${BOLD}${CYAN}║${RESET}   ${gradient(code, [0, 212, 255], [124, 58, 237])}   ${BOLD}${CYAN}║${RESET}
  ${BOLD}${CYAN}╚═══════════════╝${RESET}`;

  console.log(`${box("CLI Authentication")}\n`);
  console.log(`  ${MUTED}Authentication code:${RESET}\n`);
  console.log(`${codeBlock}\n`);
  console.log(`  ${MUTED}Go to${RESET} ${TEXT}${BOLD}${API}/device${RESET} ${MUTED}in your browser${RESET}`);
  console.log(`  ${MUTED}and enter this code to authorize the CLI.${RESET}\n`);
  console.log(`  ${GRAY}The code expires in 10 minutes.${RESET}\n`);
  console.log(`  ${DIM}${"─".repeat(40)}${RESET}`);
  console.log(`  ${DIM}Waiting for confirmation...${RESET}`);

  const pollInterval = 2000;
  const maxAttempts = 300;

  for (let i = 0; i < maxAttempts; i++) {
    await sleep(pollInterval);
    const statusRes = await fetch(`${API}/api/auth/device/status?code=${encodeURIComponent(code)}`);
    if (!statusRes.ok) { continue; }
    const data = await statusRes.json() as StatusResponse;

    if (data.status === "confirmed" && data.token) {
      console.log(`  ${GREEN}✓ CLI authenticated successfully!${RESET}\n`);
      const home = process.env.HOME || process.env.USERPROFILE || ".";
      const configDir = join(home, ".config", "navalcode");
      if (!existsSync(configDir)) {
        mkdirSync(configDir, { recursive: true });
      }
      writeFileSync(join(configDir, "token"), data.token, "utf-8");
      console.log(`  ${GREEN}✓ Token saved${RESET}\n`);
      console.log(`  ${MUTED}You can now use${RESET} ${CYAN}navalcode sync${RESET} ${MUTED}to sync your robots.${RESET}\n`);
      return;
    }

    if (data.status === "expired") {
      console.log(`\n  ${gradient(" Code expired ", [239, 68, 68], [200, 50, 50])} Please run ${CYAN}navalcode auth${RESET} again\n`);
      process.exit(1);
    }

    if (i % 5 === 0) {
      process.stdout.write(".");
    }
  }

  console.log(`\n  ${gradient(" Timeout ", [239, 68, 68], [200, 50, 50])} Please run ${CYAN}navalcode auth${RESET} again\n`);
  process.exit(1);
}
