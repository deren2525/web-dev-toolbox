<template>
  <main class="px-3 py-5 sm:px-4 sm:py-8">
    <article class="mx-auto w-full max-w-6xl">
      <SiteBreadcrumbs :current="props.title" />
      <div class="rounded-lg border border-slate-300 bg-white p-5 md:p-8">
        <header class="mb-8">
          <p class="m-0 mb-2 text-sm font-black text-teal-700">{{ props.eyebrow }}</p>
          <h1 class="m-0 text-2xl font-black text-[#102a43] md:text-3xl">{{ props.title }}</h1>
        </header>
        <div class="content"><slot /></div>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
const props = defineProps<{ eyebrow: string; title: string }>()
</script>

<style scoped>
.content {
  color: #334e68;
  font-size: 0.875rem;
  line-height: 1.75rem;
}
.content :deep(h2) {
  margin: 2rem 0 0.5rem;
  color: #102a43;
  font-size: 1.125rem;
  font-weight: 900;
}
.content :deep(p) {
  margin: 1rem 0 0;
}
.content :deep(ul) {
  margin: 1rem 0 0;
  padding-left: 1.25rem;
}
.content :deep(li + li) {
  margin-top: 0.5rem;
}
.content :deep(a) {
  color: #0f766e;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
}
@media (min-width: 768px) {
  .content {
    font-size: 1rem;
    line-height: 2rem;
  }
  .content :deep(h2) {
    font-size: 1.25rem;
  }
}
</style>
