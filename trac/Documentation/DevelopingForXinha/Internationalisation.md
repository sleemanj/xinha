# Internationalisation (i18n)

If you look for information on localisation (l10n, how you translate Xinha) take a look at wiki:Translating.

This page is for xinha-developers and on how the _lc-function works.

## Context
Xinha has different contexts for i18n:

 * "Xinha": the core of Xinha uses this context.
 * eg. "`InsertAnchor`": every plugin has its own context (the name of the plugin)

## the _lc-function

```

Xinha._lc('english string');
```

This is the simplest usage, Xinha (core) will be used as context. The function will return the localised string.
----

```

Xinha._lc('english string', 'PluginName');
```

Usage within an plugin. Most plugins do have its own _lc function defined, you don't need to pass the context everytime then.

```

CharCounter.prototype._lc = function(string) {
    return Xinha._lc(string, "CharCounter");
};
```

----

```

var complexity = 'very';
Xinha._lc({string: 'this is a $complexity complex sentence', replace:{'complexity': complexity}});
```

This provides a way to have complex sentences where some parts are variable - and this variable part might be at another position in other languages.
----

```

Xinha._lc({key: 'button_bold', string: ["ed_buttons_main.gif",3,2]});
```

It is also possible to translate objects, this is used to internationalize the bold, italic... toolbar-buttons.

The key is used to lookup the string (which is actually an object) in the l10n-file.

