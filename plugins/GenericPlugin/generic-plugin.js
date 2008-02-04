/*------------------------------------------*\
 GenericPlugin for Xinha
 _______________________
     
 Democase for plugin event handlers
\*------------------------------------------*/

GenericPlugin._pluginInfo = {
  name          : "GenericPlugin",
  version       : "1.0",
  developer     : "Xinha Developer Team",
  developer_url : "http://xinha.org",
  sponsor       : "",
  sponsor_url   : "",
  license       : "htmlArea"
}
function GenericPlugin(editor)
{
	this.editor = editor;
}

GenericPlugin.prototype.onGenerate = function ()
{

}
GenericPlugin.prototype.onGenerateOnce = function ()
{

}
GenericPlugin.prototype.inwardHtml = function(html)
{
	return html;
}
GenericPlugin.prototype.outwardHtml = function(html)
{
	return html;
}
GenericPlugin.prototype.onUpdateToolbar = function ()
{
	return false;
}

GenericPlugin.prototype.onExecCommand = function ( cmdID, UI, param )
{
	if (cmdID != 'removeformat') return false;

	var editor = this.editor;
	var sel = editor.getSelection();
	var range = editor.createRange(sel);

	var els = editor._doc.getElementsByTagName('*');
	
	var start = ( range.startContainer.nodeType == 1 ) ? range.startContainer : range.startContainer.parentNode;
	var end = ( range.endContainer.nodeType == 1 ) ? range.endContainer : range.endContainer.parentNode;
	
	function clean(node)
	{
		node.removeAttribute('style');
	}
	
	for (var i=0; i<els.length;i++)
	{
		if (els[i] == start)
		{
			console.log({el : els[i], 'cmp' : 'start'});
		} 
		else if (els[i] == end)
		{
			console.log({el : els[i], 'cmp' : 'end'});
		}
		else
		{
			clean(els[i]);
			console.log({el : els[i], 'cmp' : range.isPointInRange( els[i], 0 )});
		}
		
	}
	return true;
}

GenericPlugin.prototype.onKeyPress = function ( event )
{
	return false;
}

GenericPlugin.prototype.onMouseDown = function ( event )
{
	return false;
}

GenericPlugin.prototype.onBeforeSubmit = function ()
{
	return false;
}

GenericPlugin.prototype.onBeforeUnload = function ()
{
	return false;
}

GenericPlugin.prototype.onBeforeResize = function (width, height)
{
	return false;
}
GenericPlugin.prototype.onResize = function (width, height)
{
	return false;
}
/**
 * 
 * @param {String} action one of 'add', 'remove', 'hide', 'show', 'multi_hide', 'multi_show'
 * @param {DOMNode|Array} panel either the panel itself or an array like ['left','right','top','bottom']
 */
GenericPlugin.prototype.onPanelChange = function (action, panel)
{
	return false;
}
/**
 * 
 * @param {String} mode either 'textmode' or 'wysiwyg'
 */
GenericPlugin.prototype.onMode = function (mode)
{
	return false;
}
/**
 * 
 * @param {String} mode either 'textmode' or 'wysiwyg'
 */
GenericPlugin.prototype.onBeforeMode = function (mode)
{
	return false;
}
