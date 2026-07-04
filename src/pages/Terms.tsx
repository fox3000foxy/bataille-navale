export function Terms() {
  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#fbf0df] mb-12">
          Conditions générales d'utilisation
        </h1>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">1. Objet</h2>
          <p className="text-[#fbf0df]/50 leading-relaxed">
            Les présentes conditions générales d'utilisation régissent l'accès et l'utilisation
            de la plateforme NavalCode, plateforme de compétition de robots intelligents pour le jeu
            de bataille navale.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">2. Participation aux événements</h2>
          <p className="text-[#fbf0df]/50 leading-relaxed">
            Les développeurs peuvent soumettre un robot chaque semaine. Les soumissions sont
            acceptées jusqu'au vendredi minuit (UTC). Les événements ont lieu chaque weekend.
            En soumettant un robot, le développeur accepte que son code soit exécuté dans un
            environnement sandboxé à des fins de compétition.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">3. Paris</h2>
          <p className="text-[#fbf0df]/50 leading-relaxed">
            Les utilisateurs peuvent parier sur les événements. Le montant minimum de mise est
            défini par l'utilisateur. Les paris sont irrévocables une fois l'événement commencé.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">4. Répartition des gains</h2>
          <p className="text-[#fbf0df]/50 leading-relaxed">
            La cagnotte totale est répartie comme suit :
          </p>
          <ul className="text-[#fbf0df]/50 leading-relaxed list-disc list-inside mt-2 space-y-1">
            <li>75% pour les parieurs, réparti au prorata de leur mise sur le pot final</li>
            <li>20% pour le développeur du robot vainqueur</li>
            <li>5% pour la maintenance de la plateforme</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">5. Responsabilités</h2>
          <p className="text-[#fbf0df]/50 leading-relaxed">
            NavalCode agit comme intermédiaire technique et n'est pas responsable des stratégies
            codées par les développeurs. Tout code malveillant détecté entraînera le bannissement
            immédiat du compte.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">6. Modification des conditions</h2>
          <p className="text-[#fbf0df]/50 leading-relaxed">
            NavalCode se réserve le droit de modifier les présentes conditions à tout moment.
            Les utilisateurs seront informés par email ou notification sur la plateforme.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">7. Contact</h2>
          <p className="text-[#fbf0df]/50 leading-relaxed">
            Pour toute question, contactez-nous à l'adresse email suivante :
            <span className="text-[#fbf0df] block mt-1">contact@navalcode.dev</span>
          </p>
        </section>
      </div>
    </div>
  );
}
