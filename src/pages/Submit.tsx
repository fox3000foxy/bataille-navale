import logo from "../logo.svg";

export function Submit() {
  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <img src={logo} alt="" className="h-12 opacity-70" />
          <h1 className="text-4xl font-bold text-[#fbf0df]">Soumettre un robot</h1>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">Prochain événement</h2>
          <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10 text-center">
            <p className="text-[#fbf0df]/40 text-sm uppercase tracking-widest mb-2">Prochaine soumission</p>
            <p className="text-3xl font-bold text-[#fbf0df]">Vendredi 23h59 UTC</p>
            <p className="text-[#fbf0df]/60 text-sm mt-4">
              Les soumissions sont ouvertes du lundi au vendredi.
              Participez au prochain événement du weekend.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">Comment soumettre</h2>
          <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10">
            <ol className="text-[#fbf0df]/60 text-sm leading-relaxed space-y-4 list-decimal list-inside">
              <li>
                <strong className="text-[#fbf0df]">Developpez votre robot</strong> en etendant la classe Brain.
                Consultez la <a href="/developer" className="text-[#fbf0df] underline">page développeur</a> pour la documentation.
              </li>
              <li>
                <strong className="text-[#fbf0df]">Validez votre code</strong> avec <code className="text-[#fbf0df] bg-[#242424] px-2 py-0.5 rounded font-mono">tsc -b</code> et <code className="text-[#fbf0df] bg-[#242424] px-2 py-0.5 rounded font-mono">biome check</code>.
              </li>
              <li>
                <strong className="text-[#fbf0df]">Soumettez votre fichier</strong> via le formulaire ci-dessous.
                Un seul fichier .ts accepte, sans imports externes.
              </li>
              <li>
                <strong className="text-[#fbf0df]">Suivez les résultats</strong> le weekend pendant l'événement.
              </li>
            </ol>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">Formulaire de soumission</h2>
          <form
            className="p-8 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10 space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-[#fbf0df] mb-2">
                Nom du robot
              </label>
              <input
                id="name"
                type="text"
                placeholder="MonRobot"
                className="w-full bg-transparent border-2 border-[#fbf0df]/20 rounded-xl px-4 py-3 text-[#fbf0df] font-mono text-sm outline-none focus:border-[#fbf0df]/60 transition-colors placeholder-[#fbf0df]/30"
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-bold text-[#fbf0df] mb-2">
                Fichier source (.ts)
              </label>
              <div className="border-2 border-dashed border-[#fbf0df]/20 rounded-xl p-8 text-center hover:border-[#fbf0df]/40 transition-colors cursor-pointer">
                <p className="text-[#fbf0df]/60 text-sm mb-1">
                  Glissez votre fichier ici ou cliquez pour parcourir
                </p>
                <p className="text-[#fbf0df]/30 text-xs">Un seul fichier .ts, max 1 Mo</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 rounded-xl bg-[#fbf0df] text-[#1a1a1a] font-bold text-base no-underline hover:bg-[#f3d5a3] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              disabled
            >
              Soumettre (bientôt disponible)
            </button>

            <p className="text-[#fbf0df]/30 text-xs text-center">
              La soumission sera analysee automatiquement (tsc -b, biome check, verification des imports).
              En soumettant, vous acceptez nos{" "}
              <a href="/terms" className="text-[#fbf0df]/50 underline">CGU</a>.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
