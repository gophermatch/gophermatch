/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./frontend/src/**/*.{html,js,jsx}"],
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
}