# FC-7 — Routage et navigation, 11 novembre 2026

## Périmètre livré

- Dépendance préalable FC-6 relue dans Jira : Done.
- React Router 8.5.1 installé en dépendance exacte, avec lockfile mis à jour.
- BrowserRouter entoure App une seule fois dans main.jsx.
- Routes associe `/` à Dashboard, `/machines` à Machines et `/machines/new`
  à AddMachine. Une URL inconnue affiche un message avec retour au dashboard.
- Navigation réutilisable dans AppLayout ; NavLink avec `end`, page active
  identifiée par aria-current, texte souligné et contraste de fond.
- Link relie Dashboard à Machines, Machines à AddMachine et AddMachine à Machines.
- App et AppLayout restent au-dessus de Routes, sans clé dépendant de l’URL.
  C’est dans App que l’état partagé sera ajouté par FC-8.
- Aucun chargement de machines, CRUD, calcul de statistiques, backend ou stockage
  persistant implémenté. Design et cadrage conservés.

## Vérification

`npm.cmd run build` : succès, 100 modules transformés.
Installation npm : 3 paquets ajoutés, audit de 23 paquets, zéro vulnérabilité signalée.

Les serveurs Vite dev (127.0.0.1:5173) et preview (127.0.0.1:4173) existants
ont été réutilisés après la mise à jour des sources et de dist.
Chrome headless, piloté par `.verification/fc7-routing.cjs`, a validé sur chacun :

- Les trois routes affichent chacune une seule page, et un seul lien de navigation
  porte aria-current="page". La liste et l’ajout ne sont pas confondus.
- Tous les liens de navigation et les trois liens de parcours fonctionnent.
- Deux retours puis deux avances dans l’historique affichent les bonnes pages.
- Toute cette séquence interne produit une seule requête de document, celle de
  l’entrée initiale. Un marqueur JavaScript et la référence DOM de l’en-tête
  restent identiques : pas de rechargement complet pendant la navigation.
- Un observateur React DevTools injecté uniquement dans le navigateur de test
  confirme la même racine et les mêmes instances Fiber des ancêtres fonctionnels
  de l’en-tête, dont App et AppLayout, sur 11 commits React. La comparaison tient
  compte des Fibers alternatifs de React ; aucune instrumentation dans l’application.
- Entrée directe et rechargement complet : HTTP 200 et bonne page sur les trois URL.
- Aucun débordement horizontal à 375, 768 et 1280 px sur les trois pages.
- URL inconnue et retour au dashboard vérifiés.
- Aucune erreur console, exception JavaScript ou donnée localStorage/sessionStorage.

Les contrôles finaux sont réussis sur dev et preview. Au premier passage pendant
la mise à jour du serveur dev, le contrôle avait détecté des requêtes de document
supplémentaires ; la séquence finale sur le serveur stabilisé en compte une seule.
Le script, Playwright et les captures restent dans `.verification/`, ignoré par Git.

## Limites des critères dépendant des prochains tickets

La structure conserve déjà le futur propriétaire de l’état lors de la navigation.
La conservation effective d’ajouts/modifications/suppressions devra être vérifiée
avec les fonctionnalités concernées. Le refresh affiche déjà la bonne route,
mais la restauration du contenu de public/machines.json ne peut être testée avant
FC-8 : aucun fichier officiel ou chargement n’est ajouté dans FC-7.

Un futur hébergement statique devra servir index.html pour les routes applicatives.
La vérification présente couvre Vite dev et preview, sans publication distante.

## Références

- [Installation officielle](https://reactrouter.com/start/declarative/installation)
- [Routes](https://reactrouter.com/start/declarative/routing)
- [Link et NavLink](https://reactrouter.com/start/declarative/navigating)
- [Jira FC-7](https://aymanloussal552.atlassian.net/browse/FC-7)

L’explication de BrowserRouter, Routes, Route, Link et NavLink en darija est dans
[architecture.md](architecture.md). Ce travail s’arrête à FC-7, avec commit local
et sans push GitHub.
