# FC-8 — Chargement et état partagé (en cours)

Vérification mise à jour le 11 novembre 2026 après réception du jeu officiel.
Départ de cette reprise : main propre, commit c2dd392 ; FC-8 In Progress.
FC-6 et FC-7 avaient été vérifiés Done avant le développement initial.

## Données officielles reçues et validées

Le blocage initial est levé : l’utilisateur a fourni directement les huit
enregistrements officiels. public/machines.json reprend exactement les valeurs
et l’ordre de son JSON. Aucun nom, ID, zone, statut ou production modifié.

`node .verification/fc8-validate.mjs` a confirmé la syntaxe JSON, un array de huit
enregistrements, les IDs uniques M-001 à M-008, exactement les champs id/name/
zone/status/dailyProduction, les textes requis, les trois statuts autorisés et
des productions entières non négatives. Les valeurs sont comparées une à une
à la transcription du message utilisateur, sans normalisation.
SHA-256 initial des octets :
`7adf0704cd5356153baca9d45f09b57add07532293d68375f893c657e6102e4d`.
Le loader App.jsx existant est réutilisé sans modification ; le contrôle des
enregistrements est effectué sur le fichier livré, sans ajout de CRUD.

## Travail réalisé

App possède machines, loading et error avec useState. Un useEffect initial
appelle Fetch sur /machines.json, vérifie HTTP, JSON et Array.isArray. L’effet
est indépendant de la route, nettoyé par AbortController et un garde active
contre les réponses tardives. Les trois pages reçoivent les mêmes données par
props ; MachineDataState distingue attente, erreur, succès vide et contenu.
Les liens restent disponibles pendant l’attente et après une erreur.

Aucun CRUD ni calcul de dashboard ajouté. Les fonctions de modification
mentionnées dans Jira restent des contrats documentés, conformément à la
contrainte explicite « No machine CRUD yet ». Leur implémentation et leur
validation ne sont pas revendiquées dans ce travail.

## Tests exécutés et résultats

- `npm.cmd run build` : succès, 101 modules transformés.
- Chrome headless avec Playwright sur Vite dev (5173) et production preview (4173).
- Fixture temporaire : un seul enregistrement nommé explicitement
  « FIXTURE TEMPORAIRE — PAS UNE MACHINE OFFICIELLE », identifiant FC8_TEST_ONLY_1.
  Fichier dans `.verification/fc8-fixture.json`, ignoré par Git. Il est servi
  uniquement par interception réseau du navigateur de test, jamais par public/.
- Script local ignoré : `node .verification/fc8-loading.cjs` ; 18 scénarios
  navigateur réussis, neuf sur chaque serveur : huit scénarios interceptés et
  un scénario de chargement du vrai fichier sans interception.

| Cas | Résultat sur dev et preview |
| --- | --- |
| Tableau non vide, HTTP 200 | Chargé dans App ; même référence transmise à la page |
| Réponse retenue pendant la navigation | Loading visible sur les deux routes ; chargement aboutit sans réinitialisation |
| HTTP 404 et HTTP 500 | Message d’erreur comprenant le code ; loading disparu |
| Échec réseau | Message français compréhensible ; aucune exception non traitée |
| JSON invalide | Erreur explicite de JSON ; aucun faux parc vide |
| Objet JSON ou null | Erreur explicite : tableau attendu |
| Tableau vide [] | Succès vide, sans erreur ; navigation vers l’ajout possible |
| Vrai fichier officiel, sans interception | HTTP 200 et contenu exact ; huit machines dans App, même array sur les trois pages |

Dans le scénario de succès, une sonde React DevTools injectée uniquement par le
test récupère le setter existant de machines. Elle simule une mise à jour
fonctionnelle avec map et copies d’objets, sans API ni commande CRUD ajoutée dans
l’application. Le tableau initial et son objet restent inchangés. Les trois
routes et le retour navigateur conservent la nouvelle référence partagée et
n’émettent aucune nouvelle requête JSON. Un refresh refait la requête et restaure
la fixture initiale.

Le scénario réel charge le fichier officiel par Fetch sans interception et
compare les huit enregistrements au fichier disque. Une lecture HTTP indépendante
confirme aussi les mêmes octets sur les deux serveurs. Le setter React est exercé
uniquement par la sonde de test avec `previous => previous.slice(1)` : aucun champ
de machine n’est changé, aucun objet modifié et l’array original reste intact.
La nouvelle référence à sept éléments est conservée sur les trois pages, back et
forward, sans autre fetch. Refresh relance Fetch et restaure exactement les huit
enregistrements officiels. Aucun contrôle, fonction CRUD ou sonde ajouté dans App.

Pour chaque scénario : indicateur loading présent puis absent, props partagées
contrôlées, seuls des GET vers machines.json, aucun contenu localStorage ou
sessionStorage et aucune exception JavaScript non traitée. Les erreurs HTTP et
réseau simulées peuvent apparaître dans la console réseau, comme attendu.
La fixture et les octets de public/machines.json sont identiques avant/après.
dist/machines.json est identique au fichier officiel. Le scénario réel ne produit
aucune erreur console. Le contrôle de validation JSON est relancé après les tests.

## État des critères Jira

| Critère | Vérification actuelle |
| --- | --- |
| Fetch/useEffect depuis /machines.json | Vérifié avec les huit machines officielles, sans interception |
| Erreurs HTTP, réseau et JSON | Vérifié |
| Loading visible puis terminé | Vérifié |
| Tableau vide valide | Vérifié |
| Source d’état unique sur les pages | Vérifié par identité de référence |
| Fonctions de modification immuables | Non implémentées sous la contrainte sans CRUD ; seul le setter React est exercé par le test |
| Conservation en navigation | Vérifiée avec état issu du fichier officiel et remplacement synthétique ; vrais parcours métier différés |
| Restauration au refresh | Vérifiée : retour exact aux huit machines officielles |
| JSON inchangé et absence de persistance | Vérifié : fichier intact, GET uniquement, aucun stockage ajouté |
| États indépendants du CRUD | Vérifié |

FC-8 reste In Progress uniquement pour le critère des fonctions de modification
effectives, non implémentées sous la consigne explicite sans CRUD. Le remplacement
immuable dans le test ne valide pas des callbacks métier inexistants. Le blocage
du fichier manquant est levé ; il ne justifie plus le statut. Aucun autre ticket
n’est commencé ou modifié, aucun push.

## Références

- [Jira FC-8](https://aymanloussal552.atlassian.net/browse/FC-8)
- [React useEffect](https://react.dev/reference/react/useEffect)
- [React useState](https://react.dev/reference/react/useState)
- [Explication et architecture en darija](architecture.md)
