# FactoryPulse

Application React/Vite en JavaScript/JSX pour consulter et gérer un parc de
machines industrielles à partir de huit machines initiales.

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
public/machines.json          # huit machines officielles fournies par l’utilisateur
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

Le fichier officiel `public/machines.json` contient exactement les huit machines
fournies par l’utilisateur, sans modification de valeurs. JSON, champs, IDs
uniques, statuts et productions entières non négatives ont été contrôlés.
Le chargement réel et la restauration au refresh sont vérifiés sur dev et preview.

Les tests de succès réel utilisent ce fichier sans interception. Les scénarios
de loading, erreur et parc vide utilisent une fixture temporaire explicitement
non officielle, servie par interception dans `.verification/` ignoré par Git.
Voir [les résultats et limites FC-8](docs/verification-fc8.md).
Les callbacks centralisés addMachine, updateMachineStatus et deleteMachine sont
préparés dans App ; leurs contrats sont dans docs/architecture.md. Les interfaces
CRUD, statistiques, recherche et filtres sont disponibles. Aucun backend
ni stockage persistant n’est ajouté ; le JSON n’est jamais écrit par l’application.

Les trois statuts sont exactement « En fonctionnement », « À l'arrêt » et
« En panne ». Une machine possède id, name, zone, status et dailyProduction.
Le formulaire crée un ID disponible et valide les champs ; la suppression utilise
une confirmation. Les modifications restent en mémoire jusqu’au rechargement.

## Démonstration

1. Sur le dashboard, vérifier 8 machines, 4 en fonctionnement et 2 en panne.
2. Ouvrir Machines, rechercher un nom, combiner avec un statut et réinitialiser.
3. Modifier un statut puis revenir au dashboard pour voir les compteurs changer.
4. Ajouter une machine : essayer une saisie invalide, puis une production zéro.
5. Annuler puis confirmer une suppression et observer la liste et les compteurs.
6. Recharger la page : les huit machines originales sont restaurées.

La recette et les limites de livraison figurent dans [docs/recette.md](docs/recette.md).

## Tests des callbacks FC-8

Après `npm ci`, démarrer dev et preview dans deux terminaux :

```sh
npm run build
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Dans un troisième terminal : `npm run test:callbacks` et `npm run test:recette`.
Les tests Node/Playwright invoquent les vrais callbacks reçus par props dans des
pages isolées, sans sonde dans le code applicatif. La recette teste les parcours visibles.
Chrome installé est utilisé sous Windows ; ailleurs installer Chromium avec
`npx playwright install chromium` ou fournir `FC8_CHROME_PATH`. La variable
`FC8_TEST_PORTS` permet de choisir les ports (défaut : `5173,4173`).
Playwright est uniquement une dépendance de développement.

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
