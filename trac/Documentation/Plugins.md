# Plugins

Plugins are optional extras (although currently distributed with Xinha anyway) which provide enhanced functions to the Xinha editor.  

See the NewbieGuide for instructions on loading a plugin.

If you are interested in writing a plugin, try the [PluginTutorial](Documentation/DevelopingForXinha/PluginTutorial.html) and reading the source code of one of the simpler plugins.

## The Most Common Plugins

  [MootoolsFileManager](Documentation/Plugins/MootoolsFileManager.html)::
    !Insert/Upload/Delete Images and (Links To) Files (requires PHP)

  [Linker](Documentation/Plugins/Linker.html)::
    Insert and Edit Links To Documents (requires PHP)

  [Stylist](Documentation/Plugins/Stylist.html)::
    Select CSS classes in a context-sensitive panel.

  [ListOperations](Documentation/Plugins/ListOperations.html)::
    Adds tab-to-indent and shift-tab-to-outdent function when editing lists.

  [TableOperations](Documentation/Plugins/TableOperations.html)::
    Add functions for inserting and editing tables.

  [ContextMenu](Documentation/Plugins/ContextMenu.html)::
    Add a right-click context menu which allows convenient access to other plugins (esp [TableOperations](Documentation/Plugins/TableOperations.html) to edit tables).

  [CharacterMap](Documentation/Plugins/CharacterMap.html)::
    Allow the user to insert special characters from a character map.

  [SuperClean](Documentation/Plugins/SuperClean.html)::
    Provide various "html cleaning" functions.

  [SmartReplace](Documentation/Plugins/SmartReplace.html)::
    Replace non-directional quotes ("test") with locale-sensitive directional quotes (“test”) amongst others.

  [PreserveScripts](Documentation/Plugins/PreserveScripts.html)::
    Preserve Javascript and PHP in the editable content.

  [PreserveSelection](Documentation/Plugins/PreserveSelection.html)::
    Preserve the selection between Source and WYSIWYG views (select text in WYSIWYG mode, switch to source, same text is selected)

  [FancySelects](Documentation/Plugins/FancySelects.html)::
    Make the font etc. drop-downs "fancy" using jQuery.

  [WebKitResize](Documentation/Plugins/WebKitResize.html)::
    Improve resizing of Images in `WebKit` (Chrome, Safari, Edge) browsers, and Tables in `WebKit` and Mozilla.

  [QuickSnippet](Documentation/Plugins/QuickSnippet.html)::
    Easily provide context-sensitive snippets of HTML that the user can insert from a drop-down list.

  [UseStrongEm](Documentation/Plugins/UseStrongEm.html)::
    Improves handling for the italic and bold toolbar buttons.

## All Currently Supported Plugins

 * [Abbreviation](Documentation/Plugins/Abbreviation.html)
 * [CharacterMap](Documentation/Plugins/CharacterMap.html)
 * [CharCounter](Documentation/Plugins/CharCounter.html)
 * [ContextMenu](Documentation/Plugins/ContextMenu.html)
 * [CSSDropDowns](Documentation/Plugins/CSSDropDowns.html)
 * [CSSPicker](Documentation/Plugins/CSSPicker.html)
 * [DefinitionList](Documentation/Plugins/DefinitionList.html)
 * [DynamicCSS](Documentation/Plugins/DynamicCSS.html)
 * [EditTag](Documentation/Plugins/EditTag.html)
 * [EncodeOutput](Documentation/Plugins/EncodeOutput.html)
 * [Equation](Documentation/Plugins/Equation.html)
 * [FancySelects](Documentation/Plugins/FancySelects.html)
 * [FindReplace](Documentation/Plugins/FindReplace.html)
 * [FormOperations](Documentation/Plugins/FormOperations.html)
 * [Forms](Documentation/Plugins/Forms.html)
 * [FullPage](Documentation/Plugins/FullPage.html)
 * [GenericPlugin](Documentation/Plugins/GenericPlugin.html)
 * [GetHtml](Documentation/Plugins/GetHtml.html)
 * [HorizontalRule](Documentation/Plugins/HorizontalRule.html)
 * [HtmlEntities](Documentation/Plugins/HtmlEntities.html)
 * [InsertAnchor](Documentation/Plugins/InsertAnchor.html)
 * [InsertNote](Documentation/Plugins/InsertNote.html)
 * [InsertPagebreak](Documentation/Plugins/InsertPagebreak.html)
 * [InsertSmiley](Documentation/Plugins/InsertSmiley.html)
 * [InsertSnippet](Documentation/Plugins/InsertSnippet.html)
 * [InsertSnippet2](Documentation/Plugins/InsertSnippet2.html)
 * [InsertWords](Documentation/Plugins/InsertWords.html)
 * [LangMarks](Documentation/Plugins/LangMarks.html)
 * [Linker](Documentation/Plugins/Linker.html)
 * [ListOperations](Documentation/Plugins/ListOperations.html)
 * [ListType](Documentation/Plugins/ListType.html)
 * [MootoolsFileManager](Documentation/Plugins/MootoolsFileManager.html)
 * [PasteText](Documentation/Plugins/PasteText.html)
 * [PreserveScripts](Documentation/Plugins/PreserveScripts.html)
 * [PreserveSelection](Documentation/Plugins/PreserveSelection.html)
 * [QuickTag](Documentation/Plugins/QuickTag.html)
 * [QuickSnippet](Documentation/Plugins/QuickSnippet.html)
 * [SaveOnBlur](Documentation/Plugins/SaveOnBlur.html)
 * [SaveSubmit](Documentation/Plugins/SaveSubmit.html)
 * [SetId](Documentation/Plugins/SetId.html)
 * [SmartReplace](Documentation/Plugins/SmartReplace.html)
 * [Stylist](Documentation/Plugins/Stylist.html)
 * [SuperClean](Documentation/Plugins/SuperClean.html)
 * [TableOperations](Documentation/Plugins/TableOperations.html)
 * [UnsavedChanges](Documentation/Plugins/UnsavedChanges.html)
 * [UseStrongEm](Documentation/Plugins/UseStrongEm.html)
 * [WebKitResize](Documentation/Plugins/WebKitResize.html)
 * [WysiwygWrap](Documentation/Plugins/WysiwygWrap.html)


## Unsupported (Deprecated) Plugins

These plugins are no longer supported officially and are regarded as deprecated, they may not work well, not work properly, have more potential for security issues, and may be superceeded by supported plugins above.  Use at your discretion, new integrations of Xinha should not use these.


 * [BackgroundImage](Documentation/Plugins/BackgroundImage.html)
 * [ClientsideSpellcheck](Documentation/Plugins/ClientsideSpellcheck.html)
 * [DoubleClick](Documentation/Plugins/DoubleClick.html)
 * [ExtendedFileManager](Documentation/Plugins/ExtendedFileManager.html)
 * [Filter](Documentation/Plugins/Filter.html)
 * [HtmlTidy](Documentation/Plugins/HtmlTidy.html)
 * [ImageManager](Documentation/Plugins/ImageManager.html)
 * [InsertMarquee](Documentation/Plugins/InsertMarquee.html)
 * [InsertPicture](Documentation/Plugins/InsertPicture.html)
 * [NoteServer](Documentation/Plugins/NoteServer.html)
 * [PersistentStorage](Documentation/Plugins/PersistentStorage.html)
 * [PSFixed](Documentation/Plugins/PSFixed.html)
 * [PSLocal](Documentation/Plugins/PSLocal.html)
 * [PSServer](Documentation/Plugins/PSServer.html)
 * [SpellChecker](Documentation/Plugins/SpellChecker.html)
 * [Template](Documentation/Plugins/Template.html)
 * [UnFormat](Documentation/Plugins/UnFormat.html)
