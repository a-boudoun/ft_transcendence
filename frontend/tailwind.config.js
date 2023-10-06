/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'ping-pong': "url('/img/ping-pong.gif')",
        'bg': "url('/img/bg.webp')",
      },
      colors: {
        'dark-gray': '#2F3B58',
        'light-gray': '#384259',
        'red': '#EA5581',
        'blue': '#7AC7C4',

    },
  },
  plugins: [
      require('tailwind-scrollbar'),
  ],
  }
}