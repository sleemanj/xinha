// Paste Plain Text plugin for Xinha

// Distributed under the same terms as Xinha itself.
// This notice MUST stay intact for use (see license.txt).

function CreateLink(editor) {
	this.editor = editor;
	var cfg = editor.config;
	var self = this;

   editor.config.btnList.createlink[3] = function() { self.show(self._getSelectedAnchor()); }
}

CreateLink._pluginInfo = {
  name          : "CreateLink",
  origin        : "Xinha Core",
  version       : "$LastChangedRevision: 694 $".replace(/^[^:]*: (.*) \$$/, '$1'),
  developer     : "The Xinha Core Developer Team",
  developer_url : "$HeadURL: http://svn.xinha.python-hosting.com/trunk/modules/CreateLink/link.js $".replace(/^[^:]*: (.*) \$$/, '$1'),
  sponsor       : "",
  sponsor_url   : "",
  license       : "htmlArea"
};

CreateLink.prototype._lc = function(string) {
	return Xinha._lc(string, 'Xinha');
};


CreateLink.prototype.onGenerateOnce = function()
{
	this.prepareDialog();
	this.loadScripts();
};

CreateLink.prototype.loadScripts = function()
{
  var self = this;
  if(!this.methodsReady)
	{
		Xinha._getback(_editor_url + 'modules/CreateLink/pluginMethods.js', function(getback) { eval(getback); self.methodsReady = true; });
		return;
	}
};

CreateLink.prototype.onUpdateToolbar = function()
{ 
  if (!(this.dialogReady && this.methodsReady))
	{
	  this.editor._toolbarObjects.createlink.state("enabled", false);
	}
};

CreateLink.prototype.prepareDialog = function()
{
	var self = this;
	var editor = this.editor;

	if(!this.html) // retrieve the raw dialog contents
	{
		Xinha._getback(_editor_url + 'modules/CreateLink/dialog.html', function(getback) { self.html = getback; self.prepareDialog(); });
		return;
	}

	// Now we have everything we need, so we can build the dialog.
		
	var dialog = this.dialog = new Xinha.Dialog(editor, this.html, 'Xinha',{width:400})
	// Connect the OK and Cancel buttons
	dialog.getElementById('ok').onclick = function() {self.apply();}

	dialog.getElementById('cancel').onclick = function() { self.dialog.hide()};

	if (!editor.config.makeLinkShowsTarget)
	{
		dialog.getElementById("f_target_label").style.visibility = "hidden";
		dialog.getElementById("f_target").style.visibility = "hidden";
		dialog.getElementById("f_other_target").style.visibility = "hidden";
	}

	dialog.getElementById('f_target').onchange= function() 
	{
		var f = dialog.getElementById("f_other_target");
		if (this.value == "_other") {
			f.style.visibility = "visible";
			f.select();
			f.focus();
		} else f.style.visibility = "hidden";
	};

	
	this.dialogReady = true;
};
