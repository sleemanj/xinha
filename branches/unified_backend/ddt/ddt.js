
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
//
// 2005-05-12 YmL:
//	.	added _ddtDumpNode() to dump node details along with message.
//
// -----------------------------



/**
* browser identification
*/

DDT.agt = navigator.userAgent.toLowerCase();
DDT.is_ie	   = ((DDT.agt.indexOf("msie") != -1) && (DDT.agt.indexOf("opera") == -1));
DDT.is_opera  = (DDT.agt.indexOf("opera") != -1);
DDT.is_mac	   = (DDT.agt.indexOf("mac") != -1);
DDT.is_mac_ie = (DDT.is_ie && DDT.is_mac);
DDT.is_win_ie = (DDT.is_ie && !DDT.is_mac);
DDT.is_gecko  = (navigator.product == "Gecko");

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
	//
	// Something to note, MSIE 6 (at least under win98) throws an exception
	// if there are any "."'s in the window name, so we replace them with underscores here.

	var window_name = "ddt_popup_" + location.hostname.replace( /[.]/g, "_" );

	if (DDT.is_gecko) 
		{
		this.popup = window.open( "", "ddt_popup_" + location.host,
			      "toolbar=no,menubar=no,personalbar=no,width=800,height=450," +
			      "scrollbars=no,resizable=yes,modal=yes,dependable=yes");
		}
	else
		{

		this.popup = window.open("", window_name,
              "toolbar=no,location=no,directories=no,status=no,menubar=no," +
              "scrollbars=no,resizable=yes,width=800,height=450");

		}

	// did we manage to open a window?

	if (( typeof this.popup == 'undefined' ) || ( this.popup == null ))
		{
		alert( "FAILED TO OPEN DEBUGGING TRACE WINDOW" );

		return false;
		}

	// it's possible that the window was left open or we are another object
	// sharing the same window.

	if (( this.popup != null ) && ( typeof this.popup.DDT_STATUS == 'undefined' ))
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

}	// end of _ddt()

// --------------------------------

/**
* dumps key properties from a node.
*/

DDT.prototype._ddtDumpNode = function( file, line, msg, node )
{

if ( typeof node == 'undefined' )
	{
	this._ddt(
		file, line, msg + " -- Node is undefined!" );

	return;
	}

if ( node == null )
	{
	this._ddt(
		file, line, msg + " -- Node is null!" );
	}

this._ddt( 
	file, line, msg + "<br>" + this.FragmentToString( node, 0 ) );

} // end of _ddtDumpNode()

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
* generates a string description of a document fragment.
*
* returns a tree of html elements. Design based on method from htmlarea.js
*
* @see ddtpreproc.php
* @param root top of tree to generate
* @param level depth level.
*/

DDT.prototype.FragmentToString = function(root, level) 
{							  

var retval = "";

if ( typeof root == 'undefined' )
	return " root undefined ";

if ( root == null )
	return " root is null ";

// it may be a mozilla range object:

if ( typeof root.cloneRange != 'undefined' )
	{
	// we have a range object. 

	retval = "RANGE OBJECT - start offset '" + root.startOffset + "' end offset '" + root.endOffset + "'<br>";
	retval += "RANGE START:<br>" + this.FragmentToString( root.startContainer, level );
	retval += "RANGE END:<br>" + this.FragmentToString( root.endContainer, level );

	return retval;
	}

if ( typeof root.childNodes == 'undefined' )
	return " root is not a node";

var childretval = "";

// interestingly if you do not declare a local var for the iterator
// it seems to become a static variable which mucks up the recursion

var i = 0;

for (i = 0; i < root.childNodes.length; i++)
	{
	childretval += this.FragmentToString( root.childNodes[i], level + 2);
	}

retval = this.indent( level ) + this._ddtGetNodeType( root ) + " - " + root.childNodes.length + " children <br>" + childretval;

return retval;

};

// -------------------------------------------------

/**
* indent by level
*/

DDT.prototype.indent = function( level )
{

var retval = "";

for (i = 0; i<level; i++ )
	{
	retval += "&nbsp;&nbsp;";
	}

return retval;

}
// -----------------------------------------

/**
* displays node type
*/

DDT.prototype._ddtGetNodeType = function( node )
{

var retval = "";

if ( typeof node == 'undefined' )
	{
	return "TYPE_IS_UNDEFINED";
	}

if ( node == null )
	{
	return "TYPE_IS_NULL!";
	}

if ( typeof node.nodeType == 'undefined' )
	{
	return "NOT_A_NODE_OBJECT - type is '" + typeof node + "'";
	}

switch ( node.nodeType )
	{

	case 1:
		retval = "ELEMENT_NODE - tag '" + node.nodeName + "'";
		return retval;
		break;

	case 2:
		return "ATTRIBUTE_NODE";
		break;

	case 3:
		retval = "TEXT_NODE";
		retval = retval + " contents '" + node.nodeValue + "'";
		return retval;

		break;

	case 4:
		return "CDATA_SECTION_NODE";
		break;

	case 5:
		return "ENTITY_REFERENCE_NODE";
		break;

	case 6:
		return "ENTITY_NODE";
		break;

	case 7:
		return "PROCESSING_INSTRUCTION_NODE";
		break;

	case 8:
		return "COMMENT_NODE";
		break;

	case 9:
		return "DOCUMENT_NODE";
		break;

	case 10:
		return "DOCUMENT_TYPE_NODE";
		break;

	case 11:
		retval = "DOCUMENT_FRAGMENT_NODE";

		return retval;
		break;

	case 12:
		return "NOTATION_NODE";
		break;

	default:
		return "UNKNOWN_NODE!";
		break;

	} // end of switch

};	// end of _ddtDumpNode()

// ----------------------------------------------------------

/**
* getHTMLSource() - returns HTML source for display in a browser window.
*/

DDT.prototype.getHTMLSource = function( html )
{

html = html.replace( /</ig, "&lt;" );
html = html.replace( />/ig, "&gt;" );
html = html.replace( /&/ig, "&amp;" );
html = html.replace(/\xA0/g, "&nbsp;");
html = html.replace(/\x22/g, "&quot;");

return html;

}	// end of showHTML()

// END





