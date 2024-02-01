/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/index.html",
    "./src/App.jsx",
    "./src/components/*.jsx",
    "./src/components/**/**.jsx"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
