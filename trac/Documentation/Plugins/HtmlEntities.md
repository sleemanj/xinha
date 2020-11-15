# HtmlEntities for Xinha
[Back To Plugins]({{ site.baseurl }}/trac/Plugins.html)\\

Internally, the editor (actually `JavaScript`) treats strings as Unicode, disregarding of the charset you are using in your page. As a result all named entities are decoded when editing, thereby possibly breaking the encoding of characters that are not available in the actual codepage, e.g. the € in ISO-8859-1, or “quotation marks”. 
Maybe these characters are rendered correctly in the browser, but they produce a "non SGML character number ..." error in HTML validation.


## Usage
If you use the ISO-8859-1 charset, just load the plugin and all characters that are not contained therein are converted.

If you want all non ASCII characters converted to named entites, set 

```
 xinha_config.HtmlEntities.Encoding= null; 
```


If you want to exclude characters that are available in the used charset other than ISO-8859-1, you can edit the file Entities in the plugin folder by deleting or commenting out the respective lines. Then you save the file under a different name and reference it like this

```
 xinha_config.HtmlEntities.Encoding= null; 
 xinha_config.HtmlEntities.EntitiesFile = "/url/to/your/file.js"; 
```

This way you will have no needless entities. If you have done this for any charset, please consider sending it along, so that we can include it as a preset.

The conversion map provided by mharrisonline in ticket #127\\
The plugin is by [Raimund Meyer](http://xinha.raimundmeyer.de)
