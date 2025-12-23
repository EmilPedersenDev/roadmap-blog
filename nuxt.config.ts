// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  srcDir: 'client',
  supabase: {
    redirect: false, // Disable automatic redirect to login
  },
  // Static site generation (SSG)
  nitro: {
    prerender: {
      crawlLinks: true
    }
  }
})
