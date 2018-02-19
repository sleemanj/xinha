# Run this with bash from the root of your SVN working copy checkout of the trunk
# it will dump int /tmp the archived release files
# eg bash contrib/make-release.sh

VER=0.96.1

if ! [ -f XinhaCore.js ]
then 
  echo "Run this script from inside your Xinha Root directory."
  exit 1
fi

if ! [ -f .svn ]
then 
  echo "This script must be run inside a subversion working copy."
  exit 1
fi

# Create merged language files for translators
php contrib/lc_parse_strings.php
for lang in $(find . -wholename "*/lang/*.js" | sed -r 's/.*\///' | sort | uniq | grep -v base | sed -r 's/.js//')
do
  php contrib/lc_create_merged_file.php $lang lang/merged/$lang.js
done
php contrib/lc_create_merged_file.php NEW lang/merged/__new__.js


#
svn export $(pwd) /tmp/Xinha-$VER
cd /tmp
zip -r Xinha-$VER.zip /tmp/Xinha-$VER
tar -cjvf Xinha-$VER.tar.bz2 /tmp/Xinha-$VER
cd Xinha-$VER
php contrib/compress_yui.php
sleep 5
cd ../
zip -r Xinha-$Ver-Compressed.zip /tmp/Xinha-$VER
tar -cjvf Xinha-$Ver-Compressed.tar.bz2 /tmp/Xinha-$VER

