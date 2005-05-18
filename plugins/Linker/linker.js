/** htmlArea - James' Fork - Linker Plugin **/

// tabs: 3

/**
* @fileoverview  The Linker plugin
*
* This plugin implements a client side tree view of server side filesystem.
*
* @package Xinha
* @subpackage linker
* @author James Sleeman
* @author Yermo Lamers http://www.formvista.com/contact.html (unified backend modifications)
*/

/**
* linker plugin info for about box.
*/

Linker._pluginInfo =
{
  name     : "Linker",
  version  : "1.0",
  developer: "James Sleeman",
  developer_url: "http://www.gogo.co.nz/",
  c_owner      : "Gogo Internet Services",
  license      : "htmlArea",
  sponsor      : "Gogo Internet Services",
  sponsor_url  : "http://www.gogo.co.nz/"
};

/**
* dtree style sheet
*/

HTMLArea.loadStyle('dTree/dtree.css', 'Linker');

/**
* linker configuration
*/

HTMLArea.Config.prototype.Linker =
{
	'backend' : _editor_backend + ( _editor_backend.match(/.*\?.*/) ? "&" : "?" ) + '__plugin=Linker&',
  'files' : null
}

// ------------------------------------------------------------------------

/**
* Inline Dialog for Linker
*/

Linker.Dialog_dTrees = [ ];

// ------------------------------------------------------------------------

/**
* @class Linker
*
* Linker constructor 
*/

function Linker(editor, args)
	{

  this.editor  = editor;
  this.lConfig = editor.config.Linker;

	// [STRIP
	// create a ddt debug trace object. There may be multiple editors on 
	// the page each with a Linker .. to distinguish which instance
	// is generating the message we tack on the name of the textarea.

	this.ddt = new DDT( editor._textArea + ":Linker Plugin" );

	// uncomment to turn on debugging messages.
 
	this.ddt._ddtOn();

	this.ddt._ddt( "linker.js","81", "Linker(): constructor" );

	// STRIP]

  var linker = this;

	// if there is already a createLink button override it's definition.

  if (editor.config.btnList.createlink)
	  {
    editor.config.btnList.createlink[3]
      =  function(e, objname, obj) 
						{ 
						linker._createLink(linker._getSelectedAnchor()); 
						};
  	}
  else
	  {
    editor.config.registerButton(
                                 'createlink', 'Insert/Modify Hyperlink', [_editor_url + "images/ed_buttons_main.gif",6,1], false,
                                 function(e, objname, obj) { linker._createLink(linker._getSelectedAnchor()); }
                                 );
  	}

  // See if we can find 'createlink'
  var t = editor.config.toolbar;
  var done = false;

  for(var i = 0; i < t.length && !done; i++)
	  {
    for(var x = 0; x < t[i].length && !done; x++)
  	  {
      if(t[i][x] == 'createlink')
    	  {
        done = true;
      	}
	    }
	  }

  if ( !done )
  	{
    t[t.length-1].push('createlink');
	  }

	}	// end of Linker Constructor.

// ------------------------------------------------------------------------

/**
* localization
*/

Linker.prototype._lc = function(string)
	{

	this.ddt._ddt( "linker.js","136", "_lc(): top with string '" + string + "'" );

  return HTMLArea._lc(string, 'Linker');
	}

// ------------------------------------------------------------------------

/**
* _createLink()
*/

Linker.prototype._createLink = function(a)
	{

  if(!a && this.editor._selectionEmpty(this.editor._getSelection()))
	  {       
    alert(this._lc("You must select some text before making a new link."));
    return false;
	  }

	this.ddt._ddt( "linker.js","156", "_createLink(): top" );

	// for use in populating the dialog pane.

  var inputs =
	  {
    type:     'url',
    href:     'http://www.example.com/',
    target:   '',
    p_width:  '',
    p_height: '',
    p_options: ['menubar=no','toolbar=yes','location=no','status=no','scrollbars=yes','resizeable=yes'],
    to:       'alice@example.com',
    subject:  '',
    body:     ''
	  }

  if (a && a.tagName.toLowerCase() == 'a')
  	{

		// m is an array of matches here. Email address followed by ?

    var m = a.href.match(/^mailto:(.*@[^?&]*)(\?(.*))?$/);

    if (m)
    	{
      // it's a Mailto link

      inputs.type = 'mailto';

      inputs.to = m[1];

			this.ddt._ddt( "linker.js","188", "_createLink(): m[1] is '" + m[1] + "' m[3] is '" + m[3] + "'" );

      if (m[3])
	      {
        var args  = m[3].split('&');
        for(var x = 0; x<args.length; x++)
  	      {
          var j = args[x].match(/(subject|body)=(.*)/);
          if(j)
    	      {
            inputs[j[1]] = decodeURIComponent(j[2]);
      	    }
        	}
	      }
  	  }
    else
    	{

      if (a.getAttribute('onclick'))
	      {

				this.ddt._ddt( "linker.js","209", "_createLink(): link is a popup window style link" );

        var m = a.getAttribute('onclick').match(/window\.open\(\s*this\.href\s*,\s*'([a-z0-9_]*)'\s*,\s*'([a-z0-9_=,]*)'\s*\)/i);

        // Popup Window

        inputs.href   = a.href ? a.href : '';
        inputs.target = 'popup';
        inputs.p_name = m[1];
        inputs.p_options = [ ];

        var args = m[2].split(',');

				this.ddt._ddt( "linker.js","222", "_createLink(): m[1] is '" + m[1] + "' m[2] is '" + m[2] + "'" );

        for(var x = 0; x < args.length; x++)
  	      {
	        var i = args[x].match(/(width|height)=([0-9]+)/);
          if(i)
        	  {
    	      inputs['p_' + i[1]] = parseInt(i[2]);
      	    }
          else
          	{
            inputs.p_options.push(args[x]);
          	}
        	}
      	}
      else
      	{
        // Normal link

				this.ddt._ddt( "linker.js","241", "_createLink(): it's a normal link" );

				// we're loading a link back into the dialog. There's a good chance, if it's
				// a local link that it contains a fully qualified URL (including http://host/)
				//
				// For display in the dialog, remove the host and protocol heading. 
				//
				// If a user views the source (in FireFox) they will see the fully qualified
				// links, however there get rewritten before submit.

				if ( a.hostname == this.editor._doc.location.hostname )
					{
					var someString = new String( a.href );
					inputs.href = someString.replace(/.*?\/\/.*?(\/.*)$/, "$1");

					this.ddt._ddt( "linker.js","256", "_createLink(): local link modified to '" + inputs.href + "'" );
			 		}
				else
					{

					// fix MSIE adding http://null/ ...

					var someString = new String( a.href );
	        inputs.href   = someString.replace(/https?:\/\/null\//g, "/");

					this.ddt._ddt( "linker.js","266", "_createLink(): MSIE hack link modified to '" + inputs.href + "'" );

					}

        inputs.target = a.target;

      	}
    	}

  	}	// end of if a was an "a href" object

	// kludge to pass ourselves into the closure below.

  var linker = this;

  // If we are not editing a link, then we need to insert links now using execCommand
  // because for some reason IE is losing the selection between now and when doOK is
  // complete.  I guess because we are defocusing the iframe when we click stuff in the
  // linker dialog.
	//
	// NOTE that this.a = a means that linker.a == a. 

  this.a = a; // Why doesn't a get into the closure below, but if I set it as a property then it's fine?

	// this function gets invoked when the ok button is clicked in the panel.
	// Note that in-line function definitions like this are called "closures" that
	// freeze the state of all variables that were around when the function is defined.
	// This is why the function below, which will be called much later, will have
	// the linker variable defined above ... 

  var doOK = function()
	  {

		linker.ddt._ddt( "linker.js","299", "doOK(): top with link '" + ( linker.a ? linker.a : "none" ) + "'" );

    //if(linker.a) alert(linker.a.tagName);

    var a = linker.a;

    var values = linker._dialog.hide();

		linker.ddt._ddt( "linker.js","307", "doOK(): values.type is '" + values.type + "'" );

    var atr =
    	{
      href: '',
      target:'',
      title:'',
      onclick:''
	    }

		if (values.type == 'url')
  		{

			linker.ddt._ddt( "linker.js","320", "doOK(): type is a url" );

			if(values.href)
    		{

				linker.ddt._ddt( "linker.js","325", "doOK(): values.href is '" + values.href + "'" );

				atr.href = values.href;
				atr.target = values.target;

				if (values.target == 'popup')
					{

					linker.ddt._ddt( "linker.js","333", "doOK(): target is a popup" );

					if (values.p_width)
						{
						values.p_options.push('width=' + values.p_width);
						}

					if(values.p_height)
						{
    	      values.p_options.push('height=' + values.p_height);
						}

					atr.onclick = 'try{if(document.designMode && document.designMode == \'on\') return false;}catch(e){} window.open(this.href, \'' + (values.p_name.replace(/[^a-z0-9_]/i, '_')) + '\', \'' + values.p_options.join(',') + '\');return false;';
	
					}

				}	// end of if values.href.
			}
    else	// it's not a url.
	    {

      if (values.to)
  	    {

				linker.ddt._ddt( "linker.js","357", "doOK(): it's a mailto with '" + values.to + "'" );

        atr.href = 'mailto:' + values.to + '?';
        if (values.subject) atr.href += 'subject=' + encodeURIComponent(values.subject);
        if (values.body)    atr.href += (values.subject ? '&' : '') + 'body=' + encodeURIComponent(values.body);
    	  }
	    }

    if (a && a.tagName.toLowerCase() == 'a')
	    {

      if(!atr.href)
      	{
        if(confirm(linker._dialog._lc('Are you sure you wish to remove this link?')))
        	{
          var p = a.parentNode;
          while(a.hasChildNodes())
          	{
            p.insertBefore(a.removeChild(a.childNodes[0]), a);
	          }
          p.removeChild(a);
  	      }
    	  }

      // Update the link

      for(var i in atr)
	      {
				linker.ddt._ddt( "linker.js","385", "doOK(): attribute '" + i + "' == '" + atr[i] + "'" );
        a.setAttribute(i, atr[i]);
  	    }
	    }
    else
  	  {
      if(!atr.href) return true;

      // Insert a link, we let the browser do this, we figure it knows best
			//
			// YmL: Not sure why but we're inserting a unique link (generated) then 
			// we search for the link below and update it's parameters. Not sure why the
			// original author didn't just insert the link directly.

      var tmp = HTMLArea.uniq('http://www.example.com/Link');

			linker.ddt._ddt( "linker.js","401", "doOK(): else case with tmp '" + tmp + "'" );

			linker.editor._doc.execCommand('createlink', false, tmp);

      // Fix them up

      var anchors = linker.editor._doc.getElementsByTagName('a');
      for(var i = 0; i < anchors.length; i++)
      	{
        var a = anchors[i];

				// have we found the temporary link we made above?

        if(a.href == tmp)
        	{

					// copy over the attributes

					linker.ddt._ddt( "linker.js","419", "doOK(): found a '" + a + "'" );

          for(var i in atr)
          	{
            a.setAttribute(i, atr[i]);
						linker.ddt._ddt( "linker.js","424", "doOK(): attribute '" + i + "' == '" + atr[i] + "' on a '" + a + "'" );
	          }

					// at one point we tried fixing up the links in FireFox to turn them into
					// absolute URLs right here (instead of fully qualified ) but on view source
					// they would get changed back to fully qualified. This is because
					// HTMLArea.fixRelativeLinks() gets called at that point.
					//
					// We chop off the protocol and host before we put the link into the dialog.  
					// (see upper section of _createLink())
					//
					// Also the links get modified onSubmit to remove the absolute pathnames.
					// (see htmlarea.js)

  	      }  // end of if a href == tmp

    	  }  // end of for loop

	    }  // end of else

		linker.ddt._ddt( "linker.js","444", "doOK(): bottom" );

	 	}	// end of function doOK();

	this.ddt._ddt( "linker.js","448", "_createLink(): before calling _dialog.show()" );

  this._dialog.show(inputs, doOK);

	}	// end of _createLink()

// ---------------------------------------------------------------

/**
* _getSelectedAnchor()
*/

Linker.prototype._getSelectedAnchor = function()
	{

	this.ddt._ddt( "linker.js","463", "_getSelectedAnchor(): top" );

  var sel  = this.editor._getSelection();
  var rng  = this.editor._createRange(sel);
  var a    = this.editor._activeElement(sel);

  if(a != null && a.tagName.toLowerCase() == 'a')
	  {
		this.ddt._ddt( "linker.js","471", "_getSelectedAnchor(): returning link '" + a + "'" );
    return a;
	  }
  else
  	{
    a = this.editor._getFirstAncestor(sel, 'a');
    if(a != null)
    	{
			this.ddt._ddt( "linker.js","479", "_getSelectedAnchor(): returning first ancestor '" + a + "'" );
      return a;
	    }
  	}

	this.ddt._ddt( "linker.js","484", "_getSelectedAnchor(): bottom returning null" );

  return null;

	}	// end of _getSelectedAnchor()

// ----------------------------------------------------------------------------

/**
* onGenerate(): top
*/

Linker.prototype.onGenerate = function()
	{
	this.ddt._ddt( "linker.js","498", "onGenerate(): top" );

  this._dialog = new Linker.Dialog(this);
	}

// ------------------------------------------------------------------------

/**
* Dialog() - constructor
*/

Linker.Dialog = function (linker)
	{

	linker.ddt._ddt( "linker.js","512", "Dialog(): top" );

  var  lDialog = this;
  this.Dialog_nxtid = 0;
  this.linker = linker;
  this.id = { }; // This will be filled below with a replace, nifty

  this.ready = false;
  this.files  = false;
  this.html   = false;
  this.dialog = false;

  // load the dTree script

	linker.ddt._ddt( "linker.js","526", "Dialog(): calling _prepareDialog()" );

  this._prepareDialog();
	}

// -------------------------------------------------------------------

/**
* _prepareDialog()
*/

Linker.Dialog.prototype._prepareDialog = function()
	{

  var lDialog = this;
  var linker = this.linker;

	linker.ddt._ddt( "linker.js","543", "_prepareDialog(): top" );

  // We load some stuff up in the background, recalling this function
  // when they have loaded.  This is to keep the editor responsive while
  // we prepare the dialog.

  if(typeof dTree == 'undefined')
  	{

		linker.ddt._ddt( "linker.js","552", "_prepareDialog(): dtree not loaded. Calling _loadback()" );

    HTMLArea._loadback( _editor_url + 'plugins/Linker/dTree/dtree.js',
                       function() 
											 	{

												lDialog.linker.ddt._ddt( "linker.js","558",  "_loadback(): calling _prepareDialog"  );

												lDialog._prepareDialog(); 
												}
                      );
    return;
	  }	// end of if the dTree was not loaded.

  if( this.files == false)
	  {

		linker.ddt._ddt( "linker.js","569", "_prepareDialog(): file list not loaded from backend" );

    if(linker.lConfig.backend)
	    {

			linker.ddt._ddt( "linker.js","574", "_prepareDialog(): backend defined. loading files using _getback() from '" + linker.lConfig.backend + "__function=scan'" );

			//get files from backend
			HTMLArea._getback( linker.lConfig.backend + "__function=scan",
						function(txt) 
							{

							// for some reason this linker reference is not working in this closure
							// under firefox 1.0.3.

							linker.ddt._ddt( "linker.js","581", "_getback(): got back txt '" + txt + "'"  );

							try 
								{
								eval('lDialog.files = ' + txt);
								} 
							catch(Error) 
								{
								lDialog.files = [ {url:'',title:Error.toString()} ];

								alert( "ERROR in file list return '" + txt + "'" );

								}

							lDialog._prepareDialog(); 

							});	// end of _getback() call
	    }
    else if(linker.lConfig.files != null)
	    {

			linker.ddt._ddt( "linker.js","602", "_prepareDialog(): pulling files from plugin-config" );

			//get files from plugin-config
			lDialog.files = linker.lConfig.files;
			lDialog._prepareDialog();
			}

    return;

	  } // end of if files hadn't been loaded.

  var files = this.files;

  if(this.html == false)
	  {

		linker.ddt._ddt( "linker.js","618", "_prepareDialog(): dialog html file not yet loaded" );

    HTMLArea._getback( linker.lConfig.backend + '&__function=dialog', 
				function(txt) 
					{ 
					lDialog.html = txt; 
					lDialog._prepareDialog(); 
					});

    return;
	  }

  var html = this.html;

	linker.ddt._ddt( "linker.js","634", "_prepareDialog(): to dialog html '" + html + "'" );

  // Now we have everything we need, so we can build the dialog.

	linker.ddt._ddt( "linker.js","634", "_prepareDialog(): creating Dialog object" );

  var dialog = this.dialog = new HTMLArea.Dialog(linker.editor, this.html, 'Linker');
  var dTreeName = HTMLArea.uniq('dTree_');

	linker.ddt._ddt( "linker.js","639", "_prepareDialog(): building dTree" );

  this.dTree = new dTree(dTreeName, _editor_url + 'plugins/Linker/dTree/');
  eval(dTreeName + ' = this.dTree');

	// add the root node of the tree holding the name of the site.

  this.dTree.add(this.Dialog_nxtid++, -1, document.location.host, null, document.location.host);
  this.makeNodes(files, 0);

  // Put it in
  var ddTree = this.dialog.getElementById('dTree');

  //ddTree.innerHTML = this.dTree.toString();

  ddTree.innerHTML = '';
  ddTree.style.position = 'absolute';
  ddTree.style.left = 1 + 'px';
  ddTree.style.top =  0 + 'px';
  ddTree.style.overflow = 'auto';
  this.ddTree = ddTree;
  this.dTree._linker_premade = this.dTree.toString();

	// to see the HTML of the generated tree uncomment the following.
	//	
	// linker.ddt._ddt( "linker.js","664", "_prepareDialog(): dTree string is '" + this.dTree.toString().replace( /[<]/g, '&lt;' ).replace( /[>]/g, '&gt;' ) + "'" );

  var options = this.dialog.getElementById('options');
  options.style.position = 'absolute';
  options.style.top      = 0   + 'px';
  options.style.right    = 0   + 'px';
  options.style.width    = 320 + 'px';
  options.style.overflow = 'auto';

  // Hookup the resizer
  this.dialog.onresize = function()
    {
		options.style.height = ddTree.style.height = (dialog.height - dialog.getElementById('h1').offsetHeight) + 'px';
		ddTree.style.width  = (dialog.width  - 322 ) + 'px';
    }

  this.ready = true;

	}	// end of _prepareDialog()

// -----------------------------------------------------------------------------

/**
* makeNodes()
*/

Linker.Dialog.prototype.makeNodes = function(files, parent)
	{

  var linker = this.linker;

	linker.ddt._ddt( "linker.js","695", "makeNodes(): top" );

  for(var i = 0; i < files.length; i++)
	  {

		// either it's a leaf node (file) or an array (subdirectory)

    if(typeof files[i] == 'string')
    	{

			linker.ddt._ddt( "linker.js","705", "makeNodes(): adding node for file '" + files[i] + "'" );

      this.dTree.add(Linker.nxtid++, parent,
                     files[i].replace(/^.*\//, ''),
                     'javascript:document.getElementsByName(\'' + this.dialog.id.href + '\')[0].value=decodeURIComponent(\'' + encodeURIComponent(files[i]) + '\');document.getElementsByName(\'' + this.dialog.id.type + '\')[0].click();document.getElementsByName(\'' + this.dialog.id.href + '\')[0].focus();void(0);',
                     files[i]);



	    }
    else if(files[i].length)
  	  {

			linker.ddt._ddt( "linker.js","718", "makeNodes(): adding node for file '" + files[i][0] + "'" );

      var id = this.Dialog_nxtid++;
      this.dTree.add(id, parent, files[i][0].replace(/^.*\//, ''), null, files[i][0]);
      this.makeNodes(files[i][1], id);
    	}
    else if(typeof files[i] == 'object')
			{

			// this section handles the title: and url: style of scan.php output.

      if(files[i].children) 
				{
        var id = this.Dialog_nxtid++;
      	} 
			else 
				{
        var id = Linker.nxtid++;
      	}

			var name = files[i].url;

      if ( files[i].title) var title = files[i].title;
      else if(files[i].url) var title = files[i].url.replace(/^.*\//, '');
      else var title = "no title defined";
      if(files[i].url) var link = 'javascript:document.getElementsByName(\'' + this.dialog.id.href + '\')[0].value=decodeURIComponent(\'' + encodeURIComponent(files[i].url) + '\');document.getElementsByName(\'' + this.dialog.id.type + '\')[0].click();document.getElementsByName(\'' + this.dialog.id.href + '\')[0].focus();void(0);';
      else var link = '';

			linker.ddt._ddt( "linker.js","746", "makeNodes(): adding node id '" + id + "' parent '" + parent + "' title '" + title + "' link '" + link + "' name '" + name + "'" );
      
      this.dTree.add(id, parent, title, link, name);
      if(files[i].children) 
				{
        this.makeNodes(files[i].children, id);
      	}
    	}
  	}

	linker.ddt._ddt( "linker.js","756", "makeNodes(): bottom" );

	}	// end of makeNodes()

// --------------------------------------------------------------------

/**
* copy of linker lc 
*/

Linker.Dialog.prototype._lc = Linker.prototype._lc;

// --------------------------------------------------------------------

/**
* show()
*/

Linker.Dialog.prototype.show = function(inputs, ok, cancel)
	{

	var linker = this.linker;

	linker.ddt._ddt( "linker.js","779", "show(): top" );

	// if we are not ready pause a bit and come back. This can be confusing for
	// the end user if it takes a really long time to build the linker list. 
	//
	// FIXME: put in some kind of "please wait - building list" message.
	//
	// To avoid an endless loop situation, limit the number of times we wait.

	if ( typeof this.wait_count == 'undefined' )
		{
		this.wait_count = 1;
		}
	else
		{
		this.wait_count++;
		}

	if ( this.wait_count > 100 )
		{
		alert( "Linker plugin has waited too long for the directory listing. Please check your javascript console for possible errors" );
		return false;
		}

	// this.ready gets set in _prepareDialog() when it's finished doing it's thing.
	// Unfortunately it can take a very long time depending on the size of the
	// directory structure.

  if (!this.ready)
  	{

		linker.ddt._ddt( "linker.js","810", "show(): we are not ready. setting a 100 timeout wait count is '" + this.wait_count + "'" );

    var lDialog = this;
    window.setTimeout(
				function() 
					{
					lDialog.show(inputs,ok,cancel);
					},100);

    return;
	  }

  if(this.ddTree.innerHTML == '')
	  {
    this.ddTree.innerHTML = this.dTree._linker_premade;
	  }

  if(inputs.type=='url')
	  {
    this.dialog.getElementById('urltable').style.display = '';
    this.dialog.getElementById('mailtable').style.display = 'none';
  	}
  else
	  {
    this.dialog.getElementById('urltable').style.display = 'none';
    this.dialog.getElementById('mailtable').style.display = '';
  	}

  if(inputs.target=='popup')
	  {
    this.dialog.getElementById('popuptable').style.display = '';
  	}
  else
	  {
    this.dialog.getElementById('popuptable').style.display = 'none';
  	}

  // Connect the OK and Cancel buttons

  var dialog = this.dialog;
  var lDialog = this;
  if (ok)
  	{
    this.dialog.getElementById('ok').onclick = ok;
	  }
  else
  	{
    this.dialog.getElementById('ok').onclick = function() {lDialog.hide();};
	  }

  if(cancel)
  	{
    this.dialog.getElementById('cancel').onclick = cancel;
	  }
  else
  	{
    this.dialog.getElementById('cancel').onclick = function() { lDialog.hide()};
	  }

  // highlight the currently selected item, if one has been selected.
  // unfortunately this means we have to loop through the dTree looking
  // for a match on the target url.

  var n=0;

	linker.ddt._ddt( "linker.js","875", "show(): clearing selection" );

  this.dTree.clear_s();

  for (n; n<this.dTree.aNodes.length; n++) 
    {

		linker.ddt._ddt( "linker.js","882", "show(): checking tree node '" + this.dTree.aNodes[n].title + "' against '" + inputs.href + "'" );

		if (this.dTree.aNodes[n].title == inputs.href) 
			{
			linker.ddt._ddt( "linker.js","886", "show(): found selection at node '" + n + "'. selecting" );

			this.dTree.s( n );

			// it's possible that the sected link is in a collapsed subdirectory so open
			// the tree to the selected node.

			this.dTree.openTo( n, true, true );

			// we would like to be able to scroll to the currently selected
			// node because it may be well below the visible portion of the 
			// div. (see the id="[dTree]" in dialog.html to see where the tree
			// is displayed in the dialog.
			//
			// I've add a getNodeElement() method to dTree.js to return the <a> 
			// element of the given node. Gecko and MSIE support a scrollIntoView()
			// method that should, in theory, scroll to make the given item visible.
			//
			// However, this has to be done after the dialog is displayed so we keep 
			// the selectednode and call scrollIntoView() after the resizing.

			var selectedNode = this.dTree.getNodeElement(n);

			linker.ddt._ddt( "linker.js","909", "show(): select Node tagName is '" + selectedNode.tagName + "'" );

			}
		}

  // Show the dialog

  this.linker.editor.disableToolbar(['fullscreen','linker']);

  this.dialog.show(inputs);

  // Init the sizes

  this.dialog.onresize();

	// scrollIntoView() is supported by MSIE 4+ and Gecko. It is not, according to the
	// documentation I have, part of the DOM spec.

	if ( selectedNode )
		selectedNode.scrollIntoView();
		
	linker.ddt._ddt( "linker.js","930", "show(): bottom" );

	}	// end of show()

// -------------------------------------------------------------------

/**
* hide()
*/

Linker.Dialog.prototype.hide = function()
	{

	var linker = this.linker;

	linker.ddt._ddt( "linker.js","945", "hide(): top" );

  this.linker.editor.enableToolbar();
  return this.dialog.hide();

	}	// end of hide()

// -----------------------------------------------------------

/**
* scrollToElement()
*
* @todo THIS DOES NOT WORK. IT'S RIPPED OFF FROM htmlarea.js AND IS SETUP FOR A WINDOW
* 
* this.ddtTree is a div that contains a tree. How to scroll to the right position in the
* tree since the <div> tag doesn't seem to have an analog to the 'scrollTo()' method??
*/

Linker.Dialog.prototype.scrollToElement = function(e)
  {

	var linker = this.linker;

  linker.ddt._ddt( "linker.js","968", "scrollToElement(): top" );

  if(HTMLArea.is_gecko)
    {
    var top  = 0;
    var left = 0;

    while(e)
      {
      top  += e.offsetTop;
      left += e.offsetLeft;
      if(e.offsetParent && e.offsetParent.tagName.toLowerCase() != 'body')
        {
        e = e.offsetParent;
        }
      else
        {
        e = null;
        }
      }

    // this._iframe.contentWindow.scrollTo(left, top);

	  //linker.ddt._ddtDumpObject( "linker.js","6740", "scrollToElement(): before calling scrollTo top '" + top + "' left '" + left + "'", this.ddTree );

    linker.ddt._ddt( "linker.js","993", "Type of ddtTree is '" + this.ddTree.tagName + "'" );

    }
  } // end of scrollToElement()

// END

