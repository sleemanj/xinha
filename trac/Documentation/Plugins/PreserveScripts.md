{% include nav.html %}

# Plugin: PreserveScripts

Replace blocks of of PHP or JavaScript with icons in the editor, this way making it possible to edit sourcecode containing PHP, and preventing Javascript from being accidentally deleted because it's normally invisible

[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide.html#ProvideSomeConfiguration) for how to set configuration values in general, the below configuration options are available for this plugin.**

Configuration is not typically required, however the following options exist if you wish...

  `xinha_config.PreserveScripts.preservePHP = (bool);`
  :    Default true

  `xinha_config.PreserveScripts.preserveJS = (bool);`
  :    Default true

