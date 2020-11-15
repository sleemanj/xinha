# Character Sets in Xinha

The use of Xinha with non-english languages, or special characters (such as the Euro symbol) means that you will very likely encounter character set problems, especially if you don't know jack about character sets.  This document first attempts to explain Character Sets and Encodings, then will give you some advice about the use of character sets with HTML, Javascript and in particular Xinha.


[wiki:CharacterSets#stopwaffle Skip to the advice.]


## What is a Character Set?

A character set (also called character encoding) is a '''code''', it maps an integer value (eg 65) to an arbitrary character (eg "A").  The typical character set is ASCII (American Standard Code for Information Interchange), this defines 127 integers mapping to 127 distinct characters ranging from "NUL" as character 0 to "DELETE" as 127.

Everything was so simple back then, when ASCII ruled, but then people realised that not everybody speaks english, and that those 127 characters we have in ASCII are no use for most other languages.  So what happened is that people came up with different character sets, now when somebody said "Character 65" you also had to be told what character set you are using so that you could know if they were talking about the character "A" (in the ASCII set) or some completely different character in a different character set.  Of course, this is exagerating a little, most character sets "extend" the 7-bit ASCII set using a full 8 bit byte and thus using the upper half of the character space for the "custom" characters, and leaving the standard ASCII code at and below byte 127.

## Double Bytes!

Most european languages have a very small number of characters, English for example has 37 necessary to communicate -- 26 letters, 10 numbers and space are all you need to get your message across (unless you're speaking "txt", in which case you can throw out the vowels ;).

But what about the much more complex languages of the world, CJK (Chinese, Japanese and Korean) being the most familiar to those of us in the west -- these languages need MANY more characters than the 256 avaiable in a single byte, especially if they want to leave the lower 127 as standard ASCII!

To counter this problem, enter the double (and triple, and quadruple, and...) byte sets.  Instead of using just 8 bits (one byte) to represent the number which specifys the character (remember, in ASCII the number "65" is represented simply by the 8 bits 1000001 which in the ASCII set represents the letter "A"), they use 2, or 3, or 4.  Essentially this means that while ASCII has only 127 different characters available to it (7 bit ASCII this is), multi byte character sets can have thousands, or millions!

## Encoding

So, let's say that the following string  - "à®±" - is an encoding of some character in a multibyte character set now how do you decode that into the numbers that you can use to look up what character it represents?  

Enter the character encoding -- simply, this is an "algorithm" which you may follow to figure out which bits of the bytes you have to join togethor to get the number representing a character, and where one "character" stops and the next starts, ASCII is a character encoding AND a character set, in the terms of an encoding the "algorithm" is simply "take 8 bits, treat it as an integer, look it up in the ASCII character set".  Once we have the number (say 2993), that's it, look it up in the character set (say UNICODE) and we know what character it is (say "TAMIL LETTER RRA").  

'''This is important''' - the internal representation of a string in Javascript (and Java, and probably many other languages) is just a list of numbers, for example the string "Hello", *inside* Javascript is simply a list of the numbers 72, 101, 108, 108 and 111.  Once it's "in" the javascript engine, that's it, no more encoding, it's just a list of numbers, until you take it "out" again, at which time it's written as a stream of bytes in the appropriate encoding.

## UNICODE

Ok, if you've been reading along you will now see that we have a lot of different character sets, and that without prior knowledge of which character set (and encoding) you have no show of "decoding" the stream of bytes into a list of numbers which you may use to lookup the character in the character set tables.

Enter UNICODE, this is just a character set like any other, except that it's an ENORMOUS one, I mean big, really big, you might think that the solar system is big but that's just a walk in the park compared to UNICODE.  Put simply, UNICODE contains all the characters from all the languages, and room to spare for growth (and languages that havn't been documented yet). It's "compatable" with ASCII, in that character 65 is still capital letter "A" etc, but it contains more than a MILLION other characters.

'''This is important too''' - remember the internal representation of a string in Javascript is just a list of numbers, well, guess what, those numbers represent characters in the UNICODE character set.  Doesn't matter a jot if you feed the string in as ASCII, BIG-5 or SHIFT-JIS, Javascript will decode those strings, find the numbers in the original character set, and convert those numbers to the correct  number in the UNICODE character set.  Then when you take it out again it will reverse the process, as good as it can (remember, UNICODE can represent more than a million characters, but ASCII can represent only 127).

Remeber multi-byte character sets, well, UNICODE is the ultimate multibyte character set, and as a result we need to have some encoding for those bytes so we can figure out the '''numbers''' to lookup.  Of course, there are many, but the most important one is....

## UTF-8

UTF-8 is just a character encoding, it says "take a string of bytes, do this algorithm over them, and you'll get a list of numbers which represent characters in the UNICODE character set".  The special thing about UTF-8 is that it leaves the lower (127 characters) of ASCII intact (remembering that these characters are unchanged in UNICODE), so for most english text, UTF-8 encoded UNICODE is identical to plain old 7-bit ASCII (which as you might expect is quite useful).

Slowly but surely the world is progessing to ONE character set (UNICODE) and ONE encoding (UTF-8), gone will be ASCII, BIG-5, SHIFT-JIS, and all those other character sets and encodings, never to darken our doorstep again.

'''The important thing is''' - UTF-8, and any other character encoding, is ONLY used to get characters IN TO Javascript, once it's there, that's it, it's just a list of numbers which are indexes into the big UNICODE character tables, nothing more, nothing less.  Not BIG-5, not ASCII, not even UTF-8 anymore, it's just UNICODE index numbers.

```
#!html
<a name="stopwaffle"></a>
```
## Stop waffling, cut to the chase!

'''Encoding and character sets are only used to get data IN TO and OUT OF the web browser.  Inside the browser, inside Xinha, the data is ALWAYS represented by a list of numbers representing characters in UNICODE.'''  

When you give to the editor some HTML to be edited then you have to make sure that the editor (Javascript) knows the Character Set the HTML is written in so that it can convert that to the numbers of the character set and convert those to the numbers of UNICODE, and then back again.

The way you do this is for your webserver (or application language such as PHP) to set the Character-Encoding header (or maybe you can use a meta tag, but that is very unreliable) on the HTML file that you are putting Xinha into, and ensuring that you are using that same character encoding on the content being edited.  There are no exceptions, if you are trying to edit UTF-8 encoded html, then make sure that the editor page itself is being recognized as utf-8.  If you are trying to edit ISO-8859-1 (typical european langauges) then make sure that the editor page is being recognized as ISO-8859-1.

All the javascript files (that form Xinha) must be loaded as UTF-8, for example


```
<script language="Javascript" src="htmlarea.js" charset="utf-8"></script> 
```

Further to that, UTF-8 encoding across the board with your files, with your edited content, with EVERYTHING, is HIGHLY encouraged, avoid using older encodings and character sets, UTF-8 encoded UNICODE isn't the way of the future, it's the way of the present - you will have a much more reliable time if you forget about the character sets of old and use UNICODE.

## Tools

A very handy tool for the Linux users amongst us is [http://gucharmap.sourceforge.net/ gucharmap] this program allows you to easily browse (and search) the entire UNICODE character set.

## Fonts

UNICODE is nothing if you don't have a font with the characters.  To my knowledge the most complete UNICODE font is currently Arial Unicode MS which has representations of a very large proportion of the UNICODE standard.

This font used to be downloadable from Microsoft for free but is now included only with MS Office.  Emphasis to be placed on ''from microsoft'' [http://www.google.co.nz/search?hl=en&safe=off&c2coff=1&client=firefox-a&rls=org.mozilla%3Aen-US%3Aofficial&q=download+unicode+fonts&btnG=Search&meta= if you know what I mean].



