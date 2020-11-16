{% include nav.html %}

# Plugin: Equation

[Back To Plugins]({{ site.baseurl }}/trac/Documentation/Plugins.html)

## AsciiMathML Formula Editor for Xinha

Based on AsciiMathML by [Peter Jipsen](http://www.chapman.edu/~jipsen). \\
Plugin by [Raimund Meyer](http://xinha.raimundmeyer.de)

AsciiMathML is a `JavaScript` library for translating ASCII math notation to Presentation MathML.

### Usage
 The formmulae are stored in their ASCII representation, so you have to include the 
 ASCIIMathML library which can be found in the plugin folder in order render the MathML output in your pages. 
 

```
  <script type="text/javascript" src="/xinha/plugins/Equation/ASCIIMathML.js"></script>
```


 The recommended browser for using this plugin is Mozilla/Firefox.\\
 At the moment '''showing the MathML output inside the editor is not supported in Internet Explorer.'''

### Configuration
You can change the color and the font of the `AsciiMath` display.
In the editor:

```
xinha_config.Equation.mathcolor = "black";
xinha_config.Equation.mathfontfamily= "sans-serif";
```

In the page insert before the script block that loads ASCIIMathML.js

```
  <script type="text/javascript">
    var mathcolor = "black"; // You may change the color of the formulae (default: red)
    var showasciiformulaonhover = false; // helps students learn ASCIIMath, set to false if you like  (default:true)
    var mathfontfamily = "Arial"; //and the font (default: serif, which is good I think)
  </script>
```

