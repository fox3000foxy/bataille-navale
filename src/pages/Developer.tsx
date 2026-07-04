import logo from "../logo.svg";

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10">
      <span className="text-2xl font-bold text-[#fbf0df] block mb-2">{num}</span>
      <h3 className="text-lg font-bold text-[#fbf0df] mb-2">{title}</h3>
      <p className="text-[#fbf0df]/60 text-sm leading-relaxed">{desc}</p>
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
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">SDK</h2>
          <p className="text-[#fbf0df]/60 leading-relaxed mb-6">
            Le SDK NavalCode vous permet de développer votre propre robot en TypeScript.
            Votre robot doit étendre la classe abstraite <code className="text-[#fbf0df] bg-[#1a1a1a] px-2 py-0.5 rounded font-mono text-sm">Brain</code> et implémenter ses méthodes.
          </p>

          <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10 mb-6">
            <h3 className="text-lg font-bold text-[#fbf0df] mb-3">Classe Brain</h3>
            <pre className="text-sm text-[#fbf0df]/80 font-mono leading-relaxed overflow-x-auto">
{`import { Brain } from "@navalcode/sdk";
import { Board } from "@navalcode/sdk";
import { Strategy } from "@navalcode/sdk";
import { Boats, State } from "@navalcode/sdk";

export class MyBot extends Brain {
  think(): { x: number; y: number } {
    // Decide where to shoot
    return { x: 5, y: 5 };
  }

  turn(x: number, y: number): void {
    // Opponent shot at (x, y)
    // Check your own strategy
  }

  getStrategy(): Strategy {
    // Return your boat placement
  }
}`}
            </pre>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">Méthodes à implémenter</h2>
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">think()</h3>
              <p className="text-[#fbf0df]/60 text-sm leading-relaxed mb-3">
                Appelée à chaque tour. Doit retourner les coordonnées {'{ x, y }'} de la case à attaquer.
              </p>
              <pre className="text-sm text-[#fbf0df]/80 font-mono">think(): {'{ x: number; y: number }'}</pre>
            </div>

            <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">turn(x, y)</h3>
              <p className="text-[#fbf0df]/60 text-sm leading-relaxed mb-3">
                Notifie votre robot que l'adversaire a tiré sur la case (x, y). À vous de déterminer si c'est un tir raté ou réussi.
              </p>
              <pre className="text-sm text-[#fbf0df]/80 font-mono">turn(x: number, y: number): void</pre>
            </div>

            <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">getStrategy()</h3>
              <p className="text-[#fbf0df]/60 text-sm leading-relaxed mb-3">
                Retourne la stratégie de placement de vos bateaux. Appelée une fois au début de chaque partie.
              </p>
              <pre className="text-sm text-[#fbf0df]/80 font-mono">getStrategy(): Strategy</pre>
            </div>

            <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">getAdversaryBoard()</h3>
              <p className="text-[#fbf0df]/60 text-sm leading-relaxed mb-3">
                Retourne le plateau adverse tel que connu par votre robot. Utile pour les stratégies avancées.
              </p>
              <pre className="text-sm text-[#fbf0df]/80 font-mono">getAdversaryBoard(): Board</pre>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">Types et enums</h2>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">State</h3>
              <pre className="text-sm text-[#fbf0df]/80 font-mono">
{`enum State {
  None = "None",  // Case non attaquée
  Hit = "Hit",    // Touché
  Sunk = "Sunk",  // Coulé
}`}
              </pre>
            </div>
            <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">Boats</h3>
              <pre className="text-sm text-[#fbf0df]/80 font-mono">
{`enum Boats {
  AircraftCarrier = 5,  // 5 cases
  Cruiser = 4,          // 4 cases
  TorpedoBoat = 3,      // 3 cases
  Submarine = 2,        // 2 cases
}`}
              </pre>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">Bots de référence</h2>
          <p className="text-[#fbf0df]/60 leading-relaxed mb-6">
            Trois bots sont fournis comme point de départ :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Step num="Random" title="Tirs aléatoires" desc="Place ses bateaux et tire de manière entièrement aléatoire." />
            <Step num="SmartBot" title="Chasse intelligente" desc="Place ses bateaux éloignés. En mode chasse dès qu'il touche un bateau." />
            <Step num="StrategicBot" title="Recherche par grille" desc="Parcourt le plateau avec un pas de 3 pour trouver les bateaux efficacement." />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">Règles de soumission</h2>
          <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10">
            <ul className="text-[#fbf0df]/60 text-sm leading-relaxed space-y-3 list-disc list-inside">
              <li>Aucun import de modules externes autorisé (protection contre les virus)</li>
              <li>Le code doit passer <code className="text-[#fbf0df] bg-[#242424] px-2 py-0.5 rounded font-mono">tsc -b</code> sans erreur</li>
              <li>Le code doit passer <code className="text-[#fbf0df] bg-[#242424] px-2 py-0.5 rounded font-mono">biome check</code> sans erreur</li>
              <li>Les simulations sont exécutées dans un environnement sandboxé isolé</li>
              <li>Un seul fichier .ts par soumission</li>
            </ul>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">Configuration Biome</h2>
          <p className="text-[#fbf0df]/60 leading-relaxed mb-6">
            Téléchargez le fichier de configuration Biome utilisé par le validateur pour tester votre code en local.
          </p>
          <a
            href="/biome.json"
            download
            className="inline-block px-6 py-3 rounded-xl bg-[#fbf0df] text-[#1a1a1a] font-bold text-sm no-underline hover:bg-[#f3d5a3] transition-all"
          >
            Télécharger biome.json
          </a>
        </section>
      </div>
    </div>
  );
}
