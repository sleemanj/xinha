  /*--------------------------------------:noTabs=true:tabSize=2:indentSize=2:--
    --  Xinha (is not htmlArea) - http://xinha.gogo.co.nz/
    --
    --  Use of Xinha is granted by the terms of the htmlArea License (based on
    --  BSD license)  please read license.txt in this package for details.
    --
    --  Xinha was originally based on work by Mihai Bazon which is:
    --      Copyright (c) 2003-2004 dynarch.com.
    --      Copyright (c) 2002-2003 interactivetools.com, inc.
    --      This copyright notice MUST stay intact for use.
    --
    --  This is the Xinha standard implementation of an image insertion plugin
    --
    --  The file is loaded by the Xinha Core when no alternative method (plugin) is loaded.
    --
    --
    --  $HeadURL$
    --  $LastChangedDate$
    --  $LastChangedRevision$
    --  $LastChangedBy$
    --------------------------------------------------------------------------*/
  
InsertImage._pluginInfo = {
  name          : "InsertImage",
  origin        : "Xinha Core",
  version       : "$LastChangedRevision$".replace(/^[^:]*: (.*) \$$/, '$1'),
  developer     : "The Xinha Core Developer Team",
  developer_url : "$HeadURL$".replace(/^[^:]*: (.*) \$$/, '$1'),
  sponsor       : "",
  sponsor_url   : "",
  license       : "htmlArea"
};

function InsertImage(editor) {
	this.editor = editor;
	var cfg = editor.config;
	var self = this;

   editor.config.btnList.insertimage[3] = function() { self.show(); }
}

InsertImage.prototype._lc = function(string) {
	return Xinha._lc(string, 'Xinha');
};

InsertImage.prototype.onGenerateOnce = function()
{
	this.prepareDialog();
	this.loadScripts();
};

InsertImage.prototype.loadScripts = function()
{
  var self = this;
  if(!this.methodsReady)
	{
		Xinha._getback(_editor_url + 'modules/InsertImage/pluginMethods.js', function(getback) { eval(getback); self.methodsReady = true; });
		return;
	}
};

InsertImage.prototype.onUpdateToolbar = function()
{ 
  if (!(this.dialogReady && this.methodsReady))
	{
	  this.editor._toolbarObjects.insertimage.state("enabled", false);
	}
};

InsertImage.prototype.prepareDialog = function()
{
	var self = this;
	var editor = this.editor;

	if(!this.html) // retrieve the raw dialog contents
	{
		Xinha._getback(_editor_url + 'modules/InsertImage/dialog.html', function(getback) { self.html = getback; self.prepareDialog(); });
		return;
	}

	// Now we have everything we need, so we can build the dialog.
		
	var dialog = this.dialog = new Xinha.Dialog(editor, this.html, 'Xinha',{width:410})
	// Connect the OK and Cancel buttons
	dialog.getElementById('ok').onclick = function() {self.apply();}

	dialog.getElementById('cancel').onclick = function() { self.dialog.hide()};

	dialog.getElementById('preview').onclick = function() { 
	  var f_url = dialog.getElementById("f_url");
	  var url = f_url.value;
	  var base = dialog.getElementById("f_base").value;
	  if (!url) {
	    alert(dialog._lc("You must enter the URL"));
	    f_url.focus();
	    return false;
	  }
	  dialog.getElementById('ipreview').src = Xinha._resolveRelativeUrl(base, url);
	  return false;
	}
	this.dialog.onresize = function ()
	{
		this.getElementById("ipreview").style.height = 
		parseInt(this.height,10) 
		- this.getElementById('h1').offsetHeight 
		- this.getElementById('buttons').offsetHeight
		- this.getElementById('inputs').offsetHeight 
		- parseInt(this.rootElem.style.paddingBottom,10) // we have a padding at the bottom, gotta take this into acount
		+ 'px'; // don't forget this ;)
		
		this.getElementById("ipreview").style.width =(this.width - 2) + 'px'; // and the width

	}
	this.dialogReady = true;
};
