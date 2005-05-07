<?php

// [NOSTRIP
// -----------------------------------------------------------------
// Copyright (C) DTLink, LLC. 
// http://www.dtlink.com and http://www.formvista.com
// -----------------------------------------------------------------
// This code is distributed under the the sames terms as Xinha
// itself. (HTMLArea license based on the BSD license) 
// 
// Please read license.txt in this package for details.
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
* backend.php plugin request router.
*
* Unified backend single point of entry for the PHP backend.
*
* For each plugin identified by a __plugin argument, route the
* request to the corresponding backend.php in that plugins
* directory.
*
* @package xinha
* @subpackage backend
* @author Yermo Lamers http://www.formvista.com/contact.html
* @copyright DTLink, LLC 2005
*/

// ----------------------------------------------------------------

/**
* backend configuration
*
* backend.php assumes the current working directory is xinha/backends.
*/

include_once( "./backend_conf.php" );

/**
* DDT simple debugging library.
*/

include_once( "../ddt/ddt.php" );

// uncomment the following to turn on trace messages.
//_ddtOn();

// get the request variables.

$formVars = empty($_POST) ? $_GET : $_POST;

$plugin = @$formVars[ "__plugin" ];

_ddt( __FILE__, __LINE__, "backend.php: plugin is '" . @$plugin . "'" );

// if there is no __plugin variable we have an error.

if ( $plugin == NULL )
	{
	die( "No __plugin variable" );
	}

// some sanity checking on the plugin name. Only alphanumeric characters
// and underscores allowed.

if ( ! preg_match( "/^[a-zA-Z0-9_]+$/", $plugin ) )
	{
	_ddt( __FILE__, __LINE__, "backend.php: plugin '$plugin' contains illegal characters" );
	die( "No" );
	}

// based on the __plugin variable we pass the buck to the plugin
// specific backend.php script, if one exists. 
//
// XINHA_INSTALL_ROOT comes from the backends/backend_conf.php file.

$backend_path = XINHA_INSTALL_ROOT . "/plugins/" . $plugin . "/backend.php";

_ddt( __FILE__, __LINE__, "backend.php: plugin '$plugin' backend_path is '$backend_path'" );

if ( ! file_exists( $backend_path ) )
	{
	die( "No backend for plugin '" . $plugin . "'" );
	}

// plugin backends assume the plugin directory itself is the current working
// directory

$plugin_dir = XINHA_INSTALL_ROOT . "/plugins/" . $plugin;

_ddt( __FILE__, __LINE__, "backend.php: changing cwd to '$plugin_dir'" );

chdir( $plugin_dir );

_ddt( __FILE__, __LINE__, "backend.php: pulling in '$backend_path'" );

include_once( $backend_path );

// to allow for multiple backends to be pulled in simultaneously (in some future version)
// form a plugin-unique callback name.

$callback_name = $plugin . "_callback";

_ddt( __FILE__, __LINE__, "backend.php: calling '$callback_name'" );

$callback_name( $formVars );

// END

?>
