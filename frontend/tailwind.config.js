const colors = require('tailwindcss/colors')

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
      outline: ['focus'],
      boxShadow: {
        'none': 'none',
      }
    },
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
      doc: 'rgb(243, 237, 220)',
      black: 'rgb(0,0,0)',
      offwhite: '#F2EBE6',
      maroon_new: '#7D0000',
      inactive_gray: '#C6C6C6',
      gold: 'rgb(234 179 8)',
      pink: 'rgb(254 249 195)',
      login: 'rgb(161 98 7)',
      transparent: 'transparent',
      cream: '#FFFAF7',
      light_gray: '#EDEDED',
      gray: 'rgb(212 212 216)',
    },
    fontFamily: {
      lora: ['Lora', 'serif'],
      inter: ['Inter', 'serif'],
      profile: ['Inconsolata', 'serif']
    },
  },
  plugins: [],
}
