HTMLArea.Dialog = function(editor, html, localizer, size)
{
  this.editor   = editor;
  this.document = document;

  this._stylesToLoad = new Array();
  this._scriptsToLoad = new Array();

  this.width  = 400;
  this.height = 500;
  if(size && size.width) {
    this.width = size.width;
  }
  if(size && size.height) {
    this.height = size.height;
  }

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
                      '$1'
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
  this.html = html;

}



HTMLArea.Dialog.prototype.onresize = function()
{
  return true;
}

HTMLArea.Dialog.prototype.show = function(values, param, initFunction)
{
  this.window = window.open('', 'xinha-dialog', 'width='+this.width+',height='+this.height);
  var doc = this.doc = this.window.document;

  var base = document.baseURI || document.URL;
  if (base && base.match(/(.*)\/([^\/]+)/)) {
    base = RegExp.$1 + "/";
  }
  if (typeof _editor_url != "undefined" && !/^\//.test(_editor_url) && !/http:\/\//.test(_editor_url)) {
    // _editor_url doesn't start with '/' which means it's relative
    // FIXME: there's a problem here, it could be http:// which
    // doesn't start with slash but it's not relative either.
    base += _editor_url;
  } else
    base = _editor_url;
  if (!/\/$/.test(base)) {
    // base does not end in slash, add it now
    base += '/';
  }
  this.baseURL = base;

  doc.open();
  var html = "<html><head><title>" + "title" + "</title>\n";
  html += "<style type=\"text/css\">@import url(" + base + "htmlarea.css);</style></head>\n";
  for(var i=0;i<this._stylesToLoad.length;i++) {
    html += "<style type=\"text/css\">@import url(" + base + this._stylesToLoad[i] + ");</style></head>\n";
  }
  for(var i=0;i<this._scriptsToLoad.length;i++) {
    html += "<script type=\"text/javascript\" src=\""+ base + this._stylesToLoad[i] +"\"></script>";
  }
  html += "<body class=\"dialog popupwin\">";
  html += this.html;
  html += "</body></html>";
  doc.write(html);
  doc.close();

  var self = this;
  function init() {
    var body = doc.body;
    if (!body) {
      setTimeout(init, 25);
      return false;
    }
    if(typeof values != 'undefined')
    {
      self.setValues(values);
    }

    //fixme: title
    self.window.title = self.doc.body.firstChild.firstChild.textContent;

    if(initFunction)
    {
      initFunction(values, param, self);
    }

    self.window.focus();
  };
  init();

}

HTMLArea.Dialog.prototype.hide = function()
{
  var values = this.getValues();
  this.window.close();
  this.window = null;
  return(values);
}

HTMLArea.Dialog.prototype.toggle = function()
{
  if(!this.window)
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
  var inputs = HTMLArea.collectionToArray(this.doc.getElementsByTagName('input'))
              .append(HTMLArea.collectionToArray(this.doc.getElementsByTagName('textarea')))
              .append(HTMLArea.collectionToArray(this.doc.getElementsByTagName('select')));

  for(var x = 0; x < inputs.length; x++)
  {
    var i = inputs[x];
    if(!i.name) continue;

    if(typeof values[i.name] == 'undefined')
    {
      values[i.name] = null;
    }
    var v = values[i.name];

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
              if(this.getElementsByName(i.name).length > 1)
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

    values[i.name] = v;
  }
  return values;
};

HTMLArea.Dialog.prototype.getElementById = function(id)
{
  return this.doc.getElementById(id);
};

HTMLArea.Dialog.prototype.getElementsByName = function(name)
{
  return this.doc.getElementsByName(name);
};

HTMLArea.Dialog.prototype.getFieldNameByName = function(name)
{
  return(name);
};

HTMLArea.Dialog.prototype.loadStylesheet = function(href)
{
    this._stylesToLoad.push(href);
};

HTMLArea.Dialog.prototype.loadScript = function(href, callback)
{
    this._scriptsToLoad.push(href);
};
