# Core Configuration Options

The following options can be specified to control the core features of Xinha.

** See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide#ProvideSomeConfiguration.html) for how to set configuration values in general. **


  width::
    Set the width of the editor, allowed values 'auto', 'toolbar' or a CSS length specification (`123px`).

  height::
    Set the height of the editor, allowed values 'auto' or a CSS length specification (`123px`).

  resizableEditor::
    Boolean.  Allow the user to drag-resize the editor.  This only works reliably in Chrome, other browsers have various issues. 

  sizeIncludesBars::
    Boolean.  include the toolbars in the size specified.  Default true.

  sizeIncludesPanels::
    Boolean.  Include the panels in the size specified.  Default true.

  panelDimensions::
    Object.  Specify the panel dimensions for left/right/top/bottom, pixel widths only.
```
  xinha_config.panel_dimensions =
  {
    left:   '200px', // Width
    right:  '200px',
    top:    '100px', // Height
    bottom: '100px'
  };
```

  iframeWidth::
     Integer.  If you want the iframe to be narrower than toolbar, set this to a number of pixels.  Eg if you are editing a very narrow column of text and want to maintain that narrowness in the editor.

  statusBar::
     Boolean.  Enable the status bar at the bottom of the editor.  Default true.

  htmlareaPaste::
    Boolean. Intercept CTRL-V and do paste through Xinha's processes.  This probably doesn't work at least in Gecko.  Default false.

  mozParaHandler::
    String 'built-in' or 'best'.  For browsers that use Xinha's Gecko engine (primarily, Firefox and IE11), determine how the return key is handled.  Default 'best'.

  getHtmlMethod::
    String 'DOMwalk' or 'TransformInnerHTML'.  Determines the algorithm for generating the HTML from the WYWISYG view.  'DOMwalk' may be more reliable, 'TransformInnerHTML' may be faster (but in modern times this is not so certain I suspect).  Default 'DOMwalk'.

  undoSteps::
    Integer.  Number of undos available.  Default 20.

  undoTimeout::
    Integer milliseconds.  Interval that undo snapshots are saved. Default 500.

  changeJustifyWithDirection::
    Boolean. When changing to right-to-left, select right justification.  Default false.

  fullPage::
    Boolean. If true then Xinha will retrieve the full HTML, starting with the `<HTML>` tag.  **Not well tested, see also FullPage plugin**.

  pageStyle::
    String. CSS definitions to apply to the edited document.  See also pageStyleSheets below, and [Stylist]({{ site.baseurl }}/trac/Stylist.html) plugin.
```
     xinha_config.pageStyle = '  p { color:red;  }  \n' 
                            + ' li { color:blue; }';
```
    
  pageStyleSheets::
    Array of string.  An array of external stylesheets to apply to the edited document. 
```
     xinha_config.pageStyleSheets = [ "/css/myPagesStyleSheet.css","/css/anotherOne.css" ];
```

  baseHref::
    String.  Base href to apply to relative links.  ** This is probably buggy.  You shouldn't need to use it. **

  expandRelativeUrl::
    Boolean.  Relative URLs will be made absolute.  This is usually a good thing due to browser behaviours with regard editing images etc.  Default true.

  stripBaseHref::
    Boolean.  Remove the baseHref (above if set) from urls in the edited content.  Default true (if baseHref is set).

  stripSelfNamedAnchors::
    Boolean. Remove the url part from any anchors which have ourself as an anchor. Typically a good thing (editing index.html, `index.html#top` becomes `#top`). Default true.

  only7BitPrintablesInURLs::
    Boolean.  In URLs all characters above ASCII value 127 have to be encoded using % codes.  Default true.

  sevenBitClean::
    Boolean.   If you are putting the HTML written in Xinha into an email you might want it to be 7-bit characters only.  This config option will convert all characters consuming more than 7bits into UNICODE decimal entity references (actually it will convert anything below <space> (chr 20) except cr, lf and tab and above <tilde> (~, chr 7E)). Default: false.

  
  specialReplacements::
    Object.  Display one thing in the WYSIWYG view and translate it to a different thing in the HTML view.  Potential use as showing some example text in the WYSIWYG view but using a "replacement code" in the HTML generated.  Default empty.
```
     xinha_config.specialReplacements = 
     { 
       'in_html' : 'in_wysiwyg',
       '{$Name}' : 'John Smith',
     };
```

  tabSpanClass::
    String.  When the user presses the tab key in the editor, Xinha will insert a span with this class and the below contents.  Default 'xinha-tab'

  tabSpanContents::
    String.  When the user presses the tab key, Xinha will insert a span with the above class and this contents.  Default '&nbsp;&nbsp;&nbsp;&nbsp;'.

  inwardHtml::
    Function accepting parameter `html` and returning html to use in the editor.  This is called with the contents of the textarea and the result is what is inserted into the Xinha editor for editing.  Default, null function.

```
      xinha_config.inwardHtml = function(html) { return html.replace(/how now brown cow/, 'how now yellow camel'); }
```

    Makes <textarea>how now brown cow</textarea> edit a Xinha document with the text "how now yellow camel" instead.

  outwardHtml::
    Function accepting parameter `html` and returning html to return to the textarea.  This is called before putting the edited html back into the textarea.

```
      xinha_config.inwardHtml = function(html) { return html.replace(/how now yellow camel/, 'how now brown cow'); }
```

    Makes the Xinha edited content "how now yellow camel" be written into the textarea as "how now brown cow".

  autoFocus::
    Boolean. Automatically focus and activate the Xinha editor when the page is loaded.  Not recommended for multiple editors on a page.  Default false.

  killWordOnPaste::
    Boolean.  When pasting using the toolbar paste button, automatically kill word code in the paste.  Due to browser security restrictions which prevent the toolbar paste button from being displayed, this usually is not of much use.  Default true.

  makeLinkShowsTarget::
    Boolean.  Allow setting the `target=""` attribute in the default link creation dialog.  Default true.

  charSet::
    String.  Character set to use.  Default same as the character set of the page including Xinha (not necessarily the page Xinha is editing).  It is highly recommended in the modern age to use UTF-8 character set for EVERYTHING on your website and in your database, if everything is always in UTF-8 you don't have character conversion problems.

  browserQuirksMode::
    Boolean|null.  True, render the document being edited in in quirks mode.  False, render the document being edited in standards mode.  Null (default), render the document in the same mode as the page including Xinha.

  htmlRemoveTags::
    RegExp|null.  Set to a regular expression matching tags to remove these entirely from the edited content.   Default null.
```
      xinha_config.htmlRemoveTags = /span|font/;
```
    Removes all span and font tags.

  preserveI::
    Boolean|null.  If the HTML fed into Xinha includes <i> tags, preserve these, otherwise convert them into <em> when html is retrieved.  The default, null, is that tags are not preserved unless you load the UseStrongEm plugin which means if you use the UseStrongEm plugin when you use the italic button it will insert <em> but you can include <i> in the code and they will be preserved (<i> is commonly used by designers in modern times as "icon" from a certain font).  The default is typically fine, but set to true or false if you want to override.

  preserveB::
    Boolean|null.  If the HTML fed into Xinha includes <b> tags, preserve these, otherwise convert them into <strong> when html is retrieved. The default, null, is that tags are not preserved unless you load the UseStrongEm plugin which means if you use the UseStrongEm plugin when you use the bold button it will insert <strong> but you can include <b> in the code and they will be preserved.  The default is typically fine, but set to true or false if you want to override.


  flowToolbars::
    Boolean.  Allow toolbars to flow to fit the width of the editor better.  Default true.

  toolbarAlign::
    String 'left'|'right'. Align the buttons left or right on the toolbar.  Default 'left'.

  showFontStylesInToolbar::
    Boolean.  ** Superceeded by the FancySelects plugin. **  Display the names of fonts in the font itself in the select drop down (browser support patchy, use FancySelects instead if you can).  Default false.

  showLoading::
    Boolean.  Show a panel over the textarea indicating the loading status during the booting process of Xinha.  Default false, however when using XinhaEasy.js or XinhaLoader.js this will typically be enabled anyway.

  stripScripts::
    Boolean.  Strip scripts from the HTML output - this only works with DOMwalk (see getHtmlMethod above) and is ignored if you use the PreserveScripts plugin.  Default true.

  convertUrlsToLinks::
    Boolean.  When a user types in a url in the WYSIWYG view, automatically convert it to an html link.  Default true.

  hideObjectsBehindDialogs::
    Boolean.  Set to true to hide media objects when a div-type dialog box is open, to prevent show-through.  Default false. This probably isn't all that relevant in the modern age since object elements are seldom used.

  colorPickerCellSize::
    CSS length element.  Size of each cell in the colour picker.  Default 6px

  colorPickerGranularity::
    Integer.  Set to a higher number to allow more precise colours to be picked.  Default 18.

  colorPickerPosition::
    String.  Set the position of the colour picker relative to it's button, a strig consisting of two words from  top, bottom, left and right separated by a comma.  Default 'bottom,right'.

  colorPickerWebSafe::
    Boolean.  Restrict colours to the 256 "web safe" colours.  In the modern age, this is pretty redundant. Default false.

  colorPickerSaveColors::
    Integer.  Number of recent colours to remember.  Default 20.

  fullScreen::
    Boolean.  Start the editor in full screen mode.  Default false.

  fullScreenMargins::
    Array [top, right, bottom, left ].  The margins in pixels to set when the editor is expanded to full screen.  Default [0,0,0,0]

  fullScreenSizeDownMethod::
    String 'initSize'|'restore'.  When you exit full screen mode, will Xinha go back to the initial size, or the last size it was.  Default 'initSize'

  toolbar::
    Multi Dimensional Array.  See ToolBarSpecification

  fontname::
    Object.  The font families to provide in the drop-down select.
```
xinha_config.fontname = 
  {
    "&#8212; font &#8212;": "", // &#8212; is mdash
    "Arial"           :	'arial,helvetica,sans-serif',
    "Courier New"     :	'courier new,courier,monospace',
    "Georgia"         :	'georgia,times new roman,times,serif',
    "Tahoma"          :	'tahoma,arial,helvetica,sans-serif',
    "Times New Roman" : 'times new roman,times,serif',
    "Verdana"         :	'verdana,arial,helvetica,sans-serif',
    "Impact"          :	'impact',
    "WingDings"       : 'wingdings' 
  }
```

  fontsize::
    Object.  The font sizes to provide in the drop down select.
```
xinha_config.fontsize =
  {
    "&#8212; size &#8212;": "", // &#8212; is mdash
    "1 (8 pt)" : "1",
    "2 (10 pt)": "2",
    "3 (12 pt)": "3",
    "4 (14 pt)": "4",
    "5 (18 pt)": "5",
    "6 (24 pt)": "6",
    "7 (36 pt)": "7"
  };
```

  formatblock::
    Object.  The different block format types to provide in the drop down select.
```
xinha_config.formatblock = {
    "&#8212; format &#8212;": "", // &#8212; is mdash
    "Heading 1": "h1",
    "Heading 2": "h2",
    "Heading 3": "h3",
    "Heading 4": "h4",
    "Heading 5": "h5",
    "Heading 6": "h6",
    "Normal"   : "p",
    "Address"  : "address",
    "Formatted": "pre"
  };
```


  formatblockDetector::
    Object.  See https://www.coactivate.org/projects/xinha/custom-formatblock-options

  dialogOptions::
    Object.  Controls some options for dialogs.
```
  xinha_config.dialogOptions =
  {
    'centered' : true, //true: dialog is shown in the center the screen, false dialog is shown near the clicked toolbar button
    'greyout':true, //true: when showing modal dialogs, the page behind the dialoge is greyed-out
    'closeOnEscape':true
  };
```

  Events::
    Object.  Hook into some events, for example...
```
    xinha_config.Events.onKeyPress = function (event) 
    {
       //do something 
       return false;
    }
```
    See EventHooks for discussion about available hooks.

  debug::
    Boolean.  Switches on some debug output.  Default false.

  URIs.iframe_src::
    String.   The intial (blank) src to use on Xinha's iframe.  Default: 'javascript:\'\''

  
  bodyClass::
    String.  A CSS class to apply to the `<body>` element.  Default, none.

  bodyID::
    String.  An id attribute to apply to the `<body>` element.  Default, none.

  

  

  
