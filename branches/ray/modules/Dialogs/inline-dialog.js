
  /*--------------------------------------:noTabs=true:tabSize=2:indentSize=2:--
    --  Xinha (is not htmlArea) - http://xinha.gogo.co.nz/
    --
    --  Use of Xinha is granted by the terms of the htmlArea License (based on
    --  BSD license)  please read license.txt in this package for details.
    --
    --  Xinha was originally based on work by Mihai Bazon which is:
    --      Copyright (c) 2003-2004 dynarch.com.
    --      Copyright (c) 2002-2003 interactivetools.com, inc.
    --      This copyright notice MUST stay intact for use.
    --
    --  This is the implementation of the inline dialog (as use by the Linker plugin)
    --
    --  
    --
    --
    --  $HeadURL$
    --  $LastChangedDate$
    --  $LastChangedRevision$
    --  $LastChangedBy$
    --------------------------------------------------------------------------*/
Xinha.Dialog = function(editor, html, localizer, size, layer)
{
  var dialog = this;
  this.id    = { };
  this.r_id  = { }; // reverse lookup id
  this.editor   = editor;
  this.document = document;
  this.layer = (layer) ? layer : 0;
  
  if ( !Xinha.Dialog.background[this.layer] )
  {
  	Xinha.Dialog.background[this.layer] = [];
  	
    if (Xinha.is_ie)
    { // IE6 needs the iframe to hide select boxes
      var backG = document.createElement("iframe");
      backG.src = "about:blank";
    }
    else 
    { // Mozilla (<FF3) can't have the iframe, because it hides the caret in text fields 
      // see https://bugzilla.mozilla.org/show_bug.cgi?id=226933
      // unfortunately https://bugzilla.mozilla.org/show_bug.cgi?id=230701 indicates that this is an issue with pos fixed div, too
      var backG = document.createElement("div");
    }
    backG.className = "xinha_dialog_background";
    with (backG.style)
    {
      position = "absolute";//(Xinha.is_ie) ? "absolute" : "fixed"; 
      top = 0;
      left = 0;
      border = 'none';
      overflow = "hidden";
      display = "none";
      zIndex = 1001 + this.layer;
    }
    document.body.appendChild(backG);
    Xinha.Dialog.background[this.layer].push(backG);
    
    backG = document.createElement("div");
    with (backG.style)
    {
      position =  "absolute";//(Xinha.is_ie) ? "absolute" : "fixed";
      top = 0;
      left = 0;
      overflow = "hidden";
      display = "none";
      zIndex = 1002+ this.layer;
    } 
    document.body.appendChild(backG);
    Xinha.Dialog.background[this.layer].push(backG);
    backG = null;
    Xinha.freeLater(Xinha.Dialog.background[this.layer]);
  }
  var rootElem = document.createElement('div');
  rootElem.style.position = 'absolute';
  rootElem.style.zIndex = 1003+ this.layer;
  rootElem.style.display  = 'none';
  
  // FIXME: This is nice, but I don't manage to get it switched off on text inputs :(
  // rootElem.style.MozUserSelect = "none";
  
  rootElem.className = 'dialog';
  
 // Xinha.Dialog.background[this.layer][1].appendChild(rootElem);
  document.body.appendChild(rootElem);

  rootElem.style.paddingBottom = "10px";
  rootElem.style.width = size.width + 'px';

  
  this.size = size;
  if (size.height)
  {
    if (Xinha.ie_version < 7)
    {
      rootElem.style.height = size.height + 'px';
    }
    else
    {
      rootElem.style.minHeight =  size.height + 'px';
    }
  }

  if(typeof localizer == 'function')
  {
    this._lc = localizer;
  }
  else if(localizer)
  {
    this._lc = function(string)
    {
      return Xinha._lc(string,localizer);
    };
  }
  else
  {
    this._lc = function(string)
    {
      return string;
    };
  }

  html = html.replace(/\[([a-z0-9_]+)\]/ig,
                      function(fullString, id)
                      {
                        if(typeof dialog.id[id] == 'undefined')
                        {
                          dialog.id[id] = Xinha.uniq('Dialog');
                          dialog.r_id[dialog.id[id]] = id;
                        }
                        return dialog.id[id];
                      }
             ).replace(/<l10n>(.*?)<\/l10n>/ig,
                       function(fullString,translate)
                       {
                         return dialog._lc(translate) ;
                       }
             ).replace(/="_\((.*?)\)"/g,
                       function(fullString, translate)
                       {
                         return '="' + dialog._lc(translate) + '"';
                       }
             );

  rootElem.innerHTML = html;

  //make the first h1 to drag&drop the rootElem
  var titleBar = rootElem.getElementsByTagName("h1")[0];
  titleBar.onmousedown = function(ev) { dialog._dragStart(ev); };
  titleBar.style.MozUserSelect = "none";
  
  var but = document.createElement('div');
  but.className= 'closeButton'; 
  
  but.onmousedown = function(ev) { this.className = "closeButton buttonClick"; Xinha._stopEvent((ev) ? ev : window.event); return false;};
  but.onmouseout = function(ev) { this.className = "closeButton"; Xinha._stopEvent((ev) ? ev : window.event); return false;};
  but.onmouseup = function() { this.className = "closeButton"; dialog.hide(); return false;};
  titleBar.appendChild(but);

  var butX = document.createElement('span');
  butX.className = 'innerX';
  butX.style.position = 'relative';
  butX.style.top = '-3px';

  butX.appendChild(document.createTextNode('\u00D7'));
  but.appendChild(butX);
  butX = null;
  but = null;
  var icon = document.createElement('img');
  icon.className = 'icon';
  icon.src = _editor_url + 'images/xinha-small-icon.gif';
  icon.style.position = 'absolute';
  icon.style.top = '3px';
  icon.style.left = '2px';
  titleBar.style.paddingLeft = '30px';
  titleBar.appendChild(icon);
  icon = null;
  
  var all = rootElem.getElementsByTagName("*");

  for (var i=0; i<all.length;i++)
  {
  	var el = all[i]; 
    if (el.tagName.toLowerCase() == 'textarea' || el.tagName.toLowerCase() == 'input')
    {
      // FIXME: this doesn't work
      //el.style.MozUserSelect = "text";
    }
    else
    {
      el.unselectable = "on";
    }
  }

  var resizeHandle = document.createElement('div');
  resizeHandle.className = "resizeHandle";
  with (resizeHandle.style)
  {
    position = "absolute";
    bottom = "0px";
    right= "0px";
  }
  resizeHandle.onmousedown = function(ev) { dialog._resizeStart(ev); };
  rootElem.appendChild(resizeHandle);
  resizeHandle = null;
  this.rootElem = rootElem;
  // for caching size & position after dragging & resizing
  this.size = {};
  titleBar = null;
  rootElem = null;
  Xinha.freeLater(this,'rootElem');
};

Xinha.Dialog.background = [];
Xinha.Dialog.prototype.sizeBackground = function()
{
  var win_dim = Xinha.viewportSize();
  Xinha.Dialog.background[this.layer][0].style.width = win_dim.x + 'px';
  Xinha.Dialog.background[this.layer][0].style.height = win_dim.y + 'px';
  Xinha.Dialog.background[this.layer][1].style.width = win_dim.x + 'px';
  Xinha.Dialog.background[this.layer][1].style.height = win_dim.y + 'px';
  window.scroll(this.scrollPos.x, this.scrollPos.y);
  return win_dim;
}

Xinha.Dialog.prototype.onresize = function()
{
  return true;
};

Xinha.Dialog.prototype.show = function(values)
{
  var rootElem = this.rootElem;
  var scrollPos = this.scrollPos = this.editor.scrollPos();
  var dialog = this;
  
  function resetScroll()
  {
    if ( dialog.dialogShown )
    {
      window.scroll(scrollPos.x,scrollPos.y);
      window.setTimeout(resetScroll,150);
    }
  }
  Xinha.Dialog.background[this.layer][0].style.left = this.scrollPos.x + 'px';
  Xinha.Dialog.background[this.layer][0].style.top = this.scrollPos.y + 'px';
  Xinha.Dialog.background[this.layer][1].style.left = this.scrollPos.x + 'px';
  Xinha.Dialog.background[this.layer][1].style.top = this.scrollPos.y + 'px';
  
  // We need to preserve the selection
  if(Xinha.is_ie)
  {      
    this._lastRange = this.editor._createRange(this.editor._getSelection());
  }
  else
  {
  	this._lastRange = this.editor._createRange(this.editor._getSelection()).cloneRange();
  }
  this.editor.deactivateEditor();
  
  // unfortunately we have to hide the editor (iframe/caret bug)
  if (Xinha.is_gecko)
  {
    this._restoreTo = [this.editor._textArea.style.display, this.editor._iframe.style.visibility, this.editor.hidePanels()];
    this.editor._textArea.style.display = 'none';
    this.editor._iframe.style.visibility   = 'hidden';
  }
  if (!this.editor._isFullScreen)
  {
    if(Xinha.is_ie && document.compatMode == 'CSS1Compat')
    {
      var bod = document.getElementsByTagName('html');
    }
    else
    {
      var bod = document.getElementsByTagName('body');
    }
  
    bod[0].style.overflow='hidden';
    window.scroll(this.scrollPos.x, this.scrollPos.y);
  }

  Xinha.Dialog.background[this.layer][0].style.display = '';
  Xinha.Dialog.background[this.layer][1].style.display = '';
  
  var backgroundSize = this.sizeBackground();
  var backgroundHeight = backgroundSize.y;
  var backgroundWidth = backgroundSize.x;
  
  this.onResizeWin = function () {dialog.sizeBackground()};
  Xinha._addEvent(window, 'resize', this.onResizeWin );
  

  
  var rootElemStyle = rootElem.style;
  rootElemStyle.display   = '';
  
  var dialogHeight = rootElem.offsetHeight;
  var dialogWidth = rootElem.offsetWidth;
  
  if (dialogHeight >  backgroundHeight)
  {
  	rootElemStyle.height =  backgroundHeight + "px";
  	if (rootElem.scrollHeight > dialogHeight)
  	{
  	  rootElemStyle.overflowY = "auto";
  	}
  }

  if(this.size.top && this.size.left)
  {
    rootElemStyle.top =  parseInt(this.size.top,10) + 'px';
    rootElemStyle.left = parseInt(this.size.left,10) + 'px';
  }
  else
  {
    if (this.editor.btnClickEvent)
    {
      var btnClickEvent = this.editor.btnClickEvent; 
      rootElemStyle.top =  btnClickEvent.clientY + this.scrollPos.y +'px';
     
      if (dialogHeight + rootElem.offsetTop >  backgroundHeight)
      {
        rootElemStyle.top = this.scrollPos.y;
      }
      rootElemStyle.left = btnClickEvent.clientX +  this.scrollPos.x +'px';
      if (dialogWidth + rootElem.offsetLeft >  backgroundWidth)
      {
        rootElemStyle.left =  btnClickEvent.clientX - dialogWidth   + 'px';
        if (rootElem.offsetLeft < 0) 
        {
        	rootElemStyle.left = 0;
        }
      }
      this.editor.btnClickEvent = null;
    }
    else
    {
    var top =  ( backgroundHeight - dialogHeight) / 2;
    var left = ( backgroundWidth - dialogWidth) / 2;
    rootElemStyle.top =  ((top > 0) ? top : 0) +'px';
    rootElemStyle.left = ((left > 0) ? left : 0)+'px';		
    }
  	
  }
  this.width = dialogWidth;
  this.height = dialogHeight;  
  
  if(typeof values != 'undefined')
  {
    this.setValues(values);
  }
  this.dialogShown = true;
  resetScroll();
};

Xinha.Dialog.prototype.hide = function()
{
  this.rootElem.style.display = 'none';
  Xinha.Dialog.background[this.layer][0].style.display = 'none';
  Xinha.Dialog.background[this.layer][1].style.display = 'none';
  var dialog = this;

  Xinha._removeEvent(window, 'resize', this.onResizeWin);
  
  if (Xinha.is_gecko)
  {
    this.editor._textArea.style.display = this._restoreTo[0];
    this.editor._iframe.style.visibility   = this._restoreTo[1];
    this.editor.showPanels(this._restoreTo[2]);  
  }
  
  if (!this.editor._isFullScreen)
  {
    if(Xinha.is_ie && document.compatMode == 'CSS1Compat')
    {
      var bod = document.getElementsByTagName('html');
    }
    else
    {
      var bod = document.getElementsByTagName('body');
    }
    bod[0].style.overflow='';
    window.scroll(this.scrollPos.x, this.scrollPos.y);
  }
// Restore the selection
  this.editor.activateEditor();
  if (Xinha.is_gecko)
  { 	 	
    var sel = this.editor.getSelection();
    sel.removeAllRanges();
    sel.addRange(this._lastRange);
  }
  else
  { 
    this._lastRange.select();
  }
  this.dialogShown = false;
  this.editor.updateToolbar();
  return this.getValues();
};

Xinha.Dialog.prototype.toggle = function()
{
  if(this.rootElem.style.display == 'none')
  {
    this.show();
  }
  else
  {
    this.hide();
  }
};

Xinha.Dialog.prototype.getElementById = function(id)
{
  return this.document.getElementById(this.id[id] ? this.id[id] : id);
};

Xinha.Dialog.prototype.getElementsByName = function(name)
{
  return this.document.getElementsByName(this.id[name] ? this.id[name] : name);
};

Xinha.Dialog.prototype._dragStart = function (ev) 
{

  var dialog = this;
  if (dialog.dragging) 
  {
    return;
  }
  dialog.dragging = true;

  var st = dialog.rootElem.style;

  dialog.xOffs = ((Xinha.is_ie) ? window.event.offsetX : ev.layerX);
  dialog.yOffs = ((Xinha.is_ie) ? window.event.offsetY : ev.layerY);

  Xinha._addEvent(document, "mousemove", function(ev) { dialog.dragIt(ev); } );
  Xinha._addEvent(document, "mouseup", function (ev) { dialog.dragEnd(ev); } );
};

Xinha.Dialog.prototype.dragIt = function(ev)
{
  var dialog = this;

  if (!dialog.dragging) 
  {
    return false;
  }
  ev = (Xinha.is_ie) ? window.event : ev;

  var posY = ev.clientY + this.scrollPos.y;
  var posX = ev.clientX + this.scrollPos.x;

  var st = dialog.rootElem.style;

  st.left = (posX - dialog.xOffs) + "px";
  st.top = (posY - dialog.yOffs) + "px";
};

Xinha.Dialog.prototype.dragEnd = function(ev)
{
  var dialog = this;
  dialog.dragging = false;

  Xinha._removeEvent(document, "mousemove", function(ev) { dialog.dragIt(ev); } );
  Xinha._removeEvent(document, "mouseup", function (ev) { dialog.dragEnd(ev); } );

  dialog.size.top  = dialog.rootElem.style.top;
  dialog.size.left =dialog.rootElem.style.left;
};

Xinha.Dialog.prototype._resizeStart = function (ev) {
  var dialog = this;

  if (dialog.resizing)
  {
    return;
  }
  dialog.resizing = true;

  var st = dialog.rootElem.style;
  st.minHeight = '';
  st.overflow  =  'hidden';
  dialog.xOffs = parseInt(st.left,10);
  dialog.yOffs = parseInt(st.top,10);

  Xinha._addEvent(document, "mousemove", function(ev) { dialog.resizeIt(ev); } );
  Xinha._addEvent(document, "mouseup", function (ev) { dialog.resizeEnd(ev); } );
};

Xinha.Dialog.prototype.resizeIt = function(ev)
{
  var dialog = this;

  if (!dialog.resizing) {
    return false;
  }

  var posY = ev.clientY + dialog.scrollPos.y;
  var posX = ev.clientX + dialog.scrollPos.x;

  var st = dialog.rootElem.style;

  posX = posX - dialog.xOffs;
  posY = posY - dialog.yOffs;

  st.width  = (( posX > 10) ? posX : 10) + "px";
  st.height = (( posY > 10) ? posY : 10) + "px";

  dialog.width = dialog.rootElem.offsetWidth;
  dialog.height = dialog.rootElem.offsetHeight;

  dialog.onresize();
};

Xinha.Dialog.prototype.resizeEnd = function(ev)
{
  var dialog = this;
  dialog.resizing = false;

  Xinha._removeEvent(document, "mousemove", function(ev) { dialog.resizeIt(ev); } );
  Xinha._removeEvent(document, "mouseup", function (ev) { dialog.resizeEnd(ev); } );

  dialog.size.width  = dialog.rootElem.offsetWidth;
  dialog.size.height = dialog.rootElem.offsetHeight;
};

Xinha.Dialog.prototype.setValues = function(values)
{
  for(var i in values)
  {
    var elems = this.getElementsByName(i);
    if(!elems) continue;
    for(var x = 0; x < elems.length; x++)
    {
      var e = elems[x];
      switch(e.tagName.toLowerCase())
      {
        case 'select'  :
        {
          for(var j = 0; j < e.options.length; j++)
          {
            if(typeof values[i] == 'object')
            {
              for(var k = 0; k < values[i].length; k++)
              {
                if(values[i][k] == e.options[j].value)
                {
                  e.options[j].selected = true;
                }
              }
            }
            else if(values[i] == e.options[j].value)
            {
              e.options[j].selected = true;
            }
          }
          break;
        }


        case 'textarea':
        case 'input'   :
        {
          switch(e.getAttribute('type'))
          {
            case 'radio'   :
            {
              if(e.value == values[i])
              {
                e.checked = true;
              }
              break;
            }

            case 'checkbox':
            {
              if(typeof values[i] == 'object')
              {
                for(var j in values[i])
                {
                  if(values[i][j] == e.value)
                  {
                    e.checked = true;
                  }
                }
              }
              else
              {
                if(values[i] == e.value)
                {
                  e.checked = true;
                }
              }
              break;
            }

            default    :
            {
              e.value = values[i];
            }
          }
          break;
        }

        default        :
        break;
      }
    }
  }
};

Xinha.Dialog.prototype.getValues = function()
{
  var values = [ ];
  var inputs = Xinha.collectionToArray(this.rootElem.getElementsByTagName('input'))
              .append(Xinha.collectionToArray(this.rootElem.getElementsByTagName('textarea')))
              .append(Xinha.collectionToArray(this.rootElem.getElementsByTagName('select')));

  for(var x = 0; x < inputs.length; x++)
  {
    var i = inputs[x];
    if(!(i.name && this.r_id[i.name])) continue;

    if(typeof values[this.r_id[i.name]] == 'undefined')
    {
      values[this.r_id[i.name]] = null;
    }
    var v = values[this.r_id[i.name]];

    switch(i.tagName.toLowerCase())
    {
      case 'select':
      {
        if(i.multiple)
        {
          if(!v.push)
          {
            if(v != null)
            {
              v = [v];
            }
            else
            {
              v = new Array();
            }
          }
          for(var j = 0; j < i.options.length; j++)
          {
            if(i.options[j].selected)
            {
              v.push(i.options[j].value);
            }
          }
        }
        else
        {
          if(i.selectedIndex >= 0)
          {
            v = i.options[i.selectedIndex];
          }
        }
        break;
      }

      case 'textarea':
      case 'input'   :
      default        :
      {
        switch(i.type.toLowerCase())
        {
          case  'radio':
          {
            if(i.checked)
            {
              v = i.value;
              break;
            }
          }

          case 'checkbox':
          {
            if(v == null)
            {
              if(this.getElementsByName(this.r_id[i.name]).length > 1)
              {
                v = new Array();
              }
            }

            if(i.checked)
            {
              if(v != null && typeof v == 'object' && v.push)
              {
                v.push(i.value);
              }
              else
              {
                v = i.value;
              }
            }
            break;
          }

          default   :
          {
            v = i.value;
            break;
          }
        }
      }

    }

    values[this.r_id[i.name]] = v;
  }
  return values;
};