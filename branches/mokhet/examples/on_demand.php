<?php
$content1 = array_key_exists('ta1', $_POST) ? $_POST['ta1'] : '<p>Content ONE here</p>';
$content2 = array_key_exists('ta2', $_POST) ? $_POST['ta2'] : '<p>Content TWO here</p>';
// Entitize contents
// Please referer to http://xinha.python-hosting.com/wiki/Entize
$content1 = htmlspecialchars($content1, ENT_QUOTES, 'utf-8');
$content2 = htmlspecialchars($content2, ENT_QUOTES, 'utf-8');
//echo dirname(__FILE__);
//echo $_SERVER["SERVER_NAME"];
?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Xinha example - Generate and Degenerate on demand</title>
<script type="text/javascript">
/************************************************************************
 * Please refer to http://xinha.python-hosting.com/wiki/NewbieGuide
 ************************************************************************/
var _editor_url = document.location.href.replace(/examples\/on_demand\.php.*/, '');
var _editor_lang = "en";
</script>
<!-- Load up the actual editor core -->
<script type="text/javascript" src="../htmlarea.js"></script>
<script type="text/javascript">
// preparation for Xinha namespace replacement
// should be defined as Xinha in core of course
var Xinha = HTMLArea;

/* helper */
function $(e) { return typeof e == 'string' ? document.getElementById(e) : e; }

/* hide and show panels */
function Panel(id)
{
  var panel = $('panel' + id);
  if ( Panel.current !== null )
  {
    $('panel' + Panel.current).className = 'hideme';
  }
  Panel.current = id;
  panel.className = '';
}
Panel.current = 'Edit';

function manageEditor(id)
{
  var btn = $('btngeneration' + id);
  btn.value = ' - in progress - ';
  if ( btn.generated )
  {
    degenerateEditor(id);
  }
  else
  {
    generateEditor(id);
  }
}

function generateEditor(id, gene)
{
  // load the plugins needed
  
  // create the object
  var editor = new Xinha('ta' + id);
  
  // set the ongenerate function
  editor._onGenerate = function()
  {
    var btn = $('btngeneration' + id);
    btn.generated = true;
    btn.value = ' - Degenerate ' + id + ' - ';
  };
  
  // set the ondispose function

  editor._onDispose = function()
  {
    var btn = $('btngeneration' + id);
    btn.generated = false;
    btn.value = ' - Regenerate ' + id + ' - ';
  };

  // manipulate the configuration
  editor.config.onDisposeRemoveUI = true;

  // generate
  editor.generate();
}

function degenerateEditor(id)
{
  // get the object reference
  var editor = Xinha.getEditor('ta' + id);
  // degenerate
  if ( editor )
  {
    editor.dispose();
  }
}

</script>
<link type="text/css" rel="stylesheet" title="blue-look" href="../skins/blue-look/skin.css">
<link type="text/css" rel="alternate stylesheet" title="green-look" href="../skins/green-look/skin.css">
<link type="text/css" rel="alternate stylesheet" title="xp-blue" href="../skins/xp-blue/skin.css">
<link type="text/css" rel="alternate stylesheet" title="xp-green" href="../skins/xp-green/skin.css">
<link type="text/css" rel="alternate stylesheet" title="inditreuse" href="../skins/inditreuse/skin.css">
<link type="text/css" rel="alternate stylesheet" title="blue-metallic" href="../skins/blue-metallic/skin.css">
<style type="text/css">
* { margin:0; padding:0; }
.hideme { display:none; }

#menu
{
padding-left: 0;
margin-left: 0;
background-color: #036;
color: white;
width: 100%;
font-family: arial, helvetica, sans-serif;
}

#menu li
{
cursor:pointer;
display: inline;
padding: 0.2em 1em;
background-color: #036;
color: white;
text-decoration: none;
float: left;
border-right: 1px solid #fff;
}

#menu li:hover
{
background-color: #369;
color: #fff;
}
#panels
{
clear:both;
border:1px solid #036;
padding:2px;
}
#resultcontent
{
border:1px solid black;
padding:2px;
}
</style>
</head>

<body>

<form action="on_demand.php" method="post" id="formulaire">

<ul id="menu">
<li onclick="Panel('Edit');">Editors</li>
<li onclick="Panel('Conf');">Configuration</li>
<li onclick="Panel('Plug');">Plugins</li>
</ul>
<div id="panels">
<div id="panelEdit">
<input type="button" id="btngeneration1" value=" - Generate 1 - " onclick="manageEditor(1);">
<input type="button" id="btngeneration2" value=" - Generate 2 - " onclick="manageEditor(2);">
&nbsp;&nbsp;&nbsp;
<input type="submit" value="submit with HTML" title="form is submit with this input type=submit">
<input type="button" value="submit with javascript" title="form is submited with $('formulaire').submit();" onclick="$('formulaire').submit();">
<br>
<textarea id="ta1" name="ta1" rows="10" cols="80"><?php echo $content1; ?></textarea>
<textarea id="ta2" name="ta2" rows="10" cols="80"><?php echo $content2; ?></textarea>
</div>
<div id="panelConf" class="hideme">
<p>here we will select some configurations options, but not yet</p>
<?php
//  this.width  = "auto";
//  this.height = "auto";
//  this.panel_dimensions =

$conf = array(
  'sizeIncludesBars' => array('bool', TRUE),
  'sizeIncludesPanels' => array('bool', TRUE),
  'statusBar' => array('bool', TRUE),
  'htmlareaPaste' => array('bool', FALSE),
  'mozParaHandler' => array('select', 'best,built-in,dirty'),
  'undoSteps' => array('int', 20),
  'undoTimeout' => array('bool', TRUE),
  'changeJustifyWithDirection' => array('bool', FALSE),
  'fullPage' => array('bool', FALSE),
  'pageStyle' => array('str', ''),
  'sizeIncludesBars' => array('bool', TRUE),
  'sizeIncludesBars' => array('bool', TRUE),
  'sizeIncludesBars' => array('bool', TRUE),
  'sizeIncludesBars' => array('bool', TRUE),
  'sizeIncludesBars' => array('bool', TRUE),
  'sizeIncludesBars' => array('bool', TRUE),
  'sizeIncludesBars' => array('bool', TRUE),
  'sizeIncludesBars' => array('bool', TRUE),
  'sizeIncludesBars' => array('bool', TRUE),
  'sizeIncludesBars' => array('bool', TRUE),
  'sizeIncludesBars' => array('bool', TRUE),
  'sizeIncludesBars' => array('bool', TRUE),
);
?>
</div>
<div id="panelPlug" class="hideme">
<p>here we will select some plugins, but not yet</p>
<?php

?>
</div>

</form>
<div id="resultcontent"></div>
</body>
</html>