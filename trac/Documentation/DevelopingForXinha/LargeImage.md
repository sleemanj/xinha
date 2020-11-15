# Notes about Large Image

Xinha has an enhanced toolbar image system which allows for combining all the images into one large image.  This makes the initial download much quicker, particularly in Firefox (IE is quicker too, but not so much, at least in my opinion).

Developers will find in the images directory an image called "ed_buttons_main.gif", this contains the standard toolbar buttons (not currently includng the `TableOperations` plugin buttons) in a row/col indexed file.

To use these is quite simple, instead of supplying an image filename for the button, we supply a tuple containing the name, column and row.

For example, what used to be (in the tool bar)


```
bold:          [ "Bold", "ed_format_bold.gif", false, function(e) {e.execCommand("bold");} ]
```

is now written


```
bold:          [ "Bold",   ["ed_buttons_main.gif",3,2], false, function(e) {e.execCommand("bold");} ]
```

indicating that the button at row 2, column 3 in ed_buttons_main.gif "Bold".

This should be fully backwards compatabile, standard image filenames are still accepted instead of the tuples.

