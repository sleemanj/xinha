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
    --  $HeadURL: http://svn.xinha.python-hosting.com/trunk/modules/InsertTable/insert_image.js $
    --  $LastChangedDate: 2007-02-13 13:54:39 +0100 (Di, 13 Feb 2007) $
    --  $LastChangedRevision: 733 $
    --  $LastChangedBy: htanaka $
    --------------------------------------------------------------------------*/
  
InsertTable._pluginInfo = {
  name          : "InsertTable",
  origin        : "Xinha Core",
  version       : "$LastChangedRevision: 733 $".replace(/^[^:]*: (.*) \$$/, '$1'),
  developer     : "The Xinha Core Developer Team",
  developer_url : "$HeadURL: http://svn.xinha.python-hosting.com/trunk/modules/InsertTable/insert_image.js $".replace(/^[^:]*: (.*) \$$/, '$1'),
  sponsor       : "",
  sponsor_url   : "",
  license       : "htmlArea"
};

function InsertTable(editor) {
	this.editor = editor;
	var cfg = editor.config;
	var self = this;

   editor.config.btnList.inserttable[3] = function() { self.show(); }
}

InsertTable.prototype._lc = function(string) {
	return Xinha._lc(string, 'Xinha');
};


InsertTable.prototype.onGenerateOnce = function()
{
	this.prepareDialog();
	this.loadScripts();
};

InsertTable.prototype.loadScripts = function()
{
  var self = this;
  if(!this.methodsReady)
	{
		Xinha._getback(_editor_url + 'modules/InsertTable/pluginMethods.js', function(getback) { eval(getback); self.methodsReady = true; });
		return;
	}
};

InsertTable.prototype.onUpdateToolbar = function()
{ 
  if (!(this.dialogReady && this.methodsReady))
	{
	  this.editor._toolbarObjects.inserttable.state("enabled", false);
	}
};

InsertTable.prototype.prepareDialog = function()
{
	var self = this;
	var editor = this.editor;

	if(!this.html) // retrieve the raw dialog contents
	{
		Xinha._getback(_editor_url + 'modules/InsertTable/dialog.html', function(getback) { self.html = getback; self.prepareDialog(); });
		return;
	}

	// Now we have everything we need, so we can build the dialog.
		
	var dialog = this.dialog = new Xinha.Dialog(editor, this.html, 'Xinha',{width:400})
	// Connect the OK and Cancel buttons
	dialog.getElementById('ok').onclick = function() {self.apply();}
	dialog.getElementById('cancel').onclick = function() { self.dialog.hide()};
  
	this.borderColorPicker = new Xinha.colorPicker.InputBinding(dialog.getElementById('border_color'));

	this.dialog.onresize = function ()
	{
		this.getElementById("layout_fieldset").style.width =(this.width / 2) + 50 + 'px';
    this.getElementById("spacing_fieldset").style.width =(this.width / 2) - 120 + 'px'; 
	}

	this.dialogReady = true;
};
