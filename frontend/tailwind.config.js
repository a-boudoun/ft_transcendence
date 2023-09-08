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
        'bg': "url('/img/bg.jpg')",
      },
      colors: {
        'dark-gray': '#2F3B58',
        'light-gray': '#384259',
        'red': '#EA5581',
        'blue': '#7AC7C4',

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