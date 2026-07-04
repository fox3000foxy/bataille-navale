import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

export interface SandboxResult {
  winner: "bot1" | "bot2" | "draw" | "error";
  rounds: number;
  error?: string;
}

const SDK_FILES: [string, string][] = [
  ["src/types/State.ts", "State"],
  ["src/types/Boats.ts", "Boats"],
  ["src/classes/Board.ts", "Board"],
  ["src/classes/Strategy.ts", "Strategy"],
  ["src/classes/Brain.ts", "Brain"],
  ["src/classes/Game.ts", "Game"],
];

function loadSDK(): string {
  return SDK_FILES
    .map(([path]) => {
      const src = readFileSync(path, "utf-8");
      return src
        .replace(/^import\s+type\s+\{[^}]*\}\s*from\s*['"][^'"]*['"];?\s*$/gm, "")
        .replace(/^import\s+\{[^}]*\}\s*from\s*['"][^'"]*['"];?\s*$/gm, "")
        .replace(/^import\s+.*?;?\s*$/gm, "")
        .replace(/^export\s+/gm, "");
    })
    .join("\n");
}

function sanitizeBot(code: string): string {
  return code
    .replace(/^import\s+.*?;?\s*$/gm, "")
    .replace(/^export\s+/gm, "");
}

function renameClass(code: string, newName: string): string {
  return code.replace(/class\s+\w+(\s+extends\s+Brain\b)/, `class ${newName}$1`);
}

function buildSandboxScript(bot1: string, bot2: string, maxRounds: number): string {
  const sdk = loadSDK();
  const id = Math.random().toString(36).slice(2, 8);
  const name1 = `Bot1_${id}`;
  const name2 = `Bot2_${id}`;

  return `
// ═══ Sandbox execution environment ═══
globalThis.process = undefined;
globalThis.Bun = undefined;
globalThis.fetch = undefined;
globalThis.require = undefined;

// ═══ SDK classes ═══
${sdk}

// ═══ Bot 1 ═══
${renameClass(sanitizeBot(bot1), name1)}

// ═══ Bot 2 ═══
${renameClass(sanitizeBot(bot2), name2)}

// ═══ Game runner ═══
function isAllSunk(strategy, board) {
  for (const p of strategy.placements) {
    const cells = strategy.getCells(p);
    if (cells.every(c => board[c.x]?.[c.y] === State.Sunk)) {
      return true;
    }
  }
  return false;
}

try {
  const bot1 = new ${name1}();
  const bot2 = new ${name2}();
  const game = new Game(bot1, bot2);
  let rounds = 0;

  while (rounds < ${maxRounds}) {
    game.play();
    rounds++;

    if (isAllSunk(game.strategy1, game.board1.board)) {
      console.log(JSON.stringify({ winner: "bot2", rounds }));
      process.exit(0);
    }
    if (isAllSunk(game.strategy2, game.board2.board)) {
      console.log(JSON.stringify({ winner: "bot1", rounds }));
      process.exit(0);
    }
  }

  console.log(JSON.stringify({ winner: "draw", rounds }));
} catch (err) {
  console.log(JSON.stringify({ winner: "error", rounds: 0, error: String(err) }));
}
process.exit(0);
`;
}

export async function runSandboxedMatch(
  bot1Code: string,
  bot2Code: string,
  options?: { timeoutMs?: number; maxRounds?: number },
): Promise<SandboxResult> {
  const timeoutMs = options?.timeoutMs ?? 10_000;
  const maxRounds = options?.maxRounds ?? 1000;

  const tmpDir = mkdtempSync(join(tmpdir(), "navalcode-"));
  const scriptPath = join(tmpDir, "match.ts");

  try {
    const script = buildSandboxScript(bot1Code, bot2Code, maxRounds);
    writeFileSync(scriptPath, script);

    const proc = Bun.spawn(["bun", "run", scriptPath], {
      env: {},
      stdio: ["pipe", "pipe", "pipe"],
    });

    const timeout = AbortSignal.timeout(timeoutMs);
    const output = await Promise.race([
      new Response(proc.stdout).text(),
      new Promise<string>((_, reject) => {
        timeout.onabort = () => reject(new Error("Match timed out"));
      }),
    ]);

    const exitCode = await proc.exited;
    if (exitCode !== 0) {
      const stderr = await new Response(proc.stderr).text();
      return { winner: "error", rounds: 0, error: `Process exited with code ${exitCode}: ${stderr.slice(0, 200)}` };
    }

    const parsed = JSON.parse(output);
    return { winner: parsed.winner, rounds: parsed.rounds, error: parsed.error };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message === "Match timed out") {
      return { winner: "error", rounds: 0, error: "Match timed out" };
    }
    return { winner: "error", rounds: 0, error: message };
  } finally {
    try { rmSync(tmpDir, { recursive: true }); } catch {}
  }
}
