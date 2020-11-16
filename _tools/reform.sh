#!/bin/bash
# Takes a trac wiki markdown formatted file and does some light sed work to make it into something more kramdown/GH-Markdown suitable

INPUT="$(cat $1)"

echo "$INPUT" | sed -r 's/====\s+([^=]+)\s+====/#### \1/' | # H4
						    sed -r 's/===\s+([^=]+)\s+===/### \1/'    |
						    sed -r 's/==\s+([^=]+)\s+==/## \1/'       | 
						    sed -r 's/=\s+([^=]+)\s+=/# \1/'          | # H1
						    sed -r 's/\[wiki:([^ #]+)(#[-.A-Za-z0-9_]+)? ([-\/.A-Za-z0-9_ :]+)\]/[\3]({{ site.baseurl }}\/trac\/\1.html\2)/g' |  # Wiki links
						    sed -r 's/\[wiki:([^ #]+)\/([-.A-Za-z0-9_:]+)(#[-.A-Za-z0-9_]+)?\]/[\2]({{ site.baseurl }}\/trac\/\1\/\2.html\3)/g' |  # Wiki links without text
						    sed -r 's/([a-zA-Z0-9._-]+\.)?!([A-Z][a-z0-9]+([A-Z][a-z0-9]+)+(\.[a-z]+)?)/`\1\2`/g'             |  # !CamelCase
						    # sed -r 's/(^| )([A-Z][a-z0-9]+([A-Z][a-z0-9]+)+)/[\1]({{ site.baseurl }}\/trac\/\2.html)/g' |  # CamelCase into links
						    sed -r 's/^\s*(\{\{\{)\s*$/\n```/'                            |  # Code guard start (ensure blank line)
						    sed -r 's/^\s*(\}\}\})\s*$/```\n/'                            |  # Code guard end  (ensure blank line)
						    sed -r 's/^\s*\{\{\{\s*(.+)\s*\}\}\}\s*$/\n```\n\1\n```/'     |  # Single line code
						    sed -r 's/\{\{\{\s*(.+)\s*\}\}\}/`\1`/'                       |  # Inline code
						    sed -r 's/\[\[PageOutline\]\]/* TOC\n{:toc}\n/'               |  # Table of Contents
						    sed -r 's/\[\[BR\]\]/\\\\/'                                   |  # Linebreak
						    sed -r 's/\[\[\/browser\/trunk\/([^|]+)\|([a-zA-Z0-9_ -]+)\]\]/[\2]({{ site.github.repository_url }}\/tree\/master\/\1)/g'                                         | # Links to repository
						    sed -r 's/\[(https?:\/\/[^ ]+)(\s+([^]]+))?\]/[\3](\1)/g'     |  # [http links
						    sed -r 's/\[\[Image\(https?:\/\/([^)]+)\)\]\]/![\1](https:\/\/\1)/g' |                     # Images
						    sed -rz 's/(^|\n)([^\n]+)::\s*(\n|$)/\1\2\n  :/g' # Definition Lists