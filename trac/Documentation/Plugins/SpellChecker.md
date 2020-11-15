# Plugin: SpellChecker

[Back To Plugins]({{ site.baseurl }}/trac/Plugins.html)

The SpellChecker plugin included with Xinha was originally developed for htmlArea by Mihai Bazon with sponsorship by the [American Bible Society](http://www.americanbible.org/) and released under the [htmlArea Licence]({{ site.baseurl }}/trac/XinhaLicence.html).

The SpellChecker works by calling the [aspell](http://aspell.sourceforge.net/) utility on the webserver using either a php, or perl backend.  The perl backend is as orignally written by Mihai, the PHP backend was originally written by  Htmlarea.com forums user [steveguk](http://www.htmlarea.com/forum/htmlArea_3_(beta)_C4/htmlArea_v3.0_-_Add-Ons_F23/SearchAndReplace_Plugin_1.0b2_New_version%21%21%21_P33924/gforum.cgi?username=steveguk;t=search_engine).

'''Using the PHP backend is the default, and recommended, the PERL backend is not currently maintained.'''

## aSpell

If your webserver does not have a recent version of aSpell installed you will have problems due to unicode characters (typically in utf8 encoding) not being "understood" by aspell (aspell doesn't support Unicode at all really, but later versions won't do quite such strange things).

### Precompiled Version

Because getting aspell updated on servers can be a bit of a pain, you can download a ready-compiled aspell version here, just extract this into your SpellChecker plugin directory (all the files will be in SpellChecker/aspell), this compiled version is only suitable for x86 Linux machines.

As long as you are using the PHP backend for SpellChecker (default) then it will pickup the presence of the local aspell and use that instead of any other version installed on the server.
