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
        'bg': "url('/img/bg1.png')",
      },
      colors: {
        'dark-gray': '#222831',
        'light-gray': '#393E46',
        'red': '#EB5353',
        'blue': '#43D8C9',

    },
    keyframes: {
      right: {
        '50%': { transform: 'translateY(220%)' },
      },
      left: {
        '50%': { transform: 'translateY(-220%)' },
      },
      ball : {
        // '0, 100%': {transform: 'translate(0%)'},
        '50%': {transform: 'translateY(200%) translateX(200%) '},

        // '75%': {transform: 'translateY(50%) translateX(50%)'}
        // '55%': { transform: 'translateX(50%)'},
      }
    },
    animation: {
      'right-rocekt': 'right 10s linear infinite',
      'left-rocekt': 'left 10s linear infinite',
      'ball': 'ball 8s linear infinite',
    },
  },
  plugins: [],
  }
}