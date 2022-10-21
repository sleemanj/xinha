{% include nav.html %}

# Plugin: WysiwygWrap 

The purpose of this plugin is to wrap the content being edited in Xinha with certain elements of given ID and/or class when in the WYSIWYG view.

[Back to Plugins]({{ site.baseurl }}/trac/Documentation/Plugins.html)

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide.html#ProvideSomeConfiguration) for how to set configuration values in general, the below configuration options are available for this plugin.**



```
xinha_config.WysiwygWrap =
{
  'elements' : [ 'div.className#fooid', 'ul', 'li' ]
};
```


will cause the xinha content to be wrapped with 

```
  <div id="fooid" class="className">
   <ul>
     <li>
        ## EDITABLE CONTENT HERE ##
     </li>
   </ul>
  </div>
```


this wrapping will NOT be passed back to your server, you will only get the editable content itself, and you should not pass the wrapping into Xinha either, Xinha adds it and removes it as you go into and out of it.