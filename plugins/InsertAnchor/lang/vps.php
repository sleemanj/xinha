<?
//das wird ben�tigt damit _() verf�gbar ist
require_once "../../../../../../../cfg/config.inc.php";
require_once "../../../../../../../src/Main.php";
$main = new Main(false);
?>
// I18N constants

// LANG: "de", ENCODING: UTF-8 | ISO-8859-1

InsertAnchor.I18N = {
  "IA-insert-anchor" : "<?php echo _("Anker einf�gen") ?>",
  "IA-anchorname" :    "<?php echo _("Ankername") ?>"
};
