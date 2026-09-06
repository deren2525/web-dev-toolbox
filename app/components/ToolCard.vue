<template>
  <article class="flex flex-col rounded-lg border border-slate-300 bg-white p-5 md:p-7">
    <p class="m-0 text-xs font-black uppercase text-teal-700">{{ props.label }}</p>
    <h2 class="mt-2 mb-3 text-xl font-black text-[#102a43] md:text-2xl">{{ props.title }}</h2>
    <p class="m-0 grow text-sm leading-7 text-[#334e68] md:text-base">
      {{ props.description }}
    </p>
    <NuxtLink
      :to="props.to"
      class="mt-5 inline-flex min-h-11 items-center justify-center self-start rounded-md bg-teal-700 px-5 py-2.5 font-black text-white hover:bg-teal-800"
      >使ってみる<span class="ml-2" aria-hidden="true">→</span></NuxtLink
    >
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{ to: string; label: string; title: string; description: string }>()
</script>
