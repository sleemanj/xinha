<html>
<head>

  <!--------------------------------------:noTabs=true:tabSize=2:indentSize=2:--
    --  Xinha example usage.  This file shows how a developer might make use of
    --  Xinha, it forms the primary example file for the entire Xinha project.
    --  This file can be copied and used as a template for development by the
    --  end developer who should simply removed the area indicated at the bottom
    --  of the file to remove the auto-example-generating code and allow for the
    --  use of the file as a boilerplate.
    --
	 --  This is a simplified, minimal, example without the fancy on-demand
	 --  plugin loadeer from the full_example.html example.
	 -- 
    --  $HeadURL: http://svn.xinha.python-hosting.com/branches/unified_backend/examples/full_example-body.html $
    --  $LastChangedDate: 2005-03-05 03:42:32 -0500 (Sat, 05 Mar 2005) $
    --  $LastChangedRevision: 35 $
    --  $LastChangedBy: gogo $
    --------------------------------------------------------------------------->

  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Simple Example of Xinha</title>
  <link rel="stylesheet" href="full_example.css" />

  <script type="text/javascript">
    // You must set _editor_url to the URL (including trailing slash) where
    // where xinha is installed, it's highly recommended to use an absolute URL
    //  eg: _editor_url = "/path/to/xinha/";
    // You may try a relative URL if you wish]
    //  eg: _editor_url = "../";
    // in this example we do a little regular expression to find the absolute path.
    _editor_url  = document.location.href.replace(/examples\/simple_example\.php.*/, '')
    _editor_lang = "en";      // And the language we need to use in the editor.
  </script>

  <!--  load in debug trace message class -->

  <script type="text/javascript" src="../ddt/ddt.js"></script>

  <script type="text/javascript">

  var startupDDT = new DDT( "startup" );

  // uncomment the following if you would like to trace out the 
  // startup functions. This only works in the debugging version
  // of Xinha_ub, not the runtime.

  startupDDT._ddtOn();
  </script>
  
  <!-- Load up the actual editor core -->
  <script type="text/javascript" src="../htmlarea.js"></script>

  <script type="text/javascript">

    xinha_editors = null;
    xinha_init    = null;
    xinha_config  = null;
    xinha_plugins = null;

    // This contains the names of textareas we will make into Xinha editors
	 //
	 // If xinha_init() is already defined then we copy it onto itself; this
	 // might occur if you define another xinha_init() in some other file.
	 //
	 // (see the full_example.html where this is done. In that example, there's
	 // another xinha_init defined in a full_example.js file that gets included
	 // at the end.)

   startupDDT._ddt( "simple_example.html", "71", "Setting up xinha_init()" );

    xinha_init = xinha_init ? xinha_init : function()
    {

 	   startupDDT._ddt( "simple_example.html", "76", "xinha_init called from window.onload handler for simple_example.html" );

      /** STEP 1 ***************************************************************
       * First, what are the plugins you will be using in the editors on this
       * page.  List all the plugins you will need, even if not all the editors
       * will use all the plugins.
       ************************************************************************/

		// a minmal list of plugins.

      xinha_plugins_minimal = 
      [
       'ContextMenu',
       'Stylist'
      ];

      // This loads the plugins. Note that we're using the minimal list
		// by default.

	   startupDDT._ddt( "simple_example.html", "92", "calling HTMLArea.loadplugins()" );

      if ( !HTMLArea.loadPlugins( xinha_plugins_minimal, xinha_init)) return;

      /** STEP 2 ***************************************************************
       * Now, what are the names of the textareas you will be turning into
       * editors? For this example we're only loading 1 editor.
       ************************************************************************/

      xinha_editors = xinha_editors ? xinha_editors :
      [
        'TextArea1'
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

  	    startupDDT._ddt( "simple_example.html", "119", "calling HTMLArea.Config()" );

       xinha_config = xinha_config ? xinha_config : new HTMLArea.Config();

      /** STEP 3 ***************************************************************
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

      startupDDT._ddt( "simple_example.html", "140", "calling HTMLArea.makeEditors()" );

      xinha_editors   = HTMLArea.makeEditors(xinha_editors, xinha_config, xinha_plugins_minimal);

      /** STEP 4 ***************************************************************
       * If you want to change the configuration variables of any of the
       * editors,  this is the place to do that, for example you might want to
       * change the width and height of one of the editors, like this...
       *
       *   xinha_editors.myTextArea.config.width  = 640;
       *   xinha_editors.myTextArea.config.height = 480;
       *
       ************************************************************************/

       xinha_editors.TextArea1.config.width  = 700;
       xinha_editors.TextArea1.config.height = 350;

      /** STEP 5 ***************************************************************
       * Finally we "start" the editors, this turns the textareas into
       * Xinha editors.
       ************************************************************************/

      startupDDT._ddt( "simple_example.html", "160", "calling HTMLArea.startEditors()" );

      HTMLArea.startEditors(xinha_editors);

    }  // end of xinha_init()

    // window.onload = xinha_init;

  </script>
</head>

<body onload="xinha_init()">

  <h1>Xinha Simple Example</h1>

  <p>This file demonstrates a simple integration of the Xinha editor with a minimal
  set of plugins.</p>
  <br>

  <a href="../index.html">Back to Index</a>

  <br>
  <hr>
  <br>

  <form id="editors_here">

    <textarea id="TextArea1" name="TextArea1" rows="10" cols="80" style="width:100%">
	 This is the content of TextArea1 from xinha_ub/examples/simple_example.php.<br>
	 In order to see the new debugging trace messages you will need to turn off
	 popup blockers for this site.<br>
	 These trace messages can also be turned on/off from within simple_example.html by
	 commenting out or uncomments the _ddtOn() line. The same applies to the trace
	 messages inside the HTMLArea object in htmlarea.js.
	 The version of EnterParagraphs in this editor should be largely fixed. If you notice
	 any problems please report them in the forums.
	 </textarea>

  </form>

</body>
</html>