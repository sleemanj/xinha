{% include nav.html %}

# Plugin: Linker

[Back to Plugins]({{ site.baseurl }}/trac/Documentation/Plugins.html)

The Linker plugin provides an enhanced link dialog for inserting/modifing links to files, mailto: links to email addresses, or links to anchors in the current page. The plugin when registered with an editor replaces the editors default createlink button.

Linker plugin displays a Tree where the user can select the file he wants to link.
Currently there are three methods for filling this tree:

### 1. using the provided backend scanner
By default Linker provides a tree listing files under the xinha directory itself, not that useful generally so if you wish to control scan.php it can be configured similarly to ImageManager ...

```
  with(xinha_config.Linker)
  {
    <?php 
      require_once('/path/to/xinha/contrib/php-xinha.php');
      xinha_pass_to_php_backend
      (
         array(
          'dir' => '/path/to/base/dir',
          'include' => '/\.(php|shtml|html|htm|shtm|cgi|txt|doc|pdf|rtf|xls|csv)$/',  // REGEXP or empty
          'exclude' => '', // REGEXP or empty
          'dirinclude' => '', // REGEXP  or empty
          'direxclude' => '/(^|\/)[._]|htmlarea/' // REGEXP or empty
         ) 
      );
    ?>
  }
```


### 2. Write your own scan.php


```
xinha_config.Linker.backend = '/url/to/your/scan.php';
```



scan.php should return code like this one:

```
// <<node-list>> = [ <<node>, <<node>>, ...]  
// <<node>> = one of the following four types
// 1. "a.html" -- URL without children or title
// 2. ["a.html", <<node-list>>] -- URL without title but with children
// 3. {url:"a.html",title:"A URL"} -- URL with title
// 4. {url:"a.html",title:"A File",children:<<node-list>>} -- URL with title, and children
[
  "e.html",                        
  ['f.html', ['g.html','h.html']], 
  {url:'i.html',title:'I Html'},   
  {url:'j.html',title:'J Html', children:[{url:'k.html',name:"K Html"},'l.html',['m.html',['n.html']]]} 
]
```


Type 3 and 4 nodes would be the preference, I'd go so far as to deprecate type 1 and 2.

### 3. using configuration-variables

```
xinha_config.Linker.backend = null;
xinha_config.Linker.files = [
                               "e.html",                        
                               ['f.html', ['g.html','h.html']], 
                               {url:'i.html',title:'I Html'},   
                               {url:'j.html',title:'J Html', children:[{url:'k.html',name:"K Html"},'l.html',['m.html',['n.html']]]} 
                             ];
```


This plugin incorporates the dTree javascript tree widget by [Geir Landr](http://www.destroydrop.com/javascript/tree/).  dTree has been slightly modified to improve performance.

The Linker plugin was developed by [James Sleeman](http://code.gogo.co.nz/).
