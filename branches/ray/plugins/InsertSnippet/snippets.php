<?php header("Content-type: text/xml");
print '<?xml version="1.0" encoding="UTF-8"?>'."\n";
?>
<snXML>
<categories>
<?php
foreach ($categories as $c) {
	print '<c n="'.$c.'" />'."\n"; 
}

?>
</categories>
<snippets>
<?php
foreach ($snippets as $s) {
	print '<s n="'.$s['name'].'" v="'.$s['varname'].'" c="'.$s['category'].'">
<![CDATA[
	'.$s['html'].'
]]>
</s>'."\n"; 
}
?>
</snippets>
</snXML>