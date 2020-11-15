{% include nav.html %}

# Frequently Asked Questions

## Basic
[Can I load/edit/save online documents with Xinha?](http://xinha.gogo.co.nz/punbb/viewtopic.php?pid=5355)

 * Q: How do I set the content of the editor?
   * A: To set the initial editor content, simply put the [entized]({{ site.baseurl }}/trac/Documentation/NewbieGuide/Entize.html) HTML into the initial textarea
   * A: To set the content dynamically by Javascript, use the editor.setEditorContent(html) method
 * Q: How do I get the edited HTML with?
   * A: Use the editor.getEditorContent() method

## On the project

 * Q: How can I help the project?
   * A: Use the editor with eyes open and tell us how to improve it at [Github]({{ site.github.repository_url }})
   * A: Localize Xinha to your language ([Translating Xinha]({{ site.baseurl }}/trac/Documentation/DevelopingForXinha/Translating.html))

## Installation
 
 * Q: How do I get started? See [Newbie Guide]({{ site.baseurl }}/trac/Documentation/NewbieGuide.html)

 * Q: Do I need a webserver or can I use the script through file:// ?
 * A: You can use it from a CDN if you want, see the [Newbie Guide]({{ site.baseurl }}/trac/Documentation/NewbieGuide.html), but ultimately you're going to need a server to actually do something with your HTML, right.

 * Q: How can I change the default editor CSS? 
 * A: See ([default CSS](http://www.xinha.org/punbb/viewtopic.php?id=455))

## Editor usage

 * Q: How to insert a <br> tag ?
   * Use Shift+Enter (this is the same as you would do in most word processors by the way)
   * To change the behaviour of unshifted enter, in Mozilla set `xinha_config.mozParaHandler = "built-in"`. In IE there is no way to change this.

## Configuration

 * Q: What options are there to make the editor fit my needs? See the [Wiki: list of available options]({{ site.baseurl }}/trac/Documentation/NewbieGuide/ConfigurationOptions.html)
 * Q: How can I customize the toolbar? [Wiki: xinha_config.toolbar]({{ site.baseurl }}/trac/Documentation/NewbieGuide/ConfigurationOptions.html#xinha_configtoolbar)
 * Q: How can I make the h1 tag and other tags to be styled the way they will show on my website ? [Wiki: xinha_config.pageStyleSheets/xinha_config.pageStyles]({{ site.baseurl }}/trac/Documentation/NewbieGuide/ConfigurationOptions.html#xinha_configpageStyleSheets)
 * Q: How can I change the default display font ? [Font](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=116)
 * Q: Is it possible to start Xinha in fullscreen mode? [Full screen](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=102)
 * Q: How can I hide the path bar ? [Path bar](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=3)
 * Q: How can I resize the editor ? [Resize](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=244)

 
## Troubles

 * Q: Xinha doesn't load though I have set it up according to the `NewbieGuide` 
   * A: make sure _editor_url is set correctly and all files could be loaded 
   * A: Check for any `JavaScript` errors 
 * Q: I have done everything explained in newbie document but the texts are always in English, how can I use my language file ?
   * A: Make sure your language file is up to date.
   * A: The translation system (i18n) will only work if you have a webserver or run Xinha from CDN.
 * Q: My text appears strangely in my textarea ?
   * A: You should entitize data put into textareas [Entitize data]({{ site.baseurl }}/trac/Documentation/NewbieGuide/Entize.html)
 * Q: Why get the changes only submitted when switching into HTML mode?
   * A: If you submit the form using `JavaScript` (form.submit())you must not have a button with id="submit" in the same form
 * Q: When i'm using the html code mode, all accented or umlaut characters are converted to normal.
   * A: Use the [HtmlEntities plugin]({{ site.baseurl }}/trac/Documentation/Plugins/HtmlEntities.html) 

## Developers

 * Q: Is there a list of all the functions Xinha uses? [Xinha functions](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=137) (probably out-dated)
 * Q: How do I update the data in the editor? [setEditorContent(), getEditorContent()...](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=224)

## Internationalization

 * Q: How can I add my language to the Xinha translations?
 * A: [Translating Xinha]({{ site.baseurl }}/trac/Documentation/DevelopingForXinha/Translating.html)

## About the plugins

 * Q: Is there a tutorial for plugin creation?
 * A: Documentation/DevelopingForXinha/PluginTutorial - but see some of the other plugins for practical example!
