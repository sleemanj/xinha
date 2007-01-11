/** Returns a node after which we can insert other nodes, in the current
 * selection.  The selection is removed.  It splits a text node, if needed.
 */
HTMLArea.prototype.insertNodeAtSelection = function(toBeInserted)
{
  return null;  // this function not yet used for IE <FIXME>
};

// Returns the deepest node that contains both endpoints of the selection.
HTMLArea.prototype.getParentElement = function(sel)
{
  if ( typeof sel == 'undefined' )
  {
    sel = this._getSelection();
  }
  var range = this._createRange(sel);
  switch ( sel.type )
  {
    case "Text":
      // try to circumvent a bug in IE:
      // the parent returned is not always the real parent element
      var parent = range.parentElement();
      while ( true )
      {
        var TestRange = range.duplicate();
        TestRange.moveToElementText(parent);
        if ( TestRange.inRange(range) )
        {
          break;
        }
        if ( ( parent.nodeType != 1 ) || ( parent.tagName.toLowerCase() == 'body' ) )
        {
          break;
        }
        parent = parent.parentElement;
      }
      return parent;
    case "None":
      // It seems that even for selection of type "None",
      // there _is_ a parent element and it's value is not
      // only correct, but very important to us.  MSIE is
      // certainly the buggiest browser in the world and I
      // wonder, God, how can Earth stand it?
      return range.parentElement();
    case "Control":
      return range.item(0);
    default:
      return this._doc.body;
  }
};
  
/**
 * Returns the selected element, if any.  That is,
 * the element that you have last selected in the "path"
 * at the bottom of the editor, or a "control" (eg image)
 *
 * @returns null | element
 */
HTMLArea.prototype._activeElement = function(sel)
{
  if ( ( sel === null ) || this._selectionEmpty(sel) )
  {
    return null;
  }

  if ( sel.type.toLowerCase() == "control" )
  {
    return sel.createRange().item(0);
  }
  else
  {
    // If it's not a control, then we need to see if
    // the selection is the _entire_ text of a parent node
    // (this happens when a node is clicked in the tree)
    var range = sel.createRange();
    var p_elm = this.getParentElement(sel);
    if ( p_elm.innerHTML == range.htmlText )
    {
      return p_elm;
    }
    /*
    if ( p_elm )
    {
      var p_rng = this._doc.body.createTextRange();
      p_rng.moveToElementText(p_elm);
      if ( p_rng.isEqual(range) )
      {
        return p_elm;
      }
    }

    if ( range.parentElement() )
    {
      var prnt_range = this._doc.body.createTextRange();
      prnt_range.moveToElementText(range.parentElement());
      if ( prnt_range.isEqual(range) )
      {
        return range.parentElement();
      }
    }
    */
    return null;
  }
};

  HTMLArea.prototype._selectionEmpty = function(sel)
{
  if ( !sel )
  {
    return true;
  }

  return this._createRange(sel).htmlText === '';
};

// Selects the contents inside the given node
HTMLArea.prototype.selectNodeContents = function(node, pos)
{
  this.focusEditor();
  this.forceRedraw();
  var range;
  var collapsed = typeof pos == "undefined" ? true : false;
  // Tables and Images get selected as "objects" rather than the text contents
  if ( collapsed && node.tagName && node.tagName.toLowerCase().match(/table|img|input|select|textarea/) )
  {
    range = this._doc.body.createControlRange();
    range.add(node);
  }
  else
  {
    range = this._doc.body.createTextRange();
    range.moveToElementText(node);
    //(collapsed) && range.collapse(pos);
  }
  range.select();
};
  
/** Call this function to insert HTML code at the current position.  It deletes
 * the selection, if any.
 */
HTMLArea.prototype.insertHTML = function(html)
{
  var sel = this._getSelection();
  var range = this._createRange(sel);
  this.focusEditor();
  range.pasteHTML(html);
};


// Retrieve the selected block
HTMLArea.prototype.getSelectedHTML = function()
{
  var sel = this._getSelection();
  var range = this._createRange(sel);
  
  // Need to be careful of control ranges which won't have htmlText
  if( range.htmlText )
  {
    return range.htmlText;
  }
  else if(range.length >= 1)
  {
    return range.item(0).outerHTML;
  }
  
  return '';
};

HTMLArea.prototype.checkBackspace = function()
{
  var sel = this._getSelection();
  if ( sel.type == 'Control' )
  {
    var elm = this._activeElement(sel);
    HTMLArea.removeFromParent(elm);
    return true;
  }

  // This bit of code preseves links when you backspace over the
  // endpoint of the link in IE.  Without it, if you have something like
  //    link_here |
  // where | is the cursor, and backspace over the last e, then the link
  // will de-link, which is a bit tedious
  var range = this._createRange(sel);
  var r2 = range.duplicate();
  r2.moveStart("character", -1);
  var a = r2.parentElement();
  // @fixme: why using again a regex to test a single string ???
  if ( a != range.parentElement() && ( /^a$/i.test(a.tagName) ) )
  {
    r2.collapse(true);
    r2.moveEnd("character", 1);
    r2.pasteHTML('');
    r2.select();
    return true;
  }
};
  
// returns the current selection object
HTMLArea.prototype._getSelection = function()
{
  return this._doc.selection;
};

// returns a range for the current selection
HTMLArea.prototype._createRange = function(sel)
{
  return sel.createRange();
};

HTMLArea.getOuterHTML = function(element)
{
  return element.outerHTML;
};
  
//What is this supposed to do??? it's never used 
HTMLArea.prototype._formatBlock = function(block_format)
{

};

HTMLArea._browserSpecificFunctionsLoaded = true;