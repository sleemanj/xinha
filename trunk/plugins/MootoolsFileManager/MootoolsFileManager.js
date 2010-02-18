/**
  = Mootools File Manager =
  The MootoolsFileManager plugin allows for the management, selection and 
  insertion of links to files and inline images to the edited HTML.
   
  It requires the use of Mootools.  If you do not use mootools plugins,
  then mootools is not loaded.  If mootools is already loaded, it will
  not be reloaded (so if you want to use your own version of Mootools 
  then load it first).
 
  == Usage ==
  Instruct Xinha to load the MootoolsFileManager plugin (follow the NewbieGuide).
 
  Configure the plugin as per the directions in the config.php file.
   
 * @author $Author$
 * @version $Id$
 * @package MootoolsFileManager
 */


MootoolsFileManager._pluginInfo = {
  name          : "Mootols File Manager",
  version       : "1.0",
  developer     : "James Sleeman (Xinha), Christoph Pojer (FileManager)",  
  license       : "MIT"
};

// All the configuration is done through PHP, please read config.php to learn how (or if you're in a real 
// hurry, just edit config.php)
Xinha.Config.prototype.MootoolsFileManager =
{
  'backend'      : Xinha.getPluginDir("MootoolsFileManager") + '/backend.php?__plugin=MootoolsFileManager&',
  'backend_data' : { }
};

MootoolsFileManager.AssetLoader = Xinha.includeAssets();

// In case you want to use your own version of Mootools, you can load it first.
if(typeof MooTools == 'undefined')
{
  MootoolsFileManager.AssetLoader
    .loadScript('mootools-filemanager/Demos/mootools-core.js', 'MootoolsFileManager')
    .loadScript('mootools-filemanager/Demos/mootools-more.js', 'MootoolsFileManager');
}

// In case you want to use your own version of FileManager, you can load it first.
// You better look at the changes we had to do to the standard one though.
if(typeof FileManager == 'undefined')
{
  MootoolsFileManager.AssetLoader
    .loadStyle('mootools-filemanager/Css/FileManager.css', 'MootoolsFileManager')
    .loadStyle('mootools-filemanager/Css/Additions.css', 'MootoolsFileManager')
    .loadScript('mootools-filemanager/Source/FileManager.js', 'MootoolsFileManager')
    .loadScript('mootools-filemanager/Language/Language.en.js', 'MootoolsFileManager')
    .loadScript('mootools-filemanager/Source/Additions.js', 'MootoolsFileManager')
    .loadScript('mootools-filemanager/Source/Uploader/Fx.ProgressBar.js', 'MootoolsFileManager')
    .loadScript('mootools-filemanager/Source/Uploader/Swiff.Uploader.js', 'MootoolsFileManager')
    .loadScript('mootools-filemanager/Source/Uploader.js', 'MootoolsFileManager');
}
MootoolsFileManager.AssetLoader.loadStyle('MootoolsFileManager.css', 'MootoolsFileManager');

// Initialise the plugin for an editor instance.
function MootoolsFileManager(editor)
{
  this.editor = editor;
  var self = this;
  var cfg = editor.config;
    
  Xinha._postback(editor.config.MootoolsFileManager.backend+'__function=read-config', editor.config.MootoolsFileManager.backend_data, function(phpcfg) { eval ('var f = '+phpcfg+';'); self.hookUpButtons(f); });  
  return;  
};

// Connect up the plugin to the buttons in the editor, depending on the php configuration.
MootoolsFileManager.prototype.hookUpButtons = function(phpcfg) 
{
  var self = this;  
  if (phpcfg.files_dir) 
  {
    this.editor.config.registerButton({
        id        : "linkfile",
        tooltip   : Xinha._lc("Insert File Link",'ExtendedFileManager'),
        image     : Xinha.getPluginDir('ExtendedFileManager') + '/img/ed_linkfile.gif',
        textMode  : false,
        action    : function(editor) { self.OpenFileManager(); }
        });
        
    this.editor.config.addToolbarElement("linkfile", "createlink", 1);            
  };
  
  if(phpcfg.images_dir)
  {
    // Override our Editors insert image button action.  
    this.editor._insertImage = function()
    {
      self.OpenImageManager();
    }
  } 
};

// Open a "files" mode of the plugin to allow to select a file to
// create a link to.
MootoolsFileManager.prototype.OpenFileManager = function(link) 
{
    var editor = this.editor;
    var outparam = {"editor" : this.editor, param : null};
    var self = this;
    
    if (typeof link == "undefined") 
    {
      link = this.editor.getParentElement();
      if (link) 
      {
        if (/^img$/i.test(link.tagName))
            link = link.parentNode;
        if (!/^a$/i.test(link.tagName))
            link = null;
      }
    }
    
    // If the link wasn't provided, and no link is currently in focus,
    // make one from the selection.
    if (!link) 
    {
      var sel = editor.getSelection();
      var range = editor.createRange(sel);
      var compare = 0;
      
      if (Xinha.is_ie) 
      {
        if ( sel.type == "Control" )
        {
          compare = range.length;
        }
        else
        {
          compare = range.compareEndPoints("StartToEnd", range);
        }
      } 
      else 
      {
        compare = range.compareBoundaryPoints(range.START_TO_END, range);
      }
      
      if (compare == 0) 
      {
        alert(Xinha._lc("You must select some text before making a new link.", 'MootoolsFileManager'));
        return;
      }
      outparam.param = {
          f_href : '',
          f_title : '',
          f_target : '',
          f_usetarget : editor.config.makeLinkShowsTarget,
          baseHref: editor.config.baseHref
      };
    }
    else
    {
      outparam.param = {
          f_href   : Xinha.is_ie ? link.href : link.getAttribute("href"),
          f_title  : link.title,
          f_target : link.target,
          f_usetarget : editor.config.makeLinkShowsTarget,
          baseHref: editor.config.baseHref
      };
    }
    
    this.current_link = link;
    if(!this.FileManagerWidget)
    {    
      this.FileManagerWidget = new FileManager({
        url:            this.editor.config.MootoolsFileManager.backend +'__function=file-manager&',
        assetBasePath:  Xinha.getPluginDir('MootoolsFileManager')+'/mootools-filemanager/Assets',
        language:       _editor_lang,
        selectable:     true,
        uploadAuthData: this.editor.config.MootoolsFileManager.backend_data,
        onComplete:     function(path, file, params) { self.FileManagerReturn(path,file,params); }
        // @TODO : Add support to pass in the existing href, title etc...
      });       
    }
    
    this.FileManagerWidget.show();    
};

// Take the values from the file selection and make it (or update) a link
MootoolsFileManager.prototype.FileManagerReturn = function(path, file, param)
{
  var editor = this.editor;
  var a      = this.current_link;
  
  if (!param)
  {
    param =  { f_href: path, f_title: '', f_target: '' }
  }
  
  if (!a)
  {
    try 
    {
      editor._doc.execCommand("createlink", false, param.f_href);
      a = editor.getParentElement();
      var sel = editor.getSelection();
      var range = editor.createRange(sel);
      if (!Xinha.is_ie) 
      {
        a = range.startContainer;
        if (!/^a$/i.test(a.tagName)) 
        {
          a = a.nextSibling;
          if (a == null)
          {
            a = range.startContainer.parentNode;
          }
        }
      }
    } catch(e) {}
  }
  else 
  {
    var href = param.f_href.trim();
    editor.selectNodeContents(a);
    if (href == "") 
    {
      editor._doc.execCommand("unlink", false, null);
      editor.updateToolbar();
      return false;
    }
    else 
    {
      a.href = href;
    }
  }
  
  if (!(a && /^a$/i.test(a.tagName)))
  {
    return false;
  }
  // @TODO: Add support to mfm for specifying target and title
  a.target = param.f_target.trim();
  a.title = param.f_title.trim();
  editor.selectNodeContents(a);
  editor.updateToolbar();
};

// Open an images mode of the plugin for the user to insert an image
MootoolsFileManager.prototype.OpenImageManager = function(image)
{
  var editor = this.editor;  // for nested functions
  var self   = this;
  var outparam = null;
  if (typeof image == "undefined") 
  {
    image = editor.getParentElement();
    if (image && !/^img$/i.test(image.tagName))
    {
      image = null;
    }
  }

  if ( image )
  {
    outparam =
      {
        f_url    : Xinha.is_ie ? image.src : image.src,
        f_alt    : image.alt,
        f_border : image.style.borderWidth ? image.style.borderWidth : image.border,
        f_align  : image.align,
        f_padding: image.style.padding,
        f_margin : image.style.margin,
        f_width  : image.width,
        f_height  : image.height,
        f_backgroundColor: image.style.backgroundColor,
        f_borderColor: image.style.borderColor,
        f_hspace:  image.hspace && image.hspace != '-1' ? parseInt(image.hspace) : '',
        f_vspace: image.vspace && image.vspace != '-1' ? parseInt(image.vspace) : ''
      };

    outparam.f_border  = this.shortSize(outparam.f_border);
    outparam.f_padding = this.shortSize(outparam.f_padding);
    outparam.f_margin  = this.shortSize(outparam.f_margin);
        
    outparam.f_backgroundColor = this.convertToHex(outparam.f_backgroundColor);
    outparam.f_borderColor = this.convertToHex(outparam.f_borderColor);
  } 
  
  this.current_image = image;
  if(!this.ImageManagerWidget)
  {
    this.ImageManagerWidget = new FileManager({
      url:            this.editor.config.MootoolsFileManager.backend+'__function=image-manager&',
      assetBasePath:  Xinha.getPluginDir('MootoolsFileManager')+'/mootools-filemanager/Assets',
      language:       _editor_lang,
      selectable:     true,
      uploadAuthData: this.editor.config.MootoolsFileManager.backend_data,
      onComplete:     function(path, file, params) { self.ImageManagerReturn(path,file,params); },
      extendedAttributes: outparam
      // @TODO : Add support to pass in the existing src, alt etc...
    });     
  }
  
  this.ImageManagerWidget.show();    
};

// Take the selected image and insert or update an image in the html
MootoolsFileManager.prototype.ImageManagerReturn = function(path, file, param)
{
  var editor = this.editor;
  var self   = this;
  var image  = this.current_image;
  
  if (!param)
  {
    param =  { f_url: path }
  }
  
  var img = image;
  if (!img) {
    if (Xinha.is_ie) {
      var sel = editor._getSelection();
      var range = editor._createRange(sel);
      editor._doc.execCommand("insertimage", false, param.f_url);
      img = range.parentElement();
      // wonder if this works...
      if (img.tagName.toLowerCase() != "img") {
        img = img.previousSibling;
      }
    } else {
      img = document.createElement('img');
      img.src = param.f_url;
      editor.insertNodeAtSelection(img);
    }
  } else {      
    img.src = param.f_url;
  }

  for (field in param) {
    var value = param[field];
    // @TODO: Add ability to mfm for this to be possible.
    switch (field) {
        case "f_alt"    : img.alt  = value; break;
        case "f_border" :
        if(value.length)
        {           
          img.style.borderWidth = /[^0-9]/.test(value) ? value :  (parseInt(value) + 'px');
          if(img.style.borderWidth && !img.style.borderStyle)
          {
            img.style.borderStyle = 'solid';
          }
        }
        else
        {
          img.style.borderWidth = '';
          img.style.borderStyle = '';
        }
        break;
        
        case "f_borderColor": img.style.borderColor = value; break;
        case "f_backgroundColor": img.style.backgroundColor = value; break;
          
        case "f_padding": 
        {
          if(value.length)
          {
            img.style.padding = /[^0-9]/.test(value) ? value :  (parseInt(value) + 'px'); 
          }
          else
          {
            img.style.padding = '';
          }
        }
        break;
        
        case "f_margin": 
        {
          if(value.length)
          {
            img.style.margin = /[^0-9]/.test(value) ? value :  (parseInt(value) + 'px'); 
          }
          else
          {
            img.style.margin = '';
          }
        }
        break;
        
        case "f_align"  : img.align  = value; break;
          
        case "f_width" : 
        {
          if(!isNaN(parseInt(value))) { img.width  = parseInt(value); } else { img.width = ''; }
        }
        break;
        
        case "f_height":
        {
          if(!isNaN(parseInt(value))) { img.height = parseInt(value); } else { img.height = ''; }
        }
        break;
        
        case "f_hspace" : 
        {
          if(!isNaN(parseInt(value))) { img.hspace  = parseInt(value); } else { img.hspace = ''; }
        }
        break;
        
        case "f_vspace" : 
        {
          if(!isNaN(parseInt(value))) { img.vspace  = parseInt(value); } else { img.vspace = ''; }
        }
        break;
    }
  }
};

// Take a multi-part CSS size specification (eg sizes for 4 borders) and 
// shrink it into one if possible.
MootoolsFileManager.prototype.shortSize = function(cssSize)
{
  if(/ /.test(cssSize))
  {
    var sizes = cssSize.split(' ');
    var useFirstSize = true;
    for(var i = 1; i < sizes.length; i++)
    {
      if(sizes[0] != sizes[i])
      {
        useFirstSize = false;
        break;
      }
    }
    if(useFirstSize) cssSize = sizes[0];
  }
  return cssSize;
};

// Take a colour in rgb(a,b) format and convert to HEX
// handles multiple colours in same string as well.
MootoolsFileManager.prototype.convertToHex = function(color) 
{
  if (typeof color == "string" && /, /.test.color)
  color = color.replace(/, /, ','); // rgb(a, b) => rgb(a,b)

  if (typeof color == "string" && / /.test.color) { // multiple values
    var colors = color.split(' ');
    var colorstring = '';
    for (var i = 0; i < colors.length; i++) {
      colorstring += Xinha._colorToRgb(colors[i]);
      if (i + 1 < colors.length)
      colorstring += " ";
    }
    return colorstring;
  }

  return Xinha._colorToRgb(color);
}