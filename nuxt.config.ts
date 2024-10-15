// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  pages: true,

  ssr: true,

  spaLoadingTemplate: false,

  devServer: {
    port: 3002
  },

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
      htmlAttrs: {
        lang: 'en'
      }
    }
  },

  css: ['/public/assets/css/myProject.webflow.css', '/public/assets/css/main.css'],

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', 'nuxt-icon', 'nuxt-time'],

  components: ['~/components'],

  runtimeConfig: {
    url: 'https://git-reveal.netlify.app',
    github: {
      token: process.env.NUXT_GITHUB_TOKEN,
      clientId: process.env.NUXT_GITHUB_CLIENT_ID,
      clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET
    }
  }
})
