<template>
  <UtilityPage
    eyebrow="Hash"
    title="ハッシュ生成ツール"
    description="テキストまたはファイルからSHA-256・SHA-384・SHA-512のハッシュ値を生成できます。"
    :related-tools="relatedTools"
  >
    <template #tool>
      <section>
        <div class="mb-4 flex flex-wrap gap-3">
          <label class="font-black text-[#102a43]"
            >アルゴリズム<select
              v-model="algorithm"
              class="ml-2 h-11 rounded-lg border border-slate-300 bg-white px-3"
            >
              <option>SHA-256</option>
              <option>SHA-384</option>
              <option>SHA-512</option>
            </select></label
          >
        </div>
        <label for="hash-input" class="mb-2 block font-black text-[#102a43]">テキスト</label>
        <textarea
          id="hash-input"
          v-model="input"
          class="min-h-48 w-full resize-y rounded-lg border border-slate-300 p-4 font-mono text-sm leading-6"
        />
        <div class="my-4 flex items-center gap-3">
          <span class="h-px flex-1 bg-slate-200"></span
          ><span class="text-sm text-slate-500">または</span
          ><span class="h-px flex-1 bg-slate-200"></span>
        </div>
        <label
          for="hash-file"
          class="mb-4 block rounded-lg border border-dashed border-slate-300 p-4 text-sm text-[#334e68]"
          >ファイルを選択<input
            id="hash-file"
            type="file"
            class="mt-2 block w-full text-sm"
            @change="selectFile"
        /></label>
        <ToolActions primary="ハッシュを生成" @primary="generate" />
        <p
          class="mt-3 min-h-6 text-sm"
          :class="error ? 'text-red-700' : 'text-teal-700'"
          aria-live="polite"
        >
          {{ error || status }}
        </p>
        <div v-if="output">
          <label for="hash-output" class="mb-2 block font-black text-[#102a43]"
            >生成結果 <small class="font-normal text-slate-500">クリックでコピー</small></label
          ><textarea
            id="hash-output"
            :value="output"
            readonly
            class="min-h-28 w-full cursor-copy resize-y rounded-lg border border-slate-300 bg-slate-50 p-4 font-mono text-sm leading-6 hover:border-teal-600"
            @click="copy"
            @keydown.enter.prevent="copy"
            @keydown.space.prevent="copy"
          />
        </div>
      </section>
    </template>
    <template #features
      ><ul>
        <li>テキストまたはファイルのハッシュを生成</li>
        <li>SHA-256、SHA-384、SHA-512に対応</li>
        <li>小文字の16進数として結果を表示</li>
      </ul></template
    >
    <template #usage
      ><p>
        アルゴリズムを選び、テキストを入力するかファイルを選択してハッシュ値を生成します。ファイルを選択した場合はファイルを優先します。
      </p></template
    >
    <template #examples
      ><p>
        配布元が示したチェックサムとダウンロードファイルの結果を比較すると、ファイルが同一か確認できます。1文字でも異なれば通常は別の値になります。
      </p></template
    >
    <template #data
      ><p>
        Web Crypto
        APIを使ってブラウザ内で計算します。入力したテキストやファイルはサーバーへ送信・保存しません。
      </p></template
    >
    <template #references
      ><p>
        <a
          href="https://developer.mozilla.org/ja/docs/Web/API/SubtleCrypto/digest"
          target="_blank"
          rel="noopener noreferrer"
          >MDN: SubtleCrypto.digest()</a
        >で対応アルゴリズムと制限を確認できます。
      </p></template
    >
    <template #faq
      ><h3>パスワードの保存用に使えますか？</h3>
      <p>
        推奨しません。パスワード保存にはソルトと専用の低速なパスワードハッシュ方式を使用してください。
      </p></template
    >
  </UtilityPage>
</template>

<script setup lang="ts">
const { algorithm, input, output, error, status, selectFile, generate, copy } = useHashGenerator()
const relatedTools = [
  {
    to: '/tools/base64/',
    title: 'Base64エンコード・デコード',
    reason: 'バイナリデータを文字列形式に変換する',
  },
  { to: '/tools/uuid-generator/', title: 'UUID生成', reason: '識別用のランダムな値を生成する' },
]
useSiteSeo({
  title: 'ハッシュ生成ツール｜SHA-256・SHA-384・SHA-512',
  description:
    'テキストやファイルからSHA-256・SHA-384・SHA-512のハッシュ値をブラウザ内で生成します。',
  path: '/tools/hash-generator/',
})
</script>
