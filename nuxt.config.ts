// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  vite: {
    server: {
      hmr: {
        clientPort: 443,
        port:3000,
        protocol: "wss",
      },
    },
  },
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

  modules: ['@nuxtjs/mdc', 'nuxt-socket-io', '@pinia/nuxt'],
  imports: {
    dirs: ['./stores']
  },
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate']
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  app: {
    head: {
      link: [{ rel: 'stylesheet', href: 'https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css' }],
      meta: [
        { charset: "utf-8" },
        { "http-equiv": "Content-Security-Policy", content: "upgrade-insecure-requests" }, // 추가
      ],
      script: [
        { src: 'https://cdn.socket.io/4.7.5/socket.io.min.js', defer: true },
        { src: 'https://meet.jit.si/external_api.js', defer: true },
        { src: '/js/index.js', defer: true },
        { src: '/js/jitsi.js', defer: true },
      ],
    }
  },

})