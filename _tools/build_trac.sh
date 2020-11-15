cd $(dirname $0)/../trac
for file in ../_trac_wiki_dump/*
do 
	echo "{% include nav.html %}" >$(basename $file).md
  echo                         >>$(basename $file).md
	../_tools/reform.sh $file    >>$(basename $file).md
done

for file in *%2F*
do
  newfile=$(echo "$file" | sed -r 's/%2F/\//g')
  mkdir -p $(dirname "$newfile")
  #echo "{% include nav.html %}" >$newfile
  #echo                         >>$newfile
  cat $file                     >$newfile 
  rm  $file
done