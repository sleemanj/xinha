#!/bin/sh
OWD=`pwd`
echo "CD /tmp"
cd /tmp
pwd
echo "RM htmlarea"
rm -rf htmlarea*

cp -aL ~/gogo-jobs/dev/php-2.0/__libs/gogoField/htmlarea htmlarea
cd htmlarea
for file in $(find | grep \.svn) $(find | grep CVS) $(find | grep \#); 
do 
if test -e $file; then echo "Remove $file"; rm -rf $file; fi; done
cd /tmp
tar -cjvf htmlarea.tar.bz2 htmlarea
zip -9 -r htmlarea.zip htmlarea
scp htmlarea.zip gogocode@gogo.co.nz:/home/gogocode/www/htmlarea.zip
ssh gogocode@gogo.co.nz "sh -c \"cd ~/www;unzip -o htmlarea.zip\""
cd $OWD
