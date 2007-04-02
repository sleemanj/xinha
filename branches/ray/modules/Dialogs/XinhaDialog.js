
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

/** Xinha Dialog
 *
 *
 * @param editor Xinha object    
 * @param html string 
 * @param localizer string the "context" parameter for Xinha._lc(), typically the name of the plugin
 * @param size object with two possible properties of the size: width & height as int, where height is optional
 */
Xinha.Dialog = function(editor, html, localizer, size, options)
{
  var dialog = this;
  this.id    = { };
  this.r_id  = { }; // reverse lookup id
  this.editor   = editor;
  this.document = document;
  this.size = size;
  this.modal = (options && options.modal === false) ? false : true;
  this.closable = (options && options.closable === false) ? false : true;
  this.layer = (options && options.layer) ? options.layer : 0;
  
  
  if (Xinha.is_ie)
  { // IE6 needs the iframe to hide select boxes
    var backG = document.createElement("iframe");
    backG.src = "about:blank";
    backG.onreadystatechange = function () 
    {
      var doc = window.event.srcElement.contentWindow.document;
      if (doc && doc.body)
      {
        doc.body.style.backgroundColor = "#666666";
      }
    }
  }
  else
  { // Mozilla (<FF3) can't have the iframe, because it hides the caret in text fields
    // see https://bugzilla.mozilla.org/show_bug.cgi?id=226933
    var backG = document.createElement("div");
  }
  backG.className = "xinha_dialog_background";
  with (backG.style)
  {
    position = "absolute";
    top = 0;
    left = 0;
    border = 'none';
    overflow = "hidden";
    display = "none";
    zIndex = (this.modal ? 1025 : 1001 ) + this.layer;
  }
  document.body.appendChild(backG);
  this.background = backG;

  backG = null;
  Xinha.freeLater(this, "background");

  var rootElem = document.createElement('div');
  //I've got the feeling dragging is much slower in IE7 w/ pos:fixed, besides the strange fact that it only works in Strict mode 
  //rootElem.style.position = (Xinha.ie_version < 7 ||(Xinha.is_ie && document.compatMode == "BackCompat") || !this.modal) ? "absolute" : "fixed";
  rootElem.style.position = (Xinha.is_ie || !this.modal) ? "absolute" : "fixed";
  rootElem.style.zIndex = (this.modal ? 1027 : 1003 ) + this.layer;
  rootElem.style.display  = 'none';
  
  if (!this.modal)
  {
    Xinha._addEvent(rootElem,'mousedown', function () { Xinha.Dialog.activateModeless(dialog);});
  }
  
  // FIXME: This is nice, but I don't manage to get it switched off on text inputs :(
  // rootElem.style.MozUserSelect = "none";
  
  rootElem.className = 'dialog';
  
 // this.background[1].appendChild(rootElem);
  document.body.appendChild(rootElem);

  rootElem.style.paddingBottom = "10px";
  rootElem.style.width = ( size && size.width )  ? size.width + 'px' : '';

  if (size && size.height)
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

  html = this.translateHtml(html,localizer)

  var main = document.createElement('div');
  rootElem.appendChild(main);
  main.innerHTML = html;

  //make the first h1 to drag&drop the rootElem
  var captionBar = main.removeChild( main.getElementsByTagName("h1")[0]);
  rootElem.insertBefore(captionBar,main);
  captionBar.onmousedown = function(ev) { dialog._dragStart(ev); };
  
  captionBar.style.MozUserSelect = "none";
  
  this.buttons = document.createElement('div');
  with (this.buttons.style)
  {
    position = "absolute";
    top = "0";
    right = "2px";
  }
  rootElem.appendChild(this.buttons);
  
  this.closer = null;
  if ( this.closable )
  {
    this.closer = document.createElement('div');
    this.closer.className= 'closeButton'; 
      
    this.closer.onmousedown = function(ev) { this.className = "closeButton buttonClick"; Xinha._stopEvent((ev) ? ev : window.event); return false;};
    this.closer.onmouseout = function(ev) { this.className = "closeButton"; Xinha._stopEvent((ev) ? ev : window.event); return false;};
    this.closer.onmouseup = function() { this.className = "closeButton"; dialog.hide(); return false;};
  
    this.buttons.appendChild(this.closer);
  
    var butX = document.createElement('span');
    butX.className = 'innerX';
    butX.style.position = 'relative';
    butX.style.top = '-3px';
  
    butX.appendChild(document.createTextNode('\u00D7')); // cross
    //butX.appendChild(document.createTextNode('\u25AC')); //bar
    //butX.appendChild(document.createTextNode('\u25BA')); //triangle right
    //butX.appendChild(document.createTextNode('\u25B2')); //triangle up
    //butX.appendChild(document.createTextNode('\u25BC')); //triangle down
    this.closer.appendChild(butX);
    butX = null;
  }
  
  this.icon = document.createElement('img');
  with (this.icon)
  {
    className = 'icon';
    src = _editor_url + 'images/xinha-small-icon.gif';
    style.position = 'absolute';
    style.top = '3px';
    style.left = '2px';
  }
  captionBar.style.paddingLeft = '22px';
  rootElem.appendChild(this.icon);
  
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

  this.resizer = document.createElement('div');
  this.resizer.className = "resizeHandle";
  with (this.resizer.style)
  {
    position = "absolute";
    bottom = "0px";
    right= "0px";
  }
  this.resizer.onmousedown = function(ev) { dialog._resizeStart(ev); };
  rootElem.appendChild(this.resizer);
  
  this.rootElem = rootElem;
  this.captionBar = captionBar;
  this.main = main;
  
  captionBar = null;
  rootElem = null;
  main = null;
  resizeHandle = null;
  
  Xinha.freeLater(this,"rootElem");
  Xinha.freeLater(this,"captionBar");
  Xinha.freeLater(this,"main");
  Xinha.freeLater(this, "buttons");
  Xinha.freeLater(this, "closer");
  Xinha.freeLater(this, "icon");
  Xinha.freeLater(this, "resizer");
  Xinha.freeLater(this, "document");
  
  // for caching size & position after dragging & resizing
  this.size = {};

};

Xinha.Dialog.prototype.onresize = function()
{
  return true;
};

Xinha.Dialog.prototype.show = function(values)
{
  var rootElem = this.rootElem;
  var rootElemStyle = rootElem.style;
  var modal = this.modal;
  var scrollPos = this.scrollPos = this.editor.scrollPos();
  var dialog = this;
  //dialog.main.style.height = '';
  if ( this.attached ) 
  {
    this.editor.showPanel(rootElem);
  }
    
  if ( modal )
  {
    this.posBackground({top:0, left:0}); 
  }
 
  // We need to preserve the selection
  this._lastRange = this.editor.saveSelection();
  
  if (Xinha.is_ie && !modal)
  {
    dialog.saveSelection = function() { dialog._lastRange = dialog.editor.saveSelection();};
    Xinha._addEvent(this.editor._doc,'mouseup', dialog.saveSelection);
  }

  if ( modal ) this.editor.deactivateEditor();

  // unfortunately we have to hide the editor (iframe/caret bug)
  if (Xinha.is_gecko && modal)
  {
    this._restoreTo = [this.editor._textArea.style.display, this.editor._iframe.style.visibility, this.editor.hidePanels()];
    this.editor._textArea.style.display = 'none';
    this.editor._iframe.style.visibility   = 'hidden';
  }
  
  if ( !this.attached )
  {
    this.showBackground();
    var viewport = Xinha.viewportSize();
    if ( modal )
    {
      var pageSize = Xinha.pageSize();
      this.resizeBackground({width:pageSize.x + "px",height:pageSize.y + "px"});
    }
    var viewportHeight = viewport.y;
    var viewportWidth = viewport.x;
    //this.onResizeWin = function () {dialog.sizeBackground()};
    //Xinha._addEvent(window, 'resize', this.onResizeWin );

    rootElemStyle.display   = '';

    var dialogHeight = rootElem.offsetHeight;
    var dialogWidth = rootElem.offsetWidth;

    if (dialogHeight >  viewportHeight)
    {
      rootElemStyle.height =  viewportHeight + "px";
      if (rootElem.scrollHeight > dialogHeight)
      {
        dialog.main.style.overflowY = "auto";
      }
    }

    if(this.size.top && this.size.left)
    {
      rootElemStyle.top =  parseInt(this.size.top,10) + 'px';
      rootElemStyle.left = parseInt(this.size.left,10) + 'px';
    }
    else if (this.editor.btnClickEvent)
    {
      var btnClickEvent = this.editor.btnClickEvent;
      if (rootElemStyle.position == 'absolute')
      {
        rootElemStyle.top =  btnClickEvent.clientY + this.scrollPos.y +'px';
      }
      else
      {
        rootElemStyle.top =  btnClickEvent.clientY +'px';
      }

      if (dialogHeight + rootElem.offsetTop >  viewportHeight)
      {
        rootElemStyle.top = (rootElemStyle.position == 'absolute' ? this.scrollPos.y : 0 ) + "px" ;
      }

      if (rootElemStyle.position == 'absolute')
      {
        rootElemStyle.left = btnClickEvent.clientX +  this.scrollPos.x +'px';
      }
      else
      {
        rootElemStyle.left =  btnClickEvent.clientX +'px';
      }

      if (dialogWidth + rootElem.offsetLeft >  viewportWidth)
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
      var top =  ( viewportHeight - dialogHeight) / 2;
      var left = ( viewportWidth - dialogWidth) / 2;
      rootElemStyle.top =  ((top > 0) ? top : 0) +'px';
      rootElemStyle.left = ((left > 0) ? left : 0)+'px';
    }
  }
  this.width = dialogWidth;
  this.height = dialogHeight;

  if (!modal)
  {
    this.resizeBackground({width: dialogWidth + 'px', height: dialogHeight + 'px' });
    this.posBackground({top:  rootElemStyle.top, left: rootElemStyle.left});
  }
 
  if(typeof values != 'undefined')
  {
    this.setValues(values);
  }
  this.dialogShown = true;
};

Xinha.Dialog.prototype.hide = function()
{
  if ( this.attached )
  {
    this.editor.hidePanel(this.rootElem);
  }
  else
  {
    this.rootElem.style.display = 'none';
    this.hideBackground();
    var dialog = this;

    if (Xinha.is_gecko && this.modal)
    {
      this.editor._textArea.style.display = this._restoreTo[0];
      this.editor._iframe.style.visibility   = this._restoreTo[1];
      this.editor.showPanels(this._restoreTo[2]);
    }

    if (!this.editor._isFullScreen && this.modal)
    {
      window.scroll(this.scrollPos.x, this.scrollPos.y);
    }

    if (Xinha.is_ie && !this.modal)
    {
      Xinha._removeEvent(this.editor._doc,'mouseup', dialog.saveSelection);
    }

    if (this.modal)
    {
      this.editor.activateEditor();
    }
  }
    // Restore the selection
  this.editor.restoreSelection(this._lastRange);
  
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
Xinha.Dialog.prototype.collapse = function()
{
  if(this.collapsed)
  {
    this.collapsed = false;
    this.show();
  }
  else
  {
    this.main.style.height = 0;
    this.collapsed = true;
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
  if ( this.attached || this.dragging) 
  {
    return;
  }
  this.editor.suspendUpdateToolbar = true;
  var dialog = this;

  dialog.dragging = true;

  dialog.scrollPos = dialog.editor.scrollPos();
   
  var st = dialog.rootElem.style;

  dialog.xOffs = ((Xinha.is_ie) ? window.event.offsetX : ev.layerX);
  dialog.yOffs = ((Xinha.is_ie) ? window.event.offsetY : ev.layerY);

  dialog.mouseMove = function(ev) { dialog.dragIt(ev); };
  Xinha._addEvent(document, "mousemove", dialog.mouseMove );
  dialog.mouseUp = function (ev) { dialog.dragEnd(ev); };
  Xinha._addEvent(document, "mouseup",  dialog.mouseUp);

};

Xinha.Dialog.prototype.dragIt = function(ev)
{
  var dialog = this;

  if (!dialog.dragging) 
  {
    return false;
  }
  ev = (Xinha.is_ie) ? window.event : ev;

  if (dialog.rootElem.style.position == 'absolute')
  {
    var posY = (ev.clientY + this.scrollPos.y) - dialog.yOffs + "px";
    var posX = (ev.clientX + this.scrollPos.x) - dialog.xOffs + "px";

    var newPos = {top: posY,left: posX};
  }
  else if (dialog.rootElem.style.position == 'fixed')
  {
    var posY = ev.clientY  - dialog.yOffs + "px";
    var posX = ev.clientX - dialog.xOffs + "px";

    var newPos = {top: posY,left: posX};
  }
  
  dialog.posDialog(newPos);
  
  if (!dialog.modal)
  {
    dialog.posBackground(newPos);
  }
};

Xinha.Dialog.prototype.dragEnd = function(ev)
{
  var dialog = this;
  this.editor.suspendUpdateToolbar = false;
  if (!dialog.dragging) 
  {
    return false;
  }
  dialog.dragging = false;

  Xinha._removeEvent(document, "mousemove", dialog.mouseMove );
  Xinha._removeEvent(document, "mouseup", dialog.mouseUp );

  dialog.size.top  = dialog.rootElem.style.top;
  dialog.size.left = dialog.rootElem.style.left;
};


Xinha.Dialog.prototype._resizeStart = function (ev) {
  var dialog = this;
  this.editor.suspendUpdateToolbar = true;
  if (dialog.resizing)
  {
    return;
  }
  dialog.resizing = true;
  dialog.scrollPos = dialog.editor.scrollPos();
  
  var st = dialog.rootElem.style;
  st.minHeight = '';
  st.overflow  =  'hidden';
  dialog.xOffs = parseInt(st.left,10);
  dialog.yOffs = parseInt(st.top,10);

  dialog.mouseMove = function(ev) { dialog.resizeIt(ev); };
  Xinha._addEvent(document, "mousemove", dialog.mouseMove );
  dialog.mouseUp = function (ev) { dialog.resizeEnd(ev); };
  Xinha._addEvent(document, "mouseup",  dialog.mouseUp);
    
};

Xinha.Dialog.prototype.resizeIt = function(ev)
{
  var dialog = this;

  if (!dialog.resizing) {
    return false;
  }

  if (dialog.rootElem.style.position == 'absolute')
  {
    var posY = ev.clientY + dialog.scrollPos.y;
    var posX = ev.clientX + dialog.scrollPos.x;
  }
  else
  {
    var posY = ev.clientY;
    var posX = ev.clientX;
  }
 
  posX -=  dialog.xOffs;
  posY -=  dialog.yOffs;

  var newSize = {};
  newSize.width  = (( posX > 10) ? posX : 10) + 8 + "px";
  newSize.height = (( posY > 10) ? posY : 10) + "px";

  dialog.sizeDialog(newSize);
  
  if (!this.modal)
  {
    dialog.resizeBackground(newSize);
  }
  
  dialog.width = dialog.rootElem.offsetWidth;
  dialog.height = dialog.rootElem.offsetHeight;

  dialog.onresize();
};

Xinha.Dialog.prototype.resizeEnd = function(ev)
{
  var dialog = this;
  dialog.resizing = false;
  this.editor.suspendUpdateToolbar = false;
  
  Xinha._removeEvent(document, "mousemove", dialog.mouseMove );
  Xinha._removeEvent(document, "mouseup", dialog.mouseUp );
  
  dialog.size.width  = dialog.rootElem.offsetWidth;
  dialog.size.height = dialog.rootElem.offsetHeight;
};

Xinha.Dialog.prototype.attachToPanel = function(side)
{
  var dialog = this;
  var rootElem = this.rootElem;
  var editor = this.editor;
  
  this.attached = true;
  this.rootElem.side = side;
  this.captionBar.ondblclick = function(ev) { dialog.detachFromPanel(ev ? ev :window.event); };
  
  rootElem.style.position = "static";
  rootElem.parentNode.removeChild(rootElem);
  
  this.captionBar.style.paddingLeft = "3px";
  this.resizer.style.display = 'none';
  if ( this.closable ) this.closer.style.display = 'none';
  this.icon.style.display = 'none';
  
  if ( side == 'left' || side == 'right' )
  {
    rootElem.style.width  = editor.config.panel_dimensions[side];
  }
  else
  {
    rootElem.style.width = '';
  }
  Xinha.addClasses(rootElem, 'panel');
  editor._panels[side].panels.push(rootElem);
  editor._panels[side].div.appendChild(rootElem);

  editor.notifyOf('panel_change', {'action':'add','panel':rootElem});
};

Xinha.Dialog.prototype.detachFromPanel = function(ev)
{
  var dialog = this;
  var rootElem = dialog.rootElem;
  var editor = dialog.editor;
  
  dialog.attached = false;
  
  rootElem.style.position = "absolute";
  
  dialog.captionBar.style.paddingLeft = "22px";
  dialog.resizer.style.display = '';
  if ( dialog.closable ) dialog.closer.style.display = '';
  dialog.icon.style.display = '';
  
  
  if ( dialog.size.width ) rootElem.style.width  = dialog.size.width + 'px';

  Xinha.removeClasses(rootElem, 'panel');
  editor.removePanel(rootElem);
  document.body.appendChild(rootElem);
  
  if (ev)
  {
    var scrollPos = dialog.editor.scrollPos(); 
    rootElem.style.top = (ev.clientY + scrollPos.y) - ((Xinha.is_ie) ? window.event.offsetY : ev.layerY) + "px";
    rootElem.style.left =(ev.clientX + scrollPos.x) - ((Xinha.is_ie) ? window.event.offsetX : ev.layerX) + "px";
  }
  dialog.captionBar.ondblclick = function() { dialog.attachToPanel(rootElem.side); };
  
};

Xinha.Dialog.prototype.hideBackground = function()
{
  this.background.style.display = 'none';
}
Xinha.Dialog.prototype.showBackground = function()
{
  this.background.style.display = '';
}
Xinha.Dialog.prototype.posBackground = function(pos)
{
  this.background.style.top  = pos.top;
  this.background.style.left = pos.left;
}
Xinha.Dialog.prototype.resizeBackground = function(size)
{
  this.background.style.width  = size.width;
  this.background.style.height = size.height;
}
Xinha.Dialog.prototype.posDialog = function(pos)
{
  var st = this.rootElem.style;
  st.left = pos.left;
  st.top  = pos.top;
}
Xinha.Dialog.prototype.sizeDialog = function(size)
{
  var st = this.rootElem.style;
  st.height = size.height;
  st.width  = size.width;
  this.main.style.height = parseInt(size.height,10) - this.captionBar.offsetHeight + "px";
  this.main.style.width = size.width;
  
}
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

Xinha.Dialog.prototype.translateHtml = function(html,localizer)
{
  var dialog = this;
  if(typeof localizer == 'function')
  {
    dialog._lc = localizer;
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
  return html;
}


Xinha.Dialog.activateModeless = function(dialog)
{
  var zIndex;
  if (Xinha.Dialog.activeModeless == dialog || dialog.attached ) 
  {
    return;
  }
  
  if (Xinha.Dialog.activeModeless )
  {
    Xinha.Dialog.activeModeless.rootElem.style.zIndex = parseInt(Xinha.Dialog.activeModeless.rootElem.style.zIndex) -10;
  }
  Xinha.Dialog.activeModeless = dialog;

  Xinha.Dialog.activeModeless.rootElem.style.zIndex = parseInt(Xinha.Dialog.activeModeless.rootElem.style.zIndex) + 10;
}
