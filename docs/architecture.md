# Architecture — socle FC-6 et navigation FC-7

## Ce qui est implémenté

Une application React/Vite JavaScript, trois pages statiques reliées par
BrowserRouter, Routes et Route dans un layout commun. Navigation utilise NavLink
avec correspondance exacte et aria-current pour identifier la page active.
Les liens de parcours utilisent Link. App et AppLayout restent hors de Routes,
sans clé dépendant de l’URL : les pages changent, leur ancêtre commun reste monté.
Le titre de page, le panneau réutilisable et le CSS du socle sont conservés.
Les fonctions métier ci-dessous sont des contrats prévus, pas des
fonctions déjà implémentées.

## Propriété de l’état et contrats futurs

`App` sera le propriétaire unique de `machines`, avec `useState` (FC-8).
Il reste déjà monté au-dessus des pages routées par React Router (FC-7).
Les pages recevront les données et callbacks par props : changer de route
ne devra ni recréer cet état ni relancer son chargement.

| Contrat prévu | Responsabilité | Ticket |
| --- | --- | --- |
| `machines` | Tableau partagé ; aucune copie indépendante par page | FC-8 |
| `loading`, `error` | Résultat du chargement initial, distinct d’un tableau vide | FC-8 |
| `addMachine(values)` | Valider, générer un ID unique et ajouter une machine | FC-12 |
| `updateMachineStatus(id, status)` | Modifier la machine ciblée sans mutation | FC-11 |
| `deleteMachine(id)` | Retirer la machine après confirmation identifiant son nom | FC-13 |

FC-8 chargera uniquement `public/machines.json` avec Fetch et `useEffect`.
Le fichier officiel est absent : aucun remplacement inventé n’est ajouté.
Les mutations produiront de nouveaux tableaux/objets avec des mises à jour
fonctionnelles de l’état. Le JSON restera inchangé ; recharger la page rétablira
son contenu initial. Aucun localStorage, sessionStorage ni IndexedDB.

Les statistiques seront dérivées du tableau partagé (FC-9), sans état redondant.
Recherche et filtre resteront locaux à Machines (FC-10). La saisie et les erreurs
resteront locales à AddMachine (FC-12). Statuts autorisés : En fonctionnement,
À l'arrêt et En panne.

## Répartition des composants

| Élément | Responsabilité | État |
| --- | --- | --- |
| `AppLayout` | En-tête, lien d’évitement, contenu commun | Créé |
| `PageHeading`, `Panel` | Présentation commune via props et children | Créés |
| Navigation | Liens React Router et page active | Créé FC-7 |
| StatCard | Affichage d’une statistique dérivée | Prévu FC-9 |
| SearchInput, StatusFilter | Recherche et filtre contrôlés | Prévus FC-10 |
| MachineList, MachineCard | Liste et informations des machines | Prévus FC-10 |
| MachineForm | Champs contrôlés et erreurs associées | Prévu FC-12 |
| DeleteConfirmation | Confirmation et annulation | Prévu FC-13 |

On ajoutera ces composants au moment où ils auront un usage réel. Aucun composant
vide, faux callback ou bibliothèque d’état supplémentaire n’est nécessaire.
Le CSS de base reprend la palette des SVG ; la finalisation responsive relève de FC-14.

## شرح بالدارجة

`index.html` فيه العنصر `root`. `main.jsx` كيربط React بهاد العنصر وكيحمّل CSS.
`App.jsx` كيجمع التطبيق. `BrowserRouter` فـ main.jsx كيربط React بعنوان
المتصفح وhistory. `Routes` كيلقى المسار المناسب، وكل `Route` كيربط عنوان
بصفحة: / للـ Dashboard، /machines للائحة، و/machines/new للإضافة.

`Link` كينقل بين الصفحات بلا ما يعاود يحمّل الوثيقة كاملة. `NavLink`
كيزيد يعرف واش الرابط هو النشيط، وكيضيف aria-current="page"؛ CSS كيبيّن
الصفحة الحالية. استعملنا end باش رابط Machines ما يبقاش نشيط فصفحة الإضافة.
BrowserRouter كيتعامل حتى مع الرجوع والتقدم ديال المتصفح.

`App` و`AppLayout` خارج Routes، يعني كيبقاو مركّبين ملي كتبدّل الصفحة.
غير الصفحة المطابقة كتتبدل؛ ما كنعاودوش createRoot وما كنربطوش key بالعنوان.
الحفاظ الفعلي على تغييرات الماكينات غادي يتجرب ملي تتزاد البيانات والعمليات.

`AppLayout` هو الإطار المشترك: العنوان والمحتوى الرئيسي. `PageHeading`
كيستقبل العنوان والوصف عبر props، و`Panel` كيستقبل المحتوى عبر children.
هكذا نفس الشكل كنعاودو نستعملوه بلا ما نكررو الكود.

`Dashboard` مخصص للمؤشرات، `Machines` للائحة، و`AddMachine` للإضافة.
دابا هادو غير واجهات أولية: الحسابات والبحث والفورم مازال ما تخدموش.

فـ FC-8، `App` غادي يحتافظ بلائحة machines بـ useState ويمررها للصفحات
عبر props. الإضافة وتغيير الحالة والحذف غادي يدوزو من callbacks مشتركة.
بهذا كتبقى عندنا نسخة وحدة من المعطيات؛ التنقل ما كيمسحهاش، ولكن refresh
كيرجع الملف الأصلي، حيت ما كاين حتى تخزين دائم.

`public/` واجد للملف الرسمي machines.json، ولكن ما زدناش بيانات من عندنا.
`design/` وملف cadrage.md بقاو كيف كانو. `node_modules/` فيه المكتبات
و`dist/` فيه نتيجة build؛ بجوج مستثنيين من Git.
