{% include nav.html %}

# Plugin: FancySelects 

[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

This plugin makes the drop-downs (font, size etc) "Fancy" by using the "select2" jQuery script (jQuery will be loaded automatically when using this plugin).

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide.html#ProvideSomeConfiguration) for how to set configuration values in general, the below configuration options are available for this plugin.**

Generally no configuration is necessary, however you may wish to set widths explicitly, the following are the defaults...


```
xinha_config.FancySelects = {
  widths: {
    'formatblock' : '90px',
    'fontname'    : '130px',
    'fontsize'    : '80px',
    'DynamicCSS-class' : '130px',
    'langmarks'  : '110px'
  }
};
```

