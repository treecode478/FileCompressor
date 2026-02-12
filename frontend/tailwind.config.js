/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3faf4',
          100: '#def4e3',
          200: '#bce9c8',
          300: '#8ed7a4',
          400: '#4eb96f',
          500: '#2e9d53',
          600: '#1f7d40',
          700: '#195f33',
          800: '#154a2b',
          900: '#123c24'
        }
      }
    }
  },
  plugins: []
};

