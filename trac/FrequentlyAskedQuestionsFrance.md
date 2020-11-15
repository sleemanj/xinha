# Frequently Asked Questions

[english version]({{ site.baseurl }}/trac/FrequentlyAskedQuestions.html).

Tout d'abord, cette page est régulièrement mise à jour. Donc si quelque chose reste incompréhensible ou si vous pensez qu'une question manque, veuillez poster un message dans le [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=138 Forum de Discussion].

## Le projet

 * Q: Qu'est-ce que je peux faire pour aider le projet ? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=3 Developers]
 * Q: Est-il possible de faire une donation ? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=81 Donations]

## Installation

 * Q: Par où commencer ? [http://xinha.python-hosting.com/wiki/NewbieGuide Newbie]
 * Q: Un serveur web est-il requis ou le script est-il utilisable en local ?
   * R: Vous avez besoin d'un serveur web, sinon certains plugins et les langues autres que l'anglais seront inopérants.
 * Q: Pourquoi les modification ne sont soumis que en basculant vers le mode HTML ?
   * R: Vous avez probablement soumis le formulaire en utilisant JavaScript (form.submit()), lui préférer form.onsubmit() (voir #450)
 * Q: Comment changer la CSS par défaut de l'éditeur ? ([http://xinha.gogo.co.nz/punbb/viewtopic.php?id=455 CSS pas défaut]) 

## Utilisation de l'éditeur

 * Q: Comment insérer un tag <br> ? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=97 Carriage return]

## Configuration

 * Q: Est-il possible de démarrer Xinha en mode plein écran ? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=102 Full screen]
 * Q: Comment cacher la barre de structure ? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=3 Path bar]
 * Q: Comment modifier la police d'affiche par défaut ? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=116 Font]
 * Q: Comment redimensionner l'éditeur ? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=244 Resize]
 * Q: Comment styler les tags H1 et les autres tags comme afficher sur le site web ? [http://xinha.gogo.co.nz/punbb/viewtopic.php?pid=3811#p3811 CSS]

## Troubles

 * Q: J'ai scrupuleusement suivi le newbie guide, mais le texte reste désespérement en anglais. Comment utiliser la langue correspondant à mon choix ?
   * R1: Assurez-vous d'avoir un fichier de traduction à jour.
   * R2: Le système de traduction (i18n) fonctionnera uniquement si vous avez un serveur web.
 * Q: Mes données apparaissent bizarrement dans la zone de texte ? 
   * R: Vous devez transformer en entités les données transmises dans le textarea [Entitize data]({{ site.baseurl }}/trac/Entize.html) 

## Développeurs

 * Q: Existe-t-il une liste des fonctions utilisées par xinha ? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=137 Xinha functions]
 * Q: Comment modifier le contenu de l'éditeur ? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=224 setHTML(), getHTML()...]

## A propos des plugins

 * Q: Existe-t-il un tutorial de création de plugin ?
   * R: Nous espérons qu'il arrive rapidement...
