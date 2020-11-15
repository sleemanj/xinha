{% include nav.html %}

# SaveSubmit for Xinha
[Back To Plugins]({{ site.baseurl }}/trac/Plugins.html) \\
developed by [Raimund Meyer](http://xinha.raimundmeyer.de)

Registers a button for submitting the Xinha form using asynchronous postback for sending the data to the server. This has the advantage of creating a much smother user experience, because the page isn't reloaded as would be with normal HTML submit.

Also registers a shortcut for saving (ctrl-s).

## Usage
This should be a drop-in replacement for a normal submit button. The URL where the data is sent is taken from the action attribut of the form.\\
While saving a message is displayed to inform the user what's going on.
On successful transmission the output of the target script is shown, so it should print some information
about the success of saving.

'''NOTE:''' The data sent by this method is always UTF-8 encoded, regardless of the actual charset used. So, if you 
are using a different encoding you have to convert on the server side.

