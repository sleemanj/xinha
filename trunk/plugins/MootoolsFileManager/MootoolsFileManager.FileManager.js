/**
  = Mootools File Manager =
  == File Manager ==
  
  The functions in this file extend the MootoolsFileManager plugin with support
  for managing files (inserting a link to a file).  This file is loaded automatically.
     
 * @author $Author$
 * @version $Id$
 * @package MootoolsFileManager
 */


// Open a "files" mode of the plugin to allow to select a file to
// create a link to.
MootoolsFileManager.prototype.OpenFileManager = function(link) 
{
    var editor = this.editor;
    var outparam = null;
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
      outparam = {
          f_href : '',
          f_title : '',
          f_target : '',
          f_usetarget : editor.config.makeLinkShowsTarget,
          baseHref: editor.config.baseHref
      };
    }
    else
    {
      outparam = {
          f_href   : Xinha.is_ie ? link.href : link.getAttribute("href"),
          f_title  : link.title,
          f_target : link.target,
          f_usetarget : editor.config.makeLinkShowsTarget,
          baseHref: editor.config.baseHref
      };
    }
    
    this.current_link = link;
    this.current_attributes = outparam;
    
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

