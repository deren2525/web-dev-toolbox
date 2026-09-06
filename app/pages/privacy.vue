<template>
  <ContentPage eyebrow="Privacy policy" title="プライバシーポリシー"
    ><p>Web Dev Toolboxにおける利用者情報の取り扱いについて説明します。</p>
    <h2>ツール内のデータ処理</h2>
    <p>
      画像・ZIP・UUID・ハッシュの生成、JSON・JWT・Base64・URL・Unixタイムスタンプの変換、文字数・バイト数の集計は利用者のブラウザ内で行われます。入力した文字列やファイル、生成物、変換結果を運営者のサーバーやデータベースへ送信・保存する機能はありません。
    </p>
    <h2>localStorageとクリップボード</h2>
    <p>
      Browser
      Checkerは前回環境との差分表示にlocalStorageを利用します。コピー操作を行った場合は、選択した結果を端末のクリップボードへ書き込みます。
    </p>
    <h2>アクセス情報</h2>
    <p>
      本サイトはFirebase
      Hostingを利用します。サービス提供、セキュリティ確保、不正利用防止などのため、IPアドレス、端末情報、アクセス日時やリクエスト情報がGoogleにより処理される場合があります。
    </p>
    <h2>アクセス解析・広告</h2>
    <p>アクセス解析や広告を導入する場合は、本ページを実際の利用状況に合わせて更新します。</p>
    <h2>改定</h2>
    <p>必要に応じて内容を変更します。変更後の内容は本ページへの掲載時から有効です。</p>
    <p>
      <small>制定日：2026年9月7日<br />最終改定日：2026年9月7日</small>
    </p></ContentPage
  >
</template>
<script setup lang="ts">
useSiteSeo({
  title: 'プライバシーポリシー｜Web Dev Toolbox',
  description:
    'Web Dev Toolboxにおけるツール内処理、localStorage、アクセス情報の取り扱いを説明します。',
  path: '/privacy/',
  type: 'article',
})
</script>
