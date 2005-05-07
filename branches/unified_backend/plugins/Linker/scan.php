<?php

/**
* scan.php Linker backend
*
* @author James Sleeman
* @author Yermo Lamers http://www.formvista.com/contact.html unified backend modifications.
* @copyright Gogo Code http://code.gogo.co.nz
*/

/**
* Xinha PHP backend master config file
*
* we assume the current working directory is plugins/Linker
*/

require_once( "../../backends/backend_conf.php" );

/**
* debugging library
*/

require_once( "../../ddt/ddt.php" );

// by default we'll point linker at the examples document directory 

$dir          = XINHA_INSTALL_ROOT . "/examples"; 

$include      = '/\.(php|shtml|html|htm|shtm|cgi|txt|doc|pdf|rtf|xls|csv)$/';
$exclude      = '';
$dirinclude   = '';
$direxclude   = '/(^|\/)[._]|htmlarea/'; // Exclude the htmlarea tree by default

// -------------------------------------------------------------------------------

_ddt( __FILE__, __LINE__, "scan.php: top" );

$hash = '';
foreach(explode(',', 'dir,include,exclude,dirinclude,direxclude') as $k)
	{
	if (isset($_REQUEST[$k]))
		{

		if (get_magic_quotes_gpc())
			{
			$_REQUEST[$k] = stripslashes($_REQUEST[$k]);
			}

		$hash .= $k . '=' . $_REQUEST[$k];
		$$k = $_REQUEST[$k];
		}
	}

if ($hash)
	{
	session_start();
	if (!isset($_SESSION[sha1($hash)]))
		{
		?>
		[ ];
		<?php
		exit;
      }
    }

// --------------------------------------------------------------

/**
* scan a directory
*/

function scan($dir, $durl = '')
	{
	global $include, $exclude, $dirinclude, $direxclude;
	static $seen = array();

	_ddt( __FILE__, __LINE__, "scan(): to with dir '" . $dir . "' and durl '" . $durl . "'" );

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

			if(($dirinclude && !preg_match($dirinclude, $url)) || ($direxclude && preg_match($direxclude, $url))) continue;
			if(is_dir($path))
				{
				if($subdir = scan($path, $url))
					{
					$files[] = array('url'=>$url, 'children'=>$subdir);
					}
				}
			elseif(is_file($path))
				{
				if(($include && !preg_match($include, $url)) || ($exclude && preg_match($exclude, $url))) continue;
				$files[] = array('url'=>$url);
				}

			}
		}

	@closedir($dh);

	return dirsort($files);

	}	// end of scan()

// ----------------------------------------------------------------------

/**
* sort a directory
*/

function dirsort($files)
	{
	usort($files, 'dircomp');
	return $files;
	}

// -----------------------------------------------------------------------

/**
* compare directory entries
*/

function dircomp($a, $b)
	{

	_ddt( __FILE__, __LINE__, "dircomp(): top" );

	if(is_array($a)) 
		{
		_ddt( __FILE__, __LINE__, "dircomp(): a is a directory" );

		foreach ( $a as $name => $value )
			_ddt( __FILE__, __LINE__, "dircomp(): $name => $value" );

		$a = $a["url"];
		}

	if(is_array($b)) 
		{
		_ddt( __FILE__, __LINE__, "dircomp(): b is a directory" );

		$b = $b["url"];
		}

	_ddt( __FILE__, __LINE__, "dircomp(): comparing '$a' with '$b'" );

	return strcmp(strtolower($a), strtolower($b));

	}	// end of dircomp()

// ----------------------------------------------------------------------

/**
* generate javascript array
*/

function to_js( $var, $tabs = 0)
	{

	_ddt( __FILE__, __LINE__, "to_js(): top with var '$var'" );

	if(is_numeric($var))
		{
		return $var;
		}

	if(is_string($var))
		{
		return "'" . js_encode($var) . "'";
		}

	if(is_array($var))
		{
		$useObject = false;
		foreach(array_keys($var) as $k) 
			{
			if(!is_numeric($k)) $useObject = true;
			}

		$js = array();

		foreach($var as $k => $v)
			{
			$i = "";

			if($useObject) 
				{
				if(preg_match('#[a-zA-Z]+[a-zA-Z0-9]*#', $k)) 
					{
					$i .= "$k: ";
					} 
				else 
					{
					$i .= "'$k': ";
					}
				}
			
			$i .= to_js($v, $tabs + 1);
			$js[] = $i;
			}

        if ($useObject) 
		  	{
			$ret = "{\n" . tabify(implode(",\n", $js), $tabs) . "\n}";
			} 
		else 
			{
			$ret = "[\n" . tabify(implode(",\n", $js), $tabs) . "\n]";
			}
		return $ret;

		}

	return 'null';
	
	}	// end of to_js()

// ------------------------------------------------------------------------

/**
* tabify()
*/

function tabify($text, $tabs)
	{
	if($text)
		{
		return str_repeat("  ", $tabs) . preg_replace('/\n(.)/', "\n" . str_repeat("  ", $tabs) . "\$1", $text);
		}
	}

// ---------------------------------------------------------------------

/**
* js_encode()
*/

function js_encode($string)
	{
	static $strings = "\\,\",',%,&,<,>,{,},@,\n,\r";

	if(!is_array($strings))
		{
		$tr = array();
		foreach(explode(',', $strings) as $chr)
			{
			$tr[$chr] = sprintf('\x%02X', ord($chr));
			}
		$strings = $tr;
		}

	return strtr($string, $strings);
	}

/**
* send out the resulting javascript array.
*/

$javascript_array = to_js(scan($dir));

// if you want to see what's communicated back to the browser uncomment this. You will
// get the output in an error popup.
//
// _ddtOn();

_ddt( __FILE__, __LINE__, "scan.php: Resulting array is '" + $javascript_array + "'" );

echo $javascript_array;

// END
?>
