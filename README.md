# FactoryPulse

Socle React/Vite en JavaScript/JSX (FC-6), routage (FC-7) et mécanisme de
chargement avec état partagé (FC-8, en cours faute de données officielles).

## Lancer le projet

Node.js : `^20.19.0 || >=22.12.0` ; environnement de vérification : Node 24.20.0.
Les commandes correspondent à la [configuration officielle de Vite](https://vite.dev/guide/).

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Dans PowerShell, si la stratégie d’exécution bloque `npm.ps1`, utiliser
`npm.cmd ci` et `npm.cmd run dev` (même principe pour build et preview).
Le serveur de développement affiche son URL dans le terminal.

## Structure

```text
src/
  main.jsx                    # montage React et styles globaux
  App.jsx                     # état partagé et Fetch/useEffect initial
  components/
    layout/AppLayout.jsx      # en-tête et contenu principal communs
    layout/Navigation.jsx     # liens internes et indication de page active
    ui/PageHeading.jsx        # titre et description réutilisables
    ui/Panel.jsx              # conteneur visuel réutilisable
    ui/MachineDataState.jsx    # chargement, erreur et parc vide communs
  pages/
    Dashboard.jsx
    Machines.jsx
    AddMachine.jsx
  styles/global.css           # fondations et mise en page de base
public/                       # destination du machines.json officiel manquant
design/                       # SVG existants conservés
docs/                         # cadrage, architecture et résultats des vérifications
```

React Router affiche une seule page à la fois : `/` (Dashboard), `/machines`
(Machines), `/machines/new` (AddMachine). Une URL inconnue affiche un message
avec un retour au dashboard. La navigation commune et les liens de page utilisent
NavLink/Link, sans rechargement complet. App et AppLayout restent montés.
Ce socle ne constitue pas l’implémentation finale des maquettes.

Pour un futur hébergement statique, configurer le serveur pour servir index.html
sur les URL applicatives : BrowserRouter utilise de vraies URL. L’accès direct et
le rechargement des trois routes sont vérifiés avec Vite dev et preview.

## Périmètre

App charge `/machines.json` avec Fetch dans useEffect et partage `machines`,
`loading` et `error` par props. Le chargement ne dépend pas de la route.
Une réponse HTTP en échec, une erreur réseau, un JSON invalide ou une valeur qui
n’est pas un tableau produisent un message d’erreur ; `[]` est un succès vide.

**Le fichier officiel des huit machines est absent.** Aucun fichier de remplacement
n’est créé dans public/. L’application affiche donc une erreur de chargement
jusqu’à réception du fichier original et vérification de son schéma. Vite peut
renvoyer index.html pour ce fichier absent : cette réponse est traitée comme JSON
invalide, jamais comme un parc vide. Le build peut réussir sans les données.

Les tests de FC-8 utilisent une fixture temporaire explicitement non officielle,
servie uniquement par interception Playwright dans `.verification/` ignoré par Git.
Voir [les résultats et limites FC-8](docs/verification-fc8.md).
Statistiques, recherche, filtres et CRUD ne sont pas implémentés. Aucun backend
ni stockage persistant n’est ajouté ; le JSON n’est jamais écrit par l’application.

Les responsabilités, contrats futurs et explications en darija sont détaillés
dans [docs/architecture.md](docs/architecture.md).

## Références

- [Jira FC-6](https://aymanloussal552.atlassian.net/browse/FC-6)
- [Jira FC-7](https://aymanloussal552.atlassian.net/browse/FC-7)
- [Jira FC-8](https://aymanloussal552.atlassian.net/browse/FC-8)
- [Jira FC-5](https://aymanloussal552.atlassian.net/browse/FC-5)
- [Figma FactoryPulse](https://www.figma.com/design/ACEt89uMPgv70DYOC7VhKj)
- [GitHub](https://github.com/AymaneLoussal/FactoryPulse)

La lecture Figma authentifiée est confirmée ; le partage avec l’évaluateur reste
à vérifier. Un lien présent ne garantit pas cet accès.
`node_modules/`, `dist/` et les fichiers de vérification locaux sont exclus de Git.
