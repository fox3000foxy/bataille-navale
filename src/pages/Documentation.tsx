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
  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#00d4ff]/20 to-[#7c3aed]/20 border border-[#00d4ff]/20 text-sm font-bold text-[#00d4ff]">
            D
          </div>
          <h1 className="text-4xl font-bold text-[#fbf0df]">Documentation SDK</h1>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">
            <span className="text-gradient">Enums</span>
          </h2>

          <DocCard title="State">
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              Représente l'état d'une cellule sur le plateau de jeu.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#fbf0df]">None</span>
                <span className="text-xs text-[#fbf0df]/40">Case non ciblée</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#ff6b35]">Hit</span>
                <span className="text-xs text-[#fbf0df]/40">Touché mais pas coulé</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#00d4ff]">Sunk</span>
                <span className="text-xs text-[#fbf0df]/40">Bateau coulé</span>
              </div>
            </div>
            <Pre>{`enum State {
  None = "None",
  Hit = "Hit",
  Sunk = "Sunk",
}`}</Pre>
          </DocCard>

          <DocCard title="Boats">
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              Énumération des types de bateaux avec leur taille (en nombre de cases).
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#fbf0df]">AircraftCarrier</span>
                <span className="text-xs text-[#00d4ff]">5 cases</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#fbf0df]">Cruiser</span>
                <span className="text-xs text-[#00d4ff]">4 cases</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#fbf0df]">TorpedoBoat</span>
                <span className="text-xs text-[#00d4ff]">3 cases</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 text-center">
                <span className="block text-sm font-bold text-[#fbf0df]">Submarine</span>
                <span className="text-xs text-[#00d4ff]">2 cases</span>
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
            <span className="text-gradient">Classes</span>
          </h2>

          <DocCard title="Board">
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              Plateau de jeu de 11x11 cases. Chaque cellule contient un état <Code>State</Code>.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">Propriété</span>
                <span className="block text-sm font-mono text-[#fbf0df]">board: State[][]</span>
                <span className="block text-xs text-[#fbf0df]/40 mt-1">Matrice 11x11 indexée [x][y]</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">Constructeur</span>
                <span className="block text-sm font-mono text-[#fbf0df]">new Board()</span>
                <span className="block text-xs text-[#fbf0df]/40 mt-1">Initialise toutes les cellules à <Code>State.None</Code></span>
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

          <DocCard title="Strategy">
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              Gère le placement et la détection des bateaux sur le plateau.
            </p>
            <div className="space-y-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">Type</span>
                <span className="block text-sm font-mono text-[#fbf0df]">Direction = "left" | "right" | "up" | "down"</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">Interface</span>
                <span className="block text-sm font-mono text-[#fbf0df]">BoatPlacement {"{ boat: Boats; x: number; y: number; direction: Direction }"}</span>
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
                <span className="text-[#00d4ff] font-mono">addBoat</span> ajoute un bateau &agrave; la strat&eacute;gie.
              </p>
              <p className="text-[#fbf0df]/50 text-sm">
                <span className="text-[#00d4ff] font-mono">getCells</span> retourne toutes les cellules occup&eacute;es par un placement.
              </p>
              <p className="text-[#fbf0df]/50 text-sm">
                <span className="text-[#00d4ff] font-mono">isHit</span> v&eacute;rifie si un tir touche un bateau.
              </p>
              <p className="text-[#fbf0df]/50 text-sm">
                <span className="text-[#00d4ff] font-mono">isSunk</span> v&eacute;rifie si toutes les cellules d'un bateau sont touch&eacute;es.
              </p>
            </div>
          </DocCard>

          <DocCard title="Brain">
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              Classe abstraite &agrave; &eacute;tendre pour cr&eacute;er votre robot. Trois m&eacute;thodes sont &agrave; impl&eacute;menter.
            </p>
            <Pre>{`abstract class Brain {
  name: string;

  // Appelée à chaque tour. Retourne les coordonnées à attaquer.
  abstract think(): { x: number; y: number };

  // Notifie le robot que l'adversaire a tiré sur (x, y).
  abstract turn(x: number, y: number): void;

  // Retourne la stratégie de placement des bateaux.
  abstract getStrategy(): Strategy;

  // Retourne le plateau adverse connu du robot.
  getAdversaryBoard(): Board;

  // Méthode utilitaire pour placer des bateaux dans getStrategy().
  placeBoats(...boats: [Boats, Direction, [number, number]][]): Strategy;
}`}</Pre>
          </DocCard>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">
            <span className="text-gradient">Bots de r&eacute;f&eacute;rence</span>
          </h2>
          <p className="text-[#fbf0df]/50 leading-relaxed mb-6">
            Trois robots sont fournis avec le SDK pour vous aider &agrave; d&eacute;marrer. Vous pouvez les utiliser comme base pour votre propre strat&eacute;gie.
          </p>

          <DocCard title="RandomBot">
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              Le robot le plus simple. Il place ses bateaux al&eacute;atoirement et tire sur des cases au hasard sans aucune strat&eacute;gie.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">Placement</span>
                <span className="block text-sm text-[#fbf0df]">Al&eacute;atoire</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">Tir</span>
                <span className="block text-sm text-[#fbf0df]">Al&eacute;atoire</span>
              </div>
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

          <DocCard title="SmartBot">
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              Un robot plus intelligent. Ses bateaux sont plac&eacute;s avec un espace de 1 case entre eux (plus difficile &agrave; trouver). En phase d'attaque, il explore les cases adjacentes d&egrave;s qu'il touche un bateau.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">Placement</span>
                <span className="block text-sm text-[#fbf0df]">Al&eacute;atoire espac&eacute;</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">Tir</span>
                <span className="block text-sm text-[#fbf0df]">Al&eacute;atoire + chasse</span>
              </div>
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
    // 3. Explore les hits en priorit&eacute;
    // 4. Sinon, tire al&eacute;atoirement
    ...
  }
}`}</Pre>
          </DocCard>

          <DocCard title="StrategicBot">
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
              Un robot strat&eacute;gique qui utilise une recherche par grille avec un pas de 3 pour couvrir tout le plateau efficacement. Cette m&eacute;thode garantit qu'aucun bateau de taille 3+ ne peut lui &eacute;chapper.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">Placement</span>
                <span className="block text-sm text-[#fbf0df]">Al&eacute;atoire</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                <span className="block text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-1">Tir</span>
                <span className="block text-sm text-[#fbf0df]">Grille pas-3 + chasse</span>
              </div>
            </div>
            <Pre>{`export class StrategicBot extends Brain {
  private buildSearchPattern(): void {
    // Grille avec un pas de 3 :
    // (0,0), (0,3), (0,6), (0,9),
    // (3,0), (3,3), ...
    for (let y = 0; y < 11; y += 3) {
      for (let x = 0; x < 11; x += 3) {
        this.searchQueue.push({ x, y });
      }
    }
  }

  think(): { x: number; y: number } {
    // 1. Phase de chasse : explore les cases adjacentes
    // 2. Phase de recherche : suit la grille pas-3
    // 3. Fallback : al&eacute;atoire
    ...
  }
}`}</Pre>
          </DocCard>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">
            <span className="text-gradient">Exemple complet</span>
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
