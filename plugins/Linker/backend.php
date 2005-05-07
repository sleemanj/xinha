<?php

/**
* Unified backend for Linker
*
* Linker was originally developed by:
*  James Sleeman http://www.gogo.co.nz, Gogo Internet Services
*
* Unified backend sponsored by DTLink Software, http://www.dtlink.com
* Implementation by Yermo Lamers, http://www.formvista.com/contact.html
*
* (c) DTLink, LLC 2005.
* Distributed under the same terms as HTMLArea itself.
* This notice MUST stay intact for use (see license.txt).
*
* backend.php expects at least two URL variable parameters: 
*
* __plugin=Linker   for future expansion; identify the plugin being requested.
* __function=scan  function being called.
*
* Having a single entry point that strictly adheres to a defined interface will 
* make the backend code much easier to maintain and expand. It will make it easier
* on integrators, not to mention it'll make it easier to have separate 
* implementations of the backend in different languages (Perl, Python, ASP, etc.) 
*/

/**
* master configuration file.
*
* we assume our current working directory is xinha/plugins/Linker
*/

require_once('../../backends/backend_conf.php');

/**
* debug message library
*/

include_once( XINHA_INSTALL_ROOT . "/ddt/ddt.php" );

// uncomment to turn on debugging
// _ddtOn();

// ---------------------------------------------------------------

/**
* Liner backend callback
*
* After including this file, the unified backend.php script
* will call this function
*/

function linker_callback( $formVars )
{

_ddt( __FILE__, __LINE__, "backend.php: top with query '" . $_SERVER["PHP_SELF"] . "' string '" . $_SERVER["QUERY_STRING"] . "'" );

// make sure the request is for us (this gives us the ability to eventually organize
// a backend event handler system) For an include file the return doesn't make alot of
// sense but eventually we'll want to reorganize this.

if ( @$formVars[ "__plugin" ] != "Linker" )
	{
	// not for us.

	_ddt( __FILE__, __LINE__, "request was not for us" );

	return true;
	}

// so we don't have to re-engineer the entire thing right now, since it's probably
// going to get rewritten anyway, we just include the correct file based on the 
// function request.

_ddt( __FILE__, __LINE__, "backend.php(): handling function '" . @$formVars[ "__function" ] . "'" );

switch ( @$formVars[ "__function" ] )
	{

	case "scan": 

		include_once( XINHA_INSTALL_ROOT . "/plugins/Linker/scan.php" );
		exit();
		
		break;

	case "dialog": 

		include_once( XINHA_INSTALL_ROOT . "/plugins/Linker/dialog.html" );
		exit();
		
		break;

	default:

		_ddt( __FILE__, __LINE__, "function request not supported" );
		_error( __FILE__, __LINE__, "function request not supported" );

		break;

	}	// end of switch.

return false ;

}	// end of linker_callback

// END

?>
