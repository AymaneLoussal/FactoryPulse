# FC-8 — Chargement et état partagé (en cours)

Vérification du 11 novembre 2026. Départ : main propre, commit 39098d0.
FC-6 et FC-7 vérifiés Done dans Jira avant le développement.

## Blocage des données officielles

Recherche dans tout le workspace, y compris fichiers cachés et ignorés hors
dépendances : aucun machines.json. public/ ne contenait que favicon.svg et
.gitkeep. Le cadrage signale aussi l’absence des huit machines officielles.
Aucune donnée officielle n’est inventée ; public/machines.json n’est pas créé.

Le fichier original doit être fourni pour confirmer sa provenance, ses noms de
propriétés, les huit enregistrements, leurs identifiants et les règles du modèle.
Le mécanisme actuel vérifie la forme tableau ; il ne certifie pas les champs
d’enregistrements dont le schéma officiel n’a pas encore été vu.

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
  navigateur réussis, neuf sur chaque serveur.

| Cas | Résultat sur dev et preview |
| --- | --- |
| Tableau non vide, HTTP 200 | Chargé dans App ; même référence transmise à la page |
| Réponse retenue pendant la navigation | Loading visible sur les deux routes ; chargement aboutit sans réinitialisation |
| HTTP 404 et HTTP 500 | Message d’erreur comprenant le code ; loading disparu |
| Échec réseau | Message français compréhensible ; aucune exception non traitée |
| JSON invalide | Erreur explicite de JSON ; aucun faux parc vide |
| Objet JSON ou null | Erreur explicite : tableau attendu |
| Tableau vide [] | Succès vide, sans erreur ; navigation vers l’ajout possible |
| Fichier officiel absent, sans interception | Message d’erreur ; aucune donnée ou liste vide de remplacement |

Dans le scénario de succès, une sonde React DevTools injectée uniquement par le
test récupère le setter existant de machines. Elle simule une mise à jour
fonctionnelle avec map et copies d’objets, sans API ni commande CRUD ajoutée dans
l’application. Le tableau initial et son objet restent inchangés. Les trois
routes et le retour navigateur conservent la nouvelle référence partagée et
n’émettent aucune nouvelle requête JSON. Un refresh refait la requête et restaure
la fixture initiale. Ces contrôles portent sur la fixture, pas sur les huit
machines officielles ni sur de futurs callbacks métier.

Pour chaque scénario : indicateur loading présent puis absent, props partagées
contrôlées, seuls des GET vers machines.json, aucun contenu localStorage ou
sessionStorage et aucune exception JavaScript non traitée. Les erreurs HTTP et
réseau simulées peuvent apparaître dans la console réseau, comme attendu.
La fixture est identique avant/après et public/machines.json reste absent.

## État des critères Jira

| Critère | Vérification actuelle |
| --- | --- |
| Fetch/useEffect depuis /machines.json | Mécanisme vérifié avec fixture ; fichier officiel manquant |
| Erreurs HTTP, réseau et JSON | Vérifié |
| Loading visible puis terminé | Vérifié |
| Tableau vide valide | Vérifié |
| Source d’état unique sur les pages | Vérifié par identité de référence |
| Fonctions de modification immuables | Non implémentées sous la contrainte sans CRUD ; seul le setter React est exercé par le test |
| Conservation en navigation | Vérifiée par mise à jour synthétique ; vrais parcours métier différés |
| Restauration au refresh | Vérifiée avec fixture ; contrôle officiel restant |
| JSON inchangé et absence de persistance | Aucun appel d’écriture ; fixture inchangée ; contrôle du fichier officiel restant |
| États indépendants du CRUD | Vérifié |

FC-8 reste In Progress. Les résultats ne permettent pas de déclarer tous les
critères satisfaits. Aucun autre ticket n’est commencé ou modifié, aucun push.

## Références

- [Jira FC-8](https://aymanloussal552.atlassian.net/browse/FC-8)
- [React useEffect](https://react.dev/reference/react/useEffect)
- [React useState](https://react.dev/reference/react/useState)
- [Explication et architecture en darija](architecture.md)
