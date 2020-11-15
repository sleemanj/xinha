There are a number of plugins in Xinha that are very old. Some are no longer used, some are deprecated, and some are even broken. 

As of Xinha 0.96, we have moved these to an "unsupported_plugins".  Plugins are still found and loaded from that directory.

By doing this, we can phase out old and broken code without any performance impact to users who don't use the plugins, and without any functionality loss if there are users who do.

If you are using an unsupported plugin, please check this list to see if there is a supported plugin that replaces it.

See #1297 for the original proposal.

If you want to fix a broken plugin and start supporting it, please [/ticket/new?keyword=unsupported_plugin file a new ticket] to suggest your changes.

## Unsupported Plugins: 1.5

||'''Plugin'''||'''Reason'''||'''Reference'''||
||ExtendedFileManager||Possibly insecure.  Use MootoolsFileManager instead.||||
||ImageManager||Possibly insecure.  Use MootoolsFileManager instead.||||
||PersistentStorage||Unmaintained, maybe unfinished, not even really totally sure what it was supposed to do.||||
||PSLocal||Unmaintained, maybe unfinished, not even really totally sure what it was supposed to do.||||
||PSServer||Unmaintained, maybe unfinished, not even really totally sure what it was supposed to do.||||
||SpellChecker||Unmaintained.  *Good* browsers provide spell-checking themselves anyway.||||
||UnFormat||Use SuperClean instead.||||


## Unsupported Plugins: 0.96

||'''Plugin'''||'''Reason'''||'''Reference'''||
||Template||totally unconfigurable and thus unusable for anything || #1297 ||
||InsertPicture|| possibly broken; possibly insecure.  Use ImageManager instead. || #1297 ||
||Filter||broken, use SuperClean instead || #1297 ||
||HtmlTidy||use SuperClean instead || #1297 ||
||InsertMarquee||we cannot have a plugin for any outdated HTML stuff|| #1297||
||BackgroundImage||we cannot have a plugin for any outdated HTML stuff||#1297||
||ClientsideSpellcheck||implements support for some (probably old) third-party, proprietary, IE-only spellcheck engine||#1297||
||NoteServer||Broken, and so I doubt it has any users||#1297||

## Unsupported Plugins: trunk

||'''Plugin'''||'''Reason'''||'''Reference'''||
||DoubleClick||the functionality is now in core; use `xinha_config.dblclickList` instead.  (if you do nothing, you will get the same features as `DoubleClick` -- its configuration is the default)||#1555||
