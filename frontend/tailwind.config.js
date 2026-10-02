/** @type {import('tailwindcss').Config} */
export default {
  content: { relative: true, files: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'] },
  theme: {
    extend: {
      colors: {
        forest: { 50: '#f2f7f2', 100: '#e5eee6', 200: '#cbdccc', 500: '#52795d', 700: '#285440', 800: '#174b38', 900: '#103d32' },
        lime: { 100: '#eaf0df', 300: '#c4da84' },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      boxShadow: { drawer: '-15px 0 50px rgb(23 59 45 / 8%)' },
    },
  },
  plugins: [],
}
