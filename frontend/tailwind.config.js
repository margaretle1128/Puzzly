/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'app': ['Indie Flower', 'sans-serif'],
        'number': ['Lemon'],
        'timer': ['Quicksand'],
      },
      backgroundImage: {
        'daisy': "url('/src/assets/images/daisy.jpg')",
      },
      minWidth: {
        '64rem': '64rem',
      },
      colors: {
        'modal': '#c2bcf8',
        'tile': '#b0d8da',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    }
  ],
}

