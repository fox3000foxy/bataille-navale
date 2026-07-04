import { useI18n } from "../i18n/I18nContext";
import logo from "../logo.svg";

function _Step({ num, title, desc }: { num: string; title: string; desc: string }) {
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

export function Developer() {
  const { t } = useI18n();

  const rules = [
    { key: "developer.rules.items.0", text: t("developer.rules.items.0") },
    { key: "developer.rules.items.1", text: t("developer.rules.items.1") },
    { key: "developer.rules.items.2", text: t("developer.rules.items.2") },
    { key: "developer.rules.items.3", text: t("developer.rules.items.3") },
    { key: "developer.rules.items.4", text: t("developer.rules.items.4") },
  ];

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <img src={logo} alt="" className="h-12 opacity-70" />
          <h1 className="text-4xl font-bold text-[#fbf0df]">{t("developer.title")}</h1>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6"><span className="text-gradient">{t("developer.sdk.title")}</span></h2>
          <p className="text-[#fbf0df]/50 leading-relaxed mb-6">
            {t("developer.sdk.desc")} <Code>Brain</Code>
          </p>

          <div className="rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 overflow-hidden">
            <div className="px-6 py-3 border-b border-[#fbf0df]/5 bg-[#0d0d14]">
              <span className="text-sm font-bold text-[#fbf0df]/30 font-mono">brain.ts</span>
            </div>
            <div className="p-6">
              <Pre>{`import { Brain } from "@navalcode/sdk";
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
}`}</Pre>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6"><span className="text-gradient">{t("developer.methods.title")}</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">think()</h3>
              <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
                {t("developer.methods.think.desc")}
              </p>
              <code className="text-xs text-[#00d4ff] bg-[#0d0d14] px-2 py-1 rounded font-mono border border-[#00d4ff]/20">
                think(): {"{ x: number; y: number }"}
              </code>
            </div>

            <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">turn(x, y)</h3>
              <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
                {t("developer.methods.turn.desc")}
              </p>
              <code className="text-xs text-[#00d4ff] bg-[#0d0d14] px-2 py-1 rounded font-mono border border-[#00d4ff]/20">
                turn(x: number, y: number): void
              </code>
            </div>

            <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">getStrategy()</h3>
              <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
                {t("developer.methods.strategy.desc")}
              </p>
              <code className="text-xs text-[#00d4ff] bg-[#0d0d14] px-2 py-1 rounded font-mono border border-[#00d4ff]/20">
                getStrategy(): Strategy
              </code>
            </div>

            <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover">
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">getAdversaryBoard()</h3>
              <p className="text-[#fbf0df]/50 text-sm leading-relaxed mb-4">
                {t("developer.methods.adversary.desc")}
              </p>
              <code className="text-xs text-[#00d4ff] bg-[#0d0d14] px-2 py-1 rounded font-mono border border-[#00d4ff]/20">
                getAdversaryBoard(): Board
              </code>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6"><span className="text-gradient">{t("developer.types.title")}</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 overflow-hidden">
              <div className="px-6 py-3 border-b border-[#fbf0df]/5">
                <h3 className="text-lg font-bold text-[#fbf0df]">State</h3>
              </div>
              <div className="p-6">
                <Pre>{`enum State {
  None = "None",
  Hit = "Hit",
  Sunk = "Sunk",
}`}</Pre>
              </div>
            </div>
            <div className="rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 overflow-hidden">
              <div className="px-6 py-3 border-b border-[#fbf0df]/5">
                <h3 className="text-lg font-bold text-[#fbf0df]">Boats</h3>
              </div>
              <div className="p-6">
                <Pre>{`enum Boats {
  AircraftCarrier = 5,
  Cruiser = 4,
  TorpedoBoat = 3,
  Submarine = 2,
}`}</Pre>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6"><span className="text-gradient">{t("developer.bots.title")}</span></h2>
          <p className="text-[#fbf0df]/50 leading-relaxed mb-6">
            {t("developer.bots.desc")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Step num="Random" title={t("developer.bots.random")} desc={t("developer.bots.random.desc")} />
            <Step num="SmartBot" title={t("developer.bots.smart")} desc={t("developer.bots.smart.desc")} />
            <Step num="StrategicBot" title={t("developer.bots.strategic")} desc={t("developer.bots.strategic.desc")} />
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <a href="/api/bots/Random.ts" download className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-semibold text-xs no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all btn-primary">
              Telecharger Random.ts
            </a>
            <a href="/api/bots/SmartBot.ts" download className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-semibold text-xs no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all btn-primary">
              Telecharger SmartBot.ts
            </a>
            <a href="/api/bots/StrategicBot.ts" download className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-semibold text-xs no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all btn-primary">
              Telecharger StrategicBot.ts
            </a>
          </div>
        </section> */}

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6"><span className="text-gradient">{t("developer.rules.title")}</span></h2>
          <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5">
            <ul className="text-[#fbf0df]/50 text-sm leading-relaxed space-y-3 list-disc list-inside marker:text-[#00d4ff]">
              {rules.map((rule) => <li key={rule.key}>{rule.text}</li>)}
            </ul>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-6"><span className="text-gradient">{t("developer.biome.title")}</span></h2>
          <p className="text-[#fbf0df]/50 leading-relaxed mb-6">
            {t("developer.biome.desc")}
          </p>
          <a
            href="/biome.json"
            download
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-sm no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all btn-primary"
          >
            {t("developer.biome.download")}
          </a>
        </section>
      </div>
    </div>
  );
}
