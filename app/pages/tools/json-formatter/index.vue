<template>
  <UtilityPage
    eyebrow="JSON Formatter"
    title="JSON整形・構文チェックツール"
    description="JSONを読みやすく整形・圧縮し、構文エラーをブラウザ上で確認できます。"
    :related-tools="relatedTools"
  >
    <template #tool
      ><section class="grid gap-4 lg:grid-cols-2" aria-label="JSON整形ツール">
        <div>
          <label for="json-input" class="mb-2 block font-black text-[#102a43]">入力JSON</label
          ><textarea
            id="json-input"
            v-model="input"
            class="min-h-80 w-full resize-y rounded-lg border border-slate-300 bg-white p-4 font-mono text-sm leading-6 focus:border-teal-700 focus:outline-none"
            spellcheck="false"
            placeholder='{"name":"Web Dev Toolbox"}'
          />
        </div>
        <div>
          <label for="json-output" class="mb-2 block font-black text-[#102a43]"
            >変換結果 <small class="font-normal text-slate-500">クリックでコピー</small></label
          ><textarea
            id="json-output"
            :value="output"
            class="min-h-80 w-full cursor-copy resize-y rounded-lg border border-slate-300 bg-slate-50 p-4 font-mono text-sm leading-6 hover:border-teal-600"
            readonly
            title="クリックして結果をコピー"
            @click="output && copy()"
            @keydown.enter.prevent="output && copy()"
          />
        </div>
        <div class="lg:col-span-2">
          <ToolActions
            primary="整形する"
            secondary="圧縮する"
            @primary="convert(true)"
            @secondary="convert(false)"
          />
          <p
            class="mt-3 min-h-6 text-sm"
            :class="error ? 'text-red-700' : 'text-teal-700'"
            aria-live="polite"
          >
            {{ error || status }}
          </p>
          <button
            v-if="output"
            type="button"
            class="text-sm font-bold text-teal-700 underline underline-offset-4"
            @click="copy"
          >
            結果をコピー
          </button>
        </div>
      </section></template
    >
    <template #features
      ><ul>
        <li>JSONを2スペースインデントで整形</li>
        <li>改行や余分な空白を除いて圧縮</li>
        <li>標準JSONとして解析できるか構文確認</li>
      </ul></template
    >
    <template #usage
      ><ol>
        <li>JSONを入力欄へ貼り付けます。</li>
        <li>「整形する」または「圧縮する」を選びます。</li>
        <li>結果をコピーして利用します。</li>
      </ol></template
    >
    <template #examples
      ><p>
        APIレスポンスや設定値を貼り付けると、ネスト構造を読みやすく確認できます。エラーが表示された場合は、引用符、カンマ、括弧の対応を確認してください。
      </p></template
    >
    <template #data
      ><p>
        JSON.parseとJSON.stringifyを使い、入力内容はブラウザ内で処理します。コメントや末尾のカンマは標準JSONではないためエラーになります。
      </p></template
    >
    <template #references
      ><p>
        <a
          href="https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON"
          target="_blank"
          rel="noopener noreferrer"
          >MDN: JSON</a
        >でJSON.parseとJSON.stringifyの仕様を確認できます。
      </p></template
    >
    <template #faq
      ><h3>構文チェックにも使えますか？</h3>
      <p>
        はい。解析できない場合はエラー位置を含むブラウザのエラーメッセージを表示します。
      </p></template
    >
  </UtilityPage>
</template>
<script setup lang="ts">
const { input, output, error, status, convert, copy } = useJsonFormatter()
const relatedTools = [
  {
    to: '/tools/base64/',
    title: 'Base64エンコード・デコード',
    reason: 'JSON内のBase64形式データを確認・変換する',
  },
]
useSiteSeo({
  title: 'JSON整形・構文チェックツール｜JSON Formatter',
  description:
    'JSONを読みやすく整形・圧縮し、構文エラーを無料で確認できるブラウザ完結型JSON Formatterです。',
  path: '/tools/json-formatter/',
})
</script>
