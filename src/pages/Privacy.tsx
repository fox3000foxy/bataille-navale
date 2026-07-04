export function Privacy() {
  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#fbf0df] mb-12">
          Politique de confidentialité
        </h1>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">1. Données collectées</h2>
          <p className="text-[#fbf0df]/60 leading-relaxed">
            Nous collectons les données suivantes lors de votre inscription et de votre utilisation
            de la plateforme :
          </p>
          <ul className="text-[#fbf0df]/60 leading-relaxed list-disc list-inside mt-2 space-y-1">
            <li>Adresse email</li>
            <li>Nom d'utilisateur</li>
            <li>Code source de vos robots soumis</li>
            <li>Historique de vos participations et paris</li>
            <li>Données de navigation (pages visitées, durée de session)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">2. Utilisation des données</h2>
          <p className="text-[#fbf0df]/60 leading-relaxed">
            Les données collectées sont utilisées pour :
          </p>
          <ul className="text-[#fbf0df]/60 leading-relaxed list-disc list-inside mt-2 space-y-1">
            <li>Fournir et améliorer nos services</li>
            <li>Organiser les compétitions et calculer les classements</li>
            <li>Gérer les paris et les reversements</li>
            <li>Vous contacter concernant votre compte et les événements</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">3. Partage des données</h2>
          <p className="text-[#fbf0df]/60 leading-relaxed">
            Nous ne partageons pas vos données personnelles avec des tiers. Le code source de vos
            robots peut être rendu public après un événement si vous êtes dans le top 3, sauf
            demande contraire de votre part.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">4. Cookies</h2>
          <p className="text-[#fbf0df]/60 leading-relaxed">
            Nous utilisons des cookies nécessaires au fonctionnement technique de la plateforme
            (session, authentification). Aucun cookie publicitaire ou tiers n'est utilisé.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">5. Sécurité</h2>
          <p className="text-[#fbf0df]/60 leading-relaxed">
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles
            pour protéger vos données contre tout accès non autorisé, altération ou destruction.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">6. Vos droits</h2>
          <p className="text-[#fbf0df]/60 leading-relaxed">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="text-[#fbf0df]/60 leading-relaxed list-disc list-inside mt-2 space-y-1">
            <li>Droit d'accès à vos données personnelles</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité des données</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">7. Contact</h2>
          <p className="text-[#fbf0df]/60 leading-relaxed">
            Pour exercer vos droits ou toute question relative à vos données :
            <span className="text-[#fbf0df] block mt-1">privacy@navalcode.dev</span>
          </p>
        </section>
      </div>
    </div>
  );
}
