<template>
  <div class="min-h-screen bg-white text-slate-950">
    <main class="px-3 py-4 sm:px-4 sm:py-8">
      <div class="mx-auto w-full max-w-6xl">
        <SiteBreadcrumbs current="ダミー画像生成ツール" tool-page />
        <section
          class="border-b border-teal-100 bg-white px-2 py-10 text-center md:px-8 md:py-14"
          aria-labelledby="page-title"
        >
          <h1
            id="page-title"
            class="mb-4 text-3xl leading-tight font-black text-[#102a43] md:text-4xl"
          >
            ダミー画像生成ツール
          </h1>
          <p class="mx-auto mt-0 mb-0 max-w-3xl text-base leading-8 text-[#334e68] md:text-lg">
            サイズ・枚数・形式・ファイル容量を指定して、ダミー画像を一括生成します<br />
            画像はサーバーへ送信されません
          </p>
        </section>

        <section
          class="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]"
          aria-label="ダミー画像の生成ツール"
        >
          <div class="rounded-lg border border-teal-700/30 bg-white p-4 md:p-7">
            <div class="flex items-center justify-between border-b border-[#17201d]/10 pb-5">
              <div>
                <h2 class="m-0 text-xl font-black text-[#102a43] md:text-2xl">生成設定</h2>
              </div>
              <button
                type="button"
                class="border-0 bg-transparent text-sm font-semibold text-[#17201d]/45 transition hover:text-[#17201d]"
                @click="reset"
              >
                初期値に戻す
              </button>
            </div>

            <div class="grid gap-7 pt-7">
              <fieldset class="m-0 border-0 p-0">
                <legend class="mb-3 w-full text-sm font-bold">
                  画像サイズ
                  <small class="ml-1 text-xs font-normal text-[#17201d]/40">px</small>
                </legend>
                <div class="flex items-center gap-3">
                  <label class="relative flex-1">
                    <small
                      class="absolute top-2 left-4 text-sm font-bold tracking-widest text-[#17201d]/40"
                      >WIDTH</small
                    >
                    <input
                      v-model.number="width"
                      aria-label="画像の幅"
                      type="number"
                      min="1"
                      max="4096"
                      class="h-16 w-full appearance-none rounded-md border border-[#17201d]/15 bg-[#fafaf7] px-4 pt-4 text-lg font-bold transition outline-none focus:border-[#d55f39] focus:ring-2 focus:ring-[#d55f39]/10"
                    />
                  </label>
                  <b class="font-normal text-[#17201d]/30">×</b>
                  <label class="relative flex-1">
                    <small
                      class="absolute top-2 left-4 text-sm font-bold tracking-widest text-[#17201d]/40"
                      >HEIGHT</small
                    >
                    <input
                      v-model.number="height"
                      aria-label="画像の高さ"
                      type="number"
                      min="1"
                      max="4096"
                      class="h-16 w-full appearance-none rounded-md border border-[#17201d]/15 bg-[#fafaf7] px-4 pt-4 text-lg font-bold transition outline-none focus:border-[#d55f39] focus:ring-2 focus:ring-[#d55f39]/10"
                    />
                  </label>
                </div>
                <div class="mt-3 flex flex-wrap gap-2">
                  <button
                    v-for="item in presets"
                    :key="item[0]"
                    type="button"
                    class="rounded-md border border-[#17201d]/10 bg-white px-3 py-1.5 text-sm transition hover:border-[#17201d]/30 hover:bg-[#fafaf7]"
                    @click="setPreset(item)"
                  >
                    {{ item[0] }}
                    <small class="ml-1 text-xs text-[#17201d]/40"
                      >{{ item[1] }} × {{ item[2] }}</small
                    >
                  </button>
                </div>
              </fieldset>

              <div class="grid gap-6 sm:grid-cols-2">
                <fieldset class="m-0 border-0 p-0">
                  <legend class="mb-3 text-sm font-bold">枚数</legend>
                  <div class="flex h-12 rounded-md border border-[#17201d]/15 bg-[#fafaf7]">
                    <button
                      type="button"
                      aria-label="枚数を減らす"
                      class="w-12 border-0 bg-transparent text-lg text-[#17201d]/55 hover:text-[#17201d]"
                      @click="count = Math.max(1, count - 1)"
                    >
                      −
                    </button>
                    <input
                      v-model.number="count"
                      aria-label="生成枚数"
                      type="number"
                      min="1"
                      :max="maxCount"
                      class="min-w-0 flex-1 appearance-none border-0 bg-transparent text-center text-sm font-bold outline-none"
                      @blur="normalizeCount"
                      @change="normalizeCount"
                      @keydown.enter.prevent="normalizeCount"
                    />
                    <button
                      type="button"
                      aria-label="枚数を増やす"
                      class="w-12 border-0 bg-transparent text-lg text-[#17201d]/55 hover:text-[#17201d]"
                      @click="count = Math.min(maxCount, count + 1)"
                    >
                      ＋
                    </button>
                  </div>
                  <p class="mt-2 text-xs text-[#17201d]/50">現在の容量では最大{{ maxCount }}枚</p>
                </fieldset>

                <fieldset class="m-0 border-0 p-0">
                  <legend class="mb-3 text-sm font-bold">形式</legend>
                  <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <label
                      v-for="item in ['jpeg', 'png', 'webp', 'gif'] as Format[]"
                      :key="item"
                      class="cursor-pointer"
                    >
                      <input v-model="format" type="radio" :value="item" class="peer sr-only" />
                      <span
                        class="grid h-12 place-items-center rounded-md border border-[#17201d]/15 text-sm font-bold transition peer-checked:border-[#18352c] peer-checked:bg-[#18352c] peer-checked:text-white"
                      >
                        {{ item === 'jpeg' ? 'JPG' : item.toUpperCase() }}
                      </span>
                    </label>
                  </div>
                </fieldset>
              </div>

              <fieldset class="m-0 border-0 p-0">
                <legend class="mb-3 flex w-full items-baseline justify-between text-sm font-bold">
                  1枚あたりのファイル容量
                  <small class="text-xs font-normal text-[#17201d]/40"
                    >元画像が指定容量を超える場合は縮小されません</small
                  >
                </legend>
                <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <label
                    v-for="item in [0, 100, 500, 1024, 5120, 10240, 102400]"
                    :key="item"
                    class="cursor-pointer"
                  >
                    <input v-model="targetKB" type="radio" :value="item" class="peer sr-only" />
                    <span
                      class="grid h-11 place-items-center rounded-md border border-[#17201d]/15 text-sm font-bold transition peer-checked:border-[#d55f39] peer-checked:bg-[#fff0ea] peer-checked:text-[#a63d20]"
                    >
                      {{ item === 0 ? '自動' : item < 1024 ? `約${item}KB` : `約${item / 1024}MB` }}
                    </span>
                  </label>
                </div>
              </fieldset>

              <fieldset class="m-0 border-0 p-0">
                <legend class="mb-3 text-sm font-bold">画像内容</legend>
                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label v-for="item in patternOptions" :key="item.value" class="cursor-pointer">
                    <input
                      v-model="pattern"
                      type="radio"
                      :value="item.value"
                      class="peer sr-only"
                    />
                    <span
                      class="block rounded-md border border-[#17201d]/15 p-3 transition peer-checked:border-[#18352c] peer-checked:bg-[#edf4f1]"
                    >
                      <b class="block text-sm">{{ item.label }}</b>
                      <small
                        v-if="item.note"
                        class="mt-1 block text-xs whitespace-nowrap text-[#17201d]/45"
                        >{{ item.note }}</small
                      >
                    </span>
                  </label>
                </div>
              </fieldset>

              <fieldset
                v-if="pattern === 'solid' || pattern === 'gradient'"
                class="m-0 border-0 p-0"
              >
                <legend class="mb-3 text-sm font-bold">背景色</legend>
                <div v-if="pattern === 'solid'" class="grid grid-cols-1 gap-3">
                  <label
                    class="flex cursor-pointer items-center justify-between rounded-md border border-[#17201d]/15 bg-[#fafaf7] p-3 text-sm"
                  >
                    単色
                    <span class="flex items-center gap-3 font-medium uppercase">
                      {{ solidColor }}
                      <input
                        v-model="solidColor"
                        type="color"
                        aria-label="単色の背景色"
                        class="h-11 w-14 cursor-pointer rounded-sm border border-[#17201d]/15 bg-transparent p-1"
                      />
                    </span>
                  </label>
                </div>
                <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label
                    class="flex cursor-pointer items-center justify-between rounded-md border border-[#17201d]/15 bg-[#fafaf7] p-3 text-sm"
                  >
                    開始色
                    <span class="flex items-center gap-3 font-medium uppercase">
                      {{ gradientStartColor }}
                      <input
                        v-model="gradientStartColor"
                        type="color"
                        aria-label="グラデーションの開始色"
                        class="h-11 w-14 cursor-pointer rounded-sm border border-[#17201d]/15 bg-transparent p-1"
                      />
                    </span>
                  </label>
                  <label
                    class="flex cursor-pointer items-center justify-between rounded-md border border-[#17201d]/15 bg-[#fafaf7] p-3 text-sm"
                  >
                    終了色
                    <span class="flex items-center gap-3 font-medium uppercase">
                      {{ gradientEndColor }}
                      <input
                        v-model="gradientEndColor"
                        type="color"
                        aria-label="グラデーションの終了色"
                        class="h-11 w-14 cursor-pointer rounded-sm border border-[#17201d]/15 bg-transparent p-1"
                      />
                    </span>
                  </label>
                </div>
              </fieldset>

              <div class="grid gap-6 sm:grid-cols-2">
                <fieldset class="m-0 border-0 p-0">
                  <legend class="mb-3 text-sm font-bold">画像内の表示</legend>
                  <label class="my-2 block text-sm">
                    <input
                      v-model="showNumber"
                      type="checkbox"
                      class="mr-2 accent-[#18352c]"
                    />ファイル番号
                  </label>
                  <label class="my-2 block text-sm">
                    <input
                      v-model="showDimensions"
                      type="checkbox"
                      class="mr-2 accent-[#18352c]"
                    />画像サイズ
                  </label>
                  <label class="my-2 block text-sm">
                    <input
                      v-model="showSize"
                      type="checkbox"
                      class="mr-2 accent-[#18352c]"
                    />ファイル容量・拡張子
                  </label>
                </fieldset>
                <fieldset class="m-0 border-0 p-0">
                  <legend class="mb-3 text-sm font-bold">ファイル名</legend>
                  <div class="relative">
                    <select
                      v-model="nameMode"
                      aria-label="ファイル名の形式"
                      class="h-12 w-full appearance-none rounded-md border border-[#17201d]/15 bg-[#fafaf7] py-0 pr-14 pl-3 text-sm outline-none focus:border-[#18352c]"
                    >
                      <option value="standard">sample-001.jpg</option>
                      <option value="japanese">サンプル画像-001.jpg</option>
                      <option value="custom">カスタム</option>
                    </select>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      class="pointer-events-none absolute top-1/2 right-4 h-6 w-6 -translate-y-1/2 fill-none stroke-[#17201d]/60 stroke-2"
                    >
                      <path d="m7 9 5 5 5-5" />
                    </svg>
                  </div>
                  <div v-if="nameMode === 'custom'" class="mt-3">
                    <label class="block text-sm font-medium" for="custom-file-name">
                      ファイル名
                    </label>
                    <input
                      id="custom-file-name"
                      v-model="customFileName"
                      type="text"
                      maxlength="100"
                      autocomplete="off"
                      spellcheck="false"
                      placeholder="sample-image"
                      class="mt-2 h-12 w-full rounded-md border border-[#17201d]/15 bg-[#fafaf7] px-3 text-sm outline-none focus:border-[#18352c]"
                    />
                    <p class="mt-2 text-xs leading-5 text-[#17201d]/50">
                      拡張子は自動で付きます。複数枚の場合は-001から連番になります。
                    </p>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          <aside class="self-start lg:sticky lg:top-4">
            <div class="rounded-lg border border-slate-300 bg-white p-4 md:p-7">
              <div class="border-b border-slate-200 pb-5">
                <div>
                  <h2 class="m-0 text-xl font-black text-[#102a43] md:text-2xl">プレビュー</h2>
                </div>
              </div>

              <div
                class="mt-5 grid min-h-[230px] place-items-center overflow-hidden rounded-md bg-slate-100 p-5 sm:min-h-[290px]"
              >
                <canvas
                  ref="preview"
                  data-testid="preview-canvas"
                  class="max-h-[380px] max-w-full rounded-sm shadow-2xl"
                ></canvas>
              </div>

              <GeneratorStats
                :width="width"
                :height="height"
                :count="count"
                :total-size="totalSize"
              />

              <p v-if="error" class="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {{ error }}
              </p>
              <button
                type="button"
                :disabled="generating"
                class="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-md border-0 bg-teal-700 text-base font-black text-white transition hover:bg-teal-800 focus-visible:ring-3 focus-visible:ring-teal-300 focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
                @click="generate"
              >
                <svg
                  v-if="!generating"
                  viewBox="0 0 24 24"
                  class="h-5 w-5 fill-none stroke-current stroke-2"
                >
                  <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" />
                </svg>
                <i
                  v-else
                  class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                ></i>
                {{ generating ? `生成中… ${progress}%` : `${count}枚をZIP生成` }}
              </button>
            </div>
          </aside>
        </section>

        <section
          class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
          aria-labelledby="usage-title"
        >
          <h2 id="usage-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">使い方</h2>
          <ol
            class="mt-3 mb-0 list-decimal space-y-1 pl-5 text-sm leading-7 text-[#334e68] md:text-base md:leading-8"
          >
            <li>画像の幅と高さを入力するか、用途に合うプリセットを選びます。</li>
            <li>枚数、JPG・PNG・WebP・GIFの形式、必要に応じて目標容量を選びます。</li>
            <li>画像内容、画像内の表示、ファイル名を設定し、生成ボタンを押します。</li>
            <li>プレビューと合計容量を確認し、生成されたZIPファイルを保存します。</li>
          </ol>
        </section>

        <section
          class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
          aria-labelledby="example-title"
        >
          <h2 id="example-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            使用例と結果の見方
          </h2>
          <div class="mt-3 space-y-3 text-sm leading-7 text-[#334e68] md:text-base md:leading-8">
            <p class="m-0">
              画像アップロード画面の確認では、たとえば幅1200px・高さ630px、JPG、10枚を指定すると、同じ条件のテスト画像をまとめて用意できます。連番表示を有効にすると、並び順や重複を目視しやすくなります。
            </p>
            <p class="m-0">
              目標容量はファイルサイズの下限を満たすための指定です。元の画像データが指定容量より小さい場合はデータを追加しますが、すでに大きい場合は縮小しないため、常に指定値と完全一致するわけではありません。
            </p>
          </div>
        </section>

        <section
          class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
          aria-labelledby="processing-title"
        >
          <h2 id="processing-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            処理方法と制限事項
          </h2>
          <ul
            class="mt-3 mb-0 list-disc space-y-1 pl-5 text-sm leading-7 text-[#334e68] md:text-base md:leading-8"
          >
            <li>描画、画像変換、GIF生成、ZIP作成は利用中のブラウザ内で処理します。</li>
            <li>入力した設定や生成画像を、本サイトのアプリケーションサーバーへ送信しません。</li>
            <li>
              幅と高さはそれぞれ最大4096pxです。端末のメモリに応じて生成可能な枚数を制限します。
            </li>
            <li>大きな画像や多数の画像は処理に時間がかかるため、少ない枚数からお試しください。</li>
          </ul>
        </section>

        <section
          class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
          aria-labelledby="references-title"
        >
          <h2 id="references-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            参考情報
          </h2>
          <p class="mt-3 mb-0 text-sm leading-7 text-[#334e68] md:text-base md:leading-8">
            ブラウザでの画像描画とファイル生成の仕様は、
            <a
              class="font-bold text-teal-700 underline underline-offset-4"
              href="https://developer.mozilla.org/ja/docs/Web/API/Canvas_API"
              target="_blank"
              rel="noopener noreferrer"
              >MDN Canvas API</a
            >、
            <a
              class="font-bold text-teal-700 underline underline-offset-4"
              href="https://developer.mozilla.org/ja/docs/Web/API/HTMLCanvasElement/toBlob"
              target="_blank"
              rel="noopener noreferrer"
              >HTMLCanvasElement.toBlob()</a
            >
            を参照してください。
          </p>
        </section>

        <section
          class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
          aria-labelledby="features-title"
        >
          <h2 id="features-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            このダミー画像生成ツールでできること
          </h2>
          <div class="mt-5 grid gap-4 md:grid-cols-3">
            <article class="border-t-2 border-teal-700 pt-4">
              <h3 class="m-0 text-base font-black text-[#102a43]">指定容量のテスト画像</h3>
              <p class="mt-2 mb-0 text-sm leading-7 text-[#334e68]">
                100KBから100MBまで、1枚あたりの容量を指定してアップロードテスト用画像を作れます。
              </p>
            </article>
            <article class="border-t-2 border-teal-700 pt-4">
              <h3 class="m-0 text-base font-black text-[#102a43]">複数枚をZIPで一括生成</h3>
              <p class="mt-2 mb-0 text-sm leading-7 text-[#334e68]">
                連番付きのダミー画像をまとめて生成し、1つのZIPファイルでダウンロードできます。
              </p>
            </article>
            <article class="border-t-2 border-teal-700 pt-4">
              <h3 class="m-0 text-base font-black text-[#102a43]">JPG・PNG・WebP・GIF対応</h3>
              <p class="mt-2 mb-0 text-sm leading-7 text-[#334e68]">
                単色、グラデーション、ランダム模様、ノイズ風の画像を用途に合わせて生成できます。
              </p>
            </article>
          </div>
        </section>

        <section
          class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
          aria-labelledby="faq-title"
        >
          <h2 id="faq-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            よくある質問
          </h2>
          <div class="mt-5 divide-y divide-slate-200 border-t border-slate-200">
            <details v-for="item in faqItems" :key="item.question" class="py-4">
              <summary class="cursor-pointer text-base font-black text-[#102a43]">
                {{ item.question }}
              </summary>
              <p class="mt-3 mb-0 text-sm leading-7 text-[#334e68] md:text-base">
                {{ item.answer }}
              </p>
            </details>
          </div>
        </section>
        <RelatedTools :items="relatedTools" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { ImageFormat as Format } from '~/utils/imageGenerator'

const siteUrl = 'https://web-dev-toolbox.web.app/tools/dummy-image-generator/'
const siteName = 'ダミー画像生成ツール'
const seoTitle = 'ダミー画像生成ツール｜サイズ・容量・形式を指定して作成'
const siteDescription =
  'サイズ・枚数・形式・ファイル容量を指定して、開発やアップロードテスト用のダミー画像・サンプル画像をブラウザ内で一括生成できます。'
const relatedTools = [
  {
    to: '/tools/hash-generator/',
    title: 'ハッシュ生成',
    reason: '生成した画像ファイルのチェックサムを確認する',
  },
]
const faqItems = [
  {
    question: 'ファイル容量は1枚ごとの指定ですか？',
    answer: 'はい。100KB、500KB、1MB、5MB、10MB、100MBは、画像1枚あたりの目標ファイル容量です。',
  },
  {
    question: '生成した画像はサーバーへ送信されますか？',
    answer:
      'いいえ。画像生成とZIP作成はブラウザ内で処理され、生成した画像を本サイトのサーバーへ送信する機能はありません。',
  },
  {
    question: '複数の画像をまとめて作れますか？',
    answer:
      'はい。指定した枚数の画像を連番付きのファイル名で生成し、ZIPファイルとしてまとめてダウンロードできます。',
  },
  {
    question: 'アニメーションGIFを生成できますか？',
    answer: 'はい。GIF形式では、画像内のタイトル表示が切り替わるアニメーションGIFを生成できます。',
  },
] as const

const {
  preview,
  width,
  height,
  count,
  format,
  targetKB,
  pattern,
  solidColor,
  gradientStartColor,
  gradientEndColor,
  nameMode,
  customFileName,
  showNumber,
  showDimensions,
  showSize,
  generating,
  progress,
  error,
  totalSize,
  maxCount,
  presets,
  setPreset,
  patternOptions,
  normalizeCount,
  generate,
  reset,
} = useImageGenerator()

useSeoMeta({
  title: seoTitle,
  description: siteDescription,
  ogTitle: siteName,
  ogDescription: siteDescription,
  ogUrl: siteUrl,
  ogType: 'website',
  ogImage: 'https://web-dev-toolbox.web.app/favicon.svg',
  twitterCard: 'summary',
  twitterTitle: siteName,
  twitterDescription: siteDescription,
  twitterImage: 'https://web-dev-toolbox.web.app/favicon.svg',
})

useHead({
  htmlAttrs: { lang: 'ja' },
  link: [{ rel: 'canonical', href: siteUrl }],
  meta: [
    { name: 'robots', content: 'index,follow' },
    { name: 'theme-color', content: '#0f766e' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'ホーム',
            item: 'https://web-dev-toolbox.web.app/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'ツール一覧',
            item: 'https://web-dev-toolbox.web.app/tools/',
          },
          { '@type': 'ListItem', position: 3, name: siteName, item: siteUrl },
        ],
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        alternateName: ['ダミー画像作成', 'サンプル画像生成'],
        url: siteUrl,
        inLanguage: 'ja',
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': ['WebApplication', 'SoftwareApplication'],
        '@id': `${siteUrl}#app`,
        name: siteName,
        url: siteUrl,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        browserRequirements: 'JavaScript enabled',
        description: siteDescription,
        inLanguage: 'ja',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'JPY',
        },
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }),
    },
  ],
})
</script>
