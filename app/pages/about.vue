<template>
  <ContentPage eyebrow="About" title="このサイトについて">
    <p>
      Web Dev
      Toolboxは、Web開発・テスト・デバッグで必要になる作業を、ブラウザからすぐに行える無料ツール集です。
    </p>
    <h2>運営方針</h2>
    <p>
      操作を妨げない分かりやすい画面、正しい結果、取得方法と制限事項の説明を大切にしています。会員登録や問い合わせ機能は設けていません。
    </p>
    <h2>提供中のツール</h2>
    <p>現在、環境確認、画像生成、データ整形・変換に使える10個のツールを提供しています。</p>
    <ul>
      <li>
        <NuxtLink to="/tools/browser-checker/">ブラウザ情報確認ツール</NuxtLink> —
        ブラウザ、OS、画面サイズ、User-Agentを確認
      </li>
      <li>
        <NuxtLink to="/tools/dummy-image-generator/">ダミー画像生成ツール</NuxtLink> —
        指定サイズ・容量・形式のテスト画像を生成
      </li>
      <li>
        <NuxtLink to="/tools/json-formatter/">JSON整形・構文チェックツール</NuxtLink> —
        JSONの整形、圧縮、構文確認
      </li>
      <li>
        <NuxtLink to="/tools/base64/">Base64エンコード・デコードツール</NuxtLink> —
        日本語を含む文字列を相互変換
      </li>
      <li>
        <NuxtLink to="/tools/url-encoder/">URLエンコード・デコードツール</NuxtLink> —
        URLと文字列をパーセントエンコード
      </li>
      <li>
        <NuxtLink to="/tools/timestamp-converter/">Unixタイムスタンプ変換ツール</NuxtLink> —
        Unix時間と日時を相互変換
      </li>
      <li><NuxtLink to="/tools/uuid-generator/">UUID生成ツール</NuxtLink> — UUID v4を一括生成</li>
      <li>
        <NuxtLink to="/tools/jwt-decoder/">JWTデコーダー</NuxtLink> —
        Header、Payload、有効期限を確認
      </li>
      <li>
        <NuxtLink to="/tools/hash-generator/">ハッシュ生成ツール</NuxtLink> —
        テキストやファイルからSHAハッシュを生成
      </li>
      <li>
        <NuxtLink to="/tools/text-counter/">文字数・バイト数カウンター</NuxtLink> —
        文字数、UTF-8バイト数、行数、単語数を集計
      </li>
    </ul>
  </ContentPage>
</template>
<script setup lang="ts">
useSiteSeo({
  title: 'このサイトについて｜Web Dev Toolbox',
  description: 'Web開発・テスト向け無料ツール集「Web Dev Toolbox」の目的と運営方針を説明します。',
  path: '/about/',
  type: 'article',
})
</script>
