import { useI18n } from "../i18n/I18nContext";

function Pre({ children }: { children: string }) {
  return (
    <pre className="text-sm text-[#fbf0df]/70 font-mono leading-relaxed overflow-x-auto bg-[#0d0d14] p-4 rounded-xl border-l-2 border-[#00d4ff]/30">
      {children}
    </pre>
  );
}

function Code({ children }: { children: string }) {
  return (
    <code className="text-[#00d4ff] bg-[#0d0d14] px-2 py-0.5 rounded font-mono text-sm border border-[#00d4ff]/20">
      {children}
    </code>
  );
}

function DocCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 mb-6">
      <h3 className="text-lg font-bold text-[#fbf0df] mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function Documentation() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#00d4ff]/20 to-[#7c3aed]/20 border border-[#00d4ff]/20 text-sm font-bold text-[#00d4ff]">
            D
          </div>
          <h1 className="text-4xl font-bold text-[#fbf0df]">{t("docs.title")}</h1>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">
            <span className="text-gradient">{t("docs.enums.title")}</span>
          </h2>

          <DocCard title={t("docs.state.title")}>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              {t("docs.state.desc")}
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#fbf0df]">None</span>
                <span className="text-xs text-[#fbf0df]/40">{t("docs.state.none")}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#ff6b35]">Hit</span>
                <span className="text-xs text-[#fbf0df]/40">{t("docs.state.hit")}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#00d4ff]">Sunk</span>
                <span className="text-xs text-[#fbf0df]/40">{t("docs.state.sunk")}</span>
              </div>
            </div>
            <Pre>{`enum State {
  None = "None",
  Hit = "Hit",
  Sunk = "Sunk",
}`}</Pre>
          </DocCard>

          <DocCard title={t("docs.boats.title")}>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              {t("docs.boats.desc")}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#fbf0df]">AircraftCarrier</span>
                <span className="text-xs text-[#00d4ff]">5 {t("docs.boats.cells")}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#fbf0df]">Cruiser</span>
                <span className="text-xs text-[#00d4ff]">4 {t("docs.boats.cells")}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#fbf0df]">TorpedoBoat</span>
                <span className="text-xs text-[#00d4ff]">3 {t("docs.boats.cells")}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#fbf0df]">Submarine</span>
                <span className="text-xs text-[#00d4ff]">2 {t("docs.boats.cells")}</span>
              </div>
            </div>
            <Pre>{`enum Boats {
  AircraftCarrier = 5,
  Cruiser = 4,
  TorpedoBoat = 3,
  Submarine = 2,
}`}</Pre>
          </DocCard>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">
            <span className="text-gradient">{t("docs.classes.title")}</span>
          </h2>

          <DocCard title={t("docs.board.title")}>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              {t("docs.board.desc")} <Code>State</Code>.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">{t("docs.board.property")}</span>
                <span className="block text-sm font-mono text-[#fbf0df]">board: State[][]</span>
                <span className="block text-xs text-[#fbf0df]/40 mt-1">{t("docs.board.propertyDesc")}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">{t("docs.board.constructor")}</span>
                <span className="block text-sm font-mono text-[#fbf0df]">new Board()</span>
                <span className="block text-xs text-[#fbf0df]/40 mt-1">{t("docs.board.constructorDesc")}</span>
              </div>
            </div>
            <Pre>{`class Board {
  board: State[][];

  constructor() {
    this.board = Array.from({ length: 11 }, () =>
      Array.from({ length: 11 }, () => State.None)
    );
  }
}`}</Pre>
          </DocCard>

          <DocCard title={t("docs.strategy.title")}>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              {t("docs.strategy.desc")}
            </p>
            <div className="space-y-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">{t("docs.strategy.type")}</span>
                <span className="block text-sm font-mono text-[#fbf0df]">Direction = "left" | "right" | "up" | "down"</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">{t("docs.strategy.interface")}</span>
                <span className="block text-sm font-mono text-[#fbf0df]">BoatPlacement {'{ boat: Boats; x: number; y: number; direction: Direction }'}</span>
              </div>
            </div>
            <Pre>{`class Strategy {
  placements: BoatPlacement[];

  addBoat(boat: Boats, x: number, y: number, direction: Direction): void
  getCells(placement: BoatPlacement): { x: number; y: number }[]
  isHit(x: number, y: number): BoatPlacement | undefined
  isSunk(hitBoard: State[][]): BoatPlacement | undefined
}`}</Pre>
            <div className="mt-4 space-y-2">
              <p className="text-[#fbf0df]/50 text-sm">
                <span className="text-[#00d4ff] font-mono">addBoat</span> {t("docs.strategy.addBoat")}
              </p>
              <p className="text-[#fbf0df]/50 text-sm">
                <span className="text-[#00d4ff] font-mono">getCells</span> {t("docs.strategy.getCells")}
              </p>
              <p className="text-[#fbf0df]/50 text-sm">
                <span className="text-[#00d4ff] font-mono">isHit</span> {t("docs.strategy.isHit")}
              </p>
              <p className="text-[#fbf0df]/50 text-sm">
                <span className="text-[#00d4ff] font-mono">isSunk</span> {t("docs.strategy.isSunk")}
              </p>
            </div>
          </DocCard>

          <DocCard title={t("docs.brain.title")}>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              {t("docs.brain.desc")}
            </p>
            <Pre>{`abstract class Brain {
  name: string;

  abstract think(): { x: number; y: number };
  abstract turn(x: number, y: number): void;
  abstract getStrategy(): Strategy;

  getAdversaryBoard(): Board;
  placeBoats(...boats: [Boats, Direction, [number, number]][]): Strategy;
}`}</Pre>
          </DocCard>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">
            <span className="text-gradient">{t("docs.bots.title")}</span>
          </h2>
          <p className="text-[#fbf0df]/50 leading-relaxed mb-6">
            {t("docs.bots.intro")}
          </p>

          <DocCard title={t("docs.bots.random.title")}>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              {t("docs.bots.random.desc")}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">{t("docs.placement")}</span>
                <span className="block text-sm text-[#fbf0df]">{t("docs.bots.random.placement")}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">{t("docs.shot")}</span>
                <span className="block text-sm text-[#fbf0df]">{t("docs.bots.random.shot")}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <a href="/api/bots/Random.ts" download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-semibold text-xs no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all btn-primary"
              >
                Telecharger .ts
              </a>
            </div>
            <Pre>{`export class Random extends Brain {
  think(): { x: number; y: number } {
    let x: number;
    let y: number;
    do {
      x = Math.floor(Math.random() * 11);
      y = Math.floor(Math.random() * 11);
    } while (this.targetedCells.has(\`$\{x},$\{y}\`));
    this.targetedCells.add(\`$\{x},$\{y}\`);
    return { x, y };
  }

  turn(x: number, y: number): void {
    if (this.myStrategy.isHit(x, y)) {
      this.myBoard.board[x]![y] = State.Hit;
      const sunk = this.myStrategy.isSunk(this.myBoard.board);
      if (sunk) {
        for (const cell of this.myStrategy.getCells(sunk)) {
          this.myBoard.board[cell.x]![cell.y] = State.Sunk;
        }
      }
    }
  }
}`}</Pre>
          </DocCard>

          <DocCard title={t("docs.bots.smart.title")}>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              {t("docs.bots.smart.desc")}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">{t("docs.placement")}</span>
                <span className="block text-sm text-[#fbf0df]">{t("docs.bots.smart.placement")}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">{t("docs.shot")}</span>
                <span className="block text-sm text-[#fbf0df]">{t("docs.bots.smart.shot")}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <a href="/api/bots/SmartBot.ts" download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-semibold text-xs no-underline hover:shadow-[0_0_25px rgba(0,212,255,0.3)] transition-all btn-primary"
              >
                Telecharger .ts
              </a>
            </div>
            <Pre>{`export class SmartBot extends Brain {
  getStrategy(): Strategy {
    // Place les bateaux avec un espace de 1 case
    // entre chaque bateau (isFarFromOthers)
    ...
  }

  think(): { x: number; y: number } {
    // 1. Cherche les State.Hit sur le plateau adverse
    // 2. Ajoute les cases adjacentes aux touches
    // 3. Explore les hits en priorite
    // 4. Sinon, tire aleatoirement
    ...
  }
}`}</Pre>
          </DocCard>

          <DocCard title={t("docs.bots.strategic.title")}>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              {t("docs.bots.strategic.desc")}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">{t("docs.placement")}</span>
                <span className="block text-sm text-[#fbf0df]">{t("docs.bots.strategic.placement")}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">{t("docs.shot")}</span>
                <span className="block text-sm text-[#fbf0df]">{t("docs.bots.strategic.shot")}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <a href="/api/bots/StrategicBot.ts" download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-semibold text-xs no-underline hover:shadow-[0_0_25px rgba(0,212,255,0.3)] transition-all btn-primary"
              >
                Telecharger .ts
              </a>
            </div>
            <Pre>{`export class StrategicBot extends Brain {
  private buildSearchPattern(): void {
    for (let y = 0; y < 11; y += 3) {
      for (let x = 0; x < 11; x += 3) {
        this.searchQueue.push({ x, y });
      }
    }
  }

  think(): { x: number; y: number } {
    // 1. Phase de chasse : explore les cases adjacentes
    // 2. Phase de recherche : suit la grille pas-3
    // 3. Fallback : aleatoire
    ...
  }
}`}</Pre>
          </DocCard>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">
            <span className="text-gradient">{t("docs.example.title")}</span>
          </h2>
          <div className="rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 overflow-hidden">
            <div className="px-6 py-3 border-b border-[#fbf0df]/5 bg-[#0d0d14]">
              <span className="text-sm font-bold text-[#fbf0df]/30 font-mono">monRobot.ts</span>
            </div>
            <div className="p-6">
              <Pre>{`import { Brain } from "@navalcode/sdk";
import { Strategy } from "@navalcode/sdk";
import { Board } from "@navalcode/sdk";
import { Boats, State } from "@navalcode/sdk";

export class MyBot extends Brain {
  private myBoard: Board;
  private myStrategy: Strategy;

  constructor() {
    super();
    this.name = "MyBot";
    this.myBoard = new Board();
    this.myStrategy = this.buildStrategy();
  }

  private buildStrategy(): Strategy {
    const strategy = new Strategy();
    strategy.addBoat(Boats.AircraftCarrier, 5, 5, "right");
    strategy.addBoat(Boats.Cruiser, 2, 2, "down");
    strategy.addBoat(Boats.TorpedoBoat, 8, 1, "right");
    strategy.addBoat(Boats.Submarine, 0, 0, "right");
    return strategy;
  }

  getStrategy(): Strategy {
    return this.myStrategy;
  }

  think(): { x: number; y: number } {
    return { x: Math.floor(Math.random() * 11), y: Math.floor(Math.random() * 11) };
  }

  turn(x: number, y: number): void {
    if (this.myStrategy.isHit(x, y)) {
      this.myBoard.board[x]![y] = State.Hit;
    }
  }
}`}</Pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
