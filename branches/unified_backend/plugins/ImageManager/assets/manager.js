/**
* @fileoverview Functions for the ImageManager, used by manager.php only	
*
* The _imgManager object must be present before this file can be included.
*
* @see manager.php
*
* @author $Author: Wei Zhuo $
* @version $Id: manager.js 26 2004-03-31 02:35:21Z Wei Zhuo $
* @package ImageManager
*
* @todo this should be turned into a class, possibly made part of ImageManager.
*/

// ----------------------------------------------------
	
/**
* Translation
*
function i18n(str) 
	{

	_imgManager.ddt._ddt( "manager.js","23", "i18n(): top with string '" + str + "'" );

	return HTMLArea._lc(str, 'ImageManager');

	};

// ----------------------------------------------------

/**
* set the alignment options
*/

function setAlign(align) 
	{

	_imgManager.ddt._ddt( "manager.js","38", "setAlign(): top with align '" + align + "'" );

	var selection = document.getElementById('f_align');

	for(var i = 0; i < selection.length; i++)
		{
		if (selection.options[i].value == align)
			{
			selection.selectedIndex = i;
			break;
			}
		}
	}  // end of setAlign()

// --------------------------------------------

/**
* initialise the form
*/

init = function () 
	{

	_imgManager.ddt._ddt( "manager.js","61", "init(): top." );

	__dlg_init();

	__dlg_translate('ImageManager');

	var uploadForm = document.getElementById('uploadForm');

	if(uploadForm) uploadForm.target = 'imgManager';

	var param = window.dialogArguments;

	if (param) 
		{
		document.getElementById("f_url").value = param["f_url"];
		document.getElementById("f_alt").value = param["f_alt"];
		document.getElementById("f_border").value = param["f_border"];
		document.getElementById("f_vert").value = param["f_vert"];
		document.getElementById("f_horiz").value = param["f_horiz"];
		document.getElementById("f_width").value = param["f_width"];
		document.getElementById("f_height").value = param["f_height"];
		setAlign(param["f_align"]);
		}

	_imgManager.ddt._ddt( "manager.js","85", "init(): setting focus" );

	document.getElementById("f_url").focus();

	}  // end of init.

// -----------------------------------------------------------------

/**
* onCancel()
*/

function onCancel() 
	{

	_imgManager.ddt._ddt( "manager.js","100", "onCancel(): top" );

	__dlg_close(null);
	return false;
	};

// ------------------------------------------------------------------

/**
* onOK()
*/

function onOK() 
	{

	_imgManager.ddt._ddt( "manager.js","115", "onOK(): top" );

	// pass data back to the calling window

	var fields = ["f_url", "f_alt", "f_align", "f_border", "f_horiz", "f_vert", "f_height", "f_width"];
	var param = new Object();

	for (var i in fields) 
		{
		var id = fields[i];
		var el = document.getElementById(id);
		if (id == "f_url" && el.value.indexOf('://') < 0 )
			{

			if ( el.value == "" )
				{
				alert( "No Image selected." );
				return( false );
				}

			param[id] = makeURL(base_url,el.value);
			}
		else
			{
			param[id] = el.value;
			}
		}

	_imgManager.ddt._ddt( "manager.js","143", "onOK(): closing dialog" );

	__dlg_close(param);
	return false;

	};  // end of onOK()

// ---------------------------------------------------

/**
* makeURL()
*
* similar to the Files::makeFile() in Files.php
*/

function makeURL(pathA, pathB) 
	{

	_imgManager.ddt._ddt( "manager.js","161", "makeURL(): pathA '" + pathA + "' pathB '" + pathB + "'" );

 	if (pathA.substring(pathA.length-1) != '/')
			pathA += '/';

	if (pathB.charAt(0) == '/');	
			pathB = pathB.substring(1);

	return pathA+pathB;

	}  // end of makeURL()

// ---------------------------------------------

/**
* updateDir()
*/

function updateDir(selection) 
	{

	var newDir = selection.options[selection.selectedIndex].value;

	_imgManager.ddt._ddt( "manager.js","184", "updateDir(): newDir is '" + newDir + "'" );

	changeDir(newDir);
	}

// ---------------------------------------------

/**
* goUpDir()
*/

function goUpDir() 
	{

	_imgManager.ddt._ddt( "manager.js","198", "goUpDir(): top" );

	var selection = document.getElementById('dirPath');
	var currentDir = selection.options[selection.selectedIndex].text;

	if(currentDir.length < 2)
			return false;

	var dirs = currentDir.split('/');
		
	var search = '';

	for(var i = 0; i < dirs.length - 2; i++)
		{
		search += dirs[i]+'/';
		}

	for(var i = 0; i < selection.length; i++)
		{
		var thisDir = selection.options[i].text;
		if(thisDir == search)
			{
			selection.selectedIndex = i;
			var newDir = selection.options[i].value;
			changeDir(newDir);
			break;
			}
		}
	}  // end of goUpDir()

// ----------------------------------------------

/**
* changeDir()
*/

function changeDir(newDir) 
	{

	_imgManager.ddt._ddt( "manager.js","237", "changeDir(): newDir is '" + newDir + "'" );

	if (typeof imgManager != 'undefined')
		{

		_imgManager.ddt._ddt( "manager.js","242", "changeDir(): imgManager is defined" );

		imgManager.changeDir(newDir);
		}
	}

// -----------------------------------------------

/**
* toggleContrains()
*/

function toggleConstrains(constrains) 
	{

	_imgManager.ddt._ddt( "manager.js","257", "toggleConstrains(): top" );

	var lockImage = document.getElementById('imgLock');
	var constrains = document.getElementById('constrain_prop');

	if(constrains.checked) 
		{
		lockImage.src = "img/locked.gif";	
		checkConstrains('width') 
		}
	else
		{
		lockImage.src = "img/unlocked.gif";	
		}
	} // end of toggleConstrains()

// ---------------------------------------------------

/**
* checkConstrains()
*/

function checkConstrains(changed) 
	{

	_imgManager.ddt._ddt( "manager.js","282", "checkConstrains(): top" );

	//alert(document.form1.constrain_prop);

	var constrains = document.getElementById('constrain_prop');
		
	if(constrains.checked) 
		{
		var obj = document.getElementById('orginal_width');
		var orginal_width = parseInt(obj.value);
		var obj = document.getElementById('orginal_height');
		var orginal_height = parseInt(obj.value);

		var widthObj = document.getElementById('f_width');
		var heightObj = document.getElementById('f_height');
			
		var width = parseInt(widthObj.value);
		var height = parseInt(heightObj.value);

		if(orginal_width > 0 && orginal_height > 0) 
			{
			if(changed == 'width' && width > 0) 
			  {
				heightObj.value = parseInt((width/orginal_width)*orginal_height);
			  }

			if(changed == 'height' && height > 0) 
			  {
				widthObj.value = parseInt((height/orginal_height)*orginal_width);
				}
			}			
		}
	} // end of checkContrains()

// --------------------------------------------------------------------

/**
* showMessage()
*/

function showMessage(newMessage) 
	{

	_imgManager.ddt._ddt( "manager.js","325", "showMessage(): top with message '" + newMessage + "'" );

	var message = document.getElementById('message');
	var messages = document.getElementById('messages');

	if (message.firstChild)
		message.removeChild(message.firstChild);

	message.appendChild(document.createTextNode(i18n(newMessage)));
		
	messages.style.display = "block";
	}

// ---------------------------------------------------------------------

/**
* addEvent()
*/

function addEvent(obj, evType, fn)
	{ 

	_imgManager.ddt._ddt( "manager.js","347", "addEvent() : top" );

	if (obj.addEventListener) 
		{ 
		obj.addEventListener(evType, fn, true); 
		return true; 
		}
	else if (obj.attachEvent) 
		{  
		var r = obj.attachEvent("on"+evType, fn);  
		return r;  
		} 
	else 
		{  
		return false; 
		} 
	}  // end of addEvent() 

// ----------------------------------------------

/**
* doUpload()
*/

function doUpload() 
	{
	_imgManager.ddt._ddt( "manager.js","373", "doUpload(): top" );
		
	var uploadForm = document.getElementById('uploadForm');

	if(uploadForm)
		{
		showMessage('Uploading');
		}
	}

// -----------------------------------------------------

/**
* refresh()
*/

function refresh()
	{
	_imgManager.ddt._ddt( "manager.js","391", "refresh(): top" );

	var selection = document.getElementById('dirPath');
	updateDir(selection);
	}

// ----------------------------------------------------

/**
* newFolder()
*/

function newFolder() 
	{

	_imgManager.ddt._ddt( "manager.js","406", "newFolder(): top" );

	var selection = document.getElementById('dirPath');
	var dir = selection.options[selection.selectedIndex].value;

	// the popup dialog also needs access to the editor instance. See the last
	// parm.

	Dialog("newFolder.html", 
		function(param) 
			{

			_imgManager.ddt._ddt( "manager.js","418", "Dialog() newFolder function parm: top" );

			if (!param) // user must have pressed Cancel
				return false;
			else
				{
				var folder = param['f_foldername'];

				if(folder == thumbdir)
					{
					alert(i18n('Invalid folder name, please choose another folder name.'));
					return false;
					}

				if (folder && folder != '' && typeof imgManager != 'undefined') 
					imgManager.newFolder(dir, encodeURI(folder)); 
				}
			}, null, _imgManager._editor);  // end of Dialog() function parm

	}	// end of newFolder()

// -------------------------------------------------------------
// once the window loads fire the init() function defined above

_imgManager.ddt._ddt( "manager.js","442", "bottom, adding event to window onload" );

addEvent(window, 'load', init);

// end.
