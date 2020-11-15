# よくある質問

[Version English]({{ site.baseurl }}/trac/FrequentlyAskedQuestions.html).
[Version française]({{ site.baseurl }}/trac/FrequentlyAskedQuestionsFrance.html).

まずはじめに、このページは常に成長しているので、ここでわからないことがあったり、ここにない事を考えていたりする場合、フォーラムの[ディスカッションフォーラム](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=138)にメッセージを投函してください。

## プロジェクト上のこと

 * Q: 私はどのようにプロジェクトに協力できますか？[Developers](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=3)
 * Q: 寄付ページに掲載するチャンスを設けてもらえましたか？ [Donations](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=81)

## インストール
 
 * Q: すぐに始めるには、どうしたらいいですか？ [Newbie](http://xinha.python-hosting.com/wiki/NewbieGuide)
 * Q: 入門ガイドに沿ってやったのですが、Xinhaが何もロードしません。
   * A: _editor_urlが正しく設定されているか、すべてのファイルがロード可能か確認してください。 
   * A: `JavaScript`エラーが発生していないかチェックしてください。
 * Q: Webサーバが必要なのですか、それとも、!file://でスクリプトを使うことができるのですか？
   * A: Webサーバは必要です。いくつかのプラグインと英語以外の言語が動かなくていいならかまいませんが...
 * Q: Why get the changes only submitted when switching into HTML mode?
   * A: もしフォームを `JavaScript` で送信している場合(form.submit())、id="submit"と指定されたボタンを同じフォーム内に置いてはいけません。
 * Q: どうすればデフォルトエディタのCSSを変更できますか？([default CSS](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=455))

## エディタの使い方

 * Q: どうやって<br>タグを挿入するのですか？[Carriage return](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=97)

## コンフィギュレーション

 * Q: 私のニーズにフィットするエディタを作るためには、どんなオプションがありますか？ [Wiki: List of available options]({{ site.baseurl }}/trac/Documentation/ConfigVariablesList.html)
 * Q: どうやってツールバーをカスタマイズすればいいですか？[Wiki: xinha_config.toolbar]({{ site.baseurl }}/trac/Documentation/ConfigVariablesList.html#xinha_configtoolbar)
 * Q: どうすれば、h1タグやその他のタグを私のサイトで表示されるのと同じスタイルにすることができますか？[Wiki: xinha_config.pageStyleSheets/xinha_config.pageStyles]({{ site.baseurl }}/trac/Documentation/ConfigVariablesList.html#xinha_configpageStyleSheets)
 * Q: どうすればデフォルトの表示フォントを変更できますか？[Font](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=116)
 * Q: Xinhaをフルスクリーンモードで起動することはできますか？[Full screen](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=102)
 * Q: どうすればパスバーを隠せますか？ [Path bar](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=3)
 * Q: どうすればエディタをリサイズできますか？ [Resize](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=244)

 
## 不具合

 * Q: 入門文書に書いてあることをすべて試しましたが、テキストが英語のままです。どうすれば私の言語ファイルを使うことができるのですか？
   * A1: あなたの言語ファイルが最新か確認してください。
   * A2: 翻訳システム(i18n)はWebサーバでのみ機能します。
 * Q: テキストエリアに打ち込んだ自分の文字がおかしな表示になる。
   * A: そんな場合は、テキストエリアにエンティティ化データを打ち込むべきでしょう。 [Entitize data]({{ site.baseurl }}/trac/Entize.html)

## 開発者

 * Q: Xinhaのすべての関数リストはここにありますか？ [Xinha functions](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=137)
 * Q: どのようにして、エディタ内のデータを更新すればいいですか？[setHTML(), getHTML()...](http://xinha.gogo.co.nz/punbb/viewtopic.php?id=224)

## プラグインについて

 * Q: プラグイン作成のチュートリアルはありますか？
   * A: もうすぐだと思ってご期待ください...
