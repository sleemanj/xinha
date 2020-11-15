# Plugin: ListOperations 

Provides some additional features for working with lists in Xinha.

[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide#ProvideSomeConfiguration.html) for how to set configuration values in general, the below configuration options are available for this plugin.**

 
 
 At present the only feature is
 
```
   xinha_config.ListOperations.tabToIndent = [true | 'atstart' | false];
```
 
 which causes pressig tab ina list to indent (or shift-tab to detent) to 
 a new list level
 
 Note that the HTML structure of this list may be, for example
```
   <ul>
     <li>Item 1</li>
     <ul>
       <li>Item 1.1</li>
     </ul>
     <li>Item 2</li>
   </ul>
```
