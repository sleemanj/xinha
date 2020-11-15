{% include nav.html %}

# Plugin: EnterParagraphs

[Back To Plugins]({{ site.baseurl }}/trac/Plugins.html)

The EnterParagraphs plugin is used to make Gecko based web browsers (Mozilla (Firefox), Epihpany etc) work a bit more like Internet Explorer in terms of the behaviour when you press Enter.  Essentially, when you press enter in IE it starts a new paragraph, while in Mozilla it inserts a <br /> (break) tag.  The Internet Explorer behaviour is the technically correct behaviour.

The plugin was developed by [Adam Wright](http://blog.hipikat.org/).

## Special Case

In Xinha this plugin is a special case because it is turned on/off by a special configuration variable (mozParaHandler), it's not necessary to call LoadPlugin() etc.  The variable was introduced in changeset:9.  This configuration variable has three settings...

 * "built-in" doesn't alter mozilla's paragraph handling at all, so this probably means hitting enter will cause a <br/> to be inserted.
 * ~~"dirty" will use a "quick and dirty" fix which will make mozilla put in paragraphs instead of breaks in '''most''' cases. But it's far from perfect.~~ (I believe this is no longer present).
 * "best" will use "hipikat"'s EnterParagraphs plugin to provide the fix for mozilla

If you have config.mozParaHandler set to "best" then EnterParagraphs will be automatically loaded, registered and used. The default (and recommended) setting is "best" so there is no need to use this plugin explicitly.

## Current Issue

See ticket:1226 for an issue regarding the "best" setting.
