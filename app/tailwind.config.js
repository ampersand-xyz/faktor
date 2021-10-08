module.exports = {
  purge: ['./src/ui/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      color: {
        orange: {
          500: '#FD833A'
        },
        gray: {
          100: '#EDEDED',
          900: '#1F1F1F'
        }
      }
    }
  },
  variants: {
    extend: {
      textColor: ['hover', 'disabled'],
      backgroundColor: ['disabled']
    }
  },
  plugins: []
};
