<template>
  <UtilityPage
    eyebrow="URL Encode / Decode"
    title="URLエンコード・デコードツール"
    description="文字列をパーセントエンコードへ変換し、エンコード済み文字列を元に戻せます。"
    :related-tools="relatedTools"
  >
    <template #tool
      ><section class="grid gap-4 lg:grid-cols-2">
        <div>
          <label for="url-input" class="mb-2 block font-black text-[#102a43]">入力</label
          ><textarea
            id="url-input"
            v-model="input"
            class="min-h-64 w-full resize-y rounded-lg border border-slate-300 p-4 font-mono text-sm"
            placeholder="https://example.com/?q=日本語"
          />
        </div>
        <div>
          <label for="url-output" class="mb-2 block font-black text-[#102a43]"
            >変換結果 <small class="font-normal text-slate-500">クリックでコピー</small></label
          ><textarea
            id="url-output"
            :value="output"
            readonly
            class="min-h-64 w-full cursor-copy resize-y rounded-lg border border-slate-300 bg-slate-50 p-4 font-mono text-sm hover:border-teal-600"
            title="クリックして結果をコピー"
            @click="output && copy()"
            @keydown.enter.prevent="output && copy()"
          />
        </div>
        <div class="lg:col-span-2">
          <label class="mb-3 flex items-center gap-2 text-sm"
            ><input
              v-model="wholeUri"
              type="checkbox"
              class="size-4 accent-teal-700"
            />URL全体として処理する</label
          ><ToolActions
            primary="エンコード"
            secondary="デコード"
            @primary="encode"
            @secondary="decode"
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
            class="text-sm font-bold text-teal-700 underline underline-offset-4"
            type="button"
            @click="copy"
          >
            結果をコピー
          </button>
        </div>
      </section></template
    >
    <template #features
      ><ul>
        <li>文字列をパーセントエンコード</li>
        <li>エンコード済み文字列をデコード</li>
        <li>URL全体とクエリ値を用途別に処理</li>
      </ul></template
    >
    <template #usage
      ><p>
        通常は文字列やクエリ値を変換します。URL全体を処理する場合はチェックを入れると、区切り記号を維持します。
      </p></template
    ><template #examples
      ><p>次のURLを入力した場合、モードによって出力が変わります。</p>
      <dl>
        <dt>入力</dt>
        <dd><code>https://example.com/search?q=日本語&amp;sort=new</code></dd>
        <dt>URL全体モード：オン</dt>
        <dd>
          <code>https://example.com/search?q=%E6%97%A5%E6%9C%AC%E8%AA%9E&amp;sort=new</code>
        </dd>
        <dt>URL全体モード：オフ</dt>
        <dd>
          <code
            >https%3A%2F%2Fexample.com%2Fsearch%3Fq%3D%E6%97%A5%E6%9C%AC%E8%AA%9E%26sort%3Dnew</code
          >
        </dd>
      </dl>
      <p>
        URLをそのまま利用できる形で日本語部分などを変換したい場合はオン、クエリパラメータの値など、文字列全体を安全に埋め込みたい場合はオフを使用します。
      </p></template
    ><template #data
      ><p>
        encodeURIComponent／decodeURIComponent、URL全体ではencodeURI／decodeURIを使用し、ブラウザ内で処理します。
      </p></template
    ><template #references
      ><p>
        <a
          href="https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent"
          target="_blank"
          rel="noopener noreferrer"
          >MDN: encodeURIComponent()</a
        >で変換対象となる文字を確認できます。
      </p></template
    ><template #faq
      ><h3>「URL全体」の違いは何ですか？</h3>
      <p>
        URL全体モードをオンにすると、<code>https://example.com/?q=日本語</code>は<code>https://example.com/?q=%E6%97%A5%E6%9C%AC%E8%AA%9E</code>となり、<code>:</code>、<code>/</code>、<code>?</code>などURL構造に使う文字を維持します。
      </p>
      <p>
        オフにすると、同じ入力は<code>https%3A%2F%2Fexample.com%2F%3Fq%3D%E6%97%A5%E6%9C%AC%E8%AA%9E</code>となり、URL構造の記号も含めて文字列全体を変換します。
      </p></template
    >
  </UtilityPage>
</template>
<script setup lang="ts">
const { input, output, wholeUri, error, status, encode, decode, copy } = useUrlEncoder()
const relatedTools = [
  {
    to: '/tools/base64/',
    title: 'Base64エンコード・デコード',
    reason: '用途に応じて別の文字列エンコードへ変換する',
  },
]
useSiteSeo({
  title: 'URLエンコード・デコードツール｜パーセントエンコード変換',
  description: '文字列やURLをパーセントエンコードへ変換し、デコードできる無料ツールです。',
  path: '/tools/url-encoder/',
})
</script>
