This is the New Newbie Guide, for versions of Xinha prior 1.5, please see the OldNewbieGuide


----

* TOC
{:toc}


# Newbie Guide, or, How To Put Xinha On Your Page

Including one or more Xinha areas on your page has been made very easy, in fact for defaults it's as simple as adding one line to your `<head>` !

## One Line To Xinha

Assuming that your page contains one or more `<textarea>` that you wish to turn into Xinha areas, and you just want default options, then this is all you need.

```
  <script type="text/javascript" src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js"></script>
```

### Remember to Entize

A very common mistake people make is to put raw HTML into a textarea without encoding it.

Please read [Entize Your Data]({{ site.baseurl }}/trac/Documentation/NewbieGuide/Entize.html) for more information.

### Careful With Character Sets

In the modern world you should be using UTF-8 for everything.  But, maybe you are not.  Maybe you don't know what this means.

Please read [Character Sets in Xinha]({{ site.baseurl }}/trac/Documentation/NewbieGuide/CharacterSets.html) for more information.

### Install Xinha Locally (or Half-and-Half)

This NewbieGuide shows using Xinha from an Amazon S3 Bucket URL, but you can install Xinha locally and this is recommended for your own stability.

Please read [Installing Xinha]({{ site.baseurl }}/trac/Documentation/NewbieGuide/InstallingXinha.html) for more information.

#### Cache All The Things

Xinha's files are not going to change often, so you should ensure your server tells your browser to cache things if you are running Xinha locally in full or part.

See [Caching Xinha]({{ site.baseurl }}/trac/Documentation/NewbieGuide/Caching.html) for an example.



## Basic Options
### Convert Only Certain `<textarea>`

You muight want to be a bit more picky about which textareas get converted, some simple configuration will see to it,

```
  <script type="text/javascript" src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js">
    xinha_options =
    {
      xinha_editors:  'textarea.some-css-class'
    }
  </script>
```

now only `<textarea class="some-css-class"></textarea>` will be converted.  You can use multiple and full CSS selectors as you desire, just like you would for writing CSS rulesets.

### Set the Language and Skin

We can easily set the language and skin to your desire with some more options

```
  <script type="text/javascript" src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js">
    xinha_options =
    {
      _editor_lang:   'fr',
      _editor_skin:   'blue-look',
      xinha_editors:  'textarea.some-css-class'
    }
  </script>
```

The options for [[/browser/trunk/lang|Languages are those provided by the lang files here]] - for example for French use 'fr' - note that Languages other than English ('en', the default) may be in various states of completeness, untranslated things will revert to English, if you would like to help with translating DownloadXinha and see the READEME_TRANSLATORS.TXT file.

The options for [[/browser/trunk/skins|Skins are those here]], use the folder name as the skin name.

### Specify Some Plugins

Xinha uses a system of [wiki:Documentation/Plugins] to provide extra functionality.  The default is to use a set of those plugins which are most commonly useful, but you can also specify a list of plugins, or the set names 'minimal', 'common', and 'loaded' (which means use a whole bunch more plugins that might be less useful commonly) or a combination there-of with a simple option...


```
  <script type="text/javascript" src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js">
    xinha_options =
    {
      _editor_lang:   'fr',
      _editor_skin:   'blue-look',
      xinha_editors:  'textarea.some-css-class',
      xinha_plugins:  [ 'minimal', 'TableOperations' ]
    }
  </script>
```

here we have specified that in addition to the 'minimal' set of plugins, we also want `TableOperations` which provides more complete table editing functions.

### Specify A Stylesheet

To make Xinha a real WYSIWYG editor you should also load a stylesheet into it that will give your users the "look" of what they are typing as it would appear on the website, again it's just an option away...

```
  <script type="text/javascript" src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js">
    xinha_options =
    {
      _editor_lang:   'fr',
      _editor_skin:   'blue-look',
      xinha_editors:  'textarea.some-css-class',
      xinha_plugins:  'minimal',
      xinha_toolbar:  'supermini',
      xinha_stylesheet: '/path/to/your/styles.css'
    }
  </script>
```

### Specify A Toolbar

The toolbar (buttons and drop-down selectors) can be customised easily using the `xinha_toolbar` option, it accepts either one of the keywords `default`, `minimal`, `minimal+fonts`, `supermini` (it can also accept a toolbar structure but we will leave that for another time).

```
  <script type="text/javascript" src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js">
    xinha_options =
    {
      _editor_lang:   'fr',
      _editor_skin:   'blue-look',
      xinha_editors:  'textarea.some-css-class',
      xinha_plugins:  'minimal',
      xinha_toolbar:  'supermini'
    }
  </script>
```

Here we have specified this is going to be an extremely minimal editor indeed!


### Provide Some Configuration

[Xinha Core]({{ site.baseurl }}/trac/Documentation/NewbieGuide/ConfigurationOptions.html) and it's [Plugins]({{ site.baseurl }}/trac/Plugins.html) have lots of scope to configure them as you require, this is how you can set configuration settings in general.


```
  <script type="text/javascript" src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js">
    xinha_options =
    {
      _editor_lang:   'fr',
      _editor_skin:   'blue-look',
      xinha_editors:  'textarea.some-css-class',
      xinha_plugins:  'minimal',
      xinha_toolbar:  'supermini',
      xinha_stylesheet: '/path/to/your/styles.css',

      xinha_config:   function(xinha_config)
      {
        xinha_config.resizableEditor = true;
      }
    }
  </script>
```

here we have turned on the ability for the user to click-drag resize the editor (note that this only works well in Chrome and Safari).

## Editor-Specific Options

If you have more than one editor on a page, or you are using the same "include" to load editors on multiple pages, you might want to give different editors different option sets.

### Provide Different Configuration For A Specific Editor

There might be times when you want to give a different configuration to certain editors than to certain others, we can do that no problem...

```
  <script type="text/javascript" src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js">
    xinha_options =
    {
      _editor_lang:   'fr',
      _editor_skin:   'blue-look',
      xinha_editors:  'textarea.some-css-class',
      xinha_plugins:  'minimal',
      xinha_toolbar:  'supermini',
      xinha_stylesheet: '/path/to/your/styles.css',

      xinha_config:   function(xinha_config)
      {
        xinha_config.resizableEditor = true;
      },

      xinha_config_specific:   function(xinha_config, textarea)
      {
        if(textarea.className.match(/for-email/))
        {
          xinha_config.sevenBitClean = false;
        }
      }
    }
  </script>
```

here we have decided that any textarera with class "for-email" (which also has "some-css-class" in the first place causing it to be selected for conversion) should be configured as "sevenBitClean" (which means that only 7 bit characters are used in the output).

### Disable Some Plugins For A Specific Editor

It might be the case that you want certain editors not to have some plugins, we can sort that out...

```
  <script type="text/javascript" src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js">
    xinha_options =
    {
      _editor_lang:   'fr',
      _editor_skin:   'blue-look',
      xinha_editors:  'textarea.some-css-class',
      xinha_plugins:  ['minimal', 'TableOperations'],
      xinha_toolbar:  'supermini',
      xinha_stylesheet: '/path/to/your/styles.css',

      xinha_config:   function(xinha_config)
      {
        xinha_config.resizableEditor = true;
      },

      xinha_config_specific:   function(xinha_config, textarea)
      {
        if(textarea.className.match(/for-email/))
        {
          xinha_config.sevenBitClean = false;
        }
      },

      xinha_plugins_specific:   function(xinha_plugins, textarea)
      {
        if(textarea.className.match(/for-email/))
        {
          xinha_plugins.remove('TableOperations'); 
        }
      }
    }
  </script>
```

here we have removed `TableOperations` from the for-email editor.

### Set The Toolbar For A Specific Editor

It might be the case that you want some editor to have a differnet toolbar than others, we can do this by adjusting that editor's configuration...

```
  <script type="text/javascript" src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js">
    xinha_options =
    {
      _editor_lang:   'fr',
      _editor_skin:   'blue-look',
      xinha_editors:  'textarea.some-css-class',
      xinha_plugins:  ['minimal', 'TableOperations'],
      xinha_toolbar:  'supermini',
      xinha_stylesheet: '/path/to/your/styles.css',

      xinha_config:   function(xinha_config)
      {
        xinha_config.resizableEditor = true;
      },

      xinha_config_specific:   function(xinha_config, textarea)
      {
        if(textarea.className.match(/for-email/))
        {
          xinha_config.sevenBitClean = false;
        }

        if(textarea.className.match(/full-tools/))
        {
          xinha_config.setToolbar('default');
        }
      },

      xinha_plugins_specific:   function(xinha_plugins, textarea)
      {
        if(textarea.className.match(/for-email/))
        {
          xinha_plugins.remove('TableOperations'); 
        }
      }
    }
  </script>
```

here we have decided that the texarea with 'full-tools' class name should get the default toolbar.

## Load External (Local) Plugins

it may be that you wish to develop your own Xinha plugins and keep them separate to Xinha (or you use Xinha from a CDN), or you wish to use plugins such as [Linker]({{ site.baseurl }}/trac/Documentation/Plugins/Linker.html) and [MootoolsFileManager]({{ site.baseurl }}/trac/Documentation/Plugins/MootoolsFileManager.html) which must be run on your own webserver because they allow browsing or uploading files on your webserver.  

You can use these even if you are pulling Xinha from a CDN simply by specifying them as external plugins.   See the "Custom Plugins Example"

```
  <script src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js" type="text/javascript">
    
    xinha_options = 
    {
      xinha_plugins:  [ 
         'minimal', 

         { from: '/url/path/to/xinha-cdn/plugins', load: ['MootoolsFileManager', 'Linker'] } ,
         { from: '/url/path/to/my_custom_plugins', load: ['CustomPlugin'] }
      ],
      
      // This is where you set the other default configuration globally
      xinha_config:            function(xinha_config) 
      {
        
        // Configure the plugins as you normally would here (consult plugin documentation)
        
      }
    }

  </script>
```

This code shows loading plugins from 3 locations, first the standard 'minimal' plugins are loaded from Xinha, then the `MootoolsFileManager` and `Linker` plugins are loaded from your local server's `xinha-cdn` folder (eg, `/url/path/to/xinha-cdn/MootoolsFileManager/MootoolsFileManager.js`) and finally your own `CustomPlugin` is loaded from your local server's `my_custom_plugins` (ie, `/url/path/to/my_custom_plugins/CustomPlugin/CustomPlugin.js`)