# FactoryPulse — Cadrage et planification (FC-4)

Analyse du brief et des 19 descriptions et critères Jira, le 10 novembre 2026.
Responsable : Ayman Loussal, YouCode Safi. Projet Jira : FC.
Ce document décrit le travail prévu ; il ne prouve pas sa réalisation.

## Périmètre et contraintes

Application individuelle React.js/Vite en JavaScript/JSX, composants fonctionnels
réutilisables, React Router, useState, useEffect, Fetch API et CSS responsive.
Aucun backend, API REST métier, base de données, Redux ou dépendance superflue.
Aucun localStorage, sessionStorage, IndexedDB ou autre stockage persistant.
Fetch sert uniquement à lire le fichier statique public/machines.json.
Les modifications restent en mémoire React pendant la navigation. Un rechargement
complet restaure le JSON initial, qui n'est jamais modifié par l'application.

## Modèle et validation

Contrat interne proposé, à adapter aux noms de propriétés du JSON officiel :

| Propriété proposée | Règle |
| --- | --- |
| id | Identifiant stable et unique ; généré automatiquement à l'ajout, sans collision avec le parc courant |
| name | Nom obligatoire après trim ; les noms identiques ne constituent pas une identité |
| zone | Zone de production obligatoire après trim |
| status | Exactement En fonctionnement, À l'arrêt ou En panne |
| dailyProduction | Nombre entier fini supérieur ou égal à zéro ; champ obligatoire |

Une valeur de production vide ne doit pas devenir implicitement zéro. Rejeter
les valeurs négatives, décimales ou non numériques. Une soumission invalide ne
modifie pas le parc et conserve les champs ; les erreurs sont associées aux champs.
Une soumission valide crée exactement une machine. Les changements de statut et
la suppression ciblent l'identifiant, jamais le nom ou l'index de liste.
La suppression demande confirmation ; annuler ne change rien.

## Données officielles manquantes

Le workspace ne contient pas public/machines.json ni le jeu officiel des huit
machines. Demander le fichier original à l'étudiant ; aucune donnée officielle
de remplacement ne doit être inventée. Le schéma réel et les huit enregistrements
devront être vérifiés avant FC-8. Ce manque ne bloque pas le présent cadrage.

## Principes React prévus (sans implémentation dans FC-4)

- Un propriétaire commun aux routes conserve machines avec useState.
- Les pages reçoivent les données et callbacks nécessaires par props.
- useEffect charge le JSON initial ; changer de route ne recharge pas le parc.
- Loading et error décrivent la requête ; un tableau vide reste un succès.
- Les statistiques et résultats filtrés sont dérivés du tableau courant, sans
  états redondants ni useEffect pour les recalculer.
- Recherche, filtre et champs du formulaire ont un état local contrôlé.
- Les événements onChange et onSubmit appellent les fonctions appropriées ; les
  mises à jour produisent de nouveaux tableaux/objets sans mutation directe.

## Traçabilité et dépendances

Les Epics FC-1, FC-2 et FC-3 regroupent les travaux ; leur charge est agrégée.
Les dépendances ci-dessous sont fonctionnelles, consignées dans les descriptions.

| Ticket | Exigences couvertes | Prérequis | Charge |
| --- | --- | --- | --- |
| FC-4 | Analyse, modèle, validation, planning et traçabilité | Aucun | 1 h |
| FC-5 | Wireframes et design Figma mobile/ordinateur, états UI | FC-4 | 2 h |
| FC-6 | Initialisation React/Vite, architecture, Git/GitHub | FC-4 ; référence visuelle FC-5 | 3 h |
| FC-7 | Routes /, /machines, /machines/new et navigation | FC-6 | 1 h |
| FC-8 | Huit machines JSON, Fetch/useEffect, état partagé, loading/error, aucune persistance | FC-6 ; coordination FC-7 ; fichier officiel | 3 h |
| FC-9 | Dashboard : total, En fonctionnement, En panne ; statistiques automatiques | FC-7, FC-8 | 2,5 h |
| FC-10 | Informations machines, recherche par nom, filtre combiné, reset et états vides | FC-7, FC-8 | 3,5 h |
| FC-11 | Statuts exacts, synchronisation des filtres et compteurs | FC-10 ; intégration FC-8/FC-9 | 2 h |
| FC-12 | Formulaire contrôlé, validation, ID unique, ajout immédiat | FC-7, FC-8 ; intégration FC-9/FC-10 | 4 h |
| FC-13 | Suppression confirmée, annulation et dernier élément | FC-10 ; intégration FC-8/FC-9 | 1 h |
| FC-14 | Responsive 375/768/1280 px, libellés, focus et clavier | FC-5, FC-9 à FC-13 | 2 h |
| FC-15 | Coordination recette et traitement des anomalies | FC-7 à FC-14 | 5 h agrégées |
| FC-16 | Tests fonctionnels, cas limites et résultats consignés | Fonctionnalités FC-7 à FC-14 disponibles ; parent FC-15 | 2 h |
| FC-17 | Corrections, régressions, console et compilation | Premiers résultats FC-16 ; parent FC-15 | 3 h réservées |
| FC-18 | README, liens Jira/Figma/GitHub, copie propre et démonstration | FC-6 ; finalisation après FC-15/16/17 | 2 h |
| FC-19 | /kanban, trois colonnes, glisser-déposer et alternative clavier | Tout le périmètre obligatoire validé | 4 h optionnelles |

Priorités prévues : Haute sauf FC-5 Moyenne et FC-19 Basse.
Au contrôle initial, les champs Jira affichent Medium pour les 19 tickets ; les
priorités prévues sont dans leurs descriptions. Aucun changement global de
priorité n'est effectué dans FC-4. Les 19 statuts initiaux sont To Do.

Le dashboard compte toutes les machines dans le total. À l'arrêt n'entre ni dans
En fonctionnement ni dans En panne. Une recherche ignore la casse et les espaces
périphériques ; elle se combine avec le statut. Parc vide et aucun résultat sont
distincts. Les critères détaillés de chaque ticket Jira restent la référence.

## Planning approuvé et capacité

Dates de référence : 9–13 novembre 2026, capacité supposée 7 h utiles/jour.

| Jour | Travail prévu | Charge | Marge |
| --- | --- | --- | --- |
| 09/11 | FC-4, FC-5, FC-6 | 6 h | 1 h |
| 10/11 | FC-7, FC-8, FC-9 | 6,5 h | 0,5 h |
| 11/11 | FC-10, FC-11 | 5,5 h | 1,5 h |
| 12/11 | FC-12, FC-13, FC-14 | 7 h | 0 h |
| 13/11 | FC-16, FC-17, FC-18 sous coordination FC-15 | 7 h | 0 h |
| Total | Obligatoire, sans double compter les parents | 32 h | 3 h |

Les 32 h incluent 3 h réservées aux corrections. FC-19 ajoute 4 h hors engagement
et reste sans dates fermes. Ni les Epics ni FC-15 ne s'ajoutent aux enfants.
Le périmètre et le planning ont été approuvés dans la conversation avant travail.

## Situation réelle et risques au démarrage

Le développement commence le 10 novembre avec un workspace contenant seulement
.git : branche main, aucun commit, remote origin GitHub déjà configuré. Le
planning du 9 n'est donc pas démontré comme réalisé. Les dates Jira historiques
ne sont pas modifiées pour simuler un avancement.
Les 35 h de capacité initiales ne sont plus entièrement disponibles ; faisabilité
à réévaluer avec les heures réellement disponibles avant le 13. Réduire le soin
visuel superflu, garder le Kanban hors engagement et conserver la réserve de tests.
Le JSON manquant bloque FC-8 ; les maquettes et liens réels ne doivent pas être
déclarés disponibles avant vérification. Aucun push GitHub sans approbation.

## Vérification de FC-4

- [x] Chaque exigence obligatoire est reliée à un ticket.
- [x] Modèle, statuts exacts et règles de validation documentés.
- [x] État partagé, chargement initial et absence de persistance documentés.
- [x] Dates, charges et dépendances définies sur le planning approuvé.
- [x] Total obligatoire de 32 h, correction de 3 h et capacité initiale de 35 h vérifiés.
- [x] Kanban de 4 h séparé et conditionné à la validation du obligatoire.
- [x] Approbation du périmètre et du planning constatée dans la conversation.

Cette vérification concerne l'analyse, pas l'exécution des fonctionnalités.
