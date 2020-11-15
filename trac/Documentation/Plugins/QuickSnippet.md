# Plugin: `QuickSnippet` 

[Back to Plugins]({{ site.baseurl }}/Plugins.html)

 
  Provides a drop-down menu which you can populate with snippets that the user can select from to insert into the document.

  Snippets are context sensitive based on CSS selectors, for example you can create a snippet which can only be inserted into a `<ul class="fancy-list">`, or a snippet that can only be inserted in elements matching "body,td,div" or any other (jQuery compatible) CSS selectors.

  Snippets can be provided by an external file, or directly in the configuration.

  [InsertSnippet2]({{ site.baseurl }}/Documentation/Plugins/InsertSnippet2.html) xml files are compatible, if you already use `InsertSnippet2` just remove that from your plugins list and load `QuickSnippet` instead and it will use the `InsertSnippet2` configuration.

  ## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/NewbieGuide#ProvideSomeConfiguration.html) for how to set configuration values in general, the below configuration options are available for this plugin.**

Snippets can be provided in three ways, firstly directly in the configuration

```

  xinha_config.QuickSnippet.snippets    = [

      {
          'name'  : 'New Paragraph (Lorem Ipsum)',
          'parent': 'body,td,th,div',
          'html'  : '<p>Vivamus sed porta leo. Donec sed arcu ante. Morbi vel lectus sit amet ante faucibus varius. Donec sapien massa, mollis nec sem a, volutpat molestie ipsum. Sed blandit turpis sed orci gravida maximus. Donec fringilla luctus ornare. Cras vel urna vulputate, tristique nulla ac, finibus velit. Sed lobortis mollis hendrerit. Morbi vehicula blandit maximus. Curabitur turpis nunc, ornare quis risus sed, consectetur molestie quam.</p>',
      },

      {
          'name'  : 'List Item',
          'parent': 'ul',
          'html'  : '<li>Hello World</li>',
      },

      {
          'name'  : 'Email Link',
          'parent': null,
          'html'  : '<a href="mailto:joe@example.com">Hello Joe</a>',
      }

    ];

```

You can see that this is an array of objects each object representing a snippet.  Each snippet has a name, an optional parent an the html associated.  The parent of a snippet is a jQuery compatible CSS selector (or selectors comma separated as usual), the snippet can only be inserted into something that matches this selector(s), if the insertion point (caret, cursor) is not in one of these (or child of) then the snippet is not available.

The second way is to provide the URL to a snippet file...

```

  xinha_config.QuickSnippet.snippetfile = '/path/to/snippets.js';

```

the file contents is in just the same format...

```
    [

      {
          'name'  : 'New Paragraph (Lorem Ipsum)',
          'parent': 'body,td,th,div',
          'html'  : '<p>Vivamus sed porta leo. Donec sed arcu ante. Morbi vel lectus sit amet ante faucibus varius. Donec sapien massa, mollis nec sem a, volutpat molestie ipsum. Sed blandit turpis sed orci gravida maximus. Donec fringilla luctus ornare. Cras vel urna vulputate, tristique nulla ac, finibus velit. Sed lobortis mollis hendrerit. Morbi vehicula blandit maximus. Curabitur turpis nunc, ornare quis risus sed, consectetur molestie quam.</p>',
      },

      {
          'name'  : 'List Item',
          'parent': 'ul',
          'html'  : '<li>Hello World</li>',
      },

      {
          'name'  : 'Email Link',
          'parent': null,
          'html'  : '<a href="mailto:joe@example.com">Hello Joe</a>',
      }

    ]
```

The third way is to use InsertSnippet2 compatible files, in which case provide the configuration thusly...

```

    xinha_config.InsertSnippet2.snippets = '/path/to/snippets.xml';

```

consult [InsertSnippet2]({{ site.baseurl }}/Documentation/Plugins/InsertSnippet2.html) for details on that XML format.

