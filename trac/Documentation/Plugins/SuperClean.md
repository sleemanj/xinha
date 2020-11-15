# Plugin: SuperClean

[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

The SuperClean plugin, developed by [http://code.gogo.co.nz/ James Sleeman] and improved by Niko Sams based on code by Udo Schmal provides a combined interface for HTMLTidy, Word cleaning, stripping out font typefaces, colours and sizes, and calling custom filter-functions.

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide#ProvideSomeConfiguration.html) for how to set configuration values in general, the below configuration options are available for this plugin.**

Configuration of this plugin is not normally required, however there are some options to customise it if necessary.

### Plugin-Setting filters:
Defines the avaliable filters
```
xinha_config.SuperClean.filters = {
               'tidy': HTMLArea._lc('General tidy up and correction of some problems.', 'SuperClean'),
               'myfilter': 'My special Filter'
              };
```

#### Avaliable built-in filters:
 * tidy: calls HTMLTidy (through the php-backend)
 * word_clean: calls the Xinha Word-Clean-Functions
 * remove_faces: removes all font-faces
 * remove_sizes: removes all font-sizes
 * remove_colors: removes all font-colors
 * remove_lang: removes all lang-attributes

#### Custom filters
Custom filters must be defined in plugins/Filter/filters/myfilter.js\\
example:
```
function(html, editor) {
  //...do something fancy with html...
  return(html);
}
```


### Plugin-Setting show_dialog
If false all filters are applied on button click, if true a dialog asks which filters should be used
```
//example (=default)
xinha_config.SuperClean.show_dialog = true;
```

### Plugin-Setting tidy_handler:
Set to the URL of a handler for html tidy, this handler (see tidy.php for an example) must that a single post variable "content" which contains the HTML to tidy, and return javascript like editor.setHTML('<strong>Tidied Html</strong>')
it's called through XMLHTTPRequest
```
//example (=default setting)
xinha_config.SuperClean.tidy_handler = _editor_url + 'plugins/SuperClean/tidy.php'
```
