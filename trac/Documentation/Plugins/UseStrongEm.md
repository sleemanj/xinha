{% include nav.html %}

# Plugin: `UseStrongEm` 

[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

 Improves handling of the bold and italic buttons to insert more consistently `<strong>` and `<em>` tags, while also preserving existing `<i>` and `<b>`.


## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide.html#ProvideSomeConfiguration) for how to set configuration values in general, the below configuration options are available for this plugin.**



```

  xinha_config.UseStrongEm = 
  {
    useEm         : true,
    useStrong     : true,
    twoStageStrong: true
  }

```


  useEm
  :    When you hit italic button, insert an <em> tag.  Hitting italic on an already italic text should unitalic.
  useStrong
  :    When you hit the bold button, insert a <strong> tag.  
  twoStageStrong
  :    Hit bold on non-bold text should bold (<strong).  Hitting bold on an already bold text should double-bold (<strong><strong>...).  Hitting bold on a double bold text should unbold.  This is how Firefox generally works without `UseStrongEm` plugin, and generally works quite well with modern website designs.


