<template>
  <UtilityPage
    eyebrow="UUID Generator"
    title="UUID生成ツール"
    description="RFC 4122形式のUUID v4をブラウザで生成し、まとめてコピーできます。"
    :related-tools="relatedTools"
  >
    <template #tool
      ><section>
        <div class="flex flex-wrap items-end gap-4">
          <label class="font-black text-[#102a43]"
            >生成数<input
              v-model.number="count"
              type="number"
              min="1"
              max="100"
              class="mt-2 block h-12 w-32 rounded-lg border border-slate-300 px-3" /></label
          ><ToolActions
            primary="UUIDを生成"
            secondary="すべてコピー"
            :disabled="count < 1 || count > 100"
            @primary="generate"
            @secondary="copy"
          />
        </div>
        <p class="mt-3 min-h-6 text-sm text-teal-700" aria-live="polite">{{ status }}</p>
        <label for="uuid-output" class="text-sm font-normal text-slate-500"
          >生成結果をクリックしてコピー</label
        ><textarea
          id="uuid-output"
          :value="uuids.join('\n')"
          readonly
          class="mt-2 min-h-72 w-full cursor-copy resize-y rounded-lg border border-slate-300 bg-slate-50 p-4 font-mono text-sm leading-7 hover:border-teal-600"
          aria-label="生成したUUID。クリックしてコピー"
          title="クリックしてすべてのUUIDをコピー"
          @click="copy"
          @keydown.enter.prevent="copy"
        /></section
    ></template>
    <template #features
      ><ul>
        <li>UUID v4を1〜100件生成</li>
        <li>結果を改行区切りで一括表示</li>
        <li>生成結果をまとめてコピー</li>
      </ul></template
    >
    <template #usage
      ><p>
        1〜100件の生成数を指定し、生成ボタンを押します。結果は1行に1件ずつ表示されます。
      </p></template
    ><template #examples
      ><p>
        テストデータの識別子、クライアント側で仮発行するID、ログの相関IDなどに利用できます。認可や秘密情報の代わりには使用しないでください。
      </p></template
    ><template #data
      ><p>
        暗号学的乱数を利用するcrypto.randomUUID()でUUID
        v4を生成します。値はサーバーへ送信・保存しません。
      </p></template
    ><template #references
      ><p>
        <a
          href="https://developer.mozilla.org/ja/docs/Web/API/Crypto/randomUUID"
          target="_blank"
          rel="noopener noreferrer"
          >MDN: Crypto.randomUUID()</a
        >で生成APIの仕様を確認できます。
      </p></template
    ><template #faq
      ><h3>重複することはありますか？</h3>
      <p>
        理論上は可能ですが、十分な乱数で生成されたUUID v4が偶然重複する確率は極めて低いです。
      </p></template
    >
  </UtilityPage>
</template>
<script setup lang="ts">
const { count, uuids, status, generate, copy } = useUuidGenerator()
const relatedTools = [
  {
    to: '/tools/json-formatter/',
    title: 'JSON整形・構文チェック',
    reason: '生成したUUIDをAPI用JSONデータで利用する',
  },
]
useSiteSeo({
  title: 'UUID生成ツール｜UUID v4をブラウザで一括作成',
  description: 'UUID v4をブラウザ内で1〜100件まで無料で生成し、まとめてコピーできます。',
  path: '/tools/uuid-generator/',
})
</script>
