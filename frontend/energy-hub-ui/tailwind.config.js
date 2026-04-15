/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
        brand: [
          'Sora',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        // Compat com templates existentes (antes "display")
        display: [
          'Sora',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-display-lg': {
          fontSize: '3rem',
          lineHeight: '1.15',
          fontWeight: '600',
          letterSpacing: '-0.02em',
        },
        '.text-display-md': {
          fontSize: '2.25rem',
          lineHeight: '1.15',
          fontWeight: '600',
          letterSpacing: '-0.02em',
        },
        '.text-display-sm': {
          fontSize: '1.875rem',
          lineHeight: '1.2',
          fontWeight: '600',
          letterSpacing: '-0.01em',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};