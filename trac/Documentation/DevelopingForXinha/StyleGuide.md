
## Code Style Guide

This page is meant to provide some basic coding practices and style guidelines for developers working on Xinha.

1. Put the brace associated with a control statement on the next line, indented to the same level as the control statement. Statements within the braces are indented to the next level. [http://en.wikipedia.org/wiki/Indent_style#Allman_style_.28bsd_in_Emacs.29 (Allman Indent Style)]

2. '''Don't use tabs.''' Instead, indent code blocks with '''two spaces'''.

3. Always use semicolons after single lines, function definition and object literals, but not after loops and if-blocks. E.g., 

```
var foo = function() 
{
  alert('foo');  
  var foo = 
  {
    foo1 : 'bar1',
    foo2 : 'bar2'
  };
  var bar = 
  [
    'foo',
    'bar'
  ];
  for (var i=0;i<10;i++)
  {
    //...
  }
  if (foo == bar)
  {
    //..
  }
};
```


4. Always use `var` when declaring variables, unless you ''really'' do mean to create a global variable.
