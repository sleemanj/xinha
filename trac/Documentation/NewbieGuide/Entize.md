# Entize Your Data

When you put HTML into a textarea to be turned into a Xinha editor, many people forget that raw HTML in a textarea is not valid, this leads to all sorts of unusual symptoms.

The TEXTAREA tag accepts #PCDATA, that means its plain character data which can include entities for the special characters, you should not put raw HTML into the textarea, while some browsers will allow you to get away with most raw HTML, it will break at some point.

## The Wrong Way

This is the wrong way, you will see that the HTML to be edited has been put into the textarea without any entitization, i.e the raw html has been inserted.

```
  <textarea name="MyXinha">
    <h1>G'Day &amp; Welcome</h1>
    <a href="http://www.example.com/">Hello World</a>
  </textarea>
```

## The Right Way

This is the right way, the HTML to be edited has been entized before it was put into the textarea, < is now &lt; > is &gt; and " is &quot; and & is &amp;

```
  <textarea name="MyXinha">
    &lt;H1&gt;G'Day &amp;amp; Welcome&lt;/h1&gt;
    &lt;a href=&quot;http://www.example.com/&quot;&gt;Hello World&lt;/a&gt;
  </textarea>
```

## Language Specific Methods

### PHP
Use the PHP function htmlspecialchars(), eg 
```
  <textarea><?php echo htmlspecialchars($HtmlToEdit) ?></textarea>
```

### Coldfusion
Use the function HTMLEditFormat(), eg
```
  <textarea><CFOUTPUT>#HTMLEditFormat(HtmlToEdit)#</CFOUTPUT></textarea>
```
