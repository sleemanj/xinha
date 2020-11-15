## Newbie Guide

[Version française](NewbieGuideFrance.html).

Firstly, this page is always being improved, so if you don't understand something, or you want to do something more with Xinha, then please post a message in the [http://xinha.gogo.co.nz/punbb/viewforum.php?id=1 forum].

## Getting Started

You need to download the Xinha files - DownloadsPage - the latest stable release is recommended, as although the nightly release might have some improvements, it could also be broken which will make getting started a whole lot harder! 

## Install Files

Copy contents of the download into your web project and put them in a directory such as "xinha/". 
This means in your "xinha" directory will contain "examples", "images", "lang", "plugins", "modules", "popups", "skins" and a set of files.
We recommend keeping the examples folder as it is an excellent reference if you want to customise anything later. E
xamples can be run and seen already now on your web project at "xinha/examples/full_example.html".

## Page Code

Now you need the following code on your page, to turn an existing <textarea> into the WYSIWYG X-Area.

From the top down, put this code on your pages somewhere (if possible in your <head></head> section):

```
#!text/html
  <script type="text/javascript">
    _editor_url  = "/xinha/"   // (preferably absolute) URL (including trailing slash) where Xinha is installed
    _editor_lang = "en";       // And the language we need to use in the editor.
    _editor_skin = "silva";    // If you want use a skin, add the name (of the folder) here
    _editor_icons = "classic"; // If you want to use a different iconset, add the name (of the folder, under the `iconsets` folder) here
  </script>
  <script type="text/javascript" src="/xinha/XinhaCore.js"></script>
```

If you are using a different directory, make sure you change both _editor_url and the location of `XinhaCore`.js in the above code accordingly.

You will also need some config code included in the page too. Either put the code below into a new file called "my_config.js" and including this file using
```
#!text/html
<script type="text/javascript" src="/xinha/my_config.js"></script>
```
or just copy it into your page and wrap it in <script type="text/javascript"> </script> tags - this will need to be done on every page you want an editor on, and will allow you to customise each one as you want. 

```
xinha_editors = null;
xinha_init    = null;
xinha_config  = null;
xinha_plugins = null;

// This contains the names of textareas we will make into Xinha editors
xinha_init = xinha_init ? xinha_init : function()
{
   /** STEP 1 ***************************************************************
   * First, specify the textareas that shall be turned into Xinhas. 
   * For each one add the respective id to the xinha_editors array.
   * I you want add more than on textarea, keep in mind that these 
   * values are comma seperated BUT there is no comma after the last value.
   * If you are going to use this configuration on several pages with different
   * textarea ids, you can add them all. The ones that are not found on the
   * current page will just be skipped.
   ************************************************************************/
  
  xinha_editors = xinha_editors ? xinha_editors :
  [
    'myTextArea', 'anotherOne'
  ];
  
  /** STEP 2 ***************************************************************
   * Now, what are the plugins you will be using in the editors on this
   * page.  List all the plugins you will need, even if not all the editors
   * will use all the plugins.
   *
   * The list of plugins below is a good starting point, but if you prefer
   * a simpler editor to start with then you can use the following 
   * 
   * xinha_plugins = xinha_plugins ? xinha_plugins : [ ];
   *
   * which will load no extra plugins at all.
   ************************************************************************/

  xinha_plugins = xinha_plugins ? xinha_plugins :
  [
   'CharacterMap',
   'ContextMenu',
   'ListType',
   'Stylist',
   'Linker',
   'SuperClean',
   'TableOperations'
  ];
  
         // THIS BIT OF JAVASCRIPT LOADS THE PLUGINS, NO TOUCHING  :)
         if(!Xinha.loadPlugins(xinha_plugins, xinha_init)) return;


  /** STEP 3 ***************************************************************
   * We create a default configuration to be used by all the editors.
   * If you wish to configure some of the editors differently this will be
   * done in step 5.
   *
   * If you want to modify the default config you might do something like this.
   *
   *   xinha_config = new Xinha.Config();
   *   xinha_config.width  = '640px';
   *   xinha_config.height = '420px';
   *
   *************************************************************************/

   xinha_config = xinha_config ? xinha_config() : new Xinha.Config();
   
  //this is the standard toolbar, feel free to remove buttons as you like
  xinha_config.toolbar =
  [
    ["popupeditor"],
    ["separator","formatblock","fontname","fontsize","bold","italic","underline","strikethrough"],
    ["separator","forecolor","hilitecolor","textindicator"],
    ["separator","subscript","superscript"],
    ["linebreak","separator","justifyleft","justifycenter","justifyright","justifyfull"],
    ["separator","insertorderedlist","insertunorderedlist","outdent","indent"],
    ["separator","inserthorizontalrule","createlink","insertimage","inserttable"],
    ["linebreak","separator","undo","redo","selectall","print"], (Xinha.is_gecko ? [] : ["cut","copy","paste","overwrite","saveas"]),
    ["separator","killword","clearfonts","removeformat","toggleborders","splitblock","lefttoright", "righttoleft"],
    ["separator","htmlmode","showhelp","about"]
  ];

        
   // To adjust the styling inside the editor, we can load an external stylesheet like this
   // NOTE : YOU MUST GIVE AN ABSOLUTE URL
  
   xinha_config.pageStyleSheets = [ _editor_url + "examples/full_example.css" ];

  /** STEP 4 ***************************************************************
   * We first create editors for the textareas.
   *
   * You can do this in two ways, either
   *
   *   xinha_editors   = Xinha.makeEditors(xinha_editors, xinha_config, xinha_plugins);
   *
   * if you want all the editor objects to use the same set of plugins, OR;
   *
   *   xinha_editors = Xinha.makeEditors(xinha_editors, xinha_config);
   *   xinha_editors.myTextArea.registerPlugins(['Stylist']);
   *   xinha_editors.anotherOne.registerPlugins(['CSS','SuperClean']);
   *
   * if you want to use a different set of plugins for one or more of the
   * editors.
   ************************************************************************/

  xinha_editors   = Xinha.makeEditors(xinha_editors, xinha_config, xinha_plugins);

  /** STEP 5 ***************************************************************
   * If you want to change the configuration variables of any of the
   * editors,  this is the place to do that, for example you might want to
   * change the width and height of one of the editors, like this...
   *
   *   xinha_editors.myTextArea.config.width  = '640px';
   *   xinha_editors.myTextArea.config.height = '480px';
   *
   ************************************************************************/


  /** STEP 6 ***************************************************************
   * Finally we "start" the editors, this turns the textareas into
   * Xinha editors.
   ************************************************************************/

  Xinha.startEditors(xinha_editors);
}

Xinha._addEvent(window,'load', xinha_init); // this executes the xinha_init function on page load 
                                            // and does not interfere with window.onload properties set by other scripts

```


## More Page Code

You need to make sure the textarea you want to convert has the "id" set, such as

```
#!text/html
<textarea id="newbiearea1" name="newbiearea1" rows="10" cols="50" style="width: 100%"></textarea>
```

it can be the same as the name - just make sure there is only one thing on the page with that ID though!

Now in the code you pasted into your "my_config.js" file (or in the <head></head> if you did it that way) you need to edit the bit labelled "Step 1" which lists what editors need to be converted.

In the example it lists two: 'myTextArea' and 'anotherOne' - you will need to change 'myTextArea' to whatever you set the ID of your textarea to - in this example we set it to 'newbiearea1'('''remember here that these values are comma seperated BUT there is no comma after the last value'''), so your code should look like this:

```

      xinha_editors = xinha_editors ? xinha_editors :
      [
        'newbiearea1'
      ];
```

## Thats It!

Your X-Area will now appear when the page has finished loading.

You can now, if you want to, go on with configuring the editor. You can find a [list of available options](Documentation/ConfigVariablesList.html) here.

Remember if you encounter any problems, don't hesitate to ask  [http://xinha.gogo.co.nz/punbb/viewtopic.php?pid=255#p255 on the forum] and we will clear it up and  do our best to make sure no-one else runs into the same thing!

