{% include nav.html %}

# Plugin: ContextMenu

[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

The ContextMenu plugin, developed by [Mihai Bazon](http://dynarch.com/) with sponsorshop by the American Bible Society, provides a right-click context menu for the editor.

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide.html#ProvideSomeConfiguration) for how to set configuration values in general, the below configuration options are available for this plugin.**

No configuration is necessary for general purposes.  For advanced users there are a couple of options.

  `xinha_config.ContextMenu.disableMozillaSpellCheck = true;`::
    This option will disable the native browser spellchecking in at least Mozilla browsers.  This option may no longer be very useful as spell checking behaviour has been improved.  False by default.

  `xinha_config.ContextMenu.customHooks = { }`::
     This option allows you to, for specific tag names, set custom functions to insert into the context menu.  For example

```
       xinha_config.ContextMenu.customHooks = { 'a': [ ['Label', function() { alert('Action'); }, 'Tooltip', '/icon.jpg' ] ] }
```

