<template>
  <UtilityPage
    eyebrow="Text Counter"
    title="文字数・バイト数カウンター"
    description="入力した文章の文字数、UTF-8バイト数、行数、単語数をリアルタイムで確認できます。"
    :related-tools="relatedTools"
  >
    <template #tool>
      <section>
        <label for="counter-input" class="mb-2 block font-black text-[#102a43]"
          >カウントするテキスト</label
        >
        <textarea
          id="counter-input"
          v-model="input"
          class="min-h-72 w-full resize-y rounded-lg border border-slate-300 p-4 text-sm leading-7"
          placeholder="ここに文章を入力してください"
        />
        <div class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div
            v-for="item in stats"
            :key="item.label"
            class="rounded-lg border border-slate-300 bg-slate-50 p-4"
          >
            <span class="block text-xs font-bold text-slate-500">{{ item.label }}</span
            ><button
              type="button"
              class="mt-2 cursor-copy text-2xl font-black text-[#102a43]"
              title="クリックして値だけコピー"
              @click="copy(item.value)"
            >
              {{ item.value.toLocaleString() }}
            </button>
          </div>
        </div>
        <p class="mt-3 min-h-6 text-sm text-teal-700" aria-live="polite">{{ status }}</p>
        <ToolActions primary="テキストをクリア" @primary="clear" />
      </section>
    </template>
    <template #features
      ><ul>
        <li>Unicodeコードポイント単位の文字数を集計</li>
        <li>UTF-8へ変換した場合のバイト数を集計</li>
        <li>改行区切りの行数と空白区切りの単語数を集計</li>
      </ul></template
    >
    <template #usage
      ><p>
        文章を入力すると自動で集計します。各数値をクリックすると、ラベルを含めず値だけコピーできます。
      </p></template
    >
    <template #examples
      ><p>
        データベースやAPIの入力上限確認には、仕様が文字数とバイト数のどちらを指すか確認してください。結合絵文字は見た目が1文字でも複数として数える場合があります。
      </p></template
    >
    <template #data
      ><p>
        JavaScriptとTextEncoderを使ってブラウザ内で集計します。入力内容はサーバーへ送信・保存しません。
      </p></template
    >
    <template #references
      ><p>
        <a
          href="https://developer.mozilla.org/ja/docs/Web/API/TextEncoder"
          target="_blank"
          rel="noopener noreferrer"
          >MDN: TextEncoder</a
        >でUTF-8エンコード時のバイト列について確認できます。
      </p></template
    >
    <template #faq
      ><h3>文字数とバイト数が違うのはなぜですか？</h3>
      <p>
        UTF-8では文字によって必要なバイト数が異なります。たとえば多くの日本語文字は1文字を3バイトで表現します。
      </p></template
    >
  </UtilityPage>
</template>

<script setup lang="ts">
const { input, status, stats, copy, clear } = useTextCounter()
const relatedTools = [
  {
    to: '/tools/base64/',
    title: 'Base64エンコード・デコード',
    reason: 'テキストをBase64形式へ変換する',
  },
  {
    to: '/tools/url-encoder/',
    title: 'URLエンコード・デコード',
    reason: 'URLに含めた場合の文字列を確認する',
  },
  {
    to: '/tools/json-formatter/',
    title: 'JSON整形・構文チェック',
    reason: 'JSON文字列を読みやすく整形する',
  },
]
useSiteSeo({
  title: '文字数・バイト数カウンター｜UTF-8・行数・単語数',
  description: '文章の文字数、UTF-8バイト数、行数、単語数をブラウザ内でリアルタイム集計します。',
  path: '/tools/text-counter/',
})
</script>
