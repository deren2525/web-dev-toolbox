<template>
  <footer class="mt-10 border-t border-slate-200 bg-white px-3 py-8 text-sm text-slate-600 sm:px-4">
    <div
      class="mx-auto flex w-full max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <nav aria-label="フッターナビゲーション">
        <ul class="m-0 flex flex-wrap list-none gap-x-5 gap-y-2 p-0 font-bold">
          <li><NuxtLink class="hover:text-teal-700" to="/tools/">ツール一覧</NuxtLink></li>
          <li><NuxtLink class="hover:text-teal-700" to="/about/">About</NuxtLink></li>
          <li><NuxtLink class="hover:text-teal-700" to="/about-data/">データについて</NuxtLink></li>
          <li><NuxtLink class="hover:text-teal-700" to="/privacy/">Privacy Policy</NuxtLink></li>
        </ul>
      </nav>
      <small>© 2026 Web Dev Toolbox</small>
    </div>
  </footer>
</template>
