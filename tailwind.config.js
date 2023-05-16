/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans"],
        nunito: ["Nunito Sans", "sans"],
      },
      colors: {
        background: {
          dark: "#131316",
        },
        accent: "#e3b3ff",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
