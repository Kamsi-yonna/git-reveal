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
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css'
        }
      ],
      htmlAttrs: {
        lang: 'en'
      }
    }
  },

  css: ['/public/assets/css/myProject.webflow.css', '/public/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', 'nuxt-icon', 'nuxt-time'],
  components: ['~/components'],

  runtimeConfig: {
    redirectUri: process.env.NUXT_REDIRECT_URI,
    github: {
      token: process.env.NUXT_GITHUB_TOKEN,
      clientId: process.env.NUXT_GITHUB_CLIENT_ID,
      clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET
    }
  }
})
