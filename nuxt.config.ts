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
  },
  plugins: [
    '~/plugins/pinia-debounce',
    '~/plugins/vue3-touch-events',
    '~/plugins/vue3-mq',
  ],
  modules: [
    'nuxt-icons',
    'nuxt-swiper',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    [
      'nuxt-gtag',
      {
        id: 'G-ZMR94R58WX',
        initCommands: [
          // Setup up consent mode
          ['consent', 'default', {
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            ad_storage: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500,
          }]
        ],
      },
    ],
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
});
