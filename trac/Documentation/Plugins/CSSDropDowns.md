# Plugin: CSSDropDowns

[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

Inserts one or more drop down menus into the Xinha toolbar allowing to select CSS classes which will be applied to selected text wrapped in a span.


## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide#ProvideSomeConfiguration.html) for how to set configuration values in general, the below configuration options are available for this plugin.**

You can use this plugin without configuration and two default drop downs will be shown as an example, however more usefully you can specify a configuration such as....


```
xinha_config.cssPluginConfig =
  {
    combos : [
      { label: "My Drop Down",
        options: { "Drop Down Label 1"           : "css-class-to-apply",
                   "Drop Down Label 2"           : "css-class-to-apply"                   
                 },
      },
      { label: "My Other Drop Down",
        options: {  "Drop Down Label 3"           : "css-class-to-apply",
                    "Drop Down Label 4"           : "css-class-to-apply"
                 }
      }
    ]
  };
```

