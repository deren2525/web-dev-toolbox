<template>
  <ContentPage eyebrow="About data" title="データの取得と処理について"
    ><p>各ツールが扱うデータの取得元、保存方法、処理場所について説明します。</p>
    <h2>ブラウザ情報</h2>
    <p>
      画面サイズやViewportなどはWeb
      APIから直接取得します。ブラウザ名やOSはUser-Agent等から推定するため、実際の環境と一致しない場合があります。前回との差分に使う情報は、このブラウザのlocalStorageに保存します。
    </p>
    <h2>生成画像</h2>
    <p>
      画像とZIPファイルは利用者のブラウザ内で生成します。生成内容や設定を運営者のデータベースへ保存する機能はありません。
    </p>
    <h2>文字列・データ変換</h2>
    <p>
      JSON、JWT、Base64、URL、Unixタイムスタンプの変換、UUID・ハッシュ生成、文字数集計は、JavaScriptの標準APIおよびWeb
      APIを使ってブラウザ内で処理します。入力した文字列やファイルと処理結果をサーバーへ送信または保存する機能はありません。
    </p>
    <h2>クリップボード</h2>
    <p>利用者がコピー操作を行った場合に限り、変換結果を端末のクリップボードへ書き込みます。</p>
    <h2>取得できない情報</h2>
    <p>
      ブラウザの制限などで取得できない値は、推測で補わず「不明」または「取得できません」と表示します。
    </p></ContentPage
  >
</template>
<script setup lang="ts">
useSiteSeo({
  title: 'データの取得と処理について｜Web Dev Toolbox',
  description:
    'ブラウザ情報、生成画像、文字列変換の取得元、処理場所、保存方法と制限事項を説明します。',
  path: '/about-data/',
  type: 'article',
})
</script>
