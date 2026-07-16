# La Fabrique à Nuages

Un jeu incrémental en français, inspiré de *Cookie Clicker* et *Adventure Capitalist*. Pressez le nuage, récoltez des gouttes et développez un empire météo automatisé à travers plusieurs mondes.

## Jouer en local

Ouvrez simplement `index.html` dans un navigateur moderne. Le projet n'utilise ni dépendance, ni étape de compilation.

## Publier sur GitHub Pages

1. Créez un nouveau dépôt GitHub et ajoutez-y le contenu de ce dossier.
2. Dans **Settings → Pages**, choisissez **Deploy from a branch**.
3. Sélectionnez la branche `main` et le dossier `/ (root)`, puis enregistrez.

Le jeu inclut :

- 24 automates révélés progressivement ;
- 16 paliers d'amélioration par automate, soit 384 paliers ;
- 20 innovations globales supplémentaires ;
- des achats ×1, ×10, ×100 ou Max ;
- un système de prestige infini fondé sur les Aubes ;
- une Constellation permanente de 10 améliorations achetées avec les Aubes ;
- des contrats météo temporaires qui augmentent durablement la production ;
- des phénomènes rares à capturer pour des bonus courts et puissants ;
- trois voies d’ère — Orages, Industrie et Temps — choisies à chaque Aube ;
- huit recherches exclusives et trois projets monumentaux par voie ;
- des reliques de projet conservées entre les cycles.
- une Expédition du Multivers en 12 jalons, avec trois tempêtes-boss à vaincre ;
- des boss en trois phases, avec réserve de gouttes et objectif d’action spécifique ;
- le Climatologue du Multivers, une construction de conclusion ;
- une transition narrative surprise vers une seconde campagne martienne ;
- 30 automates propres à Mars et 600 paliers asymétriques allant de ×3 à ×7 777 777 ;
- des colosses très coûteux dont chaque cap vaut ×1 000 ;
- une résonance orbitale qui rend régulièrement les anciens automates dominants ;
- un décor rouge, une nouvelle ressource, des Sols, doctrines, missions et anomalies martiennes ;
- une conquête de Mars en 15 jalons et une seconde fin beaucoup plus longue à atteindre ;
- un mode Nouvelle Météo+ qui relance une campagne avec un bonus permanent supplémentaire ;
- 12 succès à collectionner ;
- l’export et l’import de sauvegarde, ainsi qu’une option pour réduire les animations ;
- une ambiance visuelle qui évolue sur six ères ;
- des averses temporaires, statistiques et animations ;
- une sauvegarde automatique avec jusqu'à 12 heures de production hors ligne, extensibles par amélioration.

Au chargement, le jeu consulte une horloge UTC publique pour calculer le temps écoulé sans dépendre de l'heure réglée sur l'appareil. Si le réseau est indisponible, l'heure locale prend automatiquement le relais.

## Fichiers

- `index.html` : structure du jeu
- `styles.css` : interface responsive
- `app.js` : économie, sauvegarde et interactions
- `icon.svg` : icône du site

## Licence

Vous pouvez utiliser, modifier et publier ce prototype librement sous licence MIT.
