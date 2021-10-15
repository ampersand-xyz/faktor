/* eslint-disable @typescript-eslint/no-var-requires */
const defaultColors = require("tailwindcss/colors");
module.exports = {
  important: true,
  purge: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      ...defaultColors,
      orange: {
        ...defaultColors.orange,
        500: "#FD833A",
      },
      gray: {
        ...defaultColors.gray,
        100: "#EDEDED",
        800: "#292929",
        900: "#1F1F1F",
      },
      indigo: {
        ...defaultColors.indigo,
        600: "#3733FF",
      },
    },
    extend: {
      backgroundColor: {
        lightest: '#E5E5E5'
      },
      minWidth: {
        card: "32rem",
      },
      width: {
        card: "32rem",
      },
      height: {
        card: "28rem",
      },
    },
  },
  variants: {
    extend: {
      textColor: ["hover", "disabled"],
      backgroundColor: ["disabled", "hover"],
      backgroundOpacity: ["disabled", "hover"],
      backgroundImage: ["disabled"],
      textOpacity: ["disabled"],
      cursor: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
