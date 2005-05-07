/**
* Functions for the image listing, used by images.php only	
* @author $Author: Wei Zhuo $
* @version $Id: images.js 26 2004-03-31 02:35:21Z Wei Zhuo $
* @package ImageManager
*/

// the _imgManager reference must be set before this file is included.

// --------------------------------------------

/**
* i18n()
*/

function i18n(str) 
	{

	_imgManager.ddt._ddt( "images.js","19", "i18n(): top with string '" + str + "'" );

	return HTMLArea._lc(str, 'ImageManager');
	};

// --------------------------------------------

function changeDir(newDir) 
	{

	_imgManager.ddt._ddt( "images.js","29", "changeDir(): top with newDir '" + newDir + "'" );

	showMessage('Loading');

	// backend_url is defined in the calling page. For now we 
	// assume it has a trailing &

	location.href = _backend_url + "__function=images&dir="+newDir;
	}

// ------------------------------------------------

/**
* newFolder()
*/

function newFolder(dir, newDir) 
	{

	_imgManager.ddt._ddt( "images.js","48", "newFolder(): top with dir '" + dir + "' and newDir '" + newDir + "'" );

	location.href = _backend_url + "__function=images&dir="+dir+"&newDir="+newDir;
	}

// ----------------------------------------------------------------------

/**
* update the dir list in the parent window.
*/

function updateDir(newDir)
	{
	_imgManager.ddt._ddt( "images.js","61", "updatDir(): top with string '" + newDir + "'" );

	var selection = window.top.document.getElementById('dirPath');
	if(selection)
		{
		for(var i = 0; i < selection.length; i++)
			{
			var thisDir = selection.options[i].text;
			if(thisDir == newDir)
				{
				selection.selectedIndex = i;
				showMessage('Loading');
				break;
				}
			}		
		}
	}

// -------------------------------------------------------------------------

/**
* selectImage()
*/

function selectImage(filename, alt, width, height) 
	{

	_imgManager.ddt._ddt( "images.js","88", "selectImage(): top with filename '" + filename + "'" );

	var topDoc = window.top.document;
		
	var obj = topDoc.getElementById('f_url');  obj.value = filename;
	var obj = topDoc.getElementById('f_width');  obj.value = width;
	var obj = topDoc.getElementById('f_width'); obj.value = width;
	var obj = topDoc.getElementById('f_height'); obj.value = height;
	var obj = topDoc.getElementById('f_alt'); obj.value = alt;
	var obj = topDoc.getElementById('orginal_width'); obj.value = width;
	var obj = topDoc.getElementById('orginal_height'); obj.value = height;		
	}

// --------------------------------------------------------------------------

/**
* showMessage()
*/

function showMessage(newMessage) 
	{

	_imgManager.ddt._ddt( "images.js","110", "showMessage(): top with newMessage '" + newMessage + "'" );

	var topDoc = window.top.document;

	var message = topDoc.getElementById('message');
	var messages = topDoc.getElementById('messages');

	if(message && messages)
		{
		if(message.firstChild)
				message.removeChild(message.firstChild);

		message.appendChild(topDoc.createTextNode(i18n(newMessage)));
			
		messages.style.display = "block";
		}

	}

// ------------------------------------------------------------

/**
* addEvent()
*/

function addEvent(obj, evType, fn)
	{ 

	_imgManager.ddt._ddt( "images.js","138", "addEvent(): top" );

	if (obj.addEventListener) 
		{ 
		obj.addEventListener(evType, fn, true); 
		return true; 
		} 
	else if (obj.attachEvent) 
		{  
		var r = obj.attachEvent("on"+evType, fn);  return r;  
		} 
	else {  return false; } 

	} 

// --------------------------------------------------------

/**
* confirmDeleteFile()
*/

function confirmDeleteFile(file) 
	{

	_imgManager.ddt._ddt( "images.js","162", "confirmDeleteFile(): top with file '" + file + "'" );

	if(confirm(i18n("Delete file?")))
		return true;

	return false;		
	}

// ----------------------------------------------------------

/**
* confirmDeleteDir()
*/

function confirmDeleteDir(dir, count) 
	{

	_imgManager.ddt._ddt( "images.js","179", "confirmDeleteDir(): top with dir '" + dir + "' count '" + count + "'" );

	if(count > 0)
		{
		alert(i18n("Please delete all files/folders inside the folder you wish to delete first."));
		return;
		}

	if(confirm(i18n("Delete folder?"))) 
			return true;

	return false;
	}

// ----------------------------------------

_imgManager.ddt._ddt( "images.js","195", "bottom: hooking onload event" );

addEvent(window, 'load', init);

// END
