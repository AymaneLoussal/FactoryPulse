# FactoryPulse

Socle React/Vite en JavaScript/JSX (FC-6), avec routage et navigation (FC-7).

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
  App.jsx                     # composition ; futur propriétaire de l’état partagé
  components/
    layout/AppLayout.jsx      # en-tête et contenu principal communs
    layout/Navigation.jsx     # liens internes et indication de page active
    ui/PageHeading.jsx        # titre et description réutilisables
    ui/Panel.jsx              # conteneur visuel réutilisable
  pages/
    Dashboard.jsx
    Machines.jsx
    AddMachine.jsx
  styles/global.css           # fondations et mise en page de base
public/                       # futur machines.json officiel
design/                       # SVG existants conservés
docs/                         # cadrage existant et architecture FC-6
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

FC-6 prépare les fichiers et composants ; FC-7 relie les pages. Chargement JSON,
statistiques, recherche, filtres, ajout, validation et suppression restent aux
tickets suivants. Aucun chiffre fictif, backend ni stockage persistant n’est ajouté.
Le fichier officiel des huit machines reste à fournir pour FC-8.

Les responsabilités, contrats futurs et explications en darija sont détaillés
dans [docs/architecture.md](docs/architecture.md).

## Références

- [Jira FC-6](https://aymanloussal552.atlassian.net/browse/FC-6)
- [Jira FC-7](https://aymanloussal552.atlassian.net/browse/FC-7)
- [Jira FC-5](https://aymanloussal552.atlassian.net/browse/FC-5)
- [Figma FactoryPulse](https://www.figma.com/design/ACEt89uMPgv70DYOC7VhKj)
- [GitHub](https://github.com/AymaneLoussal/FactoryPulse)

La lecture Figma authentifiée est confirmée ; le partage avec l’évaluateur reste
à vérifier. Un lien présent ne garantit pas cet accès.
`node_modules/`, `dist/` et les fichiers de vérification locaux sont exclus de Git.
