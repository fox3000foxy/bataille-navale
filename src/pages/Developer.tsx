import logo from "../logo.svg";

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover">
      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#00d4ff]/20 to-[#7c3aed]/20 border border-[#00d4ff]/20 text-sm font-bold text-[#00d4ff] mb-3">
        {num}
      </span>
      <h3 className="text-lg font-bold text-[#fbf0df] mb-2">{title}</h3>
      <p className="text-[#fbf0df]/50 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export function Developer() {
  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <img src={logo} alt="" className="h-12 opacity-70" />
          <h1 className="text-4xl font-bold text-[#fbf0df]">Documentation développeur</h1>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6"><span className="text-gradient">SDK</span></h2>
          <p className="text-[#fbf0df]/50 leading-relaxed mb-6">
            Le SDK NavalCode vous permet de développer votre propre robot en TypeScript.
            Votre robot doit étendre la classe abstraite <code className="text-[#00d4ff] bg-[#16161f] px-2 py-0.5 rounded font-mono text-sm border border-[#00d4ff]/20">Brain</code> et implémenter ses méthodes.
          </p>

          <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 mb-6">
            <h3 className="text-lg font-bold text-[#fbf0df] mb-3">Classe Brain</h3>
            <pre className="text-sm text-[#fbf0df]/70 font-mono leading-relaxed overflow-x-auto">
{`import { Brain } from "@navalcode/sdk";
import { Board } from "@navalcode/sdk";
import { Strategy } from "@navalcode/sdk";
import { Boats, State } from "@navalcode/sdk";

export class MyBot extends Brain {
  think(): { x: number; y: number } {
    return { x: 5, y: 5 };
  }

  turn(x: number, y: number): void {
  }

  getStrategy(): Strategy {
  }
}`}
            </pre>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6"><span className="text-gradient">Méthodes à implémenter</span></h2>
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">think()</h3>
              <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-3">
                Appelée à chaque tour. Doit retourner les coordonnées {'{ x, y }'} de la case à attaquer.
              </p>
              <pre className="text-sm text-[#00d4ff]/80 font-mono">think(): {'{ x: number; y: number }'}</pre>
            </div>

            <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">turn(x, y)</h3>
              <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-3">
                Notifie votre robot que l'adversaire a tiré sur la case (x, y). À vous de déterminer si c'est un tir raté ou réussi.
              </p>
              <pre className="text-sm text-[#00d4ff]/80 font-mono">turn(x: number, y: number): void</pre>
            </div>

            <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">getStrategy()</h3>
              <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-3">
                Retourne la stratégie de placement de vos bateaux. Appelée une fois au début de chaque partie.
              </p>
              <pre className="text-sm text-[#00d4ff]/80 font-mono">getStrategy(): Strategy</pre>
            </div>

            <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">getAdversaryBoard()</h3>
              <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-3">
                Retourne le plateau adverse tel que connu par votre robot. Utile pour les stratégies avancées.
              </p>
              <pre className="text-sm text-[#00d4ff]/80 font-mono">getAdversaryBoard(): Board</pre>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6"><span className="text-gradient">Types et enums</span></h2>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">State</h3>
              <pre className="text-sm text-[#fbf0df]/70 font-mono">
{`enum State {
  None = "None",
  Hit = "Hit",
  Sunk = "Sunk",
}`}
              </pre>
            </div>
            <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">Boats</h3>
              <pre className="text-sm text-[#fbf0df]/70 font-mono">
{`enum Boats {
  AircraftCarrier = 5,
  Cruiser = 4,
  TorpedoBoat = 3,
  Submarine = 2,
}`}
              </pre>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6"><span className="text-gradient">Bots de référence</span></h2>
          <p className="text-[#fbf0df]/50 leading-relaxed mb-6">
            Trois bots sont fournis comme point de départ :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Step num="Random" title="Tirs aléatoires" desc="Place ses bateaux et tire de manière entièrement aléatoire." />
            <Step num="SmartBot" title="Chasse intelligente" desc="Place ses bateaux éloignés. En mode chasse dès qu'il touche un bateau." />
            <Step num="StrategicBot" title="Recherche par grille" desc="Parcourt le plateau avec un pas de 3 pour trouver les bateaux efficacement." />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6"><span className="text-gradient">Règles de soumission</span></h2>
          <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5">
            <ul className="text-[#fbf0df]/50 text-sm leading-relaxed space-y-3 list-disc list-inside">
              <li>Aucun import de modules externes autorisé (protection contre les virus)</li>
              <li>Le code doit passer <code className="text-[#00d4ff] bg-[#0d0d14] px-2 py-0.5 rounded font-mono border border-[#00d4ff]/20">tsc -b</code> sans erreur</li>
              <li>Le code doit passer <code className="text-[#00d4ff] bg-[#0d0d14] px-2 py-0.5 rounded font-mono border border-[#00d4ff]/20">biome check</code> sans erreur</li>
              <li>Les simulations sont exécutées dans un environnement sandboxé isolé</li>
              <li>Un seul fichier .ts par soumission</li>
            </ul>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6"><span className="text-gradient">Configuration Biome</span></h2>
          <p className="text-[#fbf0df]/50 leading-relaxed mb-6">
            Téléchargez le fichier de configuration Biome utilisé par le validateur pour tester votre code en local.
          </p>
          <a
            href="/biome.json"
            download
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-sm no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all btn-primary"
          >
            Télécharger biome.json
          </a>
        </section>
      </div>
    </div>
  );
}
