# Plugin: InsertSnippet2 

Provide functionality to insert snippets of HTML (or any other text, such as variable substitutions), with XML structure defining snippets.


[Back to Plugins]({{ site.baseurl }}/Plugins.html)

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/NewbieGuide#ProvideSomeConfiguration.html) for how to set configuration values in general, the below configuration options are available for this plugin.**


  xinha_config.InsertSnippet2.snippets = '/url/path/to/snippets.xml';::
    The URL path to an XML file which defines snippets.


### Example snippets.xml file

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE snXML PUBLIC "Xinha InsertSnippet Data File" "http://x-webservice.net/res/snXML.dtd">
<snXML>
    <categories>
        <c n="Test Category 1"/>
        <c n="Test Category 2"/>
        <c n="Test Category 3"/>
    </categories>
    <snippets>
        <s n="Box 1" v="{$Snippet_Test_0}" c="Test Category 1">
            <![CDATA[
              <div class="message_box red">
                 Visit the <a href="http://xinha.org">Xinha website</a>
              </div>            </li><li> Nulla placerat nunc ut pede.                 </li><li> Vivamus ultrices mi sit amet urna.           </li><li> Quisque sed augue quis nunc laoreet volutpat.</li><li> Nunc sit amet metus in tortor semper mattis. </li></ul>
            ]]>
        </s>
        <s n="INFORMATION ABOUT SOMETHING" v="{$Snippet_Test_1}" c="Test Category 3">
               &lt;p&gt;This is some information about something&lt;/p&gt;
        </s>
        <s n="Menu" c="Test Category 2">
            <![CDATA[
              <ul class="navi_links">
                 <li class="navi">
                      <a href="Link1" class="Link1" tabindex="1"><span class="span_class"> Link1 </span></a>
                 </li>
              </ul>
            ]]>
        </s>
    </snippets>
</snXML>
```

Obviously you can generate this file manually, or dynamically by whatever processes you desire, just specify the path to it in the configuration.

  categories::
    An optional list of the categories to organise the snippets.

  <c n="...">::
    The name of the category.

  snippets::
    A list of each snippet (`<s>...</s>`), note that the contents of the snippet is not XML so we use CDATA or entisation to insert into the XML.
    
  <s n="...">::
      The name of the snippet to display in the dialog.

  <s c="...">::
      The category to place this snippet into.

  <s v="...">::
      If supplied, this will be inserted instead of the snippet itself.  In other words the snippet becomes an "example of what this variable might look like" for the user, but the variable reference itself (v) is inserted.

Don't ask me why the XML has one letter element and attribute names, historical? -- gogo
