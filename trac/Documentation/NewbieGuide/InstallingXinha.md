{% include nav.html %}

# Installing Xinha

* TOC
{:toc}


Starting with Version 1.5 Xinha can be used in 3 ways, either in the traditional "local" way where Xinha is on your own server, in an external (eg "content delivery network") way where Xinha is run on an external server only, and in a hybrid way where Xinha's core and standard plugins is on an external server while special plugins are on your local server.

The choice is yours.

## Run from External Server (CDN) without needing the PHP plugins

If you do not need the PHP backend requiring plugins (primarily, [MootoolsFileManager]({{ site.baseurl }}/trac/Documentation/Plugins/MootoolsFileManager.html) and [Linker]({{ site.baseurl }}/trac/Documentation/Plugins/Linker.html) plugins) then you can run Xinha from an external server (or content delivery network), such as Xinha's s3 bucket.  This is as shown in the NewbieGuide.  No installation is necessary.


```
 <script type="text/javascript" src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js"></script>
```


## Run from the Local Server (Full Local Install)

[Download the Full Distribution]({{ site.baseurl }}/trac/DownloadXinha.html) and unzip it, place it somewhere on your server.

Now instead of pointing to the S3 url as the Newbie Guide shows, point at your "local" one...


```
 <script type="text/javascript" src="/path/to/Xinha/XinhaEasy.js"></script>
```


everything else is the same, you just change that one src="" path and you are done.

Remember to check permissions and so forth, open your browser's console and look for HTTP errors.


## Run from External Server (CDN) but also use some local PHP plugins (Partial Local Install)

[Download the CDN Distribution]({{ site.baseurl }}/trac/DownloadXinha.html) and unzip it, place it somewhere on your server.

The CDN distribution just contains examples, some "contrib" php and plugins which must be run locally on your own server.

Load Xinha as you would for the CDN but when it comes to loading those special plugins, tell Xinha where they are.


```
   <script src="//s3-us-west-1.amazonaws.com/xinha/xinha-latest/XinhaEasy.js" type="text/javascript">
    
    xinha_options = 
    {
      xinha_plugins:  [ 
         'minimal', 
         { from: '/path/to/xinha-cdn/plugins', load: ['MootoolsFileManager', 'Linker'] }
      ],
      
      // This is where you set the other default configuration globally
      xinha_config:            function(xinha_config) 
      {
        
        // Configure the plugins as you normally would here (consult plugin documentation)
        
      }
    }

  </script>
```





