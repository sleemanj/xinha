## Guide du débutant

[English version]({{ site.baseurl }}/NewbieGuide.html).

Tout d'abord, cette page est régulièrement mise à jour, donc si vous ne comprenez pas, ou si vous voulez faire quelque chose de plus avec Xinha, veuillez alors poster une réponse dans le [http://xinha.gogo.co.nz/punbb/viewforum.php?id=1 forum].

## Commencer

Vous devez [télécharger]({{ site.baseurl }}/DownloadsPage.html) les fichiers de Xinha. La dernière release stable est recommandée, car bien que la version nightly contient certainement des améliorations, elle peut tout aussi bien être temporairement cassée. Ce qui rendrait l'initiation bien plus difficile ! '''***'''

'''*** Normallement vous devriez utiliser la dernière release stable, mais au moment de l'écriture de ce document, vous devez utiliser la version "nightly" pour pouvoir faire fonctionner Xinha'''

## Installer les fichiers

Copier le contenu du téléchargement sur votre serveur web dans un répertoire comme par exemple "xinha/". Cela signifie que votre répertoire "xinha" contient les répertoires "examples", "images", "lang", "plugins", "popups", "skins" et quelques fichiers. Nous vous recommandons de conserver le répertoire d'exemples puisqu'il sera une excellent référence si vous voulez configurer Xinha plus tard. Les exemples pourront dès lors être exécutés sur votre serveur web à l'adresse "xinha/examples/full_examples.html".

## Code de la page

Maintenant vous avez besoin du code suivant sur votre page, pour transformer un <textarea> existant en un X-Area WYSIWYG.

En tout premier lieu, ajouter ce code quelquepart dans votre page (si possible dans la section <head></head> de votre document HTML) :

```
  <script type="text/javascript">
    _editor_url  = "/xinha/"  // (de préférence absolue) URL (incluant le slash de fin) où Xinha est installé
    _editor_lang = "fr";      // Et la langue que nous voulons utiliser dans l'éditeur.
  </script>
  <script type="text/javascript" src="/xinha/XinhaCore.js"></script>
```

Si vous utilisez un répertoire différent, assurez-vous de d'accorder l'url de XinhaCore.js avec ce répertoire d'installation.

Vous aurez également besoin d'un peu de code de configuration inclus également sur la page - il y a deux manière de le faire :


'''1)''' copier le code de configuration ans un fichier appelé "my_config.js" puis inclure ce fichier en utilisant
```
<script type="text/javascript" src="/xinha/my_config.js"></script>
```
 Cela vous permettra d'utiliser plusieurs X-Areas sur différentes pages en leur faisant tous partager la même configuration.

'''2)''' copier le code suivant dans votre page - cela est nécessaire sur chaque page où vous désirez avec un éditeur, et vous permettra de les configurer individuellement. Vous aurez besoin d'encadrer le code suivant par les tags <script type="text/javascript"> </script> si vous utilisez cette deuxième option.

```
    xinha_editors = null;
    xinha_init    = null;
    xinha_config  = null;
    xinha_plugins = null;

    // Contient les names des textareas que nous transformons en éditeurs Xinha
    xinha_init = xinha_init ? xinha_init : function()
    {
      /** ETAPE 1 ***************************************************************
       * Tout d'abord, quels sont les plugins à utiliser avec les éditeurs sur
       * cette page. Liste tous les plugins nécessaires, même si tous les éditeurs
       * n'utilisent pas tous les plugins.
       *
       * La liste des plugins ci-dessous est un bon point de départ, mais si vous
       * préférez commencer avec un éditeur plus simple vous pouvez utiliser ceci
       * 
       * xinha_plugins = xinha_plugins ? xinha_plugins : [ ];
       *
       * ce qui ne chargera aucun plugin supplémentaire.
       ************************************************************************/

      xinha_plugins = xinha_plugins ? xinha_plugins :
      [
       'CharacterMap',
       'ContextMenu',
       'ListType',
       'SpellChecker',
       'Stylist',
       'SuperClean',
       'TableOperations'
      ];
             // CETTE TOUCHE DE JAVASCRIPT CHARGE LES PLUGINS, NE PAS TOUCHER :)
             if(!Xinha.loadPlugins(xinha_plugins, xinha_init)) return;

      /** ETAPE 2 ***************************************************************
       * Maintenant, quels sont les noms (identifiants) des textareas à
       * transformer en éditeurs ?
       ************************************************************************/

      xinha_editors = xinha_editors ? xinha_editors :
      [
        'myTextArea',
        'anotherOne'
      ];

      /** ETAPE 3 ***************************************************************
       * Création d'une configuration par défaut utilisée par tous les éditeurs.
       * Si vous voulez configurer certains éditeurs différement, cela pourra
       * être fait en étape 5.
       *
       * Si vous voulez changer la configuration par défaut vous devez faire
       * quelque chose comme ceci :
       *
       *   xinha_config = new Xinha.Config();
       *   xinha_config.width  = '640px';
       *   xinha_config.height = '420px';
       *
       *************************************************************************/

       xinha_config = xinha_config ? xinha_config() : new Xinha.Config();

      /** ETAPE 4 ***************************************************************
       * Création des éditeurs pour les textareas.
       *
       * Vous pouvez le faire de deux manières, soit
       *
       *   xinha_editors   = Xinha.makeEditors(xinha_editors, xinha_config, xinha_plugins);
       *
       * si vous voulez tous les éditeurs avec les mêmes plugins, SOIT :
       *
       *   xinha_editors = Xinha.makeEditors(xinha_editors, xinha_config);
       *   xinha_editors['myTextArea'].registerPlugins(['Stylist','FullScreen']);
       *   xinha_editors['anotherOne'].registerPlugins(['CSS','SuperClean']);
       *
       * si vous voulez utiliser un jeu différent de plugins par éditeurs.
       ************************************************************************/

      xinha_editors   = Xinha.makeEditors(xinha_editors, xinha_config, xinha_plugins);

      /** ETAPE 5 ***************************************************************
       * Si vous voulez changer les variables de configuration de n'importe lequel
       * des éditeurs, c'est le moment de faire. Vous pouvez par exemple changer
       * la largeur et la hauteur du textarea myTextArea en faisant :
       *
       *   xinha_editors.myTextArea.config.width  = '640px';
       *   xinha_editors.myTextArea.config.height = '480px';
       *
       ************************************************************************/


      /** ETAPE 6 ***************************************************************
       * Fin et "démarrage" des éditeurs. C'est ici que les textareas se
       * transforment en éditeurs Xinha.
       ************************************************************************/

      Xinha.startEditors(xinha_editors);
    }

    window.onload = xinha_init;

```


## Plus de code

Vous devez vous assurer que le tag du textarea a transformer possède un bien un paramètre "id"

```
<textarea id="newbiearea1" name="newbiearea1" rows="10" cols="50" style="width: 100%"></textarea>
```

il peut être le même que le "name" - assurez-vous juste que cet identifiant est unique sur la page !

Maintenant, dans le code copié dans le fichier "my_config.js" (ou dans le <head></head> si vous avez utilisé cette méthode), vous devez éditer l'étape 2 qui liste les éditeurs à transformer.

Dans cet example, deux textareas sont listés : 'myTextArea' et 'anotherOne' - vous devez changer 'myTextArea' en l'ID défini pour votre textarea - dans ce nouvel exemple, nous l'avons appelé 'newbiearea1'. Vous devez également supprimer la référence à 'anotherOne' puisque nous ne transformons que un seul textarea ici ! ('''attention, ici les valeurs sont séparées par des virgules MAIS il n'y a pas de virgule après la dernière valeur'''), votre nouveau code devrait ressembler à ceci :

```
      /** ETAPE 2 ***************************************************************
       * Maintenant, quels sont les noms (identifiants) des textareas à
       * transformer en éditeurs ?
       ************************************************************************/

      xinha_editors = xinha_editors ? xinha_editors :
      [
        'newbiearea1'
      ];
```

## Et voilà !

Votre X-Area apparait maintenant sur la page quand celle-ci a fini de se charger (pas besoin de toucher à la propriété onload du tag <body> puisque window.onload = xinha_init; en prend soin)

Rappelez-vous, si vous avez un quelconque problème, postez une réponse dans le [http://xinha.gogo.co.nz/punbb/viewtopic.php?pid=255#p255 Newbie Guide thread] du forum et nous nous efforçons de trouver une solution et que personne d'autre ne recontre encore cette même difficulté !

