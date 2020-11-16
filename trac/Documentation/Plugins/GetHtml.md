{% include nav.html %}

# Plugin: GetHtml 

[Back to Plugins]({{ site.baseurl }}/trac/Documentation/Plugins.html)

`GetHtml` is a replacement for the getHTML() function in htmlarea.js. It offers several improvements over the original, including:

 * Produces valid XHTML code
 * Formats code in HTML view in indented, readable format.
 * Much faster than HTMLArea.getHTML()
 * Eliminates many hacks to accomodate browser quirks
 * Returns correct code for Flash objects and scripts
 * Preserves formatting inside script and pre tags

`GetHtml` was developed by Nelson Bright and is under htmlArea license.
It is based on the XML_Utility functions submitted in Ticket #253 by troels_kn, who gives credit also to adios, who helped with the regular expressions: http://www.sitepoint.com/forums/showthread.php?t=201052


## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide.html#ProvideSomeConfiguration) for how to set configuration values in general, the below configuration options are available for this plugin.**


You can enable this by setting [xinha_config.getHtmlMethod]({{ site.baseurl }}/trac/Documentation/ConfigVariablesList.html#xinha_configgetHtmlMethod) to "TransformInnerHTML"

