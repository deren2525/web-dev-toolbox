<template>
  <UtilityPage
    eyebrow="Unix Timestamp"
    title="Unixタイムスタンプ変換ツール"
    description="Unix時間を日時へ、日時をUnix時間へ相互変換できます。秒とミリ秒の両方に対応します。"
    :related-tools="relatedTools"
  >
    <template #tool
      ><section class="grid gap-4 md:grid-cols-2">
        <div class="rounded-lg border border-slate-300 p-5">
          <label for="timestamp" class="mb-2 block font-black text-[#102a43]"
            >Unixタイムスタンプ</label
          ><input
            id="timestamp"
            v-model="timestamp"
            inputmode="numeric"
            class="h-12 w-full rounded-lg border border-slate-300 px-3 font-mono"
            placeholder="1767225600"
          /><label for="timestamp-unit" class="mt-3 block text-sm font-bold text-[#334e68]"
            >単位
            <select
              id="timestamp-unit"
              v-model="unit"
              class="mt-2 block h-11 rounded-lg border border-slate-300 bg-white px-3"
            >
              <option value="seconds">秒</option>
              <option value="milliseconds">ミリ秒</option>
            </select></label
          ><button
            class="mt-4 min-h-11 rounded-md bg-teal-700 px-5 font-black text-white"
            type="button"
            @click="fromTimestamp"
          >
            日時へ変換
          </button>
          <div v-if="localDateResult" class="mt-3 space-y-2">
            <div>
              <span class="block text-xs font-bold text-slate-500">ローカル日時</span
              ><button
                type="button"
                class="mt-1 block w-full cursor-copy rounded-lg border border-slate-200 bg-slate-50 p-3 text-left text-sm leading-7 text-[#334e68] hover:border-teal-600"
                title="クリックして値だけコピー"
                @click="copyResult(localDateResult)"
              >
                {{ localDateResult }}
              </button>
            </div>
            <div>
              <span class="block text-xs font-bold text-slate-500">UTC日時</span
              ><button
                type="button"
                class="mt-1 block w-full cursor-copy rounded-lg border border-slate-200 bg-slate-50 p-3 text-left font-mono text-sm leading-7 text-[#334e68] hover:border-teal-600"
                title="クリックして値だけコピー"
                @click="copyResult(utcDateResult)"
              >
                {{ utcDateResult }}
              </button>
            </div>
          </div>
        </div>
        <div class="rounded-lg border border-slate-300 p-5">
          <label for="datetime" class="mb-2 block font-black text-[#102a43]">日時</label
          ><input
            id="datetime"
            v-model="dateTime"
            type="datetime-local"
            step="1"
            class="h-12 w-full rounded-lg border border-slate-300 px-3"
          /><label class="mt-3 flex items-center gap-2 text-sm"
            ><input
              v-model="asUtc"
              type="checkbox"
              class="size-4 accent-teal-700"
            />入力をUTCとして扱う</label
          ><button
            class="mt-4 min-h-11 rounded-md bg-teal-700 px-5 font-black text-white"
            type="button"
            @click="toTimestamp"
          >
            Unix時間へ変換
          </button>
          <div v-if="unixSeconds" class="mt-3 space-y-2">
            <div>
              <span class="block text-xs font-bold text-slate-500">秒</span
              ><button
                type="button"
                class="mt-1 block w-full cursor-copy rounded-lg border border-slate-200 bg-slate-50 p-3 text-left font-mono text-sm leading-7 text-[#334e68] hover:border-teal-600"
                title="クリックして値だけコピー"
                @click="copyResult(unixSeconds)"
              >
                {{ unixSeconds }}
              </button>
            </div>
            <div>
              <span class="block text-xs font-bold text-slate-500">ミリ秒</span
              ><button
                type="button"
                class="mt-1 block w-full cursor-copy rounded-lg border border-slate-200 bg-slate-50 p-3 text-left font-mono text-sm leading-7 text-[#334e68] hover:border-teal-600"
                title="クリックして値だけコピー"
                @click="copyResult(unixMilliseconds)"
              >
                {{ unixMilliseconds }}
              </button>
            </div>
          </div>
        </div>
        <p
          class="md:col-span-2 min-h-6 text-sm"
          :class="error ? 'text-red-700' : 'text-teal-700'"
          aria-live="polite"
        >
          {{ error || status }}
        </p>
      </section></template
    >
    <template #features
      ><ul>
        <li>秒またはミリ秒のUnix時間を日時へ変換</li>
        <li>ローカル日時またはUTCをUnix時間へ変換</li>
        <li>結果の値だけをクリックでコピー</li>
      </ul></template
    >
    <template #usage
      ><p>
        数値の単位を確認して日時へ変換するか、日時とタイムゾーンの扱いを指定してUnix時間へ変換します。
      </p></template
    ><template #examples
      ><p>
        「0」秒は1970年1月1日00:00:00
        UTCです。10桁程度の値は秒、13桁程度の値はミリ秒であることが一般的ですが、変換前に提供元の仕様を確認してください。
      </p></template
    ><template #data
      ><p>
        JavaScript Dateで処理します。Unix時間は1970年1月1日00:00:00
        UTCからの経過時間で、うるう秒は表現しません。
      </p></template
    ><template #references
      ><p>
        <a
          href="https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date"
          target="_blank"
          rel="noopener noreferrer"
          >MDN: Date</a
        >でJavaScriptの日時表現と制限を確認できます。
      </p></template
    ><template #faq
      ><h3>秒とミリ秒の違いは？</h3>
      <p>一般的なUnixタイムスタンプは秒、JavaScriptのDate.getTime()はミリ秒です。</p></template
    >
  </UtilityPage>
</template>
<script setup lang="ts">
const {
  timestamp,
  unit,
  dateTime,
  asUtc,
  localDateResult,
  utcDateResult,
  unixSeconds,
  unixMilliseconds,
  error,
  status,
  fromTimestamp,
  toTimestamp,
  copyResult,
} = useTimestampConverter()
const relatedTools = [
  {
    to: '/tools/jwt-decoder/',
    title: 'JWTデコーダー',
    reason: 'JWTに含まれる発行日時や有効期限を確認する',
  },
  {
    to: '/tools/json-formatter/',
    title: 'JSON整形・構文チェック',
    reason: 'APIレスポンス内のタイムスタンプを見つけて確認する',
  },
]
useSiteSeo({
  title: 'Unixタイムスタンプ変換ツール｜日時とUnix時間を相互変換',
  description:
    'Unix時間を日時へ、日時をUnixタイムスタンプへ変換します。秒・ミリ秒、ローカル時間・UTCに対応。',
  path: '/tools/timestamp-converter/',
})
</script>
