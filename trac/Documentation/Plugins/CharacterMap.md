# Plugin: CharacterMap

[Back to Plugins](Plugins.html)

The CharacterMap plugin, developed by [http://www.systemconcept.de/ Holger Hees & Bernhard Pfeifer] implants a button onto the toolbar which will open a popup window allowing the insertion of various special characters.

## Configuration

**See the [NewbieGuide](NewbieGuide#ProvideSomeConfiguration.html) for how to set configuration values in general, the below configuration options are available for this plugin.**

There is now two representation available. Panel or Popup, popup version is the default settings. To use the panel, it is needed to update the configuration

```
xinha_config.CharacterMap.mode = 'panel';
```
Setting the configuration to 'panel' will ask the plugin to use the panel instead of the popup.

The default setting is set to popup :
```
xinha_config.CharacterMap.mode = 'popup';
```
