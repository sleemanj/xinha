\\
# Creating a XINHA plugin.

Beginning an update of this tutorial.  We're going to talk about coding style (I think there's a style guide somewhere, we'll link to it).  Also, I want to talk about good practices for config data.  We don't want config data to live in plugin directories, there's some code to allow this to be stored in the config file (as longs as the config file is a backend script).  Stay tuned, more to follow...

1. New folder in the plugins folder with your item, for example, `MyTest`

2. The main javascript file should have the same name as the plugin directory.  In this example, the source file is called MyTest.js

3. Add an entry to xinha_plugins section of myconfig.js to point to your directory that you have created.

4. In the my-test.js file, the absolute min you require just to get a button on the toolbar (that doesn't error when clicked) is...
```
function MyTest(editor)
{
	this.editor = editor;
	var cfg = editor.config;
	var self = this;
	cfg.registerButton(
	{
                id       : "my-test",
                tooltip  : HTMLArea._lc("My Test"),
                image    : editor.imgURL("ed_image.gif", "My Test"),
                textMode : false,
                action   : function(editor)
                {
			self.buttonPress(editor);
                }
        })

	cfg.addToolbarElement("my-test", "inserthorizontalrule", 1);


	MyTest._pluginInfo = {
		name          : "MyTest",
		version       : "1.0",
		developer     : "David Colliver",
		developer_url : "http://www.revilloc.com/",
		sponsor       : "MyLocalFOCUS.com",
		sponsor_url   : "http://www.MyLocalFOCUS.com/",
		c_owner       : "David Colliver",
		license       : "none"
	};

	
	MyTest.prototype.buttonPress = function(editor)
	{
	
	}

}
```
Note where `MyTest` and my-test and My Test are placed. These will need to be made relevant to your situation.


5. Note that there is a buttonPress function. This is where you interact with the editor. You can cause the editor to do something like insert specified HTML, make something bold, or pop-up a new window. (Require info to interact with editor).

6. Insert your working code inside the buttonPress function.
	Objects available to work with are here...
	http://xinha.raimundmeyer.de/JSdoc/Xinha/
	More specifically, the Xinha and Xinha.Config links on the left will give you most of the information you require.

7. To get your button press to pop-up a window...
	a. Add a new page to the working folder, in this case `MyTest`. Call your page whatever you like. In my case, I have called it `MyTest`Form.aspx (as I am running .NET)
	b. In the buttonpress, type... editor._popupDialog(_editor_url + "plugins/MyTest/MyTestForm.aspx"); (changing the URL to what you need).\\This will give you a pop-up on the button press, however, it will be small. You will need to handle the sizing.
	c. The _popUpDialog function can take two further parameters. the first is what you want to happen when the pop-up window is closed, the second is what you want to pass to the dialog when you first open it.
		i. Change the buttonPress to... editor._popupDialog(_editor_url + "plugins/MyTest/MyTestForm.aspx", function(value){alert(value);}); and in your popped-up page, you need to ensure your return button has an onclick event. You can put any event name in the onclick, but ensure you have the event. For simple return just make the button onclick to onclick="!__dlg_close('some value');"\\[[BR]]You will also require <script src="../../popups/popup.js" type=text/javascript></script> somewhere in the HTML of the pop-up page (in my case, `MyTest`Form.aspx) prior to the call to !__dlg_close().[[BR]][[BR]]

ii. You can change the alert(value) to do whatever you want to the parent Xinha element, such as...  editor.insertHTML(value); This will put the 'some value' from my example into your editor.
		iii. If you want to pass a value INTO your pop-up window, you use the third parameter of the _popupDialog. editor._popupDialog(_editor_url + "plugins/MyTest/MyTestForm.aspx", function(value){editor.insertHTML(value);}, {FirstArg:'Text to pass into my pop-up',SecondArg:'More text'});
		iv. The pop-up (`MyTest`Form.aspx) will require an Init function. The function will be called from the body onload. <body onload="Init()">
		v. The Init() will contain a method to get the value out.
```
	function Init()
	{
		__dlg_init(null,{width:410,height:400});
		var Incoming = window.dialogArguments;
		alert(Incoming["FirstArg"]);
		alert(Incoming["SecArg"]);
	}
```



If you want your plugin to override another plugin, for example, you may have developed an image upload facility and want to override the current `InsertImage` button, you will need to modify the above code.

1. Remove all code from this.editor down to cfg.addToolbarElement. (lines 3 to 17 in my example)

2. Change `MyTest`.prototype.buttonPress # function(editor) to Xinha.prototype._insertImage function(image).
     The _insertImage and function(image) will change depending on what control you will be overriding. You will be responsible for finding this information.
3. You still require the entry in xinha_plugins section of myconfig.js to point to your directory that you have created.



I hope this helps everyone to create a plugin and at least give some understanding.
