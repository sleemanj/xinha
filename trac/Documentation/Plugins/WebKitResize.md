# Plugin: WebKitResize 

[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

 
  The `WebKit` based (or similar) browsers, including Chrome (and Edge)
  don't support drag-to-size images or tables, which is a pain.
  
  This plugin implements the `EditorBoost` jQuery resizing plugin
    http://www.editorboost.net/Webkitresize/Index
  jQuery is required, naturally, if it's not already loaded 
  then we will load our own version, so ensure you load your version
  first if you need a newer one (then this might break, but oh well).
  
    ## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide.html#ProvideSomeConfiguration) for how to set configuration values in general, the below configuration options are available for this plugin.**

Configuration for this plugin is not normally required, however there are a couple of options if you wish to customise it.  


```
  xinha_config.WebKitResize.enableTDForGeckoAlso = false;

  xinha_config.WebKitResize.enableTABLEForGeckoAlso = false;
```


  ## Caution
  This only works acceptably in either:

    Standards Mode  (eg Doctype <!DOCTYPE html> )

    Quirks Mode     (eg no doctype              )
    
  it does not work great in "Almost Standards Mode" because scrolling throws
  the resize border out of place, that's ok if you don't need to scroll, 
  either because your text is small, or you are in FullScreen mode or 
  something, but anyway.
