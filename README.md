# La Fabrique à Nuages

Un petit jeu incrémental en français, inspiré de *Cookie Clicker* et *Adventure Capitalist*. Pressez le nuage, récoltez des gouttes et développez un atelier météo automatisé.

## Jouer en local

Ouvrez simplement `index.html` dans un navigateur moderne. Le projet n'utilise ni dépendance, ni étape de compilation.

## Publier sur GitHub Pages

1. Créez un nouveau dépôt GitHub et ajoutez-y le contenu de ce dossier.
2. Dans **Settings → Pages**, choisissez **Deploy from a branch**.
3. Sélectionnez la branche `main` et le dossier `/ (root)`, puis enregistrez.

Le jeu inclut une sauvegarde automatique locale, des gains hors ligne limités à quatre heures, quatre automates, quatre améliorations et une mécanique d'averse temporaire. Au chargement, il consulte une horloge UTC publique pour calculer le temps écoulé sans dépendre de l'heure réglée sur l'appareil. Si le réseau est indisponible, l'heure locale prend automatiquement le relais.

## Fichiers

- `index.html` : structure du jeu
- `styles.css` : interface responsive
- `app.js` : économie, sauvegarde et interactions
- `icon.svg` : icône du site

## Licence

Vous pouvez utiliser, modifier et publier ce prototype librement sous licence MIT.
