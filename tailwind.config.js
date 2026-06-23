/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        kairos: {
          black: "#05050A",
          card: "#11131D",
          gold: "#D6A84F",
          goldLight: "#FFD76A",
          purple: "#7C5CFF",
          blue: "#4CC9F0",
          white: "#F5F7FA",
          muted: "#A6A8B3",
        },
      },
    },
  },
  plugins: [],
};