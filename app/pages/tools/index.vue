<template>
  <main class="px-3 py-4 sm:px-4 sm:py-8">
    <div class="mx-auto w-full max-w-6xl">
      <SiteBreadcrumbs current="ツール一覧" />
      <header class="mb-6">
        <p class="m-0 text-sm font-black uppercase text-teal-700">Tools</p>
        <h1 class="mt-2 mb-3 text-3xl font-black text-[#102a43]">ツール一覧</h1>
        <p class="m-0 text-[#334e68]">Web開発・テストに使えるツールを目的から選べます。</p>
      </header>
      <div class="grid gap-4 md:grid-cols-2">
        <ToolCard v-for="tool in tools" :key="tool.to" v-bind="tool" />
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
const tools = [
  {
    to: '/tools/browser-checker/',
    label: 'Environment',
    title: 'ブラウザ情報確認ツール',
    description: 'OS、User-Agent、画面サイズなどの環境情報を確認します。',
  },
  {
    to: '/tools/dummy-image-generator/',
    label: 'Image',
    title: 'ダミー画像生成ツール',
    description: '指定サイズ・容量・形式のテスト画像を生成します。',
  },
  {
    to: '/tools/json-formatter/',
    label: 'JSON',
    title: 'JSON整形・構文チェックツール',
    description: 'JSONの整形、圧縮、構文チェックを行います。',
  },
  {
    to: '/tools/base64/',
    label: 'Base64',
    title: 'Base64エンコード・デコード',
    description: '文字列とBase64を相互変換します。',
  },
  {
    to: '/tools/url-encoder/',
    label: 'URL',
    title: 'URLエンコード・デコード',
    description: 'URLや文字列をパーセントエンコードへ変換します。',
  },
  {
    to: '/tools/timestamp-converter/',
    label: 'Timestamp',
    title: 'Unixタイムスタンプ変換',
    description: 'Unix時間と日時を相互変換します。',
  },
  {
    to: '/tools/uuid-generator/',
    label: 'UUID',
    title: 'UUID生成ツール',
    description: 'UUID v4を一括生成します。',
  },
  {
    to: '/tools/jwt-decoder/',
    label: 'JWT',
    title: 'JWTデコーダー',
    description: 'JWTのHeader、Payload、有効期限を確認します。',
  },
  {
    to: '/tools/hash-generator/',
    label: 'Hash',
    title: 'ハッシュ生成ツール',
    description: 'テキストやファイルからSHAハッシュを生成します。',
  },
  {
    to: '/tools/text-counter/',
    label: 'Text',
    title: '文字数・バイト数カウンター',
    description: '文字数、UTF-8バイト数、行数、単語数を集計します。',
  },
]
useSiteSeo({
  title: 'Web開発ツール一覧｜Web Dev Toolbox',
  description:
    'ブラウザ情報確認、画像生成、データ変換、ハッシュ生成、文字数集計など、Web開発やテストに使える無料ツールの一覧です。',
  path: '/tools/',
})
</script>
