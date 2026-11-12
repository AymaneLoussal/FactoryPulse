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
FC-8 fournit les trois callbacks immuables dans App. Les commandes, formulaire
et confirmation sont reliés à ces callbacks dans FC-11, FC-12 et FC-13.

## Propriété de l’état et contrats futurs

`App` est le propriétaire unique de `machines`, avec `useState` (FC-8).
Il reste déjà monté au-dessus des pages routées par React Router (FC-7).
Les trois pages reçoivent la même référence `machines` et les valeurs `loading`
et `error` par props. Changer de route ne recrée pas cet état et ne relance pas
le chargement. AddMachine reçoit onAddMachine ; Machines reçoit
onUpdateMachineStatus et onDeleteMachine. Les pages les déclenchent depuis les
contrôles de statut, le formulaire validé et la confirmation de suppression.

| Contrat prévu | Responsabilité | Ticket |
| --- | --- | --- |
| `machines` | Tableau partagé créé dans App ; aucune copie indépendante par page | Implémenté FC-8 |
| `loading`, `error` | Résultat du chargement initial, distinct d’un tableau vide | Implémenté FC-8 |
| `addMachine(machine)` | Ajouter un record complet avec ID fourni et non présent | Callback FC-8 ; formulaire et génération ID FC-12 |
| `updateMachineStatus(id, status)` | Copier uniquement la machine ciblée avec un statut autorisé | Callback FC-8 ; commande utilisateur FC-11 |
| `deleteMachine(id)` | Retirer uniquement l’ID ciblé | Callback FC-8 ; action et confirmation FC-13 |

Les trois callbacks utilisent `setMachines(previous => ...)` et retournent void.
Ils ne modifient rien pendant loading ou après une erreur de chargement. Il faut
utiliser les callbacks des props courantes, après un chargement réussi.

`addMachine` attend les cinq champs id/name/zone/status/dailyProduction : textes
non vides, statut autorisé et production entière non négative. Le record est
copié avant la mise en file de l’update ; modifier ensuite l’objet de l’appelant
ne modifie pas l’état. Le formulaire FC-12 fournit le premier ID M-xxx disponible.
L’unicité est contrôlée à l’intérieur de l’update fonctionnelle,
donc deux ajouts rapprochés avec le même ID ne créent pas de doublon.

Un record invalide, un ID dupliqué ou inexistant, un statut interdit ou déjà
actif sont des no-op : même array conservée, aucune exception ni modification.
Deux machines peuvent avoir le même nom ; seule l’identité ID cible les opérations.
L’ajout conserve les valeurs fournies ; le formulaire réalise validation, trim et
retour utilisateur. Ne pas interpréter le retour
void comme une confirmation synchrone de réussite.

Le useEffect appelle uniquement `fetch('/machines.json')`, vérifie `response.ok`,
lit response.json() et exige Array.isArray(data). Une réponse `[]` est valide.
Le tableau reçu remplace l’état sans mutation directe ; aucun push/splice ou
changement d’objet n’est effectué. Le fichier officiel fourni par l’utilisateur
est maintenant dans public/machines.json : huit machines, schéma id/name/zone/
status/dailyProduction, IDs uniques, statuts autorisés et production entière
non négative contrôlés. Toutes les valeurs et leur ordre sont conservés.
Le contrôle des enregistrements est une vérification du fichier livré ; le loader
à l’exécution conserve son contrôle Array.isArray et son traitement d’erreurs.

L’effet a des dépendances vides : il ne dépend pas de l’URL ni de machines.
Son nettoyage désactive les mises à jour tardives et annule Fetch avec
AbortController. Le cycle de contrôle supplémentaire de StrictMode en dev peut
lancer puis annuler une première requête ; ce n’est pas un rechargement par route.

Les callbacks produisent de nouveaux tableaux/objets avec des mises
à jour fonctionnelles de l’état. Le JSON reste inchangé ; un vrai refresh
recrée App et recharge son contenu initial. Ce comportement est maintenant vérifié
avec le vrai fichier officiel sur dev et production preview, sans interception.
Aucun localStorage, sessionStorage ni IndexedDB.

Les statistiques sont dérivées du tableau partagé (FC-9), sans état redondant.
Recherche et filtre sont locaux à Machines (FC-10). La saisie et les erreurs
sont locales à AddMachine (FC-12). Statuts autorisés : En fonctionnement,
À l'arrêt et En panne.

## Répartition des composants

| Élément | Responsabilité | État |
| --- | --- | --- |
| `AppLayout` | En-tête, lien d’évitement, contenu commun | Créé |
| `PageHeading`, `Panel` | Présentation commune via props et children | Créés |
| `MachineDataState` | Loading, erreur, vide, ou contenu de la page si données disponibles | Créé FC-8 |
| Navigation | Liens React Router et page active | Créé FC-7 |
| StatCard | Affichage d’une statistique dérivée | Prévu FC-9 |
| Machines | Recherche, filtre, liste et statut | Implémenté FC-10/11 |
| AddMachine | Champs contrôlés et erreurs associées | Implémenté FC-12 |
| Confirmation native | Confirmation et annulation | Implémenté FC-13 |

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
كتبدلها باستعمال callbacks الحقيقية والواجهات ديال الماكينات.

`AppLayout` هو الإطار المشترك: العنوان والمحتوى الرئيسي. `PageHeading`
كيستقبل العنوان والوصف عبر props، و`Panel` كيستقبل المحتوى عبر children.
هكذا نفس الشكل كنعاودو نستعملوه بلا ما نكررو الكود.

`Dashboard` مخصص للمؤشرات، `Machines` للائحة، و`AddMachine` للإضافة.
الحسابات والبحث والفورم وتغيير الحالة والحذف مربوطين بالحالة المشتركة.

`useState` كيعطي App ذاكرة بين render وrender. `setMachines(data)` كيبدّل
الحالة وكيطلب من React يعاود العرض؛ تغيير variable عادية بوحدها ما كيديرش هاد الشي.
الصفحات كتاخذ نفس array عبر props، وما عندهاش نسخ مستقلة تتفرّق على بعضها.

`useEffect` محتاجينو باش طلب الشبكة يتدار من بعد تركيب المكوّن، ماشي وسط
حساب الواجهة فكل render. `[]` كتعني أن التنقل وتبديل state ما يعاودوش الطلب.
التنظيف كيلغي الطلب القديم وكيمنع جواب متأخر يبدّل state من بعد تفكيك المكوّن.

`loading` كيبين انتظار الجواب، و`error` كيبين علاش التحميل فشل. array خاوية
كتعني نجاح بلا ماكينات، ماشي خطأ. refresh كيعيد تركيب App وكيطلب JSON من جديد؛
تأكدنا مع الملف الرسمي أنه كيرجع نفس الثمانية ماكينات، بلا تخزين دائم.
الـcallbacks ديال الإضافة والحذف وتغيير الحالة مربوطين بالأزرار والفورم.

`map()` كيدوز على اللائحة وكيعطينا array جديدة. فالتحديث كننسخو غير الماكينة
المقصودة بـ `{ ...machine, status }`؛ الباقي كيبقى نفسو بلا تغيير.
`filter()` كيعطينا لائحة جديدة فيها غير الماكينات اللي ID ديالها مختلف على
اللي بغينا نحيدو. `...previous` كينسخ عناصر اللائحة فـ array جديدة باش نزيدو
الماكينة بلا push على القديمة. هادي نسخ سطحية مناسبة للحقول البسيطة ديال الموديل.

`setMachines(previous => ...)` كيعطينا آخر state وقت تطبيق التغيير، حتى إلا
تناداو جوج callbacks بسرعة. هكذا التحديث الثاني ما كيضيعش التحديث الأول.

`public/machines.json` فيه دابا نفس البيانات الرسمية اللي عطا المستخدم، بلا تبديل.
`design/` وملف cadrage.md بقاو كيف كانو. `node_modules/` فيه المكتبات
و`dist/` فيه نتيجة build؛ بجوج مستثنيين من Git.
