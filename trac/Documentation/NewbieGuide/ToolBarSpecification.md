# Specifying The Toolbar

Xinha's toolbar, the buttons and drop-downs, can be configured.

## Simple Pre-Defined Selections

When using `XinhaEasy.js` there are a few simple pre-defined toolbars you can use.

  xinha_toolbar: 'minimal'::
    Just the most common options, without font selections.

  xinha_toolbar: 'minimal+fonts'::
    Minimal options, plus font selections.

  xinha_toolbar: 'supermini'::
    A really minimal toolbar, only bold, italic, underline, strikethrough and superscript.  Suitable for really basic comment editing.

  xinha_toolbar: 'default'::
    The default toolbar.

## Just Hide Some !Buttons/Drop Downs

If you want one of the above (or default) toolbars, but want to hide some button(s) in it, you can do this in the config...

```
  xinha_config.hideSomeButtons(" fontname fontsize textindicator ");
```

which would remove the font name and size drop downs, and the text indicator item (shows fore/background colour).

## Full Configuration

If you wish you can specify the toolbar in full, here is the default...

```

  xinha_toolbar: 
  [
    ["popupeditor"],
    ["separator","formatblock","fontname","fontsize","bold","italic","underline","strikethrough"],
    ["separator","forecolor","hilitecolor","textindicator"],
    ["separator","subscript","superscript"],
    ["linebreak","separator","justifyleft","justifycenter","justifyright","justifyfull"],
    ["separator","insertorderedlist","insertunorderedlist","outdent","indent"],
    ["separator","inserthorizontalrule","createlink","insertimage","inserttable"],
    ["linebreak","separator","undo","redo","selectall","print"], (Xinha.is_gecko ? [] : ["cut","copy","paste","overwrite"]),
    ["separator","killword","clearfonts","removeformat","toggleborders","splitblock","lefttoright", "righttoleft"],
    ["separator","htmlmode","showhelp","about"]
  ];

```

as you can see it is made up of a 2 dimensional array.  Each subarray can be regarded as a logical "grouping" of "things".  

Each "thing" is either:

  'separator'::
    A separator colon or other type of indication will be inserted in the toolbar.

  'linebreak'::
    This is where a linebreak may occur (also see flowToolbars [Config Option]({{ site.baseurl }}/ConfigurationOptions.html)).

  'buttonname'::
    The name of a button to display in this location.

  'dropdownname'::
    The name of a drop down menu to display in this location.

Note that plugins may also insert themselves into toolbars after you have configured them, presently you should consult the source code of the plugin to determine this (or just try it).

## Adding Custom Buttons

To add a custom button to the toolbar, first you must register the button, then you can add it to your toolbar somewhere.  This can be done in the xinha_config section of loading Xinha (see NewbieGuide).

```

 xinha_config.registerButton({
       id       : "my-hilite",      // the ID of your button
       tooltip  : "Hilite text",    // the tooltip
       image    : "my-hilite.gif",  // image to be displayed in the toolbar
       textMode : false,            // disabled in text mode
       action   : function(editor) { // called when the button is clicked
                    editor.surroundHTML('<span class="hilite">', '</span>');
                  },
       context  : "p" or [ "p", "h1" ]  // will be disabled if outside a <p> element (in array case, <p> or <h1>)
     });

  xinha_config.toolbar.push(['my-hilite']);

```



