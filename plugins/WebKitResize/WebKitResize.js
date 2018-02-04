/**
  = WebKit Image Resizer =
  
  The WebKit based (or similar) browsers, including Chrome (and Edge)
  don't support drag-to-size images or tables, which is a pain.
  
  This plugin implements the EditorBoost jQuery resizing plugin
    http://www.editorboost.net/Webkitresize/Index
  jQuery is required, naturally, if it's not already loaded 
  then we will load our own version, so ensure you load your version
  first if you need a newer one (then this might break, but oh well).
  
  == Usage ==
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
  developer     : "EditorBoost (http://www.editorboost.net/Webkitresize/Index), James Sleeman (Xinha)",  
  license       : "GPLv3"
};

WebKitResize.AssetLoader = Xinha.includeAssets();

if(Xinha.is_webkit)
{
  // In case you want to use your own version of jQuery, you can load it first
  if(typeof jQuery == 'undefined')
  {
    // We seem to be able to use jQuery 3.3.1 with no issue which is the latest
    // version at time of writing, so make that the defauilt.
    WebKitResize.AssetLoader
      //.loadScript('jquery-1.12.4.js', 'WebKitResize')
      //.loadScript('jquery-2.2.4.js', 'WebKitResize')
      .loadScript('jquery-3.3.1.js', 'WebKitResize')
      .loadScript('jquery.mb.browser.min.js', 'WebKitResize');
  }

  WebKitResize.AssetLoader
    .loadScript('jquery.webkitresize.js', 'WebKitResize');
}

function WebKitResize(editor)
{
    this.editor = editor;
}

WebKitResize.prototype.onGenerateOnce = function()
{
  if(Xinha.is_webkit)
  {
    jQuery(this.editor._iframe).webkitimageresize();
    jQuery(this.editor._iframe).webkittableresize();
    jQuery(this.editor._iframe).webkittdresize();
  }
}
