<?php

/*
As AJAX calls cannot set cookies, we set up the session for the authentication demonstration right here; that way, the session cookie
will travel with every request.
*/
if (!session_start()) die('session_start() failed');

/*
set a 'secret' value to doublecheck the legality of the session: did it originate from here?
*/
$_SESSION['FileManager'] = 'DemoMagick';

/*
Note that for the sake of the demo, we simulate an UNauthorized user in the session.
*/
$_SESSION['UploadAuth'] = 'NO';


/* the remainder of the code does not need access to the session data. */
session_write_close();

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>MooTools FileManager TinyMCE example</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="shortcut icon" href="http://og5.net/christoph/favicon.png" />
	<style type="text/css">
	body {
		font-size: 11px;
		font-family: Tahoma, sans-serif;
	}

	h1 {
		margin: 0 0 10px 0;
		padding: 0;

		color: #666;
		font-weight: normal;
		font-size: 24px;
		letter-spacing: 1px;
		word-spacing: 2px;
		line-height: 22px;
		min-height: 25px;
	}

	h1 span {
		font-size: 11px;
		letter-spacing: 0;
		word-spacing: 0;
		text-shadow: none;
	}

	.blue { color: #1f52b0; }

	div.content {
		min-height: 200px;
		margin: 23px 34px;
		padding: 10px 17px;
		border: 1px solid #b2b2b2;
		background: #fff;
		box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 2px;
		-moz-box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 2px;
		-webkit-box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 2px;
	}

	div.content div {
		margin: 10px 0;
	}
	</style>

	<link rel="stylesheet" media="all" type="text/css" href="../Assets/js/milkbox/css/milkbox.css" />
	<link rel="stylesheet" media="all" type="text/css" href="../Assets/Css/FileManager.css" />
	<link rel="stylesheet" media="all" type="text/css" href="../Assets/Css/Additions.css" />

	<script type="text/javascript" src="../../../../../lib/includes/js/tiny_mce/jscripts/tiny_mce/tiny_mce_src.js"></script>

	<script type="text/javascript" src="mootools-core.js"></script>
	<script type="text/javascript" src="mootools-more.js"></script>

	<script type="text/javascript" src="../Source/FileManager.js"></script>
	<script type="text/javascript" src="../Source/Uploader/Fx.ProgressBar.js"></script>
	<script type="text/javascript" src="../Source/Uploader/Swiff.Uploader.js"></script>
	<script type="text/javascript" src="../Source/Uploader.js"></script>
	<script type="text/javascript" src="../Language/Language.en.js"></script>
	<script type="text/javascript" src="../Language/Language.de.js"></script>

	<script type="text/javascript" src="../Source/FileManager.TinyMCE.js"></script>

	<script type="text/javascript">
		tinyMCE.init({
			mode: 'textareas',
			language: 'en',
			theme: 'advanced',
			skin: 'o2k7',
			skin_variant: 'silver',
			plugins: 'advimage,advlink,inlinepopups',
			theme_advanced_toolbar_location: 'top',
			theme_advanced_buttons1: 'link,unlink,image,forecolor,backcolor,|,sub,sup,|,hr,charmap,|,undo,redo,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,outdent,indent,blockquote,bullist,numlist',
			theme_advanced_buttons2: '',
			theme_advanced_buttons3: '',

			width: '100%',
			height: '300px',

			document_base_url: '',  // not /c/ !

			/* Here goes the Magic */
			file_browser_callback: FileManager.TinyMCE(function(type){
				return {
					url: 'manager.php?exhibit=A', // 'manager.php', but with a bogus query parameter included: latest FM can cope with such an URI
					assetBasePath: '../Assets', // '/c/lib/includes/js/mootools-filemanager/Assets',
					language: 'en',
					selectable: true,
					destroy: true,
					upload: true,
					rename: true,
					download: true,
					createFolders: true,
					hideClose: false,
					hideOverlay: false,
					uploadAuthData: {
						session: 'MySessionData'
					},
					// and a couple of extra user defined parameters sent with EVERY request:
					propagateData: {
						editor_reqtype: type,
						origin: 'demo-tinyMCE'
					}
				};
			})
		});

		window.addEvent('domready', function(){
			$('getEditorText').addEvent('click', function(e){
				e.stop();
				$('editorContent').set('html', tinyMCE.activeEditor.getContent());
			});
		});
	</script>
</head>
<body>
<div id="content" class="content">
	<h1>FileManager Demo</h1>
	<div style="float: right;"><a href="index.php">Go to the examples' overview</a></div>

	<div style="clear: both;">
		<textarea>Add an image or a link to a file!</textarea>
		<button id="getEditorText" name="getEditorTextButton">Get editor content</button>
	</div>
	<div id="editorContent"></div>
</div>
</body>
</html>