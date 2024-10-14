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
    url: 'http://localhost:3002',
    github: {
      token: '',
      // OAuth client
      clientId: '',
      clientSecret: ''
    }
  }
})
