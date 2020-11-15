## 入門ガイド

[Version English]({{ site.baseurl }}/trac/NewbieGuide.html).
[Version française]({{ site.baseurl }}/trac/NewbieGuideFrance.html).

まずはじめに、このページは常に成長しているので、ここでわからないことがあったり、Xinhaでもっと多くのことがしたい場合、フォーラム内の[http://xinha.gogo.co.nz/punbb/viewtopic.php?pid=255#p255 Newbie Guide スレッド]にメッセージを投函してください。

## Getting Started

ダウンロードページからXinhaファイルをダウンロードしなければなりません。ここでは最終安定リリースを推奨します。たしかに、ナイトリーリリースはいくらか強化されているかもしれませんが、同時に、壊れている所がある可能性もあるため、入門が非常に困難になるでしょう。

## ファイルのインストール

ダウンロードした内容をWebプロジェクトにコピーします。それらは、"xinha/"などの単一ディレクトリに置きましょう。これは、あなたの"xinha"ディレクトリが、"examples", "images", "lang", "plugins", "popups", "skins" およびファイル群を含むということです。ここでexamplesフォルダを残しておくことをお勧めします。あとでカスタマイズしたくなったとき、それが素晴らしいリファレンスになるので。examplesの実例は、もうすでに、実行して閲覧できるようになっています。あなたのWebプロジェクトの"xinha/examples/full_example.html"を見てください。

## ページ内のコード

既存のテキストエリアをWYSIWYGなX-Areaに拡張するよう切り替えるには、あなたのページに以下のコードが必要です。

順番どおりに、あなたのページにこのコードを置きましょう。（できれば<head></head>セクションに）

```
#!text/html
  <script type="text/javascript">
    _editor_url  = "/xinha/"  // (preferably absolute) URL (including trailing slash) where Xinha is installed
    _editor_lang = "en";      // And the language we need to use in the editor.
  </script>
  <script type="text/javascript" src="/xinha/XinhaCore.js"></script>
```

もし異なるディレクトリを使っているなら、上記コード内の_editor_urlと`XinhaCore`.jsの両方を、配置にしたがって、確実に変更しましょう。

いくらかのコンフィグコードも、このページに含む必要があるでしょう。それには二つの方法があります。

'''1)''' 下に示すテキストを "my_config.js" という新規ファイルにコピーし、そのファイルをこんな記述を利用して取り込みます。
```
#!text/html
<script type="text/javascript" src="/xinha/my_config.js"></script>
```
こうすれば、多くのページにある多くのX-Areaを、すべて同じ設定で使えるようになります。

'''2)''' 下に示すコードを、あなたのページにそのままコピーします。この場合、エディタを動かしたい各々のページにコピーしておく必要がありますが、それぞれを望みにあわせて個別にカスタマイズすることができます。'''この二番目の選択を取った場合、以下のコードは必ず、<script type="text/javascript"> </script>で囲む必要があります。'''

```
    xinha_editors = null;
    xinha_init    = null;
    xinha_config  = null;
    xinha_plugins = null;

    // This contains the names of textareas we will make into Xinha editors
    xinha_init = xinha_init ? xinha_init : function()
    {
      /** STEP 1 ***************************************************************
       * First, what are the plugins you will be using in the editors on this
       * page.  List all the plugins you will need, even if not all the editors
       * will use all the plugins.
       *
       * The list of plugins below is a good starting point, but if you prefer
       * a must simpler editor to start with then you can use the following 
       * 
       * xinha_plugins = xinha_plugins ? xinha_plugins : [ ];
       *
       * which will load no extra plugins at all.
       ************************************************************************/

      xinha_plugins = xinha_plugins ? xinha_plugins :
      [
       'CharacterMap',
       'ContextMenu',
       'FullScreen',
       'ListType',
       'SpellChecker',
       'Stylist',
       'SuperClean',
       'TableOperations'
      ];
             // THIS BIT OF JAVASCRIPT LOADS THE PLUGINS, NO TOUCHING  :)
             if(!Xinha.loadPlugins(xinha_plugins, xinha_init)) return;

      /** STEP 2 ***************************************************************
       * Now, what are the names of the textareas you will be turning into
       * editors?
       ************************************************************************/

      xinha_editors = xinha_editors ? xinha_editors :
      [
        'myTextArea',
        'anotherOne'
      ];

      /** STEP 3 ***************************************************************
       * We create a default configuration to be used by all the editors.
       * If you wish to configure some of the editors differently this will be
       * done in step 5.
       *
       * If you want to modify the default config you might do something like this.
       *
       *   xinha_config = new Xinha.Config();
       *   xinha_config.width  = '640px';
       *   xinha_config.height = '420px';
       *
       *************************************************************************/

       xinha_config = xinha_config ? xinha_config() : new Xinha.Config();

      /** STEP 4 ***************************************************************
       * We first create editors for the textareas.
       *
       * You can do this in two ways, either
       *
       *   xinha_editors   = Xinha.makeEditors(xinha_editors, xinha_config, xinha_plugins);
       *
       * if you want all the editor objects to use the same set of plugins, OR;
       *
       *   xinha_editors = Xinha.makeEditors(xinha_editors, xinha_config);
       *   xinha_editors['myTextArea'].registerPlugins(['Stylist','FullScreen']);
       *   xinha_editors['anotherOne'].registerPlugins(['CSS','SuperClean']);
       *
       * if you want to use a different set of plugins for one or more of the
       * editors.
       ************************************************************************/

      xinha_editors   = Xinha.makeEditors(xinha_editors, xinha_config, xinha_plugins);

      /** STEP 5 ***************************************************************
       * If you want to change the configuration variables of any of the
       * editors,  this is the place to do that, for example you might want to
       * change the width and height of one of the editors, like this...
       *
       *   xinha_editors.myTextArea.config.width  = '640px';
       *   xinha_editors.myTextArea.config.height = '480px';
       *
       ************************************************************************/


      /** STEP 6 ***************************************************************
       * Finally we "start" the editors, this turns the textareas into
       * Xinha editors.
       ************************************************************************/

      Xinha.startEditors(xinha_editors);
    }

    Xinha._addEvent(window,'load', xinha_init); // this executes the xinha_init function on page load 
                                                // and does not interfere with window.onload properties set by other scripts

```


## ページ内のコード さらに

あなたが変換したいテキストエリアには、かならず、以下のように"id"が設定されているようにしなければなりません。

```
#!text/html
<textarea id="newbiearea1" name="newbiearea1" rows="10" cols="50" style="width: 100%"></textarea>
```

idはnameと同じでかまいませんが、ページ全体を通じて、そのIDを持つものは必ずひとつしか登場しないように注意してください。

あなたは、"my_config.js"ファイルに貼り付けたコード内（あるいは別の方法を取っているなら、<head></head>内）で、"Step2"と示された、どのエディタがコンバートされるかを列挙した部分を、少々書き換える必要があります。

例の中では、'myTextArea'と'anotherOne'の二つが列挙されていますが、'myTextArea'を、テキストエリアに設定した何らかのIDに変更する必要があるでしょう。この例では、それを'newbiearea1'にしています。また、いまのところ単一のエリアを変換するだけなら、'anotherOne'への参照を削除する必要もあるでしょう。（'''この箇所をよく見て、値がカンマで区切られていて、でも、最後の値の後ろにカンマは無い、というようにしましょう'''）あなたのコードはこんな風になったと思います。

```
      /** STEP 2 ***************************************************************
       * Now, what are the names of the textareas you will be turning into
       * editors?
       ************************************************************************/

      xinha_editors = xinha_editors ? xinha_editors :
      [
        'newbiearea1'
      ];
```

## もうできた

ページのロードが完了すると、すぐに、あなたのX-Areaが出現することでしょう。

あなたは（望むならすぐにでも）、エディタをコンフィグしにかかることができます。[wiki:Documentation/ConfigVariablesList 設定可能オプション一覧]で、オプション設定を見つけることができます。

もし何か問題に遭遇した場合は、フォーラムの[http://xinha.gogo.co.nz/punbb/viewtopic.php?pid=255#p255 Newbie Guide スレッド]の続きに投函することを覚えておいてください。私たちはそれを解決し、誰一人として同じことに没入させまいと約束するため、我々のベストを尽くします！

