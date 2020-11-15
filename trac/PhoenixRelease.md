Xinha 0.96 Phoenix Beta Release announcement.

The Xinha Developer Team is proud to announce a beta version of the next release of Xinha, the community-built WYSIWYG editor, called Phoenix.

  "First of all, this release of Xinha is the first to have one of the fancy code names that all decent open source projects nowadays have. There are loads more changes covered below, giving Xinha a whole new face, more power and beauty than ever. That's what lead us to chose the name of Phoenix, alluding to the mythical bird that lives forever, from time to time burning to ashes, and being reborn. While not wanting to imply Xinha has been dead at any point, I have the strong feeling that this release marks the beginning  of a time of a new momentum in our lasting pursuit to make the best available WYSIWYG editor out there."  --Raimund Meyer, 10 January 2009

Obviously this wouldn't be possible without all of the people who have worked on previous versions, so we'd like to thank the original authors as well as the many contributors for the fine work they have put into Xinha.  In addition, many of the dozens of bugfixes in this release are thanks to user-contributed reports and patches. This release wouldn't be possible without the support of the greater Xinha community, and we thank everyone who has reported bugs and requested new features.

The Xinha team welcomes two new core contributors: Douglas Mayle and Nicholas Bergson-Shilcock. In addition, Xinha received an entirely different type of contribution, work performed by the The Open Planning Project's design team.  They've been improving user interactions with Xinha, cleaning up markup, and reworking the graphic design.  We've barely touched the surface of what is possible, and we really look forward to what they can bring to Xinha.

One of the biggest user-visible changes that arrives in this release is a change to the default icon set.  Thanks to new support for multiple icon sets, Xinha now ships with the CC-`ShareAlike`-licensed Tango icon set, providing a look familiar to most users of open source software. In addition, we've included the LGPL-licensed Crystal icon set for a slightly different look. If you would like it more conservative, the original icons are also included.

The Xinha dialog system has also undergone a complete overhaul.  While Xinha still supports popup dialogs for legacy plugins, the majority of active plugins have been ported over to a new in-page modal dialog system.

The final major user-visible change is the new storage system.  Xinha has long had support for rich insertion and link management.  Tight coupling with its PHP backend, however, meant that that integration into other platforms or non-PHP environments required custom development.  The new storage system has been designed to simplify this process.  Users who depend on the image editing capabilities of the previous plugin may want to wait until the next release, as that feature has not yet been ported to the new infrastructure.

As of this release, Xinha continues to ship a PHP backend, as well as a new local storage solution based on Google Gears.  We chose to go with Google Gears instead of cookie-based storage or HTML5 local storage because of support for cross-domain storage.  This means that users of Xinha will be able to take their templates, drafts, and final documents to any domain where they use Xinha.  New developments in HTML5 cross domain workers means that a future release should be able to provide the same functionality without requiring a Gears install.  In the meantime, however, we've even added beta support for user configuration.  Using the new hooks, users are able to load existing plugins or write custom code that will follow them anywhere they use Xinha on the web.

The Phoenix release brings with it some changes to the development process.  We're excited about ramping up to the 1.0 release, and in order to concentrate on this goal, we've decided to end support for certain plugins.  Because of Xinha's long history of user contribution, we currently maintain plugins that date back to the project's original creation.  Some of this work is no longer used, or relevant to today's users. Any plugins moved to the unsupported list will continue to work in this release (if they were previously in a working state), but have not received any updates to match the modernized code base.  Without further feedback from the user community, these plugins will be removed from a future release. If you're the user of an end-of-life plugin, please be sure to contact us in the in IRC channel ([irc://irc.freenode.net/#xinha #xinha] on freenode), on the mailing list, or in the discussion forum.  We will be happy to work with users to ensure support or migration off of old plugins.

A detailed changelog can be found at ReleaseNotes.  The files can be found at DownloadsPage.

----
Xinha is the community-built open source online HTML editor. It is developed by an active and growing community of professionals dedicated to building a robust and powerful editor that will delight users. Bug reports, features requests, patches, and new contributors are always welcome. For more information, see the project homepage at http://www.xinha.org.

Contributor links:
  * Raimund Meyer http://x-webservice.net
  * Nicholas Bergson-Shilcock http://www.nicholasbs.net
  * Douglas Mayle http://douglas.mayle.org
  * Andrew Cochran http://topp.openplans.org/about/team/#andy-cochran
  * Chris Patterson http://topp.openplans.org/about/team/#chris-patterson
  * Philip Ashlock http://philaestheta.com/portfolio/

