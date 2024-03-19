module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  darkMode: true, // or 'media' or 'class'
  theme: {
    extend: {},
    container: {
      center: true,
      padding: {
        DEFAULT: '10px',
        md: '20px',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}