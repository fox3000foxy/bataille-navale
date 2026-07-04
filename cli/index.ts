#!/usr/bin/env node
import { auth } from "./auth.ts";
import { sync } from "./sync.ts";
import { gradient, RESET, BOLD, MUTED, GRAY } from "./ansi.ts";

const commands: Record<string, (args: string[]) => Promise<void>> = {
  auth: async () => { await auth(); },
  sync: async (args) => {
    const file = args[0];
    if (!file) {
      console.error(`\n  ${gradient(" Error ", [239, 68, 68], [200, 50, 50])} Usage: ${BOLD}navalcode sync <file.ts>${RESET}\n`);
      process.exit(1);
    }
    await sync(file);
  },
};

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === "--help" || cmd === "-h") {
    console.log(`\n  ${gradient("NavalCode CLI", [0, 212, 255], [124, 58, 237])}${RESET}`);
    console.log(`\n  ${BOLD}Usage${RESET}`);
    console.log(`    ${MUTED}navalcode <command> [options]${RESET}\n`);
    console.log(`  ${BOLD}Commands${RESET}`);
    console.log(`    ${MUTED}auth           ${GRAY}Authenticate the CLI with your account${RESET}`);
    console.log(`    ${MUTED}sync <file>    ${GRAY}Sync and watch a robot file${RESET}`);
    console.log(`    ${MUTED}simulate      ${GRAY}Run headless simulations (coming soon)${RESET}\n`);
    return;
  }

  const fn = commands[cmd];
  if (!fn) {
    console.error(`\n  ${gradient(" Error ", [239, 68, 68], [200, 50, 50])} Unknown command: "${cmd}"${RESET}\n`);
    process.exit(1);
  }

  await fn(args.slice(1));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
