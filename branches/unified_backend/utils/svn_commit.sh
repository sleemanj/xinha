#!/bin/sh

# -----------------------------------------------------------------
# Copyright (C) DTLink, LLC. 
# http://www.dtlink.com and http://www.formvista.com
#
# Use of this code is granted by the terms of the htmlArea License (based on
# BSD license) please read license.txt in this package for details.
# 
# All software distributed under the Licenses is provided strictly on
# an "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR
# IMPLIED, AND DTLINK LLC HEREBY DISCLAIMS ALL SUCH
# WARRANTIES, INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT,
# OR NON-INFRINGEMENT. 
# ------------------------------------------------------------------
#
# Preprocess popups/about.html so that it is out of date by incrementing
# a commit index in the file. This will force the SVN revision history
# variables to be updated on commit making those values reflect the actual 
# version of the repository we're dealing with.
#
# This script requires both a bourne compatible shell and a command
# line PHP processor. see ./lib/svn_commit_preproc.php. You may need
# to update the path in that script to point to your command line php
# parser.
#
# Currently this only runs under Unix/Linux.

# make sure we're not running from a webserver.
# FIXME: We need to verify that supported webservers call use the HTTP_HOST
# FIXME: variable

if test $HTTP_HOST; then
   echo No
   exit -1
fi

# make sure we are running from the xinha root directory

if test ! -f .xinha_root;
   then
   echo svn_commit must be run from the Xinha root directory.
   echo Usage: ./utils/svn_commit.sh
   exit -1
   fi

# before we go updating the about.html file make sure that we're out
# of date

export SVN_EDITOR=vi

if test -z "`svn status`";
   then
   echo XINHA is up to date with the Subversion repository
   exit
   fi

# update the popups/about.html file.

./utils/lib/svn_commit_preproc.php

# run the commit.

svn commit 
