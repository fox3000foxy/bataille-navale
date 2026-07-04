export const RESET = "\x1b[0m";
export const BOLD = "\x1b[1m";
export const DIM = "\x1b[2m";

function rgb(r: number, g: number, b: number): string {
  return `\x1b[38;2;${r};${g};${b}m`;
}

function bg(r: number, g: number, b: number): string {
  return `\x1b[48;2;${r};${g};${b}m`;
}

export const CYAN = rgb(0, 212, 255);
export const PURPLE = rgb(124, 58, 237);
export const TEXT = rgb(251, 240, 223);
export const MUTED = rgb(251, 240, 223);
export const GRAY = rgb(100, 100, 120);
export const GREEN = rgb(34, 197, 94);
export const RED = rgb(239, 68, 68);
export const BG_DARK = bg(13, 13, 20);
export const BG_CARD = bg(22, 22, 31);

export function gradient(text: string, from: [number, number, number], to: [number, number, number]): string {
  const chars = [...text];
  const out = chars.map((c, i) => {
    const t = chars.length <= 1 ? 0 : i / (chars.length - 1);
    const r = Math.round(from[0] + (to[0] - from[0]) * t);
    const g = Math.round(from[1] + (to[1] - from[1]) * t);
    const b = Math.round(from[2] + (to[2] - from[2]) * t);
    return `${rgb(r, g, b)}${c}`;
  });
  return out.join("") + RESET;
}

export function box(text: string): string {
  const lines = text.split("\n");
  const width = Math.max(...lines.map((l) => l.length));
  const top = `╭${"─".repeat(width + 2)}╮`;
  const bottom = `╰${"─".repeat(width + 2)}╯`;
  const middle = lines.map((l) => `│ ${l.padEnd(width)} │`).join("\n");
  return `${BG_CARD}${top}\n${middle}\n${bottom}${RESET}`;
}

export function logo(): string {
  const text = "NavalCode";
  const inner = `  ${gradient(text, [0, 212, 255], [124, 58, 237])}  `;
  const contentWidth = 2 + text.length + 2;
  const top = `╭${"─".repeat(contentWidth)}╮`;
  const bottom = `╰${"─".repeat(contentWidth)}╯`;
  return `${DIM}${top}${RESET}\n${DIM}│${RESET}${inner}${DIM}│${RESET}\n${DIM}${bottom}${RESET}`;
}
