# Roadmap

## Phase 1 -- Fondations
- [x] Classes de base (Board, Strategy, Game, Brain)
- [x] Bots de base (Random, SmartBot, StrategicBot)
- [x] BatchCalculator (simulations en lots)
- [x] Landing page du site
- [x] Pages CGU et Politique de confidentialite
- [x] Page de documentation (anciennement Developpeur + Documentation mergees)
- [x] Page de soumission de robot (deplacee dans l'onglet "Soumettre" du profil)
- [x] Telechargement du fichier biome.json
- [x] Systeme d'authentification (device auth, login/register, argon2id, sessions)

## Phase 2 -- SDK et soumission
- [x] Execution en sandbox (isolation securisee via processus separe)
- [x] En-tetes de securite HTTP (CSP, X-Frame-Options, etc.)
- [x] SDK publie sur npm (@navalcode/sdk@0.1.0)
- [x] Validateur de soumission (runtime: transpile → instancie → appelle think/turn/getStrategy)
- [ ] API de soumission (POST /api/bots/sync existe, formulaire pas encore fonctionnel)
- [ ] Protection rate-limiting sur les API

## Phase 3 -- Evenements et paris
- [ ] Evenements hebdomadaires (chaque weekend)
- [ ] Systeme de pari
- [ ] Paiement securise
- [ ] Smart contract / reversement automatique :
  - 5% maintenance du site
  - 20% developpeur du bot gagnant
  - 75% parieurs (reparti au prorata des mises)

## Phase 4 -- Communaute
- [x] Classement des robots (onglet Classement dans le profil)
- [ ] Classement des parieurs
- [ ] Historique des evenements passes
- [ ] Forum / discussions
- [ ] Statistiques publiques

## Phase 5 -- Ameliorations
- [ ] Editor de bot en ligne
- [x] Mode entrainement (vs bots de base, dans l'onglet "S'entrainer")
- [x] Authentification securisee (argon2, sessions)
- [ ] Tournois saisonniers
- [ ] API publique pour recuperer les resultats

## Securite (applique)
- [x] Sandbox d'execution (processus Bun isole, globaux dangereux retires, timeout)
- [x] En-tetes HTTP de securite (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- [x] Base de donnees SQLite avec WAL mode et foreign keys
- [x] Aucune concaténation SQL directe (requetes preparees via bun:sqlite)
