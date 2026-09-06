<template>
  <main class="min-h-screen bg-white px-3 py-4 font-sans text-slate-950 sm:px-4 sm:py-8">
    <div class="mx-auto w-full max-w-6xl">
      <SiteBreadcrumbs current="ブラウザ情報確認ツール" tool-page />
      <section
        class="grid items-center gap-8 border-b border-teal-100 bg-white px-2 py-9 md:min-h-90 md:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] md:px-8 md:py-12"
        aria-labelledby="page-title"
      >
        <div>
          <p class="m-0 text-sm font-black text-teal-700 uppercase">Browser check tool</p>
          <h1
            id="page-title"
            class="mt-2.5 mb-4 text-3xl leading-tight font-black text-[#102a43] md:text-4xl"
          >
            ブラウザ情報確認ツール
          </h1>
          <p class="m-0 max-w-2xl text-base leading-8 text-[#334e68] md:text-lg">
            不具合問い合わせに必要なブラウザ名、OS、画面サイズ、URL、発生時刻をまとめて、ワンクリックでコピーできます。
          </p>
        </div>
        <div class="order-first flex items-center justify-center md:order-none">
          <img
            class="h-auto w-[min(78%,300px)] md:w-[min(100%,420px)]"
            src="~/assets/images/pc.webp"
            width="840"
            height="491"
            alt="画面サイズを確認するイメージ画像"
          />
        </div>
      </section>

      <section
        class="my-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="主要な確認結果"
      >
        <article class="rounded-lg border border-slate-300 bg-white p-4.5 sm:min-h-33">
          <span class="mb-3 block text-xs font-black text-slate-500 md:text-sm">ブラウザ</span>
          <strong
            class="block wrap-anywhere text-base leading-snug font-black text-[#102a43] md:text-xl"
          >
            {{ displayValue(browserInfo.browserName) }}
          </strong>
          <small class="mt-1.5 block text-xs leading-6 text-slate-500 md:text-sm">
            {{ displayValue(browserInfo.browserVersion, 'アクセス後に自動取得') }}
          </small>
        </article>
        <article class="rounded-lg border border-slate-300 bg-white p-4.5 sm:min-h-33">
          <span class="mb-3 block text-xs font-black text-slate-500 md:text-sm">OS</span>
          <strong
            class="block wrap-anywhere text-base leading-snug font-black text-[#102a43] md:text-xl"
          >
            {{ displayValue(browserInfo.operatingSystem) }}
          </strong>
          <small class="mt-1.5 block text-xs leading-6 text-slate-500 md:text-sm">
            {{ displayValue(deviceTypeLabel, 'アクセス後に自動取得') }}
          </small>
        </article>
        <article class="rounded-lg border border-slate-300 bg-white p-4.5 sm:min-h-33">
          <span class="mb-3 block text-xs font-black text-slate-500 md:text-sm">ウィンドウ</span>
          <strong
            class="block wrap-anywhere text-base leading-snug font-black text-[#102a43] md:text-xl"
          >
            {{ formatSize(windowSize.width, windowSize.height) }}
          </strong>
          <small class="mt-1.5 block text-xs leading-6 text-slate-500 md:text-sm"
            >ブラウザの表示領域</small
          >
        </article>
        <article class="rounded-lg border border-slate-300 bg-white p-4.5 sm:min-h-33">
          <span class="mb-3 block text-xs font-black text-slate-500 md:text-sm">画面</span>
          <strong
            class="block wrap-anywhere text-base leading-snug font-black text-[#102a43] md:text-xl"
          >
            {{ formatSize(screenSize.width, screenSize.height) }}
          </strong>
          <small class="mt-1.5 block text-xs leading-6 text-slate-500 md:text-sm"
            >端末ディスプレイのサイズ</small
          >
        </article>
      </section>

      <section
        class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]"
        aria-labelledby="report-title"
      >
        <div class="rounded-lg border border-teal-700/30 bg-white p-4 md:p-7">
          <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p class="m-0 mb-1 text-xs font-black text-teal-700 md:text-sm">Support report</p>
              <h2 id="report-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
                問い合わせ用レポート
              </h2>
            </div>
            <button
              type="button"
              class="min-h-11 cursor-pointer rounded-md bg-teal-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-teal-800 focus-visible:ring-3 focus-visible:ring-teal-300 focus-visible:outline-none md:text-base"
              @click="copySupportReport"
            >
              レポートをコピー
            </button>
          </div>
          <p
            class="mb-3 min-h-6 text-sm font-black"
            :class="copyStatus === 'コピーしました' ? 'text-teal-700' : 'text-slate-500'"
            aria-live="polite"
          >
            {{ copyStatus || 'メール、チャット、問い合わせフォームにそのまま貼り付けできます。' }}
          </p>
          <textarea
            class="min-h-90 w-full resize-y rounded-md border border-slate-300 bg-slate-50 p-3 font-mono text-xs leading-6 text-[#102a43] focus:border-teal-700 focus:ring-3 focus:ring-teal-100 focus:outline-none md:text-sm"
            :value="supportReport"
            readonly
            aria-label="問い合わせ用レポート本文"
          />
        </div>

        <aside
          class="rounded-lg border border-slate-300 bg-white p-4 md:p-7"
          aria-labelledby="diff-title"
        >
          <div class="mb-5">
            <p class="m-0 mb-1 text-xs font-black text-teal-700 md:text-sm">Local diff</p>
            <h2 id="diff-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
              前回との差分
            </h2>
          </div>
          <p v-if="!previousSnapshot" class="m-0 text-sm leading-7 text-[#334e68] md:text-base">
            次回アクセス時から、前回保存された環境との差分をこの端末内だけで表示します。
          </p>
          <p
            v-else-if="!diffItems.length"
            class="m-0 text-sm leading-7 text-[#334e68] md:text-base"
          >
            前回保存された環境から大きな変更はありません。
          </p>
          <dl v-else class="m-0 space-y-3">
            <div
              v-for="item in diffItems"
              :key="item.label"
              class="rounded-md border border-amber-300 bg-amber-50 p-3"
            >
              <dt class="mb-2 text-sm font-black text-[#102a43]">{{ item.label }}</dt>
              <dd class="m-0 text-xs leading-6 text-slate-600">
                前回: {{ item.previous || '-' }}<br />
                今回: {{ item.current || '-' }}
              </dd>
            </div>
          </dl>
          <p class="mt-4 mb-0 text-xs leading-6 text-slate-500">
            差分の保存先はこのブラウザの localStorage です。<br />
            サーバーへの送信やDB保存は行いません。
          </p>
        </aside>
      </section>

      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="screen-title"
      >
        <div class="mb-5.5">
          <p class="m-0 mb-1 text-xs font-black text-teal-700 md:text-sm">Screen size</p>
          <h2 id="screen-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            画面サイズ
          </h2>
        </div>

        <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <article class="rounded-lg border border-slate-300 bg-white p-4.5 sm:min-h-29">
            <span class="mb-3 block text-xs font-black text-slate-500 md:text-sm"
              >ウィンドウ幅</span
            >
            <strong
              class="flex items-baseline gap-1.5 text-2xl leading-none font-black text-[#102a43] md:text-3xl"
            >
              {{ displayNumber(windowSize.width)
              }}<span class="text-xs font-normal text-slate-500 md:text-sm">px</span>
            </strong>
          </article>
          <article class="rounded-lg border border-slate-300 bg-white p-4.5 sm:min-h-29">
            <span class="mb-3 block text-xs font-black text-slate-500 md:text-sm"
              >ウィンドウ高さ</span
            >
            <strong
              class="flex items-baseline gap-1.5 text-2xl leading-none font-black text-[#102a43] md:text-3xl"
            >
              {{ displayNumber(windowSize.height)
              }}<span class="text-xs font-normal text-slate-500 md:text-sm">px</span>
            </strong>
          </article>
          <article class="rounded-lg border border-slate-300 bg-white p-4.5 sm:min-h-29">
            <span class="mb-3 block text-xs font-black text-slate-500 md:text-sm">画面幅</span>
            <strong
              class="flex items-baseline gap-1.5 text-2xl leading-none font-black text-[#102a43] md:text-3xl"
            >
              {{ displayNumber(screenSize.width)
              }}<span class="text-xs font-normal text-slate-500 md:text-sm">px</span>
            </strong>
          </article>
          <article class="rounded-lg border border-slate-300 bg-white p-4.5 sm:min-h-29">
            <span class="mb-3 block text-xs font-black text-slate-500 md:text-sm">画面高さ</span>
            <strong
              class="flex items-baseline gap-1.5 text-2xl leading-none font-black text-[#102a43] md:text-3xl"
            >
              {{ displayNumber(screenSize.height)
              }}<span class="text-xs font-normal text-slate-500 md:text-sm">px</span>
            </strong>
          </article>
        </div>

        <details class="mt-3.5">
          <summary class="w-fit cursor-pointer text-xs font-black text-teal-700 md:text-sm">
            詳細な画面情報
          </summary>
          <div class="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <article class="rounded-lg border border-slate-300 bg-white p-4.5 sm:min-h-29">
              <span class="mb-3 block text-xs font-black text-slate-500 md:text-sm"
                >有効領域幅</span
              >
              <strong
                class="flex items-baseline gap-1.5 text-2xl leading-none font-black text-[#102a43] md:text-3xl"
              >
                {{ displayNumber(screenAvailSize.width)
                }}<span class="text-xs font-normal text-slate-500 md:text-sm">px</span>
              </strong>
            </article>
            <article class="rounded-lg border border-slate-300 bg-white p-4.5 sm:min-h-29">
              <span class="mb-3 block text-xs font-black text-slate-500 md:text-sm"
                >有効領域高さ</span
              >
              <strong
                class="flex items-baseline gap-1.5 text-2xl leading-none font-black text-[#102a43] md:text-3xl"
              >
                {{ displayNumber(screenAvailSize.height)
                }}<span class="text-xs font-normal text-slate-500 md:text-sm">px</span>
              </strong>
            </article>
          </div>
        </details>
      </section>

      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="browser-title"
      >
        <div class="mb-5.5">
          <p class="m-0 mb-1 text-xs font-black text-teal-700 md:text-sm">Browser details</p>
          <h2 id="browser-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            ブラウザ情報
          </h2>
        </div>

        <dl class="m-0 border-t border-slate-200">
          <div
            v-for="item in browserInfoItems"
            :key="item.label"
            class="grid grid-cols-1 gap-2 border-b border-slate-200 py-4 md:grid-cols-[220px_minmax(0,1fr)] md:gap-4.5"
          >
            <dt class="text-sm font-black text-slate-500 md:text-base">{{ item.label }}</dt>
            <dd class="m-0 min-w-0 wrap-anywhere text-sm leading-7 text-[#102a43] md:text-base">
              {{ displayValue(item.value) }}
            </dd>
          </div>
        </dl>
      </section>

      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="note-title"
      >
        <div class="mb-5.5">
          <p class="m-0 mb-1 text-xs font-black text-teal-700 md:text-sm">Notes</p>
          <h2 id="note-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            ご利用上の注意
          </h2>
        </div>
        <ul
          class="m-0 list-disc space-y-1 pl-5 text-sm leading-7 text-[#334e68] md:text-base md:leading-8"
        >
          <li>
            レポート本文は JavaScript で取得できるブラウザ情報をもとに、この画面内で生成しています。
          </li>
          <li>ブラウザやOSの仕様により、実際の環境と異なる情報が表示される場合があります。</li>
          <li>
            前回との差分は、このブラウザの localStorage に保存された情報と比較して表示します。
          </li>
        </ul>
      </section>

      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="about-title"
      >
        <div class="mb-5.5">
          <p class="m-0 mb-1 text-xs font-black text-teal-700 md:text-sm">About this tool</p>
          <h2 id="about-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            このブラウザチェックツールで確認できること
          </h2>
        </div>
        <div class="space-y-4 text-sm leading-7 text-[#334e68] md:text-base md:leading-8">
          <p class="m-0">
            ブラウザ情報・画面サイズチェックは、不具合問い合わせやサポート対応で必要になる利用環境をすばやく共有するための無料ツールです。
            Chrome、Edge、Safari、Firefox
            などのブラウザ名やバージョン、OS、ユーザーエージェント、画面サイズ、ウィンドウサイズを問い合わせ用レポートとしてまとめられます。
          </p>
          <p class="m-0">
            レポートはメール、チャット、問い合わせフォームにそのまま貼り付けられます。前回保存された環境との差分も表示できるため、ブラウザ変更や画面サイズ変更などに気づきやすくなります。
          </p>
          <p class="m-0">
            レポート生成と差分表示はブラウザ内で完結します。サーバーへのレポート送信やデータベース保存は行いません。
          </p>
          <p class="m-0">
            サポート担当者へ環境情報を伝えるとき、利用者が自分でブラウザ名やOSを調べる必要はありません。
            このページを開いてレポートをコピーするだけで、問い合わせフォームやチャットに貼り付けやすい形式で共有できます。
          </p>
        </div>
      </section>

      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="usage-title"
      >
        <div class="mb-5.5">
          <p class="m-0 mb-1 text-xs font-black text-teal-700 md:text-sm">How to use</p>
          <h2 id="usage-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            問い合わせでの使い方
          </h2>
        </div>
        <div class="space-y-4 text-sm leading-7 text-[#334e68] md:text-base md:leading-8">
          <p class="m-0">
            Webサイトやアプリで不具合が起きたときは、発生した画面のURL、ブラウザ、OS、画面サイズ、発生時刻を一緒に伝えると原因を切り分けやすくなります。
            本ツールでは、それらの情報を問い合わせ用レポートとしてまとめてコピーできます。
          </p>
          <p class="m-0">
            コピーしたレポートには、問題の内容、期待した動作、実際の動作、再現手順を書き足せる欄も含まれます。
            画面のスクリーンショットとあわせて送ることで、サポート担当者が利用環境を把握しやすくなります。
          </p>
        </div>
      </section>

      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="scene-title"
      >
        <div class="mb-5.5">
          <p class="m-0 mb-1 text-xs font-black text-teal-700 md:text-sm">Use cases</p>
          <h2 id="scene-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            ブラウザ情報が必要になる場面
          </h2>
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article class="rounded-lg border border-slate-300 bg-white p-4">
            <h3 class="m-0 text-base font-black text-[#102a43]">表示崩れの調査</h3>
            <p class="mt-2 mb-0 text-sm leading-7 text-[#334e68] md:text-base">
              画面幅、画面高さ、デバイスピクセル比を共有すると、PC、スマートフォン、タブレットごとの表示差を確認しやすくなります。
            </p>
          </article>
          <article class="rounded-lg border border-slate-300 bg-white p-4">
            <h3 class="m-0 text-base font-black text-[#102a43]">ブラウザ依存の不具合</h3>
            <p class="mt-2 mb-0 text-sm leading-7 text-[#334e68] md:text-base">
              Chrome、Safari、Edge、Firefox
              などの種類とバージョンを伝えることで、特定ブラウザだけで起きる問題を切り分けられます。
            </p>
          </article>
          <article class="rounded-lg border border-slate-300 bg-white p-4">
            <h3 class="m-0 text-base font-black text-[#102a43]">問い合わせ対応の効率化</h3>
            <p class="mt-2 mb-0 text-sm leading-7 text-[#334e68] md:text-base">
              利用者が環境情報を自分で調べる手間を減らし、サポート担当者へ同じ形式のレポートを送れます。
            </p>
          </article>
        </div>
      </section>

      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="items-title"
      >
        <div class="mb-5.5">
          <p class="m-0 mb-1 text-xs font-black text-teal-700 md:text-sm">Report items</p>
          <h2 id="items-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            レポートに含まれる主な項目
          </h2>
        </div>
        <ul
          class="m-0 list-disc space-y-1 pl-5 text-sm leading-7 text-[#334e68] md:text-base md:leading-8"
        >
          <li>ブラウザ名、ブラウザバージョン、OS、OSバージョン</li>
          <li>現在のURL、発生時刻、言語、タイムゾーン</li>
          <li>ウィンドウサイズ、画面サイズ、デバイスピクセル比</li>
          <li>ユーザーエージェント、User-Agent Client Hints、端末種別</li>
        </ul>
      </section>

      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="method-title"
      >
        <div class="mb-5">
          <p class="m-0 mb-1 text-xs font-black text-teal-700 md:text-sm">Method and reliability</p>
          <h2 id="method-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            取得方法と信頼性
          </h2>
        </div>
        <dl class="grid gap-4 md:grid-cols-2">
          <div class="rounded-lg border border-slate-200 p-4">
            <dt class="font-black text-[#102a43]">
              画面・Viewport情報
              <span class="ml-2 rounded bg-teal-50 px-2 py-1 text-xs text-teal-800">直接取得</span>
            </dt>
            <dd class="mt-2 ml-0 text-sm leading-7 text-[#334e68]">
              window.innerWidth、window.innerHeight、window.screen、devicePixelRatioから取得します。
            </dd>
          </div>
          <div class="rounded-lg border border-slate-200 p-4">
            <dt class="font-black text-[#102a43]">
              ブラウザ・OS
              <span class="ml-2 rounded bg-amber-50 px-2 py-1 text-xs text-amber-800">推定</span>
            </dt>
            <dd class="mt-2 ml-0 text-sm leading-7 text-[#334e68]">
              User-Agentと利用可能なClient
              Hintsから判定します。偽装や情報削減により一致しない場合があります。
            </dd>
          </div>
        </dl>
        <p class="mt-4 mb-0 text-sm leading-7 text-[#334e68]">
          判定できない値は「不明」と表示します。Web APIの詳細は
          <a
            class="font-bold text-teal-700 underline underline-offset-4"
            href="https://developer.mozilla.org/ja/docs/Web/API/Window/innerWidth"
            target="_blank"
            rel="noopener noreferrer"
            >MDN Web Docs</a
          >
          を参照してください。
        </p>
      </section>

      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="faq-title"
      >
        <div class="mb-5.5">
          <p class="m-0 mb-1 text-xs font-black text-teal-700 md:text-sm">FAQ</p>
          <h2 id="faq-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
            よくある質問
          </h2>
        </div>
        <div class="space-y-4">
          <article>
            <h3 class="m-0 text-base font-black text-[#102a43]">
              問い合わせ用レポートには何が含まれますか？
            </h3>
            <p class="mt-2 mb-0 text-sm leading-7 text-[#334e68] md:text-base md:leading-8">
              発生時刻、現在のURL、ブラウザ名とバージョン、OS、端末種別、画面サイズ、ウィンドウサイズ、言語、タイムゾーン、ユーザーエージェントなどが含まれます。
            </p>
          </article>
          <article>
            <h3 class="m-0 text-base font-black text-[#102a43]">
              前回との差分はどこに保存されますか？
            </h3>
            <p class="mt-2 mb-0 text-sm leading-7 text-[#334e68] md:text-base md:leading-8">
              差分比較に使う前回の環境情報は、このブラウザの localStorage
              に保存されます。別の端末や別のブラウザには引き継がれません。
            </p>
          </article>
          <article>
            <h3 class="m-0 text-base font-black text-[#102a43]">
              確認した情報はサイト側に送信されますか？
            </h3>
            <p class="mt-2 mb-0 text-sm leading-7 text-[#334e68] md:text-base md:leading-8">
              アクセス解析のために基本的な閲覧情報を取得する場合があります。ただし、このページで生成した問い合わせ用レポートや前回との差分を、サイト側で保存・管理する機能はありません。
            </p>
          </article>
          <article>
            <h3 class="m-0 text-base font-black text-[#102a43]">
              画面サイズとウィンドウサイズは何が違いますか？
            </h3>
            <p class="mt-2 mb-0 text-sm leading-7 text-[#334e68] md:text-base md:leading-8">
              画面サイズは端末ディスプレイ全体の大きさで、ウィンドウサイズはブラウザでページを表示している領域の大きさです。表示崩れの確認では両方が手がかりになります。
            </p>
          </article>
          <article>
            <h3 class="m-0 text-base font-black text-[#102a43]">
              問い合わせ時に何を追加で書けばよいですか？
            </h3>
            <p class="mt-2 mb-0 text-sm leading-7 text-[#334e68] md:text-base md:leading-8">
              コピーしたレポートに、発生した問題、期待した動作、実際の動作、再現手順、スクリーンショットを添えると、調査に必要な情報がそろいやすくなります。
            </p>
          </article>
        </div>
      </section>
      <RelatedTools :items="relatedTools" />
    </div>
  </main>
</template>

<script setup lang="ts">
const {
  browserInfo,
  windowSize,
  screenSize,
  screenAvailSize,
  deviceTypeLabel,
  copyStatus,
  previousSnapshot,
  browserInfoItems,
  supportReport,
  diffItems,
  displayValue,
  displayNumber,
  formatSize,
  copySupportReport,
} = useBrowserChecker()

const siteUrl = 'https://web-dev-toolbox.web.app/tools/browser-checker/'
const siteName = 'ブラウザ情報確認ツール'
const seoTitle = 'ブラウザ情報確認ツール｜OS・画面サイズ・User-Agentを確認'
const siteDescription =
  '現在使用しているブラウザ、OS、User-Agent、画面サイズ、Viewport、Device Pixel Ratioなどの環境情報をブラウザ上で確認できます。'
const relatedTools = [
  {
    to: '/tools/timestamp-converter/',
    title: 'Unixタイムスタンプ変換',
    reason: 'レポートに含まれる発生時刻を別形式で確認する',
  },
  {
    to: '/tools/json-formatter/',
    title: 'JSON整形・構文チェック',
    reason: 'ブラウザ情報をJSON形式で整理して共有する',
  },
]

useSeoMeta({
  title: seoTitle,
  description: siteDescription,
  ogTitle: siteName,
  ogDescription: siteDescription,
  ogUrl: siteUrl,
  ogType: 'website',
  twitterCard: 'summary',
  ogImage: 'https://web-dev-toolbox.web.app/favicon.svg',
})

useHead({
  link: [{ rel: 'canonical', href: siteUrl }],
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
        alternateName: ['ブラウザチェック', '環境診断レポート作成ツール'],
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
        description: siteDescription,
        inLanguage: 'ja',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'JPY',
          availability: 'https://schema.org/InStock',
        },
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '問い合わせ用レポートには何が含まれますか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '発生時刻、現在のURL、ブラウザ名とバージョン、OS、端末種別、画面サイズ、ウィンドウサイズ、言語、タイムゾーン、ユーザーエージェントなどが含まれます。',
            },
          },
          {
            '@type': 'Question',
            name: '前回との差分はどこに保存されますか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '差分比較に使う前回の環境情報は、このブラウザの localStorage に保存されます。別の端末や別のブラウザには引き継がれません。',
            },
          },
          {
            '@type': 'Question',
            name: '確認した情報はサイト側に送信されますか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'アクセス解析のために基本的な閲覧情報を取得する場合があります。ただし、このページで生成した問い合わせ用レポートや前回との差分を、サイト側で保存・管理する機能はありません。',
            },
          },
          {
            '@type': 'Question',
            name: '画面サイズとウィンドウサイズは何が違いますか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '画面サイズは端末ディスプレイ全体の大きさで、ウィンドウサイズはブラウザでページを表示している領域の大きさです。表示崩れの確認では両方が手がかりになります。',
            },
          },
          {
            '@type': 'Question',
            name: '問い合わせ時に何を追加で書けばよいですか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'コピーしたレポートに、発生した問題、期待した動作、実際の動作、再現手順、スクリーンショットを添えると、調査に必要な情報がそろいやすくなります。',
            },
          },
        ],
      }),
    },
  ],
})
</script>
