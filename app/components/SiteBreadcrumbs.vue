<template>
  <nav class="mb-4 text-sm text-slate-500" aria-label="パンくずリスト">
    <ol class="m-0 flex list-none flex-wrap items-center gap-2 p-0">
      <li><NuxtLink class="font-bold text-teal-700 hover:underline" to="/">ホーム</NuxtLink></li>
      <li aria-hidden="true">/</li>
      <li v-if="props.toolPage">
        <NuxtLink class="font-bold text-teal-700 hover:underline" to="/tools/">ツール一覧</NuxtLink>
      </li>
      <li v-if="props.toolPage" aria-hidden="true">/</li>
      <li class="text-slate-700" aria-current="page">{{ props.current }}</li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{ current: string; toolPage?: boolean }>()
</script>
