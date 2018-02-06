/** 
 ListOperations for Xinha
 ===============================================================================
 
 Provides some additional features for working with lists in Xinha.
 
 At present the only feature is
 
 {{{
   xinha_config.ListOperations.tabToIndent = true;
 }}}
 
 which causes pressig tab ina list to indent (or shift-tab to detent) to 
 a new list level.
 
 Note that the HTML structure of this list may be, for example
 {{{
   <ul>
     <li>Item 1</li>
     <ul>
       <li>Item 1.1</li>
     </ul>
     <li>Item 2</li>
   </ul>
 }}}
 
See ticket:1614
*/

ListOperations._pluginInfo = {
  name          : "ListOperations",
  version       : "1.0",
  developer     : "The Xinha Core Developer Team",
  developer_url : "http://trac.xinha.org/ticket/1614",
  sponsor       : "",
  sponsor_url   : "",
  license       : "htmlArea"
}

function ListOperations(editor)
{
  this.editor = editor;
}

ListOperations.prototype.onKeyPress = function(ev)
{
  var editor = this.editor;
   
  if( ev.keyCode !== 9 ) { return; }

  var sel = editor.getSelection(),
      rng = editor.createRange(sel),
      containing_list = editor._getFirstAncestorAndWhy(sel, ["ol", "ul"]);

  if( containing_list[0] === null ) {
      return;
  }

  containing_list_type = ["ol", "ul"][containing_list[1]];
  containing_list = containing_list[0];

  if( rng.startOffset !== 0 ) {
    return;
  }

  ev.preventDefault();

  if( ev.shiftKey ) {
    if( editor._getFirstAncestorForNodeAndWhy(containing_list, ["ol", "ul"])[0] !== null ) {
      editor.execCommand("outdent");
    }
  } else {
    editor.execCommand("indent");
  }

  return true;
}
