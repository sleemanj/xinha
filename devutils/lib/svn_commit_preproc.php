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
* 
* Wrapper around "svn commit" to force popups/about.html to be updated.
*
* Subversion has no good way to pull the current HEAD version out of a
* repository. This wrapper forces an update to popups/about.html which 
* will then get the current $Rev$ number.
*
* This code was originally part of the formVista business component
* framework.
*
* @package xinha
* @subpackage misc_utils
* @author DTLink Software
* @copyright Copyright 2005 (c), DTLink L.L.C.
*/

/**
*
*/

// ----------------------------------------------------------------
//
//	Wrapper around svn_commit so we can get the build number.
//
// REVISION HISTORY:
//
// 2003-08-13 YmL:
// . intial revision.
//
// 2005-04-12 YmL:
//	.	repurposed and relicensed for use with Xinha.
// ----------------------------------------------------------------
// Increment commit number.
//
// Commit number is enclosed in [@@ .. @@] tags.

function increment_commit_count( $inpath, $outpath )
{

// kludgey way of pulling in the source file.

print( "Attempting to pull in '$inpath' to '$outpath'\n" );

if (( $content_array = file($inpath)) == NULL )
	{
	print( "ERROR - unable open file '$inpath'\n" );
	return( false );
	}

$content = implode("", $content_array);

// find the number - a bit of a kludge. Couldn't get preg_replace to just
// pull out the number from the file. Contrary to the docs it doesn't seem
// to treat all lines as one lines regardless of the /m switch.

$tmpArray = array();

preg_match( "/.*\[@@(.*)@@\].*/", $content, $tmpArray );

$commit_count = preg_replace( "/.*\[@@(.*)@@\].*/", "$1", $tmpArray[0] );

// replace variable references

$commit_count++;

$replacement = "[@@" . $commit_count . "@@]";

$content_replaced = preg_replace( "/\[@@(.*?)@@\]/" , $replacement, $content );

// write the file out.

if (( $outfile = fopen( $outpath, "w" )) == NULL )
	{
	print( "ERROR - unable to open '$outpath'\n" );
	return( false );
	}

fwrite( $outfile, $content_replaced );

fclose( $outfile );

return( true );

}	// end of increment_commit_count()

// END

?>
