module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  safelist: [
    'text-blue-600', // weapon/armor tier 2
    'text-purple-700', // weapon/armor tier 3
    'text-orange-600', // weapon/armor tier 4
    'text-red-600', // alert
    'text-green-600', // alert
    'text-cyan-950', // alert
    'text-pink-800', // alert
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Arial', 'sans-serif'],
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '10px',
        md: '20px',
      },
    },
    transitionDuration: {
      DEFAULT: '300ms'
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}