# Plugin: InsertSnippet 

Provide functionality to insert snippets of HTML (or any other text, such as variable substitutions).


[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide.html#ProvideSomeConfiguration) for how to set configuration values in general, the below configuration options are available for this plugin.**


  xinha_config.InsertSnippet.snippets = '/url/path/to/snippets.js';::
    The URL path to a javascript file which defines a "snippets" array.

The snippets file, which is not "JSON" but an eval'd javascript script, must define the array "`snippets`" in which each element is an object with the properties 'id' and 'HTML'.

### Example snippets.js file


```

  var snippets = [
    { id: 'Snippet 1', HTML: '<span>Hello World</span>' },
    { id: 'Snippet 2', HTML: '{HowNowBrownCow}' }
  ];

```


Obviously you can generate this file manually, or dynamically by whatever processes you desire, just specify the path to it in the configuration.
