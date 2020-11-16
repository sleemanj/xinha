{% include nav.html %}

# Plugin: InsertWords

[Back To Plugins]({{ site.baseurl }}/trac/Documentation/Plugins.html)

The Insert Words plugin allows the user to insert defined words in the page. This can be very useful vor some kind on predefined variables like '%user%' that will be replaced in the frontend.

To insert a word set the cursor where you want to enter the word and select the word from the dropdown-list.

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide.html#ProvideSomeConfiguration) for how to set configuration values in general, the below configuration options are available for this plugin.**


Usage:

```
// Register the keyword/replacement list
var keywrds1 = new Object();
var keywrds2 = new Object();

keywrds1['-- Dropdown Label --'] = '';
keywrds1['onekey'] = 'onevalue';
keywrds1['twokey'] = 'twovalue';
keywrds1['threekey'] = 'threevalue';

keywrds2['-- Insert Keyword --'] = '';
keywrds2['Username'] = '%user%';
keywrds2['Last login date'] = '%last_login%';

xinha_config.InsertWords = {
                    combos : [ { options: keywrds1, context: "td" },
                               { options: keywrds2, context: "body" } ]
	};


```



This plugin was developed by Adam Wright and is under htmlArea license.
