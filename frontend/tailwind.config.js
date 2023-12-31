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
      height: {
        '44rem': '44rem',
      },
      transitionProperty: {
        'position': 'top, right, bottom, left',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.scrollbar-w-2': {
          scrollbarWidth: 'thin',
        },
        '.scrollbar-track-gray-200': {
          'scrollbar-color': 'gray-200',
        },
        '.scrollbar-thumb-rounded': {
          'scrollbar-color': 'rounded',
        },
        '.scrollbar-thumb-gray-400': {
          'scrollbar-color': 'gray-400',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    }
  ],
}

