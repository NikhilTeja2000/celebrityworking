/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'luckiest': ['Luckiest Guy', 'cursive'],
      },
      colors: {
        'krico-lime': '#b6f41b',
        'krico-navy': '#00153a',
        'krico-beige': '#f7f3e7',
      },
      backgroundImage: {
        'krico-gradient': 'linear-gradient(135deg, #22c55e 0%, #ef4444 50%, #eab308 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};