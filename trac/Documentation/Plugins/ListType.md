{% include nav.html %}

# Plugin: ListType

[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

The ListType plugin allows for the creation of different types of lists, namely decimal, lower-roman, upper-roman, lower-alpha and upper-alpha.  Additionally in Gecko browsers it supports a "lower-greek" list style.

The plugin was developed by [Mihai Bazon](http://dynarch.com/) with sponsorship by the `MedTech` Unit at [Queen's University](http://www.queens.ca/) (Canada).

There is now two representation available. Panel or Toolbar, toolbar version is the default settings. To use the panel, it is needed to update the configuration


```
xinha_config.ListType.mode = 'panel';
```

Setting the configuration to 'panel' will ask the plugin to use the panel instead of the selectbox in toolbar.

The default setting is set to toolbar :

```
xinha_config.ListType.mode = 'toolbar';
```

