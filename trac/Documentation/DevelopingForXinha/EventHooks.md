# Event Hooks
* TOC
{:toc}


There are a bunch of event hooks that can be used from within plugins or the config (as of 0.96) that can be used to perform some action at specific events that happen in the editor.

If you return true from your function, no further event listeners are executed.
## Adding a an event listener to a plugin

```
myPlugin.prototype.onKeyPress = function ( event )
{
  // do something
  return false;
}
```

## Adding an event listener to a the config object

```
xinha_config.Events.onKeyPress = function ( event )
{
  // do something
  return false;
}
```

## The Meaning of "this"
In a plugin, ''this'' refers to the plugin instance; in the config object ''this'' refers to the respective Xinha instance

## Available hooks
TODO: make this into a real wiki page

```

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
	return false;
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
{console.log(this);
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
```

