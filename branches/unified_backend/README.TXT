
Xinha Unified Backend Branch.

by: Yermo Lamers http://www.formvista.com/contact.html

The Unified Backend Branch code has been released under the same terms
as HTMLAREA itself. For license information please see license.txt.

If you have any questions or comments about this branch of Xinha development
please post to the Xinha forums or you can use the contact form above.

------------------------------------------------------------------------------

This version of Xinha is known as the unified backend branch. The main difference
between it and standard Xinha is that all client to server communications
will be routed through a single backend script. This should make integration of Xinha
into mod_rewrite environments much easier and less error prone.

In part because I am new both to this kind of Javascript development and Xinha itself, 
I've reorganized Xinha to make the code easier for me to understand. htmlarea.js
has been extensively edited (hacked and/or broken beyond repair depending on your
point of view). 

JavaDoc style headers have been added to all methods in addition to extensive 
debugging trace messages.

A number of scripts have been being added to make the codebase more manageable. 
See the README_DEVELOPERS.txt for more information.

For more information see:

  INSTALL.txt
  README_DEVELOPERS.txt
  index.html
  docs/index.html

As of 2005-04-15 this is a development snapshot.
