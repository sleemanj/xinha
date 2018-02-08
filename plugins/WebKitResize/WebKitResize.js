/**
  = WebKit Image Resizer =
  
  The WebKit based (or similar) browsers, including Chrome (and Edge)
  don't support drag-to-size images or tables, which is a pain.
  
  This plugin implements the EditorBoost jQuery resizing plugin
    http://www.editorboost.net/Webkitresize/Index
  jQuery is required, naturally, if it's not already loaded 
  then we will load our own version, so ensure you load your version
  first if you need a newer one (then this might break, but oh well).
  
  == Usage ==._
  Instruct Xinha to load the WebKitImageResuze plugin (follow the NewbieGuide),
  you can load this plugin even in non WebKit browsers, it will do 
  nothing (no harm, no benefit).
  
  == Caution ==
  This only works acceptably in either:
    Standards Mode  (eg Doctype <!DOCTYPE html> )
    Quirks Mode     (eg no doctype              )
    
  it does not work great in "Almost Standards Mode" because scrolling throws
  the resize border out of place, ,that's ok if you don't need to scroll, 
  either because your text is small, or you are in FullScreen mode or 
  something, but anyway.
  
 
 * @author $Author$
 * @version $Id$
 * @package WebKitResize
 */


WebKitResize._pluginInfo = {
  name          : "WebKit Image Resize",
  version       : "1.0",
  developer     : "EditorBoost, James Sleeman (Xinha)",
  developer_url : "http://www.editorboost.net/Webkitresize/Index",
  license       : "GPLv3"
};

if(Xinha.is_webkit)
{
  Xinha.loadLibrary('jQuery')
       .loadScriptOnce('jquery.mb.browser.min.js', 'WebKitResize')
       .loadScriptOnce('jquery.webkitresize.js',   'WebKitResize');
}

function WebKitResize(editor)
{
    this.editor = editor;
}

WebKitResize.prototype.onGenerateOnce = function()
{
  // jQuery not loaded yet?
  if(!(jQuery && jQuery.fn && jQuery.fn.webkitimageresize))
  {
    var self = this;
    window.setTimeout(function(){self.onGenerateOnce()}, 500);
    return;
  }
  
  if(Xinha.is_webkit)
  {
    jQuery(this.editor._iframe).webkitimageresize();
    jQuery(this.editor._iframe).webkittableresize();
    jQuery(this.editor._iframe).webkittdresize();
  }
}

// When changing modes, make sure that we stop displaying the handles
// if they were displaying, otherwise they create duplicates (because
// the images are recreated).
WebKitResize.prototype.onBeforeMode = function(mode)
{
  if(Xinha.is_webkit)
  {
    if(mode == 'textmode')
    {
      if(typeof this.editor._iframe._WebKitImageResizeEnd)
        this.editor._iframe._WebKitImageResizeEnd();
      
      if(typeof this.editor._iframe._WebKitTableResizeEnd)
        this.editor._iframe._WebKitTableResizeEnd();
      
      if(typeof this.editor._iframe._WebKitTdResizeEnd)
        this.editor._iframe._WebKitTdResizeEnd();
    }
  }
}

WebKitResize.prototype.onMode = function(mode)
{
  if(Xinha.is_webkit)
  {
    if(mode == 'textmode')
    {
      
    }
    else
    {
      if(typeof this.editor._iframe._WebKitImageResizeStart)
        this.editor._iframe._WebKitImageResizeStart();
    }
  }
}