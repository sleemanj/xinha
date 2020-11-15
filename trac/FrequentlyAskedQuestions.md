# Frequently Asked Questions

[Version française]({{ site.baseurl }}/trac/FrequentlyAskedQuestionsFrance.html).

Firstly, this page is always being improved, so if you don't understand something, or you think something is missing, then please post a message in the forum in the [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=138 Discussion Forum].

## Basic
[http://xinha.gogo.co.nz/punbb/viewtopic.php?pid=5355 Can I load/edit/save online documents with Xinha?]

 * Q: How do I set the content of the editor?
   * A: To set the initial editor content, simply put the [entized]({{ site.baseurl }}/trac/Documentation/NewbieGuide/Entize.html) HTML into the initial textarea
   * A: To set the content dynamically by Javascript, use the editor.setEditorContent(html) method
 * Q: How do I get the edited HTML with?
   * A: Use the editor.getEditorContent() method

## On the project

 * Q: How can I help the project?
   * A: Use the editor with eyes open and tell us how to improve it. Feature requests and bug reports should be submitted as [tickets]({{ site.baseurl }}/trac/Tickets.html).
   * A: Check the timeline and participate in ticket discussions. To see the most recent comments posted to all tickets, [report:9 click here].
   * A: Localize Xinha to your language ([Translating Xinha]({{ site.baseurl }}/trac/Documentation/DevelopingForXinha/Translating.html))
 * Q: Have you had a chance to put up a donation page?
   * A: Currently only one developer showed no scruples and has put up a personal `PayPal` button [Developers]({{ site.baseurl }}/trac/Developers.html)

## Installation
 
 * Q: How do I get started? See [Newbie Guide]({{ site.baseurl }}/trac/Documentation/NewbieGuide.html)

 * Q: Do I need a webserver or can I use the script through file:// ?
 * A: You can use it from a CDN if you want, see the [Newbie Guide]({{ site.baseurl }}/trac/Documentation/NewbieGuide.html), but ultimately you're going to need a server to actually do something with your HTML, right.

 * Q: How can I change the default editor CSS? 
 * A: See ([http://xinha.gogo.co.nz/punbb/viewtopic.php?id=455 default CSS])

## Editor usage

 * Q: How to insert a <br> tag ?
   * Use Shift+Enter
   * To change the behaviour of unshifted enter, in Mozilla set `xinha_config.mozParaHandler = "built-in"`. In IE there is now way to change this.

## Configuration

 * Q: What options are there to make the editor fit my needs? See the [Wiki: list of available options]({{ site.baseurl }}/trac/Documentation/NewbieGuide/ConfigurationOptions.html)
 * Q: How can I customize the toolbar? [Wiki: xinha_config.toolbar]({{ site.baseurl }}/trac/Documentation/NewbieGuide/ConfigurationOptions.html#xinha_configtoolbar)
 * Q: How can I make the h1 tag and other tags to be styled the way they will show on my website ? [Wiki: xinha_config.pageStyleSheets/xinha_config.pageStyles]({{ site.baseurl }}/trac/Documentation/NewbieGuide/ConfigurationOptions.html#xinha_configpageStyleSheets)
 * Q: How can I change the default display font ? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=116 Font]
 * Q: Is it possible to start Xinha in fullscreen mode? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=102 Full screen]
 * Q: How can I hide the path bar ? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=3 Path bar]
 * Q: How can I resize the editor ? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=244 Resize]

 
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

 * Q: Is there a list of all the functions Xinha uses? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=137 Xinha functions] (probably out-dated)
 * Q: How do I update the data in the editor? [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=224 setEditorContent(), getEditorContent()...]

## Internationalization

 * Q: How can I add my language to the Xinha translations?
 * A: [Translating Xinha]({{ site.baseurl }}/trac/Documentation/DevelopingForXinha/Translating.html)

## About the plugins

 * Q: Is there a tutorial for plugin creation?
 * A: Documentation/DevelopingForXinha/PluginTutorial - but see some of the other plugins for practical example!
