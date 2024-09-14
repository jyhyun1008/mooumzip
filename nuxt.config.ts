// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  runtimeConfig: {
    siteUrl: '',
    privateKeyId: '',
    privateKey: '',
    clientEmail: '',
    clientId: '',
    public: {
      spreadsheet: '',
    }
  },

  modules: ['@nuxtjs/mdc', 'nuxt-socket-io'],
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  app: {
    head: {
      title: "Roominous",
      link: [{ rel: 'stylesheet', href: 'https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css' }],
      script: [
        { src: 'https://cdn.socket.io/4.7.5/socket.io.min.js', defer: true },
        { src: '/js/index.js', defer: true },
        ],
    }
  },

})
