{% include nav.html %}

# Form Operations

[Back To Plugins]({{ site.baseurl }}/trac/Documentation/Plugins.html)

** This plugin, while not deprecated, is not especially functional due to browser selection issues (problems when trying to select form fields in the browser).  Try it, but don't rely on it. **

The Form Operations plugin provides a set of buttons in the toolbar and an as-required panel-based dialog for editing forms and form fields.  Form Operations was written by James Sleeman.

## Usage:
See the README file, the contents of which are pasted here...


```
  1. Follow the standard procedure for loading a plugin.
  2. You optionally may configure the plugin by setting the following configuration variables, or leave them as the defaults.

      xinha_config.FormOperations.multiple_field_format
        = 'php'
              this will cause checkbox and "multiple" select fields to have []
              appended to thier field names silently
        = 'unmodified'
              field names will not be silently modified

      xinha_config.FormOperations.allow_edit_form
        = true
              the user will be able to edit the action, and method of forms
        = false
              neither action, nor method is editable

      xinha_config.FormOperations.default_form_action
        = 'whatever you want'
              the default form action to set when inserting a form.  The standard one is a php file in the Form Operations directory which will email the form post to enquiries@<server hostname here>

      xinha_config.FormOperations.default_form_html
        = '<form>whatever you want here</form>'
              the default html to insert when inserting a form.  The standard one is a basic contact form.  If you would like to specify an external file which contains the HTML for the form, you may do so via
              = HTMLArea._geturlcontent('http://absolute/url/to/file.html')
              see default_form.html for a suitable example, pay attention to the form tag.
```


## Known Issues

Mozilla is rather problematic when it comes to selecting form elements so you may edit them, especially buttons, which are nigh impossible (tip, try clicking a few pixels off the right hand side of a button).  This is a bug which has been reported to bugzilla https://bugzilla.mozilla.org/show_bug.cgi?id=293771 please show your support by voting for that bug!

## To Do

* Multiple pre-defined form templates which may be selected from when inserting a new form.
* Allowing selection of a set of pre-defined (developer configured) form actions as aliased names (eg Action: "Send mail to Bob").
* Improve the asthetics of the panel dialogs.  Help would be appreciated on that one :)

