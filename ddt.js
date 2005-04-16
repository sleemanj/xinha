
// [NOSTRIP
// -----------------------------------------------------------------
// Copyright (C) DTLink, LLC. 
// http://www.dtlink.com and http://www.formvista.com
// -----------------------------------------------------------------
// Use of this code is granted by the sames terms as described in the 
// htmlArea License (based on BSD license) please read license.txt 
// in this package for details.
// 
// All software distributed under the Licenses is provided strictly on
// an "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR
// IMPLIED, AND DTLINK LLC HEREBY DISCLAIMS ALL SUCH
// WARRANTIES, INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT,
// OR NON-INFRINGEMENT. 
// ------------------------------------------------------------------
// NOSTRIP]

/**
* basic debug trace message
*
* This implements a javascript "class" used to dump trace messages
* to a text area. Options include turning on messages on an object
* by object basis or turning on all messages. Additionally trace
* messages can be routed to different text areas according to need.
*
* @copyright DTLink, LLC
* @author Yermo Lamers
* @package ddt
*/

// -----------------------------
// REVISION HISTORY:
//
// 2005-01-19 YmL:
//	.	initial revision.
//
// 2005-04-12 YmL:
//	.	expanded for use in Xinha.
// -----------------------------

/**
* DDT constructor.
*
* @class Debugging Trace Message class. 
*
* @constructor
*/

function DDT( name )
{

// by default we're use the textarea DDT

if (name != undefined ) 
	{

	// descriptive named used as a title for the trace box.

	this.textarea_name = name;

	// hopefully unique name to avoid conflicts with existing elements.

	this.textarea_id = "DDT_" + name;
	}
else
	{
	this.textarea_name = "DDT";
	}

// by default messages are off.

this.textarea = null;

this.state = "off";

}

// --------------------------------

/**
* turn on debugging messages and optionally create the text area.
*/

DDT.prototype._ddtOn = function()
{

// if the text area hasn't been created yet, create it.

if (( this.textarea = document.getElementById( this.textarea_id )) == null )
	{

	var header = document.createElement( "h3" );
	var message = document.createTextNode( "Trace messages for " + this.textarea_name );
	header.appendChild( message );

	this.textarea = document.createElement("textarea");

	// name it so we can reuse it; avoid naming conflicts with existing textareas.

	this.textarea.id = this.textarea_id;

	this.textarea.style.width = "85%";
	this.textarea.style.height = "15em";

	document.body.appendChild( header );
	document.body.appendChild(this.textarea);
	}

// clear the text area.

this.textarea.value = "";

this.state = "on";

}; // end of ddtOn

// --------------------------------

/**
* turn off debugging messages
*/

DDT.prototype._ddtOff = function()
{
this.textarea.value = "";
this.textarea = null;
this.state = "off";
}

// ----------------------------------

/**
* toggle debug message on/off state
*/

DDT.prototype._ddtToggle = function()
{

if ( this.state == "on" )
	this._ddtOff();
else
	this._ddtOn();

}

// -------------------------------------------

/**
* use a popup textarea for debugging
*
* there are cases where one would like to debug javascript code while a page
* is being constructed. This function raises a popup window, puts a textarea in it.
* subsequent debug trace messages are sent to the window.
*
* You will need to turn off popup blockers in order for this to work.
*/

DDT.prototype._ddtOnPopup = function()
{

// if the text area hasn't been created yet, create it.

if ( this.textarea == null )
	{

	// open the popup window

	var popup = window.open( "", "ddt_popup",
			      "toolbar=no,menubar=no,personalbar=no,width=800,height=250," +
			      "scrollbars=no,resizable=yes,modal=yes,dependable=yes");

	// it's possible that the window was left open between loads so check to see
	// if the text area already exists

	if (( this.textarea = popup.document.getElementById( this.textarea_id )) == null )
		{

		var content = "<html><body><p>ddt</p></body></html";
		popup.document.write( content );

		var header = popup.document.createElement( "h3" );
		var message = popup.document.createTextNode( "Trace messages for " + this.textarea_name );
		header.appendChild( message );

		this.textarea = popup.document.createElement("textarea");

		// name it so we can reuse it; avoid naming conflicts with existing textareas.

		this.textarea.id = this.textarea_id;

		this.textarea.style.width = "95%";
		this.textarea.style.height = "15em";

		popup.document.body.appendChild( header );
		popup.document.body.appendChild(this.textarea);

		}	// end of if textarea did not already exist.

	}	// end of if this object did not have a textarea set.

this.textarea.value = "";
this.state = "on";

}; // end of ddtOnPopup()

// --------------------------------

/**
* turn off debugging messages in popup.
*/

DDT.prototype._ddtOffPopup = function()
{
this.textarea.value = "";
this.textarea = null;
this.state = "off";
}

// ----------------------------------

/**
* toggle debug message on/off state in popup.
*/

DDT.prototype._ddtTogglePopup = function()
{

if ( this.state == "on" )
	this._ddtOff();
else
	this._ddtOnPopup();

}

// --------------------------------

/**
* log a message
*
* dumps a debugging message to debug textarea if trace messages for this 
* object have been turned on.
*/

DDT.prototype._ddt = function( msg ) 
{

if ( this.state == "on" )
	{
	this.textarea.value += msg + "\n";
	}

}

// --------------------------------

/**
* dumps key object properties list to debugging window.
*
* because of the number of properties this method is only marginally
* useful at the moment.
*/

DDT.prototype._ddtDumpObject = function( msg, obj )
{

if ( this.textarea != null )
   {

   this.textarea.value += msg + "\n";

   for (var x in obj)
     {

     this.textarea.value += "   " + x  + "\n";
     }

   }

} // end of _ddtDumpObject()

// ---------------------------------

/**
* dumps an object tree
*
* displays a tree of html elements. Design based on method from htmlarea.js
*
* @param root top of tree to display
* @param level depth level.
*/

DDT.prototype._ddtDumpTree = function(root, level) 
{							  
var tag = root.tagName.toLowerCase(), i;
var ns = HTMLArea.is_ie ? root.scopeName : root.prefix;

this._ddt(level + "- " + tag + " [" + ns + "]");

for (i = root.firstChild; i; i = i.nextSibling)
	if (i.nodeType == 1)
		this._ddtDumpTree(i, level + 2);
};

// END





