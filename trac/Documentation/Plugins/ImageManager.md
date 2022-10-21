{% include nav.html %}

# Plugin: ImageManager
[Back To Plugins]({{ site.baseurl }}/trac/Documentation/Plugins.html)

'''Note: The [ExtendedFileManager]({{ site.baseurl }}/trac/Documentation/Plugins/ExtendedFileManager.html) plugin is a generally advanced version of `ImageManager` and is recommended instead'''

The ImageManager plugin provides a means for users to upload, manipulate (resize, rotate, crop etc), delete and organise (into directories) images, and then insert them into the HTML being edited.

ImageManager presently requires PHP.

## Brief Usage :
(first see the NewbieGuide)

Insert the ImageManager into xinha_plugins just like normal

```

  xinha_plugins = xinha_plugins ? xinha_plugins :
      [
        'FullScreen', 'ImageManager'
      ];

```


Now we configure the PHP, (for a full list of options you can use here, see source:trunk/plugins/ImageManager/config.inc.php#latest , any you don't provide here will revert to the defaults shown in that file)...


```
 with(xinha_config.ImageManager)
 {
  <?php
     require_once('/path/to/xinha/contrib/php-xinha.php');
     xinha_pass_to_php_backend(
       array(
         'images_dir' => '/path/to/images', 
         'images_url' => '/images',
         'allow_upload' => true
       )
     ); 
   ?>
 }
```


Fairly obviously, you need to change the paths above to suit your installation.  Note that by default allow_upload is false (in current SVN version), you MUST set it true manually as above if you wish to allow uploading.

## Complete Example
Here is a complete example of the xinha_init (see the NewbieGuide if you don't know what this is!).

```
    xinha_init = xinha_init ? xinha_init : function()
    {
      /** STE      P 1 ***************************************************************
       * First, what are the plugins you will be using in the editors on this
       * page.  List all the plugins you will need, even if not all the editors
       * will use all the plugins.
       ************************************************************************/

      xinha_plugins = xinha_plugins ? xinha_plugins :
      [
        'FullScreen', 'ImageManager'
      ];
             // THIS BIT OF JAVASCRIPT LOADS THE PLUGINS, NO TOUCHING  :)
             if(!HTMLArea.loadPlugins(xinha_plugins, xinha_init)) return;

      /** STEP 2 ***************************************************************
       * Now, what are the names of the textareas you will be turning into
       * editors?
       ************************************************************************/

      xinha_editors = xinha_editors ? xinha_editors :
      [
        'myTextArea'
      ];

      /** STEP 3 ***************************************************************
       * We create a default configuration to be used by all the editors.
       * If you wish to configure some of the editors differently this will be
       * done in step 4.
       *
       * If you want to modify the default config you might do something like this.
       *
       *   xinha_config = new HTMLArea.Config();
       *   xinha_config.width  = 640;
       *   xinha_config.height = 420;
       *
       *************************************************************************/

       xinha_config = xinha_config ? xinha_config : new HTMLArea.Config();

       with(xinha_config.ImageManager)
       {
        <?php
          require_once('/path/to/xinha/contrib/php-xinha.php');
          xinha_pass_to_php_backend(
            array(
              'images_dir' => '/path/to/images', 
              'images_url' => '/images',
              'allow_upload' => true
            )
          ); 
        ?>
       }
      /** STEP 4 ***************************************************************
       * We first create editors for the textareas.
       *
       * You can do this in two ways, either
       *
       *   xinha_editors   = HTMLArea.makeEditors(xinha_editors, xinha_config, xinha_plugins);
       *
       * if you want all the editor objects to use the same set of plugins, OR;
       *
       *   xinha_editors = HTMLArea.makeEditors(xinha_editors, xinha_config);
       *   xinha_editors['myTextArea'].registerPlugins(['Stylist','FullScreen']);
       *   xinha_editors['anotherOne'].registerPlugins(['CSS','SuperClean']);
       *
       * if you want to use a different set of plugins for one or more of the
       * editors.
       ************************************************************************/

      xinha_editors   = HTMLArea.makeEditors(xinha_editors, xinha_config, xinha_plugins);

      /** STEP 5 ***************************************************************
       * If you want to change the configuration variables of any of the
       * editors,  this is the place to do that, for example you might want to
       * change the width and height of one of the editors, like this...
       *
       *   xinha_editors.myTextArea.config.width  = 640;
       *   xinha_editors.myTextArea.config.height = 480;
       *
       ************************************************************************/


      /** STEP 5 ***************************************************************
       * Finally we "start" the editors, this turns the textareas into
       * Xinha editors.
       ************************************************************************/

      HTMLArea.startEditors(xinha_editors);
      window.onload = null;
    }

```
