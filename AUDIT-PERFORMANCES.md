# Audit de performances — La Fabrique à Nuages

Date : 18 octobre 2026. Code examiné : commit `c36d9fd`, application `v34`.

## Conclusion

Le jeu peut être sensiblement accéléré sans changer ses règles ni réécrire ses trois mondes. La priorité est le calcul de résonance de Mars, puis les reconstructions de l’interface, la traduction et le bouton d’achat groupé. Les animations représentent également un travail permanent, même sans interaction.

Le projet actuel est en JavaScript, HTML et CSS. Le passage à TypeScript apporterait surtout une meilleure vérification du code ; il ne supprimerait pas les calculs et les reconstructions inutiles identifiés ici. Le choix d’un langage natif n’est pas nécessaire pour traiter ces problèmes.

L’audit initial a été réalisé sans modification du moteur, des sauvegardes ou du site public. Les variantes de cette première partie ont été appliquées temporairement en mémoire dans un navigateur de test isolé. Les optimisations ensuite réalisées et leurs mesures figurent dans la dernière section.

## Méthode et limites

- Chrome 155.0.8059.80 sans interface, sur le Mac ARM64 de travail, avec un profil temporaire.
- Chargement des fichiers locaux via interception des requêtes. L’horloge réseau a été volontairement rendue indisponible pour ne pas dépendre d’un service externe.
- Sept scénarios : Terre débutante FR ; Terre avancée FR/EN ; Mars avancée FR ; Vénus avancée FR/EN ; Vénus EN avec un écran de 390 × 844 et un processeur artificiellement ralenti ×4.
- Parties synthétiques, sans lecture ni modification d’une sauvegarde personnelle : 750 machines de chaque type sur Terre/Mars, 2 000 sur Vénus ; améliorations correspondant aux paliers atteints ; voie Ingénieur ; états avancés de prestige.
- Mesures de fonctions après échauffement : 15 à 40 répétitions selon la mesure. Les valeurs du tableau sont des médianes, arrondies au dixième de milliseconde.
- Observation complémentaire de quatre secondes de jeu automatique par scénario, puis de vingt appels au gestionnaire de clic. Comptages d’appels réalisés séparément des mesures de durée.
- Expériences distinctes pour la résonance, les panneaux masqués, la traduction, la préparation des améliorations, les animations et l’achat groupé.

Ces durées comparent les scénarios sur cette machine. L’écran réduit et le ralentissement ×4 ne constituent pas un test sur un véritable téléphone Android. Le coût d’un appel à `render()` ne comprend pas tout le dessin et la composition qui peuvent avoir lieu ensuite dans le navigateur. Les fenêtres d’observation sont trop courtes pour conclure sur une fuite mémoire, la consommation réelle de batterie ou la stabilité d’une session de plusieurs heures. Safari/iPhone et WebView Android restent à profiler sur appareils physiques.

## Mesures de référence

| Scénario | Rafraîchissement complet | Rafraîchissement léger | Un calcul de production |
| --- | ---: | ---: | ---: |
| Terre débutante, FR | 6,2 ms | 0,4 ms | < 0,1 ms |
| Terre avancée, FR | 3,0 ms | 0,8 ms | 0,2 ms |
| Terre avancée, EN | 6,2 ms | 1,0 ms | 0,2 ms |
| Mars avancée, FR, troisième phase de résonance | 50,6 ms | 24,0 ms | 11,6 ms |
| Vénus avancée, FR | 5,6 ms | 1,8 ms | 0,4 ms |
| Vénus avancée, EN | 9,5 ms | 2,2 ms | 0,5 ms |
| Vénus avancée, EN, processeur ralenti ×4 | 32,6 ms | 9,9 ms | 1,9 ms |

Pour situer ces valeurs, une image à 60 images/s dispose d’environ 16,7 ms. Le jeu ne nécessite pas un recalcul économique à 60 Hz, mais un travail synchrone de 50 ms peut retarder les clics et les animations. Dans le scénario Mars, cinq tâches de 65 à 76 ms ont été observées pendant les quatre secondes de fonctionnement automatique. Les autres scénarios n’ont pas produit de tâche longue dans cette courte fenêtre.

## 1. Priorité élevée : recalculer la résonance de Mars une seule fois

Références : `app.js:432`, `app.js:441`, `app.js:454`, `app.js:878`.

Pour chaque machine résonante, `marsResonanceMultiplier()` recherche à nouveau la machine la plus productive en parcourant toutes les unités, puis recompte les machines actives du groupe. Chaque passage recalcule leurs multiplicateurs et recherche leurs améliorations dans un tableau.

Ce travail est répété par `baseProduction()`, par la valeur du clic et par l’affichage de chaque machine. Sur la partie martienne mesurée, un seul rafraîchissement complet appelle `rawUnitProduction()` **2 910 fois** et `unitMultiplier()` **2 940 fois**, pour seulement trente types de machines.

Modification proposée : préparer un tableau des trente productions brutes, leur maximum, le groupe actif et ses effectifs en un seul passage, puis réutiliser ces valeurs pour les sommes et les cartes. Préparer également les multiplicateurs globaux et les collections d’améliorations achetées ; un `Set` permet d’éviter les recherches répétées dans le tableau de sauvegarde. Conserver les tableaux sérialisés dans la sauvegarde et reconstruire les index en mémoire.

Le cache doit être invalidé lors des achats, changements de voie, gains de reliques, succès, contrats et changements de phase de résonance. Pour les bonus temporaires, actualiser explicitement les valeurs à leur activation et à leur expiration.

**Expérience en mémoire :** remplacer uniquement le calcul global par un passage partagé fait passer un calcul de production de **11,8 à 0,5 ms** et le rafraîchissement complet de **50,2 à 16,4 ms**. Les résultats sont identiques sur les trois phases testées de cette partie synthétique. Les cartes conservent encore l’ancien calcul dans cette expérience : ce n’est pas une optimisation complète.

## 2. Priorité élevée : conserver les cartes et actualiser les seules valeurs nécessaires

Références : `app.js:815`, `app.js:829`, `app.js:850`, `app.js:858`, `app.js:878`, `app.js:891`, `app.js:898`.

La boucle appelle `render()` toutes les 250 ms. En l’absence d’interaction, le seuil de 650 ms déclenche généralement une reconstruction complète toutes les 750 ms. Les achats et changements d’onglet forcent aussi cette reconstruction ; chaque clic sur le nuage déclenche au minimum un rafraîchissement léger supplémentaire.

Le rafraîchissement complet reconstruit les machines, améliorations, archives, arbre de prestige et stratégie, même si les onglets correspondants sont fermés. L’arbre est reconstruit alors que sa fenêtre est généralement fermée. Les quatre grands chantiers de Vénus sont reconstruits à chaque rafraîchissement léger, y compris lorsqu’ils sont achevés.

Modifier `innerHTML` remplace les descendants : le navigateur doit recréer les éléments, leurs textes et leurs styles. Le total d’environ 1 000 éléments observé sur Vénus n’est pas excessif ; c’est leur reconstruction répétée qui pose problème.

Modifications proposées :

- Créer les cartes lors de leur révélation et conserver leurs références.
- Actualiser uniquement le prix, la quantité, la production, les barres et la disponibilité quand leur valeur change.
- Calculer séparément les petits badges d’onglet, sans reconstruire les panneaux masqués.
- Préparer un panneau masqué lorsqu’il est ouvert, ou le marquer comme à actualiser.
- N’actualiser l’arbre de prestige que lors de son ouverture ou d’un achat affectant son état.
- Regrouper les demandes de rendu déclenchées dans le même intervalle d’affichage, plutôt que dessiner immédiatement après chaque action. `requestAnimationFrame` peut planifier ce rendu ; il ne faut pas l’utiliser pour reconstruire toute la page soixante fois par seconde.

**Expérience en mémoire :** sur Vénus EN, omettre la reconstruction des panneaux masqués et de l’arbre fermé fait passer le rafraîchissement complet de **9,4 à 5,3 ms**, avec les machines toujours actualisées. Ce gain est isolé ; il ne doit pas être additionné directement à celui de la traduction.

## 3. Priorité élevée : rendre l’achat groupé moins bloquant

Références : `app.js:582`, `app.js:588`, `app.js:593`, `app.js:611`.

Le bouton « Tout acheter » reconstruit et trie les améliorations disponibles après chaque achat. La nouvelle liste tient compte des nouveaux paliers, ce qui est nécessaire, mais elle reconstruit aussi tous les candidats inchangés.

Scénario dédié : machines déjà présentes, aucune amélioration achetée, budget de `1e130`, achat groupé en français. Mesures uniques, indicatives :

| Monde | Améliorations achetées | Durée de l’action complète |
| --- | ---: | ---: |
| Terre | 332 | 462 ms |
| Mars | 326 | 730 ms |
| Vénus | 404 | 635 ms |

Une telle action peut donc figer l’interface pendant plus d’une demi-seconde sur ce Mac. Elle peut devenir plus gênante sur un téléphone.

Modification proposée : conserver les prochains candidats déjà calculés et ne remplacer que le candidat de la machine affectée par l’achat, en respectant toujours l’ordre croissant des prix. Préparer une seule mise à jour de l’interface et une seule sauvegarde à la fin, comme c’est déjà le cas pour le traitement groupé. Si un grand lot reste trop long, le répartir en petites tranches en empêchant deux achats groupés concurrents.

Il faut préserver les conditions de révélation des améliorations et l’ordre exact des achats : accélérer la boucle ne doit pas modifier l’économie.

## 4. Priorité élevée à moyenne : traduire les textes lors de leur construction

Références : `app.js:824`, `i18n.js:982`, `i18n.js:1001`.

Chaque appel à `render()` demande à la traduction de parcourir tous les textes de `document.body`, les attributs d’accessibilité et les titres. Cela inclut les panneaux masqués et les dialogues fermés. Les éléments reconstruits ont perdu leurs informations de traduction en mémoire : ils doivent être traduits à nouveau.

Les phrases dynamiques anglaises passent par une liste de motifs, puis par les fragments du dictionnaire. Les textes anglais sont actuellement obtenus en transformant les textes français au moment de l’affichage.

Modification proposée : introduire des messages identifiés et paramétrés, par exemple un message de production avec une valeur et une unité, puis choisir directement le modèle FR ou EN avant d’écrire le texte. Actualiser l’ensemble des libellés seulement lors d’un changement de langue. Un cache borné peut aider pour les libellés fixes ; éviter un cache infini de toutes les phrases contenant des quantités différentes.

**Expérience en mémoire :** le rafraîchissement complet de Vénus EN passe de **9,4 à 4,8 ms** lorsque la passe de traduction est supprimée temporairement. Cette variante ne constitue pas une version fonctionnelle anglaise ; elle sert uniquement à isoler le coût de cette passe. L’appel à la traduction sur une page inchangée coûte beaucoup moins : la reconstruction des textes et leur retraduction expliquent l’essentiel de l’écart.

Cette modification aiderait également à éviter les fragments de français qui ont déjà posé problème dans la version anglaise.

## 5. Priorité moyenne : préparer uniquement la prochaine amélioration

Références : `app.js:582`, `app.js:588`, `app.js:593`, `app.js:910`.

`nextUnitUpgrade()` construit toutes les améliorations encore manquantes d’une machine avant de retenir la première. Ce travail est répété pour les améliorations disponibles et pour les indices des recherches verrouillées. Il explique pourquoi une partie débutante peut coûter davantage à afficher qu’une partie terrestre déjà équipée.

Un rafraîchissement complet du début de la Terre appelle ainsi `format()` **827 fois**. Les listes de suffixes sont également recréées à chaque formatage d’un grand nombre.

Modification proposée : rechercher d’abord l’indice du prochain palier manquant, puis construire cet unique objet. Réutiliser ce résultat pour la liste disponible et les indices verrouillés. Déplacer les listes de suffixes au niveau des constantes et réutiliser les formateurs de nombres lorsqu’ils sont nécessaires.

**Expérience en mémoire :** en ne changeant que la construction du prochain palier, le rafraîchissement du scénario terrestre peu équipé passe de **7,6 à 3,0 ms**. Les objets de prochaine amélioration sont identiques pour les 24 machines testées. Cette mesure appartient à une expérience distincte, avec un budget et des conditions d’affichage différents de la référence débutante.

## 6. Priorité moyenne : réduire le travail continu des animations

Références : `styles.css:1`, `styles.css:23`, `app.js:921`, `app.js:922`, `app.js:923`.

Plusieurs animations utilisent déjà `transform`, ce qui est un bon point. D’autres déplacent les nuages avec `left`, animent le fond de pluie ou modifient des ombres et filtres. Des panneaux utilisent également `backdrop-filter`, avec des éléments animés derrière eux.

**Expérience d’isolation :** avec la simulation arrêtée, le début de la Terre effectue **120 recalculs de mise en page en deux secondes** avec les effets activés, contre **un** avec la classe de réduction des effets. Le temps de travail du moteur de rendu relevé dans cette fenêtre passe d’environ **173 à 1,7 ms**. Il ne s’agit ni d’une mesure de batterie ni d’une estimation du gain final d’un changement CSS précis.

Modifications proposées : déplacer les nuages avec `transform`, vérifier quelles ombres et quels flous nécessitent réellement une animation, adapter les effets au mobile et à l’option de réduction. Ne pas ajouter systématiquement `will-change` à tous les éléments : les couches graphiques ont aussi un coût mémoire.

L’option de réduction agit actuellement surtout sur la durée des animations CSS. Les nombres flottants et particules continuent d’être créés par JavaScript ; `rainSplash()` lance une animation via l’API du navigateur. Faire respecter cette option dans ces fonctions, et borner le nombre d’effets simultanés, réduirait également les allocations pendant les clics rapides.

## 7. Priorité moyenne : gérer explicitement le passage en arrière-plan

Références : `app.js:363`, `app.js:364`, `app.js:513`, `app.js:979`, `app.js:980`.

La distillation de Vénus vérifie `document.hidden`, mais la boucle principale ne suspend pas son rendu. Aucun gestionnaire `visibilitychange` ou `pagehide` n’a été trouvé. Le calcul hors ligne est réalisé au chargement, et le temps de chaque étape est plafonné à une seconde.

Conséquence possible : si le navigateur ralentit fortement les minuteries d’un onglet masqué, les intervalles de plus d’une seconde ne sont pas intégralement crédités par cette boucle. Le retour dans l’onglet sans rechargement ne déclenche pas le mécanisme complet de restauration. Cela relève autant de la justesse du temps écoulé que des performances.

Modification proposée : sauvegarder et suspendre le rendu au masquage ; calculer une fois le rattrapage au retour, puis reprendre les mises à jour visibles. Prévoir aussi une sauvegarde lors de `pagehide`, en complément de l’autosauvegarde. Conserver le plafonnement des gains hors ligne et la règle de jeu actif pour la distillation.

La gestion du temps doit distinguer les bonus temporaires, chantiers, contrats et refroidissements pour éviter de créditer un ancien bonus sur toute la durée d’absence. Ce point demande une validation spécifique de l’économie avant toute modification.

## Autres points : à traiter ensuite

- `pathTechList()` et `pathProjectList()` reconstruisent leurs objets à chaque demande de multiplicateur. Sur un rafraîchissement de Vénus avancée, ils sont appelés respectivement 110 et 70 fois. Préparer ces données lors d’un changement de planète ou de voie.
- Le calcul d’achat Max des colosses additionne les coûts unité par unité et recalcule le multiplicateur de coût à l’intérieur de la boucle. On peut calculer le multiplicateur une fois et exploiter les sommes géométriques entre deux caps de taxe, puis vérifier les bornes. C’est une piste issue du code ; son gain n’a pas été isolé dans les mesures présentes.
- Les sons créent des oscillateurs courts par interaction. Le contexte audio est déjà réutilisé. Aucun élément mesuré ici ne justifie de commencer par une réécriture audio ; il faut d’abord profiler une session avec son sur téléphone.
- Les valeurs telles que `1e150` restent des nombres JavaScript ordinaires : leur grandeur ne crée pas, à elle seule, un calcul arbitrairement plus coûteux. Les parcours d’améliorations et les mises à jour de la page expliquent beaucoup mieux les mesures.

## Ce qui est déjà favorable

Les quatre fichiers principaux totalisent environ **245 ko non compressés**. Leur compression gzip locale totalise environ **73 ko** ; ce second chiffre est indicatif et ne mesure pas le transfert réel du site. Le moteur principal fait **980 lignes / 127 ko**, et non 127 000 lignes. Il n’y a ni bibliothèque d’interface lourde ni grande série d’images à charger dans cette version.

Les sauvegardes synthétiques vont d’environ 1,5 à 11,7 ko ; leur sérialisation est généralement sous le dixième de milliseconde sur ce Mac. Ce n’est pas une mesure du coût complet d’écriture dans `localStorage`, mais cela ne désigne pas le format JSON comme priorité. Les enregistrements périodiques sont espacés de dix secondes.

Les valeurs extrêmes, le nombre de mondes et le poids des fichiers ne justifient donc pas une réécriture complète. La taille visible de la page est encore raisonnable. Une nouvelle bibliothèque, un moteur 3D ou un Worker introduiraient davantage de complexité sans traiter directement les principaux coûts observés.

## Ordre de mise en œuvre conseillé

1. Calcul partagé de production/résonance et index des améliorations, avec comparaison des résultats économiques avant/après sur les trois phases de Mars.
2. Cartes conservées, panneaux masqués différés et demandes de rendu regroupées.
3. Préparation paresseuse des prochains paliers et optimisation du traitement « Tout acheter ».
4. Traduction directe des textes dynamiques et suppression de la passe générale à chaque clic.
5. Animations et mode réduit, puis mise en veille de l’interface et rattrapage temporel explicite.

L’objectif de la première étape est de supprimer les tâches longues récurrentes observées sur Mars. Les suivantes doivent diminuer le travail répété sur téléphone, améliorer les clics rapides et éviter les pauses lors des gros achats. Les gains des expériences se recouvrent : ils ne s’additionnent pas et ne constituent pas une promesse de performance globale.

Valider ensuite avec les tests économiques et de traduction existants, des imports de sauvegardes, les changements de langue, les trois phases de résonance, les transitions de planète, les achats Max et groupés, puis des sessions sur Safari/iPhone et Android physique. Conserver les règles de progression, prix et récompenses pendant cette optimisation.

## Éléments de vérification

Les tests existants `tests/smoke.mjs` et `tests/i18n-smoke.mjs` passent sur le code audité. Aucune erreur JavaScript n’a été relevée dans les sept scénarios du profilage principal.

Les scripts et mesures brutes de cet audit sont disponibles localement dans `/private/tmp/fabrique-performance-7NHV9P/` : `audit.mjs`, `results.json`, `experiments.mjs`, `experiments.json`, `bulk.mjs` et `bulk.json`. Ce répertoire temporaire peut être nettoyé par le système ; les constats et valeurs utiles sont consignés dans le présent rapport.

## Mise en œuvre — version v35

Les optimisations ont été appliquées sans changer les prix, récompenses ou objectifs des trois planètes :

- Un instantané partagé de la production et des multiplicateurs pendant le rendu, avec un index des améliorations ; aucun cache économique ne persiste entre deux rendus.
- Les cartes existantes sont conservées et leurs attributs/textes sont actualisés seulement si nécessaire. Les panneaux fermés sont préparés à leur ouverture et les demandes de rendu sont regroupées par image.
- Les prochains paliers sont construits à la demande. L’achat groupé remplace uniquement le candidat acheté, avec vérification de son ordre d’achat contre la boucle précédente.
- La traduction des textes et des fragments modifiés remplace le parcours de toute la page à chaque rendu. Un cache de traduction est borné à 1 000 chaînes. Le parcours global reste utilisé pour les changements de langue et de thème.
- Les nuages se déplacent par transformation graphique. Les effets JavaScript respectent le mode réduit et le nombre de particules simultanées est limité.
- Le rendu et la simulation sont suspendus en arrière-plan. Le retour utilise les mêmes règles de gains hors ligne que le chargement ; les doubles retours et sauvegardes pendant la suspension ne recréditent ni ne perdent le temps d’absence. La distillation reste fondée sur le jeu actif.

Même protocole principal que l’audit, avec onglet des machines actif et écran déjà initialisé :

| Scénario | Rendu complet avant | Rendu complet après |
| --- | ---: | ---: |
| Terre débutante FR | 6,2 ms | 0,1 ms |
| Terre avancée FR | 3,0 ms | 0,3 ms |
| Terre avancée EN | 6,2 ms | 0,3 ms |
| Mars avancée FR | 50,6 ms | 0,4 ms |
| Vénus avancée FR | 5,6 ms | 0,4 ms |
| Vénus avancée EN | 9,5 ms | 0,4 ms |
| Vénus EN, processeur ralenti ×4 | 32,6 ms | 1,5 ms |

Le cas inchangé évite maintenant de reconstruire les cartes : ces durées représentent le fonctionnement courant, pas la création initiale d’un nouvel écran ni la durée totale d’une image dessinée. Les sept scénarios optimisés n’ont produit aucune erreur JavaScript ni tâche longue dans la fenêtre de quatre secondes. Le calcul martien hors cache passe d’environ 11,6 à 0,5 ms ; le rendu partage encore davantage de calculs. Le nombre de calculs de production brute dans un rendu martien complet passe de 2 910 à 30.

L’achat groupé traite les mêmes lots de 332, 326 et 404 améliorations en environ 2 à 2,4 ms, contre 462 à 730 ms auparavant. Son rendu final est désormais planifié pour l’image suivante ; la durée mesurée de l’action après optimisation ne comprend donc pas ce rendu différé. Les données d’achat sont mises à jour immédiatement.

La comparaison économique automatisée couvre trente parties synthétiques, les trois phases de Mars, les productions avec et sans résonance, les changements d’améliorations, et douze comparaisons d’achat groupé contre l’ordre et le budget de la boucle précédente. Les tests existants restent utilisés en complément. Les interactions dans un navigateur couvrent les trois planètes, les quatre onglets, FR/EN/FR/EN, les fenêtres de prestige, la conservation du bouton et du focus après achat, les effets réduits et la sauvegarde/reprise du mode Max.

Les tests ajoutés sont `tests/performance-regressions.mjs` et `tests/browser-performance.mjs`. Les données de mesure complémentaires sont `optimized-results.json` et `optimized-bulk.json` dans le répertoire temporaire de l’audit. Les limites sur les appareils physiques, la batterie et les longues sessions restent les mêmes.
