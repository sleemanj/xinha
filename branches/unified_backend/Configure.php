<?php

// [COPY
// -----------------------------------------------------------------
// Copyright (C) DTLink, LLC. 
// http://www.dtlink.com and http://www.formvista.com
// -----------------------------------------------------------------
// Use of this code is granted by the sames terms as described in the 
// htmlArea License (based on BSD license). Please read license.txt 
// in this package for details.
// 
// All software distributed under the Licenses is provided strictly on
// an "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR
// IMPLIED, AND DTLINK LLC HEREBY DISCLAIMS ALL SUCH
// WARRANTIES, INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT,
// OR NON-INFRINGEMENT. 
// ------------------------------------------------------------------
// COPY]

/**
* Simple Configure system ported from formVista
*
* @package Xinha
* @subpackage configure
* @author Yermo Lamers
* @copyright DTLink, LLC
* @see http://www.formvista.com
*/

// ---------------------------------------------------------------
// REVISION HISTORY:
//
// 2005-04-15 YmL:
// . ported from formVista.
// . this version relicensed under HTMLArea license.
// ---------------------------------------------------------------

// make sure we're not running in a webserver

if ( @$_SERVER["HTTP_HOST"] != NULL )
	{
	die( "No\n" );
	}

// a hack that works with versions of PHP prior to 4.3

$stdin = fopen("php://stdin","r");
$stdout = fopen("php://stdout","r");
$stderr = fopen("php://stderr","r");

// a nice little banner.

readfile( "./conf/banner.txt" );

print( "Press any key to continue:" );

$response = fgets( $stdin, 256 );

/**
* configure support library
*/

include_once( "./devutils/lib/install.php" );

$dataExport = array();

// ---------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------

while ( true )
	{

	print "\n";
	print "---------------------------------------------------------\n";
	print "\nFull Path to PHP command line interpreter:\n";
	print "[" . @$dataExport["PHP"] . "]:";

	$response = fgets( $stdin, 256 );
										  
   if ( preg_match( "/\S/", $response ) )
		{
		$response = trim($response);

    	$dataExport[ "PHP" ] = $response;

		break;
		}
	else
		{

		// it's possible we've already looped through this 

		if ( preg_match( "/\S/", @$dataExport[ "PHP" ] ))
			break;

		print( "\nPlease enter the path to PHP\n" );
		}
	}

while ( true )
	{

	print "\n";
	print "---------------------------------------------------------\n";
	print "\nPath to PERL:\n";
	print "[" . @$dataExport["PERL"] . "]:";

	$response = fgets( $stdin, 256 );
										  
   if ( preg_match( "/\S/", $response ) )
		{
		$response = trim($response);

    	$dataExport[ "PERL" ] = $response;

		break;
		}
	else
		{

		// it's possible we've already looped through this 

		if ( preg_match( "/\S/", @$dataExport[ "PERL" ] ))
			break;

		print( "\nPlease enter the path to Perl\n" );
		}
	}

// ---------------------------------------------------------------
//			TEMPLATE EXPANSION
// ---------------------------------------------------------------
//
// There are a number of utility configuration files and utility scripts
// that need to have some of these settings embedded in them.

// PHP kludge for taking a source file and turning it into an array.

if (( $infile_list = file( "./conf/infile_list.txt" )) == NULL )
	{
	print( "ERROR - unable open '.in' files list in './conf/infile_list.txt'\n" );
	return  false ;
	}

// now loop over each file in the list and expand it.

foreach ( $infile_list as $offset => $source_line )
	{

	// is our source_line blank or does it mark a phpDocumentor docblock?

	if (( preg_match( "/^\s$/", $source_line )) || 
		( substr( $source_line, 0, 3 ) == "/**" ) ||
		( substr( $source_line, 0, 1 ) == "*" ) ||
		( substr( $source_line, 0, 2 ) == "<?" ) ||
		( substr( $source_line, 0, 2 ) == "?>" ))
		{

		// blank line or phpDocumentor comment.

		continue;
		}

	$source_line = rtrim( $source_line );

	// lines in the file are source file, target permissions. (unix only)

	list( $filename, $permissions ) = split( " ", $source_line );

	$permissions = rtrim( $permissions );

	// the target name is the source name minus '.in'.

	$target_filename = str_replace( ".in", "", $filename );

	// do variable replacement in the file.

	process_template( $filename, $target_filename, $dataExport );

	// nice little bug in chmod() call ...

	$mode_oct = octdec($permissions); 
	
	chmod( $target_filename, $mode_oct );
	
	print( "Generated '$target_filename' permissions '$permissions'\n" );

	}

// ---------------------------------------------------------------
// 		CHECKING PERMISSIONS
// ---------------------------------------------------------------
//
// We've run into countless situations where directory and file
// permissions get changed. Read in a list of files and directories
// and change permission and ownership accordingly.

// PHP kludge for taking a source file and turning it into an array.

if (( $infile_list = file( "./conf/perms_list.txt" )) == NULL )
	{
	print( "ERROR - unable open perms list in './conf/perms_list.txt'\n" );
	return  false ;
	}

// now loop over each file and directory in the list and expand it.

foreach ( $infile_list as $offset => $source_line )
	{

	// is our source_line blank or does it mark a phpDocumentor docblock?

	if (( preg_match( "/^\s$/", $source_line )) || 
		( substr( $source_line, 0, 3 ) == "/**" ) ||
		( substr( $source_line, 0, 1 ) == "*" ) ||
		( substr( $source_line, 0, 2 ) == "<?" ) ||
		( substr( $source_line, 0, 2 ) == "?>" ))
		{

		// blank line or phpDocumentor comment.

		continue;
		}

	$source_line = rtrim( $source_line );

	// lines in the file are source file or dir, permissions, owner. (unix only)
	// where owner is either the web user or root. 

	list( $filename, $permissions, $owner ) = split( " ", $source_line );

	$owner = rtrim( $owner );

	// nice little bug in chmod() call ...

	$mode_oct = octdec($permissions); 
	
	chmod( $filename, $mode_oct );
	chown( $filename, $owner );
		
	print( "Set '$filename' to perms '$permissions' owner '$owner'\n" );

	}

// END

?>
