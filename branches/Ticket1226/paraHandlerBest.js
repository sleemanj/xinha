// tabs 2

/**
* @fileoverview By Adam Wright, for The University of Western Australia
*
* Distributed under the same terms as Xinha itself.
* This notice MUST stay intact for use (see license.txt).
*
* Heavily modified by Yermo Lamers of DTLink, LLC, College Park, Md., USA.
* For more info see http://www.areaedit.com
*/

/**
* plugin Info
*/

EnterParagraphs._pluginInfo =
{
  name          : "EnterParagraphs",
  version       : "1.0",
  developer     : "Adam Wright",
  developer_url : "http://www.hipikat.org/",
  sponsor       : "The University of Western Australia",
  sponsor_url   : "http://www.uwa.edu.au/",
  license       : "htmlArea"
};

// ------------------------------------------------------------------

// "constants"

// Set up the node type constants for browsers that don't support them.
var ELEMENT_NODE = ELEMENT_NODE || 1;
var ATTRIBUTE_NODE = ATTRIBUTE_NODE || 2;
var TEXT_NODE = TEXT_NODE || 3;
var COMMENT_NODE = COMMENT_NODE || 8;
var DOCUMENT_NODE = DOCUMENT_NODE || 9;
/**
* Whitespace Regex
*/

EnterParagraphs.prototype._whiteSpace = /^\s*$/;

/**
* The pragmatic list of which elements a paragraph may not contain
*/

EnterParagraphs.prototype._pExclusions = /^(address|blockquote|body|dd|div|dl|dt|fieldset|form|h1|h2|h3|h4|h5|h6|hr|li|noscript|ol|p|pre|table|ul)$/i;

/**
* elements which may contain a paragraph
*/

EnterParagraphs.prototype._pContainers = /^(body|del|div|fieldset|form|ins|map|noscript|object|td|th)$/i;
EnterParagraphs.prototype._pWrapper = /^(body|d[ltd]|table|[uo]l|div|p|h[1-6]|li|t[hrd]|del|fieldset|ins|form|map|noscript|object|address|blockquote|pre)$/i;

/**
* Elements which may not contain paragraphs, and would prefer a break to being split
*/

EnterParagraphs.prototype._pBreak = /^(address|pre|blockquote)$/i;

/**
* Elements which may not contain children
*/

EnterParagraphs.prototype._permEmpty = /^(area|base|basefont|br|col|frame|hr|img|input|isindex|link|meta|param)$/i;

/**
* Elements which count as content, as distinct from whitespace or containers
*/

EnterParagraphs.prototype._elemSolid = /^(applet|br|button|hr|img|input|table)$/i;

/**
* When the cursor is at the inside edge of one of these elements, we will move the cursor just outside the element, and insert a P element there.
*/

EnterParagraphs.prototype._pifySibling = /^(address|blockquote|del|div|dl|fieldset|form|h1|h2|h3|h4|h5|h6|hr|ins|map|noscript|object|ol|p|pre|table|ul|)$/i;
EnterParagraphs.prototype._pifyForced = /^(ul|ol|dl|table)$/i;

/**
* When the cursor is at the inside edge of one of these elements, and this element's outside edge is just at the inside edge of its immediate parent,
* we will move the cursor to the outside edge of the immediate parent, and insert a P element there.
*/

EnterParagraphs.prototype._pifyParent = /^(dd|dt|li|td|th|tr)$/i;

// ---------------------------------------------------------------------

/**
* EnterParagraphs Constructor
*/

function EnterParagraphs(editor)
{
  
  this.editor = editor;
  
  // hook into the event handler to intercept key presses if we are using
  // gecko (Mozilla/FireFox)
  if (Xinha.is_gecko)
  {
    this.onKeyPress = this.__onKeyPress;
  }
  
}	// end of constructor.

// ------------------------------------------------------------------

/**
* name member for debugging
*
* This member is used to identify objects of this class in debugging
* messages.
*/
EnterParagraphs.prototype.name = "EnterParagraphs";

/**
* Gecko's a bit lacking in some odd ways...
*/
EnterParagraphs.prototype.insertAdjacentElement = function(ref,pos,el)
{
  if ( pos == 'BeforeBegin' )
  {
    ref.parentNode.insertBefore(el,ref);
  }
  else if ( pos == 'AfterEnd' )
  {
    ref.nextSibling ? ref.parentNode.insertBefore(el,ref.nextSibling) : ref.parentNode.appendChild(el);
  }
  else if ( pos == 'AfterBegin' && ref.firstChild )
  {
    ref.insertBefore(el,ref.firstChild);
  }
  else if ( pos == 'BeforeEnd' || pos == 'AfterBegin' )
  {
    ref.appendChild(el);
  }
  
};	// end of insertAdjacentElement()

// ----------------------------------------------------------------

/**
* Passes a global parent node or document fragment to forEachNode
*
* @param root node root node to start search from.
* @param mode string function to apply to each node.
* @param direction string traversal direction "ltr" (left to right) or "rtl" (right_to_left)
* @param init boolean
*/

EnterParagraphs.prototype.forEachNodeUnder = function ( root, mode, direction, init )
{
  
  // Identify the first and last nodes to deal with
  var start, end;
  
  // nodeType 11 is DOCUMENT_FRAGMENT_NODE which is a container.
  if ( root.nodeType == 11 && root.firstChild )
  {
    start = root.firstChild;
    end = root.lastChild;
  }
  else
  {
    start = end = root;
  }
  // traverse down the right hand side of the tree getting the last child of the last
  // child in each level until we reach bottom.
  while ( end.lastChild )
  {
    end = end.lastChild;
  }
  
  return this.forEachNode( start, end, mode, direction, init);
  
};	// end of forEachNodeUnder()

// -----------------------------------------------------------------------

/**
* perform a depth first descent in the direction requested.
*
* @param left_node node "start node"
* @param right_node node "end node"
* @param mode string function to apply to each node. cullids or emptyset.
* @param direction string traversal direction "ltr" (left to right) or "rtl" (right_to_left)
* @param init boolean or object.
*/

EnterParagraphs.prototype.forEachNode = function (left_node, right_node, mode, direction, init)
{
  
  // returns "Brother" node either left or right.
  var getSibling = function(elem, direction)
	{
    return ( direction == "ltr" ? elem.nextSibling : elem.previousSibling );
	};
  
  var getChild = function(elem, direction)
	{
    return ( direction == "ltr" ? elem.firstChild : elem.lastChild );
	};
  
  var walk, lookup, fnReturnVal;
  
  // FIXME: init is a boolean in the emptyset case and an object in
  // the cullids case. Used inconsistently.
  
  var next_node = init;
  
  // used to flag having reached the last node.
  
  var done_flag = false;
  
  // loop ntil we've hit the last node in the given direction.
  // if we're going left to right that's the right_node and visa-versa.
  
  while ( walk != direction == "ltr" ? right_node : left_node )
  {
    
    // on first entry, walk here is null. So this is how
    // we prime the loop with the first node.
    
    if ( !walk )
    {
      walk = direction == "ltr" ? left_node : right_node;
    }
    else
    {
      
      // is there a child node?
      
      if ( getChild(walk,direction) )
      {
        
        // descend down into the child.
        
        walk = getChild(walk,direction);
        
      }
      else
      {
        
        // is there a sibling node on this level?
        
        if ( getSibling(walk,direction) )
        {
          // move to the sibling.
          walk = getSibling(walk,direction); 
        }
        else
        {
          lookup = walk;
          
          // climb back up the tree until we find a level where we are not the end
          // node on the level (i.e. that we have a sibling in the direction
            // we are searching) or until we reach the end.
          
          while ( !getSibling(lookup,direction) && lookup != (direction == "ltr" ? right_node : left_node) )
          {
            lookup = lookup.parentNode;
          }
          
          // did we find a level with a sibling?
          
          // walk = ( lookup.nextSibling ? lookup.nextSibling : lookup ) ;
          
          walk = ( getSibling(lookup,direction) ? getSibling(lookup,direction) : lookup ) ;
          
        }
      }
      
    }	// end of else walk.
    
    // have we reached the end? either as a result of the top while loop or climbing
    // back out above.
    
    done_flag = (walk==( direction == "ltr" ? right_node : left_node));
    
    // call the requested function on the current node. Functions
    // return an array.
    //
    // Possible functions are _fenCullIds, _fenEmptySet
    //
    // The situation is complicated by the fact that sometimes we want to
    // return the base node and sometimes we do not.
    //
    // next_node can be an object (this.takenIds), a node (text, el, etc) or false.
    
    switch( mode )
    {
      
    case "cullids":
      
      fnReturnVal = this._fenCullIds(walk, next_node );
      break;
      
    case "find_fill":
      
      fnReturnVal = this._fenEmptySet(walk, next_node, mode, done_flag);
      break;
      
    case "find_cursorpoint":
      
      fnReturnVal = this._fenEmptySet(walk, next_node, mode, done_flag);
      break;
      
    }
    
    // If this node wants us to return, return next_node
    
    if ( fnReturnVal[0] )
    {
      return fnReturnVal[1];
    }
    
    // are we done with the loop?
    
    if ( done_flag )
    {
      break;
    }
    
    // Otherwise, pass to the next node
    
    if ( fnReturnVal[1] )
    {
      next_node = fnReturnVal[1];
    }
    
  }	// end of while loop
  
  return false;
  
};	// end of forEachNode()

// -------------------------------------------------------------------

/**
* Find a post-insertion node, only if all nodes are empty, or the first content
*
* @param node node current node beinge examined.
* @param next_node node next node to be examined.
* @param node string "find_fill" or "find_cursorpoint"
* @param last_flag boolean is this the last node?
*/

EnterParagraphs.prototype._fenEmptySet = function( node, next_node, mode, last_flag)
{
  
  // Mark this if it's the first base
  
  if ( !next_node && !node.firstChild )
  {
    next_node = node;
  }
  
  // Is it an element node and is it considered content? (br, hr, etc)
  // or is it a text node that is not just whitespace?
  // or is it not an element node and not a text node?
  
  if ( (node.nodeType == 1 && this._elemSolid.test(node.nodeName)) ||
    (node.nodeType == 3 && !this._whiteSpace.test(node.nodeValue)) ||
  (node.nodeType != 1 && node.nodeType != 3) )
  {
    
    switch( mode )
    {
      
    case "find_fill":
      
      // does not return content.
      
      return new Array(true, false );
      break;
      
    case "find_cursorpoint":
      
      // returns content
      
      return new Array(true, node );
      break;
      
    }
    
  }
  
  // In either case (fill or findcursor) we return the base node. The avoids
  // problems in terminal cases (beginning or end of document or container tags)
  
  if ( last_flag )
  {
    return new Array( true, next_node );
  }
  
  return new Array( false, next_node );
  
};	// end of _fenEmptySet()

// ------------------------------------------------------------------------------

/**
* remove duplicate Id's.
*
* @param ep_ref enterparagraphs reference to enterparagraphs object
*/

EnterParagraphs.prototype._fenCullIds = function ( ep_ref, node, pong )
{
  
  // Check for an id, blast it if it's in the store, otherwise add it
  
  if ( node.id )
  {
    
    pong[node.id] ? node.id = '' : pong[node.id] = true;
  }
  
  return new Array(false,pong);
  
};

// ---------------------------------------------------------------------------------

/**
* Grabs a range suitable for paragraph stuffing
*
* @param rng Range
* @param search_direction string "left" or "right"
*
* @todo check blank node issue in roaming loop.
*/

EnterParagraphs.prototype.processSide = function( rng, search_direction)
{
  
  var next = function(element, search_direction) {
    return ( search_direction == "left" ? element.previousSibling : element.nextSibling );
  };
  
  var node = search_direction == "left" ? rng.startContainer : rng.endContainer;
  var offset = search_direction == "left" ? rng.startOffset : rng.endOffset;
  var roam, start = node;
  
  // Never start with an element, because then the first roaming node might
  // be on the exclusion list and we wouldn't know until it was too late
  
  while ( start.nodeType == 1 && !this._permEmpty.test(start.nodeName) ) {
    start = ( offset ? start.lastChild : start.firstChild );
  }
  
  // Climb the tree, left or right, until our course of action presents itself
  //
  // if roam is NULL try start.
  // if roam is NOT NULL, try next node in our search_direction
  // If that node is NULL, get our parent node.
  //
  // If all the above turns out NULL end the loop.
  //
  // FIXME: gecko (firefox 1.0.3) - enter "test" into an empty document and press enter.
  // sometimes this loop finds a blank text node, sometimes it doesn't.
  
  roam = roam ? ( next(roam,search_direction) ? next(roam,search_direction) : roam.parentNode ) : start;
  while (roam) {

    // next() is an inline function defined above that returns the next node depending
    // on the direction we're searching.

    if ( next(roam,search_direction) ) {

      // If the next sibling's on the exclusion list, stop before it

      if ( this._pExclusions.test(next(roam,search_direction).nodeName) ) {

        return this.processRng(rng, search_direction, roam, next(roam,search_direction), (search_direction == "left"?'AfterEnd':'BeforeBegin'), true, false);
      }
    } else {

      // If our parent's on the container list, stop inside it

      if (this._pContainers.test(roam.parentNode.nodeName)) {

        return this.processRng(rng, search_direction, roam, roam.parentNode, (search_direction == "left"?'AfterBegin':'BeforeEnd'), true, false);
      } else if (this._pExclusions.test(roam.parentNode.nodeName)) {

        // chop without wrapping

        if (this._pBreak.test(roam.parentNode.nodeName)) {

          return this.processRng(rng, search_direction, roam, roam.parentNode,
            (search_direction == "left"?'AfterBegin':'BeforeEnd'), false, (search_direction == "left" ?true:false));
        } else {

          // the next(roam,search_direction) in this call is redundant since we know it's false
          // because of the "if next(roam,search_direction)" above.
          //
          // the final false prevents this range from being wrapped in <p>'s most likely
          // because it's already wrapped.

          return this.processRng(rng,
            search_direction,
            (roam = roam.parentNode),
            (next(roam,search_direction) ? next(roam,search_direction) : roam.parentNode),
            (next(roam,search_direction) ? (search_direction == "left"?'AfterEnd':'BeforeBegin') : (search_direction == "left"?'AfterBegin':'BeforeEnd')),
            false,
            false);
        }
      }
    }
    roam = roam ? ( next(roam,search_direction) ? next(roam,search_direction) : roam.parentNode ) : start;
  }
  
};	// end of processSide()

// ------------------------------------------------------------------------------

/**
* processRng - process Range.
*
* Neighbour and insertion identify where the new node, roam, needs to enter
* the document; landmarks in our selection will be deleted before insertion
*
* @param rn Range original selected range
* @param search_direction string Direction to search in.
* @param roam node
* @param insertion string may be AfterBegin of BeforeEnd
* @return array
*/

EnterParagraphs.prototype.processRng = function(rng, search_direction, roam, neighbour, insertion, pWrap, preBr)
{
  var node = search_direction == "left" ? rng.startContainer : rng.endContainer;
  var offset = search_direction == "left" ? rng.startOffset : rng.endOffset;
  
  // Define the range to cut, and extend the selection range to the same boundary
  
  var editor = this.editor;
  var newRng = editor._doc.createRange();
  
  newRng.selectNode(roam);
  // extend the range in the given direction.
  
  if ( search_direction == "left")
  {
    newRng.setEnd(node, offset);
    rng.setStart(newRng.startContainer, newRng.startOffset);
  }
  else if ( search_direction == "right" )
  {
    
    newRng.setStart(node, offset);
    rng.setEnd(newRng.endContainer, newRng.endOffset);
  }
  // Clone the range and remove duplicate ids it would otherwise produce
  
  var cnt = newRng.cloneContents();
  
  // in this case "init" is an object not a boolen.
  
  this.forEachNodeUnder( cnt, "cullids", "ltr", this.takenIds, false, false);
  
  // Special case, for inserting paragraphs before some blocks when caret is at
  // their zero offset.
  //
  // Used to "open up space" in front of a list, table. Usefull if the list is at
  // the top of the document. (otherwise you'd have no way of "moving it down").
  
  var pify, pifyOffset, fill;
  pify = search_direction == "left" ? (newRng.endContainer.nodeType == 3 ? true:false) : (newRng.startContainer.nodeType == 3 ? false:true);
  pifyOffset = pify ? newRng.startOffset : newRng.endOffset;
  pify = pify ? newRng.startContainer : newRng.endContainer;
  
  if ( this._pifyParent.test(pify.nodeName) && pify.parentNode.childNodes.item(0) == pify )
  {
    while ( !this._pifySibling.test(pify.nodeName) )
    {
      pify = pify.parentNode;
    }
  }
  
  // NODE TYPE 11 is DOCUMENT_FRAGMENT NODE
  // I do not profess to understand any of this, simply applying a patch that others say is good - ticket:446
  if ( cnt.nodeType == 11 && !cnt.firstChild)
  {	
    if (pify.nodeName != "BODY" || (pify.nodeName == "BODY" && pifyOffset != 0)) 
    { //WKR: prevent body tag in empty doc
      cnt.appendChild(editor._doc.createElement(pify.nodeName));
    }
  }
  
  // YmL: Added additional last parameter for fill case to work around logic
  // error in forEachNode()
  
  fill = this.forEachNodeUnder(cnt, "find_fill", "ltr", false );
  
  if ( fill &&
    this._pifySibling.test(pify.nodeName) &&
  ( (pifyOffset == 0) || ( pifyOffset == 1 && this._pifyForced.test(pify.nodeName) ) ) )
  {
    
    roam = editor._doc.createElement( 'p' );
    roam.innerHTML = "&nbsp;";
    
    // roam = editor._doc.createElement('p');
    // roam.appendChild(editor._doc.createElement('br'));
    
    // for these cases, if we are processing the left hand side we want it to halt
    // processing instead of doing the right hand side. (Avoids adding another <p>&nbsp</p>
      // after the list etc.
      
      if ((search_direction == "left" ) && pify.previousSibling)
      {
        
        return new Array(pify.previousSibling, 'AfterEnd', roam);
      }
      else if (( search_direction == "right") && pify.nextSibling)
      {
        
        return new Array(pify.nextSibling, 'BeforeBegin', roam);
      }
      else
      {
        
        return new Array(pify.parentNode, (search_direction == "left"?'AfterBegin':'BeforeEnd'), roam);
      }
      
  }
  
  // If our cloned contents are 'content'-less, shove a break in them
  
  if ( fill )
  {
    
    // Ill-concieved?
    //
    // 3 is a TEXT node and it should be empty.
    //
    
    if ( fill.nodeType == 3 )
    {
      // fill = fill.parentNode;
      
      fill = editor._doc.createDocumentFragment();
    }
    
    if ( (fill.nodeType == 1 && !this._elemSolid.test()) || fill.nodeType == 11 )
    {
      
      // FIXME:/CHECKME: When Xinha is switched from WYSIWYG to text mode
      // Xinha.getHTMLWrapper() will strip out the trailing br. Not sure why.
      
      // fill.appendChild(editor._doc.createElement('br'));
      
      var pterminator = editor._doc.createElement( 'p' );
      pterminator.innerHTML = "&nbsp;";
      
      fill.appendChild( pterminator );
      
    }
    else
    {
      
      // fill.parentNode.insertBefore(editor._doc.createElement('br'),fill);
      
      var pterminator = editor._doc.createElement( 'p' );
      pterminator.innerHTML = "&nbsp;";
      
      fill.parentNode.insertBefore(parentNode,fill);
      
    }
  }
  
  // YmL: If there was no content replace with fill
  // (previous code did not use fill and we ended up with the
    // <p>test</p><p></p> because Gecko was finding two empty text nodes
    // when traversing on the right hand side of an empty document.
    
    if ( fill )
    {
      
      roam = fill;
    }
    else
    {
      // And stuff a shiny new object with whatever contents we have
      
      roam = (pWrap || (cnt.nodeType == 11 && !cnt.firstChild)) ? editor._doc.createElement('p') : editor._doc.createDocumentFragment();
      roam.appendChild(cnt);
    }
    
    if (preBr)
    {
      roam.appendChild(editor._doc.createElement('br'));
    }
    // Return the nearest relative, relative insertion point and fragment to insert
    
    return new Array(neighbour, insertion, roam);
    
};	// end of processRng()

// ----------------------------------------------------------------------------------

/**
* are we an <li> that should be handled by the browser?
*
* there is no good way to "get out of" ordered or unordered lists from Javascript.
* We have to pass the onKeyPress 13 event to the browser so it can take care of
* getting us "out of" the list.
*
* The Gecko engine does a good job of handling all the normal <li> cases except the "press
* enter at the first position" where we want a <p>&nbsp</p> inserted before the list. The
* built-in behavior is to open up a <li> before the current entry (not good).
*
* @param rng Range range.
*/

EnterParagraphs.prototype.isNormalListItem = function(rng)
{
  
  var node, listNode;
  
  node = rng.startContainer;
  
  if (( typeof node.nodeName != 'undefined') &&
    ( node.nodeName.toLowerCase() == 'li' ))
  {
    
    // are we a list item?
    
    listNode = node;
  }
  else if (( typeof node.parentNode != 'undefined' ) &&
    ( typeof node.parentNode.nodeName != 'undefined' ) &&
  ( node.parentNode.nodeName.toLowerCase() == 'li' ))
  {
    
    // our parent is a list item.
    
    listNode = node.parentNode;
    
  }
  else
  {
    // neither we nor our parent are a list item. this is not a normal
    // li case.
    
    return false;
  }
  
  // at this point we have a listNode. Is it the first list item?
  
  if ( ! listNode.previousSibling )
  {
    // are we on the first character of the first li?
    
    if ( rng.startOffset == 0 )
    {
      return false;
    }
  }
  return true;
  
};	// end of isNormalListItem()

// ----------------------------------------------------------------------------------
/**
* Called when a key is pressed in the editor
*/

EnterParagraphs.prototype.__onKeyPress = function(ev)
{
  
  // If they've hit enter and shift is not pressed, handle it
  
  if (ev.keyCode == 13 && !ev.shiftKey && this.editor._iframe.contentWindow.getSelection)
  {
    return this.breakLine(ev, this.editor._doc);
  }
  
};	// end of _onKeyPress()

// -----------------------------------------------------------------------------------

/**
* Helper function to find the index of the given node with its parent's
* childNodes array.  If there is any problem with the lookup, we'll return
* NULL.
*/

EnterParagraphs.prototype.indexInParent = function (el)
{
  if (!el.parentNode || !el.parentNode.childNodes)
  {
    // The element is at the root of the tree, or it's a broken node.
    return null;
  }

  for (var index=0; index<el.parentNode.childNodes.length; ++index)
  {
    if (el == el.parentNode.childNodes[index])
    {
      return index;
    }
  }

  // This will only happen if the DOM node is broken...
  return null;
}

/*
* Determine if a cursor points to the end of it's containing node.
*/
EnterParagraphs.prototype.cursorAtEnd = function (cursorNode, cursorOffset)
{
  if (cursorNode.nodeType == TEXT_NODE)
  {
    if (cursorOffset == cursorNode.nodeValue.length)
    {
      return true;
    }
    // We're in the middle of a text node.  If the node is a whitespace node,
    // we'll ignore it and treat it as if the cursor were after the node, and
    // not in it.
    if (/\S/.test(cursorNode.nodeValue))
    {
      return false;
    }
    cursorOffset = this.indexInParent(cursorNode) + 1;
    cursorNode = cursorNode.parentNode;
    
    // We need to make sure we there wasn't an error in indexInParent
    if (cursorOffset === null)
    {
      return false;
    }
  }
  // The easy case, it's after the last node...
  if (cursorOffset == cursorNode.childNodes.length)
  {
    return true;
  }
  // At this point, if the pointed to node is a whitespace node, and all of
  // it's nextSiblings are also whitespace node, then the cursor is at the end
  // of the node.
  for (var node = cursorNode.childNodes[cursorOffset]; node; node = node.nextSibling)
  {
    if ((node.nodeType != TEXT_NODE) || (/\S/.test(node.nodeValue)))
    {
      return false;
    }
  }
  return true;
}
/*
* Test suite for this, because it's really tough to get right.
*/
EnterParagraphs.RunTests = function(xinha, debug)
{
  function test(message, before, cursorBefore, after, cursorAfter, cursorAfter2) {
    console.group('Test: ', message);
    if (before !== null) {
      xinha.setHTML(before);
    }
    // Do something
    var cAnchor, cOffset;

    var mockEvent = {
      preventDefault: function() {if (debug) console.log("Preventing default.");},
      stopPropagation: function() {if (debug) console.log("Stopping propagation.");},
    }
    function setCursor(commands) {
      cAnchor = xinha._doc.body;
      cOffset = 0;
      try {
        for (var index=0; index<commands.length; ++index) {
          var command = commands[index];
          if ('id' == command[0]) {
              cAnchor = xinha._doc.getElementById(command[1]);
          } else if ('firsttag' == command[0]) {
              cAnchor = xinha._doc.getElementsByTagName(command[1])[0];
          } else if ('child' == command[0]) {
              cAnchor = cAnchor.childNodes[command[1]];
          } else if ('next' == command[0]) {
            for (var next=command[1]; next > 0 && cAnchor.nextSibling; --next) {
              cAnchor = cAnchor.nextSibling;
            }
          } else if ('previous' == command[0]) {
            for (var previous=command[1]; previous > 0 && cAnchor.previousSibling; --previous) {
              cAnchor = cAnchor.previousSibling;
            }
          } else if ('offset' == command[0]) {
            if (command[1] == 'length') {
              if (TEXT_NODE == cAnchor.nodeType) {
                cOffset = cAnchor.nodeValue.length;
              } else {
                cOffset = cAnchor.childNodes.length;
              }
            } else if (command[1] < 0) {
              if (TEXT_NODE == cAnchor.nodeType) {
                cOffset = cAnchor.nodeValue.length + command[1];
              } else {
                cOffset = cAnchor.childNodes.length + command[1];
              }
            } else {
              cOffset = command[1];
            }
          }
        }
      } catch(e) {
        cAnchor = null;
        cOffset = null;
      }
    }

    setCursor(cursorBefore);

    var selection = xinha.getSelection();
    var range = xinha.createRange(selection);

    range.setStart(cAnchor, cOffset);
    range.setEnd(cAnchor, cOffset);
    selection.removeAllRanges();
    selection.addRange(range);

    // Breakline
    try {
      xinha.plugins['EnterParagraphs'].instance.breakLine(mockEvent, xinha._doc);
    } catch (e) {
      console.error('Breakline threw exception ', e);
      console.groupEnd();
      return;
    }

    var selection = xinha.getSelection();
    var range = xinha.createRange(selection);

    setCursor(cursorAfter);

    if ((selection.anchorNode != cAnchor) || (selection.anchorOffset != cOffset)) {
      // Sometimes there are multiple equivalent selection, let's see if we received alternatives.
      if (typeof cursorAfter2 != 'undefined') {
        setCursor(cursorAfter2);
        if ((selection.anchorNode != cAnchor) || (selection.anchorOffset != cOffset)) {
          console.error('Actual anchor:', selection.anchorNode, 'Actual offset:', selection.anchorOffset, 'Expected anchor:', cAnchor, 'Expected offset:', cOffset);
        }
      } else {
        console.error('Actual anchor:', selection.anchorNode, 'Actual offset:', selection.anchorOffset, 'Expected anchor:', cAnchor, 'Expected offset:', cOffset);
      }
    }

    result = xinha.getInnerHTML();
    if (result == after) {
      console.info('Success!')
    } else {
      console.error('Was', null, before, null, 'Expected', null, after, null, 'Got', null, result, null)
    }
    console.groupEnd();
  }
  contentBackup = xinha.getInnerHTML();
  console.group('Running tests:');
  /*
     The initial content on browser load seems to be:
     <body><br />\n</body>
     That's a break tag and a whitespace text node containing a newline character.
    */
  test('Initial Xinha Content',
       null, [],
       '<p>&nbsp;</p><p><br>&nbsp;</p>\n', [['child', 1]]);  // Mozilla kicks off a trailing newline.  Do I care about this?
  test('Initial Xinha Content: Recreated',
       '<br>\n', [],
       '<p>&nbsp;</p><p><br>&nbsp;</p>\n', [['child', 1]]);  // Mozilla kicks off a trailing newline.  Do I care about this?

  test('Empty Body',
       '', [],
       '<p>&nbsp;</p><p>&nbsp;</p>', [['child', 1]],
                                     [['child', 1], ['child', 0]]);

  test('Text node in body: text node',
       'Hi', [], // Point to text node
       '<p>&nbsp;</p><p>Hi</p>', [['child', 1]],
                                 [['child', 1], ['child', 0]]);
  test('Text node in body: first char',
       'Hi', [['child', 0]], // Point to 'H'
       '<p>&nbsp;</p><p>Hi</p>', [['child', 1]],
                                 [['child', 1], ['child', 0]]);
  test('Text node in body: split text',
       'Hi', [['child', 0], ['offset', 1]], // Point to 'i'
       '<p>H</p><p>i</p>', [['child', 1]],
                           [['child', 1], ['child', 0]]);
  test('Text node in body: after text',
       'Hi', [['child', 0], ['offset', 'length']], // Point after 'i'
       '<p>Hi</p><p>&nbsp;</p>', [['child', 1]],
                                 [['child', 1], ['child', 0]]);
  test('Text node in body: after text node',
       'Hi', [['offset', 'length']], // Point after text node
       'Hi<p>&nbsp;</p>', [['child', 1]],  // This is not ideal output, but the line breaker never sees the text node and
                          [['child', 1], ['child', 0]]); // so can't do anything about it.

  test('Body with inline tag: em node',
       '<em>hi</em>', [],
       '<p>&nbsp;</p><p><em>hi</em></p>', [['child', 1], ['child', 0]],
                                          [['child', 1], ['child', 0], ['child', 0]]);
  test('Body with inline tag: text node',
       '<em>hi</em>', [['child', 0]],
       '<p>&nbsp;</p><p><em>hi</em></p>', [['child', 1], ['child', 0]],
                                          [['child', 1], ['child', 0], ['child', 0]]);
  test('Body with inline tag: first char',
       '<em>hi</em>', [['child', 0], ['child', 0]],
       '<p>&nbsp;</p><p><em>hi</em></p>', [['child', 1], ['child', 0]],
                                          [['child', 1], ['child', 0], ['child', 0]]);
  test('Body with inline tag: split text',
       '<em>hi</em>', [['child', 0], ['child', 0], ['offset', 1]],
       '<p><em>h</em></p><p><em>i</em></p>', [['child', 1], ['child', 0]],
                                             [['child', 1], ['child', 0], ['child', 0]]);
  test('Body with inline tag: after text',
       '<em>hi</em>', [['child', 0], ['child', 0], ['offset', 'length']],
       '<p><em>hi</em></p><p>&nbsp;</p>', [['child', 1], ['child', 0]],
                                          [['child', 1], ['child', 0], ['child', 0]]);
  // I hate that this is expected behavior, but the split code doesn't see the em tag in these two cases.
  test('Body with inline tag: after text node',
       '<em>hi</em>', [['child', 0], ['offset', 'length']],
       '<em>hi</em><p>&nbsp;</p>', [['child', 1], ['child', 0]],
                                          [['child', 1], ['child', 0], ['child', 0]]);
  test('Body with inline tag: after em node',
       '<em>hi</em>', [['offset', 'length']],
       '<em>hi</em><p>&nbsp;</p>', [['child', 1], ['child', 0]],
                                          [['child', 1], ['child', 0], ['child', 0]]);

  /***************  Repeat the header block for each header level once the tests are passing *********************/
  test('Split header 1: h1 node',
       '<h1>hi</h1>', [],
       '<p>&nbsp;</p><h1>hi</h1>', [['child', 1]],
                                   [['child', 1], ['child', 0]]);
  test('Split header 1: text node',
       '<h1>hi</h1>', [['child', 0]],
       '<p>&nbsp;</p><h1>hi</h1>', [['child', 1]],
                                   [['child', 1], ['child', 0]]);
  test('Split header 1: first char',
       '<h1>hi</h1>', [['child', 0], ['child', 0]],
       '<p>&nbsp;</p><h1>hi</h1>', [['child', 1]],
                                   [['child', 1], ['child', 0]]);
  test('Split header 1: split text',
       '<h1>hi</h1>', [['child', 0], ['child', 0], ['offset', 1]],
       '<h1>h</h1><h1>i</h1>', [['child', 1]],
                               [['child', 1], ['child', 0]]);
  test('Split header 1: after text',
       '<h1>hi</h1>', [['child', 0], ['child', 0], ['offset', 'length']],
       '<h1>hi</h1><p>&nbsp;</p>', [['child', 1]],
                                   [['child', 1], ['child', 0]]);
  test('Split header 1: after text node',
       '<h1>hi</h1>', [['child', 0], ['offset', 'length']],
       '<h1>hi</h1><p>&nbsp;</p>', [['child', 1]],
                                   [['child', 1], ['child', 0]]);
  test('Split header 1: after h1 node',
       '<h1>hi</h1>', [['offset', 'length']],
       '<h1>hi</h1><p>&nbsp;</p>', [['child', 1]],
                                   [['child', 1], ['child', 0]]);

  console.groupEnd();
  xinha.setHTML(contentBackup);
  // EnterParagraphs.RunTests(xinha_editors['myTextArea'])
}
/*
* Determine if a cursor points to the end of it's containing node.
*/
EnterParagraphs.prototype.cursorAtBeginning = function (cursorNode, cursorOffset)
{
  if (cursorOffset == 0)
  {
    return true;
  }
  if (cursorNode.nodeType == TEXT_NODE)
  {
    // We're in the middle of a text node.  If the node is a whitespace node,
    // we'll ignore it and treat it as if the cursor were at the beginning of
    // the node, and not in it.
    if (/\S/.test(cursorNode.nodeValue))
    {
      return false;
    }
    cursorOffset = this.indexInParent(cursorNode);
    cursorNode = cursorNode.parentNode;
    
    // We need to make sure we there wasn't an error in indexInParent
    if (cursorOffset === null)
    {
      return false;
    }

    // We have to check the new offset for the easy case.
    if (cursorOffset == 0)
    {
      return true;
    }
  }
  // At this point, if all of the nodes before the cursor are white space
  // nodes, then the cursor is at the beginning of the node.
  for (var node = cursorNode.childNodes[cursorOffset-1]; node; node = node.previousSibling)
  {
    if ((node.nodeType != TEXT_NODE) || (/\S/.test(node.nodeValue)))
    {
      return false;
    }
  }
  return true;
}
/**
* Handles the pressing of an unshifted enter for Gecko
*/

EnterParagraphs.prototype.breakLine = function(ev, doc)
{
  // Helper function that copies a DOM element and its attributes (except the
  // id) without any of the contents.
  function safeShallowCopy(node, doc)
  {
    var copy = doc.createElement(node.nodeName);
    for (var index=0; index < node.attributes.length; ++index)
    {
      var attr = node.attributes[index];
      if ('id' != attr.name.toLowerCase())
      {
        copy.setAttribute(attr.name, attr.value);
      }
    }
    return copy;
  }

  // Helper function that will get the node immediately following the current
  // node, but without descending into children nodes.  When looking at the
  // markup of the document, this means that if a node to the right of this
  // node in the text is at a lower depth in the DOM tree, than we will return
  // it's first parent that is at our depth our higher in the tree.
  function nextRootNode(node)
  {
    if (node.nextSibling)
    {
      return node.nextSibling;
    }
    for (var nextRoot = node.parentNode;nextRoot;nextRoot = nextRoot.parentNode)
    {
      if (nextRoot.nextSibling)
      {
        return nextRoot.nextSibling;
      }
    }
  }

  // A cursor is specified by a node and an offset, so we will split at that
  // location.  It should be noted that if splitNode is a text node,
  // splitOffset is an offset into the text contents.  If not, it is an index
  // into the childNodes array.
  function splitTree(root, splitNode, splitOffset, doc)
  {
    // Split root into two.
    var breaker = safeShallowCopy(root, doc);
    if (root.nextSibling)
    {
      breaker = root.parentNode.insertBefore(breaker,root.nextSibling);
    }
    else
    {
      breaker = root.parentNode.appendChild(breaker);
    }

    var insertNode = breaker;
    // XXX TODO don't use a closure to access this, pass it in...
    for (;recreateStack.length>0;)
    {
      var stackEl = safeShallowCopy(recreateStack.pop(), doc)
      insertNode.appendChild(stackEl);
      // Move content here
      insertNode = stackEl;
    }

    // We need to keep track of the new cursor location.  When our cursor is in
    // the middle of a text node, the new cursor will be at the beginning of
    // the text node we create to contain the text to the right of the cursor.
    // Otherwise, the cursor will point to a node, and the new cursor needs to
    // point to that node in it's new location.
    var newCursorNode = null;

    var sourceNode = splitNode;
    var sourceOffset = splitOffset;
    if (TEXT_NODE == sourceNode.nodeType)
    {
      var textNode = doc.createTextNode(sourceNode.nodeValue.substring(splitOffset,sourceNode.nodeValue.length));
      newCursorNode = textNode = insertNode.appendChild(textNode);
      sourceNode.nodeValue = sourceNode.nodeValue.substring(0,splitOffset);
    }

    // When splitting a tree, we need to take any nodes that are after the
    // split and move them into their location in the new tree.  We can have
    // siblings at each level of the tree, so we need to walk from the inside
    // of the source outwards, and move the offending nodes to the equivalent
    // position on the newly duplicated tree.

    // Move insertNode from the inside outwards towards the root, moving any
    // content nodes as we go.  We'll make sure that we can do the same with
    // sourceNode
    while (insertNode != root.parentNode)
    {
      for (var moveNode=sourceNode.childNodes[sourceOffset];moveNode;)
      {
        // We have to take a reference to the next sibling before cutting out
        // of the tree, or we will lose our place.

        // nextNode can potentially be null.  This is not a problem.
        var nextNode = moveNode.nextSibling;
        var cutNode = moveNode.parentNode.removeChild(moveNode);
        insertNode.appendChild(cutNode);
        moveNode = nextNode;
      }

      // Move both of our node pointers one step closer to the root node.
      sourceOffset = EnterParagraphs.prototype.indexInParent(sourceNode);
      sourceNode = sourceNode.parentNode;
      insertNode = insertNode.parentNode;
    }

    // Below code needs to check for element node with empty text node.
    // An empty node is an text node of zero length or an element node with no
    // children, or whose only children are zero-length text nodes.
    function emptyNode(node)
    {
      if ((TEXT_NODE == node.nodeType) && (0 == node.nodeValue.length))
      {
        // Text nodes are empty if there is no text.
        return true;
      }

      if (ELEMENT_NODE == node.nodeType)
      {
        for (var child = node.firstChild; child; child = child.nextSibling)
        {
          if ((ELEMENT_NODE == child.nodeType) || (0 != child.nodeValue.length))
          {
            // If there are any element children, or text nodes with text in
            // them, this node is not empty.
            return false;
          }
        }

        // node has no childNodes that are elements and no childNodes that are
        // text nodes with text in them.
        return true;
      }

      return false;
    }

    function stuffEmptyNode(node, doc)
    {
      if (!emptyNode(node))
      {
        return;
      }

      if (TEXT_NODE == node.nodeType)
      {
        // Unicode equivalent of non breaking whitespace.
        node.nodeValue = '\u00a0';
      }
      else if (0 == node.childNodes.length)
      {
        // Unicode equivalent of non breaking whitespace.
        node.appendChild(doc.createTextNode('\u00a0'));
      }
      else
      {
        // Unicode equivalent of non breaking whitespace. The node is empty,
        // but it has child nodes, so firstChild is guaranteed to be an empty
        // text node.
        node.firstChild.nodeValue = '\u00a0';
      }
    }

    // If the cursor node wasn't created by the split (it was moved), then that
    // means we need to point to the inside of our brand new tree.
    if (!newCursorNode)
    {
      newCursorNode = breaker.childNodes[0];
    }

    // Make sure when we split the tree that we don't leave any empty nodes, as
    // that would have visual glitches.
    stuffEmptyNode(splitNode, doc);
    stuffEmptyNode(newCursorNode, doc);

    // So that we can correctly set the selection, we'll return a reference to
    // the inserted subtree.
    return newCursorNode;
  }
  function insertLineBreak(cursorParent, cursorOffset, useNewline, doc)
  {
    if (TEXT_NODE == cursorParent.nodeType)
    {
      // The cursor points inside of a text node, we insert the newline
      // directly into the text.
      var splitNode = cursorParent;
      var splitOffset = cursorOffset;
      if (useNewline)
      {
        splitNode.nodeValue = splitNode.nodeValue.substring(0,splitOffset) + '\n' + splitNode.nodeValue.substring(splitOffset,splitNode.nodeValue.length);
      }
      else
      {
        var newTextNode = doc.createTextNode(splitNode.nodeValue.substring(splitOffset,splitNode.nodeValue.length));
        var newBreakNode = doc.createElement('br');
        splitNode.nodeValue = splitNode.nodeValue.substring(0,splitOffset);

        var appendIndex = EnterParagraphs.prototype.indexInParent(cursorParent);
        if (appendIndex == cursorParent.parentNode.length-1)
        {
          newBreakNode = cursorParent.appendChild(newBreakNode);
          newTextNode = cursorParent.appendChild(newTextNode);
        }
        else
        {
          newTextNode = cursorParent.insertBefore(newTextNode, cursorParent.parentNode.childNodes[appendIndex+1]);
          newBreakNode = cursorParent.insertBefore(newBreakNode, newTextNode);
        }
        return newBreakNode;
      }
    }
    else if (0 == cursorParent.childNodes.length)
    {
      // The cursor is inside an empty element or document node, so we insert a txt node or break element as necessary.
      if (useNewline)
      {
        var breakingNode = doc.createTextNode('\n');
        cursorParent.appendChild(breakingNode);
      }
      else
      {
        var breakingNode = doc.createElement('br');
        return cursorParent.appendChild(breakingNode);
      }
    }
    else if ((cursorOffset == cursorParent.childNodes.length) && (TEXT_NODE == cursorParent.childNodes[cursorOffset-1].nodeType))
    {
      // The cursor is at the after the last node, and the previous node is a
      // text node where we can insert the newline.
      if (useNewline)
      {
        var lastTextNode = cursorParent.childNodes[cursorOffset-1];
        lastTextNode.nodeValue = lastTextNode.nodeValue + '\n';
      }
      else
      {
        var breakingNode = doc.createElement('br');
        return cursorParent.appendChild(breakingNode);
      }
    }
    else if (cursorOffset == cursorParent.childNodes.length)
    {
      // The cursor is at the after the last node, and the previous node is an
      // not text, so we must insert a text node.
      if (useNewline)
      {
        var breakingNode = doc.createTextNode('\n');
        cursorParent.appendChild(breakingNode);
      }
      else
      {
        var breakingNode = doc.createElement('br');
        return cursorParent.appendChild(breakingNode);
      }
    }
    else if (TEXT_NODE == cursorParent.childNodes[cursorOffset].nodeType)
    {
      // The cursor points to a text node, insert our newline there.
      if (useNewline)
      {
        var splitNode = cursorParent.childNodes[cursorOffset];
        splitNode.nodeValue = '\n' + splitNode.nodeValue;
      }
      else
      {
        var breakingNode = doc.createElement('br');
        return cursorParent.insertBefore(breakingNode, cursorParent[cursorOffset]);
      }
    }
    else if (TEXT_NODE == cursorParent.childNodes[cursorOffset-1].nodeType)
    {
      // The cursor points to an non-text node, but there is a text node just
      // before where we can insert a newline.
      if (useNewline)
      {
        var splitNode = cursorParent.childNodes[cursorOffset-1];
        splitNode.nodeValue = splitNode.nodeValue + '\n';
      }
      else
      {
        var breakingNode = doc.createElement('br');
        return cursorParent.insertBefore(breakingNode, cursorParent[cursorOffset]);
      }
    }
    else
    {
      // The cursor points between two non-text nodes, so we must insert a text
      // node.
      if (useNewline)
      {
        var breakingNode = doc.createTextNode('\n');
        cursorParent.insertBefore(breakingNode, cursorParent.childNodes[cursorOffset]);
      }
      else
      {
        var breakingNode = doc.createElement('br');
        return cursorParent.insertBefore(breakingNode, cursorParent.childNodes[cursorOffset]);
      }
    }
  }

  /* ***********************************************************************
                                 CODE
     *********************************************************************** */
  // In the case of the user pressing enter, we have to break the line somehow.
  // If there is anything already selected, we interpret that the user wishes
  // for the content to be deleted.
  
  var selection = this.editor.getSelection();
  var range = this.editor.createRange(selection);
  
  selection.collapseToStart();
  range.deleteContents();

  // We do some magic manipulation to help with user intent.
  this.moveCursorOnEdge(selection);

  // Take a reference to the cursor.
  var cursorParent = selection.anchorNode;
  var cursorOffset = selection.anchorOffset;

  // Now that we have an empty selection, the process of breaking the line is a
  // bit simpler.  Our strategy for breaking the line is as follows:

  // We will modify the cursor position in an attempt to guess the user's
  // intent.  When the cursor is at the inside edge of certain elements, we
  // work under the assumption that the user wished to select just outside of
  // that element. As such, we will move the cursor to just outside the
  // element, and then continue.

  // Next, we find the first non-inline element that contains our cursor.
  // These can be broken into four types:
  // 1) Definition lists and their elements (dl, dt, dd)
  // 2) Other lists (ul, ol)
  // 3) Other containers (body, div, tr, pre, etc.)
  // 4) Other block elements (p, h3, li, th, td, etc.)
  //
  // If we are inside a definition (1) list, we try to guess the users intent
  //   as to whether they want to insert* a new term or a new definition.
  // If we are inside any other list (2) element, we will insert* an li element.
  // If we are in any other container (3), we will insert* a p element.
  // If we are in any other block (4) element, we split the block into two
  //   pieces and move* anything after the cursor to the second block.
  //
  // *When inserting or moving content, we must be sure to look at any
  // inline elements that wrap the cursor, properly close them off, and create
  // the same group of wrapping inline elements in the inserted/moved
  // element. This logic is incorporated into splitTree.

  // Find the first wrapping non-inline element. (1-5 above)
  if (ELEMENT_NODE == cursorParent.nodeType)
  {
      // When the cursor is on an element node, it's before that element in the
      // document, and so we only want to consider its parent for deciding what
      // to do. The same is true when the cursor points to just before a text
      // node, so we only need to check the cursorParent.
      var wrapNode = cursorParent;
  }
  else if (TEXT_NODE == cursorParent.nodeType)
  {
      // Since we know that a text node is not the wrapper, we'll start with
      // its parent.
      var wrapNode = cursorParent.parentNode;
  }
  else
  {
      // We are dealing with an XML document.  This should be expanded to
      // handle these cases.
      // http://www.w3schools.com/Dom/dom_nodetype.asp
      alert('You have selected a node from an XML document, type ' +
            cursorParent.nodeType + '.\nXML documents are not ' +
            'yet supported.');
      // Let the browser deal with it.
      return true;
  }

  // This is an array used as a stack for recreating the current 'state' of
  // the cursor.  (eg. If the cursor is inside of an em tag inside of a p,
  // we'll add the em to the stack so that we can recreate it while splitting
  // the p.)
  var recreateStack = [];

  while (!EnterParagraphs.prototype._pWrapper.test(wrapNode.nodeName))
  {
    recreateStack.push(wrapNode);
    wrapNode = wrapNode.parentNode;

    if (!wrapNode)
    {
      // Broken DOM, let the browser handle it.
      return true;
    }
  }

  if (wrapNode.nodeName.toLowerCase() in {pre:''})
  {
    insertLineBreak(cursorParent, cursorOffset, true, doc);
    this.editor.updateToolbar();
    
    Xinha._stopEvent(ev);
    
    range.setStart(cursorParent, cursorOffset+1);
    range.setEnd(cursorParent, cursorOffset+1);
    selection.removeAllRanges();
    selection.addRange(range);
    return false;
  }
  else if (wrapNode.nodeName.toLowerCase() in {body:'',div:'',fieldset:'',form:'',map:'',noscript:'','object':'',blockquote:''})
  {
    // We know that the there are no block elements between the cursor and the
    // wrapNode, but there may be inline elements.  What we'll do is take
    // everything in the tree below wrapNode, embed it into a P element, and
    // then split the whole thing.

    // The cursor might be at the ending edge of the wrapNode.
    // 0. Pointing inside a completely empty element <body></body>
    // 1. Pointing to a text node <body>^This is text</body>
    // 2. Pointing to an inline node that is the child of the wrapNode.<body>^<em>text</em></body>
    // 3. Pointing to an inline node that is a non-direct descendant of the wrapNode.<body><q>^<em>text</em></q></body>
    // 4. Pointing to an inline node that is a non-direct descendant of the wrapNode.<body><q><em>text</em> this^</q></body>
    // 5. Pointing to the end of the wrapNode.<body>Here is some text.^</body>
    // 6. Pointing to a block node that is just inside of the wrapNode.<body>^<p>text</p></body>

    // In the special case of a completely empty node, the cursor is still
    // visible, and the user expects to have two lines after hitting the enter
    // key.  We'll add two paragraphs to any of these nodes if they are empty.
    if (!wrapNode.firstChild) {
      var embedNode1 = doc.createElement('p');
      var embedNode2 = doc.createElement('p');
      embedNode1 = wrapNode.appendChild(embedNode1);
      embedNode2 = wrapNode.appendChild(embedNode2);
      // The unicode character below is a representation of a non-breaking
      // space we use to prevent the paragraph from having visual glitches.
      var emptyTextNode1 = doc.createTextNode('\u00a0');
      var emptyTextNode2 = doc.createTextNode('\u00a0');
      emptyTextNode1 = embedNode1.appendChild(emptyTextNode1);
      emptyTextNode2 = embedNode2.appendChild(emptyTextNode2);

      Xinha._stopEvent(ev);

      range.setStart(emptyTextNode2, 0);
      range.setEnd(emptyTextNode2, 0);
      selection.removeAllRanges();
      selection.addRange(range);

      return false;
    }

    var startNode = cursorParent;
    for (;(startNode != wrapNode) && (startNode.parentNode != wrapNode);)
    {
      startNode = startNode.parentNode;
    }

    if (TEXT_NODE == cursorParent.nodeType)
    {
      var treeRoot = cursorParent;
    }
    else if (cursorOffset == cursorParent.childNodes.length)
    {
      var embedNode = doc.createElement('p');
      embedNode = wrapNode.appendChild(embedNode);
      // The unicode character below is a representation of a non-breaking
      // space we use to prevent the paragraph from having visual glitches.
      var emptyTextNode = doc.createTextNode('\u00a0');
      emptyTextNode = embedNode.appendChild(emptyTextNode);

      Xinha._stopEvent(ev);

      range.setStart(emptyTextNode, 0);
      range.setEnd(emptyTextNode, 0);
      selection.removeAllRanges();
      selection.addRange(range);

      return false;
    }
    else
    {
      var treeRoot = cursorParent.childNodes[cursorOffset];
    }

    for (;wrapNode != treeRoot.parentNode;)
    {
      treeRoot = treeRoot.parentNode;
    }

    // At this point, treeRoot points to the root of the subtree inside
    // wrapNode that containes our cursor.  If this happens to be a block level
    // element, we'll just insert a P node here.  Otherwise, we'll replace this
    // node with an empty P node, and then embed it into that P node.

    if (EnterParagraphs.prototype._pWrapper.test(treeRoot.nodeName))
    {
      var embedNode = doc.createElement('p');
      embedNode = wrapNode.insertBefore(embedNode, treeRoot);
      // The unicode character below is a representation of a non-breaking
      // space we use to prevent the paragraph from having visual glitches.
      var emptyTextNode = doc.createTextNode('\u00a0');
      emptyTextNode = embedNode.appendChild(emptyTextNode);

      Xinha._stopEvent(ev);

      range.setStart(treeRoot, 0);
      range.setEnd(treeRoot, 0);
      selection.removeAllRanges();
      selection.addRange(range);

      return false;
    }
    var embedNode = doc.createElement('p');

    treeRoot = wrapNode.replaceChild(embedNode, treeRoot);

    treeRoot = embedNode.appendChild(treeRoot);
    
    if ((TEXT_NODE == treeRoot.nodeType) && !/\S/.test(treeRoot.nodeValue))
    {
      var newCursor = treeRoot;
    }
    else if (TEXT_NODE == treeRoot.nodeType)
    {
      var newCursor = splitTree(embedNode, treeRoot, cursorOffset, doc);
    }
    else
    {
      var parentOffset = this.indexInParent(treeRoot);
      if (null === parentOffset)
      {
        // We can't do anything with this cursor, so return.
        return;
      }
      var newCursor = splitTree(embedNode, treeRoot.parentNode, parentOffset, doc);
    }
  }
  else if (wrapNode.nodeName.toLowerCase() in {td:'',address:''})
  {
    // Line breaks BR element
    var newCursor = insertLineBreak(cursorParent, cursorOffset, false, doc);
  }
  else if (wrapNode.nodeName.toLowerCase() in {dl:''})
  {
    // Find the leftSibling of the cursorParent.  If none, insert dt (term) followed by dd (definition),
    // otherwise insert same as cursorParent followed by same as leftSibling.
    // Check to see if the leftSibling and rightSibling are the same and then just insert the one term.
    // XXX TODO
  }
  else if (wrapNode.nodeName.toLowerCase() in {h1:'',h2:'',h3:'',h4:'',h5:'',h6:'',p:''})
  {
    // Split wrapNode into two.
    var newCursor = splitTree(wrapNode, cursorParent, cursorOffset, doc);
  }
  else if (wrapNode.nodeName.toLowerCase() in {dt:'',dd:'',li:''})
  {
    // To the bane of software developers the world over, users expect to be
    // able to hit enter twice to end a list, whether at the end or in the
    // middle.  This means that we need to have special handling for list items
    // to check for the second return.  We do this by testing to see if the
    // current list item is empty, and if so, deleting it, splitting the list
    // into two if necessary, and inserting a paragraph.
    var newCursor = splitTree(wrapNode, cursorParent, cursorOffset, doc);
  }
  else if (wrapNode.nodeName.toLowerCase() in {ol:'',ul:''})
  {
    // Insert li
    var breaker = doc.createElement('li');
    if (TEXT_NODE == cursorParent.nodeType)
    {
      var newCursor = wrapNode.insertBefore(breaker,cursorParent);
    }
    else
    {
      var newCursor = wrapNode.insertBefore(breaker,cursorParent.childNodes[cursorOffset]);
    }
  }

  this.editor.updateToolbar();
  
  Xinha._stopEvent(ev);
  
  // We turn the newCursor node into a cursor and offset into the parent.
  var newOffset = 0;
  while (newCursor.parentNode.childNodes[newOffset] != newCursor)
  {
    newOffset++;
  }
  newCursor = newCursor.parentNode;

  // Monkey the new cursor position into somewhere the user should actually be
  // typing.
  
  
  Xinha._stopEvent(ev);
  range.setStart(newCursor, newOffset);
  range.setEnd(newCursor, newOffset);
  selection.removeAllRanges();
  selection.addRange(range);
  return false;
}

/**
* If the cursor is on the edge of certain elements, we reposition it so that we
* can break the line in a way that's more useful to the user.
*/

EnterParagraphs.prototype.moveCursorOnEdge = function(selection)
{
  // We'll only move the cursor if the selection is collapsed (ie. no contents)
  if ((selection.anchorNode != selection.focusNode) ||
      (selection.anchorOffset != selection.focusOffset))
  {
    return;
  }

  // We now need to filter based on the element we are inside of.  If the
  // cursor is on a text node, we look at the parent of the node.
  var wrapNode = selection.anchorNode;
  if (TEXT_NODE == wrapNode.nodeType)
  {
    wrapNode = wrapNode.parentNode;
  }
  
  // Check the wrapper against our lists of trigger nodes.
  if (!EnterParagraphs.prototype._pifyParent.test(wrapNode.nodeName) &&
      !EnterParagraphs.prototype._pifySibling.test(wrapNode.nodeName))
  {
    // We're lucky, no need to check for edges, let's just return.
    return;
  }

  // Okay, time to perform edge checking.  If the cursor is inside of a text
  // node, the rules for edge detection are quite specialized, so we'll deal
  // with that first.  Since text nodes can't contain other nodes, we only have
  // to perform this check once.  We won't actually move the cursor here, just
  // our copy of it, because we won't know where it belongs until we're dealing
  // with the nodes themselves, rather than the text.

  var cursorParent = selection.anchorNode;
  var cursorOffset = selection.anchorOffset;

  for (;this.cursorAtEnd(cursorParent, cursorOffset);)
  {
    if (TEXT_NODE == cursorParent.nodeType)
    {
      // If we're at the end and stuck inside of a text node, we move out of
      // the text node, which is a simpler case, than continue.
      var parentOffset = this.indexInParent(cursorParent);
      if (null === parentOffset)
      {
        // We can't do anything with this cursor, so return.
        return;
      }

      cursorParent = cursorParent.parentNode;
      cursorOffset = parentOffset + 1;
      continue;
    }

    var parentOffset = this.indexInParent(cursorParent);
    if (null === parentOffset)
    {
      // We can't do anything with this cursor, so return.
      return;
    }

    cursorParent = cursorParent.parentNode;
    cursorOffset = parentOffset + 1;

    // If we are no longer inside of one of our trigger nodes, we're done.
    if (!this._pifyParent.test(cursorParent.nodeName) &&
        !this._pifySibling.test(cursorParent.nodeName))
    {
      // Move the real cursor.
      selection.removeAllRanges();
      var range = this.editor.createRange(selection);
      range.setStart(cursorParent, cursorOffset);
      range.setEnd(cursorParent, cursorOffset);
      selection.addRange(range);
      return;
    }
  }

  for (;this.cursorAtBeginning(cursorParent, cursorOffset);)
  {
    if (TEXT_NODE == cursorParent.nodeType)
    {
      // If we're at the beginning and stuck inside of a text node, we move out
      // of the text node, which is a simpler case, than continue.
      var parentOffset = this.indexInParent(cursorParent);
      if (null === parentOffset)
      {
        // We can't do anything with this cursor, so return.
        return;
      }

      cursorParent = cursorParent.parentNode;
      cursorOffset = parentOffset;
      continue;
    }

    var parentOffset = this.indexInParent(cursorParent);
    if (null === parentOffset)
    {
      // We can't do anything with this cursor, so return.
      return;
    }

    cursorParent = cursorParent.parentNode;
    cursorOffset = parentOffset;

    // If we are no longer inside of one of our trigger nodes, we're done.
    if (!this._pifyParent.test(cursorParent.nodeName) &&
        !this._pifySibling.test(cursorParent.nodeName))
    {
      // Move the real cursor.
      selection.removeAllRanges();
      var range = this.editor.createRange(selection);
      range.setStart(cursorParent, cursorOffset);
      range.setEnd(cursorParent, cursorOffset);
      selection.addRange(range);
      return;
    }
  }
}

EnterParagraphs.prototype.handleEnter = function(ev)
{
  
  var cursorNode;
  
  // Grab the selection and associated range
  
  var sel = this.editor.getSelection();
  var rng = this.editor.createRange(sel);
  
  // if we are at the end of a list and the node is empty let the browser handle
  // it to get us out of the list.
  
  if ( this.isNormalListItem(rng) )
  {
    return true;
  }
  
  // as far as I can tell this isn't actually used.
  
  this.takenIds = new Object();
  
  // Grab ranges for document re-stuffing, if appropriate
  //
  // pStart and pEnd are arrays consisting of
  // [0] neighbor node
  // [1] insertion type
  // [2] roam
  
  var pStart = this.processSide(rng, "left");
  
  var pEnd = this.processSide(rng, "right");
  
  // used to position the cursor after insertion.
  
  cursorNode = pEnd[2];
  
  // Get rid of everything local to the selection
  
  sel.removeAllRanges();
  rng.deleteContents();
  
  // Grab a node we'll have after insertion, since fragments will be lost
  //
  // we'll use this to position the cursor.
  
  var holdEnd = this.forEachNodeUnder( cursorNode, "find_cursorpoint", "ltr", false, true);
  
  if ( ! holdEnd )
  {
    alert( "INTERNAL ERROR - could not find place to put cursor after ENTER" );
  }
  
  // Insert our carefully chosen document fragments
  
  if ( pStart )
  {
    
    this.insertAdjacentElement(pStart[0], pStart[1], pStart[2]);
  }
  
  if ( pEnd && pEnd.nodeType != 1)
  {
    
    this.insertAdjacentElement(pEnd[0], pEnd[1], pEnd[2]);
  }
  
  // Move the caret in front of the first good text element
  
  if ((holdEnd) && (this._permEmpty.test(holdEnd.nodeName) ))
  {
    
    var prodigal = 0;
    while ( holdEnd.parentNode.childNodes.item(prodigal) != holdEnd )
    {
      prodigal++;
    }
    
    sel.collapse( holdEnd.parentNode, prodigal);
  }
  else
  {
    
    // holdEnd might be false.
    
    try
    {
      sel.collapse(holdEnd, 0);
      
      // interestingly, scrollToElement() scroll so the top if holdEnd is a text node.
      
      if ( holdEnd.nodeType == 3 )
      {
        holdEnd = holdEnd.parentNode;
      }
      
      this.editor.scrollToElement(holdEnd);
    }
    catch (e)
    {
      // we could try to place the cursor at the end of the document.
    }
  }
  
  this.editor.updateToolbar();
  
  Xinha._stopEvent(ev);
  
  return true;
  
};	// end of handleEnter()

// END
