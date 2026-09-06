<template>
  <section
    v-if="props.items.length"
    class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
    aria-labelledby="related-tools-title"
  >
    <h2 id="related-tools-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
      関連ツール
    </h2>
    <div class="mt-5 grid gap-3 md:grid-cols-2">
      <NuxtLink
        v-for="item in props.items"
        :key="item.to"
        :to="item.to"
        class="group rounded-lg border border-slate-200 p-4 no-underline transition hover:border-teal-600 hover:bg-teal-50/40"
      >
        <strong class="block text-base font-black text-[#102a43] group-hover:text-teal-800"
          >{{ item.title }} <span aria-hidden="true">→</span></strong
        >
        <span class="mt-1 block text-sm leading-6 text-slate-600">{{ item.reason }}</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ items: { to: string; title: string; reason: string }[] }>()
</script>
