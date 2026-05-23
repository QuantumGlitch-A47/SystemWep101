/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#050505',
          900: '#121212',
          850: '#1a1a1a',
          800: '#262626',
          700: '#3a3a3a',
          600: '#525252',
          500: '#737373',
          400: '#a1a1aa',
          300: '#d4d4d8',
          200: '#e4e4e7',
          100: '#f5f5f5',
        },
        accent: {
          500: '#3b82f6',
          600: '#2563eb',
        }
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      }
    },
  },
  plugins: [],
};
