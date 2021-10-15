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
        600: "#3D52D5",
      },
    },
    extend: {
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
      textOpacity: ["disabled"],
      cursor: ["disabled"],
      opacity: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
