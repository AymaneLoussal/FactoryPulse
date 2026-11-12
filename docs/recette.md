# Recette FactoryPulse — 12 novembre 2026

Exécution Chrome/Playwright locale sur Vite, dataset officiel, build production.
`npm run test:recette` exécute les scénarios automatisés dans tests/fc16-recette.cjs.
`npm run test:callbacks` vérifie les callbacks FC-8 sur dev et preview.

| Scénario | Résultat initial | Preuve |
| --- | --- | --- |
| Routes, navigation, historique et compteurs initiaux 8/4/2 | Réussi | test recette, groupe données officielles |
| Recherche casse/espaces, filtre combiné, reset et aucun résultat | Réussi | test recette, groupe données officielles |
| Changement de statut, filtre et dashboard, retour à l’état initial | Réussi | test recette, groupe données officielles |
| Champs vides/espaces, statut invalide, production vide/négative/décimale/non numérique | Réussi | test recette, groupe formulaire |
| Zéro valide, trim, deux noms identiques avec IDs distincts, ajout unique | Réussi | test recette, groupe formulaire |
| Suppression annulée/confirmée et dashboard | Réussi | test recette, groupe formulaire |
| Dernière machine supprimée et compteurs 0/0/0 | Réussi | .verification/fc13.cjs, Chrome |
| Chargement, HTTP 500, réseau, JSON invalide, non-array, array vide | Réussi | test recette, groupes loading |
| HTTP 404, chargement et annulation de requête | Réussi | .verification/fc8-loading.cjs, exécution précédente FC-8 |
| Conservation en navigation, refresh, absence de persistance et JSON intact | Réussi | test recette et tests callbacks ; hash JSON contrôlé |
| 375/768/1280, focus et clavier | Réussi | test recette et .verification/fc14-interactions.cjs |
| Ajout quand crypto.randomUUID est indisponible | Réussi après correction FC-17 | test recette, groupe compatibilité |

## Défaut transmis à FC-17

- Gravité : bloquant pour l’ajout dans un contexte où `crypto.randomUUID` est absent.
- Reproduction : rendre `crypto.randomUUID` indisponible, ouvrir `/machines/new`,
  remplir nom, zone, production zéro, puis soumettre.
- Attendu : ajout d’une machine avec un ID unique et retour à la liste.
- Observé : aucun retour de succès ; l’appel à `crypto.randomUUID()` échoue.
- Correction FC-17 : génération séquentielle du premier ID M-xxx libre dans le
  parc courant, sans crypto ; contrôle de collision conservé dans le callback.
- Régression : suite recette rejouée après correction, y compris le scénario
  compatibilité et deux ajouts avec IDs distincts : 9 groupes réussis sur dev
  et 9 sur production preview. Build réussi, aucune erreur console sur le
  parcours principal. `FACTORYPULSE_TEST_URL` permet de choisir le serveur.

Figma : fichier consulté par accès authentifié ; accès évaluateur toujours non vérifié.
GitHub : commits de développement locaux non publiés, selon la consigne sans push.
Les fichiers `.verification/` sont locaux et exclus de Git ; la suite principale
suivie dans `tests/` couvre les parcours majeurs et est reproductible.
