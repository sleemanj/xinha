HTMLArea.Dialog = function(editor, html, localizer, size)
{
  this.id    = { };
  this.r_id  = { }; // reverse lookup id
  this.editor   = editor;
  this.document = document;

  this.width  = 400;
  this.height = 500;
  if(size && size.width) {
    this.width = size.width;
  }
  if(size && size.height) {
    this.height = size.height;
  }

  this.rootElem = document.createElement('div');
  this.rootElem.className = 'dialog popup-dialog';
  this.rootElem.style.position = 'absolute';
  this.rootElem.style.display  = 'none';
  this.rootElem.style.width = this.width+"px";
  this.rootElem.style.height = this.height+"px";
  this.rootElem.style.zIndex = '100';

  var dialog = this;
  if(typeof localizer == 'function')
  {
    this._lc = localizer;
  }
  else if(localizer)
  {
    this._lc = function(string)
    {
      return HTMLArea._lc(string,localizer);
    }
  }
  else
  {
    this._lc = function(string)
    {
      return string;
    }
  }

  html = html.replace(/\[([a-z0-9_]+)\]/ig,
                      function(fullString, id)
                      {
                        if(typeof dialog.id[id] == 'undefined')
                        {
                          dialog.id[id] = HTMLArea.uniq('Dialog');
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
  this.rootElem.innerHTML = html;

  //make the first h1 to drag&drop the rootElem
  this.dragging = false;  
  for(var i=0;i<this.rootElem.childNodes.length;i++) {
    if(this.rootElem.childNodes[i].nodeName.toLowerCase() == 'h1') {
        this.rootElem.childNodes[i].onmousedown = function(ev) {
                                                    dialog._dragStart(ev);
                                                  };
        break;
    }
  }
  
  document.body.appendChild(this.rootElem);
  
  if(!this.disableEditor)
  {
    //create only once
    HTMLArea.Dialog.prototype.disableEditor = document.createElement('div');
    this.disableEditor.className = 'disableEditor';
    this.disableEditor.style.display = 'none';
    this.disableEditor.style.position = 'absolute';
    this.disableEditor.style.height = (parseInt(this.editor._iframe.style.height)+this.editor._statusBar.offsetHeight-2)+'px';
    this.disableEditor.style.width = this.editor._iframe.style.width;
    this.editor._iframe.parentNode.appendChild(this.disableEditor);
  }
  
  this.editor.notifyOn
   ('resize',
      function(e, args)
      {
        dialog.disableEditor.style.width  = parseInt(dialog.rootElem.style.width  = args.editorWidth  + 'px');
        dialog.disableEditor.style.height = dialog.rootElem.style.height = (args.editorHeight+dialog.editor._statusBar.offsetHeight-2)+'px';

        dialog.onresize(e, args);
      }
    );
   
}

HTMLArea.Dialog.prototype._dragStart = function (ev) {
    if (this.dragging) {
        return;
    }
    this.dragging = true;
    var posX;
    var posY;
    if (HTMLArea.is_ie) {
        posY = window.event.clientY + document.body.scrollTop;
        posX = window.event.clientX + document.body.scrollLeft;
    } else {
        posY = ev.clientY + window.scrollY;
        posX = ev.clientX + window.scrollX;
    }
    var st = this.rootElem.style;
    this.xOffs = posX - parseInt(st.left);
    this.yOffs = posY - parseInt(st.top);
    
    var dialog = this;
    
    HTMLArea._addEvent(document, "mousemove", function(ev) { dialog.dragIt(ev); } );
    HTMLArea._addEvent(document, "mouseup", function (ev) { dialog.dragEnd(ev); } );

    this.hideShowCovered();
};

HTMLArea.Dialog.prototype.dragIt = function(ev)
{
    var dialog = this;
    
    if (!dialog.dragging) {
        return false;
    }
    var posX;
    var posY;
    if (HTMLArea.is_ie) {
        posY = window.event.clientY + document.body.scrollTop;
        posX = window.event.clientX + document.body.scrollLeft;
    } else {
        posX = ev.pageX;
        posY = ev.pageY;
    }
    dialog.hideShowCovered();
    var st = dialog.rootElem.style;
    st.left = (posX - dialog.xOffs) + "px";
    st.top = (posY - dialog.yOffs) + "px";
};

HTMLArea.Dialog.prototype.dragEnd = function(ev)
{
    var dialog = this;    
    dialog.dragging = false;

    HTMLArea._removeEvent(document, "mousemove", function(ev) { dialog.dragIt(ev); } );
    HTMLArea._removeEvent(document, "mouseup", function (ev) { dialog.dragEnd(ev); } );
    
    dialog.hideShowCovered();
};


HTMLArea.Dialog.prototype.hideShowCovered = function () {
    if (!HTMLArea.is_ie)
        return;
    function getVisib(obj){
        var value = obj.style.visibility;
        if (!value) {
            if (document.defaultView && typeof (document.defaultView.getComputedStyle) == "function") { // Gecko, W3C
                if (!HTMLArea.is_khtml)
                    value = document.defaultView.
                        getComputedStyle(obj, "").getPropertyValue("visibility");
                else
                    value = '';
            } else if (obj.currentStyle) { // IE
                value = obj.currentStyle.visibility;
            } else
                value = '';
        }
        return value;
    };

    var tags = new Array("applet", "select");
    var el = this.rootElem;

    var p = HTMLArea.Dialog.getAbsolutePos(el);
    var EX1 = p.x;
    var EX2 = el.offsetWidth + EX1;
    var EY1 = p.y;
    var EY2 = el.offsetHeight + EY1;
    
    for (var k = tags.length; k > 0; ) {
        var ar = document.getElementsByTagName(tags[--k]);
        var cc = null;

        for (var i = ar.length; i > 0;) {
            cc = ar[--i];

            if(this.isChildOfRoot(cc)) continue;
            
            p = HTMLArea.Dialog.getAbsolutePos(cc);
            var CX1 = p.x;
            var CX2 = cc.offsetWidth + CX1;
            var CY1 = p.y;
            var CY2 = cc.offsetHeight + CY1;
            
            var hidden = this.rootElem.style.display=="none";            
            if (hidden || (CX1 > EX2) || (CX2 < EX1) || (CY1 > EY2) || (CY2 < EY1)) {
                if (!cc.__msh_save_visibility) {
                    cc.__msh_save_visibility = getVisib(cc);
                }
                cc.style.visibility = cc.__msh_save_visibility;
            } else {
                if (!cc.__msh_save_visibility) {
                    cc.__msh_save_visibility = getVisib(cc);
                }
                cc.style.visibility = "hidden";
            }
        }
    }
};

HTMLArea.Dialog.prototype.isChildOfRoot = function (el)
{
    if(el.parentElement==this.rootElem)
        return(true);
    if(el.parentElement.parentElement)
        return(this.isChildOfRoot(el.parentElement));
    return(false);
}

HTMLArea.Dialog.getAbsolutePos = function(el) {
    var SL = 0, ST = 0;
    var is_div = /^div$/i.test(el.tagName);
    if (is_div && el.scrollLeft)
        SL = el.scrollLeft;
    if (is_div && el.scrollTop)
        ST = el.scrollTop;
    var r = { x: el.offsetLeft - SL, y: el.offsetTop - ST };
    if (el.offsetParent) {
        var tmp = this.getAbsolutePos(el.offsetParent);
        r.x += tmp.x;
        r.y += tmp.y;
    }
    return r;
};

HTMLArea.Dialog.prototype.onresize = function()
{
  return true;
}

HTMLArea.Dialog.prototype.show = function(values, param, initFunction)
{

  // We need to preserve the selection for IE
  if(HTMLArea.is_ie)
  {
    this._lastRange = this.editor._createRange(this.editor._getSelection());
  }

  if(initFunction)
  {
    initFunction(values, param, this);
  }

  if(typeof values != 'undefined')
  {
    this.setValues(values);
  }
  
  var top = 0;
  var left = 0;
  if(window.innerWidth) {
    top = (window.innerHeight-this.height) / 2;
    left = (window.innerWidth-this.width) / 2;    
  } else if(document.body.clientHeight) {
    top = (document.body.clientHeight-this.height) / 2;
    left = (document.body.clientWidth-this.width) / 2;    
  }
  if(document.body && document.body.scrollTop) {
    top += document.body.scrollTop;
    left += document.body.scrollLeft;
  } else if(document.documentElement && document.documentElement.scrollTop) {
    top += document.documentElement.scrollTop;
    left += document.documentElement.scrollLeft;
  }
  this.rootElem.style.left = left+"px";
  this.rootElem.style.top = top+"px";
  
  this.disableEditor.style.display   = '';
  if (this.editor.config.statusBar)
  {
    this.editor._statusBar.innerHTML = '&nbsp;';
  }
  this.rootElem.style.display   = '';
  
  this.hideShowCovered();

  this.editor.disableToolbar();
}

HTMLArea.Dialog.prototype.hide = function()
{  
  this.rootElem.style.display          = 'none';
  this.disableEditor.style.display     = 'none';
  this.hideShowCovered();
  
  // Restore the selection
  if(HTMLArea.is_ie)
  {
    this._lastRange.select();
  }
  if (this.editor.config.statusBar)
  {
    this.editor._statusBar.innerHTML = '';
    this.editor._statusBar.appendChild(this.editor._statusBarTree);
  }
  return this.getValues();
}

HTMLArea.Dialog.prototype.toggle = function()
{
  if(this.rootElem.style.display == 'none')
  {
    this.show();
  }
  else
  {
    this.hide();
  }
}

HTMLArea.Dialog.prototype.setValues = function(values)
{
  for(var i in values)
  {
    var elems = this.getElementsByName(i);
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
}

HTMLArea.Dialog.prototype.getValues = function()
{
  var values = [ ];
  var inputs = HTMLArea.collectionToArray(this.rootElem.getElementsByTagName('input'))
              .append(HTMLArea.collectionToArray(this.rootElem.getElementsByTagName('textarea')))
              .append(HTMLArea.collectionToArray(this.rootElem.getElementsByTagName('select')));

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
          if(i.selectedIndex)
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
              if(v!=null && v.push)
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
}

HTMLArea.Dialog.prototype.getElementById = function(id)
{
  return this.document.getElementById(this.id[id] ? this.id[id] : id);
};

HTMLArea.Dialog.prototype.getElementsByName = function(name)
{
  return this.document.getElementsByName(this.id[name] ? this.id[name] : name);
};

HTMLArea.Dialog.prototype.getFieldNameByName = function(name)
{
  return(this.id[name] ? this.id[name] : name);
};

HTMLArea.Dialog.prototype.loadStylesheet = function(href)
{
    HTMLArea.loadStyle(href);
};

HTMLArea.Dialog.prototype.loadScript = function(href, callback)
{
    HTMLArea._loadback(href, callback);

};
