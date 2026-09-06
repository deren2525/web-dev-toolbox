<template>
  <main class="px-3 py-4 sm:px-4 sm:py-8">
    <article class="mx-auto w-full max-w-6xl">
      <SiteBreadcrumbs :current="props.title" tool-page />
      <header class="border-b border-teal-100 px-2 py-10 text-center md:px-8 md:py-14">
        <p class="m-0 text-sm font-black uppercase text-teal-700">{{ props.eyebrow }}</p>
        <h1 class="mt-2 mb-4 text-3xl leading-tight font-black text-[#102a43] md:text-4xl">
          {{ props.title }}
        </h1>
        <p class="mx-auto m-0 max-w-3xl text-base leading-8 text-[#334e68] md:text-lg">
          {{ props.description }}
        </p>
      </header>
      <section
        class="mt-4 rounded-lg border border-teal-700/30 bg-white p-4 md:p-7"
        aria-label="ツール本体"
      >
        <slot name="tool" />
      </section>
      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="features-title"
      >
        <h2 id="features-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
          このツールでできること
        </h2>
        <div class="info"><slot name="features" /></div>
      </section>
      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="usage-title"
      >
        <h2 id="usage-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">使い方</h2>
        <div class="info"><slot name="usage" /></div>
      </section>
      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="examples-title"
      >
        <h2 id="examples-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
          使用例と結果の見方
        </h2>
        <div class="info"><slot name="examples" /></div>
      </section>
      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="data-title"
      >
        <h2 id="data-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
          処理とデータについて
        </h2>
        <div class="info"><slot name="data" /></div>
      </section>
      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="references-title"
      >
        <h2 id="references-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
          参考情報
        </h2>
        <div class="info"><slot name="references" /></div>
      </section>
      <section
        class="mt-4 rounded-lg border border-slate-300 bg-white p-4 md:p-7"
        aria-labelledby="faq-title"
      >
        <h2 id="faq-title" class="m-0 text-xl font-black text-[#102a43] md:text-2xl">
          よくある質問
        </h2>
        <div class="info"><slot name="faq" /></div>
      </section>
      <RelatedTools :items="props.relatedTools || []" />
    </article>
  </main>
</template>

<script setup lang="ts">
const props = defineProps<{
  eyebrow: string
  title: string
  description: string
  relatedTools?: { to: string; title: string; reason: string }[]
}>()
</script>

<style scoped>
.info {
  color: #334e68;
  font-size: 0.875rem;
  line-height: 1.75rem;
}
.info :deep(p) {
  margin: 0.75rem 0 0;
}
.info :deep(h3) {
  margin: 1.25rem 0 0;
  color: #102a43;
  font-weight: 900;
}
.info :deep(ol),
.info :deep(ul) {
  margin: 0.75rem 0 0;
  padding-left: 1.25rem;
}
.info :deep(a) {
  color: #0f766e;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
}
@media (min-width: 768px) {
  .info {
    font-size: 1rem;
    line-height: 2rem;
  }
}
</style>
