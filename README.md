# LOVE_LETTER.EXE : edition personnelle

Version pixel art avec enveloppe, compte à rebours, deux chats GIF et avatar de Loris.

## 1. Modifier les messages

**Tous les messages personnels sont en haut de `script.js`.** Cherche `[TODO :` avec `Cmd + F` dans VS Code et remplace chaque chaîne entre guillemets, par tes propres mots.

Exemple :

```js
const TEXTES = {
  titrePrincipal: "[TODO : TITRE DE L'ECRAN 1]",
  // ...
};
```

Devient :

```js
const TEXTES = {
  titrePrincipal: "Mon petit cadeau pour toi",
  // ...
};
```

Les textes principaux ne nécessitent aucune modification dans `index.html`. Les boutons techniques (fermer, revenir, jours/heures...) restent fonctionnels. La mise en page s'ajuste aux messages avec retour à la ligne, mais évite les paragraphes trop longs dans les bulles.

## 2. Indiquer la date exacte

Dans `script.js`, modifie :

```js
const DATE_ANNIVERSAIRE = ""; // TODO : renseigner la date exacte !
```

Utilise `AAAA-MM-JJ` (p. ex. `"2026-10-25"` **exemple fictif**). Le déverrouillage se fait à minuit heure de Suisse (`Europe/Zurich`). Tant que la date est vide, l'enveloppe ne s'ouvre pas.

## 3. GIF de chats

Le site référence les deux GIF demandés directement depuis le dépôt public :

- [cat_heart.gif](https://github.com/lovesulei/valentine-ask/blob/main/cat_heart.gif), sur l'écran d'attente.
- [cat_dance.gif](https://github.com/lovesulei/valentine-ask/blob/main/cat_dance.gif), sur l'écran de révélation.

Si un navigateur ne peut pas accéder à GitHub, deux **GIF originaux de secours**, sans watermark, sont inclus dans `assets/` : `chat_coeur_secours.gif` et `chat_danse_secours.gif`.

Pour être entièrement autonome, télécharge toi-même les deux GIF depuis GitHub et mets-les dans `assets/` ; remplace ensuite leurs URL dans `GIFS` par `"assets/cat_heart.gif"` et `"assets/cat_dance.gif"`. **Le dépôt source ne montre pas de licence explicite pour ces deux images.** Pour leur diffusion sur un site public, vérifie les droits de réutilisation ou demande l'autorisation de l'auteur. Les GIF de secours que nous avons créés ne présentent pas cette incertitude.

## 4. Ouvrir dans VS Code

Décompresse le ZIP puis ouvre le dossier `anniversaire-pixel-todo-vscode` dans VS Code, par exemple :

```bash
cd ~/Downloads/anniversaire-pixel-todo-vscode
code .
```

Tu peux aussi utiliser **Fichier > Ouvrir un dossier...** sans commande `code`.

Lance localement :

```bash
python3 -m http.server 8000
```

Puis ouvre `http://localhost:8000/`. Pour prévisualiser sans attendre :

- `http://localhost:8000/?preview=locked`
- `http://localhost:8000/?preview=open`

Ces raccourcis sont **réservés au serveur local**. Ils ne fonctionnent pas sur GitHub Pages.

## 5. Mettre à jour GitHub

Depuis le dossier du projet déjà lié à un dépôt GitHub, remplace les fichiers puis :

```bash
git add .
git commit -m "Version pixel art avec chats et textes TODO"
git push
```

Ou crée un dépôt GitHub Pages public si tu n'as pas encore de dépôt.

## Limite importante

Ce verrou d'anniversaire n'est pas une sécurité. En inspectant le JavaScript public, quelqu'un peut lire les surprises avant la date ; l'heure du navigateur peut aussi être modifiée. Pour une véritable confidentialité, il faut un contrôle côté serveur.
