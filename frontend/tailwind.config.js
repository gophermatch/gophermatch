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
      maroon: '#7D0000',
      blood: '#470000',
      maroon_transparent: 'rgba(118, 45, 45, 0.83)',
      maroon_transparent2: 'rgba(118, 45, 45, 0.18)',
      offgold: '#DDB16F',
      red: 'rgb(255, 0, 0)',
      settings: '#9F0000',
      white: 'rgb(255, 255, 255)',
      newwhite: 'rgb(175, 175, 175)',
      dark_maroon: '#5E0000',
      doc: 'rgb(232, 232, 223)',
      black: 'rgb(0,0,0)',
      offwhite: '#F2EBE6',
      maroon_new: '#7D0000',
      maroon_dark: '#5E0000',
      inactive_gray: '#C6C6C6',
      dark_inactive_gray: '#969696',
      gold: 'rgb(234 179 8)',
      pink: 'rgb(254 249 195)',
      login: 'rgb(161 98 7)',
      transparent: 'transparent',
      cream: '#FFFAF7',
      dark_cream: '#c4bdb9',
      light_gray: '#EDEDED',
      gray: 'rgb(212 212 216)',
      gray_text: 'rgb(31 41 55)',
      inset_gray: '#F0F0F0',
      sublease_border: '#9F9F9F'
    },
    fontFamily: {
      lora: ['Lora', 'serif'],
      inter: ['Inter', 'serif'],
      profile: ['Inconsolata', 'serif'],
      roboto: ['Roboto', 'serif'],
      roboto_slab: ['Roboto Slab', 'serif'],
      roboto_condensed: ['Roboto Condensed', 'serif']
    },
  },
  plugins: [],
}
