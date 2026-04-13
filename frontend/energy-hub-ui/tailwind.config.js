/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-display-lg': {
          fontSize: '3rem',
          lineHeight: '1.2',
          fontWeight: '700',
          fontFamily: '"Space Grotesk", sans-serif',
        },
        '.text-display-md': {
          fontSize: '2.25rem',
          lineHeight: '1.2',
          fontWeight: '700',
          fontFamily: '"Space Grotesk", sans-serif',
        },
        '.text-display-sm': {
          fontSize: '1.875rem',
          lineHeight: '1.3',
          fontWeight: '600',
          fontFamily: '"Space Grotesk", sans-serif',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};