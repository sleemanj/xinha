#!/bin/bash

if ! [ -f XinhaCore.js ]
then
  echo "Run this from the root of your working copy." >&2
  echo                                                >&2
  exit 1
fi


if ! [ -d .svn ]
then 
  echo "This script must be run inside a subversion working copy." >&2
  echo                                                             >&2
  exit 1
fi

if [ "$1" = "" ]
then
  echo "Usage: $0 {VersionNumber}"                    >&2
  echo                                                >&2
  exit 1
fi

# Run this with bash from the root of your SVN working copy checkout of the trunk
# it will dump int /tmp the archived release files
# eg bash contrib/make-release.sh

VER="$1"

# Update plugin Manifest
MANIFEST="$(bash contrib/generate-plugin-manifest.sh | sort | perl -0777 -pe 's/,\s*$//s' )"
cat XinhaCore.js | perl -0777  -pe 's/(.pluginManifest\s+=)\s+.+?;/\1 {\nPUT_THE_MANIFEST_HERE_YO\n};/is' | replace PUT_THE_MANIFEST_HERE_YO "$MANIFEST" >XinhaCore2.js
mv XinhaCore2.js XinhaCore.js

# Export
mkdir /tmp/Xinha-$VER
svn export $(pwd) /tmp/Xinha-$VER/xinha
cd /tmp/Xinha-$VER/xinha
echo "xinha-$VER" >VERSION.TXT

# Create the merged language files
php contrib/lc_parse_strings.php
for lang in $(find . -wholename "*/lang/*.js" | sed -r 's/.*\///' | sort | uniq | grep -v base | sed -r 's/.js//')
do
  php contrib/lc_create_merged_file.php $lang lang/merged/$lang.js
done
php contrib/lc_create_merged_file.php NEW lang/merged/__new__.js


cd ../

# Create the main distribution zip and bz2
zip -r xinha-$VER.zip        xinha
tar -cjvf xinha-$VER.tar.bz2 xinha

# Make a strippped down plugins set for the plugins which must be run locally
#  ie, ones that upload files or deal with the local server file system
mkdir local_plugins
mkdir local_plugins/contrib
mkdir local_plugins/plugins
cp -rp xinha/contrib/php-xinha.php         local_plugins/contrib
cp -rp xinha/contrib/.htaccess             local_plugins/contrib
cp -rp xinha/plugins/MootoolsFileManager   local_plugins/plugins
cp -rp xinha/plugins/Linker                local_plugins/plugins
cat >local_plugins/README.TXT <<'EOF'
Xinha Local Plugins 
--------------------------------------------------------------------------------

This directory contains plugins for Xinha (www.xinha.org) which must be run on
the local web server rather than from an external server/content delivery
network.

Consult the NewbieGuide ( http://trac.xinha.org/wiki/NewbieGuide ) 
for more complete details on Xinha configuration, however in short you can load
Xinha using local plugins like this (assuming you upload the local_plugins
directory to the root of your website).

  <script type="text/javascript" src="//s3-us-west-1.amazonaws.com/xinha/xinha-1.5-beta1/XinhaEasy.js">
    xinha_options = {
      xinha_plugins: [
        'minimal', 
        // Note that from is a URL to the plugins directory inside the
        //  local_plugins directory, adjust for where you upload.
        {from: '/local_plugins/plugins', load: ['MootoolsFileManager'] }]
      ],

      xinha_config:            function(xinha_config) 
      {
        
        // Configure the File Manager
        with (xinha_config.MootoolsFileManager)
        { 
          <?php 
            require_once($_SERVER['DOCUMENT_ROOT'].'/local_plugins/contrib/php-xinha.php');
            xinha_pass_to_php_backend
            (       
              array
              (
                'images_dir' => $_SERVER['DOCUMENT_ROOT'] . '/images',
                'images_url' => '/images',
                'images_allow_upload' => true,
                'images_allow_delete' => true,
                'images_allow_download' => true,
                'images_use_hspace_vspace' => false,
                
                'files_dir' => $_SERVER['DOCUMENT_ROOT'] . '/files',
                'files_url' => '/files',
                'files_allow_upload' => true,
                'max_files_upload_size' => '4M',
              )
            )
          ?>
        }
      }
    }
  </script>
EOF
echo "xinha-$VER" >local_plugins/VERSION.TXT
zip -r    local_plugins.zip     local_plugins
tar -cjvf local_plugins.tar.bz2 local_plugins

cd xinha
php contrib/compress_yui.php
sleep 5
cd ../
zip -r    xinha-compressed-$VER.zip     xinha
tar -cjvf xinha-compressed-$VER.tar.bz2 xinha
