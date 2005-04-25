2005-04-15 
                    
              Xinha Unified Backend Branch 
                    Development Info

by: Yermo Lamers of DTLink Software
http://www.formvista.com

----------------------------------------------------------
             Configure.php
----------------------------------------------------------

To avoid hard coding paths, I've hacked together a small 
Configure.php system which will generate various scripts 
and set directory permissions based on conf files in ./conf.

Configure.php must be called from the command line using the 
full path to command line PHP. This script must be run first 
before any other development scripts can be run.

----------------------------------------------------------
             Dev Environment Scripts
----------------------------------------------------------

These scripts assume the availability command line PHP and Perl.

These script have not been tested under Windows. If there is sufficient 
interest, I can make them portable to Windows.

The devutil scripts are located on ./devutils and they include:

svn_commit.php

  preprocessor to "svn commit" command that updates the 
  popups/about.html file so that it always includes the current
  revision info.

  Requires command line "svn" command to be in $PATH

buildruntime.php: - not done

  generates a "runtime" version of xinha_ub with all comments
  and debug trace messages stripped out. It also does
  in-line text replacement for some specific tags.

ddtpreproc.php

  Javascript does not seem to have a version of PHP's 
  __LINE__ and __FILE__ constants so there is no clean way of
  including file and line numbers in ddt trace messages; at least
  none that I've been able to find. This script preprocesses the
  javascript source files to patch in file and line numbers to
  every _ddt() call.

  If you are working on the source files and add or delete lines just
  rerun the ddtpreproc.php script from the xinha_ub root directory. It
  will recurse through all the .js files in the directory tree.

makedocs.pl

  Calls JSDoc with some arguments to generate the class documentation
  from the source javascript files. Requires Perl, JSDoc and PHPDoc
  to run. 
  
  NOTE: Under RedHat 9, JSDoc will cause perl to dump core when running 
  on htmlarea.js. Upgrading Perl to 5.8.6(from source) fixed the 
  problem for me).

IMPORTANT: 

      DO NOT FIELD THESE SCRIPTS ON A LIVE SITE.

I have added "deny from all" .htaccess files and each scripts
checks it's environment in an attempt to avoid being run from
a webserver. 

If you are not running Apache or aren't permitted to do overrides
in .htaccess, you may want to move the ./devutils directory 
somewhere outside of DOCUMENT_ROOT.

----------------------------------------------------------
             Code Re-Org
----------------------------------------------------------

In an attempt to make the codebase more manageable I've 
reorganized htmlarea.js to group related items together.

The file is now broken into five sections:

1. Initial Setup
2. HTMLArea.Config Class
3. HTMLArea class methods
4. HTMLArea Class
5. Misc Support overrides and functions

----------------------------------------------------------
               JSDoc and PHPDoc.
----------------------------------------------------------

I found a perl script that implements a JavaDoc style system
for JavaScript. See http://jsdoc.sourceforge.net/. 

JSDoc is very sensitive to the order of tags in the headers. 
If you try to add doc headers and they are not showing up 
correctly compare with the test.js file distributed with JSDoc.

JSDoc seems to lack the ability to link to the actual source
code definition of a given class or method.

I've added JSDoc headers to just about everything I've touched. 

For the PHP scripts that I touch, I'm adding PHPDoc headers.

There is a ./utils/makedocs.pl shell script.

----------------------------------------------------------
             Debugging Trace Messages
----------------------------------------------------------

To further make my life easier and come up to speed, I've added 
trace messages to virtually every method using a contributed version 
of my DDT debug-trace-message-to-popup window class. 

You will need to turn off any popup blockers in order to see the debugging
trace messages. 

These messages can be turned on and off on a per-class basis using the ddtOn() method. 
(See examples/simple_example.html)

What's nice is you can quickly get a feel for the order in which things happen
and which methods are invoked for what events.

The concept is to do development on the trace enabled version of the code and then
generate a stripped "runtime" version using the provided ./utils/make_runtime.sh
script. make_runtime strips all debugging code out of the .js files. It also removes
almost all comments to reduce file size. I am envisioning having two distributions
of Xinha .. a development version with all debugging intact and a runtime version
that has been stripped. (this has served me extremely well in formVista development)

It's important to note that each domain Xinha is run on will open it's own
debugging trace window. (for instance, if you are working on two copies on different
servers they will not be able to share a single debugging window. This is because
a script in one domain cannot write into a window opened by another domain).

You should be aware that Xinha intecepts some events on reload or page change
which means that there are debugging messages that are output by the currently
loaded script on the page when you click reload or change pages. (This took me
a while to track down). Often times I would close the trace window and then
do a reload noticing exceptions listed in the javascript console. Took forever
to figure out these exceptions were not being generated by the new page but 
instead by the old page. See DDT.prototype._ddt() in ddt.js for more insights.

----------------------------------------------------------
                      Coding Style
----------------------------------------------------------

The original coding style guidelines included in the code were:

---------------------------------------------------
 Developers - Xinha main branch Coding Style by Gogo:

    For the sake of not committing needlessly conflicting changes,

   - New code to be indented with 2 spaces ("soft tab").
   - New code preferably uses BSD-Style Bracing
     if(foo)
     {
        bar();
     }

   Don't change brace styles unless you're working on the non BSD-Style
    area (so we don't get spurious changes in line numbering).

   Don't change indentation unless you're working on the badly indented
    area (so we don't get spurious changes of large blocks of code).

   Jedit is the recommended editor, a comment of this format should be
   included in the top 10 lines of the file (see the embedded edit mode)
---------------------------------------------------

Unfortunately, given the endless nested "using dynamic function 
definitions as method arguments" the BSD bracing style makes the code 
impossible to read, IHMO. 

To make my life easier I've gone through and changed the style to:

if (foo)
  {
  bar();
  }

So if you have a function definition as an argument as in:

class.method( "foo", 
  function()
    {
    return bar;
    });

Which to my eye is alot easier to follow and less error prone.

I tried Jedit. I can't stand Java apps and the editor is simply too
slow. I use CRISP which unfortunately has some serious issues with 
tab to space conversions. 
