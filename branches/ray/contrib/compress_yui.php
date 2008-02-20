<?
// This is script that uses the YUI compressor (http://www.julienlecomte.net/blog/2007/08/11/)
// It yields gradually better results than the dojo comressor, but it produces unreadable code
die("Run this script to batch-compress the current Xinha snapshot. To run the script, open the file and comment out the die() command");

error_reporting(E_ALL);
ini_set('show_errors',1);

$return = array();
function scan($dir, $durl = '',$min_size="3000")
{
	static $seen = array();
	global $return;
	$files = array();

	$dir = realpath($dir);
	if(isset($seen[$dir]))
	{
		return $files;
	}
	$seen[$dir] = TRUE;
	$dh = @opendir($dir);


	while($dh && ($file = readdir($dh)))
	{
		if($file !== '.' && $file !== '..')
		{
			$path = realpath($dir . '/' . $file);
			$url  = $durl . '/' . $file;

			if(preg_match("/\.svn|lang/",$path)) continue;
			
			if(is_dir($path))
			{
				scan($path);
			}
			elseif(is_file($path))
			{
				if(!preg_match("/\.(js|css)$/",$path) || filesize($path) < $min_size) continue;
				$return[] =  $path;
			}

		}
	}
	@closedir($dh);

	return $files;
}
scan("../",0);
$cwd = getcwd();
print "Processing ".count($return)." files<br />";

$prefix = "/* This compressed file is part of Xinha. For uncomressed sources, forum, and bug reports, go to xinha.org */";
$core_prefix = '
  /*--------------------------------------------------------------------------
    --  Xinha (is not htmlArea) - http://xinha.org
    --
    --  Use of Xinha is granted by the terms of the htmlArea License (based on
    --  BSD license)  please read license.txt in this package for details.
    --
    --  Copyright (c) 2005-2008 Xinha Developer Team and contributors
    --  
    --  Xinha was originally based on work by Mihai Bazon which is:
    --      Copyright (c) 2003-2004 dynarch.com.
    --      Copyright (c) 2002-2003 interactivetools.com, inc.
    --      This copyright notice MUST stay intact for use.
    -------------------------------------------------------------------------*/
';

foreach ($return as $file)
{
	set_time_limit ( 60 ); 
	print "Processing $file<br />";
	flush();
	$ext = preg_replace('/.*?(\.js|\.css)$/','$1',$file);
	
	file_put_contents($file."_uncompr${ext}", preg_replace('/(\/\/[^\n]*)?(?![*])\\\[\n]/','',file_get_contents($file)));

	exec("echo \"".(preg_match('/XinhaCore.js$/',$file) ? $prefix.$core_prefix : $prefix)."\" > $file && java -jar ${cwd}/yuicompressor-2.2.5.jar  --charset UTF-8 ${file}_uncompr${ext} >> $file 2>&1");
	if (preg_match('/\d+:\d+:syntax error/',file_get_contents($file)))
	{
		unlink($file);
		rename($file."_uncompr${ext}",$file);
	}
	else
	{
		unlink($file."_uncompr${ext}");
	}

}
print "Operation complete."
?>