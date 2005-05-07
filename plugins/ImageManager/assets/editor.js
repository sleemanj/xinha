/**
* @fileoverview Functions for the ImageEditor interface, used by editor.php only	
*
* Note "editor" in this file refers to the image editor, not the Xinha editor.
*
* @author $Author: Wei Zhuo $
* @version $Id: editor.js 26 2004-03-31 02:35:21Z Wei Zhuo $
* @package ImageManager
*/

var current_action = null;
var actions = ['crop', 'scale', 'rotate', 'measure', 'save'];
var orginal_width = null, orginal_height=null;

// ------------------------------------------------------------------

/**
* toggle()
*/

function toggle(action) 
	{

	_imgManager.ddt._ddt( "editor.js","24", "toggle(): top with action '" + action + "'" );

	if(current_action != action)
		{

		for (var i in actions)
			{
			if(actions[i] != action)
				{
				var tools = document.getElementById('tools_'+actions[i]);
				tools.style.display = 'none';
				var icon = document.getElementById('icon_'+actions[i]);
				icon.className = '';
				}
			}

		current_action = action;
			
		var tools = document.getElementById('tools_'+action);
		tools.style.display = 'block';
		var icon = document.getElementById('icon_'+action);
		icon.className = 'iconActive';

		var indicator = document.getElementById('indicator_image');
		indicator.src = 'img/'+action+'.gif';

		editor.setMode(current_action);

		//constraints on the scale,
		//code by Frédéric Klee <fklee@isuisse.com>

		if(action == 'scale') 
			{
			var theImage = editor.window.document.getElementById('theImage');
			orginal_width = theImage.width ;
			orginal_height = theImage.height;

			var w = document.getElementById('sw');
			w.value = orginal_width ;
			var h = document.getElementById('sh') ;
			h.value = orginal_height ;
			}

		}

	} // end of toggle()

// -------------------------------------------------------------

/**
* toggleMarker()
*/

function toggleMarker() 
	{

	_imgManager.ddt._ddt( "editor.js","80", "toggleMarker(): top" );

	var marker = document.getElementById("markerImg");
		
	if(marker != null && marker.src != null) 
		{
		if(marker.src.indexOf("t_black.gif") >= 0)
			marker.src = "img/t_white.gif";
		else
			marker.src = "img/t_black.gif";

		editor.toggleMarker();
		}
	}

// -----------------------------------------------------------------

/**
* Togggle constraints, by Frédéric Klee <fklee@isuisse.com>
*/

function toggleConstraints() 
	{

	_imgManager.ddt._ddt( "editor.js","104", "toggleConstraints(): top" );

	var lock = document.getElementById("scaleConstImg");
	var checkbox = document.getElementById("constProp");
		
	if(lock != null && lock.src != null) 
		{
		if(lock.src.indexOf("unlocked2.gif") >= 0)
			{
			lock.src = "img/islocked2.gif";
			checkbox.checked = true;
			checkConstrains('width');
			}
		else
			{
			lock.src = "img/unlocked2.gif";
			checkbox.checked = false;
			}
		}
	}	// end of toggleContraints()

// ---------------------------------------------------------------------
	
/**
* check the constraints, by Frédéric Klee <fklee@isuisse.com>
*/

function checkConstrains(changed) 
	{

	_imgManager.ddt._ddt( "editor.js","134", "checkConstrains(): top" );

	var constrained = document.getElementById('constProp');
	if(constrained.checked) 
		{
		var w = document.getElementById('sw') ;
		var width = w.value ;
		var h = document.getElementById('sh') ;
		var height = h.value ;
			
		if(orginal_width > 0 && orginal_height > 0) 
			{
			if(changed == 'width' && width > 0) 
				h.value = parseInt((width/orginal_width)*orginal_height);
			else if(changed == 'height' && height > 0) 
				w.value = parseInt((height/orginal_height)*orginal_width);
			}
		}
		
	updateMarker('scale') ;

	}	// end of checkContrains()

// --------------------------------------------------------------------

/**
* updateMarker()
*/

function updateMarker(mode) 
	{

	_imgManager.ddt._ddt( "editor.js","166", "updateMarker(): top with mode '" + mode + "'" );

	if (mode == 'crop')
		{
		var t_cx = document.getElementById('cx');
		var t_cy = document.getElementById('cy');
		var t_cw = document.getElementById('cw');
		var t_ch = document.getElementById('ch');

		editor.setMarker(parseInt(t_cx.value), parseInt(t_cy.value), parseInt(t_cw.value), parseInt(t_ch.value));
		}
	else if(mode == 'scale') 
		{
		var s_sw = document.getElementById('sw');
		var s_sh = document.getElementById('sh');
		editor.setMarker(0, 0, parseInt(s_sw.value), parseInt(s_sh.value));
		}

	}	// end of updateMarker()

// ---------------------------------------------------------------------

/**
* rotatePresent()
*/
	
function rotatePreset(selection) 
	{

	_imgManager.ddt._ddt( "editor.js","195", "rotatePresent(): top" );

	var value = selection.options[selection.selectedIndex].value;
		
	if(value.length > 0 && parseInt(value) != 0) 
		{
		var ra = document.getElementById('ra');
		ra.value = parseInt(value);
		}
	}

// ---------------------------------------------------------------------

/**
* updateFormat()
*/

function updateFormat(selection) 
	{

	_imgManager.ddt._ddt( "editor.js","215", "updateFormat(): top" );

	var selected = selection.options[selection.selectedIndex].value;

	var values = selected.split(",");
	if(values.length >1) 
		{
		updateSlider(parseInt(values[1]));
		}

	}

// ---------------------------------------------------------------------

/**
* addEvent()
*/

function addEvent(obj, evType, fn)
	{ 

	_imgManager.ddt._ddt( "editor.js","236", "addEvent(): top" );

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

	} // end of addEvent()

// ------------------------------------------------------

/**
* init()
*/

init = function()
	{

	_imgManager.ddt._ddt( "editor.js","264", "init(): top" );

	var bottom = document.getElementById('bottom');
	if(window.opener)
		{
		__dlg_init(bottom);
		__dlg_translate('ImageManager');
		}
	}

// --------------------------------------------------------

_imgManager.ddt._ddt( "editor.js","276", "bottom: hooking onLoad event" );

addEvent(window, 'load', init);

// END
