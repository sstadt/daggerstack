module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
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
  },
  variants: {
    extend: {},
  },
  plugins: [],
}