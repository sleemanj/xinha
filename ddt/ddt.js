
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
* 
* @todo find source of spurious document not well formed error on reload.
*/

// -----------------------------
// REVISION HISTORY:
//
// 2005-01-19 YmL:
//	.	initial revision.
//
// 2005-04-12 YmL:
//	.	expanded for use in Xinha.
//
// 2005-04-22 YmL:
//	.	now uses a popup window for all messages.
//		writing to a textarea was simply too slow.
//
// 2005-04-24 YmL:
// .	popup window name now includes location.host so we can have multiple
//		instance of Xinha running on different domains. Avoids:
//
// 	Error: uncaught exception: Permission denied to get property Window.DDT_STATUS
// .	setting the title of the debug window so you can tell which domain it refers to.
// -----------------------------

/**
* DDT constructor.
*
* @param name name identifying the object sending the debug messages.
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

	this.name = name;

	}
else
	{
	this.name = "DDT";
	}

// by default messages are off.

this.state = "off";
this.popup = null;

}

// -------------------------------------------

/**
* turn on debugging messages optionally opening the debug window.
*
* the original design used a textarea on the page but this made debugging
* startup code difficult. The design has been changed to send debug messages
* to a popup window. Instead of appending to a textarea messages are now
* written to the window, which is much faster.
*
* Instead of using separate areas for each object that might send a message
* debug messages are tagged with the name of the object sending the message.
*
* You will need to turn off popup blockers in order for this to work.
*/

DDT.prototype._ddtOn = function()
{

// if the popup hasn't been opened yet, open it.

if ( this.popup == null )
	{

	// open the popup window. 
	//
	// IMPORTANT: because we are likely to copy a debugging version of Xinha 
	// onto different sites and possibly run them at the same time, each domain 
	// instance of Xinha will need it's own popup window .. this is because one 
	// domain cannot write to a window opened by another domain. 
	//
	// We'll just use the hostname here to make the window name unique.

	this.popup = window.open( "", "ddt_popup_" + location.host,
			      "toolbar=no,menubar=no,personalbar=no,width=800,height=450," +
			      "scrollbars=no,resizable=yes,modal=yes,dependable=yes");

	// it's possible that the window was left open or we are another object
	// sharing the same window.

	if ( typeof this.popup.DDT_STATUS == 'undefined' )
		{

		var content = "<html><head><title>Trace Messages for '" + location.host + "'</title></head><body><p>DDT</p><p><a href=\"javascript:document.write( '<hr>');\">ADD SEPARATOR</a></p></body></html>";
		this.popup.document.write( content );

		var header = this.popup.document.createElement( "h3" );
		var message = this.popup.document.createTextNode( "_ddt Trace Messages" );
		header.appendChild( message );
		this.popup.document.body.appendChild( header );

		this.popup.DDT_STATUS = "ok";

		}	// end of if the popup document hadn't been created.

	}	// end of if the popup had not been opened.

this.state = "on";

}; // end of _ddtOn()

// --------------------------------

/**
* turn off debugging messages.
*/

DDT.prototype._ddtOff = function()
{
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

// --------------------------------

/**
* log a message
*
* writes a debugging trace message to debug popup if trace messages for this 
* object have been turned on.
*/

DDT.prototype._ddt = function( file, line, msg ) 
{

if ( this.state == "on" )
	{

	// fireFox will generate an exception if the window is closed.

	try
		{
		this.popup.document.write( "(" + this.name + ") " + file + ":" + line + " - " + msg + "<br>\n" );
		}
	catch( e )
		{

		// chances are the window was closed. For the moment we'll ignore this.
		//
		// alert( "exception on write of message '" + msg + "' e== '" + e.toString() + "'" );
		}
	}

}

// --------------------------------

/**
* dumps key object properties list to debugging window.
*
* because of the number of properties this method is only marginally
* useful at the moment.
*/

DDT.prototype._ddtDumpObject = function( file, line, msg, obj )
{

this._ddt( 
file, line, msg );

if ( typeof obj == 'undefined' )
	{
	this._ddt(
		file, line, "Object is undefined!" );
	}

for (var x in obj)
   {

	if ( typeof obj[x] == 'string' )
		{

		// avoid getting caught by ddtpreproc.php script.

		this._ddt( 
			file, line, "member - '" + x + "' = '" + obj[x].substr(0,40) + "'"  
			);
		}
	else
		{
		this._ddt( 
			file, line, "member - '" + x + "'"  
			);
		}
   }

} // end of _ddtDumpObject()

// ---------------------------------

/**
* dumps an object tree
*
* displays a tree of html elements. Design based on method from htmlarea.js
*
* @see ddtpreproc.php
* @param root top of tree to display
* @param level depth level.
*/

DDT.prototype._ddtDumpTree = function(root, level) 
{							  
var tag = root.tagName.toLowerCase(), i;
var ns = HTMLArea.is_ie ? root.scopeName : root.prefix;

// FIXME: separated on multiple lines to avoid being picked
// up by ddtpreproc.php

this._ddt( 
	":","0", level + "- " + tag + " [" + ns + "]" 
	);

for (i = root.firstChild; i; i = i.nextSibling)
	if (i.nodeType == 1)
		this._ddtDumpTree(i, level + 2);
};

// END





