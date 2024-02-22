/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/index.html",
    "./src/App.jsx",
    "./src/components/*.jsx",
    "./src/components/**/**.jsx"
  ],
  theme: {
    extend: {
      colors: {
        maroon: 'rgb(118, 45, 45)',
        red: 'rgb(255, 0, 0)',
        white: 'rgb(255, 255, 255)',
        doc: 'rgb(243, 237, 220)',
      },
      fontFamily: {
        lora: ['Lora', 'serif'],
      }
    },
  },
  variants: {
    extend: {
      outline: ['focus'],
      boxShadow: {
        'none': 'none',
      }
    },
  },
  plugins: [],
}
