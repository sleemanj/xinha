{% include nav.html %}

# Plugin: InsertSmiley

[Back To Plugins]({{ site.baseurl }}/trac/Plugins.html)

The InsertSmiley plugin allows the user to add Smileys by dialog.

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide.html#ProvideSomeConfiguration) for how to set configuration values in general, the below configuration options are available for this plugin.**

### Adding More Smileys

It is easy to add more smileys, in the `plugins/InsertSmiley/smileys/` folder you will see all the smiley images, add more smiley images in this folder, then you can edit the smileys.js file in that same folder to "hook them up".

If your server supports PHP, you don't even need to edit the file, just make this Xinha configuration


```
xinha_config.InsertSmiley.smileys = _editor_url + '/plugins/InsertSmiley/smileys/smileys.php'; 
```

and it will automatically detect the new smileys.


## Authors
This plugin was developed by [Ki Master George](http://kimastergeorge.i4host.com/) and is under htmlArea license.
The plugin was rewritten by [James Sleeman](http://www.gogo.co.nz/)
