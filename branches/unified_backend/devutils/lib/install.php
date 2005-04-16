<?

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

// not to be used from web apps. 

if ( @$_SERVER["DOCUMENT_ROOT"] != "" )
	die();

// Use of the contents of this file is granted by the terms of the htmlArea License 
// (based on BSD license)  please read license.txt in this package for details.

/**
* Contains Installation helper library functions.
*
* This is a library of useful routines primarly used by the
* Configure.php configuration system.
*
* @package xinha
* @subpackage config
* @copyright DTLink, LLC 2004
* @author Yermo Lamers
* @see Configure.php
*/

// REVISION HISTORY:
//
// 2004-04-04 YmL:
//	.	initial version based on MOBIE Configure.php functions.
//
// 2004-06-01 YmL:
//	.	logic error in compareVersion()
//
// 2004-10-10 YmL:
//	.	saveConfig now urlencodes values to work around Mysql = password bug.
//
// 2005-02-20 YmL:
//	.	in support of running this beast under Windows added the xp_realpath()
//		call to convert "\" to "/" before returning.
//
// 2005-02-21 YmL:
//	.	added installFiles()
//
// 2005-04-15 YmL:
// .	modified and contributed to the Xinha project
// .	this file relicensed under the HTMLArea license. 
//
// ----------------------------------------------------------------

/**
* Process a template file.
*
* Expands variables in a ".in" file. Variables are enclosed in [@@ .. @@] tags.
*
* @see Configure.php
*/

function process_template( $inpath, $outpath, $export )
{

// build the search and replace arrays

$searchArray = array();
$replaceArray = array();

foreach ( $export as $name => $value )
	{

	$searchArray[] =  "[@@" . $name . "@@]";
	$replaceArray[] = $value;

	}

// kludgey way of pulling in the source file.

if (( $content_array = file($inpath)) == NULL )
	{
	print( "ERROR - unable open file '$inpath'\n" );
	return  false ;
	}

$content = implode("", $content_array);

// replace variable references

$content_replaced = str_replace( $searchArray, $replaceArray, $content );

// write the file out.

if (( $outfile = fopen( $outpath, "w" )) == NULL )
	{
	print( "ERROR - unable to open '$outpath'\n" );
	return  false ;
	}

fwrite( $outfile, $content_replaced );

fclose( $outfile );

}	// end of process_template

// -----------------------------------------------------

/**
* recursive copy - copy that handles directories.
*
* copies files or directories 
*
* @todo does not copy "*.in" or ".svn" files. Need to have some kind of exclusion list. 
*/

function rcopy( $source, $dest)
{

//_ddt( __FILE__, __LINE__, "rcopy(): copying $source to $dest" );

// does the source file/directory exist?

if ( !file_exists( $source ))
	return  false ;

// FIXME: for the moment we don't copy over .in files or .svn files.
// FIXME: in future versions we'll need some kind of exclusion list.

if ( preg_match( "/.*\.in$/", $source ) || preg_match( "/\.svn$/", $source ))
	{

	// we just ignore the file/directory

	return  true ;
	}

// if the source is not a directory, just do a straight
// copy. NOTE, both source and dest have to be filenames under
// windows in this case.

if ( !is_dir( $source ))
	{

	if ( ! copy( $source, $dest ) )
		{
		_error( __FILE__, __LINE__, "rcopy(): error copying $source to $dest" );
		return  false ;
		}

	return  true ;
	}
else
	{

	// are we trying to copy onto ourselves?

	if ( strpos( realpath($dest), realpath($source) ) === 0)
		{
		_error( __FILE__, __LINE__, "rcopy(): trying to copy directory onto itself" );

		return  false ;
		}

	// if dest exists and it's not a directory then we've got an error.

	if ( file_exists($dest) && ! is_dir($dest))
		{
		_error( __FILE__, __LINE__, "rcopy(): trying to copy directory to a file '$dest'" );

		return  false ;
		}
	
	// if dest does not exist, try to create the directory

	if ( !file_exists( $dest ) )
		{
		if ( ! mkdir( $dest ) )
			{
			_error( __FILE__, __LINE__, "rcopy(): unable to make directory '$dest'" );

			return  false ;
			}
		}

	// print( "Copying $source\n   TO: $dest\n" );

	// now copy the contents of the directory

	if (( $dh = opendir($source)) === false )
		{
		_error( __FILE__, __LINE__, "rcopy(): unable to open source directory '$source'" );

		return  false ;
		}

	while (false !== ($filename = readdir( $dh )))
		{
		if (( $filename != ".") && ( $filename != ".." ))
			{
			if ( ! rcopy( "$source/$filename", "$dest/$filename" ))
				{
				return  false ;
				}
			}
		}

	closedir($dh);

	return  true ;

	}	// end of if it's a directory

}	// end of rcopy()

// -----------------------------------------------------

/**
* recursive delete - recursively deletes a directory 
*
* recursively deletes files and directories. Will not recurse into
* a directory UNLESS it has an .fvapp_dir file in it. This will prevent
* the nightmare scenario of accidently deleting everything .... 
* application writers will have to add .fvapp_dir files in each directoy
* that is to be copied into DOCUMENT_ROOT.
*/

function rdelete( $pathname )
{

// set to false for disabling of actions and turning on a trace.

$live = true;

//_ddt( __FILE__, __LINE__, "rdelete(): deleting '$pathname'" );

// does the pathname exists?

if ( $live && !file_exists( $pathname ))
	return  false ;

// if the source is not a directory, just do a straight
// unlink. is_dir returns true for symbolic links, so catch them here 
// explicitly.

if ( !is_dir( $pathname ) || is_link($pathname ))
	{

	if ( $live && ! unlink( $pathname ) )
		{
		_error( __FILE__, __LINE__, "rdelete(): error deleting '$pathname'" );
		return  false ;
		}

	if ( ! $live )
		{
		print( "Would have unlinked '$pathname'\n" );
		}

	return  true ;
	}
else
	{

	// now delete the contents of the directory

	if (( $dh = opendir($pathname)) === false )
		{
		_error( __FILE__, __LINE__, "rdelete(): unable to open directory '$pathname'" );

		return  false ;
		}

	while (false !== ($filename = readdir( $dh )))
		{
		if (( $filename != ".") && ( $filename != ".." ))
			{

			// if it's a file, unlink it, if it's a directory recurse.

			if ( is_file( "$pathname/$filename" ) )
				{
				if ( $live && ! unlink( "$pathname/$filename" ) )
					{
					_error( __FILE__, __LINE__, "rdelete(): unable to unlink '$pathname/$filename'" );
					return  false ;
					}

				if ( ! $live )
					{
					print( "Would have unlinked '$pathname/$filename'\n" );
					}

				}
			else if ( is_dir( "$pathname/$filename" ) )
				{
				if ( ! rdelete( "$pathname/$filename" ) )
					{
					return  false ;
					}

				}
			else
				{
				_error( __FILE__, __LINE__, "rdelete(): unrecognized file type '$pathname/$filename'" );
				return  false ;
				}
			}
		}

	closedir($dh);

	// now we can remove the directory

	if ( $live && ! rmdir( $pathname ) )
		{
		_error( __FILE__, __LINE__, "rdelete(): unable to rmdir '$pathname'" );
		return  false ;
		}

	if ( ! $live )
		{
		print( "rdelete(): would have removed dir '$pathname'\n" );
		}
		
	return  true ;

	}	// end of if it's a directory

}	// end of rdelete()

// END
?>
