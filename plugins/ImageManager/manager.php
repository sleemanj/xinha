<?php
/**
 * The main GUI for the ImageManager.
 * @author $Author: Wei Zhuo $
 * @version $Id: manager.php 26 2004-03-31 02:35:21Z Wei Zhuo $
 * @package ImageManager
 */

	require_once('config.inc.php');
	require_once('ddt.php');
	require_once('Classes/ImageManager.php');
	
	$manager = new ImageManager($IMConfig);
	$dirs = $manager->getDirs();

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html>
<head>
	<title>Insert Image</title>
<script type="text/javascript">

<?php // temporary. An ImageManager rewrite will take care of this kludge. ?>

_backend_url = "<?php print $IMConfig['backend_url']; ?>";
</script>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <link href="<?php print $IMConfig['base_url'];?>assets/manager.css" rel="stylesheet" type="text/css" />	
<script type="text/javascript" src="../../popups/popup.js"></script>
<script type="text/javascript" src="<?php print $IMConfig['base_url'];?>assets/dialog.js"></script>
<script type="text/javascript">
/*<![CDATA[*/
	window.resizeTo(600, 460);

	if(window.opener)
		HTMLArea = window.opener.HTMLArea;

	var thumbdir = "<?php echo $IMConfig['thumbnail_dir']; ?>";
	var base_url = "<?php echo $manager->getImagesURL(); ?>";
/*]]>*/
</script>
<script type="text/javascript" src="<?php print $IMConfig['base_url'];?>assets/manager.js"></script>
</head>
<body>
<div class="title">Insert Image</div>
<form action="<?php print $IMConfig['backend_url'] ?>" id="uploadForm" method="post" enctype="multipart/form-data">

<?php // we have to propagate our values through forms ?>

<input type="hidden" name="__plugin" value="ImageManager">
<input type="hidden" name="__function" value="images">

<fieldset><legend>Image Manager</legend>
<div class="dirs">
	<label for="dirPath">Directory</label>
	<select name="dir" class="dirWidth" id="dirPath" onchange="updateDir(this)">
	<option value="/">/</option>
<?php foreach($dirs as $relative=>$fullpath) { ?>
		<option value="<?php echo rawurlencode($relative); ?>"><?php echo $relative; ?></option>
<?php } ?>
	</select>
	<a href="#" onclick="javascript: goUpDir();" title="Directory Up"><img src="<?php print $IMConfig['base_url']; ?>img/btnFolderUp.gif" height="15" width="15" alt="Directory Up" /></a>
<?php if($IMConfig['safe_mode'] == false && $IMConfig['allow_new_dir']) { ?>
	<a href="#" onclick="newFolder();" title="New Folder"><img src="<?php print $IMConfig['base_url']; ?>img/btnFolderNew.gif" height="15" width="15" alt="New Folder" /></a>
<?php } ?>
	<div id="messages" style="display: none;"><span id="message"></span><img SRC="<?php print $IMConfig['base_url']; ?>img/dots.gif" width="22" height="12" alt="..." /></div>
	<iframe src="<?php print $IMConfig['backend_url']; ?>__function=images" name="imgManager" id="imgManager" class="imageFrame" scrolling="auto" title="Image Selection" frameborder="0"></iframe>
</div>
</fieldset>
<!-- image properties -->
	<table class="inputTable">
		<tr>
			<td align="right"><label for="f_url">Image File</label></td>
			<td><input type="text" id="f_url" class="largelWidth" value="" /></td>
			<td rowspan="3" align="right">&nbsp;</td>
			<td align="right"><label for="f_width">Width</label></td>
			<td><input type="text" id="f_width" class="smallWidth" value="" onchange="javascript:checkConstrains('width');"/></td>
			<td rowspan="2" align="right"><img src="<?php print $IMConfig['base_url']; ?>img/locked.gif" id="imgLock" width="25" height="32" alt="Constrained Proportions" /></td>
			<td rowspan="3" align="right">&nbsp;</td>
			<td align="right"><label for="f_vert">V Space</label></td>
			<td><input type="text" id="f_vert" class="smallWidth" value="" /></td>
		</tr>		
		<tr>
			<td align="right"><label for="f_alt">Alt</label></td>
			<td><input type="text" id="f_alt" class="largelWidth" value="" /></td>
			<td align="right"><label for="f_height">Height</label></td>
			<td><input type="text" id="f_height" class="smallWidth" value="" onchange="javascript:checkConstrains('height');"/></td>
			<td align="right"><label for="f_horiz">H Space</label></td>
			<td><input type="text" id="f_horiz" class="smallWidth" value="" /></td>
		</tr>
		<tr>
<?php if($IMConfig['allow_upload'] == true) { ?>
			<td align="right"><label for="upload">Upload</label></td>
			<td>
				<table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td><input type="file" name="upload" id="upload"/></td>
                    <td>&nbsp;<button type="submit" name="submit" onclick="doUpload();"/>Upload</button></td>
                  </tr>
                </table>
			</td>
<?php } else { ?>
			<td colspan="2"></td>
<?php } ?>
			<td align="right"><label for="f_align">Alignment:</label></td>
			<td colspan="2">
				<select size="1" id="f_align"  title="Positioning of this image">
				  <option value=""                             >Not set</option>
				  <option value="left"                         >Left</option>
				  <option value="right"                        >Right</option>
				  <option value="texttop"                      >Texttop</option>
				  <option value="absmiddle"                    >Absmiddle</option>
				  <option value="baseline" selected="selected" >Baseline</option>
				  <option value="absbottom"                    >Absbottom</option>
				  <option value="bottom"                       >Bottom</option>
				  <option value="middle"                       >Middle</option>
				  <option value="top"                          >Top</option>
				</select>
			</td>
			<td align="right"><label for="f_border">Border</label></td>
			<td><input type="text" id="f_border" class="smallWidth" value="" /></td>
		</tr>
		<tr> 
         <td colspan="4" align="right">
				<input type="hidden" id="orginal_width" />
				<input type="hidden" id="orginal_height" />
            <input type="checkbox" id="constrain_prop" checked="checked" onclick="javascript:toggleConstrains(this);" />
          </td>
          <td colspan="5"><label for="constrain_prop">Constrain Proportions</label></td>
      </tr>
	</table>
<!--// image properties -->	
	<div style="text-align: right;"> 
          <hr />
		  <button type="button" class="buttons" onclick="return refresh();">Refresh</button>
          <button type="button" class="buttons" onclick="return onOK();">OK</button>
          <button type="button" class="buttons" onclick="return onCancel();">Cancel</button>
    </div>
</form>
</body>
</html>
