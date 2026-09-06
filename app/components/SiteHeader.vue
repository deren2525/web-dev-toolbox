<template>
  <header class="border-b border-slate-200 bg-white px-3 sm:px-4">
    <div class="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-5">
      <NuxtLink to="/" class="text-base font-black text-[#102a43] no-underline sm:text-lg">
        Web Dev Toolbox
      </NuxtLink>
      <nav aria-label="メインナビゲーション">
        <ul
          class="m-0 flex list-none items-center gap-3 p-0 text-sm font-bold text-slate-600 sm:gap-6"
        >
          <li><NuxtLink class="hover:text-teal-700" to="/tools/">ツール</NuxtLink></li>
          <li><NuxtLink class="hover:text-teal-700" to="/about/">このサイトについて</NuxtLink></li>
        </ul>
      </nav>
    </div>
  </header>
</template>
