/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
const plugin = require("tailwindcss/plugin");

module.exports = withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },

    extend: {
      gridTemplateColumns: {
        16: "repeat(16, minmax(0, 1fr))",
      },

      backgroundImage: {},

      fontFamily: {
        lato: ["var(--font-lato)"],
        sans: ["var(--font-lato)"],
        italiana: ["var(--font-italiana)"],
      },

      colors: {
        "dark-tertiary": "#262626",
        secondary: "var(--secondary)",
        primary: "var(--primary)",
        background: "var(--background)",
      },

      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },

  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {};

      addUtilities(newUtilities);
    }),
  ],
});
