# ExtendedFileManager Configuration
These are the most important config variables for the `ExtendedFile`Manager.\\
For a complete overview look into the config.inc.php in the plugin directory.\\
Read [here]({{ site.baseurl }}/Plugins/ExtendedFileManager.html) how to use these values in your Xinha configuration.

 * [wiki:Plugins/ExtendedFileManager/Config#images_dirfiles_dir images_dir/files_dir]
 * [wiki:Plugins/ExtendedFileManager/Config#images_urlfiles_url images_url/files_url]
 * [view_type]({{ site.baseurl }}/Plugins/ExtendedFileManager/Config#images_dirfiles_dir.html)
 * [allow_new_dir]({{ site.baseurl }}/Plugins/ExtendedFileManager/Config#allow_new_dir.html)
 * [allow_edit_image]({{ site.baseurl }}/Plugins/ExtendedFileManager/Config#allow_edit_image.html)
 * [allow_rename]({{ site.baseurl }}/Plugins/ExtendedFileManager/Config#allow_rename.html)
 * [allow_cut_copy_paste]({{ site.baseurl }}/Plugins/ExtendedFileManager/Config#allow_cut_copy_paste.html)
 * [use_color_pickers]({{ site.baseurl }}/Plugins/ExtendedFileManager/Config#use_color_pickers.html)
 * [images_enable_alt]({{ site.baseurl }}/Plugins/ExtendedFileManager/Config#images_enable_alt.html)
 * [images_enable_title]({{ site.baseurl }}/Plugins/ExtendedFileManager/Config#images_enable_title.html)
 * [images_enable_align]({{ site.baseurl }}/Plugins/ExtendedFileManager/Config#images_enable_align.html)
 * [images_enable_styling]({{ site.baseurl }}/Plugins/ExtendedFileManager/Config#images_enable_styling.html)
 * [link_enable_target]({{ site.baseurl }}/Plugins/ExtendedFileManager/Config#link_enable_target.html)
 * [allow_upload]({{ site.baseurl }}/Plugins/ExtendedFileManager/Config#allow_upload.html)
 * [wiki:Plugins/ExtendedFileManager/Config#max_filesize_kb_imagemax_filesize_kb_link max_filesize_kb_image/max_filesize_kb_link]
 * [max_foldersize_mb]({{ site.baseurl }}/Plugins/ExtendedFileManager/Config#max_foldersize_mb.html)
 * [wiki:Plugins/ExtendedFileManager/Config#allowed_image_extensionsallowed_link_extensions allowed_image_extensions/allowed_link_extensions]

### images_dir/files_dir

 File system path to the directory you want to manage the images
 for multiple user systems, set it dynamically.

 NOTE: This directory requires write access by PHP. That is,
	   PHP must be able to create files in this directory.
	   Able to create directories is nice, but not necessary.
```
$IMConfig['images_dir'] = $_SERVER['DOCUMENT_ROOT'].'/images';
//You may set a different directory for the link mode; if you don't, the above setting will be used for both modes
//$IMConfig['files_dir'] = $_SERVER['DOCUMENT_ROOT'].'/files_dir';
```

### images_url/files_url
 The URL to the above path, the web browser needs to be able to see it. It is 
 prefixed to the filename to determoine the full image url.
 It can be protected via .htaccess on apache or directory permissions on IIS,
 check you web server documentation for futher information on directory protection
 If this directory needs to be publicly accessiable, remove scripting capabilities
 for this directory (i.e. disable PHP, Perl, CGI).
```
$IMConfig['images_url'] = '/images/';
//You may set a different directory for the link mode; if you don't, the above setting will be used for both modes
//$IMConfig['files_url'] = 'url/to/files_dir';
```
### view_type
Possible values: "thumbview","listview"\\
Default is thumbview in image mode and listview in file mode

```
$IMConfig['view_type'] = "listview";
```


### allow_new_dir
Possible values: true, false

 TRUE (default) -  Allow the user to create new sub-directories in the
         $IMConfig['images_dir']/$IMConfig['files_dir'].

 FALSE - No directory creation.

 
 NOTE: If PHP is running in Safe Mode this parameter
       is ignored, you can not create directories
       
```
$IMConfig['allow_new_dir'] = false;
```

### allow_edit_image

Possible values: true, false

 TRUE (default) -  Allow the user to edit image by image editor.

 FALSE - No edit icon will be displayed.

 NOTE: If $IMConfig['img_library'] = false, this parameter
       is ignored, you can not edit images.
```
$IMConfig['allow_edit_image'] = false;
```

### allow_rename

Possible values: true, false

 TRUE (default)-  Allow the user to rename files and folders.

 FALSE - No rename icon will be displayed.
```
$IMConfig['allow_rename'] = false;
```

### allow_cut_copy_paste

Possible values: true, false

 TRUE (default) -  Allow the user to perform cut/copy/paste actions.

 FALSE - No cut/copy/paste icons will be displayed.

```
$IMConfig['allow_cut_copy_paste'] = false;
```

### use_color_pickers

Possible values: true, false

  TRUE (default) - Display color pickers for image background / border colors

  FALSE - Don't display color pickers
```
$IMConfig['use_color_pickers'] = false;
```

### images_enable_alt

Possible values: true, false

 TRUE (default) -  Allow the user to set alt (alternative text) attribute.

 FALSE - No input field for alt attribute will be displayed.

 NOTE: The alt attribute is ''obligatory'' for images, so <img alt="" /> will be inserted
      if 'images_enable_alt' is set to false
```
$IMConfig['images_enable_alt'] = false;
```


### images_enable_title

Possible values: true, false

 TRUE (default) -  Allow the user to set title attribute (usually displayed when mouse is over element).

 FALSE - No input field for title attribute will be displayed.

```
$IMConfig['images_enable_title'] = false;
```

### images_enable_align

Possible values: true, false

 TRUE (default) -  Allow the user to set align attribute.

 FALSE - No selection box for align attribute will be displayed.

```
$IMConfig['images_enable_align'] = false;
```

### images_enable_styling

Possible values: true, false

 TRUE (default) -   Allow the user to set margin, padding, and border styles for the image

 FALSE - No styling input fields will be displayed.

```
$IMConfig['images_enable_styling'] = false;
```

### link_enable_target

Possible values: true, false

 TRUE (default) -   Allow the user to set target attribute for link (the window in which the link will be opened).
 
 FALSE - No selection box for target attribute will be displayed.

```
$IMConfig['link_enable_target'] = false;
```

### allow_upload

Possible values: true, false

 TRUE (default) -   Allow the user to upload files.
 
 FALSE - No uploading allowed.

```
$IMConfig['allow_upload'] = false;
```

### max_filesize_kb_image/max_filesize_kb_link
Maximum upload file size

  Possible values: number, "max"

  number - maximum size in Kilobytes.

  "max"  - the maximum allowed by the server (the value is retrieved from the server configuration).

```
$IMConfig['max_filesize_kb_image'] = 2000000;

$IMConfig['max_filesize_kb_link'] = 5000;
```

### max_foldersize_mb
Maximum upload folder size in Megabytes. Use 0 to disable limit
```
$IMConfig['max_foldersize_mb'] = 0;
```

### allowed_image_extensions/allowed_link_extensions
Allowed extensions that can be shown and allowed to upload.
Available icons are for "doc,fla,gif,gz,html,jpg,js,mov,pdf,php,png,ppt,rar,txt,xls,zip"
Below is the default configuration
```
$IMConfig['allowed_image_extensions'] = array("jpg","gif","png","bmp");
$IMConfig['allowed_link_extensions'] = array("jpg","gif","js","php","pdf","zip","txt","psd","png","html","swf","xml","xls","doc");
```
