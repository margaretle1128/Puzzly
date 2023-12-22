/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'app': ['Indie Flower', 'sans-serif'],
        'logo': ['Modak']
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to top, #adc1e2, #8f6be2)',
      },
      minWidth: {
        '64rem': '64rem',
      },
    },
  },
  plugins: [],
}

