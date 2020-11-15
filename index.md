{% include nav.html %}

![Screenshot of a typical Xinha v1.5.x](https://s3-us-west-1.amazonaws.com/xinha/screenshots/xinha-1.jpg)

{% include sidebar-news.html %}


## What's Xinha?
{: .no_toc}

The one line explanation is that Xinha turns `<textarea>` form fields into HTML editors.

We can do better than a one line explanation though, because you can **add Xinha to your site with one line**!

```
  <script src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js"></script>
```

That single line make all the `<texarea>` on that page into Xinha areas.  Of course that's just the beginning of the story, there are lots of [configuration options available]({{ site.baseurl }}/Documentation/NewbieGuide.html) if you want to use them.

---

* TOC
{:toc}

## News

### November 2020 

Xinha has joined the cool modern hip kids over at Github, and the previous Trac wiki has been migrated (a little roughly, work in progress) to this Github Pages site.

### November 2019

A quiet year on Xinha with it just ticking along as usual.  A few small updates were made since the big 1.5 Release in 2018 and upgrading to 1.5.4 is encouraged.

####  Version 1.5.4 Release 

1.5.4 fixes a small issue with highlighting some text and hitting the period key (.) with the `SmartReplace` plugin loaded, while it didn't break anything the UX wasn't quite right, now it's better.

### March 2018

March 2018 sees a large update to Xinha released after years of faithful service.

####  Version 1.5 Release 
Here are the main talking points, but of course there's a lot more besides this, see the ReleaseNotes.

  * Lots of bugs fixed
  * Lots of improvements made
  * Some new plugins added [WebKitResize]({{ site.baseurl }}/trac/Documentation/Plugins/WebKitResize.html), [EncodeOutput]({{ site.baseurl }}/trac/Documentation/Plugins/EncodeOutput.html), [ListOperations]({{ site.baseurl }}/trac/Documentation/Plugins/ListOperations.html), [FancySelects]({{ site.baseurl }}/trac/Documentation/Plugins/FancySelects.html), [PreserveSelection]({{ site.baseurl }}/trac/Documentation/Plugins/PreserveSelection.html)
  * Some old plugins deprecated (`SpellChecker` (browsers these days do spellchecking themselves), `ExtendedFile`Manager (recommend to use `MootoolsFile`Manager instead), `ImageManager` (recommend to use `MootoolsFile`Manager instead), `UnFormat` (use `SuperClean`), `PersistentStorage` (abandonded)) 
  * [MootoolsFileManager]({{ site.baseurl }}/trac/Documentation/Plugins/MootoolsFileManager.html) plugin updated to no longer require Flash, this plugin now uses HTML5 file uploads to do multiple file uploads with progress bars.
  * [A much easier way for integrating Xinha]({{ site.baseurl }}/trac/Documentation/NewbieGuide.html)
  * [Ability to use Xinha from external servers (CDN)]({{ site.baseurl }}/trac/Documentation/NewbieGuide/InstallingXinha.html) and still maintaining the ability to run special local plugins (eg your own plugins locally and everything else external, or everything locally, or everything externally...
  * Rewritten translations system reducing page loads and making the job easier for translators.
  * Reduction in network activity for plugin loading.
  * Updates to ensure continued good support in all modern browsers including Firefox, Chrome, Safari, IE and Edge, and retaining functionality in older versions of browsers where possible.
  * Improved security
  * Rewritten keyboard handling and new events exposed for plugin authors

You can [Download Xinha Here]({{ site.baseurl }}/trac/DownloadXinha.html) and it is recommended to read through the New [Newbie Guide]({{ site.baseurl }}/trac/Documentation/NewbieGuide.html) here as, while the old way will still work, the new way of loading Xinha offers you a lot more convenience!

#### Version 1.5.x Compatability 

As always, backwards compatibility is important, and breaking changes have been kept to a minimum.  

For users still using the `ImageManager` and `ExtendedFile`Manager plugins you will need to enable these specifically, they can also only be used with a full distribution.  These plugins have been moved to unsupported_plugins and to reduce the exposure for potential vulnerabilities in these very old plugins a .htaccess file has been added to unsupported_plugins to restrict them to certain IP addresses, you will need to edit `unsupported_plugins/.htaccess` to enable your IP (or open-access).

For users using the `CSS` plugin, this has been renamed to `CSSDropDowns` due to conflicts with native `CSS` objects.

That should be about it.

## Is Xinha under active development?

Xinha is a tool made by the developers for their own use.  

It is used by thousands of websites in production systems all over the world and has been for many many years.

Mostly the current [master branch]({{ site.github.repository_url }})  is what is used in even production systems.

The short version is, that development happens when a developer has an itch they need to scratch, we don't "fix-what's-not-broke".

There is no set schedule, and development of Xinha simply for the sake of developing Xinha doesn't happen much (we have bills to pay, if we don't have a direct need for something in one of our projects, it's not getting written).

Xinha is open source, and we mean it, if you want to progress the development of Xinha in some way, submit a pull request!

## How can I get Xinha? 

See the [Downloads Page]({{ site.baseurl }}/trac/DownloadsPage.html) or checout the [master branch]({{ site.github.repository_url }}), or even simply use it [directly from Amazon S3]({{ site.baseurl }}/trac/Documentation/NewbieGuide.html) without needing to download diddly squat.

## Have you got a forum? 

The forum was made read-only some years ago due to being too difficult to maintain, monitor and keep on top of the spammers.

[You can read and search it here](http://www.xinha.org/punbb/index.php)
