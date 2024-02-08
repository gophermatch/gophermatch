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
      boxShadow: {
        'text-field': '0 0px 10px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'text-field-selected': '0 0px 10px 0px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      dropShadow: {
        'button-hover': '0 0px 10px 0px rgba(0, 0, 0, 0.4)',
      },
      colors: {
      maroon: 'rgb(118, 45, 45)',
      red: 'rgb(255, 0, 0)',
      white: 'rgb(255, 255, 255)',
      offwhite: '#F2EBE6',
      maroon_new: '#7D0000',
      inactive_gray: '#C6C6C6',
      },
      fontFamily: {
        lora: ['Lora', 'serif'],
        inter: ['Inter', 'serif'],
      },
   },
  },
  plugins: [],
}
