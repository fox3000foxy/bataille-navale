import { Random } from "./src/bots/Random";
import { SmartBot } from "./src/bots/SmartBot";
import { StrategicBot } from "./src/bots/StrategicBot";
import { BatchCalculator } from "./src/classes/BatchCalculator";

const calc = new BatchCalculator();
const iterations = 500;

console.log(`Running ${iterations} iterations per matchup...\n`);

const matchups = [
  ["Random vs SmartBot", new Random(), new SmartBot()],
  ["Random vs StrategicBot", new Random(), new StrategicBot()],
  ["SmartBot vs StrategicBot", new SmartBot(), new StrategicBot()],
] as const;

for (const [label, b1, b2] of matchups) {
  console.time(label);
  const results = calc.calculate(b1, b2, iterations);
  console.timeEnd(label);
  for (const r of results) {
    console.log(`  ${r.name}: ${(r.successRate * 100).toFixed(1)}%`);
  }
  console.log();
}
