import tailwindcss from '@tailwindcss/vite'

const siteUrl = 'https://web-dev-toolbox.web.app'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  app: {
    head: {
      htmlAttrs: { lang: 'ja' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#0f766e' },
        { name: 'google-adsense-account', content: 'ca-pub-6696928840569927' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/404/',
        '/tools/',
        '/tools/browser-checker/',
        '/tools/dummy-image-generator/',
        '/tools/json-formatter/',
        '/tools/base64/',
        '/tools/url-encoder/',
        '/tools/timestamp-converter/',
        '/tools/uuid-generator/',
        '/tools/jwt-decoder/',
        '/tools/hash-generator/',
        '/tools/text-counter/',
        '/about/',
        '/about-data/',
        '/privacy/',
      ],
    },
  },
  runtimeConfig: { public: { siteUrl } },
  typescript: { typeCheck: true },
})
