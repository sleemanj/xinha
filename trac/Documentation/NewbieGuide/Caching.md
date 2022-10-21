{% include nav.html %}

# Caching Xinha

Xinha use involves the browser loading a fairly large number of files from the web server, it is in your interest to assist the browser in not requesting these seldom changed files.

If you are running Xinha from your own server (rather than an external server, CDN etc) then you may need to tell your server to tell the browser not to check the files for changes so often.  For Apache users, a set of caching directives like this in a `.htaccess` file (eg `/path/to/xinha/.htaccess`) is a good idea...


```
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/gif        "access plus 24 hour"
  ExpiresByType image/jpg        "access plus 24 hour"
  ExpiresByType image/jpeg       "access plus 24 hour"
  ExpiresByType image/png        "access plus 24 hour"
  ExpiresByType application/javascript       "access plus 24 hour"
  ExpiresByType text/css         "access plus 24 hour"
  ExpiresByType application/xml  "access plus 24 hour"
</IfModule>
```


If course you can make the time longer, or shorter, the point is your Xinha files are unlikely to change any time soon so you might as well make it cache for a long time.

## Cache Busting

It is recommended to install your Xinha in a directory which has the version number as part of the name, for example instead of using the directory name `xinha` (as in `/xinha/XinhaCore.js` ) use the directory name `xinha-1.5.4` (as in `/xinha-1.5.4/XinhaCore.js`), this was the length of caching is not an issue for you, or put another way "cache busting" becomes automatic.  

Same goes when using from a CDN, or Xinha's s3 bucket, if you use the specific version ( eg `https://s3-us-west-1.amazonaws.com/xinha/xinha-1.5.4/XinhaEasy.js`) then cache busting becomes a non-issue.