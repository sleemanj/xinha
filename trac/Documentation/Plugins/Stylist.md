# Stylist

[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

The Xinha Stylist plugin provides a "Panel" containing various developer supplied context sensitive CSS styles.  Using this plugin the user is able to apply (and remove) one or more CSS classes to the (possibly implicit) selection.

The plugin is "smart", that is, it will understand classes that are only valid within context.  For example if you supplied the plugin the following style


```
li.important { color:red } 
```

it would only be avaliable in the stylist when the cursor is in an <li> element.

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide.html#ProvideSomeConfiguration) for how to set configuration values in general, the below configuration options are available for this plugin.**



```

  // We can load an external stylesheet like this - NOTE : YOU MUST GIVE AN ABSOLUTE URL
  //  otherwise it won't work!
  xinha_config.stylistLoadStylesheet('/mystyles.css');

  // Or we can load styles directly
  xinha_config.stylistLoadStyles('p.red_text { color:red }');

  // If you want to provide "friendly" names you can do so like this
  xinha_config.stylistLoadStyles('p.pink_text { color:pink }', {'p.pink_text' : 'Pretty Pink'});

  // or like this
  xinha_config.stylistLoadStylesheet('/mystyles.css', {'p.pink_text' : 'Pretty Pink'});
```


The plugin was developed by [http://code.gogo.co.nz/ James Sleeman].
