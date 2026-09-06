<template>
  <UtilityPage
    eyebrow="JWT"
    title="JWTデコーダー"
    description="JWTのHeaderとPayloadをブラウザ内でデコードし、有効期限などの内容を確認できます。"
    :related-tools="relatedTools"
  >
    <template #tool>
      <section>
        <label for="jwt-input" class="mb-2 block font-black text-[#102a43]">JWT</label>
        <textarea
          id="jwt-input"
          v-model="input"
          class="min-h-36 w-full resize-y rounded-lg border border-slate-300 p-4 font-mono text-sm leading-6"
          placeholder="eyJhbGciOi..."
          spellcheck="false"
        />
        <ToolActions
          class="mt-4"
          primary="デコード"
          secondary="クリア"
          @primary="decode"
          @secondary="clear"
        />
        <p
          class="mt-3 min-h-6 text-sm"
          :class="error ? 'text-red-700' : 'text-teal-700'"
          aria-live="polite"
        >
          {{ error || status }}
        </p>
        <div v-if="headerOutput" class="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <label for="jwt-header" class="mb-2 block font-black text-[#102a43]"
              >Header <small class="font-normal text-slate-500">クリックでコピー</small></label
            ><textarea
              id="jwt-header"
              :value="headerOutput"
              readonly
              class="min-h-52 w-full cursor-copy resize-y rounded-lg border border-slate-300 bg-slate-50 p-4 font-mono text-sm leading-6 hover:border-teal-600"
              @click="copy(headerOutput)"
              @keydown.enter.prevent="copy(headerOutput)"
              @keydown.space.prevent="copy(headerOutput)"
            />
          </div>
          <div>
            <label for="jwt-payload" class="mb-2 block font-black text-[#102a43]"
              >Payload <small class="font-normal text-slate-500">クリックでコピー</small></label
            ><textarea
              id="jwt-payload"
              :value="payloadOutput"
              readonly
              class="min-h-52 w-full cursor-copy resize-y rounded-lg border border-slate-300 bg-slate-50 p-4 font-mono text-sm leading-6 hover:border-teal-600"
              @click="copy(payloadOutput)"
              @keydown.enter.prevent="copy(payloadOutput)"
              @keydown.space.prevent="copy(payloadOutput)"
            />
          </div>
        </div>
        <div v-if="claims.length" class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="claim in claims"
            :key="claim.label"
            class="rounded-lg border border-slate-200 p-4"
          >
            <span class="block text-xs font-bold text-slate-500">{{ claim.label }}</span
            ><button
              type="button"
              class="mt-1 cursor-copy text-left text-sm leading-7 text-[#334e68]"
              title="クリックして値だけコピー"
              @click="copy(claim.value)"
            >
              {{ claim.display }}
            </button>
          </div>
        </div>
        <p
          v-if="headerOutput"
          class="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm leading-7 text-amber-900"
        >
          <strong>注意：</strong
          >内容を表示しただけで、署名の正当性は検証していません。信頼できないトークンの内容を信用しないでください。
        </p>
      </section>
    </template>
    <template #features
      ><ul>
        <li>JWTのHeaderとPayloadをJSONとして整形</li>
        <li>iss、sub、audなどの主要Claimを抽出</li>
        <li>iat、nbf、expを日時付きで表示</li>
      </ul></template
    >
    <template #usage
      ><p>
        JWTを貼り付けて「デコード」を押します。Header、Payload、発行日時、有効期限を確認できます。
      </p></template
    >
    <template #examples
      ><p>
        API認証で受け取ったJWTの有効期限や対象者を調査する用途に使えます。表示できても署名が正しいとは限らないため、認証判断には利用できません。
      </p></template
    >
    <template #data
      ><p>
        トークンはブラウザ内でデコードし、サーバーへ送信・保存しません。このツールは署名検証を行いません。
      </p></template
    >
    <template #references
      ><p>
        <a href="https://www.rfc-editor.org/rfc/rfc7519" target="_blank" rel="noopener noreferrer"
          >RFC 7519: JSON Web Token</a
        >でJWTとClaimの仕様を確認できます。
      </p></template
    >
    <template #faq
      ><h3>デコードに成功すれば正しいJWTですか？</h3>
      <p>
        いいえ。内容を読めることと署名が正しいことは別です。認証判断には発行元で署名、issuer、audienceなどを検証してください。
      </p></template
    >
  </UtilityPage>
</template>

<script setup lang="ts">
const { input, headerOutput, payloadOutput, error, status, claims, decode, clear, copy } =
  useJwtDecoder()
const relatedTools = [
  {
    to: '/tools/base64/',
    title: 'Base64エンコード・デコード',
    reason: 'Base64形式の文字列を相互変換する',
  },
  {
    to: '/tools/timestamp-converter/',
    title: 'Unixタイムスタンプ変換',
    reason: 'iat・nbf・expの時刻を詳しく確認する',
  },
  {
    to: '/tools/json-formatter/',
    title: 'JSON整形・構文チェック',
    reason: 'HeaderやPayloadのJSONを編集・確認する',
  },
]

useSiteSeo({
  title: 'JWTデコーダー｜Header・Payload・有効期限を確認',
  description: 'JWTのHeaderとPayload、発行日時、有効期限をブラウザ内でデコードして確認できます。',
  path: '/tools/jwt-decoder/',
})
</script>
