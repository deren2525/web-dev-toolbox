<template>
  <div
    data-testid="generator-stats"
    class="mt-5 grid grid-cols-3 divide-x divide-slate-200 rounded-md border border-slate-300 bg-slate-50 py-3 text-center text-[#102a43]"
  >
    <div>
      <small class="block text-xs font-bold text-slate-500">サイズ</small>
      <b class="mt-1 block text-sm font-black">{{ props.width }} × {{ props.height }}</b>
    </div>
    <div>
      <small class="block text-xs font-bold text-slate-500">枚数</small>
      <b class="mt-1 block text-sm font-black">{{ props.count }} 枚</b>
    </div>
    <div>
      <small class="block text-xs font-bold text-slate-500">合計容量</small>
      <b class="mt-1 block text-sm font-black">{{ props.totalSize }}</b>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  width: number
  height: number
  count: number
  totalSize: string
}>()
</script>
