# Plugin: MootoolsFileManager

This plugin allows the ability to upload, rename, delete and insert into your document Images and (links to) Files.

MootoolsFileManager (MFM) is a complex plugin and requires your server uses PHP, it also must be run on your server rather than a CDN (but you can use Xinha from a CDN and point it to MFM on your local server as an external plugin).

[Back to Plugins]({{ site.baseurl }}/trac/Plugins.html)

## Configuration

**See the [NewbieGuide]({{ site.baseurl }}/trac/NewbieGuide#ProvideSomeConfiguration.html) for how to set configuration values in general, the below configuration options are available for this plugin.**

MFM requires the use of PHP in your configuration to securely pass configuration details to the plugin, for obvious reasons we can't allow people to specifiy what they want to do with files on your server just with some Javascript!

Here is an example Xinha configuration to present both an insert image and a file link button.


```
      xinha_config:            function(xinha_config) 
      {   

     
        // Configure the File Manager
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        with (xinha_config.MootoolsFileManager)
        { 
          <?php 
            require_once($_SERVER['DOCUMENT_ROOT'].'/xinha/contrib/php-xinha.php');
            xinha_pass_to_php_backend
            (       
              array
              (
                'images_dir' => $_SERVER['DOCUMENT_ROOT'].'/images',
                'images_url' => '/images',
                'images_allow_upload' => true,
                'images_allow_delete' => true,
                'images_allow_download' => true,
                'images_use_hspace_vspace' => false,
                
                'files_dir' => $_SERVER['DOCUMENT_ROOT'].'/files',
                'files_url' => '/files',
                'files_allow_upload' => true,
                'files_max_upload_size' => '4M',
              )
            )
          ?>
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


      }
```


Notice how there is `<?php` used here, this means of course that you need to have your Xinha configuration defined in a file which is processed by PHP, the implementation of that is left to you if you are using .html files or template frameworks.

We can see how the first thing done is to `require_once` a script called php-xinha.php this is part of the Xinha (and external plugins) downloads and it provides the functions we need to pass data securely to the MFM.

Next we use the `xinha_pass_to_php_backend` to pass a PHP array of configuration variables to the MFM.  

Because the MFM can be used for both images and files, most of the configuration variables have two versions, eg `images_dir` when in the images mode and `files_dir` when in the files mode, as you can see above both should be specified as appropriate.

## Typical Options

These are the most common options you would set.

  [images|files]_dir::
    The **filesystem absolute path** to the directory in which the images/files are stored.  You can see in this example how I have used `$_SERVER['DOCUMENT_ROOT']` to indicate that the directory is `/images` at the root of the website.  Set this to false to disable the Insert Image or Insert File Link buttons as appropriate

  [images|files]_url::
    The full **url path** to the directory in which the images/files are stored.  Generally giving this as an absolute path is better, but you can use a relative path here.

  [images|files]_allow_upload::
    Allow the user to upload new images/files and create sub directories.  Default: false

  [images|files]_allow_delete::
    Allow the user to delete existing images/files. Default: false

  [images|files]_allow_download::
    Allow the user to download existing images/files from the MFM. Default: false

  [images|files]_max_upload_size::
    Files/images uploads larger than this will be rejected,  this size is a number followed by one of M, KB or B. Default: 3M

  [images|files]_suggested_image_dimension::
    Each mode can have a different "suggested maximum image dimension", when the user uses the MFM to upload a file, they are able to choose to "resize large images" on upload.  This defines what "large" means.  This is a PHP array,  Default: `array('width' => 2048, 'height' => 1536)`

  images_use_hspace_vspace::
    Only for the images mode, use hspace and vspace attributes on images instead of CSS margins.  This is useful mainly for putting images in emails where css support may be spotty.

## Less Commonly Necessary Options

  [images|files]_allow_move::
    Allow moving, renaming, and copying files. Default: off

  [images|files]_list_type::
    Show a list of filenames ('list'), or thumbnails ('thumb') in the MFM.  Default: 'list'

  [images|files]_pagination_size::
    Maximum number of filenames/thumbnails to show in the list per "page", if it's slowing down the MFM may reduce this number automatically.  Default: 10000 - a very high number to avoid pagination strongly.

  [images|files]_list_mode_over::
    Drop back to 'list' mode if the number of thumbnails exceeds this.  Default: 30 (but the mode defaults to 'list' anyway so this only matters if you change to 'thumb' mode.

  [images|files]_list_start_in::
    Set this to a relative path in the `[images|files]_dir` to have the MFM open the dialog at that location.

  



