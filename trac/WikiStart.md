```
#!div style="float:right;width:430px;padding:0;margin-right:20px"
```
#!html
<div style="text-align:center;border:1px solid #CCC; width:100%;margin-right:20px; background-color:#EEEEEE;">
<table style="width:430px"><tr>
  <td>
    <a href="/wiki/Examples">Demo</a>&nbsp;&nbsp;
    <a href="/wiki/DownloadXinha">Downloads</a>&nbsp;&nbsp;
    <a href="/wiki/ReleaseNotes">Release Notes</a>&nbsp;&nbsp;
    <a href="/wiki/Documentation">Documentation</a>
<br/>
    <a href="/wiki/Tickets">Report Bug</a>&nbsp;&nbsp;
    <a href="/wiki/FrequentlyAskedQuestions">FAQ</a>&nbsp;&nbsp;
    <a href="/wiki/Screenshots">Screenshots</a>&nbsp;&nbsp;
    <a href="http://www.xinha.org/punbb/index.php">Forum Archive</a>&nbsp;&nbsp;
    <a href="/wiki/Developers">Developers</a>&nbsp;&nbsp;
  </td>
</tr>
</table>
</div>
```
```
#!div style="float:right;margin:10px 0 0 10px;border:1px solid #CCC; width:200px; background-color:#EEEEEE;"
```
#!html
<h2 style="margin:0px;padding:3px; border-bottom:1px outset #CCC; ">News</h2>
```


**6th November 2019**\\[wiki:ReleaseNotes Release 1.5.4]

**24th May 2018**\\[wiki:ReleaseNotes Release 1.5.3]

**15th May 2018**\\[wiki:ReleaseNotes Release 1.5.2]

**12th April 2018**\\[wiki:ReleaseNotes Release 1.5.1]

**18th March 2018**\\[wiki:ReleaseNotes Release 1.5 "A Long Time Coming"]

\\
[wiki:NewsArchive see older news...]
```

```
#!div style="float:right;border:2px solid red; margin:10px 0 0 0; padding:5px; background-color:#fffbd9; width: 200px"
```
#!html
<h2 style="margin:0px;padding:3px; border-bottom:1px outset #CCC; ">Security Patch</h2>
<p>Developers are urged to update to Xinha 1.5, there are no security advisories for 1.5 at this time.</p>
<!--
<p>10th May 2010 - New Security Advisory, see <a href="/ticket/1518">Ticket #1518</a>.</p>
<p>4th May 2010 - New Security Advisory, see <a href="/ticket/1515">Ticket #1515</a>.</p>
<p>All developers are urgently instructed to see <a href="/ticket/1363">Ticket #1363</a>.</p>

<h2 style="margin:0px;padding:3px; border-bottom:1px outset #CCC; ">Help</h2>
<p>If you need help installing the editor or have questions, ask them in the
<a href="http://www.xinha.org/punbb/index.php">Forum</a></p>
-->
<p>
If you are new to Xinha, view the <a href="/wiki/Documentation/NewbieGuide">Xinha Newbie Guide</a>
</p>
<h2 style="margin:0px;margin-top:10px;padding:3px; border-bottom:1px outset #CCC; ">Bug Reports/Feature Requests</h2>
If you have found a bug in Xinha or have a great idea how we can make it even better, please create a <a href="/wiki/Tickets">ticket</a>.<br />
```
Due to the large amount of ticket spam the ticket system requires that you login prior to 
being able to create or comment on tickets, guests can login with [guest login details]({{ site.baseurl }}/Tickets.html).  
Please read the [Tickets]({{ site.baseurl }}/Tickets.html) page for more information on creating bug reports and feature requests.
```


```

```
#!html
<h1><span style="font-size:26px">Xinha</span><br />The Community-built Open Source Online HTML Editor</h1>
```
Xinha (pronounced like [http://images.google.co.nz/images?q=xena&hl=en&btnG=Google+Search Xena, the Warrior Princess]) 
is a powerful WYSIWYG HTML editor component that works in all current browsers. Its 
configurabilty and extensibility make it easy to build just the right editor for multiple purposes, from a restricted mini-editor
for one database field to a full-fledged website editor. Its liberal, [BSD licence]({{ site.baseurl }}/Licence.html) makes it an ideal candidate
for integration into any kind of project.

'''Xinha is Open Source,''' and we take this seriously. There is no company that owns the source but a community of professionals 
who just want Xinha to be the best tool for their work.

```
#!html
<img src="//s3-us-west-1.amazonaws.com/xinha/screenshots/xinha-1.jpg" />
```

## November 2019 - Version 1.5.4 Release

A quiet year on Xinha with it just ticking along as usual.  A few small updates were made since the big 1.5 Release in 2018 and upgrading to 1.5.4 is encouraged.

1.5.4 fixes a small issue with highlighting some text and hitting the period key (.) with the `SmartReplace` plugin loaded, while it didn't break anything the UX wasn't quite right, now it's better.

## March 2018 - Version 1.5 Release

March 2018 sees a large update to Xinha released after years of faithful service.

Here are the main talking points, but of course there's a lot more besides this, see the ReleaseNotes.

  * Lots of bugs fixed
  * Lots of improvements made
  * Some new plugins added [WebKitResize]({{ site.baseurl }}/Documentation/Plugins/WebKitResize.html), [EncodeOutput]({{ site.baseurl }}/Documentation/Plugins/EncodeOutput.html), [ListOperations]({{ site.baseurl }}/Documentation/Plugins/ListOperations.html), [FancySelects]({{ site.baseurl }}/Documentation/Plugins/FancySelects.html), [PreserveSelection]({{ site.baseurl }}/Documentation/Plugins/PreserveSelection.html)
  * Some old plugins deprecated (`SpellChecker` (browsers these days do spellchecking themselves), `ExtendedFile`Manager (recommend to use `MootoolsFile`Manager instead), `ImageManager` (recommend to use `MootoolsFile`Manager instead), `UnFormat` (use `SuperClean`), `PersistentStorage` (abandonded)) 
  * [MootoolsFileManager]({{ site.baseurl }}/Documentation/Plugins/MootoolsFileManager.html) plugin updated to no longer require Flash, this plugin now uses HTML5 file uploads to do multiple file uploads with progress bars.
  * [A much easier way for integrating Xinha]({{ site.baseurl }}/Documentation/NewbieGuide.html)
  * [wiki:Documentation/NewbieGuide/InstallingXinha Ability to use Xinha from external servers (CDN)] and still maintaining the ability to run special local plugins (eg your own plugins locally and everything else external, or everything locally, or everything externally...
  * Rewritten translations system reducing page loads and making the job easier for translators
  * Reduction in network activity for plugin loading
  * Updates to ensure continued good support in all modern browsers including Firefox, Chrome, Safari, IE and Edge, and retaining functionality in older versions of browsers where possible.
  * Improved security
  * Rewritten keyboard handling and new events exposed for plugin authors

You can [Download Xinha Here]({{ site.baseurl }}/DownloadXinha.html) and it is recommended to read through the New [Newbie Guide]({{ site.baseurl }}/Documentation/NewbieGuide.html) here as, while the old way will still work, the new way of loading Xinha offers you a lot more convenience!

### Compatability

As always, backwards compatibility is important, and breaking changes have been kept to a minimum.  

For users still using the `ImageManager` and `ExtendedFile`Manager plugins you will need to enable these specifically, they can also only be used with a full distribution.  These plugins have been moved to unsupported_plugins and to reduce the exposure for potential vulnerabilities in these very old plugins a .htaccess file has been added to unsupported_plugins to restrict them to certain IP addresses, you will need to edit `unsupported_plugins/.htaccess` to enable your IP (or open-access).

For users using the `CSS` plugin, this has been renamed to `CSSDropDowns` due to conflicts with native `CSS` objects.

That should be about it.



## Is Xinha under active development?  No updates for years and then a big one?  What's going on?

Xinha is a tool made by the developers for their own use.  

It is used by thousands of websites in production systems all over the world and has been for many many years.

Mostly the current trunk ( checkout with "svn co http://svn.xinha.org/trunk/ trunk" ) is what is used in even production systems.

The short version is, that development happens when a developer has an itch they need to scratch, we don't "fix-what's-not-broke".

There is no set schedule, and development of Xinha simply for the sake of developing Xinha doesn't happen much (we have bills to pay, if we don't have a direct need for something in one of our projects, it's not getting written).

Xinha is open source, and we mean it, if you want to progress the development of Xinha in some way, please contact James Sleeman ( See [Xinha Developers]({{ site.baseurl }}/Developers.html) ) and he will arrange for SVN commit and Trac management access.


## How can I get Xinha?
See the DownloadsPage.

## Have you got a forum?

The forum was made read-only some years ago due to being too difficult to maintain, monitor and keep on top of the spammers.

You can read and search it here: [http://www.xinha.org/punbb/index.php]

## How can I contribute to Xinha?

Do you know Javascript, are you willing to learn?  Then checkout a working copy and get hacking that code!  Check the tickets for feature requests that you could implement, reported bugs that you could fix.  When you've got something worth contributing back to Xinha, just send it on along.  Regular and proven contributors will get SVN commit access!
This is one of the main reasons Xinha split from htmlArea, the htmlArea development was not open to fair and equal participation by all developers.  Xinha is different, we are a group of developers trying to produce the best WYSIWYG HTML Editor available.  

There ~~is~~ once was a mailing list available at [http://www.openplans.org/projects/xinha/lists/xinha-discussion], it's gone now.

## I don't know Javascript!
That's ok, we do.  Some other ways you might contribute are to sponsor development of Xinha plugins, or donate some cash to one of the [Xinha developers]({{ site.baseurl }}/Developers.html).

## What else is here?
For a complete list of local wiki pages, see TitleIndex.



