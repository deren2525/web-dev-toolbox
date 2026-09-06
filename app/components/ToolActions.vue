<template>
  <div class="flex flex-wrap gap-2">
    <button
      type="button"
      class="min-h-11 rounded-md bg-teal-700 px-5 py-2 text-sm font-black text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="props.disabled"
      @click="$emit('primary')"
    >
      {{ props.primary }}</button
    ><button
      v-if="props.secondary"
      type="button"
      class="min-h-11 rounded-md border border-teal-700 bg-white px-5 py-2 text-sm font-black text-teal-700 transition hover:bg-teal-50"
      @click="$emit('secondary')"
    >
      {{ props.secondary }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ primary: string; secondary?: string; disabled?: boolean }>()
defineEmits<{ primary: []; secondary: [] }>()
</script>
