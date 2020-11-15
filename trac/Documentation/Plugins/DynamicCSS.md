# Plugin: DynamicCSS

[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

The DynamicCSS plugin is used to place a drop-down in the toolbar to allow applying CSS classes to the selection.  The drop-down gives access to CSS styles that Xinha has access to.  So, for example, if you use the code below, 


```
config.pageStyle = "@import url(style.css)"
```


then whatever styles set in "style.css" will be available in the drop-down (hence the "dynamic" part).  Note that a full URL is required for import url.

It was originally developed by [http://systemconcept.de/ Holger Hees].

In Xinha you may find the [Stylist Plugin]({{ site.baseurl }}/trac/Stylist.html) offers better functionality, at the price of a little more screen realestate.

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide.html#ProvideSomeConfiguration) for how to set configuration values in general, the below configuration options are available for this plugin.**

There is presently no configuration required for this plugin other than to set one or more stylesheets as illustrated in the NewbieGuide.
