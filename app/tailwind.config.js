/* eslint-disable @typescript-eslint/no-var-requires */
const defaultColors = require('tailwindcss/colors');
const defaultSpacing = require('tailwindcss/colors');
module.exports = {
  important: true,
  purge: [
    './src/ui/**/*.{js,jsx,ts,tsx}',
    './src/ui/**/**/*.{js,jsx,ts,tsx}',
    './src/ui/**/**/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      ...defaultColors,
      orange: {
        ...defaultColors.orange,
        500: '#FD833A'
      },
      gray: {
        ...defaultColors.gray,
        100: '#EDEDED',
        800: '#292929',
        900: '#1F1F1F'
      },
      indigo: {
        ...defaultColors.indigo,
        600: '#3D52D5'
      },
      spacing: {
        ...defaultSpacing,
        card: '24rem'
      }
    },
    extend: {
      minWidth: {
        card: '24rem'
      },
      width: {
        card: '24rem'
      }
    }
  },
  variants: {
    extend: {
      textColor: ['hover', 'disabled'],
      backgroundColor: ['disabled', 'hover'],
      backgroundOpacity: ['disabled', 'hover'],
      textOpacity: ['disabled'],
      cursor: ['disabled']
    }
  },
  plugins: []
};
