# Architecture — socle, navigation et chargement partagé

## Ce qui est implémenté

Une application React/Vite JavaScript, trois pages statiques reliées par
BrowserRouter, Routes et Route dans un layout commun. Navigation utilise NavLink
avec correspondance exacte et aria-current pour identifier la page active.
Les liens de parcours utilisent Link. App et AppLayout restent hors de Routes,
sans clé dépendant de l’URL : les pages changent, leur ancêtre commun reste monté.
Le titre de page, le panneau réutilisable et le CSS du socle sont conservés.
FC-8 ajoute trois useState dans App (`machines`, `loading`, `error`) et un
useEffect de chargement initial. MachineDataState affiche les états communs.
Les fonctions métier ci-dessous restent des contrats prévus : aucun CRUD n’est
implémenté à cette étape, conformément aux instructions de FC-8.

## Propriété de l’état et contrats futurs

`App` est le propriétaire unique de `machines`, avec `useState` (FC-8).
Il reste déjà monté au-dessus des pages routées par React Router (FC-7).
Les trois pages reçoivent la même référence `machines` et les valeurs `loading`
et `error` par props. Changer de route ne recrée pas cet état et ne relance pas
le chargement. Les futurs callbacks seront ajoutés avec les fonctionnalités.

| Contrat prévu | Responsabilité | Ticket |
| --- | --- | --- |
| `machines` | Tableau partagé créé dans App ; aucune copie indépendante par page | Implémenté FC-8 |
| `loading`, `error` | Résultat du chargement initial, distinct d’un tableau vide | Implémenté FC-8 |
| `addMachine(values)` | Valider, générer un ID unique et ajouter une machine | FC-12 |
| `updateMachineStatus(id, status)` | Modifier la machine ciblée sans mutation | FC-11 |
| `deleteMachine(id)` | Retirer la machine après confirmation identifiant son nom | FC-13 |

Le useEffect appelle uniquement `fetch('/machines.json')`, vérifie `response.ok`,
lit response.json() et exige Array.isArray(data). Une réponse `[]` est valide.
Le tableau reçu remplace l’état sans mutation directe ; aucun push/splice ou
changement d’objet n’est effectué. Les champs des enregistrements ne sont pas
encore certifiés : le schéma et les huit machines devront être contrôlés sur
le fichier officiel, toujours absent. Aucun remplacement inventé n’est ajouté.

L’effet a des dépendances vides : il ne dépend pas de l’URL ni de machines.
Son nettoyage désactive les mises à jour tardives et annule Fetch avec
AbortController. Le cycle de contrôle supplémentaire de StrictMode en dev peut
lancer puis annuler une première requête ; ce n’est pas un rechargement par route.

Les futures modifications produiront de nouveaux tableaux/objets avec des mises
à jour fonctionnelles de l’état. Le JSON restera inchangé ; un vrai refresh
recrée App et recharge son contenu initial. Ce comportement est vérifié avec
une fixture temporaire, pas encore avec le fichier officiel.
Aucun localStorage, sessionStorage ni IndexedDB.

Les statistiques seront dérivées du tableau partagé (FC-9), sans état redondant.
Recherche et filtre resteront locaux à Machines (FC-10). La saisie et les erreurs
resteront locales à AddMachine (FC-12). Statuts autorisés : En fonctionnement,
À l'arrêt et En panne.

## Répartition des composants

| Élément | Responsabilité | État |
| --- | --- | --- |
| `AppLayout` | En-tête, lien d’évitement, contenu commun | Créé |
| `PageHeading`, `Panel` | Présentation commune via props et children | Créés |
| `MachineDataState` | Loading, erreur, vide, ou contenu de la page si données disponibles | Créé FC-8 |
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
اختبار FC-8 تأكد أن array مشتركة كتبقى أثناء التنقل، حتى بعدما أداة الاختبار
كتعوّضها بنسخة جديدة. هاد التبديل غير فالاختبار؛ CRUD الفعلي باقي للتذاكر ديالو.

`AppLayout` هو الإطار المشترك: العنوان والمحتوى الرئيسي. `PageHeading`
كيستقبل العنوان والوصف عبر props، و`Panel` كيستقبل المحتوى عبر children.
هكذا نفس الشكل كنعاودو نستعملوه بلا ما نكررو الكود.

`Dashboard` مخصص للمؤشرات، `Machines` للائحة، و`AddMachine` للإضافة.
دابا هادو غير واجهات أولية: الحسابات والبحث والفورم مازال ما تخدموش.

`useState` كيعطي App ذاكرة بين render وrender. `setMachines(data)` كيبدّل
الحالة وكيطلب من React يعاود العرض؛ تغيير variable عادية بوحدها ما كيديرش هاد الشي.
الصفحات كتاخذ نفس array عبر props، وما عندهاش نسخ مستقلة تتفرّق على بعضها.

`useEffect` محتاجينو باش طلب الشبكة يتدار من بعد تركيب المكوّن، ماشي وسط
حساب الواجهة فكل render. `[]` كتعني أن التنقل وتبديل state ما يعاودوش الطلب.
التنظيف كيلغي الطلب القديم وكيمنع جواب متأخر يبدّل state من بعد تفكيك المكوّن.

`loading` كيبين انتظار الجواب، و`error` كيبين علاش التحميل فشل. array خاوية
كتعني نجاح بلا ماكينات، ماشي خطأ. refresh كيعيد تركيب App وكيطلب JSON من جديد؛
مع fixture ديال الاختبار تأكدنا أنه كيرجع المحتوى الأول، بلا تخزين دائم.
مع الملف الرسمي هاد التحقق باقي حتى يتوفر. الإضافة والحذف وتغيير الحالة ما تزادوش.

`public/` واجد للملف الرسمي machines.json، ولكن ما زدناش بيانات من عندنا.
`design/` وملف cadrage.md بقاو كيف كانو. `node_modules/` فيه المكتبات
و`dist/` فيه نتيجة build؛ بجوج مستثنيين من Git.
