/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'app': ['Indie Flower', 'sans-serif'],
        'logo': ['Leckerli One']
      },
      backgroundImage: {
        'daisy': "url('/src/assets/images/daisy.jpg')",
      },
      minWidth: {
        '64rem': '64rem',
      },
      colors: {
        'modal': '#c2bcf8',
      },
    },
  },
  plugins: [],
}

