import { readFileSync, watch, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { RESET, BOLD, DIM, CYAN, TEXT, MUTED, GRAY, GREEN, RED, BG_DARK, gradient, box, logo } from "./ansi.ts";
import { getToken } from "./token.ts";

const API = process.env.NAVALCODE_API || "http://localhost:3000";

interface SyncResult {
  bot?: { id: number; name: string; status: string };
  error?: string;
}

async function syncCode(filePath: string): Promise<boolean> {
  const token = getToken();
  if (!token) {
    console.error(`\n  ${gradient(" Erreur ", [239, 68, 68], [200, 50, 50])} Non authentifié. Lancez ${CYAN}navalcode auth${RESET} d'abord.\n`);
    return false;
  }

  let code: string;
  try {
    code = readFileSync(filePath, "utf-8");
  } catch {
    console.error(`\n  ${gradient(" Erreur ", [239, 68, 68], [200, 50, 50])} Impossible de lire ${filePath}\n`);
    return false;
  }

  const res = await fetch(`${API}/api/bots/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });

  const data = await res.json() as SyncResult & { details?: string[] };
  if (!res.ok || data.error) {
    console.error(`\n  ${gradient(" Erreur ", [239, 68, 68], [200, 50, 50])} ${data.error || "Échec de la synchronisation"}\n`);
    if (data.details?.length) {
      for (const err of data.details) {
        console.error(`    ${RED}✗${RESET} ${err}`);
      }
      console.error();
    }
    return false;
  }

  console.log(`  ${GREEN}✓${RESET} ${MUTED}Syncé :${RESET} ${TEXT}${BOLD}${data.bot!.name}${RESET} ${DIM}(${data.bot!.status})${RESET}`);
  return true;
}

export async function sync(filePath: string): Promise<void> {
  console.log(`\n${BG_DARK}${logo()}${RESET}\n`);

  const fullPath = resolve(filePath);

  if (!existsSync(fullPath)) {
    console.error(`\n  ${gradient(" Erreur ", [239, 68, 68], [200, 50, 50])} Fichier introuvable : ${fullPath}\n`);
    process.exit(1);
  }

  if (!statSync(fullPath).isFile()) {
    console.error(`\n  ${gradient(" Erreur ", [239, 68, 68], [200, 50, 50])} ${fullPath} n'est pas un fichier\n`);
    process.exit(1);
  }

  console.log(`  ${MUTED}Fichier :${RESET} ${TEXT}${fullPath}${RESET}\n`);

  const name = fullPath.split("/").pop()?.replace(".ts", "") || "bot";
  console.log(`${box(`  ${name}  `)}\n`);
  console.log(`  ${DIM}${"─".repeat(40)}${RESET}`);

  const ok = await syncCode(fullPath);
  if (!ok) { process.exit(1); }

  console.log(`  ${DIM}Surveillance du fichier...${RESET} ${GRAY}(Ctrl+C pour arrêter)${RESET}\n`);

  let timeout: ReturnType<typeof setTimeout> | null = null;
  watch(fullPath, () => {
    if (timeout) { clearTimeout(timeout); }
    timeout = setTimeout(async () => {
      process.stdout.write(`  ${DIM}${new Date().toLocaleTimeString()}${RESET} `);
      await syncCode(fullPath);
    }, 300);
  });

  await new Promise(() => {});
}
