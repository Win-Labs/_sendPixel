/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        spinCustom: "spinCustom 2s linear infinite",
      },
      keyframes: {
        spinCustom: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        fontFamily: {
          sans: ["Press Start 2P", "sans-serif"],
        },
      },
    },
    plugins: [],
  },
};
