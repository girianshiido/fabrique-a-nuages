# La Fabrique à Nuages

Un jeu incrémental en français, inspiré de *Cookie Clicker* et *Adventure Capitalist*. Pressez le nuage, récoltez des gouttes et développez un empire météo automatisé à travers six ères.

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
