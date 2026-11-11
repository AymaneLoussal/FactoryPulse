# Vérification du socle FC-6 — 11 novembre 2026

## Résultats vérifiés

- Node 24.20.0 et npm 11.19.0 ; React/React DOM 19.3.1,
  Vite 8.3.8, plugin React 6.3.0. Versions fixées et package-lock.json généré.
- `npm.cmd install` : installation réussie, audit de 20 paquets, zéro vulnérabilité signalée.
- `npm.cmd run build` : code de sortie 0, 22 modules transformés.
- `npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort` : serveur démarré ; HTTP 200.
- `npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort` : aperçu démarré.
- Chrome headless piloté par Playwright, sur dev et preview : React monté,
  titre FactoryPulse et trois titres de pages présents, rechargement réussi.
- Aucun débordement horizontal constaté à 375, 768 et 1280 px.
  Ce contrôle de base ne valide pas le futur périmètre responsive FC-14.
- Aucun message console de niveau error ni exception JavaScript après correction
  d’une icône de navigateur absente (404 initial, corrigé avec public/favicon.svg).
- localStorage et sessionStorage vides pendant le contrôle ; aucune API de
  stockage persistant ajoutée dans le code applicatif.
- `git check-ignore` confirme l’exclusion de node_modules/, dist/ et .verification/.
- Les SHA-256 des quatre SVG et de docs/cadrage.md sont identiques avant/après.
- Aucun code métier, route, fetch ou jeu de machines de remplacement ajouté.

Le script de contrôle et les captures sont conservés localement dans
`.verification/`, exclu de Git. Playwright est installé uniquement dans ce
répertoire de contrôle ; il ne fait pas partie des dépendances de l’application.

## Critères restant ouverts

- FC-5 : le fichier Figma est accessible au compte authentifié et la page
  FactoryPulse — FC-5 est retrouvée. La vérification détaillée actuelle est
  limitée par le quota Figma MCP Starter. Les contrôles antérieurs sont consignés
  dans Jira ; l’accès de l’évaluateur n’est toujours pas prouvé.
- FC-6 : le critère exigeant la présence du socle et du premier commit sur GitHub
  restera ouvert tant qu’un push explicitement approuvé n’aura pas été effectué.
  Le présent contrôle ne prouve pas la publication distante.

## Hors périmètre

FC-7 et suivants n’ont pas été commencés. React Router, le chargement du JSON,
les statistiques, la recherche, les filtres, les changements de statut, le
formulaire fonctionnel et la suppression restent à réaliser. Le fichier officiel
des huit machines est toujours nécessaire avant FC-8.
