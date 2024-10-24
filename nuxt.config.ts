// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    pageTransition: {
      name: 'fade',
      mode: 'out-in',
    },
  },

  supabase: {
    redirect: false,
    url: 'https://biftneoctpqfefxgelcv.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZnRuZW9jdHBxZmVmeGdlbGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwNzAzMzAsImV4cCI6MjAzNDY0NjMzMH0.w1kyOcbuQodwHb7tncNbJaLEGPLRs3rwELcYWQH1cq0',
  },

  plugins: [
    '~/plugins/gtag',
    '~/plugins/pinia-debounce',
    '~/plugins/vue3-touch-events',
    '~/plugins/vue3-mq',
  ],

  ignore: [
    process.env.ENVIROMENT === 'production' ? 'pages/dev' : '',
  ],

  modules: [
    'nuxt-icons',
    'nuxt-swiper',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Ubuntu: {
            wght: [300, 400, 500, 700],
            ital: [300, 400, 500, 700],
          },
          'Cinzel Decorative': {
            wght: [900]
          },
        },
      },
    ],
  ],

  compatibilityDate: '2024-08-20',
});