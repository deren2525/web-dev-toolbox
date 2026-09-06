<script setup lang="ts">
useSeoMeta({
  title: '404 | Web Dev Toolbox',
  description: 'お探しのページが見つかりませんでした。',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <main class="mx-auto min-h-[60vh] w-full max-w-6xl px-4 py-16 sm:px-6">
    <section class="py-12 text-center" aria-labelledby="error-title">
      <p class="text-sm font-black tracking-widest text-teal-700 uppercase">Error 404</p>
      <h1 id="error-title" class="mt-3 text-3xl font-black text-[#102a43] md:text-4xl">
        ページが見つかりません
      </h1>
      <p class="mx-auto mt-5 max-w-xl leading-8 text-[#334e68]">
        URLが変更されたか、ページが削除された可能性があります。
      </p>
      <NuxtLink
        to="/"
        class="mt-8 inline-flex min-h-11 items-center rounded-md bg-teal-700 px-6 font-black text-white hover:bg-teal-800"
      >
        ホームへ戻る
      </NuxtLink>
    </section>
  </main>
</template>
