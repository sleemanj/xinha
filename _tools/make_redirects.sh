#!/bin/bash
cd $(dirname $0)/../trac

for file in $(find . -type f)
do
  cd $(dirname $0)/../wiki
  mkdir -p $(dirname "$file")
  cat <<EOF >"$file"
<meta http-equiv="refresh" content="0; url=../trac/$(echo "$file" | sed -r 's/^\.\///' | sed -r 's/\.md/.html/')" />
EOF
done