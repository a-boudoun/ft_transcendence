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
      },
      colors:{
        'dark-gray': '#384259',
        'light-gray': '#5B6375',
        'red': '#FF2763',
        'blue': '#7AC7C4', 
    },
  },
  plugins: [],
  }
}