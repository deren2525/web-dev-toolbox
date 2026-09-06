<template>
  <UtilityPage
    eyebrow="Base64"
    title="Base64エンコード・デコードツール"
    description="日本語を含む文字列をBase64へエンコードし、Base64から元の文字列へデコードできます。"
    :related-tools="relatedTools"
  >
    <template #tool
      ><section class="grid gap-4 lg:grid-cols-2">
        <div>
          <label for="base64-input" class="mb-2 block font-black text-[#102a43]"
            >変換する文字列</label
          ><textarea
            id="base64-input"
            v-model="input"
            class="min-h-64 w-full resize-y rounded-lg border border-slate-300 p-4 font-mono text-sm"
          />
        </div>
        <div>
          <label for="base64-output" class="mb-2 block font-black text-[#102a43]"
            >変換結果 <small class="font-normal text-slate-500">クリックでコピー</small></label
          ><textarea
            id="base64-output"
            :value="output"
            readonly
            class="min-h-64 w-full cursor-copy resize-y rounded-lg border border-slate-300 bg-slate-50 p-4 font-mono text-sm hover:border-teal-600"
            title="クリックして結果をコピー"
            @click="output && copy()"
            @keydown.enter.prevent="output && copy()"
          />
        </div>
        <div class="lg:col-span-2">
          <ToolActions
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
        <li>UTF-8文字列をBase64へエンコード</li>
        <li>Base64をUTF-8文字列へデコード</li>
        <li>変換結果をクリックまたはボタンでコピー</li>
      </ul></template
    >
    <template #usage
      ><p>
        文字列を入力し、変換方向を選びます。UTF-8として処理するため日本語にも対応しています。
      </p></template
    ><template #examples
      ><p>
        日本語の「こんにちは」はBase64へ変換すると「44GT44KT44Gr44Gh44Gv」になります。Base64はデータ表現であり、秘密情報を保護する暗号化ではありません。
      </p></template
    ><template #data
      ><p>
        TextEncoder、TextDecoder、atob、btoaを利用し、通信せずブラウザ内で変換します。秘密情報の保管や暗号化には利用できません。
      </p></template
    ><template #references
      ><p>
        <a
          href="https://developer.mozilla.org/ja/docs/Glossary/Base64"
          target="_blank"
          rel="noopener noreferrer"
          >MDN: Base64</a
        >でWebプラットフォームにおけるBase64の扱いを確認できます。
      </p></template
    ><template #faq
      ><h3>Base64は暗号化ですか？</h3>
      <p>いいえ。誰でも元に戻せるエンコード方式です。</p></template
    >
  </UtilityPage>
</template>
<script setup lang="ts">
const { input, output, error, status, encode, decode, copy } = useBase64Converter()
const relatedTools = [
  {
    to: '/tools/jwt-decoder/',
    title: 'JWTデコーダー',
    reason: 'Base64URLで構成されたJWTの内容を確認する',
  },
  {
    to: '/tools/url-encoder/',
    title: 'URLエンコード・デコード',
    reason: 'URLで安全に扱える文字列へ変換する',
  },
  {
    to: '/tools/json-formatter/',
    title: 'JSON整形・構文チェック',
    reason: 'APIレスポンス内のBase64データを確認する',
  },
]
useSiteSeo({
  title: 'Base64エンコード・デコードツール｜文字列を相互変換',
  description: '日本語対応のBase64エンコード・デコードをブラウザ内で無料で行えます。',
  path: '/tools/base64/',
})
</script>
