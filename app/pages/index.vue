<template>
  <main class="px-3 py-4 sm:px-4 sm:py-8">
    <div class="mx-auto w-full max-w-6xl">
      <section class="border-b border-teal-100 bg-white px-2 py-10 text-center md:px-8 md:py-16">
        <p class="m-0 text-sm font-black uppercase text-teal-700">Web development utilities</p>
        <h1 class="mt-2 mb-4 text-3xl leading-tight font-black text-[#102a43] md:text-4xl">
          Web開発・テストに役立つ無料ツール
        </h1>
        <p class="mx-auto mt-0 mb-0 max-w-3xl text-base leading-8 text-[#334e68] md:text-lg">
          ブラウザ環境の確認、テスト画像の生成、JSONや文字列の変換を、登録不要でブラウザからすぐに行えます。結果の取得方法や制限事項も確認できます。
        </p>
      </section>
      <section class="mt-4" aria-labelledby="tools-title">
        <h2 id="tools-title" class="sr-only">ツール一覧</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <ToolCard v-for="tool in tools" :key="tool.to" v-bind="tool" />
        </div>
      </section>
      <section class="mt-4 rounded-lg border border-slate-300 bg-white p-5 md:p-8">
        <h2 class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
          安心して使える開発者向けツール
        </h2>
        <p class="mt-3 mb-0 text-sm leading-7 text-[#334e68] md:text-base">
          各ツールは主要な処理をブラウザ内で行います。取得値が直接取得か推定かを区別し、判断できない情報を断定しません。
        </p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
const tools = [
  {
    to: '/tools/browser-checker/',
    label: 'Browser Checker',
    title: 'ブラウザ情報確認ツール',
    description:
      'ブラウザ、OS、User-Agent、画面サイズ、Viewportなどを確認し、問い合わせ用レポートを作成します。',
  },
  {
    to: '/tools/dummy-image-generator/',
    label: 'Dummy Image Generator',
    title: 'ダミー画像生成ツール',
    description:
      'サイズ・容量・形式・枚数を指定し、テスト用画像を生成してまとめてダウンロードできます。',
  },
  {
    to: '/tools/json-formatter/',
    label: 'JSON',
    title: 'JSON整形・構文チェックツール',
    description: 'JSONを読みやすく整形・圧縮し、構文エラーを確認できます。',
  },
  {
    to: '/tools/base64/',
    label: 'Base64',
    title: 'Base64エンコード・デコード',
    description: '日本語を含む文字列をBase64へ相互変換します。',
  },
  {
    to: '/tools/url-encoder/',
    label: 'URL',
    title: 'URLエンコード・デコード',
    description: '文字列やURLをパーセントエンコードへ相互変換します。',
  },
  {
    to: '/tools/timestamp-converter/',
    label: 'Timestamp',
    title: 'Unixタイムスタンプ変換',
    description: 'Unix時間と日時を秒・ミリ秒で相互変換します。',
  },
  {
    to: '/tools/uuid-generator/',
    label: 'UUID',
    title: 'UUID生成ツール',
    description: 'UUID v4を最大100件までまとめて生成します。',
  },
  {
    to: '/tools/jwt-decoder/',
    label: 'JWT',
    title: 'JWTデコーダー',
    description: 'JWTのHeader・Payload・有効期限をブラウザ内で確認します。',
  },
  {
    to: '/tools/hash-generator/',
    label: 'Hash',
    title: 'ハッシュ生成ツール',
    description: 'テキストやファイルからSHA-256・SHA-384・SHA-512を生成します。',
  },
  {
    to: '/tools/text-counter/',
    label: 'Text Counter',
    title: '文字数・バイト数カウンター',
    description: '文字数、UTF-8バイト数、行数、単語数をリアルタイムで集計します。',
  },
]
useSiteSeo({
  title: 'Web Dev Toolbox｜Web開発・テスト向け無料ツール',
  description:
    'ブラウザ情報確認、画像生成、JSON・JWT・Base64・URL変換、ハッシュ生成、文字数集計などを利用できる無料ツール集です。',
  path: '/',
})
</script>
