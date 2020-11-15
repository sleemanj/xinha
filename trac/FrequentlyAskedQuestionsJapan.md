# よくある質問

[Version English]({{ site.baseurl }}/trac/FrequentlyAskedQuestions.html).
[Version française]({{ site.baseurl }}/trac/FrequentlyAskedQuestionsFrance.html).

まずはじめに、このページは常に成長しているので、ここでわからないことがあったり、ここにない事を考えていたりする場合、フォーラムの[http://xinha.gogo.co.nz/punbb/viewtopic.php?id=138 ディスカッションフォーラム]にメッセージを投函してください。

## プロジェクト上のこと

 * Q: 私はどのようにプロジェクトに協力できますか？[http://xinha.gogo.co.nz/punbb/viewtopic.php?id=3 Developers]
 * Q: 寄付ページに掲載するチャンスを設けてもらえましたか？ [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=81 Donations]

## インストール
 
 * Q: すぐに始めるには、どうしたらいいですか？ [http://xinha.python-hosting.com/wiki/NewbieGuide Newbie]
 * Q: 入門ガイドに沿ってやったのですが、Xinhaが何もロードしません。
   * A: _editor_urlが正しく設定されているか、すべてのファイルがロード可能か確認してください。 
   * A: `JavaScript`エラーが発生していないかチェックしてください。
 * Q: Webサーバが必要なのですか、それとも、!file://でスクリプトを使うことができるのですか？
   * A: Webサーバは必要です。いくつかのプラグインと英語以外の言語が動かなくていいならかまいませんが...
 * Q: Why get the changes only submitted when switching into HTML mode?
   * A: もしフォームを `JavaScript` で送信している場合(form.submit())、id="submit"と指定されたボタンを同じフォーム内に置いてはいけません。
 * Q: どうすればデフォルトエディタのCSSを変更できますか？([http://xinha.gogo.co.nz/punbb/viewtopic.php?id=455 default CSS])

## エディタの使い方

 * Q: どうやって<br>タグを挿入するのですか？[http://xinha.gogo.co.nz/punbb/viewtopic.php?id=97 Carriage return]

## コンフィギュレーション

 * Q: 私のニーズにフィットするエディタを作るためには、どんなオプションがありますか？ [wiki:Documentation/ConfigVariablesList Wiki: List of available options]
 * Q: どうやってツールバーをカスタマイズすればいいですか？[wiki:Documentation/ConfigVariablesList#xinha_configtoolbar Wiki: xinha_config.toolbar]
 * Q: どうすれば、h1タグやその他のタグを私のサイトで表示されるのと同じスタイルにすることができますか？[wiki:Documentation/ConfigVariablesList#xinha_configpageStyleSheets Wiki: xinha_config.pageStyleSheets/xinha_config.pageStyles]
 * Q: どうすればデフォルトの表示フォントを変更できますか？[http://xinha.gogo.co.nz/punbb/viewtopic.php?id=116 Font]
 * Q: Xinhaをフルスクリーンモードで起動することはできますか？[http://xinha.gogo.co.nz/punbb/viewtopic.php?id=102 Full screen]
 * Q: どうすればパスバーを隠せますか？ [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=3 Path bar]
 * Q: どうすればエディタをリサイズできますか？ [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=244 Resize]

 
## 不具合

 * Q: 入門文書に書いてあることをすべて試しましたが、テキストが英語のままです。どうすれば私の言語ファイルを使うことができるのですか？
   * A1: あなたの言語ファイルが最新か確認してください。
   * A2: 翻訳システム(i18n)はWebサーバでのみ機能します。
 * Q: テキストエリアに打ち込んだ自分の文字がおかしな表示になる。
   * A: そんな場合は、テキストエリアにエンティティ化データを打ち込むべきでしょう。 [Entitize data]({{ site.baseurl }}/trac/Entize.html)

## 開発者

 * Q: Xinhaのすべての関数リストはここにありますか？ [http://xinha.gogo.co.nz/punbb/viewtopic.php?id=137 Xinha functions]
 * Q: どのようにして、エディタ内のデータを更新すればいいですか？[http://xinha.gogo.co.nz/punbb/viewtopic.php?id=224 setHTML(), getHTML()...]

## プラグインについて

 * Q: プラグイン作成のチュートリアルはありますか？
   * A: もうすぐだと思ってご期待ください...