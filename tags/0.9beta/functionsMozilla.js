/** Returns a node after which we can insert other nodes, in the current
 * selection.  The selection is removed.  It splits a text node, if needed.
 */
HTMLArea.prototype.insertNodeAtSelection = function(toBeInserted)
{
  var sel = this._getSelection();
  var range = this._createRange(sel);
  // remove the current selection
  sel.removeAllRanges();
  range.deleteContents();
  var node = range.startContainer;
  var pos = range.startOffset;
  var selnode = toBeInserted;
  switch ( node.nodeType )
  {
    case 3: // Node.TEXT_NODE
      // we have to split it at the caret position.
      if ( toBeInserted.nodeType == 3 )
      {
        // do optimized insertion
        node.insertData(pos, toBeInserted.data);
        range = this._createRange();
        range.setEnd(node, pos + toBeInserted.length);
        range.setStart(node, pos + toBeInserted.length);
        sel.addRange(range);
      }
      else
      {
        node = node.splitText(pos);
        if ( toBeInserted.nodeType == 11 /* Node.DOCUMENT_FRAGMENT_NODE */ )
        {
          selnode = selnode.firstChild;
        }
        node.parentNode.insertBefore(toBeInserted, node);
        this.selectNodeContents(selnode);
        this.updateToolbar();
      }
    break;
    case 1: // Node.ELEMENT_NODE
      if ( toBeInserted.nodeType == 11 /* Node.DOCUMENT_FRAGMENT_NODE */ )
      {
        selnode = selnode.firstChild;
      }
      node.insertBefore(toBeInserted, node.childNodes[pos]);
      this.selectNodeContents(selnode);
      this.updateToolbar();
    break;
  }
};
  
// Returns the deepest node that contains both endpoints of the selection.
HTMLArea.prototype.getParentElement = function(sel)
{
  if ( typeof sel == 'undefined' )
  {
    sel = this._getSelection();
  }
  var range = this._createRange(sel);
  try
  {
    var p = range.commonAncestorContainer;
    if ( !range.collapsed && range.startContainer == range.endContainer &&
        range.startOffset - range.endOffset <= 1 && range.startContainer.hasChildNodes() )
    {
      p = range.startContainer.childNodes[range.startOffset];
    }
    /*
    alert(range.startContainer + ":" + range.startOffset + "\n" +
          range.endContainer + ":" + range.endOffset);
    */
    while ( p.nodeType == 3 )
    {
      p = p.parentNode;
    }
    return p;
  }
  catch (ex)
  {
    return null;
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

  // For Mozilla we just see if the selection is not collapsed (something is selected)
  // and that the anchor (start of selection) is an element.  This might not be totally
  // correct, we possibly should do a simlar check to IE?
  if ( !sel.isCollapsed )
  {      
    if ( sel.anchorNode.childNodes.length > sel.anchorOffset && sel.anchorNode.childNodes[sel.anchorOffset].nodeType == 1 )
    {
      return sel.anchorNode.childNodes[sel.anchorOffset];
    }
    else if ( sel.anchorNode.nodeType == 1 )
    {
      return sel.anchorNode;
    }
    else
    {
      return null; // return sel.anchorNode.parentNode;
    }
  }
  return null;
};
  
HTMLArea.prototype._selectionEmpty = function(sel)
{
  if ( !sel )
  {
    return true;
  }

  if ( typeof sel.isCollapsed != 'undefined' )
  {      
    return sel.isCollapsed;
  }

  return true;
};
  
// Selects the contents inside the given node
HTMLArea.prototype.selectNodeContents = function(node, pos)
{
  this.focusEditor();
  this.forceRedraw();
  var range;
  var collapsed = typeof pos == "undefined" ? true : false;
  var sel = this._getSelection();
  range = this._doc.createRange();
  // Tables and Images get selected as "objects" rather than the text contents
  if ( collapsed && node.tagName && node.tagName.toLowerCase().match(/table|img|input|textarea|select/) )
  {
    range.selectNode(node);
  }
  else
  {
    range.selectNodeContents(node);
    //(collapsed) && range.collapse(pos);
  }
  sel.removeAllRanges();
  sel.addRange(range);
};
  
/** Call this function to insert HTML code at the current position.  It deletes
 * the selection, if any.
 */
HTMLArea.prototype.insertHTML = function(html)
{
  var sel = this._getSelection();
  var range = this._createRange(sel);
  this.focusEditor();
  // construct a new document fragment with the given HTML
  var fragment = this._doc.createDocumentFragment();
  var div = this._doc.createElement("div");
  div.innerHTML = html;
  while ( div.firstChild )
  {
    // the following call also removes the node from div
    fragment.appendChild(div.firstChild);
  }
  // this also removes the selection
  var node = this.insertNodeAtSelection(fragment);
};

// Retrieve the selected block
HTMLArea.prototype.getSelectedHTML = function()
{
  var sel = this._getSelection();
  var range = this._createRange(sel);
  return HTMLArea.getHTML(range.cloneContents(), false, this);
};
  
HTMLArea.prototype.checkBackspace = function()
{
  var self = this;
  setTimeout(
    function()
    {
      var sel = self._getSelection();
      var range = self._createRange(sel);
      var SC = range.startContainer;
      var SO = range.startOffset;
      var EC = range.endContainer;
      var EO = range.endOffset;
      var newr = SC.nextSibling;
      if ( SC.nodeType == 3 )
      {
        SC = SC.parentNode;
      }
      if ( ! ( /\S/.test(SC.tagName) ) )
      {
        var p = document.createElement("p");
        while ( SC.firstChild )
        {
          p.appendChild(SC.firstChild);
        }
        SC.parentNode.insertBefore(p, SC);
        HTMLArea.removeFromParent(SC);
        var r = range.cloneRange();
        r.setStartBefore(newr);
        r.setEndAfter(newr);
        r.extractContents();
        sel.removeAllRanges();
        sel.addRange(r);
      }
    },
    10);
};

// returns the current selection object
HTMLArea.prototype._getSelection = function()
{
  return this._iframe.contentWindow.getSelection();
};
  
// returns a range for the current selection
HTMLArea.prototype._createRange = function(sel)
{
  this.activateEditor();
  if ( typeof sel != "undefined" )
  {
    try
    {
      return sel.getRangeAt(0);
    }
    catch(ex)
    {
      return this._doc.createRange();
    }
  }
  else
  {
    return this._doc.createRange();
  }
};

HTMLArea.getOuterHTML = function(element)
{
  return (new XMLSerializer()).serializeToString(element);
};
  
//What is this supposed to do??? it's never used 
//ray
HTMLArea.prototype._formatBlock = function(block_format)
{
  var ancestors = this.getAllAncestors();
  var apply_to, x = null;
  // Block format can be a tag followed with class defs
  //  eg div.blue.left
  var target_tag = null;
  var target_classNames = [ ];

  if ( block_format.indexOf('.') >= 0 )
  {
    target_tag = block_format.substr(0, block_format.indexOf('.')).toLowerCase();
    target_classNames = block_format.substr(block_format.indexOf('.'), block_format.length - block_format.indexOf('.')).replace(/\./g, '').replace(/^\s*/, '').replace(/\s*$/, '').split(' ');
  }
  else
  {
    target_tag = block_format.toLowerCase();
  }

  var sel = this._getSelection();
  var rng = this._createRange(sel);

  if ( HTMLArea.is_gecko )
  {
    if ( sel.isCollapsed )
    {
      // With no selection we want to apply to the whole contents of the ancestor block
      apply_to = this._getAncestorBlock(sel);
      if ( apply_to === null )
      {
        // If there wasn't an ancestor, make one.
        apply_to = this._createImplicitBlock(sel, target_tag);
      }
    }
    else
    {
      // With a selection it's more tricky
      switch ( target_tag )
      {

        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'h7':
          apply_to = [];
          var search_tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'];
          for ( var y = 0; y < search_tags.length; y++ )
          {
            var headers = this._doc.getElementsByTagName(search_tags[y]);
            for ( x = 0; x < headers.length; x++ )
            {
              if ( sel.containsNode(headers[x]) )
              {
                apply_to[apply_to.length] = headers[x];
              }
            }
          }
          if ( apply_to.length > 0)
          {
            break;
          }
          // If there wern't any in the selection drop through
        case 'div':
          apply_to = this._doc.createElement(target_tag);
          apply_to.appendChild(rng.extractContents());
          rng.insertNode(apply_to);
        break;

        case 'p':
        case 'center':
        case 'pre':
        case 'ins':
        case 'del':
        case 'blockquote':
        case 'address':
          apply_to = [];
          var paras = this._doc.getElementsByTagName(target_tag);
          for ( x = 0; x < paras.length; x++ )
          {
            if ( sel.containsNode(paras[x]) )
            {
              apply_to[apply_to.length] = paras[x];
            }
          }

          if ( apply_to.length === 0 )
          {
            sel.collapseToStart();
            return this._formatBlock(block_format);
          }
        break;
      }
    }
  }
};


// IE's textRange and selection object is woefully inadequate,
// which means this fancy stuff is gecko only sorry :-|
// Die Bill, Die.  (IE supports it somewhat nativly though)
HTMLArea.prototype.mozKey = function ( ev, keyEvent )
{
  var editor = this;
  var s = editor._getSelection();
  var autoWrap = function (textNode, tag)
  {
    var rightText = textNode.nextSibling;
    if ( typeof tag == 'string')
    {
      tag = editor._doc.createElement(tag);
    }
    var a = textNode.parentNode.insertBefore(tag, rightText);
    HTMLArea.removeFromParent(textNode);
    a.appendChild(textNode);
    rightText.data = ' ' + rightText.data;

    if ( HTMLArea.is_ie )
    {
      var r = editor._createRange(s);
      s.moveToElementText(rightText);
      s.move('character', 1);
    }
    else
    {
      s.collapse(rightText, 1);
    }
    HTMLArea._stopEvent(ev);

    editor._unLink = function()
    {
      var t = a.firstChild;
      a.removeChild(t);
      a.parentNode.insertBefore(t, a);
      HTMLArea.removeFromParent(a);
      editor._unLink = null;
      editor._unlinkOnUndo = false;
    };
    editor._unlinkOnUndo = true;

    return a;
  };

  switch ( ev.which )
  {
    // Space, see if the text just typed looks like a URL, or email address
    // and link it appropriatly
    case 32:
      if ( this.config.convertUrlsToLinks && s && s.isCollapsed && s.anchorNode.nodeType == 3 && s.anchorNode.data.length > 3 && s.anchorNode.data.indexOf('.') >= 0 )
      {
        var midStart = s.anchorNode.data.substring(0,s.anchorOffset).search(/\S{4,}$/);
        if ( midStart == -1 )
        {
          break;
        }

        if ( this._getFirstAncestor(s, 'a') )
        {
          break; // already in an anchor
        }

        var matchData = s.anchorNode.data.substring(0,s.anchorOffset).replace(/^.*?(\S*)$/, '$1');

        var mEmail = matchData.match(HTMLArea.RE_email);
        if ( mEmail )
        {
          var leftTextEmail  = s.anchorNode;
          var rightTextEmail = leftTextEmail.splitText(s.anchorOffset);
          var midTextEmail   = leftTextEmail.splitText(midStart);

          autoWrap(midTextEmail, 'a').href = 'mailto:' + mEmail[0];
          break;
        }

        RE_date = /([0-9]+\.)+/; //could be date or ip or something else ...
        RE_ip = /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/;
        var mUrl = matchData.match(HTMLArea.RE_url);
        if ( mUrl )
        {
          if (RE_date.test(matchData))
          {
            if (!RE_ip.test(matchData)) 
            {
              break;
            }
          } 
          var leftTextUrl  = s.anchorNode;
          var rightTextUrl = leftTextUrl.splitText(s.anchorOffset);
          var midTextUrl   = leftTextUrl.splitText(midStart);
          autoWrap(midTextUrl, 'a').href = (mUrl[1] ? mUrl[1] : 'http://') + mUrl[2];
          break;
        }
      }
    break;

    default:
      if ( ev.keyCode == 27 || ( this._unlinkOnUndo && ev.ctrlKey && ev.which == 122 ) )
      {
        if ( this._unLink )
        {
          this._unLink();
          HTMLArea._stopEvent(ev);
        }
        break;
      }
      else if ( ev.which || ev.keyCode == 8 || ev.keyCode == 46 )
      {
        this._unlinkOnUndo = false;

        if ( s.anchorNode && s.anchorNode.nodeType == 3 )
        {
          // See if we might be changing a link
          var a = this._getFirstAncestor(s, 'a');
          // @todo: we probably need here to inform the setTimeout below that we not changing a link and not start another setTimeout
          if ( !a )
          {
            break; // not an anchor
          } 
          if ( !a._updateAnchTimeout )
          {
            if ( s.anchorNode.data.match(HTMLArea.RE_email) && a.href.match('mailto:' + s.anchorNode.data.trim()) )
            {
              var textNode = s.anchorNode;
              var fnAnchor = function()
              {
                a.href = 'mailto:' + textNode.data.trim();
                // @fixme: why the hell do another timeout is started ?
                //         This lead to never ending timer if we dont remove this line
                //         But when removed, the email is not correctly updated
                a._updateAnchTimeout = setTimeout(fnAnchor, 250);
              };
              a._updateAnchTimeout = setTimeout(fnAnchor, 1000);
              break;
            }

            var m = s.anchorNode.data.match(HTMLArea.RE_url);
            if ( m && a.href.match(s.anchorNode.data.trim()) )
            {
              var txtNode = s.anchorNode;
              var fnUrl = function()
              {
                // @fixme: Alert, sometimes m is undefined becase the url is not an url anymore (was www.url.com and become for example www.url)
                m = txtNode.data.match(HTMLArea.RE_url);
                a.href = (m[1] ? m[1] : 'http://') + m[2];
                // @fixme: why the hell do another timeout is started ?
                //         This lead to never ending timer if we dont remove this line
                //         But when removed, the url is not correctly updated
                a._updateAnchTimeout = setTimeout(fnUrl, 250);
              };
              a._updateAnchTimeout = setTimeout(fnUrl, 1000);
            }
          }
        }
      }
    break;
  }


  // other keys here
  switch (ev.keyCode)
  {
    case 13: // KEY enter
      if ( HTMLArea.is_gecko && !ev.shiftKey && this.config.mozParaHandler == 'dirty' )
      {
        this.dom_checkInsertP();
        HTMLArea._stopEvent(ev);
      }
    break;
    case 8: // KEY backspace
    case 46: // KEY delete
      if ( ( HTMLArea.is_gecko && !ev.shiftKey ) || HTMLArea.is_ie )
      {
        if ( this.checkBackspace() )
        {
          HTMLArea._stopEvent(ev);
        }
      }
    break;
  }
}

HTMLArea._browserSpecificFunctionsLoaded = true;