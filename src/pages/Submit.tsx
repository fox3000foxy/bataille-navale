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
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4"><span className="text-gradient">Prochain événement</span></h2>
          <div className="p-8 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 text-center card-hover">
            <p className="text-[#fbf0df]/30 text-sm uppercase tracking-widest mb-2">Prochaine soumission</p>
            <p className="text-3xl font-bold text-[#00d4ff]">Vendredi 23h59 UTC</p>
            <p className="text-[#fbf0df]/50 text-sm mt-4">
              Les soumissions sont ouvertes du lundi au vendredi.
              Participez au prochain événement du weekend.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4"><span className="text-gradient">Comment soumettre</span></h2>
          <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5">
            <ol className="text-[#fbf0df]/50 text-sm leading-relaxed space-y-4 list-decimal list-inside">
              <li>
                <strong className="text-[#fbf0df]">Développez votre robot</strong> en étendant la classe Brain.
                Consultez la <a href="/developer" className="text-[#00d4ff] underline hover:text-[#7c3aed] transition-colors">page développeur</a> pour la documentation.
              </li>
              <li>
                <strong className="text-[#fbf0df]">Validez votre code</strong> avec <code className="text-[#00d4ff] bg-[#0d0d14] px-2 py-0.5 rounded font-mono border border-[#00d4ff]/20">tsc -b</code> et <code className="text-[#00d4ff] bg-[#0d0d14] px-2 py-0.5 rounded font-mono border border-[#00d4ff]/20">biome check</code>.
              </li>
              <li>
                <strong className="text-[#fbf0df]">Soumettez votre fichier</strong> via le formulaire ci-dessous.
                Un seul fichier .ts accepté, sans imports externes.
              </li>
              <li>
                <strong className="text-[#fbf0df]">Suivez les résultats</strong> le weekend pendant l'événement.
              </li>
            </ol>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4"><span className="text-gradient">Formulaire de soumission</span></h2>
          <form
            className="p-8 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 space-y-6"
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
                className="w-full bg-transparent border-2 border-[#fbf0df]/10 rounded-xl px-4 py-3 text-[#fbf0df] font-mono text-sm outline-none focus:border-[#00d4ff]/50 transition-colors placeholder-[#fbf0df]/20"
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-bold text-[#fbf0df] mb-2">
                Fichier source (.ts)
              </label>
              <div className="border-2 border-dashed border-[#fbf0df]/10 rounded-xl p-8 text-center hover:border-[#00d4ff]/30 transition-colors cursor-pointer">
                <p className="text-[#fbf0df]/50 text-sm mb-1">
                  Glissez votre fichier ici ou cliquez pour parcourir
                </p>
                <p className="text-[#fbf0df]/20 text-xs">Un seul fichier .ts, max 1 Mo</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-base no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed btn-primary"
              disabled
            >
              Soumettre (bientôt disponible)
            </button>

            <p className="text-[#fbf0df]/20 text-xs text-center">
              La soumission sera analysée automatiquement (tsc -b, biome check, vérification des imports).
              En soumettant, vous acceptez nos{" "}
              <a href="/terms" className="text-[#fbf0df]/40 underline hover:text-[#00d4ff] transition-colors">CGU</a>.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
