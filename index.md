{% include nav.html %}
{% include sidebar-news.html %}

<img src="//s3-us-west-1.amazonaws.com/xinha/screenshots/xinha-1.jpg" />

## November 2020 

Due to Webfaction (nee Python-Hosting) changes we can no longer host with them since they no longer to Trac and Subversion.  So, Github here we come.

## November 2019 - Version 1.5.4 Release 

A quiet year on Xinha with it just ticking along as usual.  A few small updates were made since the big 1.5 Release in 2018 and upgrading to 1.5.4 is encouraged.

1.5.4 fixes a small issue with highlighting some text and hitting the period key (.) with the !SmartReplace plugin loaded, while it didn't break anything the UX wasn't quite right, now it's better.

## March 2018 - Version 1.5 Release 

March 2018 sees a large update to Xinha released after years of faithful service.

Here are the main talking points, but of course there's a lot more besides this, see the ReleaseNotes.

  * Lots of bugs fixed
  * Lots of improvements made
  * Some new plugins added [Documentation/Plugins/WebKitResize.html](WebKitResize), [wiki:Documentation/Plugins/EncodeOutput EncodeOutput], [wiki:Documentation/Plugins/ListOperations ListOperations], [wiki:Documentation/Plugins/FancySelects FancySelects], [wiki:Documentation/Plugins/PreserveSelection PreserveSelection]
  * Some old plugins deprecated (!SpellChecker (browsers these days do spellchecking themselves), !ExtendedFileManager (recommend to use !MootoolsFileManager instead), !ImageManager (recommend to use !MootoolsFileManager instead), !UnFormat (use !SuperClean), !PersistentStorage (abandonded)) 
  * [Documentation/Plugins/MootoolsFileManager.html](MootoolsFileManager) plugin updated to no longer require Flash, this plugin now uses HTML5 file uploads to do multiple file uploads with progress bars.
  * [Documentation/NewbieGuide.html](A much easier way for integrating Xinha)
  * [wiki:Documentation/NewbieGuide/InstallingXinha Ability to use Xinha from external servers (CDN)] and still maintaining the ability to run special local plugins (eg your own plugins locally and everything else external, or everything locally, or everything externally...
  * Rewritten translations system reducing page loads and making the job easier for translators
  * Reduction in network activity for plugin loading
  * Updates to ensure continued good support in all modern browsers including Firefox, Chrome, Safari, IE and Edge, and retaining functionality in older versions of browsers where possible.
  * Improved security
  * Rewritten keyboard handling and new events exposed for plugin authors

You can [DownloadXinha.html](Download Xinha Here) and it is recommended to read through the New [wiki:Documentation/NewbieGuide Newbie Guide] here as, while the old way will still work, the new way of loading Xinha offers you a lot more convenience!

## Compatability 

As always, backwards compatibility is important, and breaking changes have been kept to a minimum.  

For users still using the !ImageManager and !ExtendedFileManager plugins you will need to enable these specifically, they can also only be used with a full distribution.  These plugins have been moved to unsupported_plugins and to reduce the exposure for potential vulnerabilities in these very old plugins a .htaccess file has been added to unsupported_plugins to restrict them to certain IP addresses, you will need to edit `unsupported_plugins/.htaccess` to enable your IP (or open-access).

For users using the `CSS` plugin, this has been renamed to `CSSDropDowns` due to conflicts with native `CSS` objects.

That should be about it.



## Is Xinha under active development?  No updates for years and then a big one?  What's going on? 

Xinha is a tool made by the developers for their own use.  

It is used by thousands of websites in production systems all over the world and has been for many many years.

Mostly the current trunk ( checkout with "svn co http://svn.xinha.org/trunk/ trunk" ) is what is used in even production systems.

The short version is, that development happens when a developer has an itch they need to scratch, we don't "fix-what's-not-broke".

There is no set schedule, and development of Xinha simply for the sake of developing Xinha doesn't happen much (we have bills to pay, if we don't have a direct need for something in one of our projects, it's not getting written).

Xinha is open source, and we mean it, if you want to progress the development of Xinha in some way, please contact James Sleeman ( See [Developers.html](Xinha Developers) ) and he will arrange for SVN commit and Trac management access.


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
That's ok, we do.  Some other ways you might contribute are to sponsor development of Xinha plugins, or donate some cash to one of the [Developers.html](Xinha developers).

## What else is here? 
For a complete list of local wiki pages, see TitleIndex.
