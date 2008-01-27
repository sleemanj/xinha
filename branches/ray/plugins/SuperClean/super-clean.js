// Make our right side panel and insert appropriatly
function SuperClean(editor, args)
{
  this.editor = editor;
  var superclean = this;
  editor._superclean_on = false;
  editor.config.registerButton('superclean', this._lc("Clean up HTML"), editor.imgURL('ed_superclean.gif', 'SuperClean'), true, function(e, objname, obj) { superclean._superClean(null, obj); });

  // See if we can find 'killword' and replace it with superclean
  editor.config.addToolbarElement("superclean", "killword", 0);
}

SuperClean._pluginInfo =
{
  name     : "SuperClean",
  version  : "1.0",
  developer: "James Sleeman, Niko Sams",
  developer_url: "http://www.gogo.co.nz/",
  c_owner      : "Gogo Internet Services",
  license      : "htmlArea",
  sponsor      : "Gogo Internet Services",
  sponsor_url  : "http://www.gogo.co.nz/"
};

SuperClean.prototype._lc = function(string) {
    return Xinha._lc(string, 'SuperClean');
};

/** superClean combines HTMLTidy, Word Cleaning and font stripping into a single function
 *  it works a bit differently in how it asks for parameters */

SuperClean.prototype._superClean = function(opts, obj)
{
  var superclean = this;

  // Do the clean if we got options
  var doOK = function()
  {
    superclean._dialog.dialog.getElementById("main").style.display = "none";
    superclean._dialog.dialog.getElementById("waiting").style.display = "";
    superclean._dialog.dialog.getElementById("buttons").style.display = "none";
    
  	var opts = superclean._dialog.dialog.getValues();
    var editor = superclean.editor;

    if(opts.word_clean) editor._wordClean();
    var D = editor.getInnerHTML();

    for(var filter in editor.config.SuperClean.filters)
    {
      if(filter=='tidy' || filter=='word_clean') continue;
      if(opts[filter])
      {
        D = SuperClean.filterFunctions[filter](D, editor);
      }
    }

    D = D.replace(/(style|class)="\s*"/gi, '');
    D = D.replace(/<(font|span)\s*>/gi, '');

    editor.setHTML(D);

    if(opts.tidy)
    {
      var callback = function(javascriptResponse) 
      { 
        eval("var response = " + javascriptResponse);
        switch (response.action)
        {
          case 'setHTML':
            editor.setHTML(response.value);
            superclean._dialog.hide();
          break;
          case 'alert':
            superclean._dialog.dialog.getElementById("buttons").style.display = "";
            superclean._dialog.dialog.getElementById("ok").style.display = "none";
            superclean._dialog.dialog.getElementById("waiting").style.display = "none"; 
            superclean._dialog.dialog.getElementById("alert").style.display = ""; 
            superclean._dialog.dialog.getElementById("alert").innerHTML = superclean._lc(response.value);
          break;
          default: // make the dialog go away if sth goes wrong, who knows...
           superclean._dialog.hide();
          break;
        }
      }
      Xinha._postback(editor.config.SuperClean.tidy_handler, {'content' : editor.getInnerHTML()},callback);
    }
    else
    {
      superclean._dialog.hide();
    }
    return true;
  }

  if(this.editor.config.SuperClean.show_dialog)
  {
    var inputs = {};
    this._dialog.show(inputs, doOK);
  }
  else
  {
    var editor = this.editor;
    var html = editor.getInnerHTML();
    for(var filter in editor.config.SuperClean.filters)
    {
      if(filter=='tidy') continue; //call tidy last
      html = SuperClean.filterFunctions[filter](html, editor);
    }

    html = html.replace(/(style|class)="\s*"/gi, '');
    html = html.replace(/<(font|span)\s*>/gi, '');

    editor.setHTML(html);

    if(editor.config.SuperClean.filters.tidy)
    {
      SuperClean.filterFunctions.tidy(html, editor);
    }
  }
};

Xinha.Config.prototype.SuperClean =
{
  // set to the URL of a handler for html tidy, this handler
  //  (see tidy.php for an example) must that a single post variable
  //  "content" which contains the HTML to tidy, and return javascript like
  //  editor.setHTML('<strong>Tidied Html</strong>')
  // it's called through XMLHTTPRequest
  'tidy_handler': _editor_url + 'plugins/SuperClean/tidy.php',

  //avaliable filters (these are built-in filters)
  // You can either use
  //    'filter_name' : "Label/Description String"
  // or 'filter_name' : {label: "Label", checked: true/false, filterFunction: function(html) { ... return html;} }
  // filterFunction in the second format above is optional.

  'filters': { 'tidy': Xinha._lc('General tidy up and correction of some problems.', 'SuperClean'),
               'word_clean': Xinha._lc('Clean bad HTML from Microsoft Word', 'SuperClean'),
               'remove_faces': Xinha._lc('Remove custom typefaces (font "styles").', 'SuperClean'),
               'remove_sizes': Xinha._lc('Remove custom font sizes.', 'SuperClean'),
               'remove_colors': Xinha._lc('Remove custom text colors.', 'SuperClean'),
               'remove_lang': Xinha._lc('Remove lang attributes.', 'SuperClean'),
               'remove_fancy_quotes': {label:Xinha._lc('Replace directional quote marks with non-directional quote marks.', 'SuperClean'), checked:false}
  //additional custom filters (defined in plugins/SuperClean/filters/word.js)
               //'paragraph': 'remove paragraphs'},
               //'word': 'exteded Word-Filter' },
              },
  //if false all filters are applied, if true a dialog asks what filters should be used
  'show_dialog': true
};

SuperClean.filterFunctions = { };
SuperClean.filterFunctions.remove_colors = function(D)
{
  D = D.replace(/color="?[^" >]*"?/gi, '');
  // { (stops jedit's fold breaking)
  D = D.replace(/([^-])color:[^;}"']+;?/gi, '$1');
  return(D);
};
SuperClean.filterFunctions.remove_sizes = function(D)
{
  D = D.replace(/size="?[^" >]*"?/gi, '');
  // { (stops jedit's fold breaking)
  D = D.replace(/font-size:[^;}"']+;?/gi, '');
  return(D);
};
SuperClean.filterFunctions.remove_faces = function(D)
{
  D = D.replace(/face="?[^" >]*"?/gi, '');
  // { (stops jedit's fold breaking)
  D = D.replace(/font-family:[^;}"']+;?/gi, '');
  return(D);
};
SuperClean.filterFunctions.remove_lang = function(D)
{
  D = D.replace(/lang="?[^" >]*"?/gi, '');
  return(D);
};
SuperClean.filterFunctions.word_clean = function(html, editor)
{
  editor.setHTML(html);
  editor._wordClean();
  return editor.getInnerHTML();
};

SuperClean.filterFunctions.remove_fancy_quotes = function(D)
{
  D = D.replace(new RegExp(String.fromCharCode(8216),"g"),"'");
  D = D.replace(new RegExp(String.fromCharCode(8217),"g"),"'");
  D = D.replace(new RegExp(String.fromCharCode(8218),"g"),"'");
  D = D.replace(new RegExp(String.fromCharCode(8219),"g"),"'");
  D = D.replace(new RegExp(String.fromCharCode(8220),"g"),"\"");
  D = D.replace(new RegExp(String.fromCharCode(8221),"g"),"\"");
  D = D.replace(new RegExp(String.fromCharCode(8222),"g"),"\"");
  D = D.replace(new RegExp(String.fromCharCode(8223),"g"),"\"");
  return D;
};

SuperClean.filterFunctions.tidy = function(html, editor)
{
  Xinha._postback(editor.config.SuperClean.tidy_handler, {'content' : html},
                      function(javascriptResponse) { eval(javascriptResponse) });
};



SuperClean.prototype.onGenerateOnce = function()
{
  if(this.editor.config.SuperClean.show_dialog && !this._dialog)
  {
    this._dialog = new SuperClean.Dialog(this);
  }
  if(this.editor.config.tidy_handler)
  {
    //for backwards compatibility
    this.editor.config.SuperClean.tidy_handler = this.editor.config.tidy_handler;
    this.editor.config.tidy_handler = null;
  }
  if(!this.editor.config.SuperClean.tidy_handler && this.editor.config.filters.tidy) {
    //unset tidy-filter if no tidy_handler
    this.editor.config.filters.tidy = null;
  }

  this.loadFilters();
};
SuperClean.prototype.loadFilters = function()
{
  var sc = this;
  //load the filter-functions
  for(var filter in this.editor.config.SuperClean.filters)
  {
    if(!SuperClean.filterFunctions[filter])
    {
      var filtDetail = this.editor.config.SuperClean.filters[filter];
      if(typeof filtDetail.filterFunction != 'undefined')
      {
        SuperClean.filterFunctions[filter] = filterFunction;
      }
      else
      {
        Xinha._getback(_editor_url + 'plugins/SuperClean/filters/'+filter+'.js',
                      function(func) {
                        eval('SuperClean.filterFunctions.'+filter+'='+func+';');
                        sc.loadFilters();
                      });
      }
      return;
    }
  }
}
// Inline Dialog for SuperClean


SuperClean.Dialog = function (SuperClean)
{
  var  lDialog = this;
  this.Dialog_nxtid = 0;
  this.SuperClean = SuperClean;
  this.id = { }; // This will be filled below with a replace, nifty

  this.ready = false;
  this.files  = false;
  this.html   = false;
  this.dialog = false;

  // load the dTree script
  this._prepareDialog();

};

SuperClean.Dialog.prototype._prepareDialog = function()
{
  var lDialog = this;
  var SuperClean = this.SuperClean;

  if(this.html == false)
  {
    Xinha._getback(_editor_url + 'plugins/SuperClean/dialog.html', function(txt) { lDialog.html = txt; lDialog._prepareDialog(); });
    return;
  }

  var htmlFilters = "";
  for(var filter in this.SuperClean.editor.config.SuperClean.filters)
  {
    htmlFilters += "    <div>\n";
    var filtDetail = this.SuperClean.editor.config.SuperClean.filters[filter];
    if(typeof filtDetail.label == 'undefined')
    {
      htmlFilters += "        <input type=\"checkbox\" name=\"["+filter+"]\" id=\"["+filter+"]\" checked />\n";
      htmlFilters += "        <label for=\"["+filter+"]\">"+this.SuperClean.editor.config.SuperClean.filters[filter]+"</label>\n";
    }
    else
    {
      htmlFilters += "        <input type=\"checkbox\" name=\"["+filter+"]\" id=\"["+filter+"]\" " + (filtDetail.checked ? "checked" : "") + " />\n";
      htmlFilters += "        <label for=\"["+filter+"]\">"+filtDetail.label+"</label>\n";
    }
    htmlFilters += "    </div>\n";
  }
  this.html = this.html.replace('<!--filters-->', htmlFilters);

  var html = this.html;

  // Now we have everything we need, so we can build the dialog.
  var dialog = this.dialog = new Xinha.Dialog(SuperClean.editor, this.html, 'SuperClean',{width:400});

  this.ready = true;
};

SuperClean.Dialog.prototype._lc = SuperClean.prototype._lc;

SuperClean.Dialog.prototype.show = function(inputs, ok, cancel)
{
  if(!this.ready)
  {
    var lDialog = this;
    window.setTimeout(function() {lDialog.show(inputs,ok,cancel);},100);
    return;
  }

  // Connect the OK and Cancel buttons
  var dialog = this.dialog;
  var lDialog = this;
  if(ok)
  {
    this.dialog.getElementById('ok').onclick = ok;
  }
  else
  {
    this.dialog.getElementById('ok').onclick = function() {lDialog.hide();};
  }

  if(cancel)
  {
    this.dialog.getElementById('cancel').onclick = cancel;
  }
  else
  {
    this.dialog.getElementById('cancel').onclick = function() { lDialog.hide()};
  }

  // Show the dialog
  this.SuperClean.editor.disableToolbar(['fullscreen','SuperClean']);

  this.dialog.show(inputs);

  // Init the sizes
  this.dialog.onresize();
};

SuperClean.Dialog.prototype.hide = function()
{
  this.SuperClean.editor.enableToolbar();
  this.dialog.getElementById("main").style.display = "";
  this.dialog.getElementById("buttons").style.display = "";
  this.dialog.getElementById("waiting").style.display = "none";
  this.dialog.getElementById("alert").style.display = "none";
  this.dialog.getElementById("ok").style.display = "";
  return this.dialog.hide();
};