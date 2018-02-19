<?php require_once('require-password.php'); ?>
<?php 
  switch(@$_REQUEST['DocType'])
  {
    
    case 'quirks':
      break;
      
   case 'almost':
      echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">';
      break;
    
    case 'standards':
    default:
      echo '<!DOCTYPE html>';
      break;
      
  }
?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>

  <!--------------------------------------:noTabs=true:tabSize=2:indentSize=2:--
    --  Xinha example usage.  This file shows how a developer might make use of
    --  Xinha, it forms the primary example file for the entire Xinha project.
    --  This file can be copied and used as a template for development by the
    --  end developer who should simply removed the area indicated at the bottom
    --  of the file to remove the auto-example-generating code and allow for the
    --  use of the file as a boilerplate.
    --
    --  $HeadURL: http://svn.xinha.org/trunk/examples/testbed.html $
    --  $LastChangedDate: 2009-11-08 17:36:46 +1300 (Sun, 08 Nov 2009) $
    --  $LastChangedRevision: 1197 $
    --  $LastChangedBy: gogo $
    --------------------------------------------------------------------------->

  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Example of Xinha</title>
  <link rel="stylesheet" href="files/full_example.css" />

  <script type="text/javascript">
    // You must set _editor_url to the URL (including trailing slash) where
    // where xinha is installed, it's highly recommended to use an absolute URL
    //  eg: _editor_url = "/path/to/xinha/";
    // You may try a relative URL html if you wish
    //  eg: _editor_url = "../";
    // in this example we do a little regular expression to find the absolute path.
    _editor_url  = document.location.href.replace(/examples\/.*/, '')
    _editor_lang = "en";      // And the language we need to use in the editor.    
    _editor_skin = 'blue-look';
    
  </script>

  <!-- Load up the actual editor core -->
  <script type="text/javascript" src="../XinhaCore.js"></script>

  <script type="text/javascript">
    xinha_editors = null;
    xinha_init    = null;
    xinha_config  = null;
    xinha_plugins = null;

    // This contains the names of textareas we will make into Xinha editors
    xinha_init = xinha_init ? xinha_init : function()
    {
      /** STEP 1 ***************************************************************
       * First, what are the plugins you will be using in the editors on this
       * page.  List all the plugins you will need, even if not all the editors
       * will use all the plugins.
       ************************************************************************/

      xinha_plugins = xinha_plugins ? xinha_plugins :
      [
        'MootoolsFileManager','Linker', 'TableOperations', 'ListOperations', 'ContextMenu', 'WebKitResize', 'FancySelects'
      ];
             // THIS BIT OF JAVASCRIPT LOADS THE PLUGINS, NO TOUCHING  :)
             if(!Xinha.loadPlugins(xinha_plugins, xinha_init)) return;

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
       *   xinha_config = new Xinha.Config();
       *   xinha_config.width  = 640;
       *   xinha_config.height = 420;
       *
       *************************************************************************/

       xinha_config = xinha_config ? xinha_config : new Xinha.Config();
      // xinha_config.fullPage = true;
       with (xinha_config.MootoolsFileManager)
        { 
          <?php 
            require_once('../contrib/php-xinha.php');
            xinha_pass_to_php_backend
            (       
              array
              (
                'images_dir' => getcwd() . '/images',
                'images_url' => preg_replace('/\/examples.*/', '', $_SERVER['REQUEST_URI']) . '/examples/images',
                'images_allow_upload' => true,
                'images_allow_delete' => true,
                'images_allow_download' => true,
                'images_use_hspace_vspace' => false,
                
                'files_dir' => getcwd() . '/images',
                'files_url' => preg_replace('/\/examples.*/', '', $_SERVER['REQUEST_URI']) . '/examples/images',
                'files_allow_upload' => true,
                'max_files_upload_size' => '4M',
              )
            )
          ?>
        }
        
       with (xinha_config.Linker)
        { 
          <?php 
            require_once('../contrib/php-xinha.php');
            xinha_pass_to_php_backend
            (       
              array
              (
                'dir' => getcwd(),
                'url' => '/examples',                
              )
            )
          ?>
        } 
      /** STEP 3 ***************************************************************
       * We first create editors for the textareas.
       *
       * You can do this in two ways, either
       *
       *   xinha_editors   = Xinha.makeEditors(xinha_editors, xinha_config, xinha_plugins);
       *
       * if you want all the editor objects to use the same set of plugins, OR;
       *
       *   xinha_editors = Xinha.makeEditors(xinha_editors, xinha_config);
       *   xinha_editors['myTextArea'].registerPlugins(['Stylist']);
       *   xinha_editors['anotherOne'].registerPlugins(['CSS','SuperClean']);
       *
       * if you want to use a different set of plugins for one or more of the
       * editors.
       ************************************************************************/

      xinha_editors   = Xinha.makeEditors(xinha_editors, xinha_config, xinha_plugins);

      /** STEP 4 ***************************************************************
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

      Xinha.startEditors(xinha_editors);
      window.onload = null;
    }

    window.onload   = xinha_init;
  </script>
</head>

<body>
  <h1> Demonstration of MootoolsFileManager with Xinha integration </h1>
  <p>  Click into the WYSIWYG area and then click the insert image button in the tool bar. </p>
  <p>  Highlight some text and click the insert file link button (folder with a link on it).</p>
  <p>  This demo also includes the Linker plugin (for creating normal links). </p>
  
  <form action="javascript:void(0);" id="editors_here" onsubmit="alert(this.myTextArea.value);">
     <div>
    <textarea id="myTextArea" name="myTextArea" style="width:100%;height:320px;">
&lt;p&gt;Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
Aliquam et tellus vitae justo varius placerat. Suspendisse iaculis
velit semper dolor. Donec gravida tincidunt mi. Curabitur tristique
ante elementum turpis. Aliquam nisl. Nulla posuere neque non
tellus. Morbi vel nibh. Cum sociis natoque penatibus et magnis dis
parturient montes, nascetur ridiculus mus. Nam nec wisi. In wisi.
Curabitur pharetra bibendum lectus.&lt;/p&gt;
</textarea>
    <input type="submit" /> <input type="reset" />
    </div>
  </form>

  <ul>
    <li><a href="<?php echo basename(__FILE__) ?>?DocType=standards">Test Standards Mode</a></li>
    <li><a href="<?php echo basename(__FILE__) ?>?DocType=almost">Test Almost Standards Mode</a></li>
    <li><a href="<?php echo basename(__FILE__) ?>?DocType=quirks">Test Quirks Mode</a></li>
  </ul>
  
  <!-- This script is used to show the rendering mode (Quirks, Standards, Almost Standards) --> 
  <script type="text/javascript" src="render-mode-developer-help.js"></script>
</body>
</html>
